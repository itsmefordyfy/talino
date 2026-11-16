import type { Activity } from '../../activities/types';
import { EXPERIENCE_LEVELS, forLevel, inAudience, levelIndex, type Audience, type CourseDifficulty, type ExperienceLevel } from '../content/levels';
import type { Course, Lesson, LessonBlock, Project, ProjectStep, QuizQuestion } from '../content/types';
import { effectiveExperience } from '../../onboarding/lib/assessment';
import type { AssessmentLevel } from '../../onboarding/lib/profile';

/**
 * How a lesson and a project look for one learner level. Pure (no store, no database): the screens, the coach's review route
 * and the tests all read the same functions, so what a learner is shown, asked and reviewed against can never drift apart.
 *
 * A level never locks anything. `showAll` is the learner's "Show everything" choice and shows every piece of the lesson;
 * a learner with no known level (onboarding skipped) sees the shared content only, until they choose a level or Show everything.
 */

type ActivityBlock = Extract<LessonBlock, { type: 'activity' }>;

const hasAudience = (audience: Audience | undefined) => !!audience && (!!audience.min || !!audience.max);

/** What was hidden for this learner and whether the lesson has any level-specific content at all (the screen shows its note only then). */
export type AdaptationSummary = { hiddenCount: number; hasLevelContent: boolean };

export type AdaptedLesson = {
  /** Every body block that is visible, activities included, in their authored order. */
  body: LessonBlock[];
  /** The activities the learner is offered in Practice (the visible activity blocks, in order). */
  activities: Activity[];
  /** The questions the learner is asked. Never empty for a lesson that has any question. */
  quiz: QuizQuestion[];
  /** The shared task steps followed by the extras for the level. */
  taskSteps: string[];
  summary: AdaptationSummary;
};

const visibleActivity = (block: ActivityBlock, level: ExperienceLevel | null, showAll: boolean) => showAll || (inAudience(block.audience, level) && inAudience(block.activity.audience, level));

function taskStepsFor(lesson: Pick<Lesson, 'task' | 'taskExtra'>, level: ExperienceLevel | null, showAll: boolean): string[] {
  const extra = forLevel(lesson.taskExtra ?? [], level, showAll).flatMap((entry) => entry.steps);
  return [...lesson.task.steps, ...extra];
}

export function adaptLesson(lesson: Lesson, level: ExperienceLevel | null, showAll = false): AdaptedLesson {
  const body = lesson.body.filter((block) => (block.type === 'activity' ? visibleActivity(block, level, showAll) : showAll || inAudience(block.audience, level)));
  const activities = body.filter((block): block is ActivityBlock => block.type === 'activity').map((block) => block.activity);
  // A learner is never asked nothing: if every question happened to be written for other levels, they are all asked.
  const picked = forLevel(lesson.quiz, level, showAll);
  const quiz = picked.length > 0 ? picked : [...lesson.quiz];

  const allActivities = lesson.body.filter((block): block is ActivityBlock => block.type === 'activity');
  const hiddenBlocks = lesson.body.length - body.length;
  const hiddenQuestions = lesson.quiz.length - quiz.length;
  const hiddenExtra = (lesson.taskExtra ?? []).filter((entry) => !showAll && !inAudience(entry.audience, level)).reduce((sum, entry) => sum + entry.steps.length, 0);
  const tagged =
    lesson.body.some((block) => !!block.audience) ||
    allActivities.some((block) => !!block.activity.audience) ||
    lesson.quiz.some((question) => !!question.audience) ||
    (lesson.taskExtra ?? []).some((entry) => hasAudience(entry.audience));
  return {
    body,
    activities,
    quiz,
    taskSteps: taskStepsFor(lesson, level, showAll),
    summary: { hiddenCount: hiddenBlocks + hiddenQuestions + hiddenExtra, hasLevelContent: tagged },
  };
}

