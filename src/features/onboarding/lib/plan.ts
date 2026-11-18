import type { Course } from '@/features/courses/content/types';

// The recommendation engine and the catalog facts are pure modules, imported by path: the courses feature's index also
// exports screens, which a plan (and its tests) must not pull in.
import { buildCourseFacts, type CourseFacts } from '../../courses/lib/catalog-facts';
import type { SignalProgress } from '../../courses/lib/recommendations';
import { catalogIndex } from '../../courses/lib/recommendations/catalog-index';
import { goalCoverage, topicCoverage, type TopicInterestId } from '../../courses/lib/recommendations/profile-mapping';
import { recommendCourses } from '../../courses/lib/recommendations/recommend';
import { relevanceReasons } from '../../courses/lib/recommendations/score';
import { signalsFrom, type LearnerSignals } from '../../courses/lib/recommendations/signals';
import { effectiveExperience } from './assessment';
import type { DailyMinutes, ExperienceLevel, GoalId, InterestId, TimeOfDay } from './options';
import { NOT_SURE } from './options';
import type { AssessmentLevel, LearnerProfile } from './profile';

/**
 * The personalized learning plan, worked out from the learner profile and the real course catalog.
 * Pure: the same profile and catalog always give the same plan, so it can be recomputed whenever the
 * answers, the progress or the purchases change, and nothing is ever deleted by a change of answers.
 *
 * Which courses suit the learner is decided by the recommendation engine (`courses/lib/recommendations`), which matches the
 * answers against each course's catalog metadata: no course id is named here, so a new course can be the start of a plan the
 * day it is added. Every id it returns is looked up in the catalog it was given: a course that doesn't exist is never
 * recommended, and a topic without a course is said to be coming soon (or related to the nearest one).
 */

export type CatalogCourse = Pick<Course, 'id' | 'kind' | 'title' | 'tagline' | 'audiences' | 'skills' | 'icon'> & {
  lessons: readonly { id: string; title: string; day: number }[];
  projects: readonly { id: string; title: string }[];
};

const STARTER = 'starter';

export type TopicStatus = 'course' | 'related' | 'soon';
export type TopicCoverage = { interest: InterestId; status: TopicStatus; courseId: string | null };

const factsCache = new WeakMap<readonly Course[], readonly CourseFacts[]>();
/** The catalog's facts, built once per catalog array (the app's `COURSES` is one stable array). */
function factsOf(catalog: readonly Course[]): readonly CourseFacts[] {
  let facts = factsCache.get(catalog);
  if (!facts) {
    facts = buildCourseFacts(catalog);
    factsCache.set(catalog, facts);
  }
  return facts;
}

export type PlanReason =
  | { kind: 'goal'; goal: GoalId }
  | { kind: 'interest'; interest: InterestId }
  | { kind: 'experience'; level: ExperienceLevel }
  | { kind: 'assessment'; level: AssessmentLevel; raised: boolean };

export type FirstStep =
  /** A specific lesson to open now. */
  | { kind: 'lesson'; courseId: string; lessonId: string; lessonTitle: string; day: number; free: boolean }
  /** No lesson left to open (everything started is done): the course page. */
  | { kind: 'course'; courseId: string };

export type PlanSchedule = {
  minutesPerDay: number;
  daysPerWeek: number;
  days: number[];
  timeOfDay: TimeOfDay | null;
  /** A lesson is about 15 minutes with its task. */
  lessonsPerWeek: number;
  /** Weeks to finish the starting course at this pace. */
  weeksToFinish: number;
};

export type LearningPlan = {
  experience: ExperienceLevel;
  startCourse: CatalogCourse;
  /** The first step is the free AI Basics course because the starting course isn't owned yet. */
  startsWithFree: boolean;
  firstStep: FirstStep;
  nextCourses: CatalogCourse[];
  skills: string[];
  projects: { courseId: string; id: string; title: string }[];
  topics: TopicCoverage[];
  /** Goals the learner picked that have no dedicated course yet. */
  comingSoonGoals: GoalId[];
  schedule: PlanSchedule;
  reasons: PlanReason[];
};

