import { describe, expect, test } from '@jest/globals';

import { lessonsThisWeek, recentLessons, weekFraction } from './dashboard';

const row = (lesson_id: string, completed_at: string | null) => ({ lesson_id, course_id: 'starter', completed_at });
const at = (year: number, month: number, day: number, hour = 12) => new Date(year, month - 1, day, hour).toISOString();

describe('lessonsThisWeek', () => {
  test('counts lessons from the last seven days, today included, and ignores older or unfinished ones', () => {
    const rows = [row('a', at(2026, 11, 13)), row('b', at(2026, 11, 7)), row('c', at(2026, 11, 6)), row('d', null), row('e', at(2026, 11, 20))];
    expect(lessonsThisWeek(rows, '2026-11-13')).toBe(2);
  });
});

describe('recentLessons', () => {
  test('newest first, finished only, limited', () => {
    const rows = [row('a', at(2026, 11, 10)), row('b', at(2026, 11, 13)), row('c', null), row('d', at(2026, 11, 12))];
    expect(recentLessons(rows, 2).map((entry) => entry.lesson_id)).toEqual(['b', 'd']);
  });
});

describe('weekFraction', () => {
  test('never passes a full bar and handles no target', () => {
    expect(weekFraction(3, 5)).toBeCloseTo(0.6);
    expect(weekFraction(9, 5)).toBe(1);
    expect(weekFraction(2, 0)).toBe(0);
  });
});
