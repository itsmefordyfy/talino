import { COURSES, useLearning } from '@/features/courses/data';
import { useAccess } from '@/features/store';
import { goalChanged } from '@/features/settings/settings-slice';
import { useAppDispatch } from '@/store/hooks';

import { audienceFor } from '../lib/audience';
import { buildPlan, type LearningPlan, type PlanContext } from '../lib/plan';
import type { ExperienceLevel } from '../lib/options';
import { EMPTY_PROFILE, REQUIRED_FOR_PLAN, type LearnerProfile, type StoredProfile } from '../lib/profile';
import { useProfile, useSaveProfile } from './use-learner-level';

export { profileKey, useLearnerLevel, useProfile, useSaveProfile, type LearnerLevel } from './use-learner-level';

/**
 * The personalized plan for the saved profile, recomputed from the real course progress and purchases,
 * so it follows the learner as they finish lessons or buy a course. `plan` is null until the learner has
 * answered what a plan needs (experience and at least one goal).
 */
export function usePlanner(): { planFor: (profile: LearnerProfile) => LearningPlan | null; isPending: boolean } {
  const learning = useLearning();
  const access = useAccess();
  const context: PlanContext = {
    owns: (id) => access.owns(id),
    nextLesson: (id) => {
      const lesson = learning.progressFor(id)?.nextLesson;
      return lesson ? { id: lesson.id, title: lesson.title, day: lesson.day } : null;
    },
    complete: (id) => !!learning.progressFor(id)?.complete,
    progress: learning.progress,
  };
  return { planFor: (profile) => (REQUIRED_FOR_PLAN(profile) && !learning.isPending ? buildPlan(profile, COURSES, context) : null), isPending: learning.isPending };
}

/** The saved profile and its plan. `plan` is null until experience and a goal are answered. */
export function useLearningPlan(): { profile: StoredProfile | null; plan: LearningPlan | null; isPending: boolean } {
  const profile = useProfile();
  const planner = usePlanner();
  const stored = profile.data ?? null;
  return { profile: stored, plan: stored ? planner.planFor(stored) : null, isPending: profile.isPending || planner.isPending };
}

/**
 * Changes the learner's level, from anywhere, and saves it at once. It replaces any earlier skill-check result (an explicit choice
 * wins over an estimate), refreshes the stored plan and the older single goal, and never touches progress, badges or certificates:
 * lessons already finished stay finished, and every best score is kept.
 */
export function useSetLearnerLevel() {
  const profile = useProfile();
  const save = useSaveProfile();
  const planner = usePlanner();
  const dispatch = useAppDispatch();
  return {
    setLevel: (level: ExperienceLevel) => {
      const merged: LearnerProfile = { ...(profile.data ?? EMPTY_PROFILE), experience: level, assessment: null };
      const plan = planner.planFor(merged);
      save.mutate({ experience: level, assessment: null, plan: plan ? { startCourseId: plan.startCourse.id, nextCourseIds: plan.nextCourses.map((course) => course.id), generatedAt: new Date().toISOString() } : null, status: 'completed' });
      if (merged.goals.length > 0) dispatch(goalChanged(audienceFor(merged)));
    },
    isSaving: save.isPending,
  };
}
