import { describe, expect, test } from '@jest/globals';

import { badgeDefinitions } from './badges';
import { BADGE_COPY_FIL } from './badge-strings';
import { makeCourse } from './fixtures.test-helpers';

const courses = [makeCourse('starter', 2, [], 'starter'), makeCourse('mini-python-ai', 1, [], 'mini'), makeCourse('ai-dev-intro', 1, [], 'path')];

describe('badge text in both languages', () => {
  const en = badgeDefinitions(courses, 'en');
  const fil = badgeDefinitions(courses, 'fil');

  test('same ids, icons and tones in the same order (ids are stored and synced)', () => {
    expect(fil.map((badge) => [badge.id, badge.icon, badge.tone])).toEqual(en.map((badge) => [badge.id, badge.icon, badge.tone]));
  });

  test('every fixed badge has a Tagalog title and description', () => {
    const fixed = en.filter((badge) => !badge.id.includes(':'));
    for (const badge of fixed) {
      expect(BADGE_COPY_FIL[badge.id]).toBeDefined();
      const tagalog = fil.find((entry) => entry.id === badge.id);
      expect(tagalog?.title.length).toBeGreaterThan(0);
      expect(tagalog?.description.length).toBeGreaterThan(0);
    }
    expect(Object.keys(BADGE_COPY_FIL).sort()).toEqual(fixed.map((badge) => badge.id).sort());
  });

  test('course badges carry the course title and the targets', () => {
    expect(fil.find((badge) => badge.id === 'mini:mini-python-ai')?.description).toBe('Tapusin ang mini-python-ai mini-course.');
    expect(fil.find((badge) => badge.id === 'bug-hunter')?.description).toContain('10');
    expect(en.find((badge) => badge.id === 'first-lesson')?.title).toBe('First lesson');
  });
});
