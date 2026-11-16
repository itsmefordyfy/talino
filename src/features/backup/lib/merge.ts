import type { Backup, Tombstone } from './format';
import { BACKUP_TABLES, columnNames, isTombstoneTable, TABLE_NAMES, TOMBSTONE_TABLES, type CellValue, type Row, type TableName, type TableSpec } from './schema';

/**
 * How a backup's rows are merged into the rows already on the phone. Pure: rows in, a plan out (what to
 * insert, update, delete), so the same code decides a dry-run preview and the real restore, and tests
 * run it without a database. The rules, all with one aim (never lose progress, never bring back what was
 * deleted, never count twice):
 *   - progress rows keep the further-along state of the two (a completed lesson beats an open one, a
 *     passed project is never moved back), merged column by column where that is safe;
 *   - the learner's own records (applications, income, goals, résumé) are by id, the newer `updated_at`
 *     wins, and a tombstone at or after a row's last edit removes or blocks it;
 *   - nothing is ever given a newer `updated_at` than the data it came from, so merging the same backup
 *     twice changes nothing (idempotent).
 */

const num = (value: CellValue | undefined): number => (typeof value === 'number' ? value : 0);
const text = (value: CellValue | undefined): string | null => (typeof value === 'string' ? value : null);

/** The earlier of two optional timestamps (a missing one never wins). */
function earliest(a: CellValue | undefined, b: CellValue | undefined): string | null {
  const first = text(a);
  const second = text(b);
  if (first === null) return second;
  if (second === null) return first;
  return first <= second ? first : second;
}

function latest(a: CellValue | undefined, b: CellValue | undefined): string | null {
  const first = text(a);
  const second = text(b);
  if (first === null) return second;
  if (second === null) return first;
  return first >= second ? first : second;
}

/** The remote row only when it is strictly newer: a tie keeps this phone's row. */
const newerRow = (local: Row, remote: Row): Row => (String(remote.updated_at) > String(local.updated_at) ? remote : local);

