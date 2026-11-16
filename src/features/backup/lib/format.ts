import { SCHEMA_VERSION } from '@/db/migrations';

import { BACKUP_TABLES, isTombstoneTable, sanitizeRow, TABLE_NAMES, type Row, type TableName } from './schema';
import { cleanBackedUpSettings, type BackedUpSettings } from './settings';

/**
 * The backup file: `*.talino-backup`, one UTF-8 JSON document (docs/BACKUP_FORMAT.md describes every
 * field). Plain readable text, a checksum that notices damage and accidental edits, no encryption: it
 * holds the learner's progress, which the learner keeps private. Everything here is pure: the hash is
 * handed in (expo-crypto in the app, Node's crypto in the tests) and nothing here touches a file.
 */
export const BACKUP_FORMAT = 'talino-backup';
export const BACKUP_VERSION = 1;
export const BACKUP_APP = 'talino';
export const BACKUP_EXTENSION = 'talino-backup';
/** A file bigger than this is refused before it is parsed (a real backup is a few hundred kilobytes). */
export const MAX_BACKUP_BYTES = 20 * 1024 * 1024;

export type Platform = 'ios' | 'android' | 'web';

/** `sha256:<hex>`: the hex digest of a text. */
export type HashFn = (text: string) => Promise<string>;

export type Tombstone = { table_name: string; row_id: string; deleted_at: string };

/** A short summary for the preview and the history list; worked out from the tables, never trusted from the file. */
export type BackupCounts = {
  lessons: number;
  activities: number;
  projects: number;
  badges: number;
  certificates: number;
  applications: number;
  income: number;
  goals: number;
  learningDays: number;
  resumeItems: number;
};

export type BackupTables = Record<TableName, Row[]>;

export type Backup = {
  format: typeof BACKUP_FORMAT;
  version: number;
  app: typeof BACKUP_APP;
  appVersion: string;
  schemaVersion: number;
  createdAt: string;
  platform: Platform;
  profileId: string;
  label?: string;
  counts: BackupCounts;
  settings: BackedUpSettings;
  tables: BackupTables;
  /** What the learner deleted (a tombstone per row), so a restore never brings it back. */
  tombstones: Tombstone[];
  checksum: string;
};

export type ParseFailure = 'not_a_backup' | 'corrupted' | 'unsupported_version' | 'needs_newer_app' | 'too_large';
export type ParseResult = { ok: true; backup: Backup } | { ok: false; reason: ParseFailure };

/** JSON with every object's keys sorted: the same data is always the same text, which is what the checksum covers. */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map((item) => (item === undefined ? 'null' : canonicalJson(item))).join(',')}]`;
  const record = value as Record<string, unknown>;
  const parts = Object.keys(record)
    .filter((key) => record[key] !== undefined)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`);
  return `{${parts.join(',')}}`;
}

/** What the checksum covers (not the label, the app version or the counts: they are shown, never used to decide). */
function checksumInput(backup: Pick<Backup, 'format' | 'version' | 'app' | 'schemaVersion' | 'createdAt' | 'platform' | 'profileId'> & { settings: unknown; tables: unknown }): string {
  return canonicalJson({
    format: backup.format,
    version: backup.version,
    app: backup.app,
    schemaVersion: backup.schemaVersion,
    createdAt: backup.createdAt,
    platform: backup.platform,
    profileId: backup.profileId,
    settings: backup.settings,
    tables: backup.tables,
  });
}

export async function checksumOf(parts: Parameters<typeof checksumInput>[0], hash: HashFn): Promise<string> {
  return `sha256:${await hash(checksumInput(parts))}`;
}

export function summarize(tables: Partial<Record<TableName, readonly Row[]>>): BackupCounts {
  const rows = (name: TableName) => tables[name] ?? [];
  return {
    lessons: rows('lesson_progress').filter((row) => row.completed_at !== null).length,
    activities: rows('activity_progress').filter((row) => row.solved === 1).length,
    projects: rows('project_progress').filter((row) => row.status === 'passed').length,
    badges: rows('badges').length,
    certificates: rows('certificates').length,
    applications: rows('applications').length,
    income: rows('income').length,
    goals: rows('career_goals').length,
    learningDays: rows('learning_days').length,
    resumeItems: rows('resume_items').length,
  };
}

/** Whether the tables hold any of the learner's own learning or career data (an empty snapshot is never worth uploading). */
export function hasAnyData(tables: Partial<Record<TableName, readonly Row[]>>): boolean {
  return TABLE_NAMES.some((name) => name !== 'learner_profile' && (tables[name]?.length ?? 0) > 0);
}

export type BackupParts = {
  appVersion: string;
  schemaVersion: number;
  createdAt: string;
  platform: Platform;
  profileId: string;
  label?: string;
  settings: BackedUpSettings;
  tables: BackupTables;
  tombstones: Tombstone[];
};

/** Puts a backup together and signs it with its checksum. */
export async function buildBackup(parts: BackupParts, hash: HashFn): Promise<Backup> {
  const base = { format: BACKUP_FORMAT, version: BACKUP_VERSION, app: BACKUP_APP, schemaVersion: parts.schemaVersion, createdAt: parts.createdAt, platform: parts.platform, profileId: parts.profileId } as const;
  const tables = { ...parts.tables } as Record<string, unknown>;
  // The tombstones travel with the tables, under one key the checksum covers.
  tables.deleted_rows = parts.tombstones;
  const checksum = await checksumOf({ ...base, settings: parts.settings, tables }, hash);
  const backup: Backup = {
    ...base,
    appVersion: parts.appVersion,
    ...(parts.label ? { label: parts.label } : {}),
    counts: summarize(parts.tables),
    settings: parts.settings,
    tables: parts.tables,
    tombstones: parts.tombstones,
    checksum,
  };
  return backup;
}

