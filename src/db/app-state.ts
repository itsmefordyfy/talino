import type { SQLiteDatabase } from 'expo-sqlite';

import { nowTimestamp } from '@/lib/id';

/** A small JSON value kept in the database (`app_state`), read back defensively. */
export async function readAppState<T>(db: SQLiteDatabase, key: string): Promise<T | null> {
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_state WHERE key = ?', key);
  if (!row) return null;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return null;
  }
}

export async function writeAppState(db: SQLiteDatabase, key: string, value: unknown): Promise<void> {
  await db.runAsync('INSERT INTO app_state (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at', key, JSON.stringify(value), nowTimestamp());
}

export async function clearAppState(db: SQLiteDatabase, key: string): Promise<void> {
  await db.runAsync('DELETE FROM app_state WHERE key = ?', key);
}
