import { isActivityKind, type ActivityKind } from './kinds';

/**
 * Adaptive guidance. It reads what the learner actually did (right or wrong, hints, how the recent
 * tries went) and never how fast: duration is deliberately not an input, so nobody is rushed and a
 * slow, careful solve is as good as a quick one.
 *
 * - The starting point is the experience the learner declared in onboarding.
 * - A concept the learner is struggling with (3 or more struggles among its last 5 attempts) gets
 *   one step more guidance and a suggestion for what would help.
 * - A run of clean solves (4 in a row, first try, no hints) earns one step less guidance and a
 *   harder challenge.
 */

export type Guidance = 'guided' | 'standard' | 'independent';
export type Recommendation = 'simpler-explanation' | 'visual' | 'smaller-practice' | 'harder-challenge';
export type Experience = 'complete-beginner' | 'beginner' | 'intermediate' | 'advanced' | 'professional';
export type MasteryBand = 'new' | 'learning' | 'practising' | 'confident';

/** The columns this needs from `challenge_attempts` and `activity_progress`. */
export type AttemptLike = { activity_id: string; lesson_id: string; course_id: string; kind: string; correct: number; hints_used: number; created_at: string };
export type ActivityLike = { activity_id: string; lesson_id: string; course_id: string; kind: string; solved: number; attempts: number; wrong: number; hints_used: number };

export const RECENT_WINDOW = 5;
export const STRUGGLE_THRESHOLD = 3;
export const CLEAN_STREAK = 4;
/** Hints on one attempt from which a correct answer still counts as a struggle. */
export const HINT_STRUGGLE = 2;

/** Ordered from the most help to the least: `+1` is one step more independent, `-1` one step more guided. */
const STEPS: Guidance[] = ['guided', 'standard', 'independent'];

export function baseGuidance(experience: Experience | string | null | undefined): Guidance {
  if (experience === 'complete-beginner' || experience === 'beginner') return 'guided';
  if (experience === 'advanced' || experience === 'professional') return 'independent';
  return 'standard';
}

export function shiftGuidance(level: Guidance, steps: number): Guidance {
  return STEPS[Math.min(STEPS.length - 1, Math.max(0, STEPS.indexOf(level) + steps))];
}

/** A struggle: a wrong answer, or a right one that needed hints. Speed never counts. */
export function isStruggle(attempt: Pick<AttemptLike, 'correct' | 'hints_used'>): boolean {
  return attempt.correct !== 1 || attempt.hints_used >= HINT_STRUGGLE;
}

export type ConceptMastery = {
  concept: string;
  attempts: number;
  /** Activities attempted at least once. */
  activities: number;
  solved: number;
  /** 0 to 1: how securely it is known (see `masteryScore`). */
  mastery: number;
  band: MasteryBand;
  recentStruggles: number;
  cleanStreak: number;
  guidance: Guidance;
  recommendation: Recommendation | null;
};

export type AdaptiveSummary = {
  base: Guidance;
  /** The overall level, from the last attempts across everything. */
  guidance: Guidance;
  recommendation: Recommendation | null;
  concepts: ConceptMastery[];
  /** Concepts to give more help with, hardest first. */
  struggling: string[];
  focus: { concept: string; recommendation: Recommendation } | null;
};

/** Which concepts an activity trains. The default is the activity's kind; the app passes the lesson's skills. */
export type ConceptOf = (item: { lesson_id: string; course_id: string; kind: string }) => readonly string[];

const byKind: ConceptOf = (item) => [item.kind];

/** Smaller steps suit code and bugs; a picture of the idea suits ordering, matching and tracing; plain words suit the rest. */
export function recommendFor(kind: string): Recommendation {
  if (kind === 'code-challenge' || kind === 'sql-challenge' || kind === 'fix-bug') return 'smaller-practice';
  if (kind === 'predict-output' || kind === 'arrange' || kind === 'match') return 'visual';
  return 'simpler-explanation';
}

/**
 * How securely a concept is known, 0 to 1, from the activities attempted (latest 10, newer ones
 * count more so improvement shows): solved clean 1, solved with one hint or one wrong try 0.75,
 * solved after more 0.5, attempted but not solved 0.15.
 */
