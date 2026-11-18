import { describe, expect, test } from '@jest/globals';

import { fullCatalog } from '../../courses/lib/full-catalog.test-helpers';
import { courseChoices } from './course-choices';
import { EMPTY_PROFILE, type LearnerProfile } from './profile';

const CATALOG = fullCatalog();
const profile = (patch: Partial<LearnerProfile>): LearnerProfile => ({ ...EMPTY_PROFILE, ...patch });

describe('the courses offered in onboarding', () => {
  test('offers real courses, the best match first and marked recommended, and always the free starter', () => {
    const ids = new Set(CATALOG.map((course) => course.id));
    for (const goal of ['freelance', 'teach', 'ai', 'frontend', 'from-scratch'] as const) {
      const choices = courseChoices(profile({ experience: 'beginner', goals: [goal] }), CATALOG);
      expect(choices.length).toBeGreaterThanOrEqual(2);
      expect(choices.every((choice) => ids.has(choice.id))).toBe(true);
      expect(choices.filter((choice) => choice.recommended)).toHaveLength(1);
      expect(choices[0].recommended).toBe(true);
      expect(choices.some((choice) => choice.id === 'starter' && choice.free)).toBe(true);
      expect(new Set(choices.map((choice) => choice.id)).size).toBe(choices.length);
    }
  });

  test('follows the goal: freelancing points at the freelancer course', () => {
    expect(courseChoices(profile({ experience: 'beginner', goals: ['freelance'] }), CATALOG)[0].id).toBe('freelancer');
  });

  test('respects the limit and still lists the starter', () => {
    const choices = courseChoices(profile({ experience: 'beginner', goals: ['freelance'] }), CATALOG, 3);
    expect(choices.length).toBeLessThanOrEqual(4);
    expect(choices.some((choice) => choice.id === 'starter')).toBe(true);
  });
});
