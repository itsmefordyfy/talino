import { describe, expect, test } from '@jest/globals';

import { DEFAULT_SETTINGS, createTimer, normalizeSettings, pause, remainingMs, reset, resume, reviveTimer, skip, start, summarizeSessions, tick } from './pomodoro';

const MIN = 60_000;
const T0 = new Date(2026, 10, 17, 9, 0, 0).getTime();

describe('settings', () => {
  test('defaults are the classic 25 / 5 / 15 every four rounds', () => {
    expect(DEFAULT_SETTINGS).toEqual({ workMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15, roundsBeforeLong: 4, autoStartNext: false });
  });

  test('custom lengths are kept, rounded and clamped to sensible limits', () => {
    expect(normalizeSettings({ workMinutes: 50.4, shortBreakMinutes: 10, longBreakMinutes: 30, roundsBeforeLong: 3 })).toMatchObject({ workMinutes: 50, shortBreakMinutes: 10, longBreakMinutes: 30, roundsBeforeLong: 3 });
    expect(normalizeSettings({ workMinutes: 0, shortBreakMinutes: 99, longBreakMinutes: 1, roundsBeforeLong: 50 })).toMatchObject({ workMinutes: 1, shortBreakMinutes: 30, longBreakMinutes: 5, roundsBeforeLong: 8 });
    expect(normalizeSettings({ workMinutes: Number.NaN })).toMatchObject({ workMinutes: 25 });
    expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS);
  });
});

describe('the timer', () => {
  test('starts idle on a work round with the full time left', () => {
    const timer = createTimer(DEFAULT_SETTINGS);
    expect(timer).toMatchObject({ phase: 'work', status: 'idle', cycle: 0 });
    expect(remainingMs(timer, T0)).toBe(25 * MIN);
  });

  test('counts down from the wall clock, so a backgrounded app is still right', () => {
    const running = start(createTimer(DEFAULT_SETTINGS), T0);
    expect(running.status).toBe('running');
    expect(remainingMs(running, T0 + 10 * MIN)).toBe(15 * MIN);
  });

  test('pause freezes the time and resume continues from it', () => {
    const paused = pause(start(createTimer(DEFAULT_SETTINGS), T0), T0 + 5 * MIN);
    expect(paused.status).toBe('paused');
    expect(remainingMs(paused, T0 + 60 * MIN)).toBe(20 * MIN);
    const again = resume(paused, T0 + 60 * MIN);
    expect(again.status).toBe('running');
    expect(remainingMs(again, T0 + 70 * MIN)).toBe(10 * MIN);
  });

  test('pause and resume do nothing in the wrong state', () => {
    const idle = createTimer(DEFAULT_SETTINGS);
    expect(pause(idle, T0)).toEqual(idle);
    expect(resume(idle, T0)).toEqual(idle);
  });

  test('a finished work round is reported once with its length, then a short break is next', () => {
    const running = start(createTimer(DEFAULT_SETTINGS), T0);
    expect(tick(running, DEFAULT_SETTINGS, T0 + 24 * MIN).finished).toBeNull();
    const done = tick(running, DEFAULT_SETTINGS, T0 + 25 * MIN);
    expect(done.finished).toEqual({ phase: 'work', minutes: 25, startedAt: T0, endedAt: T0 + 25 * MIN });
    expect(done.timer).toMatchObject({ phase: 'short', status: 'idle', cycle: 1 });
    expect(remainingMs(done.timer, T0 + 26 * MIN)).toBe(5 * MIN);
  });

  test('every fourth work round is followed by the long break, and the cycle restarts after it', () => {
    let timer = createTimer(DEFAULT_SETTINGS);
    let now = T0;
    const phases: string[] = [];
    for (let i = 0; i < 9; i += 1) {
      timer = start(timer, now);
      now += remainingMs(timer, now);
      const result = tick(timer, DEFAULT_SETTINGS, now);
      timer = result.timer;
      phases.push(`${result.finished?.phase}>${timer.phase}`);
    }
    expect(phases).toEqual(['work>short', 'short>work', 'work>short', 'short>work', 'work>short', 'short>work', 'work>long', 'long>work', 'work>short']);
  });

  test('a finished break is not logged as a focus session', () => {
    const state = { ...createTimer(DEFAULT_SETTINGS), phase: 'short' as const, remainingMs: 5 * MIN };
    const done = tick(start(state, T0), DEFAULT_SETTINGS, T0 + 5 * MIN);
    expect(done.finished).toMatchObject({ phase: 'short' });
    expect(done.finished && 'minutes' in done.finished ? done.finished.minutes : null).toBe(5);
  });

  test('auto start runs the next phase straight away', () => {
    const settings = { ...DEFAULT_SETTINGS, autoStartNext: true };
    const done = tick(start(createTimer(settings), T0), settings, T0 + 25 * MIN);
    expect(done.timer.status).toBe('running');
    expect(remainingMs(done.timer, T0 + 27 * MIN)).toBe(3 * MIN);
  });

  test('skip moves to the next phase without logging a session; reset returns to a fresh work round', () => {
    const running = start(createTimer(DEFAULT_SETTINGS), T0);
    const skipped = skip(running, DEFAULT_SETTINGS);
    expect(skipped).toMatchObject({ phase: 'short', status: 'idle', cycle: 0 });
    const fresh = reset(skipped, DEFAULT_SETTINGS);
    expect(fresh).toMatchObject({ phase: 'work', status: 'idle', cycle: 0 });
  });

  test('changing the settings of an idle timer changes its time; a running one is left alone', () => {
    const settings = { ...DEFAULT_SETTINGS, workMinutes: 50 };
    expect(remainingMs(reset(createTimer(DEFAULT_SETTINGS), settings), T0)).toBe(50 * MIN);
  });
});

describe('reviving a saved timer', () => {
  test('a valid saved running timer comes back with its clock', () => {
    const saved = start(createTimer(DEFAULT_SETTINGS), T0);
    expect(reviveTimer(JSON.parse(JSON.stringify(saved)), DEFAULT_SETTINGS)).toEqual(saved);
  });

  test('rubbish falls back to a fresh timer', () => {
    expect(reviveTimer({ phase: 'nap' }, DEFAULT_SETTINGS)).toEqual(createTimer(DEFAULT_SETTINGS));
    expect(reviveTimer(null, DEFAULT_SETTINGS)).toEqual(createTimer(DEFAULT_SETTINGS));
    expect(reviveTimer({ phase: 'work', status: 'running', remainingMs: 1, endsAt: 'soon', startedAt: null, cycle: 0 }, DEFAULT_SETTINGS)).toEqual(createTimer(DEFAULT_SETTINGS));
  });
});

describe('summarizeSessions', () => {
  test('counts today and this week from completed sessions only', () => {
    const day = (offset: number, hour = 10) => new Date(2026, 10, 17 + offset, hour, 0, 0).getTime();
    const sessions = [
      { startedAt: day(0, 8), endedAt: day(0, 8) + 25 * MIN, minutes: 25 },
      { startedAt: day(0, 9), endedAt: day(0, 9) + 50 * MIN, minutes: 50 },
      { startedAt: day(-1), endedAt: day(-1) + 25 * MIN, minutes: 25 },
      { startedAt: day(-10), endedAt: day(-10) + 25 * MIN, minutes: 25 },
    ];
    const summary = summarizeSessions(sessions, day(0, 18));
    expect(summary.today).toEqual({ sessions: 2, minutes: 75 });
    expect(summary.week).toEqual({ sessions: 3, minutes: 100 });
    expect(summary.total).toEqual({ sessions: 4, minutes: 125 });
  });
});