export type PlanContext = {
  owns: (courseId: string) => boolean;
  /** The next lesson to do in a course, or null when there isn't one. */
  nextLesson: (courseId: string) => { id: string; title: string; day: number } | null;
  complete: (courseId: string) => boolean;
  /** The real progress of every course, for the engine's "started" and quiz signals; optional (a plan works from `complete` alone). */
  progress?: readonly SignalProgress[];
};

const NOTHING_YET: PlanContext = { owns: (id) => id === STARTER, nextLesson: () => null, complete: () => false };

const LESSON_MINUTES = 15;

export function scheduleFor(profile: Pick<LearnerProfile, 'dailyMinutes' | 'days' | 'timeOfDay' | 'weeklyGoal'>, lessonCount: number): PlanSchedule {
  const minutes = profile.dailyMinutes ?? 15;
  const daysPerWeek = profile.days.length > 0 ? profile.days.length : minutes >= 30 ? 5 : 7;
  // Two lessons a day at most, however long the session: the idea is steady, not heavy.
  const perDay = Math.min(2, minutes / LESSON_MINUTES);
  const fromTime = Math.max(1, Math.round(daysPerWeek * perDay));
  const lessonsPerWeek = profile.weeklyGoal ?? fromTime;
  return { minutesPerDay: minutes, daysPerWeek, days: profile.days, timeOfDay: profile.timeOfDay, lessonsPerWeek, weeksToFinish: Math.max(1, Math.ceil(lessonCount / lessonsPerWeek)) };
}

/** What the plan knows about the learner: the answers plus what they have completed or started. */
function signalsForPlan(profile: LearnerProfile, catalog: readonly Course[], facts: readonly CourseFacts[], context: PlanContext): LearnerSignals {
  const given = new Map((context.progress ?? []).map((entry) => [entry.courseId, entry]));
  const progress: SignalProgress[] = [];
  for (const course of catalog) {
    const known = given.get(course.id);
    if (context.complete(course.id)) progress.push({ courseId: course.id, fraction: 1, complete: true, started: true, quizAverage: known?.quizAverage ?? null, lessonsDone: known?.lessonsDone ?? course.lessons.length });
    else if (known) progress.push({ ...known, complete: false });
  }
  return signalsFrom(
    { ...profile, experience: profile.experience ?? 'complete-beginner' },
    progress,
    { facts },
  );
}

/** Which courses the profile points at, strongest first, as ids present in the catalog. Every course is listed; none is dropped. */
export function rankCourses(profile: LearnerProfile, catalog: readonly Course[]): { id: string; score: number }[] {
  const facts = factsOf(catalog);
  const signals = signalsFrom({ ...profile, experience: profile.experience ?? 'complete-beginner' }, [], { facts });
  return recommendCourses(signals, facts, { scope: 'everything' }).map((entry) => ({ id: entry.facts.id, score: entry.score }));
}

export type PlanOptions = {
  /** The course the learner picked in onboarding: it starts the plan in place of the engine's best match (unless it is already finished or isn't in the catalog). */
  preferredStartId?: string | null;
};

