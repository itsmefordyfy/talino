/**
 * What a backup holds, table by table: the columns that exist in this app's schema (db/migrations),
 * their types, and which are required. One list drives the three things that must agree: reading a
 * snapshot, validating a file before it is trusted, and writing restored rows. A test compares it with
 * the real tables (`PRAGMA table_info`), so a migration that adds a column can't leave it out silently.
 *
 * XP, levels and streaks are not here on purpose: they are derived from these rows (lessons, activities,
 * projects, badges, learning days), there is no counter to back up and nothing to award twice.
 */

export type CellValue = string | number | null;
export type Row = Record<string, CellValue>;

/**
 * `text`: any string. `ts`: an ISO timestamp (compared as text). `date`: `YYYY-MM-DD`. `int` / `real`: a
 * finite number. `bool`: 0 or 1. `json`: text that parses as JSON. `url`: an http(s) address.
 */
export type ColumnType = 'text' | 'ts' | 'date' | 'int' | 'real' | 'bool' | 'json' | 'url';

export type Column = {
  name: string;
  type: ColumnType;
  /** The row is invalid without it (and it has no `fallback`). */
  nullable?: boolean;
  /** What an older backup that lacks the column gets. */
  fallback?: CellValue;
  /** The only values allowed. */
  oneOf?: readonly string[];
  /** Not below this (counts). */
  min?: number;
};

export type TableName =
  | 'lesson_progress'
  | 'project_progress'
  | 'learning_days'
  | 'badges'
  | 'certificates'
  | 'activity_progress'
  | 'challenge_attempts'
  | 'applications'
  | 'income'
  | 'career_goals'
  | 'resume_profile'
  | 'resume_items'
  | 'resume_versions'
  | 'resume_documents'
  | 'portfolio_projects'
  | 'learner_profile';

export type TableSpec = {
  name: TableName;
  /** The primary key column (one column in every backed-up table). */
  key: string;
  columns: readonly Column[];
};

const text = (name: string, extra: Partial<Column> = {}): Column => ({ name, type: 'text', ...extra });
const optionalText = (name: string): Column => ({ name, type: 'text', nullable: true });
const ts = (name: string): Column => ({ name, type: 'ts' });
const optionalTs = (name: string): Column => ({ name, type: 'ts', nullable: true });
const count = (name: string, fallback: number = 0): Column => ({ name, type: 'int', fallback, min: 0 });
const optionalInt = (name: string): Column => ({ name, type: 'int', nullable: true });
const flag = (name: string, fallback: number = 0): Column => ({ name, type: 'bool', fallback });
const jsonList = (name: string): Column => ({ name, type: 'json', fallback: '[]' });
const optionalJson = (name: string): Column => ({ name, type: 'json', nullable: true });

export const PROJECT_STATUSES = ['open', 'submitted', 'needs_work', 'passed'] as const;
export const PROFILE_STATUSES = ['in_progress', 'completed'] as const;

/**
 * Parents before children (a tracked application before the income that points at it). The learner's
 * `project_progress.review_token` is deliberately not a column here: it is a signed assertion tied to
 * this install's store id and never belongs in a file.
 */
