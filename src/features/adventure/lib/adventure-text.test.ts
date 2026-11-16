import { describe, expect, test } from '@jest/globals';

import { COURSES } from '@/features/courses/content';

import { LEVEL_TITLES_FIL, PROFILE_TITLES_FIL, WORLD_TEXT_FIL } from './adventure-text';
import { earnedTitles, PROFILE_TITLES } from './unlocks';
import { summaryChanges } from './summary';
import { LEVEL_TITLES, levelTitle } from './xp';
import { WORLD_THEMES, worldThemeFor } from './world-themes';

describe('adventure text in Tagalog', () => {
  test('a title for every level and profile title', () => {
    expect(LEVEL_TITLES_FIL).toHaveLength(LEVEL_TITLES.length);
    expect(Object.keys(PROFILE_TITLES_FIL).sort()).toEqual(PROFILE_TITLES.map((entry) => entry.id).sort());
    expect(levelTitle(1, 'fil')).toBe(LEVEL_TITLES_FIL[0]);
    expect(levelTitle(99, 'fil')).toBe(LEVEL_TITLES_FIL[9]);
    expect(levelTitle(1)).toBe('Curious Cub');
  });

  test('every world has Tagalog text and the same icon and tone', () => {
    expect(Object.keys(WORLD_TEXT_FIL).sort()).toEqual(Object.keys(WORLD_THEMES).sort());
    for (const course of COURSES) {
      const en = worldThemeFor(course);
      const fil = worldThemeFor(course, 'fil');
      expect([fil.icon, fil.tone]).toEqual([en.icon, en.tone]);
      expect(fil.story.premise.length).toBeGreaterThan(0);
      if (!WORLD_THEMES[course.id]) expect(fil.story.premise).toContain(course.title);
    }
  });

  test('titles and the summary follow the language', () => {
    expect(earnedTitles(['course-complete'], 'fil')[0].title).toBe('Graduate');
    expect(summaryChanges({ totalXp: 200, missionXp: 190, newAchievements: [], language: 'fil' }).levelUp?.title).toBe(LEVEL_TITLES_FIL[1]);
  });
});
