import { describe, expect, test } from '@jest/globals';

import { badgeDefinitions } from '@/features/courses/lib/badges';

import { displayTitle, earnedTitles, PROFILE_TITLES } from './unlocks';

describe('profile titles', () => {
  test('every title is earned by a real badge', () => {
    const ids = new Set(badgeDefinitions([]).map((badge) => badge.id));
    for (const title of PROFILE_TITLES) expect(ids.has(title.achievementId)).toBe(true);
  });

  test('earned from achievements, best first, falling back to the level title', () => {
    expect(earnedTitles([])).toEqual([]);
    expect(earnedTitles(['bug-hunter', 'master']).map((title) => title.title)).toEqual(['Talino Master', 'Bug Hunter']);
    expect(displayTitle('Curious Cub', [])).toBe('Curious Cub');
    expect(displayTitle('Curious Cub', ['streak-7'])).toBe('Consistency Champion');
  });
});
