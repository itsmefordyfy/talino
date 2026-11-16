import { describe, expect, test } from '@jest/globals';

import { COURSES } from '@/features/courses/content';
import { catalogFacts, type CourseFacts } from '@/features/courses/lib/catalog-facts';
import { EMPTY_FILTERS } from '@/features/courses/lib/discovery/filters';
import { runDiscovery } from '@/features/courses/lib/discovery/query';
import { SORT_OPTIONS } from '@/features/courses/lib/discovery/sort';
import { recommendCourses } from '@/features/courses/lib/recommendations';
import { FACTS, signalsFor } from '@/features/courses/lib/recommendations/recommendations.test-helpers';
import type { LearnerProfile } from '@/features/onboarding/lib/profile';

import { initialDiscoverState, isBrowsing } from '../discover-slice';

/**
 * "Personalize the experience, not the student's limitations": whatever a learner answered (or skipped), every published course stays reachable,
 * both by exploring all courses (no filters) and by searching its title. Run against the bundled catalog (every course in `COURSES`) and the
 * final catalog the other tests use, so it keeps holding as courses are added.
 */
const PROFILES: Record<string, Partial<LearnerProfile>> = {
  'complete beginner': { experience: 'complete-beginner', goals: ['from-scratch'], interests: ['not-sure'], dailyMinutes: 5 },
  'web-minded': { experience: 'intermediate', goals: ['frontend', 'full-stack'], interests: ['react', 'javascript', 'html-css'] },
  'mobile-minded': { experience: 'beginner', goals: ['mobile'], interests: ['react-native', 'expo'] },
  'AI enthusiast': { experience: 'intermediate', goals: ['ai'], interests: ['ai-coding', 'llm', 'rag'] },
  'experienced engineer': { experience: 'professional', goals: ['improve-skills', 'interview-prep'], interests: ['architecture', 'system-design'] },
  'explorer with unrelated interests': { experience: 'beginner', goals: ['explore-cs', 'game-dev'], interests: ['cybersecurity', 'networking', 'go'] },
  'skipped onboarding': {},
};

const CATALOGS: [string, readonly CourseFacts[]][] = [
  ['bundled catalog', catalogFacts()],
  ['final catalog', FACTS],
];

test('the bundled catalog lists every course in COURSES', () => {
  expect(catalogFacts().map((facts) => facts.id)).toEqual(COURSES.map((course) => course.id));
});

test('"Explore all courses" really is the results view with nothing filtered', () => {
  expect(isBrowsing({ ...initialDiscoverState, tab: 'all' })).toBe(true);
  expect(isBrowsing(initialDiscoverState, true)).toBe(false);
});

for (const [catalogName, facts] of CATALOGS) {
  describe(catalogName, () => {
    for (const [profileName, patch] of Object.entries(PROFILES)) {
      describe(`for a learner: ${profileName}`, () => {
        const signals = signalsFor(patch);
        const recommendedRank = new Map(recommendCourses(signals, facts, { scope: 'everything' }).map((entry, index) => [entry.facts.id, index]));

        test('Explore all lists every course, whichever sort is chosen', () => {
          for (const option of SORT_OPTIONS) {
            const result = runDiscovery(facts, { text: '', filters: EMPTY_FILTERS, sort: option.key }, { recommendedRank });
            expect(result.results.map((entry) => entry.id).sort()).toEqual(facts.map((entry) => entry.id).sort());
          }
        });

        test('searching a course by its title finds it, for every course', () => {
          const missing = facts.filter((entry) => !runDiscovery(facts, { text: entry.course.title, filters: EMPTY_FILTERS, sort: 'recommended' }, { recommendedRank }).results.some((found) => found.id === entry.id)).map((entry) => entry.id);
          expect(missing).toEqual([]);
        });
      });
    }
  });
}