function parseStrings(value: CellValue | undefined): string[] {
  if (typeof value !== 'string') return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

/** Completed beats open, then the better quiz result, then the newer edit. */
function mergeLesson(local: Row, remote: Row): Row {
  const ratio = (row: Row) => (num(row.quiz_total) > 0 && typeof row.quiz_correct === 'number' ? row.quiz_correct / num(row.quiz_total) : -1);
  const localDone = local.completed_at !== null;
  const remoteDone = remote.completed_at !== null;
  let ahead: Row;
  if (localDone !== remoteDone) ahead = remoteDone ? remote : local;
  else if (ratio(local) !== ratio(remote)) ahead = ratio(remote) > ratio(local) ? remote : local;
  else ahead = newerRow(local, remote);
  return {
    ...ahead,
    task_done: Math.max(num(local.task_done), num(remote.task_done)),
    completed_at: earliest(local.completed_at, remote.completed_at),
    created_at: earliest(local.created_at, remote.created_at),
    updated_at: latest(local.updated_at, remote.updated_at),
  };
}

const PROJECT_RANK: Record<string, number> = { open: 0, submitted: 1, needs_work: 2, passed: 3 };

/**
 * A project never moves back (passed > needs work > submitted > open); the steps done are the union.
 * The newer edit wins the learner's submission; the review (feedback, when it was given) goes with the
 * status that won, so a passed project keeps the feedback that passed it. `review_token` is not a column
 * here: a backup never carries one and a restore never touches this phone's.
 */
function mergeProject(local: Row, remote: Row): Row {
  const localRank = PROJECT_RANK[String(local.status)] ?? 0;
  const remoteRank = PROJECT_RANK[String(remote.status)] ?? 0;
  const winner = remoteRank > localRank ? remote : local;
  const newer = newerRow(local, remote);
  const reviewFrom = localRank === remoteRank ? newer : winner;
  const steps = [...new Set([...parseStrings(local.steps_done), ...parseStrings(remote.steps_done)])];
  return {
    ...local,
    status: winner.status,
    steps_done: JSON.stringify(steps),
    submission: newer.submission,
    feedback: reviewFrom.feedback,
    reviewed_at: reviewFrom.reviewed_at,
    created_at: earliest(local.created_at, remote.created_at),
    updated_at: latest(local.updated_at, remote.updated_at),
  };
}

function mergeDay(local: Row, remote: Row): Row {
  return { ...local, lessons: Math.max(num(local.lessons), num(remote.lessons)), created_at: earliest(local.created_at, remote.created_at) };
}

function mergeBadge(local: Row, remote: Row): Row {
  return { ...local, earned_at: earliest(local.earned_at, remote.earned_at), seen: Math.max(num(local.seen), num(remote.seen)) };
}

/** The verified certificate wins; otherwise the newer one. This phone's id stays (the course is the identity). */
function mergeCertificate(local: Row, remote: Row): Row {
  const localVerified = local.verify_id !== null;
  const remoteVerified = remote.verify_id !== null;
  const winner = localVerified !== remoteVerified ? (remoteVerified ? remote : local) : newerRow(local, remote);
  return { ...winner, id: local.id, created_at: earliest(local.created_at, remote.created_at), updated_at: latest(local.updated_at, remote.updated_at) };
}

/**
 * A solved activity beats an open one; between two solved, the earlier solve and its XP stay, so XP can
 * never grow by restoring (it is the same solve). Tries, wrong answers and hints keep the larger count.
 */
function mergeActivity(local: Row, remote: Row): Row {
  const localSolved = local.solved === 1;
  const remoteSolved = remote.solved === 1;
  let base: Row;
  if (localSolved !== remoteSolved) base = remoteSolved ? remote : local;
  else if (localSolved && remoteSolved) {
    const remoteFirst = typeof remote.solved_at === 'string' && (typeof local.solved_at !== 'string' || remote.solved_at < local.solved_at);
    base = remoteFirst ? remote : local;
  } else base = newerRow(local, remote);
  return {
    ...base,
    attempts: Math.max(num(local.attempts), num(remote.attempts)),
    wrong: Math.max(num(local.wrong), num(remote.wrong)),
    hints_used: Math.max(num(local.hints_used), num(remote.hints_used)),
    last_attempt_at: latest(local.last_attempt_at, remote.last_attempt_at),
    created_at: earliest(local.created_at, remote.created_at),
    updated_at: latest(local.updated_at, remote.updated_at),
  };
}

/** The finished welcome beats a half-done one (a fresh install may have started onboarding while the backup arrived); then the newer edit. */
function mergeLearnerProfile(local: Row, remote: Row): Row {
  if (local.status !== remote.status) return remote.status === 'completed' ? { ...remote, updated_at: latest(local.updated_at, remote.updated_at) } : local;
  return newerRow(local, remote);
}

const keepLocal = (local: Row): Row => local;

const MERGERS: Record<TableName, (local: Row, remote: Row) => Row> = {
  lesson_progress: mergeLesson,
  project_progress: mergeProject,
  learning_days: mergeDay,
  badges: mergeBadge,
  certificates: mergeCertificate,
  activity_progress: mergeActivity,
  challenge_attempts: keepLocal,
  applications: newerRow,
  income: newerRow,
  career_goals: newerRow,
  resume_profile: newerRow,
  resume_items: newerRow,
  resume_versions: newerRow,
  resume_documents: newerRow,
  portfolio_projects: newerRow,
  learner_profile: mergeLearnerProfile,
};

export type RowCounts = { newRows: number; updatedRows: number; keptLocal: number; unchanged: number; removedRows: number };
const emptyCounts = (): RowCounts => ({ newRows: 0, updatedRows: 0, keptLocal: 0, unchanged: 0, removedRows: 0 });

export type TablePlan = {
  inserts: Row[];
  /** `key` is this phone's primary key value for the row to change. */
  updates: { key: string; row: Row }[];
  deletes: string[];
  counts: RowCounts;
};

/** A certificate is one per course whatever its id; every other table is matched by its primary key. */
export const matchKeyOf = (spec: TableSpec, row: Row): string => String(spec.name === 'certificates' ? row.course_id : row[spec.key]);

const sameRow = (spec: TableSpec, a: Row, b: Row, ignore: readonly string[] = []) => columnNames(spec).every((column) => ignore.includes(column) || a[column] === b[column]);

/** A merge that only moves a timestamp (the later `updated_at` of two otherwise equal rows) is not worth a write. */
const TIMESTAMPS_ONLY = ['created_at', 'updated_at'] as const;

/** A tombstone map: row id → when it was deleted. */
export type TombstoneMap = Map<string, string>;

export type TablePlanInput = {
  spec: TableSpec;
  local: readonly Row[];
  remote: readonly Row[];
  /** What the backup says was deleted: blocks its rows and removes this phone's rows that were not edited since. */
  remoteTombstones: TombstoneMap;
  /** What this phone knows was deleted: only blocks the backup's rows. */
  localTombstones: TombstoneMap;
};

export function planTable({ spec, local, remote, remoteTombstones, localTombstones }: TablePlanInput): TablePlan {
  const plan: TablePlan = { inserts: [], updates: [], deletes: [], counts: emptyCounts() };
  const tombstoned = isTombstoneTable(spec.name);
  const merge = MERGERS[spec.name];
  const localByMatch = new Map(local.map((row) => [matchKeyOf(spec, row), row]));
  const remoteByMatch = new Map(remote.map((row) => [matchKeyOf(spec, row), row]));
  const localKeys = new Set(local.map((row) => String(row[spec.key])));

  const deletedAt = (row: Row) => {
    const id = String(row[spec.key]);
    const later = remoteTombstones.get(id) ?? '';
    const own = localTombstones.get(id) ?? '';
    const best = later > own ? later : own;
    return best === '' ? null : best;
  };
  const blocks = (row: Row) => {
    const at = tombstoned ? deletedAt(row) : null;
    return at !== null && at >= String(row.updated_at);
  };
  const removesLocal = (row: Row) => {
    const at = tombstoned ? remoteTombstones.get(String(row[spec.key])) : undefined;
    return at !== undefined && at >= String(row.updated_at);
  };

  for (const matchKey of new Set([...localByMatch.keys(), ...remoteByMatch.keys()])) {
    const here = localByMatch.get(matchKey);
    const there = remoteByMatch.get(matchKey);
    if (here && there) {
      const key = String(here[spec.key]);
      if (removesLocal(here)) {
        if (blocks(there)) {
          plan.deletes.push(key);
          plan.counts.removedRows += 1;
        } else {
          // Deleted elsewhere, then edited again after: the edit is newer than the deletion and wins.
          plan.updates.push({ key, row: { ...there, [spec.key]: here[spec.key] } });
          plan.counts.updatedRows += 1;
        }
      } else if (blocks(there)) {
        plan.counts.keptLocal += 1;
      } else {
        const merged = merge(here, there);
        if (sameRow(spec, merged, here, TIMESTAMPS_ONLY)) {
          if (sameRow(spec, there, here)) plan.counts.unchanged += 1;
          else plan.counts.keptLocal += 1;
        } else {
          plan.updates.push({ key, row: merged });
          plan.counts.updatedRows += 1;
        }
      }
    } else if (here) {
      // Only this phone has it: left alone, unless the backup says it was deleted after its last edit.
      if (removesLocal(here)) {
        plan.deletes.push(String(here[spec.key]));
        plan.counts.removedRows += 1;
      }
    } else if (there) {
      if (blocks(there)) plan.counts.keptLocal += 1;
      else if (localKeys.has(String(there[spec.key]))) plan.counts.keptLocal += 1;
      else {
        plan.inserts.push(there);
        plan.counts.newRows += 1;
      }
    }
  }
  return plan;
}

/** The rows a table has after its plan runs: id → `updated_at` (what a tombstone is compared with). */
function finalUpdatedAt(spec: TableSpec, local: readonly Row[], plan: TablePlan): Map<string, string> {
  const result = new Map<string, string>();
  const removed = new Set(plan.deletes);
  for (const row of local) if (!removed.has(String(row[spec.key]))) result.set(String(row[spec.key]), String(row.updated_at));
  for (const { key, row } of plan.updates) result.set(key, String(row.updated_at));
  for (const row of plan.inserts) result.set(String(row[spec.key]), String(row.updated_at));
  return result;
}

export type RestorePlan = {
  tables: Record<TableName, TablePlan>;
  /** Tombstones to write (the later of what the phone and the backup know). */
  tombstoneWrites: Tombstone[];
  /** Tombstones to forget: the row was edited after it was deleted, so the row stands. */
  tombstoneDrops: { table_name: string; row_id: string }[];
};

export type RestoreSummary = RowCounts & { byTable: Partial<Record<TableName, RowCounts>> };

function toMap(tombstones: readonly Tombstone[], table: string): TombstoneMap {
  const map: TombstoneMap = new Map();
  for (const tombstone of tombstones) if (tombstone.table_name === table) map.set(tombstone.row_id, tombstone.deleted_at);
  return map;
}

/**
 * The whole restore as data. `local` holds this phone's rows per table (empty for a replace) and
 * `localTombstones` its tombstones. Nothing is written here.
 */
export function planRestore(local: Record<TableName, readonly Row[]>, localTombstones: readonly Tombstone[], backup: Pick<Backup, 'tables' | 'tombstones'>): RestorePlan {
  const tables = {} as Record<TableName, TablePlan>;
  const tombstoneWrites: Tombstone[] = [];
  const tombstoneDrops: { table_name: string; row_id: string }[] = [];
  let aliveApplications: Set<string> | null = null;

  for (const spec of BACKUP_TABLES) {
    let remote = backup.tables[spec.name];
    // An income entry can only point at an application that will exist: otherwise it stays, unlinked.
    if (spec.name === 'income' && aliveApplications) {
      const alive = aliveApplications;
      remote = remote.map((row) => (typeof row.application_id === 'string' && !alive.has(row.application_id) ? { ...row, application_id: null } : row));
    }
    const remoteTombstones = toMap(backup.tombstones, spec.name);
    const localTombs = toMap(localTombstones, spec.name);
    const plan = planTable({ spec, local: local[spec.name], remote, remoteTombstones, localTombstones: localTombs });
    tables[spec.name] = plan;
    const finals = finalUpdatedAt(spec, local[spec.name], plan);
    const removed = new Set(plan.deletes);
    if (spec.name === 'applications') aliveApplications = new Set(finals.keys());

    if (TOMBSTONE_TABLES.includes(spec.name)) {
      for (const id of new Set([...remoteTombstones.keys(), ...localTombs.keys()])) {
        const later = remoteTombstones.get(id) ?? '';
        const own = localTombs.get(id) ?? '';
        const at = later > own ? later : own;
        const rowUpdated = finals.get(id);
        if (rowUpdated !== undefined) {
          // Edited after it was deleted: the row stands and the tombstone goes.
          if (rowUpdated > at && localTombs.has(id)) tombstoneDrops.push({ table_name: spec.name, row_id: id });
        } else if (at !== own || removed.has(id)) {
          // A row removed here left the trigger's own tombstone (with today's time): it is rewritten with the backup's.
          tombstoneWrites.push({ table_name: spec.name, row_id: id, deleted_at: at });
        }
      }
    }
  }
  return { tables, tombstoneWrites, tombstoneDrops };
}

export function summarizePlan(plan: RestorePlan): RestoreSummary {
  const total = emptyCounts();
  const byTable: Partial<Record<TableName, RowCounts>> = {};
  for (const name of TABLE_NAMES) {
    const counts = plan.tables[name].counts;
    byTable[name] = counts;
    total.newRows += counts.newRows;
    total.updatedRows += counts.updatedRows;
    total.keptLocal += counts.keptLocal;
    total.unchanged += counts.unchanged;
    total.removedRows += counts.removedRows;
  }
  return { ...total, byTable };
}

/** Whether running the plan would change anything on the phone. */
export function planChangesAnything(plan: RestorePlan): boolean {
  return TABLE_NAMES.some((name) => {
    const table = plan.tables[name];
    return table.inserts.length > 0 || table.updates.length > 0 || table.deletes.length > 0;
  });
}
