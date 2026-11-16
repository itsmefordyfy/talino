/**
 * For tests only (never imported by the app): row builders, a Node hash, and helpers that put rows into
 * a test database, so the backup's rules are exercised on the real tables.
 */
import { createHash } from 'node:crypto';

import type { SQLiteDatabase } from 'expo-sqlite';

import { SCHEMA_VERSION } from '@/db/migrations';
import { initialSettingsState, type SettingsState } from '@/features/settings/settings-slice';

import type { BackupContext, FileStore, KeyValue, StoredFile } from './api/context';
import { createAutoRestoreStore, createRunStateStore } from './api/run-state';
import { createSnapshot, type Snapshot } from './api/snapshot';
import { CloudError, type CloudBackupEntry, type CloudProvider, type CloudStatus, type UploadConfirmation } from './cloud/types';
import { parseBackup, type Backup, type BackupTables, type HashFn, type Tombstone } from './lib/format';
import { BACKUP_TABLES, columnNames, TABLE_NAMES, type Row, type TableName } from './lib/schema';

export const nodeHash: HashFn = async (text) => createHash('sha256').update(text).digest('hex');

/** A timestamp on day `day` of November 2026 (so `at(5) < at(9)`), `hour` o'clock UTC. */
export const at = (day: number, hour = 10) => `2026-11-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00:00.000Z`;

export const lesson = (id: string, over: Row = {}): Row => ({ lesson_id: id, course_id: 'ai-basics', completed_at: at(5), quiz_correct: 4, quiz_total: 5, task_done: 0, created_at: at(5), updated_at: at(5), ...over });
export const project = (id: string, over: Row = {}): Row => ({ project_id: id, course_id: 'dev', steps_done: '[]', submission: null, status: 'open', feedback: null, reviewed_at: null, created_at: at(5), updated_at: at(5), ...over });
export const day = (iso: string, over: Row = {}): Row => ({ day: iso, lessons: 1, created_at: at(5), ...over });
export const badge = (id: string, over: Row = {}): Row => ({ badge_id: id, earned_at: at(5), seen: 0, ...over });
export const certificate = (id: string, courseId: string, over: Row = {}): Row => ({ id, course_id: courseId, learner_name: 'Ada', issued_at: at(5), verify_id: null, verify_url: null, created_at: at(5), updated_at: at(5), ...over });
export const activity = (id: string, over: Row = {}): Row => ({ activity_id: id, lesson_id: 'l1', course_id: 'ai-basics', kind: 'quiz', solved: 0, attempts: 1, wrong: 0, hints_used: 0, xp: 0, solved_at: null, last_attempt_at: at(5), created_at: at(5), updated_at: at(5), ...over });
export const attempt = (id: string, over: Row = {}): Row => ({ id, activity_id: 'a1', lesson_id: 'l1', course_id: 'ai-basics', kind: 'quiz', correct: 1, hints_used: 0, duration_ms: 1200, created_at: at(5), ...over });
export const application = (id: string, over: Row = {}): Row => ({ id, kind: 'job', title: 'Developer', company: 'Acme', link: null, source: null, stage: 'applied', applied_on: '2026-11-01', follow_up_on: null, interview_at: null, pay: null, notes: null, created_at: at(5), updated_at: at(5), ...over });
export const income = (id: string, over: Row = {}): Row => ({ id, client: 'Acme', application_id: null, amount_minor: 50000, currency: 'USD', received_on: '2026-11-02', note: null, created_at: at(5), updated_at: at(5), ...over });
export const goal = (id: string, over: Row = {}): Row => ({ id, title: 'Earn', metric: 'income', target: 1000, currency: 'USD', due_on: null, done_at: null, created_at: at(5), updated_at: at(5), ...over });
export const resumeItem = (id: string, over: Row = {}): Row => ({ id, kind: 'work', title: 'Dev', organization: 'Acme', start_on: null, end_on: null, description: null, sort: 0, created_at: at(5), updated_at: at(5), ...over });
export const resumeVersion = (goalId: string, over: Row = {}): Row => ({ goal: goalId, job_title: 'Dev', summary: null, highlights: '[]', keywords: '[]', updated_at: at(5), ...over });
export const resumeProfile = (over: Row = {}): Row => ({ id: 'me', headline: null, email: null, phone: null, location: null, website: null, linkedin: null, github: null, summary: null, created_at: at(5), updated_at: at(5), ...over });
export const learnerProfile = (over: Row = {}): Row => ({
  id: 'me',
  experience: null,
  goals: '[]',
  interests: '[]',
  styles: '[]',
  daily_minutes: null,
  days: '[]',
  time_of_day: null,
  weekly_goal: null,
  assessment: null,
  plan: null,
  step: 0,
  status: 'in_progress',
  started_at: at(5),
  completed_at: null,
  created_at: at(5),
  updated_at: at(5),
  ...over,
});