/** A level from untrusted input (a request body, a stored value): one of the five ids, or null. */
export function cleanLevel(value: unknown): ExperienceLevel | null {
  return typeof value === 'string' && (EXPERIENCE_LEVELS as readonly string[]).includes(value) ? (value as ExperienceLevel) : null;
}

export type AdaptedProject = {
  steps: ProjectStep[];
  /** The criteria Tali reviews against: the shared rubric plus the extras for the level. */
  rubric: string[];
  summary: AdaptationSummary;
};

/** The rubric a learner of this level is reviewed against (shared items first, then the extras for the level, in order). */
export function rubricFor(project: Pick<Project, 'rubric' | 'rubricExtra'>, level: ExperienceLevel | null, showAll = false): string[] {
  return [...project.rubric, ...forLevel(project.rubricExtra ?? [], level, showAll).flatMap((entry) => entry.items)];
}

/**
 * A translated project may not repeat the English project's level tags (the translation is its own object): it takes the tags and rubric
 * extras from the original by step id, so a Tagalog learner is tailored exactly as an English one. The original is the source of the levels.
 */
export function inheritLevels<T extends Pick<Project, 'steps' | 'rubricExtra'>>(translated: T, original: Pick<Project, 'steps' | 'rubricExtra'>): T {
  if (translated === (original as unknown)) return translated;
  const audiences = new Map(original.steps.map((step) => [step.id, step.audience]));
  return { ...translated, steps: translated.steps.map((step) => (step.audience || !audiences.get(step.id) ? step : { ...step, audience: audiences.get(step.id) })), rubricExtra: translated.rubricExtra ?? original.rubricExtra };
}

export function adaptProject(project: Pick<Project, 'steps' | 'rubric' | 'rubricExtra'>, level: ExperienceLevel | null, showAll = false): AdaptedProject {
  const steps = forLevel(project.steps, level, showAll);
  const rubric = rubricFor(project, level, showAll);
  const total = project.rubric.length + (project.rubricExtra ?? []).reduce((sum, entry) => sum + entry.items.length, 0);
  return {
    steps,
    rubric,
    summary: {
      hiddenCount: project.steps.length - steps.length + (total - rubric.length),
      hasLevelContent: project.steps.some((step) => hasAudience(step.audience)) || (project.rubricExtra ?? []).length > 0,
    },
  };
}

/** The levels an audience range covers, in order ("everybody" when it has no range). */
export function levelsInAudience(audience: Audience | undefined): ExperienceLevel[] {
  return EXPERIENCE_LEVELS.filter((level) => inAudience(audience, level));
}

// ---------------------------------------------------------------------------------------------------------------------
// How adapted is a course?

export type LevelCoverageEntry = {
  /** Level-specific lesson blocks that a learner of this level is shown (shared blocks aren't counted). */
  blocks: number;
  questions: number;
  activities: number;
  /** Task extras and project steps written for the level. */
  steps: number;
  /** Rubric extras for the level. */
  rubric: number;
  /** Everything above added up. */
  total: number;
};

export type LevelCoverage = Record<ExperienceLevel, LevelCoverageEntry>;

/**
 * Per level, how many tagged pieces of a course a learner at that level is given on top of the shared lesson: a measure of how
 * adapted the course is (0 everywhere means the course is the same for everybody).
 */
export function levelCoverage(course: Pick<Course, 'lessons' | 'projects'>): LevelCoverage {
  const result = {} as LevelCoverage;
  for (const level of EXPERIENCE_LEVELS) {
    let blocks = 0;
    let questions = 0;
    let activities = 0;
    let steps = 0;
    let rubric = 0;
    for (const lesson of course.lessons) {
      for (const block of lesson.body) {
        if (block.type === 'activity') {
          if (hasAudience(block.audience) || hasAudience(block.activity.audience)) if (inAudience(block.audience, level) && inAudience(block.activity.audience, level)) activities += 1;
        } else if (hasAudience(block.audience) && inAudience(block.audience, level)) blocks += 1;
      }
      questions += lesson.quiz.filter((question) => hasAudience(question.audience) && inAudience(question.audience, level)).length;
      steps += (lesson.taskExtra ?? []).filter((entry) => hasAudience(entry.audience) && inAudience(entry.audience, level)).reduce((sum, entry) => sum + entry.steps.length, 0);
    }
    for (const project of course.projects) {
      steps += project.steps.filter((step) => hasAudience(step.audience) && inAudience(step.audience, level)).length;
      rubric += (project.rubricExtra ?? []).filter((entry) => hasAudience(entry.audience) && inAudience(entry.audience, level)).reduce((sum, entry) => sum + entry.items.length, 0);
    }
    result[level] = { blocks, questions, activities, steps, rubric, total: blocks + questions + activities + steps + rubric };
  }
  return result;
}

