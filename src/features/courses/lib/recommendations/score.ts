import type { CategoryId, CourseLevel } from '../../content/types';
import { effectiveExperience } from '../../../onboarding/lib/assessment';
import { EXPERIENCE_LEVELS, NOT_SURE, type ExperienceLevel, type GoalId, type InterestId } from '../../../onboarding/lib/options';
import type { CourseFacts } from '../catalog-facts';
import { QUIZ_PASS_RATIO } from '../progress';
import { catalogIndex, type CatalogIndex } from './catalog-index';
import { LEVEL_INDEX, matchTarget, positionWeight } from './match';
import { GOAL_TARGETS, INTEREST_TARGETS, type TopicInterestId } from './profile-mapping';
import type { LearnerSignals } from './signals';

/**
 * How well one course fits one learner, and why. The score is a sum of small, named parts so each can be explained,
 * tuned and tested on its own:
 *
 * - relevance: the learner's goals and interests matched against the course's categories, technologies, goals and tags
 *   (`profile-mapping`); a hit on a technology or goal few courses have counts for more
 * - level fit: a complete beginner is steered away from advanced courses, an experienced developer away from the basics
 * - readiness: prerequisites the learner has not completed demote a course by how many are missing (never hide it); a
 *   prerequisite a more experienced learner can be assumed to know does not count
 * - momentum: a course that builds on one the learner just completed, and technologies they keep exploring, lift it
 * - quiz results: a weak average in a category favours its foundations, a strong one the next level
 * - a small lift for short courses when the daily time is very small
 *
 * Nothing here removes a course: the scores only order them.
 */

export type RecommendationReason =
  | { kind: 'goal'; goal: GoalId }
  | { kind: 'interest'; interest: InterestId }
  /** The course builds on one the learner completed ("Next after JavaScript"). */
  | { kind: 'next-after'; courseId: string }
  | { kind: 'explored'; technology: string }
  /** It is a prerequisite of a course they are after ("Needed for React"). */
  | { kind: 'prepares-for'; courseId: string }
  | { kind: 'level'; fit: 'foundation' | 'matches-experience' | 'stretch' }
  | { kind: 'quiz'; category: CategoryId; trend: 'strengthen' | 'ready' }
  | { kind: 'short'; minutes: number }
  /** A lot of the catalog builds on it. */
  | { kind: 'foundation' };

export type Readiness = {
  /** Every prerequisite is complete or can be assumed for this learner. */
  ready: boolean;
  /** Direct prerequisites not yet complete (and not assumed known): "finish these first". */
  missing: string[];
  /** Prerequisites behind the missing ones. */
  blockedBy: string[];
};

export type CourseStatus = 'new' | 'in-progress' | 'completed';

export type CourseScore = {
  score: number;
  /** The goal and interest match alone, before level, readiness and the rest: whether the course is about what they want. */
  relevance: number;
  /**
   * Only what the learner said they want (goals and interests, and the foundations of those), without the courses they happened to open:
   * what a personal section is gated on when they have said anything, so browsing history alone never recommends a course.
   */
  declared: number;
  status: CourseStatus;
  readiness: Readiness;
  /** The strongest reasons, most important first (at most four). */
  reasons: RecommendationReason[];
};

/** A course's level against the learner's, as score: rows are the learner's experience, columns the course's level. */
const LEVEL_FIT: Record<ExperienceLevel, readonly [number, number, number]> = {
  'complete-beginner': [0.5, -4.5, -10],
  beginner: [0.5, -1.5, -6],
  intermediate: [-0.5, 1, -0.5],
  advanced: [-3.5, 0.5, 1.5],
  professional: [-5, -0.5, 2],
};

/** The score a course level gets for a learner of this experience. */
export function levelFit(experience: ExperienceLevel, level: CourseLevel): number {
  return LEVEL_FIT[experience][LEVEL_INDEX[level]];
}

/**
 * A course whose level fit is at or below this is far from where the learner is: the basics for an experienced developer, or well beyond a
 * beginner. The personal blocks list the courses that fit first and these after them (never dropped: "Show everything" and search are untouched).
 */
export const LEVEL_MISFIT = -3;

