import type { AudienceId } from '@/features/courses/content/types';

import type { LearnerProfile } from './profile';

/**
 * The older single "goal" the app also keeps (it picks a course in the starter quiz and gives Tali
 * context), worked out from the richer answers so the two never disagree.
 */
export function audienceFor(profile: Pick<LearnerProfile, 'experience' | 'goals'>): AudienceId {
  const goals = profile.goals;
  if (goals.includes('teach')) return 'educator';
  if (goals.includes('freelance')) return 'career-changer';
  if (profile.experience === 'advanced' || profile.experience === 'professional' || goals.includes('improve-skills') || goals.includes('interview-prep')) return 'experienced-dev';
  if (goals.includes('build-startup') || (profile.experience === 'complete-beginner' && goals.includes('from-scratch'))) return 'builder';
  return 'fresh-grad';
}