export function masteryScore(activities: readonly ActivityLike[]): number {
  const recent = activities.slice(-10);
  if (recent.length === 0) return 0;
  let weighted = 0;
  let weights = 0;
  recent.forEach((activity, index) => {
    const weight = index + 1;
    const effort = activity.hints_used + activity.wrong;
    const score = activity.solved !== 1 ? 0.15 : effort === 0 ? 1 : effort === 1 ? 0.75 : 0.5;
    weighted += score * weight;
    weights += weight;
  });
  return weighted / weights;
}

function bandFor(activities: number, mastery: number): MasteryBand {
  if (activities === 0) return 'new';
  if (activities < 3) return 'learning';
  return mastery >= 0.75 ? 'confident' : mastery >= 0.45 ? 'practising' : 'learning';
}

const ordered = (attempts: readonly AttemptLike[]) => [...attempts].sort((a, b) => (a.created_at < b.created_at ? -1 : a.created_at > b.created_at ? 1 : 0));

/** Clean = the first try at an activity, right, with no hints. Later tries at a solved activity are replays and are ignored. */
function firstTries(attempts: readonly AttemptLike[]): AttemptLike[] {
  const seen = new Set<string>();
  const first: AttemptLike[] = [];
  for (const attempt of attempts) {
    if (seen.has(attempt.activity_id)) continue;
    seen.add(attempt.activity_id);
    first.push(attempt);
  }
  return first;
}

function trailingClean(attempts: readonly AttemptLike[]): number {
  let streak = 0;
  for (let index = attempts.length - 1; index >= 0; index -= 1) {
    const attempt = attempts[index];
    if (attempt.correct === 1 && attempt.hints_used === 0) streak += 1;
    else break;
  }
  return streak;
}

function judge(base: Guidance, attempts: readonly AttemptLike[]): { guidance: Guidance; recommendation: Recommendation | null; recentStruggles: number; cleanStreak: number } {
  const recent = attempts.slice(-RECENT_WINDOW);
  const recentStruggles = recent.filter(isStruggle).length;
  const cleanStreak = trailingClean(firstTries(attempts));
  if (recentStruggles >= STRUGGLE_THRESHOLD) {
    const last = [...recent].reverse().find(isStruggle);
    return { guidance: shiftGuidance(base, -1), recommendation: recommendFor(last?.kind ?? ''), recentStruggles, cleanStreak };
  }
  if (cleanStreak >= CLEAN_STREAK) return { guidance: shiftGuidance(base, 1), recommendation: 'harder-challenge', recentStruggles, cleanStreak };
  return { guidance: base, recommendation: null, recentStruggles, cleanStreak };
}

export function adaptiveSummary(
  rows: readonly ActivityLike[],
  attempts: readonly AttemptLike[],
  experience: Experience | string | null | undefined,
  conceptOf: ConceptOf = byKind,
): AdaptiveSummary {
  const base = baseGuidance(experience);
  const sorted = ordered(attempts.filter((attempt) => isActivityKind(attempt.kind) && (attempt.kind as ActivityKind) !== 'tap-reveal'));
  const concepts = new Set<string>();
  for (const item of [...rows, ...sorted]) for (const concept of conceptOf(item)) concepts.add(concept);

  const result: ConceptMastery[] = [...concepts].map((concept) => {
    const mine = sorted.filter((attempt) => conceptOf(attempt).includes(concept));
    const mineRows = rows.filter((row) => conceptOf(row).includes(concept));
    const judged = judge(base, mine);
    const mastery = masteryScore(mineRows);
    return {
      concept,
      attempts: mine.length,
      activities: mineRows.length,
      solved: mineRows.filter((row) => row.solved === 1).length,
      mastery,
      band: bandFor(mineRows.length, mastery),
      ...judged,
    };
  });
  result.sort((a, b) => b.recentStruggles - a.recentStruggles || a.mastery - b.mastery || a.concept.localeCompare(b.concept));

  const overall = judge(base, sorted);
  const struggling = result.filter((entry) => entry.recentStruggles >= STRUGGLE_THRESHOLD).map((entry) => entry.concept);
  const worst = result.find((entry) => entry.recentStruggles >= STRUGGLE_THRESHOLD && entry.recommendation);
  return {
    base,
    guidance: overall.guidance,
    recommendation: overall.recommendation,
    concepts: result,
    struggling,
    focus: worst?.recommendation ? { concept: worst.concept, recommendation: worst.recommendation } : null,
  };
}

/** The guidance for one concept; concepts with no history use the overall level. */
export function guidanceFor(summary: AdaptiveSummary, concept: string): Guidance {
  return summary.concepts.find((entry) => entry.concept === concept)?.guidance ?? summary.guidance;
}
