import { describe, expect, test } from '@jest/globals';

import { addStudyTime, elapsedStep, emptyStudyDay, MAX_DAY_MS, MAX_STEP_MS, studiedToday, studyDayFor } from './study-time';

describe('elapsedStep', () => {
  test('the first tick, a clock that stood still and one that went back count nothing', () => {
    expect(elapsedStep(null, 5_000)).toBe(0);
    expect(elapsedStep(5_000, 5_000)).toBe(0);
    expect(elapsedStep(9_000, 5_000)).toBe(0);
    expect(elapsedStep(Number.NaN, 5_000)).toBe(0);
  });

  test('a normal tick counts what passed', () => {
    expect(elapsedStep(1_000, 2_000)).toBe(1_000);
  });

  test('a long gap (the app was frozen or the phone slept) counts at most one step, never the whole gap', () => {
    expect(elapsedStep(0, 10 * 60_000)).toBe(MAX_STEP_MS);
  });
});

describe('addStudyTime', () => {
  test('adds within the same day', () => {
    const day = addStudyTime(addStudyTime(emptyStudyDay('2026-11-18'), '2026-11-18', 1_000), '2026-11-18', 2_500);
    expect(day).toEqual({ day: '2026-11-18', ms: 3_500 });
  });

  test('a new local day starts again from zero, keeping nothing of yesterday', () => {
    const yesterday = { day: '2026-11-17', ms: 40 * 60_000 };
    expect(addStudyTime(yesterday, '2026-11-18', 1_000)).toEqual({ day: '2026-11-18', ms: 1_000 });
    expect(studiedToday(yesterday, '2026-11-18')).toBe(0);
  });

  test('the day is capped, and nonsense adds nothing', () => {
    expect(addStudyTime({ day: '2026-11-18', ms: MAX_DAY_MS - 500 }, '2026-11-18', 5_000).ms).toBe(MAX_DAY_MS);
    expect(addStudyTime(emptyStudyDay('2026-11-18'), '2026-11-18', -5).ms).toBe(0);
    expect(addStudyTime(emptyStudyDay('2026-11-18'), '2026-11-18', Number.NaN).ms).toBe(0);
  });
});

describe('studyDayFor', () => {
  test('reads a saved day of today back', () => {
    expect(studyDayFor({ day: '2026-11-18', ms: 90_000 }, '2026-11-18')).toEqual({ day: '2026-11-18', ms: 90_000 });
  });

  test('an old day, nothing or garbage is a fresh day', () => {
    expect(studyDayFor({ day: '2026-11-17', ms: 90_000 }, '2026-11-18')).toEqual({ day: '2026-11-18', ms: 0 });
    expect(studyDayFor(null, '2026-11-18')).toEqual({ day: '2026-11-18', ms: 0 });
    expect(studyDayFor('x', '2026-11-18')).toEqual({ day: '2026-11-18', ms: 0 });
    expect(studyDayFor({ day: '2026-11-18', ms: 'lots' }, '2026-11-18').ms).toBe(0);
    expect(studyDayFor({ day: '2026-11-18', ms: -4 }, '2026-11-18').ms).toBe(0);
  });

  test('a saved total above the daily cap is brought back to it', () => {
    expect(studyDayFor({ day: '2026-11-18', ms: MAX_DAY_MS * 3 }, '2026-11-18').ms).toBe(MAX_DAY_MS);
  });
});
