import { describe, expect, test } from '@jest/globals';

import { clampMinutes, formatClock, formatCountdown, formatDuration, parseClock, snap } from './time';

describe('time helpers', () => {
  test('parseClock reads 24-hour times and rejects nonsense', () => {
    expect(parseClock('09:30')).toBe(570);
    expect(parseClock('9:05')).toBe(545);
    expect(parseClock('24:00')).toBe(1440);
    expect(parseClock('24:30')).toBeNull();
    expect(parseClock('9.30')).toBeNull();
    expect(parseClock('12:75')).toBeNull();
  });

  test('formatClock shows 12-hour and 24-hour', () => {
    expect(formatClock(570)).toBe('9:30 AM');
    expect(formatClock(0)).toBe('12:00 AM');
    expect(formatClock(720)).toBe('12:00 PM');
    expect(formatClock(13 * 60 + 5)).toBe('1:05 PM');
    expect(formatClock(570, false)).toBe('09:30');
  });

  test('formatDuration is compact', () => {
    expect(formatDuration(45)).toBe('45 min');
    expect(formatDuration(120)).toBe('2 h');
    expect(formatDuration(90)).toBe('1 h 30 min');
    expect(formatDuration(-5)).toBe('0 min');
  });

  test('formatCountdown rounds up so the timer never shows 0:00 early', () => {
    expect(formatCountdown(25 * 60_000)).toBe('25:00');
    expect(formatCountdown(59_001)).toBe('1:00');
    expect(formatCountdown(500)).toBe('0:01');
    expect(formatCountdown(0)).toBe('0:00');
    expect(formatCountdown(-10)).toBe('0:00');
  });

  test('snap and clamp keep the planner on the grid and inside the day', () => {
    expect(snap(562)).toBe(555);
    expect(snap(568)).toBe(570);
    expect(clampMinutes(-5)).toBe(0);
    expect(clampMinutes(2000)).toBe(1440);
  });
});
