import { LEARNING_PATHS, type LearningPathDef } from '../../content/catalog/paths';
import type { LearningGoalId } from '../../content/types';
import type { CourseFacts } from '../catalog-facts';
import { catalogIndex } from './catalog-index';
import { NOT_SURE } from '../../../onboarding/lib/options';
import { GOAL_TARGETS, INTEREST_TARGETS } from './profile-mapping';
import { learnerExperience, levelFit, readinessOf, relevanceOf } from './score';
import type { LearnerSignals } from './signals';

/** Where the learner stands on one course of their path. */
export type PathStepState = 'done' | 'current' | 'next' | 'upcoming';

export type PathStep = {
  facts: CourseFacts;
  state: PathStepState;
  /** The prerequisites are complete (or can be assumed): false means the step is shown, but "finish these first". */
  ready: boolean;
  missingPrerequisites: string[];
  /** 0 to 1, from the learner's progress. */
  fraction: number;
};

export type PathPlan = {
  path: LearningPathDef;
  /** How well the path suits the learner; only for comparing paths. */
  fit: number;
  steps: PathStep[];
  /** The course to take now: the one in progress, else the first step that is ready. Null when the path is finished. */
  nextStep: PathStep | null;
  done: number;
  total: number;
};

const FIRST_COURSES_CONSIDERED = 6;
const LEVEL_COURSES_CONSIDERED = 4;
const GOAL_FIT_WEIGHT = 2;
const RELEVANCE_WEIGHT = 0.6;
const LEVEL_WEIGHT = 0.7;
const GAP_PENALTY = 0.6;
const PROGRESS_WEIGHT = 1.5;
/** Below this a path is not about anything the learner asked for, and is not offered. */
const MIN_FIT = 2;
/** How much of what the learner declared the first courses of a path must be about, on average, for it to count as theirs. */
const MIN_DECLARED = 3;
/** A course whose level fit is at or below this is basics for the learner (see `levelFit`). */
const BASICS_FIT = -3;

function stepsFor(path: LearningPathDef, signals: LearnerSignals, facts: readonly CourseFacts[]): PathStep[] {
  const index = catalogIndex(facts);
  const experience = learnerExperience(signals, index);
  const steps: PathStep[] = [];
  for (const id of path.courseIds) {
    const course = index.byId.get(id);
    if (!course) continue;
    const readiness = readinessOf(course, signals, index, experience);
    const done = signals.completed.has(id);
    const started = signals.started.get(id);
    steps.push({ facts: course, state: done ? 'done' : started ? 'current' : 'upcoming', ready: readiness.ready, missingPrerequisites: readiness.missing, fraction: done ? 1 : (started?.fraction ?? 0) });
  }
  // The next course is the first one the learner is ready for and that is not far below their level (an experienced engineer
  // is not told to start a path at its beginner course; it stays on the path, only not as "next").
  const upcoming = steps.filter((step) => step.state === 'upcoming');
  const next = upcoming.find((step) => step.ready && levelFit(experience, step.facts.level) > BASICS_FIT) ?? upcoming.find((step) => step.ready) ?? upcoming[0];
  if (next) next.state = 'next';
  return steps;
}

