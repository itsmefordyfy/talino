import type { SQLiteDatabase } from 'expo-sqlite';

import { migrateDatabase } from './migrations';

/** Runs when the database opens, before any screen reads it. */
export async function initDatabase(db: SQLiteDatabase): Promise<void> {
  await migrateDatabase(db);
}
