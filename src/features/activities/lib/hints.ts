import type { Guidance } from '../types';

/** The hints this learner may see: independent learners keep only the last two (the nearly-there ones). */
export function availableHints(hints: readonly string[], guidance: Guidance): string[] {
  return guidance === 'independent' ? hints.slice(-2) : [...hints];
}

export type NextHint = {
  text: string;
  /** 1-based position among the available hints. */
  number: number;
  total: number;
  isLast: boolean;
};

/**
 * The next hint after `used` have been shown, or null when none are left. Hints come out strictly in order,
 * one at a time, so the last (nearly the answer) can never appear before the gentler ones.
 */
export function nextHint(hints: readonly string[], guidance: Guidance, used: number): NextHint | null {
  const available = availableHints(hints, guidance);
  const shown = Math.max(0, used);
  if (shown >= available.length) return null;
  return { text: available[shown], number: shown + 1, total: available.length, isLast: shown === available.length - 1 };
}

/** The hints already revealed, in order. */
export function shownHints(hints: readonly string[], guidance: Guidance, used: number): string[] {
  return availableHints(hints, guidance).slice(0, Math.max(0, used));
}

/** Guided learners are offered the first hint after this many wrong tries; others never are. */
export const GUIDED_OFFER_AFTER_WRONG = 2;

/** Whether to prompt "Tali has a hint ready": guided only, after two wrong tries, until the first hint is used. */
export function shouldOfferHint(guidance: Guidance, wrongTries: number, hintsUsed: number, hints: readonly string[]): boolean {
  return guidance === 'guided' && wrongTries >= GUIDED_OFFER_AFTER_WRONG && hintsUsed === 0 && availableHints(hints, guidance).length > 0;
}
