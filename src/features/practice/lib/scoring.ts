import { PRACTICE_CRITERIA, type PracticeCriterion } from '../types';
import { cleanText } from './sanitize';

/** Shared by the role-play debrief and the message review: honest, checkable scoring. */

export type Rating = 'excellent' | 'good' | 'fair' | 'needs_improvement';

/** How good the overall score is, in the words the learner reads. */
export function ratingFor(score: number): Rating {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'needs_improvement';
}

export type CriterionScore = { id: PracticeCriterion; score: number; reason: string };

export const MAX_REASON_CHARS = 400;

const clamp = (value: unknown): number | null => (typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : null);

/**
 * The criteria the model scored, checked against the ones the item names: only those count (an extra one is ignored), each needs a
 * 0-100 score and a reason, and every named one must be there, in the item's order. Null when any named criterion is missing or
 * unreadable, because a partial set would make the overall score meaningless.
 */
export function parseCriteria(value: unknown, named: readonly PracticeCriterion[]): CriterionScore[] | null {
  if (!Array.isArray(value)) return null;
  const found = new Map<string, CriterionScore>();
  for (const item of value) {
    if (typeof item !== 'object' || item === null) continue;
    const entry = item as Record<string, unknown>;
    const id = entry.id;
    if (typeof id !== 'string' || !(PRACTICE_CRITERIA as readonly string[]).includes(id) || !(named as readonly string[]).includes(id) || found.has(id)) continue;
    const score = clamp(entry.score);
    const reason = cleanText(entry.reason, MAX_REASON_CHARS);
    if (score === null || !reason) continue;
    found.set(id, { id: id as PracticeCriterion, score, reason });
  }
  const ordered = named.map((id) => found.get(id));
  return ordered.every((criterion): criterion is CriterionScore => criterion !== undefined) ? ordered : null;
}

/** The overall score is the average of the criteria's, never a separate number the model could contradict them with. */
export const averageScore = <T extends { score: number }>(criteria: readonly T[]): number => Math.round(criteria.reduce((sum, criterion) => sum + criterion.score, 0) / criteria.length);

/** Words only, lowercase, apostrophes dropped, so a quote matches however it was cased, quoted or punctuated. */
const squash = (text: string): string =>
  text
    .toLowerCase()
    .replace(/['’‘`]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

/** A piece of a quote shorter than this proves nothing ("I", "ok"). */
const MIN_QUOTE_CHARS = 5;

/**
 * Whether `quote` is the learner's own words: every piece of it (split at an ellipsis) appears inside one of their messages. Used to
 * reject a debrief that "quotes" lines nobody said.
 */
export function quoteAppears(quote: string, learnerLines: readonly string[]): boolean {
  const pieces = quote
    .split(/…|\.{2,}/)
    .map(squash)
    .filter(Boolean);
  if (pieces.length === 0 || pieces.some((piece) => piece.length < MIN_QUOTE_CHARS)) return false;
  const haystacks = learnerLines.map((line) => ` ${squash(line)} `);
  return pieces.every((piece) => haystacks.some((haystack) => haystack.includes(` ${piece} `)));
}
