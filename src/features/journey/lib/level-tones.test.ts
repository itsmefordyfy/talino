import { describe, expect, test } from '@jest/globals';

import { LevelTones, Tones } from '@/constants/theme';

import { LEVEL_TONE } from './level-tones';

describe('every level has its own color', () => {
  const levels = ['beginner', 'intermediate', 'advanced', 'expert'] as const;

  test('four levels, four different tones, the same ones the banners, the map and Discover use', () => {
    const tones = levels.map((level) => LEVEL_TONE[level].tone);
    expect(new Set(tones).size).toBe(4);
    expect(tones).toEqual(levels.map((level) => LevelTones[level]));
  });

  test('each tone looks different from the others in light and dark (its fill and its soft tile)', () => {
    for (const set of [Tones.light, Tones.dark]) {
      const solids = levels.map((level) => set[LevelTones[level]].solid);
      const softs = levels.map((level) => set[LevelTones[level]].soft);
      expect(new Set(solids).size).toBe(4);
      expect(new Set(softs).size).toBe(4);
    }
  });
});
