import type { InterestId } from '@/features/onboarding/lib/options';
import type { CategoryId } from '@/features/courses/content/types';
import type { RecommendationReason } from '@/features/courses/lib/recommendations';

import type { DiscoverStrings } from '../strings';

/** What a reason needs from outside to be said in words: titles and labels, so this file stays pure. */
export type ReasonLookups = {
  courseTitle: (courseId: string) => string | undefined;
  interestLabel: (interest: InterestId) => string;
  technologyLabel: (technology: string) => string;
  categoryLabel: (category: CategoryId) => string;
};

/** One reason in words ("Because you want to become a software engineer"), or null when it cannot be said honestly. */
export function reasonText(reason: RecommendationReason, strings: DiscoverStrings['reasons'], lookups: ReasonLookups): string | null {
  switch (reason.kind) {
    case 'goal':
      return strings.goals[reason.goal] ?? null;
    case 'interest':
      return strings.interest(lookups.interestLabel(reason.interest));
    case 'next-after': {
      const title = lookups.courseTitle(reason.courseId);
      return title ? strings.nextAfter(title) : null;
    }
    case 'explored':
      return strings.explored(lookups.technologyLabel(reason.technology));
    case 'prepares-for': {
      const title = lookups.courseTitle(reason.courseId);
      return title ? strings.preparesFor(title) : null;
    }
    case 'level':
      return reason.fit === 'foundation' ? strings.levelFoundation : reason.fit === 'matches-experience' ? strings.levelMatches : strings.levelStretch;
    case 'quiz':
      return reason.trend === 'strengthen' ? strings.quizStrengthen(lookups.categoryLabel(reason.category)) : strings.quizReady(lookups.categoryLabel(reason.category));
    case 'short':
      return strings.short(reason.minutes);
    case 'foundation':
      return strings.foundation;
  }
}

/** The one line to show under a card: the strongest reason the engine gave that has words. Null when there is none (nothing is made up). */
export function reasonLine(reasons: readonly RecommendationReason[], strings: DiscoverStrings['reasons'], lookups: ReasonLookups): string | null {
  for (const reason of reasons) {
    const text = reasonText(reason, strings, lookups);
    if (text) return text;
  }
  return null;
}