// ---------------------------------------------------------------------------------------------------------------------
// "Ready for the next level?"

/** A course the learner finished: the difficulty tier it sits in and their quiz average on it (0 to 1, null when no quiz was taken). */
export type CompletedCourse = { difficulty: CourseDifficulty; quizAverage: number | null };

export type LevelSuggestionReason = { kind: 'courses'; count: number; tier: CourseDifficulty; average: number } | { kind: 'skill-check'; result: AssessmentLevel };

export type LevelSuggestion = { to: ExperienceLevel; reasons: LevelSuggestionReason[] };

export const SUGGEST_MIN_AVERAGE = 0.8;

const TIER_INDEX: Record<CourseDifficulty, number> = { beginner: 0, intermediate: 1, advanced: 2 };

/**
 * What it takes to step up from a level, by completed courses: any one rule is enough. Courses at a higher tier count for a lower
 * one, and the rules are cumulative on purpose, so accepting a suggestion never makes the next one appear at once (two intermediate
 * courses move a beginner to intermediate; four are needed before advanced). Professional is never suggested from scores: it
 * says "I work as a software developer", which no quiz can show. Advanced can come only from a skill check, so nothing here
 * suggests it unless the check does.
 */
const STEP_UP: Partial<Record<ExperienceLevel, readonly { tier: CourseDifficulty; count: number }[]>> = {
  'complete-beginner': [{ tier: 'beginner', count: 2 }],
  beginner: [
    { tier: 'intermediate', count: 2 },
    { tier: 'beginner', count: 4 },
  ],
  intermediate: [
    { tier: 'advanced', count: 2 },
    { tier: 'intermediate', count: 4 },
  ],
};

const round2 = (value: number) => Math.round(value * 100) / 100;

/**
 * Suggests ONE step up, only on real evidence, and never a step down; it changes nothing by itself (the learner accepts or ignores it).
 * `level` is the level the learner chose (not the effective one the skill check may have raised); `skillCheck` is a saved result.
 */
export function suggestNextLevel(input: { level: ExperienceLevel | null; completed: readonly CompletedCourse[]; skillCheck?: AssessmentLevel | null }): LevelSuggestion | null {
  const { level } = input;
  if (!level) return null;
  const at = levelIndex(level);
  if (at >= EXPERIENCE_LEVELS.length - 1) return null;
  const next = EXPERIENCE_LEVELS[at + 1];
  const reasons: LevelSuggestionReason[] = [];

  for (const rule of STEP_UP[level] ?? []) {
    const evidence = input.completed.filter((course) => TIER_INDEX[course.difficulty] >= TIER_INDEX[rule.tier] && course.quizAverage !== null);
    if (evidence.length < rule.count) continue;
    const average = evidence.reduce((sum, course) => sum + (course.quizAverage ?? 0), 0) / evidence.length;
    if (average >= SUGGEST_MIN_AVERAGE - 1e-9) {
      reasons.push({ kind: 'courses', count: evidence.length, tier: rule.tier, average: round2(average) });
      break;
    }
  }

  if (input.skillCheck && levelIndex(effectiveExperience(level, input.skillCheck)) > at) reasons.push({ kind: 'skill-check', result: input.skillCheck });

  return reasons.length > 0 ? { to: next, reasons } : null;
}
