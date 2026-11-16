/**
 * For tests only (never imported by the app): Node's built-in SQLite behind the part of
 * expo-sqlite's `SQLiteDatabase` the app's data code uses, so the real migrations and queries run
 * in Jest. Node 22.5+.
 */
import { jest } from '@jest/globals';
import type { SQLiteDatabase } from 'expo-sqlite';

import { migrateDatabase } from '../migrations';

type Value = string | number | null | Uint8Array;
type NodeStatement = { run(...params: Value[]): { changes: number | bigint; lastInsertRowid: number | bigint }; get(...params: Value[]): unknown; all(...params: Value[]): unknown[] };
type NodeDatabase = { exec(sql: string): void; prepare(sql: string): NodeStatement; close(): void };

const flatten = (params: unknown[]): Value[] => (params.length === 1 && Array.isArray(params[0]) ? (params[0] as Value[]) : (params as Value[])).map((value) => (typeof value === 'boolean' ? (value ? 1 : 0) : (value ?? null)));

/** A fresh in-memory database with every migration applied, typed as the app's database. */
export async function createTestDatabase(): Promise<SQLiteDatabase & { close(): void }> {
  const { DatabaseSync } = jest.requireActual<{ DatabaseSync: new (path: string) => NodeDatabase }>('node:sqlite');
  const node = new DatabaseSync(':memory:');
  const db = {
    async execAsync(sql: string) {
      node.exec(sql);
    },
    async runAsync(sql: string, ...params: unknown[]) {
      const result = node.prepare(sql).run(...flatten(params));
      return { changes: Number(result.changes), lastInsertRowId: Number(result.lastInsertRowid) };
    },
    async getFirstAsync(sql: string, ...params: unknown[]) {
      return node.prepare(sql).get(...flatten(params)) ?? null;
    },
    async getAllAsync(sql: string, ...params: unknown[]) {
      return node.prepare(sql).all(...flatten(params));
    },
    async withTransactionAsync(task: () => Promise<void>) {
      node.exec('BEGIN');
      try {
        await task();
        node.exec('COMMIT');
      } catch (error) {
        node.exec('ROLLBACK');
        throw error;
      }
    },
    close: () => node.close(),
  } as unknown as SQLiteDatabase & { close(): void };
  await migrateDatabase(db);
  return db;
}
