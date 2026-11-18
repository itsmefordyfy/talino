import { describe, expect, test } from '@jest/globals';

import { GOAL_ACTIVITY_TEXT, goalActivityProps, goalProgress, MIN_UPDATE_INTERVAL_MS, nextMidnight, shouldUpdateActivity, snapshotOf, wantsGoalActivity } from './goal-state';

const MIN = 60_000;

describe('goalProgress', () => {
  test('nothing done: the whole goal is left', () => {
    expect(goalProgress(5, 0)).toEqual({ goalMinutes: 5, doneMinutes: 0, minutesLeft: 5, fraction: 0, reached: false });
  });

  test('minutes left and done follow whole minutes, the bar follows the seconds', () => {
    const progress = goalProgress(5, 2 * MIN + 30_000);
    expect(progress).toMatchObject({ doneMinutes: 2, minutesLeft: 3, reached: false });
    expect(progress.fraction).toBeCloseTo(0.5);
  });

  test('done + left is always the goal', () => {
    for (const ms of [0, 1, 59_999, 60_000, 4 * MIN + 59_999]) {
      const progress = goalProgress(5, ms);
      expect(progress.doneMinutes + progress.minutesLeft).toBe(5);
    }
  });

  test('the goal is reached at its minute and never overshoots', () => {
    expect(goalProgress(5, 5 * MIN)).toEqual({ goalMinutes: 5, doneMinutes: 5, minutesLeft: 0, fraction: 1, reached: true });
    expect(goalProgress(5, 9 * MIN)).toMatchObject({ doneMinutes: 5, minutesLeft: 0, fraction: 1, reached: true });
  });

  test('a goal under a minute is a minute', () => {
    expect(goalProgress(0, 0).goalMinutes).toBe(1);
  });
});

describe('goalActivityProps', () => {
  const at = (goal: number, ms: number) => goalActivityProps(goalProgress(goal, ms), null);

  test('at the start: the card reads 5 minutes to go and 0 of 5 min', () => {
    expect(at(5, 0)).toEqual({
      title: 'Your daily goal',
      value: '5',
      caption: 'minutes to go',
      headline: 'One lesson at a time.',
      progressText: '0 of 5 min',
      fraction: 0,
      reached: false,
      image: null,
    });
  });

  test('halfway the headline changes', () => {
    expect(at(10, 5 * MIN).headline).toBe(GOAL_ACTIVITY_TEXT.halfway);
    expect(at(10, 4 * MIN).headline).toBe(GOAL_ACTIVITY_TEXT.starting);
  });

  test('reached: Done, no caption, the finished line', () => {
    expect(at(5, 5 * MIN)).toMatchObject({ value: 'Done', caption: '', headline: 'Goal complete. Nicely done.', progressText: '5 of 5 min', reached: true });
  });

  test('the coach picture is passed through', () => {
    expect(goalActivityProps(goalProgress(5, 0), 'file:///x.webp').image).toBe('file:///x.webp');
  });
});

describe('wantsGoalActivity', () => {
  test('only with a goal that is not yet met', () => {
    expect(wantsGoalActivity(null, null)).toBe(false);
    expect(wantsGoalActivity(5, goalProgress(5, 0))).toBe(true);
    expect(wantsGoalActivity(5, goalProgress(5, 5 * MIN))).toBe(false);
  });
});

describe('shouldUpdateActivity', () => {
  const snap = (ms: number, at: number) => snapshotOf(goalActivityProps(goalProgress(5, ms), null), at);

  test('the first card is always sent', () => {
    expect(shouldUpdateActivity(null, snap(0, 0))).toBe(true);
  });

  test('a change in the words (a minute passing) goes at once', () => {
    expect(shouldUpdateActivity(snap(59_000, 0), snap(61_000, 2_000))).toBe(true);
  });

  test('the bar alone waits for the interval', () => {
    expect(shouldUpdateActivity(snap(1_000, 0), snap(6_000, 5_000))).toBe(false);
    expect(shouldUpdateActivity(snap(1_000, 0), snap(1_000 + 16_000, MIN_UPDATE_INTERVAL_MS + 1_000))).toBe(true);
  });

  test('nothing changed is nothing sent', () => {
    expect(shouldUpdateActivity(snap(1_000, 0), snap(1_000, 60_000))).toBe(false);
  });
});

describe('nextMidnight', () => {
  test('is the start of the next local day', () => {
    expect(nextMidnight(new Date(2026, 10, 18, 23, 59, 30))).toEqual(new Date(2026, 10, 19, 0, 0, 0, 0));
    expect(nextMidnight(new Date(2026, 11, 31, 8, 0))).toEqual(new Date(2027, 0, 1, 0, 0, 0, 0));
  });
});