export const BACKUP_TABLES: readonly TableSpec[] = [
  {
    name: 'lesson_progress',
    key: 'lesson_id',
    columns: [text('lesson_id'), text('course_id'), optionalTs('completed_at'), optionalInt('quiz_correct'), optionalInt('quiz_total'), flag('task_done'), ts('created_at'), ts('updated_at')],
  },
  {
    name: 'project_progress',
    key: 'project_id',
    columns: [
      text('project_id'),
      text('course_id'),
      jsonList('steps_done'),
      optionalText('submission'),
      text('status', { fallback: 'open', oneOf: PROJECT_STATUSES }),
      optionalText('feedback'),
      optionalTs('reviewed_at'),
      ts('created_at'),
      ts('updated_at'),
    ],
  },
  { name: 'learning_days', key: 'day', columns: [{ name: 'day', type: 'date' }, count('lessons'), ts('created_at')] },
  { name: 'badges', key: 'badge_id', columns: [text('badge_id'), ts('earned_at'), flag('seen')] },
  {
    name: 'certificates',
    key: 'id',
    columns: [text('id'), text('course_id'), text('learner_name'), text('issued_at'), optionalText('verify_id'), { name: 'verify_url', type: 'url', nullable: true }, ts('created_at'), ts('updated_at')],
  },
  {
    name: 'activity_progress',
    key: 'activity_id',
    columns: [
      text('activity_id'),
      text('lesson_id'),
      text('course_id'),
      text('kind'),
      flag('solved'),
      count('attempts'),
      count('wrong'),
      count('hints_used'),
      count('xp'),
      optionalTs('solved_at'),
      optionalTs('last_attempt_at'),
      ts('created_at'),
      ts('updated_at'),
    ],
  },
  {
    name: 'challenge_attempts',
    key: 'id',
    columns: [text('id'), text('activity_id'), text('lesson_id'), text('course_id'), text('kind'), flag('correct'), count('hints_used'), optionalInt('duration_ms'), ts('created_at')],
  },
  {
    name: 'applications',
    key: 'id',
    columns: [
      text('id'),
      text('kind'),
      text('title'),
      text('company'),
      optionalText('link'),
      optionalText('source'),
      text('stage'),
      optionalText('applied_on'),
      optionalText('follow_up_on'),
      optionalText('interview_at'),
      optionalText('pay'),
      optionalText('notes'),
      ts('created_at'),
      ts('updated_at'),
    ],
  },
  {
    name: 'income',
    key: 'id',
    columns: [text('id'), text('client'), optionalText('application_id'), { name: 'amount_minor', type: 'int' }, text('currency'), text('received_on'), optionalText('note'), ts('created_at'), ts('updated_at')],
  },
  {
    name: 'career_goals',
    key: 'id',
    columns: [text('id'), text('title'), text('metric'), { name: 'target', type: 'real' }, optionalText('currency'), optionalText('due_on'), optionalTs('done_at'), ts('created_at'), ts('updated_at')],
  },
  {
    name: 'resume_profile',
    key: 'id',
    columns: [
      text('id'),
      optionalText('headline'),
      optionalText('email'),
      optionalText('phone'),
      optionalText('location'),
      optionalText('website'),
      optionalText('linkedin'),
      optionalText('github'),
      optionalText('summary'),
      optionalText('career_goal'),
      optionalText('level'),
      optionalText('photo'),
      ts('created_at'),
      ts('updated_at'),
    ],
  },
  {
    name: 'resume_items',
    key: 'id',
    columns: [text('id'), text('kind'), text('title'), optionalText('organization'), optionalText('start_on'), optionalText('end_on'), optionalText('description'), { name: 'sort', type: 'int', fallback: 0 }, optionalText('location'), optionalText('link'), optionalText('dates_text'), ts('created_at'), ts('updated_at')],
  },
  {
    name: 'resume_versions',
    key: 'goal',
    columns: [text('goal'), optionalText('job_title'), optionalText('summary'), jsonList('highlights'), jsonList('keywords'), ts('updated_at')],
  },
  {
    name: 'resume_documents',
    key: 'id',
    columns: [text('id'), text('name'), text('template'), { name: 'style', type: 'json', fallback: '{}' }, { name: 'content', type: 'json', fallback: '{}' }, optionalJson('target'), ts('created_at'), ts('updated_at')],
  },
  {
    name: 'portfolio_projects',
    key: 'id',
    columns: [text('id'), text('title'), text('summary', { fallback: '' }), text('description', { fallback: '' }), text('role', { fallback: '' }), jsonList('tech'), optionalText('url'), optionalText('repo_url'), jsonList('images'), count('sort'), ts('created_at'), ts('updated_at')],
  },
  {
    name: 'learner_profile',
    key: 'id',
    columns: [
      text('id'),
      optionalText('experience'),
      jsonList('goals'),
      jsonList('interests'),
      jsonList('styles'),
      optionalInt('daily_minutes'),
      jsonList('days'),
      optionalText('time_of_day'),
      optionalInt('weekly_goal'),
      optionalJson('assessment'),
      optionalJson('plan'),
      count('step'),
      text('status', { fallback: 'in_progress', oneOf: PROFILE_STATUSES }),
      ts('started_at'),
      optionalTs('completed_at'),
      ts('created_at'),
      ts('updated_at'),
    ],
  },
];