export function emptyTables(): BackupTables {
  const tables = {} as BackupTables;
  for (const name of TABLE_NAMES) tables[name] = [];
  return tables;
}

/** Inserts rows into a table with the table's own columns (what a feature's repo would have written). */
export async function seed(db: SQLiteDatabase, table: TableName, rows: Row[]): Promise<void> {
  const spec = BACKUP_TABLES.find((item) => item.name === table);
  if (!spec) throw new Error(table);
  const columns = columnNames(spec);
  for (const row of rows) await db.runAsync(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`, columns.map((column) => row[column] ?? null));
}

export async function seedAll(db: SQLiteDatabase, tables: Partial<Record<TableName, Row[]>>): Promise<void> {
  for (const spec of BACKUP_TABLES) await seed(db, spec.name, tables[spec.name] ?? []);
}

export async function rowsOf(db: SQLiteDatabase, table: TableName): Promise<Row[]> {
  const spec = BACKUP_TABLES.find((item) => item.name === table);
  if (!spec) throw new Error(table);
  return db.getAllAsync<Row>(`SELECT ${columnNames(spec).join(', ')} FROM ${table} ORDER BY ${spec.key}`);
}

export async function tombstonesOf(db: SQLiteDatabase): Promise<Tombstone[]> {
  return db.getAllAsync<Tombstone>('SELECT table_name, row_id, deleted_at FROM deleted_rows ORDER BY table_name, row_id');
}

export async function snapshotOf(db: SQLiteDatabase, over: { profileId?: string; now?: Date; label?: string; platform?: 'ios' | 'android' | 'web'; schemaVersion?: number; settings?: Partial<typeof initialSettingsState> } = {}): Promise<Snapshot> {
  return createSnapshot(db, {
    settings: { ...initialSettingsState, ...over.settings },
    profileId: over.profileId ?? 'profile-a',
    appVersion: '1.0.0',
    platform: over.platform ?? 'ios',
    schemaVersion: over.schemaVersion ?? SCHEMA_VERSION,
    hash: nodeHash,
    label: over.label,
    now: over.now ?? new Date('2026-11-13T12:00:00.000Z'),
  });
}

/** A snapshot read back through the parser, the way a file would be. */
export async function parsedSnapshot(db: SQLiteDatabase, over: Parameters<typeof snapshotOf>[1] = {}): Promise<Backup> {
  const { text } = await snapshotOf(db, over);
  const parsed = await parseBackup(text, nodeHash);
  if (!parsed.ok) throw new Error(`Snapshot did not parse: ${parsed.reason}`);
  return parsed.backup;
}

// ---- fakes for the backup's own work (files, key-value store, iCloud, clock) ----

export function memoryKeyValue(): KeyValue & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return { map, get: (key) => map.get(key) ?? null, set: (key, value) => void map.set(key, value), remove: (key) => void map.delete(key) };
}

export type MemoryFiles = FileStore & { files: Map<string, { text: string; modified: number }> };

/** Files in memory, addressed `mem://<folder>/<name>`; the clock stamps what is written. */
export function memoryFiles(clock: { t: number }): MemoryFiles {
  const files = new Map<string, { text: string; modified: number }>();
  const describe = (uri: string): StoredFile => {
    const entry = files.get(uri);
    if (!entry) throw new Error(`No file ${uri}`);
    return { name: uri.slice(uri.lastIndexOf('/') + 1), uri, size: entry.text.length, modified: entry.modified };
  };
  return {
    files,
    async write(folder, name, text) {
      const uri = `mem://${folder}/${name}`;
      files.set(uri, { text, modified: clock.t });
      return describe(uri);
    },
    async list(folder) {
      return [...files.keys()].filter((uri) => uri.startsWith(`mem://${folder}/`)).map(describe);
    },
    async read(file) {
      const entry = files.get(file.uri);
      if (!entry) throw new Error(`No file ${file.uri}`);
      return entry.text;
    },
    async remove(file) {
      files.delete(file.uri);
    },
    cacheUri: (name) => `mem://cache/${name}`,
    sizeOf: (uri) => files.get(uri)?.text.length ?? null,
  };
}

export type FakeProvider = CloudProvider & {
  stored: Map<string, { text: string; modified: string }>;
  uploads: string[];
  removed: string[];
  config: { status: CloudStatus; confirm: UploadConfirmation[]; uploadError: CloudError | null; listError: CloudError | null; downloadError: CloudError | null };
};

export function fakeProvider(fs: MemoryFiles, clock: { t: number }, over: Partial<FakeProvider['config']> = {}): FakeProvider {
  const stored = new Map<string, { text: string; modified: string }>();
  const config: FakeProvider['config'] = { status: 'available', confirm: ['uploaded'], uploadError: null, listError: null, downloadError: null, ...over };
  const provider: FakeProvider = {
    hasCloud: true,
    stored,
    uploads: [],
    removed: [],
    config,
    status: async () => config.status,
    async upload(fileUri, name) {
      if (config.uploadError) throw config.uploadError;
      stored.set(name, { text: await fs.read({ uri: fileUri }), modified: new Date(clock.t).toISOString() });
      provider.uploads.push(name);
    },
    async confirmUpload() {
      return config.confirm.length > 1 ? (config.confirm.shift() as UploadConfirmation) : (config.confirm[0] ?? 'uploaded');
    },
    async list() {
      if (config.listError) throw config.listError;
      return [...stored.entries()].map(([name, value]): CloudBackupEntry => ({ name, modified: value.modified, size: value.text.length }));
    },
    async download(entry, destinationUri) {
      if (config.downloadError) throw config.downloadError;
      const value = stored.get(entry.name);
      if (!value) throw new CloudError('failed');
      fs.files.set(destinationUri, { text: value.text, modified: clock.t });
    },
    async remove(entry) {
      stored.delete(entry.name);
      provider.removed.push(entry.name);
    },
  };
  return provider;
}

export type TestContext = BackupContext & { clock: { t: number }; fs: MemoryFiles; provider: FakeProvider; kv: ReturnType<typeof memoryKeyValue>; applied: Partial<SettingsState>[]; changed: { count: number }; settings: SettingsState };

export function makeContext(db: SQLiteDatabase, over: { platform?: 'ios' | 'android' | 'web'; settings?: Partial<SettingsState>; provider?: Partial<FakeProvider['config']>; profileId?: string } = {}): TestContext {
  const clock = { t: Date.UTC(2026, 10, 13, 12, 0, 0) };
  const fs = memoryFiles(clock);
  const kv = memoryKeyValue();
  const provider = fakeProvider(fs, clock, over.provider);
  const settings: SettingsState = { ...initialSettingsState, ...over.settings };
  const applied: Partial<SettingsState>[] = [];
  const changed = { count: 0 };
  return {
    db,
    fs,
    provider,
    kv,
    clock,
    settings,
    applied,
    changed,
    hash: nodeHash,
    runState: createRunStateStore(kv),
    autoRestore: createAutoRestoreStore(kv),
    platform: over.platform ?? 'ios',
    appVersion: '1.0.0',
    schemaVersion: SCHEMA_VERSION,
    profileId: over.profileId ?? 'profile-a',
    now: () => new Date(clock.t),
    getSettings: () => settings,
    applySettings: (next) => {
      applied.push(next);
      Object.assign(settings, next);
    },
    notifyChanged: () => {
      changed.count += 1;
    },
    wait: async (ms) => {
      clock.t += ms;
    },
  };
}