/** The file's text. The tombstones sit inside `tables` (as `deleted_rows`), the way the checksum sees them. */
export function serializeBackup(backup: Backup): string {
  const { tombstones, tables, ...rest } = backup;
  return JSON.stringify({ ...rest, tables: { ...tables, deleted_rows: tombstones } });
}

const PLATFORMS: readonly Platform[] = ['ios', 'android', 'web'];
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const isTimestamp = (value: unknown): value is string => typeof value === 'string' && value.length <= 40 && /^\d{4}-\d{2}-\d{2}T[\d:.]+(Z|[+-]\d{2}:?\d{2})?$/.test(value);
const isShortText = (value: unknown, max: number): value is string => typeof value === 'string' && value.length > 0 && value.length <= max;

function readTombstones(raw: unknown): Tombstone[] | null {
  if (raw === undefined) return [];
  if (!Array.isArray(raw)) return null;
  const seen = new Map<string, Tombstone>();
  for (const item of raw) {
    if (!isRecord(item)) return null;
    const { table_name: table, row_id: id, deleted_at: at } = item;
    if (typeof table !== 'string' || typeof id !== 'string' || id === '' || id.length > 200 || !isTimestamp(at)) return null;
    // A tombstone for a table the learner can't delete from is ignored, never an error (a newer app may add some).
    if (!isTombstoneTable(table)) continue;
    const key = `${table}\u0000${id}`;
    const earlier = seen.get(key);
    if (!earlier || earlier.deleted_at < at) seen.set(key, { table_name: table, row_id: id, deleted_at: at });
  }
  return [...seen.values()];
}

/**
 * Reads and checks a backup file's text. Never throws: a file that is too big, not JSON, not a Talino backup,
 * damaged (the checksum does not match, or a row is not what its table says) or made by a newer Talino comes
 * back as a reason. Every row is validated against its table before anything is trusted; unknown tables and
 * columns are ignored. Older files (an older schema, fewer columns) are fine.
 */
export async function parseBackup(text: string, hash: HashFn, schemaVersion: number = SCHEMA_VERSION): Promise<ParseResult> {
  try {
    if (typeof text !== 'string') return { ok: false, reason: 'not_a_backup' };
    // Characters, not bytes: a conservative stand-in that never reads a huge string twice.
    if (text.length > MAX_BACKUP_BYTES) return { ok: false, reason: 'too_large' };
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      // Not JSON at all is not a backup; text that names the format but stops short is a backup that was cut off.
      return { ok: false, reason: text.slice(0, 2000).includes(BACKUP_FORMAT) ? 'corrupted' : 'not_a_backup' };
    }
    if (!isRecord(raw) || raw.format !== BACKUP_FORMAT || raw.app !== BACKUP_APP) return { ok: false, reason: 'not_a_backup' };
    if (typeof raw.version !== 'number' || !Number.isInteger(raw.version) || raw.version < 1) return { ok: false, reason: 'corrupted' };
    if (raw.version > BACKUP_VERSION) return { ok: false, reason: 'unsupported_version' };
    const schema = raw.schemaVersion;
    if (typeof schema !== 'number' || !Number.isInteger(schema) || schema < 1) return { ok: false, reason: 'corrupted' };
    if (schema > schemaVersion) return { ok: false, reason: 'needs_newer_app' };
    if (!isTimestamp(raw.createdAt) || !PLATFORMS.includes(raw.platform as Platform) || !isShortText(raw.profileId, 100)) return { ok: false, reason: 'corrupted' };
    if (!isRecord(raw.settings) || !isRecord(raw.tables) || typeof raw.checksum !== 'string') return { ok: false, reason: 'corrupted' };

    const expected = await checksumOf(
      { format: raw.format, version: raw.version, app: raw.app, schemaVersion: schema, createdAt: raw.createdAt, platform: raw.platform as Platform, profileId: raw.profileId, settings: raw.settings, tables: raw.tables },
      hash,
    );
    if (expected !== raw.checksum) return { ok: false, reason: 'corrupted' };

    const tables = {} as BackupTables;
    for (const spec of BACKUP_TABLES) {
      const rows = raw.tables[spec.name];
      if (rows === undefined) {
        tables[spec.name] = [];
        continue;
      }
      if (!Array.isArray(rows)) return { ok: false, reason: 'corrupted' };
      const clean: Row[] = [];
      const keys = new Set<string>();
      for (const item of rows) {
        const row = sanitizeRow(spec, item);
        if (!row) return { ok: false, reason: 'corrupted' };
        // Two rows with one id is a file that was put together wrongly.
        const key = String(row[spec.key]);
        if (keys.has(key)) return { ok: false, reason: 'corrupted' };
        keys.add(key);
        clean.push(row);
      }
      tables[spec.name] = clean;
    }
    const tombstones = readTombstones(raw.tables.deleted_rows);
    if (!tombstones) return { ok: false, reason: 'corrupted' };

    return {
      ok: true,
      backup: {
        format: BACKUP_FORMAT,
        version: raw.version,
        app: BACKUP_APP,
        appVersion: typeof raw.appVersion === 'string' ? raw.appVersion.slice(0, 40) : '',
        schemaVersion: schema,
        createdAt: raw.createdAt,
        platform: raw.platform as Platform,
        profileId: raw.profileId,
        ...(typeof raw.label === 'string' && raw.label.trim() !== '' ? { label: raw.label.trim().slice(0, 80) } : {}),
        counts: summarize(tables),
        settings: cleanBackedUpSettings(raw.settings),
        tables,
        tombstones,
        checksum: raw.checksum,
      },
    };
  } catch {
    return { ok: false, reason: 'corrupted' };
  }
}
