import type { MessageTask } from '../types';
import { wordCount } from './sanitize';

/**
 * When a message is worth sending to the coach: long enough to judge, and the learner's own (not the task's own words pasted back).
 * Shared by the screen (to enable the button) and the route (so a modified app can't spend a review on nothing).
 */

export type ReviewInputCheck = { ok: true } | { ok: false; reason: 'too_short' | 'not_original' };

/** A third of the shortest good answer, and never under ten words. */
export const minReviewWords = (task: Pick<MessageTask, 'targetWords'>): number => Math.max(10, Math.floor(task.targetWords.min / 3));

const words = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);

const SHINGLE = 4;
/** More than this share of the learner's word groups already in the task's text means it was copied. */
const COPIED_SHARE = 0.6;

const shingles = (list: readonly string[]): string[] => (list.length < SHINGLE ? [] : list.slice(0, list.length - SHINGLE + 1).map((_, index) => list.slice(index, index + SHINGLE).join(' ')));

function copiedFromTask(task: Pick<MessageTask, 'situation' | 'brief' | 'received'>, text: string): boolean {
  const own = shingles(words(text));
  if (own.length === 0) return false;
  const known = new Set(shingles(words([task.situation, task.brief, task.received ?? ''].join(' '))));
  // The three pieces are separate texts, so groups that straddle their joins are only extra; each piece is added alone too.
  for (const piece of [task.situation, task.brief, task.received ?? '']) for (const group of shingles(words(piece))) known.add(group);
  return own.filter((group) => known.has(group)).length / own.length > COPIED_SHARE;
}

export function checkReviewText(task: Pick<MessageTask, 'targetWords' | 'situation' | 'brief' | 'received'>, text: string): ReviewInputCheck {
  const trimmed = text.trim();
  // Copying is named first: a short paste of the task's own words is not "too short", it is not the learner's.
  if (copiedFromTask(task, trimmed)) return { ok: false, reason: 'not_original' };
  if (wordCount(trimmed) < minReviewWords(task)) return { ok: false, reason: 'too_short' };
  return { ok: true };
}
