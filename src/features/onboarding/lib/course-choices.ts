import type { Course } from '@/features/courses/content/types';

import type { LearnerProfile } from './profile';
import { rankCourses } from './plan';

const STARTER = 'starter';

export type CourseChoice = { id: string; /** The best match for the answers so far: marked "Recommended". */ recommended: boolean; free: boolean };

/**
 * The courses offered in onboarding's "What do you want to learn?" step: the best matches for the answers so far, best first, and always
 * the free starter course (last, if it isn't among them), so a learner who doesn't want a paid course can still pick one and go on.
 * Pure: ids come from the catalog it is given, so a course that doesn't exist is never offered.
 */
export function courseChoices(profile: LearnerProfile, catalog: readonly Course[], limit = 5): CourseChoice[] {
  const byId = new Map(catalog.map((course) => [course.id, course]));
  const ranked = rankCourses(profile, catalog).filter((entry) => byId.has(entry.id));
  const top = ranked.slice(0, limit).map((entry) => entry.id);
  const ids = top.includes(STARTER) || !byId.has(STARTER) ? top : [...top, STARTER];
  return ids.map((id, index) => ({ id, recommended: index === 0, free: byId.get(id)?.kind === 'starter' }));
}
