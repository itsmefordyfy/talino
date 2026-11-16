import { describe, expect, test } from '@jest/globals';

import { computeStreak } from './streak';

describe('computeStreak', () => {
  test('counts today and the days before it', () => {
    expect(computeStreak(['2026-11-11', '2026-11-12', '2026-11-13'], '2026-11-13')).toEqual({ current: 3, best: 3, doneToday: true });
  });

  test('stays alive until today ends', () => {
    expect(computeStreak(['2026-11-11', '2026-11-12'], '2026-11-13')).toEqual({ current: 2, best: 2, doneToday: false });
  });

  test('a missed day resets the current streak but keeps the best', () => {
    expect(computeStreak(['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-12'], '2026-11-14')).toEqual({ current: 0, best: 4, doneToday: false });
  });

  test('crosses month ends', () => {
    expect(computeStreak(['2026-10-31', '2026-11-01'], '2026-11-01').current).toBe(2);
  });

  test('nothing learned yet', () => {
    expect(computeStreak([], '2026-11-13')).toEqual({ current: 0, best: 0, doneToday: false });
  });
});
