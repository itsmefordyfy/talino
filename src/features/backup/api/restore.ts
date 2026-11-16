import type { SQLiteDatabase } from 'expo-sqlite';

import { runInTransaction } from '@/db/transaction';
import type { SettingsState } from '@/features/settings/settings-slice';

import { hasAnyData, type Backup, type BackupCounts } from '../lib/format';
import { matchKeyOf, planChangesAnything, planRestore, summarizePlan, type RestorePlan, type RestoreSummary } from '../lib/merge';
import { BACKUP_TABLES, columnNames, TABLE_NAMES, WIPE_ORDER, type Row, type TableName, type TableSpec } from '../lib/schema';
import { settingsToApply } from '../lib/settings';
import { hasOwnLearningData, readLocalTables, readLocalTombstones } from './local-rows';

/** `merge` adds and updates what is newer, never overwriting or duplicating; `replace` makes this phone's backed-up data the backup's. */
export type RestoreMode = 'merge' | 'replace';

export type RestorePreview = RestoreSummary & {
  mode: RestoreMode;
  createdAt: string;
  appVersion: string;
  platform: Backup['platform'];
  label?: string;
  counts: BackupCounts;
  /** The backup was made by this same install (not a restore onto a new phone). */
  sameProfile: boolean;
  /** What a Replace would do to this phone: how many rows it holds now and how many of them are not in the backup (they would be lost). */
  wouldReplace: { localRows: number; lostRows: number };
  /** Applying it would change nothing on the phone. */
  nothingToRestore: boolean;
};

/** This phone's rows and tombstones as a plan reads them; a replace plans against an empty phone. */
async function planFor(db: SQLiteDatabase, backup: Backup, mode: RestoreMode): Promise<{ plan: RestorePlan; local: Record<TableName, Row[]> }> {
  const local = await readLocalTables(db);
  const empty = {} as Record<TableName, Row[]>;
  for (const name of TABLE_NAMES) empty[name] = [];
  const localTombstones = mode === 'replace' ? [] : await readLocalTombstones(db);
  return { plan: planRestore(mode === 'replace' ? empty : local, localTombstones, backup), local };
}

function replaceImpact(local: Record<TableName, Row[]>, backup: Backup): RestorePreview['wouldReplace'] {
  let localRows = 0;
  let lostRows = 0;
  for (const spec of BACKUP_TABLES) {
    const inBackup = new Set(backup.tables[spec.name].map((row) => matchKeyOf(spec, row)));
    for (const row of local[spec.name]) {
      localRows += 1;
      if (!inBackup.has(matchKeyOf(spec, row))) lostRows += 1;
    }
  }
  return { localRows, lostRows };
}

/**
 * What a restore would do, from a dry run of the very code the restore runs (nothing is written), for the
 * learner to read before confirming.
 */
export async function previewRestore(db: SQLiteDatabase, backup: Backup, options: { mode?: RestoreMode; profileId?: string } = {}): Promise<RestorePreview> {
  const mode = options.mode ?? 'merge';
  const { plan, local } = await planFor(db, backup, mode);
  return {
    ...summarizePlan(plan),
    mode,
    createdAt: backup.createdAt,
    appVersion: backup.appVersion,
    platform: backup.platform,
    ...(backup.label ? { label: backup.label } : {}),
    counts: backup.counts,
    sameProfile: options.profileId !== undefined && options.profileId === backup.profileId,
    wouldReplace: replaceImpact(local, backup),
    nothingToRestore: mode === 'merge' && !planChangesAnything(plan),
  };
}

export type RestoreHooks = {
  /** Called after each table is written, inside the transaction: a throw here rolls everything back (tests use it to fail midway). */
  afterStep?: (step: string) => void | Promise<void>;
};

export type RestoreOptions = {
  mode: RestoreMode;
  /** The current settings and whether this install is already in use, to decide which of the backup's settings apply. */
  settings: { local: SettingsState; usedInstall: boolean };
  hooks?: RestoreHooks;
};

export type RestoreResult = {
  mode: RestoreMode;
  summary: RestoreSummary;
  /** The settings for the caller to put in the store (null: none change). */
  settings: Partial<SettingsState> | null;
};

async function insertRow(db: SQLiteDatabase, spec: TableSpec, row: Row): Promise<void> {
  const columns = columnNames(spec);
  await db.runAsync(`INSERT INTO ${spec.name} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`, columns.map((column) => row[column] ?? null));
}

async function updateRow(db: SQLiteDatabase, spec: TableSpec, key: string, row: Row): Promise<void> {
  // The key never changes; a certificate keeps this phone's id.
  const columns = columnNames(spec).filter((column) => column !== spec.key);
  await db.runAsync(`UPDATE ${spec.name} SET ${columns.map((column) => `${column} = ?`).join(', ')} WHERE ${spec.key} = ?`, [...columns.map((column) => row[column] ?? null), key]);
}

async function applyPlan(db: SQLiteDatabase, plan: RestorePlan, hooks?: RestoreHooks): Promise<void> {
  for (const spec of BACKUP_TABLES) {
    const table = plan.tables[spec.name];
    for (const key of table.deletes) await db.runAsync(`DELETE FROM ${spec.name} WHERE ${spec.key} = ?`, [key]);
    for (const { key, row } of table.updates) await updateRow(db, spec, key, row);
    for (const row of table.inserts) await insertRow(db, spec, row);
    await hooks?.afterStep?.(spec.name);
  }
  for (const drop of plan.tombstoneDrops) await db.runAsync('DELETE FROM deleted_rows WHERE table_name = ? AND row_id = ?', [drop.table_name, drop.row_id]);
  for (const write of plan.tombstoneWrites) await db.runAsync('INSERT OR REPLACE INTO deleted_rows (table_name, row_id, deleted_at) VALUES (?, ?, ?)', [write.table_name, write.row_id, write.deleted_at]);
  await hooks?.afterStep?.('tombstones');
}

/**
 * Puts a backup's data into the database, in one transaction: all of it or none of it (a failure at any
 * step rolls everything back). A replace first empties the backed-up tables (and the tombstones) and
 * then runs the same merge into the empty phone. Idempotent: restoring the same file again changes
 * nothing. The caller handles what follows: the store (`result.settings`), `notifyDataChanged()` and
 * the query cache.
 */
export async function restoreFromBackup(db: SQLiteDatabase, backup: Backup, options: RestoreOptions): Promise<RestoreResult> {
  const usedInstall = options.settings.usedInstall || (await hasOwnLearningData(db));
  const outcome: { summary: RestoreSummary | null } = { summary: null };
  await runInTransaction(db, async () => {
    if (options.mode === 'replace') {
      for (const table of WIPE_ORDER) await db.runAsync(`DELETE FROM ${table}`);
      // The deletes above fired the tombstone triggers: this phone's own record of deletions starts again from the backup's.
      await db.runAsync('DELETE FROM deleted_rows');
    }
    const { plan } = await planFor(db, backup, 'merge');
    outcome.summary = summarizePlan(plan);
    await applyPlan(db, plan, options.hooks);
  });
  const summary = outcome.summary;
  if (!summary) throw new Error('Restore did not run');
  const settings = settingsToApply(options.settings.local, backup.settings, { mode: options.mode, usedInstall, learningRestored: hasAnyData(backup.tables) });
  return { mode: options.mode, summary, settings };
}
