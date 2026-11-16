import { catalogFacts, getLearningPath, planForPath, type PathPlan } from '@/features/courses';

import { useLearnerSignals } from './use-learner-signals';

/** One learning path with the learner's progress through it; null when the path doesn't exist or none of its courses is published yet. */
export function usePathPlan(pathId: string): { plan: PathPlan | null; exists: boolean; isPending: boolean; isError: boolean; refetch: () => void } {
  const learner = useLearnerSignals();
  const path = getLearningPath(pathId);
  return { plan: path ? planForPath(path, learner.signals, catalogFacts()) : null, exists: !!path, isPending: learner.isPending, isError: learner.isError, refetch: learner.refetch };
}
