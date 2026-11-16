/** A read-only SQL sandbox over SQLite (expo-sqlite in the app, Node's SQLite in tests). */
import * as SQLite from 'expo-sqlite';

import { analyzeSelect, assertSetupSql, validateSelect } from './sql-validate';
import { defaultRunnerText, type RunnerText } from './strings';
import type { SqlExpectation, SqlRunResult } from './types';

export { validateSelect };

export const MAX_SQL_ROWS = 200;

/** The small part of a database the sandbox needs; expo-sqlite's and the test helper's both fit. */
export type SqlDatabase = {
  execAsync(sql: string): Promise<void>;
  getAllAsync(sql: string): Promise<unknown[]>;
  closeAsync?(): Promise<void>;
  /** Exact column names, raw rows and an early stop at `limit` rows, when the driver can do it. */
  queryRaw?(sql: string, limit: number): Promise<{ columns: string[]; rows: unknown[][] }>;
};

export type SqlSandbox = { run(query: string): Promise<SqlRunResult>; close(): Promise<void> };

const failure = (error: string): SqlRunResult => ({ ok: false, columns: [], rows: [], error, truncated: false });

function displayValue(value: unknown): unknown {
  if (value instanceof Uint8Array) return `[blob ${value.length} bytes]`;
  if (typeof value === 'bigint') return Number(value);
  return value === undefined ? null : value;
}

function friendlyError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  return raw.replace(/^Error code\s*:?\s*/i, '').replace(/^.*?(near |no such |ambiguous|incomplete|unrecognized|misuse|wrong number|too many|attempt to write)/i, '$1').slice(0, 300);
}

/** Core of the sandbox, on any database with the minimal interface above. */
export async function makeSandbox(db: SqlDatabase, setupSql: string, text: RunnerText = defaultRunnerText): Promise<SqlSandbox> {
  assertSetupSql(setupSql);
  await db.execAsync(setupSql);
  // SQLite itself refuses every write from here on, on top of the validation below.
  await db.execAsync('PRAGMA query_only = ON');
  let closed = false;

  return {
    async run(query) {
      if (closed) return failure(text.sql.sandboxClosed);
      const analysis = analyzeSelect(query, text);
      if (!analysis.ok) return failure(analysis.reason);
      try {
        let columns: string[];
        let rows: unknown[][];
        if (db.queryRaw) {
          ({ columns, rows } = await db.queryRaw(analysis.sql, MAX_SQL_ROWS + 1));
        } else {
          // Without a streaming driver, ask for one row more than we keep instead of everything.
          const sql = analysis.hasLimit ? analysis.sql : `${analysis.sql}\nLIMIT ${MAX_SQL_ROWS + 1}`;
          const objects = (await db.getAllAsync(sql)) as Record<string, unknown>[];
          columns = objects.length > 0 ? Object.keys(objects[0]) : [];
          rows = objects.map((row) => columns.map((name) => row[name]));
        }
        const truncated = rows.length > MAX_SQL_ROWS;
        return { ok: true, columns, rows: rows.slice(0, MAX_SQL_ROWS).map((row) => row.map(displayValue)), error: null, truncated };
      } catch (error) {
        return failure(friendlyError(error));
      }
    },
    async close() {
      if (closed) return;
      closed = true;
      await db.closeAsync?.();
    },
  };
}

/** An in-memory database seeded from `setupSql` (CREATE TABLE and INSERT only), read-only afterwards. */
export async function createSqlSandbox(setupSql: string, text: RunnerText = defaultRunnerText): Promise<SqlSandbox> {
  const db = await SQLite.openDatabaseAsync(':memory:');
  const driver: SqlDatabase = {
    execAsync: (sql) => db.execAsync(sql),
    getAllAsync: (sql) => db.getAllAsync(sql),
    closeAsync: () => db.closeAsync(),
    async queryRaw(sql, limit) {
      const statement = await db.prepareAsync(sql);
      try {
        const result = await statement.executeForRawResultAsync<Record<string, unknown>>([]);
        const columns = await statement.getColumnNamesAsync();
        const rows: unknown[][] = [];
        for await (const row of result) {
          rows.push(row as unknown as unknown[]);
          if (rows.length >= limit) break;
        }
        return { columns, rows };
      } finally {
        await statement.finalizeAsync();
      }
    },
  };
  try {
    return await makeSandbox(driver, setupSql, text);
  } catch (error) {
    await db.closeAsync();
    throw error;
  }
}

