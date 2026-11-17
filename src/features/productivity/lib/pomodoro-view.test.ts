import { describe, expect, test } from '@jest/globals';

import { DEFAULT_SETTINGS, createTimer, pause, skip, start, tick } from './pomodoro';
import { elapsedFraction, roundNumber } from './pomodoro-view';

const T0 = Date.UTC(2026, 10, 17, 9, 0, 0);
const MIN = 60_000;

describe('roundNumber', () => {
  test('starts at round 1 and follows the finished rounds', () => {
    let timer = createTimer(DEFAULT_SETTINGS);
    expect(roundNumber(timer, DEFAULT_SETTINGS)).toBe(1);
    timer = tick(start(timer, T0), DEFAULT_SETTINGS, T0 + 25 * MIN).timer; // round 1 done, short break
    expect(timer.phase).toBe('short');
    expect(roundNumber(timer, DEFAULT_SETTINGS)).toBe(1);
    timer = skip(timer, DEFAULT_SETTINGS); // back to work: round 2
    expect(timer.phase).toBe('work');
    expect(roundNumber(timer, DEFAULT_SETTINGS)).toBe(2);
  });

  test('the long break after the last round still reads as that round', () => {
    const settings = { ...DEFAULT_SETTINGS, roundsBeforeLong: 2 };
    const long = { ...createTimer(settings), phase: 'long' as const, cycle: 2 };
    expect(roundNumber(long, settings)).toBe(2);
  });

  test('a break reached by skipping before any round is finished reads as round 1', () => {
    const skipped = skip(createTimer(DEFAULT_SETTINGS), DEFAULT_SETTINGS);
    expect(skipped.phase).toBe('short');
    expect(roundNumber(skipped, DEFAULT_SETTINGS)).toBe(1);
  });
});

describe('elapsedFraction', () => {
  test('0 when idle, partway while running, and it holds when paused', () => {
    const idle = createTimer(DEFAULT_SETTINGS);
    expect(elapsedFraction(idle, DEFAULT_SETTINGS, T0)).toBe(0);
    const running = start(idle, T0);
    expect(elapsedFraction(running, DEFAULT_SETTINGS, T0 + 5 * MIN)).toBeCloseTo(0.2);
    const paused = pause(running, T0 + 10 * MIN);
    expect(elapsedFraction(paused, DEFAULT_SETTINGS, T0 + 20 * MIN)).toBeCloseTo(0.4);
  });
});
