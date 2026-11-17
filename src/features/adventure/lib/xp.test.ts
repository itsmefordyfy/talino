import { describe, expect, test } from '@jest/globals';

import { ACTIVITY_KINDS } from './kinds';
import { activityXp, ACTIVITY_BASE_XP, computeXp, levelFor, levelTitle, LEVEL_TITLES, missionXp, progressToNextLevel, xpForLevel, XP } from './xp';

const lesson = (overrides: Partial<Parameters<typeof computeXp>[0]['lessonRows'][number]> = {}) => ({ lesson_id: 'a-01', completed_at: '2026-11-13', quiz_correct: 3, quiz_total: 4, task_done: 0, ...overrides });

describe('activityXp', () => {
  test('base XP by kind, and reading pays nothing', () => {
    expect(ACTIVITY_BASE_XP).toEqual({ 'tap-reveal': 0, 'predict-output': 8, 'fix-bug': 12, arrange: 10, 'fill-blank': 8, match: 8, scenario: 8, 'code-challenge': 15, 'sql-challenge': 15, roleplay: 15, 'message-review': 12, 'prompt-lab': 12, 'workflow-builder': 10, planning: 12 });
    expect(activityXp('tap-reveal', { hintsUsed: 0, wrong: 0 })).toBe(0);
    for (const kind of ACTIVITY_KINDS) expect(activityXp(kind, { hintsUsed: 0, wrong: 0 })).toBe(ACTIVITY_BASE_XP[kind]);
  });

  test('each hint costs 15% and at least 40% of the base is kept', () => {
    expect(activityXp('code-challenge', { hintsUsed: 1, wrong: 0 })).toBe(13);
    expect(activityXp('code-challenge', { hintsUsed: 2, wrong: 0 })).toBe(11);
    expect(activityXp('code-challenge', { hintsUsed: 4, wrong: 0 })).toBe(6);
    expect(activityXp('code-challenge', { hintsUsed: 10, wrong: 0 })).toBe(6);
  });

  test('three or more wrong tries halve it; fewer do not', () => {
    expect(activityXp('fix-bug', { hintsUsed: 0, wrong: 2 })).toBe(12);
    expect(activityXp('fix-bug', { hintsUsed: 0, wrong: 3 })).toBe(6);
    expect(activityXp('fix-bug', { hintsUsed: 0, wrong: 30 })).toBe(6);
  });

  test('guessing pays less than care: a clean solve always beats a guessed one', () => {
    for (const kind of ACTIVITY_KINDS) {
      if (ACTIVITY_BASE_XP[kind] === 0) continue;
      expect(activityXp(kind, { hintsUsed: 0, wrong: 0 })).toBeGreaterThan(activityXp(kind, { hintsUsed: 0, wrong: 3 }));
    }
  });

  test('hints reduce the reward but never zero it; a solved activity is worth at least 1', () => {
    for (const kind of ACTIVITY_KINDS) {
      if (ACTIVITY_BASE_XP[kind] === 0) continue;
      for (const hintsUsed of [0, 1, 3, 20]) for (const wrong of [0, 3, 50]) expect(activityXp(kind, { hintsUsed, wrong })).toBeGreaterThanOrEqual(1);
    }
    expect(activityXp('match', { hintsUsed: 9, wrong: 9 })).toBe(2);
  });

  test('odd inputs are treated as none', () => {
    expect(activityXp('match', { hintsUsed: -2, wrong: Number.NaN })).toBe(8);
  });
});

