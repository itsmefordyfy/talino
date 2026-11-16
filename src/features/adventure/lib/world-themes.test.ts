import { describe, expect, test } from '@jest/globals';

import glyphs from '@/components/ui/material-symbols.json';
import { COURSES } from '@/features/courses/content';
import { CATALOG_SYLLABUS } from '@/features/courses/content/catalog/syllabus';

import { worldThemeFor, WORLD_THEMES } from './world-themes';

describe('world themes', () => {
  test('every real course has a world with a name, icon, tone and a two-line story', () => {
    for (const course of COURSES) {
      const theme = WORLD_THEMES[course.id];
      expect(theme).toBeDefined();
      expect(theme.name.length).toBeGreaterThan(2);
      expect(['violet', 'indigo', 'mint']).toContain(theme.tone);
      expect(theme.story.premise.length).toBeGreaterThan(10);
      expect(theme.story.mission.length).toBeGreaterThan(10);
    }
    // A world may exist before its course is registered (a planned course); a world never names a course that does not exist anywhere.
    const known = new Set([...COURSES.map((course) => course.id), ...CATALOG_SYLLABUS.map((entry) => entry.id)]);
    for (const id of Object.keys(WORLD_THEMES)) expect(known.has(id)).toBe(true);
    for (const entry of CATALOG_SYLLABUS) expect(WORLD_THEMES[entry.id]).toBeDefined();
  });

  test('every icon is a real Material Symbol and every world name is unique', () => {
    const glyphMap = glyphs as Record<string, number>;
    for (const theme of Object.values(WORLD_THEMES)) expect(glyphMap[theme.icon]).toBeDefined();
    const names = Object.values(WORLD_THEMES).map((theme) => theme.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test('the stories make no claim about course content (no numbers, no tools named)', () => {
    for (const theme of Object.values(WORLD_THEMES)) {
      const text = `${theme.story.premise} ${theme.story.mission}`;
      expect(text).not.toMatch(/\d/);
    }
  });

  test('a course with no theme still gets a plain world', () => {
    const theme = worldThemeFor({ id: 'future', kind: 'mini', title: 'Future course', icon: 'code' });
    expect(theme.name).toBe('Future course');
    expect(theme.tone).toBe('mint');
  });
});
