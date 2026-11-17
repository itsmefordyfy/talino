import type { LabTask, PracticeItem } from '../types';

/**
 * Defence in depth for what the model says back. The prompts already forbid reciting the private brief, but a model can slip, and the
 * phone must never show the partner's hidden motives or the rubric. These checks are literal and cheap: a reply that repeats a private
 * line word for word, or talks about its own instructions, is refused (the route gives the allowance back and the learner retries).
 */

/** Everything an item holds that only the AI may see. */
export function privateStringsOf(item: PracticeItem): string[] {
  if (item.kind === 'roleplay') return [item.partner.personality, item.partner.private, item.partner.reactions.good, item.partner.reactions.poor, ...item.strongSigns, ...item.traps];
  if (item.kind === 'lab') return privateLabStrings(item);
  return [...item.mustInclude];
}

/** A lab's framing, its key's text values, the facts its material states and what its tools can answer: the model's side of the lab, never the learner's. */
export function privateLabStrings(lab: LabTask): string[] {
  const strings: string[] = [lab.system, ...(lab.facts ?? [])];
  for (const value of Object.values(lab.key ?? {})) {
    if (typeof value === 'string') strings.push(value);
    else if (Array.isArray(value)) strings.push(...value);
  }
  for (const tool of lab.tools ?? []) {
    for (const fixture of tool.fixtures) for (const value of [...Object.values(fixture.args), ...Object.values(fixture.result)]) if (typeof value === 'string') strings.push(value);
  }
  return strings;
}

/** Lowercase, punctuation to spaces, one space between words, so a line matches however it was cased or wrapped. */
const squash = (text: string): string =>
  text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

/** Shorter lines than this are common phrases ("a firm date"), not a leak. */
const MIN_LEAK_CHARS = 18;

/** Whether `text` repeats, word for word, a private line of the item that is long enough to be a recognisable one. */
export function leaksPrivate(text: string, item: PracticeItem): boolean {
  const haystack = ` ${squash(text)} `;
  return privateStringsOf(item)
    .map(squash)
    .filter((line) => line.length >= MIN_LEAK_CHARS)
    .some((line) => haystack.includes(` ${line} `));
}

const BREAKS = [/\bas an ai\b/i, /\blanguage model\b/i, /\bsystem prompt\b/i, /\bmy instructions\b/i, /\brubric\b/i, /\bthe learner\b/i, /\bin character\b/i];

/** A partner's line that steps out of the role to talk about the exercise itself. */
export const breaksCharacter = (text: string): boolean => BREAKS.some((pattern) => pattern.test(text));

/**
 * Whether a model's reply to a lab prompt repeats a whole sentence of the lab's own framing (`system`). A learner may ask the model to print its
 * instructions; the framing is the server's, so such a reply is refused rather than passed on. Other private text (the facts, the key, the tools'
 * answers) is deliberately not checked here: a good summary or a correct extraction repeats it legitimately.
 */
export function leaksLabFraming(text: string, lab: Pick<LabTask, 'system'>): boolean {
  const haystack = ` ${squash(text)} `;
  return lab.system
    .split(/(?<=[.!?])\s+|\n+/)
    .map(squash)
    .filter((line) => line.length >= MIN_LEAK_CHARS)
    .some((line) => haystack.includes(` ${line} `));
}
