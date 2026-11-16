import type { Language } from '@/lib/language';

/** How many turns of a chat go to the model at most (the server enforces it again). */
export const MAX_TURNS = 16;

/**
 * The turns to send: all of them while they fit, otherwise the FIRST one plus the latest ones. The opening message usually
 * says what the learner is trying to do, so a long chat must not forget it; the rest of the middle is dropped.
 */
export function trimTurns<T>(turns: readonly T[], max: number = MAX_TURNS): T[] {
  if (turns.length <= max) return [...turns];
  return [turns[0], ...turns.slice(-(max - 1))];
}

/** Said under a reply the model had to stop for length, so a cut-off answer never looks finished. */
export function cutShortNote(language: Language): string {
  return language === 'fil' ? '(Naputol ang sagot dahil sa haba. I-send ang "continue" para sa karugtong.)' : '(The answer was cut short because of its length. Send "continue" to get the rest.)';
}

/** Whether Gemini stopped because it ran out of room (`MAX_TOKENS`), not because the answer was complete. */
export const wasCutShort = (finishReason: string | undefined) => finishReason === 'MAX_TOKENS';