/** Whether a course's level is near the learner's (not the basics for an expert, nor far beyond a beginner). */
export function fitsLevel(experience: ExperienceLevel, level: CourseLevel): boolean {
  return levelFit(experience, level) > LEVEL_MISFIT;
}

const GOAL_DECAY = [1, 0.7, 0.5, 0.4, 0.3];
const INTEREST_DECAY = [1, 0.8, 0.65, 0.5, 0.4, 0.3, 0.25];
const INTEREST_SCALE = 1.2;
const RELEVANT_MATCH = 2;

const DIRECT_MISSING_PENALTY = 2;
const INDIRECT_MISSING_PENALTY = 0.7;
const MAX_MISSING_PENALTY = 8;

const WEAK_QUIZ = QUIZ_PASS_RATIO;
const STRONG_QUIZ = 0.85;

const PREPARES_FACTOR = 0.3;
const PREPARES_CAP = 4;

const COMING_SOON_PENALTY = 50;
const MAX_REASONS = 4;

/** Accepts a ready index or the catalog's facts (indexed once and cached). */
function toIndex(catalog: CatalogIndex | readonly CourseFacts[]): CatalogIndex {
  return 'byId' in catalog ? catalog : catalogIndex(catalog);
}

/** Experience as a position (0 complete beginner … 4 professional). */
const experienceIndex = (level: ExperienceLevel): number => EXPERIENCE_LEVELS.indexOf(level);

/**
 * The level the learner is working at: what they said, raised by the skill check (`effectiveExperience`) and by the levels
 * of courses they have really completed, so a "complete beginner" who finished two beginner courses is treated as a beginner.
 */
export function learnerExperience(signals: LearnerSignals, catalog: CatalogIndex | readonly CourseFacts[]): ExperienceLevel {
  const index = toIndex(catalog);
  const stated = effectiveExperience(signals.experience ?? 'complete-beginner', signals.assessmentLevel);
  const done = { beginner: 0, intermediate: 0, advanced: 0 };
  for (const id of signals.completed) {
    const level = index.byId.get(id)?.level;
    if (level) done[level] += 1;
  }
  let evidence = 0;
  if (done.beginner >= 2) evidence = 1;
  if (done.intermediate >= 2 || (done.intermediate >= 1 && done.beginner >= 3)) evidence = 2;
  if (done.advanced >= 1) evidence = 3;
  return EXPERIENCE_LEVELS[Math.max(experienceIndex(stated), evidence)];
}

/** Prerequisites at or below this course level are taken as known: an intermediate learner knows the basics, a senior also the intermediate. */
function assumedKnownLevel(experience: ExperienceLevel): number {
  const at = experienceIndex(experience);
  if (at >= 3) return LEVEL_INDEX.intermediate;
  if (at === 2) return LEVEL_INDEX.beginner;
  return -1;
}

export function readinessOf(facts: CourseFacts, signals: LearnerSignals, catalog: CatalogIndex, experience: ExperienceLevel): Readiness {
  const assumed = assumedKnownLevel(experience);
  const unmet = (id: string): boolean => {
    if (signals.completed.has(id)) return false;
    const prerequisite = catalog.byId.get(id);
    return !!prerequisite && LEVEL_INDEX[prerequisite.level] > assumed;
  };
  const missing = facts.prerequisites.filter((id) => id !== facts.id && catalog.byId.has(id) && unmet(id));
  const direct = new Set(facts.prerequisites);
  const blockedBy = missing.length === 0 ? [] : catalog.prerequisiteChain(facts.id).filter((id) => !direct.has(id) && unmet(id));
  return { ready: missing.length === 0, missing, blockedBy };
}

/** Sorted contributions added with a falling weight, so a course that matches many answers scores higher but not without limit. */
function decayedSum(values: readonly number[], decay: readonly number[]): number {
  return [...values].sort((a, b) => b - a).reduce((sum, value, index) => sum + value * (decay[index] ?? decay[decay.length - 1]), 0);
}

type Weighted = { reason: RecommendationReason; weight: number };

export type Relevance = { relevance: number; /** The goal and interest part alone, without curiosity. */ declared: number; reasons: Weighted[]; stretched: boolean };

