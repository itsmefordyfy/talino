import { ASSESSMENT_BANK, type AssessmentQuestion, type AssessmentTier } from '../content/assessment-bank';
import type { ExperienceLevel } from './options';
import type { AssessmentLevel } from './profile';

/** Where each experience level starts, and the easiest and hardest tier it is ever asked. Beginners never see the hardest questions. */
const RANGE: Record<ExperienceLevel, { start: AssessmentTier; min: AssessmentTier; max: AssessmentTier; length: number }> = {
  'complete-beginner': { start: 1, min: 1, max: 2, length: 6 },
  beginner: { start: 1, min: 1, max: 3, length: 7 },
  intermediate: { start: 2, min: 1, max: 4, length: 8 },
  advanced: { start: 3, min: 2, max: 4, length: 8 },
  professional: { start: 3, min: 2, max: 4, length: 8 },
};

export type AnsweredQuestion = { id: string; tier: AssessmentTier; correct: boolean };

export function assessmentLength(experience: ExperienceLevel): number {
  return RANGE[experience].length;
}

/**
 * The next question: one tier harder after a right answer, one easier after a wrong one, kept inside
 * what this experience level may be asked, and never a repeat. `null` when the check is done.
 */
export function nextQuestion(experience: ExperienceLevel, answered: readonly AnsweredQuestion[], bank: readonly AssessmentQuestion[] = ASSESSMENT_BANK): AssessmentQuestion | null {
  const range = RANGE[experience];
  if (answered.length >= range.length) return null;
  const last = answered[answered.length - 1];
  const wanted = last ? Math.min(range.max, Math.max(range.min, last.tier + (last.correct ? 1 : -1))) : range.start;
  const seen = new Set(answered.map((entry) => entry.id));
  // The wanted tier first, then the nearest ones, so a thin tier never ends the check early.
  for (let spread = 0; spread <= 3; spread += 1) {
    for (const tier of spread === 0 ? [wanted] : [wanted - spread, wanted + spread]) {
      if (tier < range.min || tier > range.max) continue;
      const found = bank.find((question) => question.tier === tier && !seen.has(question.id));
      if (found) return found;
    }
  }
  return null;
}

/**
 * Turns the answers into a starting level. It reads what was answered rightly at each tier, not the
 * percentage, so a beginner who gets every easy question right is "foundations", not "failing".
 */
export function estimateLevel(answered: readonly AnsweredQuestion[]): AssessmentLevel {
  const right = answered.filter((entry) => entry.correct);
  const atLeast = (tier: AssessmentTier) => right.filter((entry) => entry.tier >= tier).length;
  if (atLeast(3) >= 2) return 'strong';
  if (atLeast(2) >= 2) return 'comfortable';
  if (right.length >= 3) return 'foundations';
  return 'new';
}

const ORDER: ExperienceLevel[] = ['complete-beginner', 'beginner', 'intermediate', 'advanced', 'professional'];

/**
 * The experience the plan is built for: what the learner said, raised when the check showed more, and
 * lowered by one step only for someone who called themselves advanced or professional and scored "new"
 * (the check is short, so it never overrules a career).
 */
export function effectiveExperience(declared: ExperienceLevel, level: AssessmentLevel | null): ExperienceLevel {
  if (!level) return declared;
  const floor: Record<AssessmentLevel, ExperienceLevel> = { new: 'complete-beginner', foundations: 'beginner', comfortable: 'intermediate', strong: 'advanced' };
  const at = ORDER.indexOf(declared);
  const raised = Math.max(at, ORDER.indexOf(floor[level]));
  if (raised > at) return ORDER[raised];
  if (level === 'new' && at >= ORDER.indexOf('advanced')) return ORDER[at - 1];
  return declared;
}
