/**
 * Everything the route is willing to read from the phone, bounded and checked. The learner's text is untrusted (it may try to
 * rewrite the instructions) and is only ever shown to the model as data; here it is made safe in shape: strings, a known role, a
 * length cap, and a bound on how many entries are even looked at.
 */

export type PracticeRole = 'user' | 'assistant';
export type PracticeMessage = { role: PracticeRole; text: string };

/** A learner's turn is typed in a box that holds this many characters. */
export const MAX_LEARNER_CHARS = 2000;
/** A partner's line is far shorter; anything longer is not one of ours. */
export const MAX_PARTNER_CHARS = 1500;
/** A message the learner writes for the coach (an email, a chat message, an update). */
export const MAX_REVIEW_CHARS = 4000;
/** A learner's prompt in a prompt lab: long enough for a real prompt (a role, the context, the task, the format), short enough that one run stays cheap. */
export const MAX_LAB_PROMPT_CHARS = 2500;
/** What a lab run may return to the phone, and the most the phone may send back for a review. A model reply past this is cut, never passed on whole. */
export const MAX_LAB_OUTPUT_CHARS = 6000;
/** The most messages sent to the model with one turn; the opening is restated in the instructions and the earlier ones are summarised by their absence. */
export const MAX_SENT_MESSAGES = 16;
/** Bound on how many raw entries are even looked at. */
export const MAX_RAW_MESSAGES = MAX_SENT_MESSAGES * 2 + 4;

// Control characters other than newline and tab have no place in a message and can confuse a model's input.
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** A string, trimmed, without control characters, at most `max` characters; anything else is empty. */
export const cleanText = (value: unknown, max: number): string => (typeof value === 'string' ? value.replace(CONTROL, '').trim().slice(0, max) : '');

/** A whole number from `min` to `max`; a missing or non-numeric value is `min`. */
export const whole = (value: unknown, min: number, max: number): number => (typeof value === 'number' && Number.isFinite(value) ? Math.max(min, Math.min(max, Math.floor(value))) : min);

export const wordCount = (text: string): number => text.split(/\s+/).filter(Boolean).length;

/** The learner's text goes between triple quotes in the prompts, so it can't contain a closing one. */
export const neutraliseQuotes = (text: string): string => text.replace(/"{3,}/g, "'''");

function toMessage(value: unknown): PracticeMessage | null {
  if (typeof value !== 'object' || value === null) return null;
  const { role, text } = value as Record<string, unknown>;
  if (role !== 'user' && role !== 'assistant') return null;
  const clean = cleanText(text, role === 'user' ? MAX_LEARNER_CHARS : MAX_PARTNER_CHARS);
  return clean ? { role, text: clean } : null;
}

/** The latest entries of what the phone sent, as messages the engine accepts (unknown roles and empty text dropped). */
export const sanitizeMessages = (value: unknown): PracticeMessage[] =>
  (Array.isArray(value) ? value.slice(-MAX_RAW_MESSAGES) : []).map(toMessage).filter((message): message is PracticeMessage => message !== null);