function fitOf(path: LearningPathDef, steps: readonly PathStep[], signals: LearnerSignals, facts: readonly CourseFacts[]): number {
  const index = catalogIndex(facts);
  const experience = learnerExperience(signals, index);
  const remaining = steps.filter((step) => step.state !== 'done');
  if (remaining.length === 0) return -Infinity;

  const wanted = new Set<LearningGoalId>(signals.goals.flatMap((goal) => GOAL_TARGETS[goal].goals ?? []));
  const pathShare = (goal: LearningGoalId) => LEARNING_PATHS.filter((entry) => entry.goals.includes(goal)).length / LEARNING_PATHS.length;
  const goalFit = path.goals.filter((goal) => wanted.has(goal)).reduce((sum, goal) => sum + (1 - pathShare(goal)), 0);

  const soon = remaining.slice(0, FIRST_COURSES_CONSIDERED);
  const relevance = soon.reduce((sum, step) => sum + relevanceOf(step.facts, signals, index).relevance, 0) / soon.length;
  const levelCourses = remaining.slice(0, LEVEL_COURSES_CONSIDERED);
  const level = levelCourses.reduce((sum, step) => sum + levelFit(experience, step.facts.level), 0) / levelCourses.length;

  // A path asks the learner to know things it does not teach when a course's prerequisite is neither done, nor assumed, nor earlier on the path.
  const onPath = new Set<string>();
  let gaps = 0;
  for (const step of steps) {
    if (step.state !== 'done') for (const missing of step.missingPrerequisites) if (!onPath.has(missing)) gaps += 1;
    onPath.add(step.facts.id);
  }

  const progress = steps.filter((step) => step.state === 'done' || step.state === 'current').length / steps.length;
  return GOAL_FIT_WEIGHT * goalFit + RELEVANCE_WEIGHT * relevance + LEVEL_WEIGHT * level - GAP_PENALTY * gaps + PROGRESS_WEIGHT * progress;
}

/** A path serves a goal the learner named, or its first courses are about what they declared (not just what they opened or finished). */
function pathIsAboutThem(path: LearningPathDef, steps: readonly PathStep[], signals: LearnerSignals, facts: readonly CourseFacts[]): boolean {
  const wanted = new Set<LearningGoalId>(signals.goals.flatMap((goal) => GOAL_TARGETS[goal].goals ?? []));
  if (path.goals.some((goal) => wanted.has(goal))) return true;
  const index = catalogIndex(facts);
  const soon = steps.filter((step) => step.state !== 'done').slice(0, FIRST_COURSES_CONSIDERED);
  if (soon.length === 0) return false;
  return soon.reduce((sum, step) => sum + relevanceOf(step.facts, signals, index).declared, 0) / soon.length >= MIN_DECLARED;
}

/**
 * One specific path's plan, whether or not it suits the learner (the path screen opens any path from the list). Its
 * courses are marked done, current, next or upcoming; `fit` is how well it suits them (negative infinity when finished).
 * Null only when none of the path's courses exist in the catalog yet.
 */
export function planForPath(path: LearningPathDef, signals: LearnerSignals, facts: readonly CourseFacts[]): PathPlan | null {
  const steps = stepsFor(path, signals, facts);
  if (steps.length === 0) return null;
  const fit = fitOf(path, steps, signals, facts);
  const nextStep = steps.find((step) => step.state === 'current') ?? steps.find((step) => step.state === 'next') ?? null;
  return { path, fit, steps, nextStep, done: steps.filter((step) => step.state === 'done').length, total: steps.length };
}

/**
 * The learning path that best fits the learner's goals, interests and level, with each of its courses marked done, current,
 * next or upcoming. A path whose courses the learner has not got the prerequisites for is still shown, with those steps marked
 * not ready. Null when nothing on any path is about what the learner asked for, or every path is finished.
 */
export function pickLearningPath(signals: LearnerSignals, facts: readonly CourseFacts[], paths: readonly LearningPathDef[] = LEARNING_PATHS): PathPlan | null {
  let best: PathPlan | null = null;
  const asked = signals.goals.length > 0 || signals.interests.some((interest) => interest !== NOT_SURE && interest in INTEREST_TARGETS);
  for (const path of paths) {
    const steps = stepsFor(path, signals, facts);
    if (steps.length === 0) continue;
    const fit = fitOf(path, steps, signals, facts);
    if (fit < MIN_FIT) continue;
    // Progress alone can lift a path over MIN_FIT, so a learner who named goals or interests is offered only a path that is about them.
    if (asked && !pathIsAboutThem(path, steps, signals, facts)) continue;
    if (!best || fit > best.fit) {
      const nextStep = steps.find((step) => step.state === 'current') ?? steps.find((step) => step.state === 'next') ?? null;
      best = { path, fit, steps, nextStep, done: steps.filter((step) => step.state === 'done').length, total: steps.length };
    }
  }
  return best;
}
