import { catalogFacts, useLearning } from '@/features/courses';
import { useProfile } from '@/features/onboarding';
import { EMPTY_PROFILE } from '@/features/onboarding/lib/profile';
import { signalsFrom, type LearnerSignals } from '@/features/courses/lib/recommendations';
import { useAppSelector } from '@/store/hooks';

import { selectExploredTechnologies } from '../discover-slice';
import { isPersonalized, lastActivityByCourse } from '../lib/learner';

export type LearnerState = {
  signals: LearnerSignals;
  /** The learner told us something that shapes recommendations (experience, a goal, or a real interest). */
  personalized: boolean;
  isPending: boolean;
  isError: boolean;
  refetch: () => void;
};

/**
 * Everything the recommendations know about the learner: their saved onboarding answers (the empty profile when they skipped
 * it), the real course progress and the technologies they have explored. It follows all three as they change.
 */
export function useLearnerSignals(): LearnerState {
  const profile = useProfile();
  const learning = useLearning();
  const explored = useAppSelector(selectExploredTechnologies);
  const saved = profile.data ?? EMPTY_PROFILE;
  const signals = signalsFrom(saved, learning.progress, { facts: catalogFacts(), lastActivityAt: lastActivityByCourse(learning.data?.lessons ?? []), exploredTechnologies: explored });
  return {
    signals,
    personalized: isPersonalized(saved),
    isPending: profile.isPending || learning.isPending,
    isError: learning.isError,
    refetch: () => {
      void learning.refetch();
      if (profile.isError) void profile.refetch();
    },
  };
}
