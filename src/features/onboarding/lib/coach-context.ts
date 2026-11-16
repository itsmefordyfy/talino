import type { ExperienceLevel, GoalId, InterestId, StyleId } from './options';
import type { AssessmentLevel, LearnerProfile } from './profile';

/**
 * What Tali is told about the learner's onboarding answers. Only ids and a few numbers: no name, no
 * free text, nothing that identifies a person. The server checks every field against the known lists
 * again (`sanitizeContext`), so a modified app can't put anything else in Tali's prompt.
 */
export type CoachProfileContext = {
  experience: ExperienceLevel | null;
  goals: GoalId[];
  interests: InterestId[];
  styles: StyleId[];
  dailyMinutes: number | null;
  skillLevel: AssessmentLevel | null;
  /** The title of the course the plan starts with, e.g. "Developer: Get Hired with AI". */
  startCourse: string | null;
};

export function buildCoachProfileContext(profile: LearnerProfile | null, startCourseTitle: string | null): CoachProfileContext | null {
  if (!profile || (!profile.experience && profile.goals.length === 0)) return null;
  return {
    experience: profile.experience,
    goals: profile.goals,
    interests: profile.interests,
    styles: profile.styles,
    dailyMinutes: profile.dailyMinutes,
    skillLevel: profile.assessment?.level ?? null,
    startCourse: startCourseTitle,
  };
}