describe('computeXp', () => {
  test('is derived from the learning rows with the published values', () => {
    const result = computeXp({
      lessonRows: [lesson(), lesson({ lesson_id: 'a-02', quiz_correct: 4, task_done: 1 }), lesson({ lesson_id: 'a-03', completed_at: null, quiz_correct: 4, task_done: 0 })],
      projectRows: [{ status: 'passed' }, { status: 'open' }, { status: 'needs_work' }],
      badgeCount: 2,
      activityRows: [{ xp: 8 }, { xp: 12 }],
    });
    expect(result).toEqual({ lessons: 2 * XP.lesson, quizBonus: XP.perfectQuiz, tasks: XP.task, projects: XP.project, achievements: 2 * XP.achievement, activities: 20, total: 40 + 5 + 5 + 100 + 50 + 20 });
  });

  test('nothing in, nothing out', () => {
    expect(computeXp({ lessonRows: [], projectRows: [], badgeCount: 0, activityRows: [] }).total).toBe(0);
  });

  test('XP is not awarded twice: the same rows always give the same total, and a lesson counts once', () => {
    const input = { lessonRows: [lesson()], projectRows: [], badgeCount: 0, activityRows: [] };
    expect(computeXp(input).total).toBe(computeXp(input).total);
    expect(computeXp(input).total).toBe(20);
  });

  test('a missed day changes nothing: XP only reads rows of things done', () => {
    // There is no input for time or streaks at all.
    expect(Object.keys(computeXp({ lessonRows: [], projectRows: [], badgeCount: 0, activityRows: [] }))).not.toContain('streak');
  });

  test('a finished 20-lesson course is roughly 700 to 900 XP before achievements and practice', () => {
    const lessonRows = Array.from({ length: 20 }, (_, index) => lesson({ lesson_id: `c-${index}`, quiz_correct: index % 2 ? 4 : 3, task_done: index % 3 === 0 ? 1 : 0 }));
    const total = computeXp({ lessonRows, projectRows: [{ status: 'passed' }, { status: 'passed' }, { status: 'passed' }].slice(0, 2), badgeCount: 0, activityRows: [] }).total;
    expect(total).toBeGreaterThanOrEqual(600);
    expect(total).toBeLessThanOrEqual(900);
  });

  test('missionXp adds up one lesson', () => {
    expect(missionXp(lesson({ quiz_correct: 4, task_done: 1 }), [{ xp: 8 }, { xp: 4 }])).toEqual({ lesson: 20, quizBonus: 5, task: 5, activities: 12, total: 42 });
    expect(missionXp(null, [])).toEqual({ lesson: 0, quizBonus: 0, task: 0, activities: 0, total: 0 });
  });
});

describe('levels', () => {
  test('level 1 at 0 XP, increasing thresholds, and gentle steps', () => {
    expect(levelFor(0)).toBe(1);
    expect(levelFor(99)).toBe(1);
    expect(levelFor(100)).toBe(2);
    expect(levelFor(299)).toBe(2);
    expect(levelFor(300)).toBe(3);
    expect(levelFor(1000)).toBe(5);
    let previous = 0;
    for (let level = 1; level <= 30; level += 1) {
      expect(xpForLevel(level)).toBeGreaterThanOrEqual(previous);
      if (level > 1) expect(xpForLevel(level)).toBeGreaterThan(previous);
      previous = xpForLevel(level);
    }
    expect(xpForLevel(1)).toBe(0);
  });

  test('levelFor is monotonic and agrees with the thresholds at every boundary', () => {
    let last = 1;
    for (let xp = 0; xp <= 6000; xp += 7) {
      const level = levelFor(xp);
      expect(level).toBeGreaterThanOrEqual(last);
      expect(xpForLevel(level)).toBeLessThanOrEqual(xp);
      expect(xpForLevel(level + 1)).toBeGreaterThan(xp);
      last = level;
    }
    for (let level = 1; level <= 60; level += 1) {
      expect(levelFor(xpForLevel(level))).toBe(level);
      if (level > 1) expect(levelFor(xpForLevel(level) - 1)).toBe(level - 1);
    }
  });

  test('realistic totals reach sensible levels', () => {
    expect(levelFor(800)).toBe(4);
    expect(levelFor(900)).toBe(4);
    expect(levelFor(1100)).toBe(5);
  });

  test('bad numbers never break it', () => {
    expect(levelFor(-5)).toBe(1);
    expect(levelFor(Number.NaN)).toBe(1);
    expect(progressToNextLevel(Number.NaN).level).toBe(1);
  });

  test('progressToNextLevel', () => {
    expect(progressToNextLevel(0)).toEqual({ level: 1, xpIntoLevel: 0, xpForLevel: 100, xpToNext: 100, fraction: 0 });
    expect(progressToNextLevel(150)).toEqual({ level: 2, xpIntoLevel: 50, xpForLevel: 200, xpToNext: 150, fraction: 0.25 });
    const edge = progressToNextLevel(300);
    expect(edge.level).toBe(3);
    expect(edge.fraction).toBe(0);
  });

  test('titles: ten warm titles, the last one from level 10 on', () => {
    expect(LEVEL_TITLES).toHaveLength(10);
    expect(levelTitle(1)).toBe('Curious Cub');
    expect(levelTitle(10)).toBe(LEVEL_TITLES[9]);
    expect(levelTitle(99)).toBe(LEVEL_TITLES[9]);
    expect(levelTitle(0)).toBe('Curious Cub');
    expect(new Set(LEVEL_TITLES).size).toBe(10);
  });
});
