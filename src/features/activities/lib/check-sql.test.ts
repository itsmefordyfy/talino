import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import type { SqlRunResult } from '@/features/code-runner';

import { SAMPLE_ACTIVITIES } from '../samples';
import type { SqlChallengeActivity } from '../types';
import { checkActivity, runSqlQuery } from './check';

// The SQL engine itself is the code-runner's concern (and runs on the phone's SQLite). Here a fake sandbox
// stands in, so these tests cover only what this feature adds: the order of checks and the feedback.
const run = jest.fn<(query: string) => Promise<SqlRunResult>>();
const close = jest.fn<() => Promise<void>>();
const mockCreateSqlSandbox = jest.fn<(setup: string) => Promise<{ run: typeof run; close: typeof close }>>();
const mockValidateSelect = jest.fn<(query: string) => { ok: true } | { ok: false; reason: string }>();
const mockCompareSql = jest.fn<(result: SqlRunResult, expected: unknown) => { pass: boolean; feedback: string }>();

jest.mock('@/features/code-runner', () => ({
  ...(jest.requireActual('@/features/code-runner') as object),
  createSqlSandbox: (setup: string) => mockCreateSqlSandbox(setup),
  validateSelect: (query: string) => mockValidateSelect(query),
  compareSql: (result: SqlRunResult, expected: unknown) => mockCompareSql(result, expected),
}));


const activity = SAMPLE_ACTIVITIES.find((a): a is SqlChallengeActivity => a.kind === 'sql-challenge') as SqlChallengeActivity;
const good: SqlRunResult = { ok: true, columns: ['name'], rows: [['Cy']], error: null, truncated: false };

beforeEach(() => {
  jest.clearAllMocks();
  mockValidateSelect.mockReturnValue({ ok: true });
  mockCreateSqlSandbox.mockResolvedValue({ run, close });
  close.mockResolvedValue(undefined);
  run.mockResolvedValue(good);
  mockCompareSql.mockReturnValue({ pass: true, feedback: '' });
});

describe('sql-challenge', () => {
  test('a passing query is correct and the sandbox is closed', async () => {
    const result = await checkActivity(activity, { kind: 'sql-challenge', query: 'SELECT 1' });
    expect(result).toMatchObject({ correct: true, partial: 1, detail: { kind: 'sql-challenge', result: good } });
    expect(mockCreateSqlSandbox).toHaveBeenCalledWith(activity.setup);
    expect(run).toHaveBeenCalledWith('SELECT 1');
    expect(mockCompareSql).toHaveBeenCalledWith(good, activity.expected);
    expect(close).toHaveBeenCalledTimes(1);
  });
  test('uses compareSql feedback when the result differs, and can be retried', async () => {
    mockCompareSql.mockReturnValueOnce({ pass: false, feedback: 'The result has 1 row but 2 were expected.' });
    const first = await checkActivity(activity, { kind: 'sql-challenge', query: 'SELECT 1' });
    expect(first).toMatchObject({ correct: false, feedback: 'The result has 1 row but 2 were expected.' });
    expect((await checkActivity(activity, { kind: 'sql-challenge', query: 'SELECT 2' })).correct).toBe(true);
  });
  test('a query that is not a read-only SELECT is refused before any database starts', async () => {
    mockValidateSelect.mockReturnValue({ ok: false, reason: 'Only SELECT queries can be run here.' });
    const result = await checkActivity(activity, { kind: 'sql-challenge', query: 'DROP TABLE students' });
    expect(result).toMatchObject({ correct: false, feedback: expect.stringContaining('Only SELECT') });
    expect(mockCreateSqlSandbox).not.toHaveBeenCalled();
  });
  test('a SQL error is explained and the sandbox still closes', async () => {
    run.mockResolvedValue({ ok: false, columns: [], rows: [], error: 'no such column: nam', truncated: false });
    const result = await checkActivity(activity, { kind: 'sql-challenge', query: 'SELECT nam FROM students' });
    expect(result.correct).toBe(false);
    expect(result.feedback).toContain('no such column: nam');
    expect(mockCompareSql).not.toHaveBeenCalled();
    expect(close).toHaveBeenCalledTimes(1);
  });
  test('a database that cannot start says so instead of throwing', async () => {
    mockCreateSqlSandbox.mockRejectedValue(new Error('boom'));
    const result = await checkActivity(activity, { kind: 'sql-challenge', query: 'SELECT 1' });
    expect(result.correct).toBe(false);
    expect(result.feedback).toContain('boom');
  });
  test('runSqlQuery returns the result for the Run button', async () => {
    expect(await runSqlQuery('setup', 'SELECT 1')).toEqual({ result: good, error: null });
    run.mockResolvedValue({ ok: false, columns: [], rows: [], error: null, truncated: false });
    expect((await runSqlQuery('setup', 'SELECT 1')).error).toBe('The query failed.');
  });
});