export const TABLE_NAMES: readonly TableName[] = BACKUP_TABLES.map((table) => table.name);

export function tableSpec(name: TableName): TableSpec {
  const spec = BACKUP_TABLES.find((table) => table.name === name);
  if (!spec) throw new Error(`Unknown backup table ${name}`);
  return spec;
}

/**
 * The tables whose rows the learner can delete, and so the ones with a tombstone trigger (migration v4).
 * A résumé version's tombstone id is its `goal`.
 */
export const TOMBSTONE_TABLES: readonly TableName[] = ['applications', 'income', 'career_goals', 'resume_items', 'resume_versions', 'resume_documents', 'portfolio_projects', 'certificates'];

/** The tables a backup never holds, and why: the owner can move a name into `BACKUP_TABLES` above to include it. */
export const EXCLUDED_TABLES = [
  // Tali's chats are private conversations: they stay on the phone that had them.
  'coach_chats',
  'coach_messages',
  // Mock interviews are private practice conversations too (answers, and an honest evaluation): they stay on the phone that had them.
  'interviews',
  'interview_messages',
  'interview_reports',
  // The portfolio edit key, the class code and the referral state: credential-like, never in a file.
  'app_state',
] as const;

/** Wipe order for a replace: children before parents, so no foreign key points at a deleted row. */
export const WIPE_ORDER: readonly TableName[] = ['income', 'applications', ...TABLE_NAMES.filter((name) => name !== 'income' && name !== 'applications')];

/** The table a backup's tombstone may name. */
export function isTombstoneTable(name: string): name is TableName {
  return (TOMBSTONE_TABLES as readonly string[]).includes(name);
}

export const MAX_TEXT_LENGTH = 200_000;
export const MAX_KEY_LENGTH = 200;
const TIMESTAMP = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d{1,9})?)?(Z|[+-]\d{2}:?\d{2})?)?$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const URL_START = /^https?:\/\/[^\s]{1,2000}$/i;

function validCell(column: Column, value: unknown): value is CellValue {
  if (value === null) return column.nullable === true;
  switch (column.type) {
    case 'int':
    case 'bool': {
      if (typeof value !== 'number' || !Number.isSafeInteger(value)) return false;
      if (column.type === 'bool') return value === 0 || value === 1;
      return column.min === undefined || value >= column.min;
    }
    case 'real':
      return typeof value === 'number' && Number.isFinite(value);
    case 'ts':
      return typeof value === 'string' && value.length <= 40 && TIMESTAMP.test(value);
    case 'date':
      return typeof value === 'string' && DATE.test(value);
    case 'url':
      return typeof value === 'string' && URL_START.test(value);
    case 'json': {
      if (typeof value !== 'string' || value.length > MAX_TEXT_LENGTH) return false;
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    }
    case 'text':
      return typeof value === 'string' && value.length <= MAX_TEXT_LENGTH && (!column.oneOf || column.oneOf.includes(value));
  }
}

/**
 * One row from a file, checked against the table: only the table's own columns are read (unknown ones
 * are ignored), a column an older backup lacks gets its fallback, and anything of the wrong type, size
 * or value makes the row invalid (null), so nothing half-trusted reaches the database.
 */
export function sanitizeRow(spec: TableSpec, raw: unknown): Row | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const source = raw as Record<string, unknown>;
  const row: Row = {};
  for (const column of spec.columns) {
    let value: unknown = Object.prototype.hasOwnProperty.call(source, column.name) ? source[column.name] : undefined;
    if (value === undefined) {
      if (column.fallback !== undefined) value = column.fallback;
      else if (column.nullable) value = null;
      else return null;
    }
    if (!validCell(column, value)) return null;
    row[column.name] = value;
  }
  const key = row[spec.key];
  if (typeof key !== 'string' || key === '' || key.length > MAX_KEY_LENGTH) return null;
  return row;
}

export const columnNames = (spec: TableSpec): string[] => spec.columns.map((column) => column.name);
