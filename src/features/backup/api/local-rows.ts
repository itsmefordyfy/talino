import type { SQLiteDatabase } from 'expo-sqlite';

import { DEMO_ID_PREFIX, isDemoId } from '@/lib/demo';

import type { Tombstone } from '../lib/format';
import { BACKUP_TABLES, columnNames, isTombstoneTable, TABLE_NAMES, type Row, type TableName } from '../lib/schema';

/** This phone's rows of one backed-up table, in the shape a backup holds them (only the table's own columns). */
export async function readLocalRows(db: SQLiteDatabase, name: TableName): Promise<Row[]> {
  const spec = BACKUP_TABLES.find((table) => table.name === name);
  if (!spec) return [];
  // The Developer switch's demo rows (ids `demo-…`) are never part of a backup.
  return db.getAllAsync<Row>(`SELECT ${columnNames(spec).join(', ')} FROM ${spec.name} WHERE ${spec.key} NOT LIKE '${DEMO_ID_PREFIX}%' ORDER BY ${spec.key}`);
}

export async function readLocalTables(db: SQLiteDatabase): Promise<Record<TableName, Row[]>> {
  const tables = {} as Record<TableName, Row[]>;
  for (const name of TABLE_NAMES) tables[name] = await readLocalRows(db, name);
  return tables;
}

/** What the learner deleted on this phone (the triggers of migration v4 note it). */
export async function readLocalTombstones(db: SQLiteDatabase): Promise<Tombstone[]> {
  const rows = await db.getAllAsync<Tombstone>('SELECT table_name, row_id, deleted_at FROM deleted_rows ORDER BY table_name, row_id');
  return rows.filter((row) => isTombstoneTable(row.table_name) && !isDemoId(row.row_id));
}

/** The tables that hold what the learner has done, not what the welcome asked: if any has a row, this phone has progress of its own. */
const LEARNING_TABLES: readonly TableName[] = [
  'lesson_progress',
  'activity_progress',
  'project_progress',
  'learning_days',
  'badges',
  'certificates',
  'applications',
  'income',
  'career_goals',
  'resume_items',
  'resume_versions',
];

/**
 * Whether this phone has learning or career data of its own. A half-done welcome (`learner_profile`) does
 * not count: onboarding writes it from its first step, and a backup arriving while the learner answers
 * the welcome must still be welcome (the merge lets a finished profile beat a half-done one).
 */
export async function hasOwnLearningData(db: SQLiteDatabase): Promise<boolean> {
  for (const table of LEARNING_TABLES) {
    const key = BACKUP_TABLES.find((spec) => spec.name === table)?.key ?? 'rowid';
    const row = await db.getFirstAsync<{ found: number }>(`SELECT 1 AS found FROM ${table} WHERE ${key} NOT LIKE '${DEMO_ID_PREFIX}%' LIMIT 1`);
    if (row) return true;
  }
  return false;
}

export type StorageInfo = { rows: number; bytes: number | null; counts: Record<TableName, number> };

/** For the Storage section: how much the learner has on this phone. Bytes are the database's own size (pages × page size). */
export async function readStorageInfo(db: SQLiteDatabase): Promise<StorageInfo> {
  const counts = {} as Record<TableName, number>;
  let rows = 0;
  for (const name of TABLE_NAMES) {
    const row = await db.getFirstAsync<{ n: number }>(`SELECT COUNT(*) AS n FROM ${name}`);
    counts[name] = row?.n ?? 0;
    rows += counts[name];
  }
  const pages = await db.getFirstAsync<{ page_count: number }>('PRAGMA page_count').catch(() => null);
  const size = await db.getFirstAsync<{ page_size: number }>('PRAGMA page_size').catch(() => null);
  const bytes = pages && size ? pages.page_count * size.page_size : null;
  return { rows, bytes, counts };
}
