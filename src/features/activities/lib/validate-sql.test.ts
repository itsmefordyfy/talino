import { describe, expect, jest, test } from '@jest/globals';

import type { SqlExpectation, SqlRunResult } from '@/features/code-runner';

import { SAMPLE_ACTIVITIES } from '../samples';
import type { SqlChallengeActivity } from '../types';
import { checkActivity } from './check';
import { validateActivityDeep } from './validate';

// A real SQLite engine (Node's, the same SQL dialect as expo-sqlite) behind the code-runner's sandbox
// interface, so the SQL samples are checked against a real database even before the runner's own SQL
// side is wired to Jest. The comparison is a plain stand-in for the runner's `compareSql`.
type NodeStatement = { all(): unknown[]; columns?(): { name: string }[] };
type NodeDatabase = { exec(sql: string): void; prepare(sql: string): NodeStatement; close(): void };

function mockOpenDatabase(setup: string): NodeDatabase {
  const { DatabaseSync } = jest.requireActual<{ DatabaseSync: new (path: string) => NodeDatabase }>('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec(setup);
  return db;
}

function mockRunQuery(db: NodeDatabase, query: string): SqlRunResult {
  try {
    const statement = db.prepare(query);
    const objects = statement.all() as Record<string, unknown>[];
    const columns = statement.columns ? statement.columns().map((column) => column.name) : Object.keys(objects[0] ?? {});
    return { ok: true, columns, rows: objects.map((row) => columns.map((column) => row[column])), error: null, truncated: false };
  } catch (error) {
    return { ok: false, columns: [], rows: [], error: error instanceof Error ? error.message : String(error), truncated: false };
  }
}

function mockCompare(result: SqlRunResult, expected: SqlExpectation): { pass: boolean; feedback: string } {
  const columnsOk = !expected.columns || expected.columns.join() === result.columns.join();
  const key = (rows: unknown[][]) => rows.map((row) => JSON.stringify(row));
  const got = expected.ordered ? key(result.rows) : key(result.rows).sort();
  const want = expected.ordered ? key(expected.rows) : key(expected.rows).sort();
  const pass = columnsOk && got.join('|') === want.join('|');
  return { pass, feedback: pass ? '' : 'differs' };
}

jest.mock('@/features/code-runner', () => ({
  ...(jest.requireActual('@/features/code-runner') as object),
  validateSelect: (query: string) => (/^\s*select\b/i.test(query) ? { ok: true } : { ok: false, reason: 'Only SELECT queries can be run here.' }),
  compareSql: (result: SqlRunResult, expected: SqlExpectation) => mockCompare(result, expected),
  createSqlSandbox: async (setup: string) => {
    const db = mockOpenDatabase(setup);
    return { run: async (query: string) => mockRunQuery(db, query), close: async () => db.close() };
  },
}));


const sqlSamples = SAMPLE_ACTIVITIES.filter((a): a is SqlChallengeActivity => a.kind === 'sql-challenge');

describe('the SQL samples, against a real SQLite engine', () => {
  for (const activity of sqlSamples) {
    test(`${activity.id}: setup runs, the reference query returns the expected result`, async () => {
      expect(await validateActivityDeep(activity)).toEqual([]);
    });
    test(`${activity.id}: the reference query is accepted and an empty query is not`, async () => {
      expect((await checkActivity(activity, { kind: 'sql-challenge', query: activity.solution })).correct).toBe(true);
      expect((await checkActivity(activity, { kind: 'sql-challenge', query: 'SELECT 1' })).correct).toBe(false);
    });
  }
});

describe('validateActivityDeep', () => {
  const base = sqlSamples[0];
  test('a reference query that errors is reported', async () => {
    expect((await validateActivityDeep({ ...base, solution: 'SELECT nope FROM students' })).join(' ')).toMatch(/does not run/);
  });
  test('a reference query that gives another result is reported', async () => {
    expect((await validateActivityDeep({ ...base, solution: 'SELECT name, score FROM students' })).join(' ')).toMatch(/does not match its expected result/);
  });
  test('a non-SELECT reference is reported', async () => {
    expect((await validateActivityDeep({ ...base, solution: 'DELETE FROM students' })).join(' ')).toMatch(/not an allowed query/);
  });
  test('a starter that already gives the answer is reported', async () => {
    expect((await validateActivityDeep({ ...base, starter: base.solution })).join(' ')).toMatch(/starter query already gives/);
  });
  test('structural problems come back without opening a database', async () => {
    expect((await validateActivityDeep({ ...base, hints: [] })).join(' ')).toMatch(/at least 2 hints/);
  });
});

describe('unordered expectations', () => {
  test('row order does not matter when the expectation is unordered', async () => {
    const base = sqlSamples[1];
    const unordered: SqlChallengeActivity = { ...base, expected: { ...base.expected, ordered: false } };
    expect((await checkActivity(unordered, { kind: 'sql-challenge', query: 'SELECT course, COUNT(*) AS students FROM students GROUP BY course ORDER BY course DESC' })).correct).toBe(true);
    expect((await checkActivity(base, { kind: 'sql-challenge', query: 'SELECT course, COUNT(*) AS students FROM students GROUP BY course ORDER BY course DESC' })).correct).toBe(false);
  });
});