/** The goal, interest and curiosity part of the score: how much the course is about what the learner wants. */
export function relevanceOf(facts: CourseFacts, signals: LearnerSignals, index: CatalogIndex): Relevance {
  const reasons: Weighted[] = [];
  const goalMatches = signals.goals.map((goal) => ({ goal, match: matchTarget(facts, GOAL_TARGETS[goal], index.rarity) }));
  const interestMatches = signals.interests
    .filter((interest): interest is TopicInterestId => interest !== NOT_SURE)
    // An interest id this build does not know (an old saved profile) is skipped, never a crash.
    .filter((interest) => interest in INTEREST_TARGETS)
    .map((interest) => ({ interest, match: matchTarget(facts, INTEREST_TARGETS[interest], index.rarity) }));
  const goalPart = decayedSum(goalMatches.map((entry) => entry.match.total), GOAL_DECAY);
  const interestPart = INTEREST_SCALE * decayedSum(interestMatches.map((entry) => entry.match.total), INTEREST_DECAY);
  for (const { goal, match } of goalMatches) if (match.total >= RELEVANT_MATCH) reasons.push({ reason: { kind: 'goal', goal }, weight: match.total });
  for (const { interest, match } of interestMatches) if (match.total >= RELEVANT_MATCH) reasons.push({ reason: { kind: 'interest', interest }, weight: match.total * INTEREST_SCALE });

  // Curiosity: technologies the learner keeps opening courses of.
  let explored = 0;
  let exploredTechnology: string | null = null;
  let exploredBest = 0;
  facts.technologies.slice(0, 3).forEach((technology, position) => {
    const count = signals.exploredTechnologies?.[technology] ?? 0;
    if (count <= 0) return;
    const part = 0.5 * positionWeight(position) * Math.log2(1 + count);
    explored += part;
    if (part > exploredBest) {
      exploredBest = part;
      exploredTechnology = technology;
    }
  });
  explored = Math.min(explored, 2.4);
  if (exploredTechnology && explored > 0) reasons.push({ reason: { kind: 'explored', technology: exploredTechnology }, weight: explored });

  const stretched = goalMatches.some((entry) => entry.match.total >= RELEVANT_MATCH && GOAL_TARGETS[entry.goal].stretch) && LEVEL_INDEX[facts.level] >= 1;
  const declared = goalPart + interestPart + (stretched ? 0.8 : 0);
  return { relevance: declared + explored, declared, reasons, stretched };
}

