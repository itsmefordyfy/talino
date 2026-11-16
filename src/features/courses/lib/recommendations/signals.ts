import type { CategoryId } from '../../content/types';
import type { AssessmentLevel, LearnerProfile } from '../../../onboarding/lib/profile';
import type { ExperienceLevel, GoalId, InterestId, StyleId } from '../../../onboarding/lib/options';
import type { CourseFacts } from '../catalog-facts';
import type { CourseProgress } from '../progress';

/**
 * Everything the recommendations know about one learner, in one plain object: what they said in onboarding and what they
 * have actually done. Pure data, so the same signals always give the same suggestions, and changing an answer never touches
 * progress (a completed or started course stays exactly as it was).
 */
export type StartedCourse = { fraction: number; lastActivityAt?: string };

export type LearnerSignals = {
  experience: ExperienceLevel | null;
  goals: readonly GoalId[];
  interests: readonly InterestId[];
  styles: readonly StyleId[];
  dailyMinutes: number | null;
  assessmentLevel: AssessmentLevel | null;
  completed: ReadonlySet<string>;
  /** Courses with progress that are not complete, by id. */
  started: ReadonlyMap<string, StartedCourse>;
  /** Correct answers over questions answered in each category's courses, 0 to 1 (only categories with a quiz taken). */
  quizAverageByCategory?: ReadonlyMap<CategoryId, number>;
  /** How many times the learner opened courses of each technology (the app records this); a curiosity signal. */
  exploredTechnologies?: Readonly<Record<string, number>>;
};

export type SignalProfile = Pick<LearnerProfile, 'experience' | 'goals' | 'interests' | 'styles' | 'dailyMinutes'> & { assessment: Pick<NonNullable<LearnerProfile['assessment']>, 'level'> | null };

/** The parts of a course's progress the recommendations read. */
export type SignalProgress = Pick<CourseProgress, 'courseId' | 'fraction' | 'complete' | 'started' | 'quizAverage' | 'lessonsDone'>;

export type SignalExtras = {
  /** The catalog's facts, to work out the quiz average per category from each course's own average. */
  facts?: readonly CourseFacts[];
  /** When each course was last worked on (ISO), for "continue learning" order; `progress` doesn't carry it. */
  lastActivityAt?: Readonly<Record<string, string>> | ReadonlyMap<string, string>;
  exploredTechnologies?: Readonly<Record<string, number>>;
};

function activityOf(source: SignalExtras['lastActivityAt'], courseId: string): string | undefined {
  if (!source) return undefined;
  return source instanceof Map ? source.get(courseId) : (source as Readonly<Record<string, string>>)[courseId];
}

/** Builds the signals from the onboarding profile and the real course progress. */
export function signalsFrom(profile: SignalProfile, progressList: readonly SignalProgress[], extras: SignalExtras = {}): LearnerSignals {
  const completed = new Set<string>();
  const started = new Map<string, StartedCourse>();
  const quizTotals = new Map<CategoryId, { weighted: number; weight: number }>();
  const categoryOf = new Map((extras.facts ?? []).map((facts) => [facts.id, facts.category]));

  for (const progress of progressList) {
    if (progress.complete) completed.add(progress.courseId);
    else if (progress.started) started.set(progress.courseId, { fraction: progress.fraction, lastActivityAt: activityOf(extras.lastActivityAt, progress.courseId) });
    const category = categoryOf.get(progress.courseId);
    if (category && progress.quizAverage !== null && progress.lessonsDone > 0) {
      // A course's average is over its lessons' quizzes, so the lessons done are its weight when courses are combined.
      const entry = quizTotals.get(category) ?? { weighted: 0, weight: 0 };
      entry.weighted += progress.quizAverage * progress.lessonsDone;
      entry.weight += progress.lessonsDone;
      quizTotals.set(category, entry);
    }
  }

  return {
    experience: profile.experience,
    goals: profile.goals,
    interests: profile.interests,
    styles: profile.styles,
    dailyMinutes: profile.dailyMinutes,
    assessmentLevel: profile.assessment?.level ?? null,
    completed,
    started,
    quizAverageByCategory: new Map([...quizTotals].map(([category, entry]) => [category, entry.weighted / entry.weight])),
    exploredTechnologies: extras.exploredTechnologies,
  };
}
