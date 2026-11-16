import type { Language } from '@/lib/i18n';

import type { CourseFacts } from '../catalog-facts';
import { LEARNING_LEVEL_INDEX } from '../learning-level';
import { SORT_TEXT_FIL } from './discovery-text';

/**
 * There is deliberately no "Most popular": Talino has no accounts and no shared enrollment numbers, and ranking by anything else
 * would be a guess presented as popularity. Add it here only once real usage data exists.
 */
export type SortKey = 'recommended' | 'newest' | 'shortest' | 'longest' | 'beginner-friendly';

export const SORT_OPTIONS: readonly { key: SortKey; label: string; description: string }[] = [
  { key: 'recommended', label: 'Recommended', description: 'The courses that fit your goals first; with a search, the best match first.' },
  { key: 'newest', label: 'Recently added', description: 'The most recently added courses first.' },
  { key: 'shortest', label: 'Shortest', description: 'Fewest lesson minutes first.' },
  { key: 'longest', label: 'Longest', description: 'Most lesson minutes first.' },
  { key: 'beginner-friendly', label: 'Beginner friendly', description: 'Beginner level first, then courses with the fewest prerequisites, then the shorter ones.' },
];

/** The sort choices with their words in the learner's language (English by default); keys never change. */
export function sortOptions(language: Language = 'en'): readonly { key: SortKey; label: string; description: string }[] {
  return language === 'fil' ? SORT_OPTIONS.map((option) => ({ ...option, ...(SORT_TEXT_FIL[option.key] ?? {}) })) : SORT_OPTIONS;
}

export const DEFAULT_SORT: SortKey = 'recommended';

export type SortContext = {
  /** Course id to rank (0 is best), from the recommendation engine. A course with no rank comes after every ranked one. */
  recommendedRank?: ReadonlyMap<string, number>;
};

/** Position in a rank map; a course the engine did not rank sorts after the ranked ones. */
export function rankOf(context: SortContext, courseId: string): number {
  return context.recommendedRank?.get(courseId) ?? Number.POSITIVE_INFINITY;
}

function compareFor(sort: SortKey, context: SortContext): (a: CourseFacts, b: CourseFacts) => number {
  switch (sort) {
    case 'recommended':
      return (a, b) => {
        const ra = rankOf(context, a.id);
        const rb = rankOf(context, b.id);
        // Infinity - Infinity is NaN, so two unranked courses compare as equal explicitly.
        return ra === rb ? 0 : ra < rb ? -1 : 1;
      };
    case 'newest':
      return (a, b) => (a.published === b.published ? 0 : a.published < b.published ? 1 : -1);
    case 'shortest':
      return (a, b) => a.minutes - b.minutes;
    case 'longest':
      return (a, b) => b.minutes - a.minutes;
    case 'beginner-friendly':
      return (a, b) => LEARNING_LEVEL_INDEX[a.learningLevel] - LEARNING_LEVEL_INDEX[b.learningLevel] || a.prerequisites.length - b.prerequisites.length || a.minutes - b.minutes;
  }
}

/**
 * A new array, sorted. Stable: courses that tie keep the order they came in, so pass them in catalog order and ties stay in
 * catalog order. `recommended` with no ranks leaves the order untouched.
 */
export function sortCourses(items: readonly CourseFacts[], sort: SortKey, context: SortContext = {}): CourseFacts[] {
  return [...items].sort(compareFor(sort, context));
}
