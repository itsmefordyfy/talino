import { describe, expect, test } from '@jest/globals';

import { VISUALS } from './registry';

describe('visual registry', () => {
  test('every visual has a unique kebab-case id and the words a learner needs', () => {
    const ids = new Set<string>();
    for (const visual of VISUALS) {
      expect(visual.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(ids.has(visual.id)).toBe(false);
      ids.add(visual.id);
      expect(visual.title.length).toBeGreaterThan(2);
      expect(visual.summary.length).toBeGreaterThan(10);
      expect(visual.description.length).toBeGreaterThan(20);
      expect(visual.topics.length).toBeGreaterThan(0);
    }
  });
});