export function buildPlan(profile: LearnerProfile, catalog: readonly Course[], context: PlanContext = NOTHING_YET, options: PlanOptions = {}): LearningPlan {
  const declared = profile.experience ?? 'complete-beginner';
  const experience = effectiveExperience(declared, profile.assessment?.level ?? null);
  const byId = new Map(catalog.map((course) => [course.id, course]));
  const facts = factsOf(catalog);
  const signals = signalsForPlan(profile, catalog, facts, context);

  // The course to learn first: the best match that isn't finished (one already begun may be it). A finished course falls
  // through to the next; if everything is finished the best match overall is shown.
  const candidates = recommendCourses(signals, facts, { scope: 'next', includeStarted: true });
  const preferred = options.preferredStartId && !context.complete(options.preferredStartId) ? recommendCourses(signals, facts, { scope: 'everything' }).find((entry) => entry.facts.id === options.preferredStartId) : undefined;
  const startEntry = preferred ?? candidates.find((entry) => entry.relevance > 0) ?? candidates[0] ?? recommendCourses(signals, facts, { scope: 'everything' })[0];
  const startCourse = byId.get(startEntry.facts.id) as Course;
  const nextCourses = candidates
    .filter((entry) => entry.facts.id !== startCourse.id && entry.relevance > 0)
    .slice(0, 3)
    .map((entry) => byId.get(entry.facts.id) as Course);

  const starter = byId.get(STARTER);
  const startOwned = startCourse.kind === 'starter' || context.owns(startCourse.id);
  let firstStep: FirstStep;
  let startsWithFree = false;
  const ownLesson = startOwned ? context.nextLesson(startCourse.id) : null;
  const firstLesson = startCourse.lessons[0];
  const freeLessonOpen = !startOwned && !!firstLesson && !context.complete(startCourse.id) && (context.nextLesson(startCourse.id) ?? firstLesson).id === firstLesson.id;
  if (startOwned && ownLesson) {
    firstStep = { kind: 'lesson', courseId: startCourse.id, lessonId: ownLesson.id, lessonTitle: ownLesson.title, day: ownLesson.day, free: startCourse.kind === 'starter' };
  } else if (!startOwned && freeLessonOpen) {
    // Not bought yet: the first lesson of every course is free (owner, 2026-11-18), so the plan starts in the course the learner wants.
    const lesson = startCourse.lessons[0];
    firstStep = { kind: 'lesson', courseId: startCourse.id, lessonId: lesson.id, lessonTitle: lesson.title, day: lesson.day, free: true };
  } else if (!startOwned && starter && !context.complete(STARTER)) {
    // Not bought, and its free first lesson is already done: carry on with the free course, a real step toward it.
    const lesson = context.nextLesson(STARTER) ?? starter.lessons[0];
    firstStep = { kind: 'lesson', courseId: STARTER, lessonId: lesson.id, lessonTitle: lesson.title, day: lesson.day, free: true };
    startsWithFree = true;
  } else if (startOwned && !ownLesson && startCourse.lessons.length > 0 && !context.complete(startCourse.id)) {
    const first = startCourse.lessons[0];
    firstStep = { kind: 'lesson', courseId: startCourse.id, lessonId: first.id, lessonTitle: first.title, day: first.day, free: startCourse.kind === 'starter' };
  } else {
    firstStep = { kind: 'course', courseId: startCourse.id };
  }

  const interests = profile.interests.filter((id): id is TopicInterestId => id !== NOT_SURE);
  const topics: TopicCoverage[] = interests.map((interest) => topicCoverage(interest, facts));

  const reasons: PlanReason[] = [{ kind: 'experience', level: declared }];
  if (profile.assessment) reasons.push({ kind: 'assessment', level: profile.assessment.level, raised: experience !== declared });
  const startFacts = startEntry.facts;
  for (const reason of relevanceReasons(startFacts, signals, catalogIndex(facts))) {
    if (reason.kind === 'goal') reasons.push({ kind: 'goal', goal: reason.goal });
    else if (reason.kind === 'interest') reasons.push({ kind: 'interest', interest: reason.interest });
  }

  const skills = [...new Set([...startCourse.skills.map((skill) => skill.label), ...nextCourses.slice(0, 1).flatMap((course) => course.skills.slice(0, 2).map((skill) => skill.label))])];

  return {
    experience,
    startCourse,
    startsWithFree,
    firstStep,
    nextCourses,
    skills,
    projects: startCourse.projects.map((project) => ({ courseId: startCourse.id, id: project.id, title: project.title })),
    topics,
    // A goal the catalog only has neighbouring courses for (game development today), worked out from the catalog itself.
    comingSoonGoals: profile.goals.filter((goal) => goalCoverage(goal, facts).status === 'soon'),
    schedule: scheduleFor(profile, startCourse.lessons.length),
    reasons,
  };
}

/** The daily minutes a plan was made for, as the nearest offered choice. */
export const nearestMinutes = (value: number): DailyMinutes => ([5, 10, 15, 30, 45, 60] as const).reduce((best, choice) => (Math.abs(choice - value) < Math.abs(best - value) ? choice : best));