export function scoreCourse(facts: CourseFacts, signals: LearnerSignals, catalog: CatalogIndex | readonly CourseFacts[]): CourseScore {
  const index = toIndex(catalog);
  const experience = learnerExperience(signals, index);
  const reasons: Weighted[] = [];

  // Relevance: what they want, matched against what the course is.
  const own = relevanceOf(facts, signals, index);
  reasons.push(...own.reasons);
  let relevance = own.relevance;
  let declared = own.declared;

  // Foundations for what they want: a prerequisite of a course they are after is relevant too (a beginner who wants React
  // Native is shown the JavaScript it rests on), unless this learner can be assumed to know it already.
  const status: CourseStatus = signals.completed.has(facts.id) ? 'completed' : signals.started.has(facts.id) ? 'in-progress' : 'new';
  if (status !== 'completed' && LEVEL_INDEX[facts.level] > assumedKnownLevel(experience)) {
    let best = { relevance: 0, courseId: '' };
    let bestDeclared = 0;
    for (const dependentId of index.dependentsOf(facts.id)) {
      const dependent = index.byId.get(dependentId);
      if (!dependent || signals.completed.has(dependentId)) continue;
      const wanted = relevanceOf(dependent, signals, index);
      if (wanted.relevance > best.relevance) best = { relevance: wanted.relevance, courseId: dependentId };
      bestDeclared = Math.max(bestDeclared, wanted.declared);
    }
    const lift = Math.min(PREPARES_CAP, PREPARES_FACTOR * best.relevance);
    const declaredLift = Math.min(PREPARES_CAP, PREPARES_FACTOR * bestDeclared);
    if (declaredLift >= 1) declared += declaredLift;
    if (lift >= 1) {
      relevance += lift;
      reasons.push({ reason: { kind: 'prepares-for', courseId: best.courseId }, weight: lift });
    }
  }

  let score = relevance;

  // Level fit.
  const fit = levelFit(experience, facts.level);
  score += fit;
  if (relevance > 0) {
    if (fit >= 1.5) reasons.push({ reason: { kind: 'level', fit: 'matches-experience' }, weight: fit * 0.6 });
    else if (fit >= 0.5 && facts.level === 'beginner' && facts.foundation >= 4 && experienceIndex(experience) <= 1) reasons.push({ reason: { kind: 'level', fit: 'foundation' }, weight: 1 });
  }

  // Readiness: unmet prerequisites demote it, by how many are missing.
  const readiness = readinessOf(facts, signals, index, experience);
  score -= Math.min(MAX_MISSING_PENALTY, DIRECT_MISSING_PENALTY * readiness.missing.length + INDIRECT_MISSING_PENALTY * readiness.blockedBy.length);

  // Momentum: a course that builds on one they finished, in proportion to how much it is about what they want.
  const done = facts.prerequisites.filter((id) => signals.completed.has(id) && index.byId.has(id));
  if (done.length > 0) {
    const gate = Math.min(1, relevance / 6);
    const boost = (0.8 + 2.2 * gate) * (readiness.ready ? 1 : 0.5);
    score += boost;
    reasons.push({ reason: { kind: 'next-after', courseId: done[0] }, weight: boost + 1 });
  }

  // Foundations that much of the catalog builds on: a small lift for people still learning the basics, only when it is relevant.
  const gate = Math.min(1, relevance / 3);
  const foundationLift = (experienceIndex(experience) <= 1 ? 1.6 : 0.6) * (Math.min(facts.foundation, 12) / 12) * gate;
  score += foundationLift;
  if (foundationLift >= 0.9) reasons.push({ reason: { kind: 'foundation' }, weight: foundationLift });

  // Quiz results in the course's category: weak favours its basics, strong the next level.
  const quiz = signals.quizAverageByCategory?.get(facts.category);
  if (quiz !== undefined) {
    const advanced = LEVEL_INDEX[facts.level] >= 1;
    if (quiz < WEAK_QUIZ) {
      const delta = advanced ? -1.5 : 1.5;
      score += delta;
      if (!advanced) reasons.push({ reason: { kind: 'quiz', category: facts.category, trend: 'strengthen' }, weight: 1.5 });
    } else if (quiz >= STRONG_QUIZ) {
      const delta = advanced ? 1.5 : -0.8;
      score += delta;
      if (advanced) reasons.push({ reason: { kind: 'quiz', category: facts.category, trend: 'ready' }, weight: 1.5 });
    }
  }

  // Time: with very little time a day, a shorter course is a small plus (only for courses that are about what they want).
  const littleTime = (signals.dailyMinutes !== null && signals.dailyMinutes <= 10) || signals.styles.includes('short-lessons');
  if (littleTime && relevance >= 1.5) {
    const lift = facts.minutes <= 120 ? 0.8 : facts.minutes <= 180 ? 0.4 : 0;
    if (lift > 0) {
      score += lift;
      reasons.push({ reason: { kind: 'short', minutes: facts.minutes }, weight: lift });
    }
  }

  if (facts.availability !== 'available') score -= COMING_SOON_PENALTY;

  return {
    score,
    relevance,
    declared,
    status,
    readiness,
    reasons: reasons
      .sort((a, b) => b.weight - a.weight)
      .slice(0, MAX_REASONS)
      .map((entry) => entry.reason),
  };
}

/** The goal and interest reasons for a course, strongest first and uncapped: why a plan's course was chosen. */
export function relevanceReasons(facts: CourseFacts, signals: LearnerSignals, catalog: CatalogIndex | readonly CourseFacts[]): RecommendationReason[] {
  return relevanceOf(facts, signals, toIndex(catalog))
    .reasons.sort((a, b) => b.weight - a.weight)
    .map((entry) => entry.reason);
}
