import type { SQLiteBindValue } from 'expo-sqlite';

import { nowTimestamp } from '@/lib/id';

export type Bindable = SQLiteBindValue;

/** Columns stamped on every user write. */
export function insertStamp() {
  const now = nowTimestamp();
  return { created_at: now, updated_at: now };
}

/** Builds `INSERT INTO table (a, b) VALUES (?, ?)` from a column→value record. */
export function buildInsert(table: string, values: Record<string, Bindable>): [string, Bindable[]] {
  const columns = Object.keys(values);
  const placeholders = columns.map(() => '?').join(', ');
  return [`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`, Object.values(values)];
}

/** Builds an UPDATE by id that always bumps `updated_at`. */
export function buildUpdate(table: string, id: string, values: Record<string, Bindable>): [string, Bindable[]] {
  const entries = Object.entries({ ...values, updated_at: nowTimestamp() });
  const assignments = entries.map(([column]) => `${column} = ?`).join(', ');
  return [`UPDATE ${table} SET ${assignments} WHERE id = ?`, [...entries.map(([, value]) => value), id]];
}

/** An optional text field: trimmed, and null rather than an empty string in the database. */
export function textOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? '';
  return trimmed === '' ? null : trimmed;
}