// ---- comparing a result with the expected one ------------------------------------------------

function sameValue(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a === 'boolean') return sameValue(a ? 1 : 0, b);
  if (typeof b === 'boolean') return sameValue(a, b ? 1 : 0);
  if (typeof a === 'number' && typeof b === 'number') return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  return false;
}

const sameRow = (a: unknown[], b: unknown[]) => a.length === b.length && a.every((v, i) => sameValue(v, b[i]));

function show(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'string') return `'${value}'`;
  return String(value);
}
const showRow = (row: unknown[]) => `(${row.map(show).join(', ')})`;

/** A sort key that treats equal values alike (numbers by value, booleans as 0 and 1). */
function rowKey(row: unknown[]): string {
  return row.map((v) => (v === null || v === undefined ? 'n:' : typeof v === 'string' ? `s:${v}` : `d:${Number(typeof v === 'boolean' ? (v ? 1 : 0) : v).toPrecision(12)}`)).join('\u0001');
}

export function compareSql(result: SqlRunResult, expected: SqlExpectation, text: RunnerText = defaultRunnerText): { pass: boolean; feedback: string } {
  const t = text.sql;
  if (!result.ok) return { pass: false, feedback: t.problem(result.error ?? t.couldNotRun) };
  const width = expected.columns ? expected.columns.length : (expected.rows[0]?.length ?? result.columns.length);
  if (expected.columns && result.columns.length > 0) {
    if (result.columns.length !== expected.columns.length) {
      return { pass: false, feedback: t.columnCount(expected.columns.length, expected.columns.join(', '), result.columns.length, result.columns.join(', ')) };
    }
    const bad = expected.columns.findIndex((name, i) => name.toLowerCase() !== result.columns[i].toLowerCase());
    if (bad !== -1) {
      return { pass: false, feedback: t.columnName(bad + 1, expected.columns[bad], result.columns[bad]) };
    }
  } else if (!expected.columns && result.rows.length > 0 && result.rows[0].length !== width) {
    return { pass: false, feedback: t.columnCountOnly(width, result.rows[0].length) };
  }

  const got = result.rows;
  const want = expected.rows;
  if (got.length !== want.length || result.truncated) {
    return { pass: false, feedback: t.rowCount(got.length, result.truncated, MAX_SQL_ROWS, want.length) };
  }
  if (expected.ordered) {
    for (let i = 0; i < want.length; i++) {
      if (!sameRow(got[i], want[i])) {
        const sortedGot = got.map(rowKey).sort();
        const sortedWant = want.map(rowKey).sort();
        const sameSet = sortedGot.every((k, j) => k === sortedWant[j]);
        return {
          pass: false,
          feedback: sameSet
            ? t.orderOnly(i + 1, showRow(want[i]), showRow(got[i]))
            : t.rowWrong(i + 1, showRow(want[i]), showRow(got[i])),
        };
      }
    }
    return { pass: true, feedback: t.correct };
  }
  const remaining = new Map<string, number>();
  for (const row of want) remaining.set(rowKey(row), (remaining.get(rowKey(row)) ?? 0) + 1);
  for (const row of got) {
    const key = rowKey(row);
    const left = remaining.get(key) ?? 0;
    if (left === 0) return { pass: false, feedback: t.extraRow(showRow(row)) };
    remaining.set(key, left - 1);
  }
  return { pass: true, feedback: t.correct };
}
