import type { LessonBlock } from '../content/types';

export type DemoBlock = Extract<LessonBlock, { type: 'demo' }>;

/** Longest a demo's parts may be, so the card stays readable on a phone and Listen reads it in sentences, not in one wall. */
export const DEMO_LIMITS = { prompt: 1200, output: 2000, notice: 800 } as const;

/**
 * Phrases that present the example as something a real model said or that was recorded. A demo is a hand-written illustration and the app labels it so;
 * a title or note that says otherwise would contradict the badge.
 */
const REAL_CLAIM = /\b(real|actual|genuine|recorded|verbatim|unedited|live)\s+(model|ai|output|response|answer|reply|conversation|chat|transcript|screenshot)s?\b|\b(chatgpt|gemini|claude|copilot|the ai|the model)\s+(replied|responded|answered|said|wrote|generated|produced|returned)\b|\b(generated|written|produced|recorded) by (chatgpt|gemini|claude|copilot|an? (ai|model))\b|\bscreenshot of\b/gi;

/** "Not a real model's output" says the opposite of a claim: a negation just before the phrase clears it. */
const NEGATION = /\b(not|never|isn't|aren't|wasn't|without|no|nor)\b[^.!?]{0,40}$/i;

/** The first phrase in `text` that claims the example is real or recorded, or null. */
export function realOutputClaim(text: string): string | null {
  for (const match of text.matchAll(REAL_CLAIM)) {
    const before = text.slice(Math.max(0, (match.index ?? 0) - 45), match.index ?? 0);
    if (!NEGATION.test(before)) return match[0];
  }
  return null;
}

/** Everything wrong with an "AI in Action" block, in plain words (empty: it can ship). */
export function demoBlockProblems(block: DemoBlock): string[] {
  const problems: string[] = [];
  for (const key of ['title', 'prompt', 'output', 'notice'] as const) {
    if (typeof block[key] !== 'string' || block[key].trim() === '') problems.push(`the demo has an empty ${key}`);
  }
  for (const key of ['prompt', 'output', 'notice'] as const) {
    if (typeof block[key] === 'string' && block[key].length > DEMO_LIMITS[key]) problems.push(`the demo ${key} is ${block[key].length} characters (at most ${DEMO_LIMITS[key]})`);
  }
  // Only the author's own framing is checked: the example's `output` is the illustration itself.
  for (const key of ['title', 'notice'] as const) {
    const claim = typeof block[key] === 'string' ? realOutputClaim(block[key]) : null;
    if (claim) problems.push(`the demo ${key} says "${claim}": a demo is a hand-written illustration, never a real or recorded model output`);
  }
  return problems;
}
