import { describe, expect, test } from '@jest/globals';

import { catalogIndex } from './catalog-index';
import { matchTarget } from './match';
import { INTEREST_TARGETS } from './profile-mapping';
import { FACTS } from './recommendations.test-helpers';

const index = catalogIndex(FACTS);
const course = (id: string) => {
  const found = FACTS.find((fact) => fact.id === id);
  if (!found) throw new Error(`no course ${id}`);
  return found;
};

describe('a tool most courses use is not what a course is about', () => {
  test('an interest in generative AI is not matched by the productivity and soft-skills courses that merely list the same chat tools', () => {
    for (const id of ['time-management-productivity', 'soft-skills-workplace']) {
      const match = matchTarget(course(id), INTEREST_TARGETS.genai, index.rarity);
      expect(match.direct).toBe(false);
      expect(match.total).toBeLessThan(2);
    }
  });

  test('the same interest still finds the courses that are about it', () => {
    const match = matchTarget(course('generative-ai-applications'), INTEREST_TARGETS.genai, index.rarity);
    expect(match.direct).toBe(true);
    expect(match.total).toBeGreaterThan(6);
  });

  test('a rare technology still makes a course "about" it', () => {
    const python = matchTarget(course('mini-python-ai'), INTEREST_TARGETS.python, index.rarity);
    expect(python.direct).toBe(true);
  });
});
