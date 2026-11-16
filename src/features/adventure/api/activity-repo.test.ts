import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';

import { activityBadgeStats, readActivityProgress, readAttempts, recordAttempt, type AttemptInput } from './activity-repo';

// expo-crypto is a native module Jest has no implementation of (babel-jest hoists this above the imports).
jest.mock('@/lib/id', () => ({ newId: () => jest.requireActual<typeof import('node:crypto')>('node:crypto').randomUUID(), nowTimestamp: () => new Date().toISOString() }));

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

const input = (overrides: Partial<AttemptInput> = {}): AttemptInput => ({ activityId: 'dev-01-a1', lessonId: 'dev-01', courseId: 'dev', kind: 'fix-bug', correct: true, hintsUsed: 0, ...overrides });
let tick = 0;
const stamp = () => new Date(Date.UTC(2026, 10, 13, 10, 0, tick++)).toISOString();

describe('recordAttempt', () => {
  test('a first correct try solves the activity and pays its base XP', async () => {
    const result = await recordAttempt(db, input(), stamp());
    expect(result).toMatchObject({ xpEarned: 12, solvedNow: true, alreadySolved: false });
    expect(result.row).toMatchObject({ solved: 1, attempts: 1, wrong: 0, hints_used: 0, xp: 12 });
    expect(result.row.solved_at).not.toBeNull();
    expect(await readAttempts(db)).toHaveLength(1);
  });

  test('wrong tries are counted and pay nothing; the solve pays from the effort so far', async () => {
    expect((await recordAttempt(db, input({ correct: false, hintsUsed: 1 }), stamp())).xpEarned).toBe(0);
    expect((await recordAttempt(db, input({ correct: false }), stamp())).row).toMatchObject({ solved: 0, wrong: 2, attempts: 2, xp: 0, solved_at: null });
    const solved = await recordAttempt(db, input({ hintsUsed: 1 }), stamp());
    // 12 base, 2 hints => 70% = 8.4 => 8; two wrong tries do not halve it.
    expect(solved).toMatchObject({ xpEarned: 8, solvedNow: true });
    expect(solved.row).toMatchObject({ attempts: 3, wrong: 2, hints_used: 2, xp: 8 });
  });

  test('guessing (three wrong tries before the solve) halves the payout', async () => {
    for (let i = 0; i < 3; i += 1) await recordAttempt(db, input({ correct: false }), stamp());
    expect((await recordAttempt(db, input(), stamp())).xpEarned).toBe(6);
  });

  test('an activity pays once, ever: replays change the attempt count and nothing else', async () => {
    await recordAttempt(db, input({ hintsUsed: 3 }), stamp());
    const [before] = await readActivityProgress(db);
    for (const correct of [true, false, true]) {
      const replay = await recordAttempt(db, input({ correct, hintsUsed: 5 }), stamp());
      expect(replay).toMatchObject({ xpEarned: 0, solvedNow: false, alreadySolved: true });
    }
    const [after] = await readActivityProgress(db);
    expect(after).toMatchObject({ xp: before.xp, solved: 1, wrong: before.wrong, hints_used: before.hints_used, solved_at: before.solved_at, attempts: 4 });
    expect(await readAttempts(db)).toHaveLength(4);
  });

  test('reading (tap-reveal) pays nothing but is recorded', async () => {
    const result = await recordAttempt(db, input({ kind: 'tap-reveal' }), stamp());
    expect(result).toMatchObject({ xpEarned: 0, solvedNow: true });
    expect(result.row.xp).toBe(0);
  });

  test('every kind pays its published base when solved clean', async () => {
    const expected = { 'predict-output': 8, 'fix-bug': 12, arrange: 10, 'fill-blank': 8, match: 8, scenario: 8, 'code-challenge': 15, 'sql-challenge': 15 } as const;
    for (const [kind, xp] of Object.entries(expected)) {
      const result = await recordAttempt(db, input({ activityId: `x-${kind}`, kind: kind as AttemptInput['kind'] }), stamp());
      expect(result.xpEarned).toBe(xp);
    }
  });

  test('odd numbers are cleaned, and duration is only stored', async () => {
    await recordAttempt(db, input({ hintsUsed: -4, durationMs: 1234.7 }), stamp());
    const [attempt] = await readAttempts(db);
    expect(attempt).toMatchObject({ hints_used: 0, duration_ms: 1234, correct: 1 });
  });

  test('two lessons keep separate rows', async () => {
    await recordAttempt(db, input(), stamp());
    await recordAttempt(db, input({ activityId: 'dev-02-a1', lessonId: 'dev-02' }), stamp());
    expect(await readActivityProgress(db)).toHaveLength(2);
    expect(await readActivityProgress(db, { lessonId: 'dev-02' })).toHaveLength(1);
    expect(await readActivityProgress(db, { courseId: 'dev' })).toHaveLength(2);
    expect(await readActivityProgress(db, { courseId: 'other' })).toHaveLength(0);
  });
});

describe('readAttempts', () => {
  test('oldest first, filtered, and limited to the newest', async () => {
    for (let i = 0; i < 5; i += 1) await recordAttempt(db, input({ activityId: `a${i}`, correct: i % 2 === 0 }), stamp());
    expect((await readAttempts(db)).map((row) => row.activity_id)).toEqual(['a0', 'a1', 'a2', 'a3', 'a4']);
    expect((await readAttempts(db, { limit: 2 })).map((row) => row.activity_id)).toEqual(['a3', 'a4']);
    expect(await readAttempts(db, { activityId: 'a1' })).toHaveLength(1);
    expect(await readAttempts(db, { courseId: 'nope' })).toEqual([]);
  });
});

describe('activityBadgeStats', () => {
  const solved = (activity_id: string, kind: string, isSolved = 1) => ({ activity_id, kind, solved: isSolved });
  test('counts only solved activities, and the languages of code and sql ones', () => {
    const stats = activityBadgeStats([
      ...Array.from({ length: 10 }, (_, i) => solved(`b${i}`, 'fix-bug')),
      solved('c1', 'fix-bug', 0),
      solved('l1', 'predict-output'),
      solved('l2', 'arrange'),
      solved('l3', 'scenario'),
      solved('l4', 'match'),
      solved('j1', 'code-challenge'),
      solved('s1', 'sql-challenge'),
      solved('p1-python-1', 'code-challenge'),
      solved('unsolved-ruby', 'code-challenge', 0),
    ]);
    expect(stats.fixBugSolved).toBe(10);
    expect(stats.logicSolved).toBe(3);
    expect(stats.codeLanguages).toEqual(['js', 'python', 'sql']);
  });

  test('nothing solved, nothing counted', () => {
    expect(activityBadgeStats([])).toEqual({ fixBugSolved: 0, logicSolved: 0, codeLanguages: [] });
  });
});
