/**
 * A rule-based look at the structure of a prompt, for the AI Prompt Playground. **It does not run an AI and it cannot judge whether a prompt
 * will work**; it checks, with simple word patterns, whether the parts that usually make a planning prompt useful are there, and says what to add.
 * Labelled that way on screen. The live model is Tali, the coach.
 */

export const PART_IDS = ['role', 'goal', 'context', 'inputs', 'limits', 'format', 'askBack'] as const;
export type PartId = (typeof PART_IDS)[number];

/** What each part is and what to add when it is missing (shown as the suggestion). */
export const PART_INFO: Record<PartId, { label: string; suggestion: string }> = {
  role: { label: 'A role', suggestion: 'Start by saying who the AI should be, for example "Act as a practical planning coach".' },
  goal: { label: 'A clear request', suggestion: 'Say exactly what you want it to do, with a verb: plan, sort, break down, summarise.' },
  context: { label: 'Enough context', suggestion: 'Add a few sentences about your situation: your work or study, your hours and what is going on. The AI cannot see your calendar or your week.' },
  inputs: { label: 'Your own details filled in', suggestion: 'Replace every [bracket] with your real details, or delete the line if it does not apply.' },
  limits: { label: 'Limits', suggestion: 'Name your limits: hours available, a deadline, a cap on focused work, breaks you need. Without them the AI will plan for a day you do not have.' },
  format: { label: 'The shape of the answer', suggestion: 'Say how you want the answer: a table, a numbered list, a checklist, or "short".' },
  askBack: { label: 'A request to ask or to state assumptions', suggestion: 'Add "Ask me any questions you need first, and list the assumptions you made", so gaps show up before you rely on the answer.' },
};

const PATTERNS: Record<Exclude<PartId, 'context' | 'inputs'>, RegExp> = {
  role: /\b(act as|you are|play the role|take the role|as my (?:\w+ ){0,2}(?:coach|planner|assistant|editor|note-taker|partner))\b/i,
  goal: /\b(plan|sort|prioriti[sz]e|break|turn|summar\w+|create|build|write|list|organi[sz]e|schedule|review|draft|compare|extract|help me|give me)\b/i,
  limits: /\b(do not|don't|never|only|must|no more than|at most|at least|maximum|limits?|deadline|within|under \d+|\d+\s?(?:hours?|hrs?|minutes?|mins?|days?|weeks?))\b/i,
  format: /\b(table|bullets?|list|numbered|checklist|columns?|headings?|format|steps?|summary|short)\b/i,
  askBack: /\b(ask me|ask any|ask for|questions? (?:first|before)|if (?:anything|something) is (?:missing|unclear)|assumptions?|what you cannot tell|least sure|unsure)\b/i,
};

/** Enough detail to be useful: the check looks for about three sentences of it. */
export const CONTEXT_MIN_WORDS = 30;

/** The text inside each [bracket] that is still to be filled in, once each, in order. */
export function findPlaceholders(text: string): string[] {
  const found: string[] = [];
  for (const match of text.matchAll(/\[([^\]\n]{1,100})\]/g)) {
    const inner = match[1]!.trim();
    if (inner && !found.includes(inner)) found.push(inner);
  }
  return found;
}

export type PromptPart = { id: PartId; label: string; present: boolean };
export type PromptCheck = { score: number; words: number; parts: PromptPart[]; placeholders: string[]; suggestions: string[] };

export function checkPrompt(text: string): PromptCheck {
  const words = text.split(/\s+/).filter(Boolean).length;
  const placeholders = findPlaceholders(text);
  const present: Record<PartId, boolean> =
    words === 0
      ? { role: false, goal: false, context: false, inputs: false, limits: false, format: false, askBack: false }
      : {
          role: PATTERNS.role.test(text),
          goal: PATTERNS.goal.test(text),
          context: words >= CONTEXT_MIN_WORDS,
          inputs: placeholders.length === 0,
          limits: PATTERNS.limits.test(text),
          format: PATTERNS.format.test(text),
          askBack: PATTERNS.askBack.test(text),
        };
  const parts = PART_IDS.map((id): PromptPart => ({ id, label: PART_INFO[id].label, present: present[id] }));
  const score = Math.round((100 * parts.filter((part) => part.present).length) / parts.length);
  return { score, words, parts, placeholders, suggestions: parts.filter((part) => !part.present && words > 0).map((part) => PART_INFO[part.id].suggestion) };
}

export type PrivacyRisk = 'email' | 'phone' | 'secret';

/** Things that should not be pasted into an AI tool. A reminder, not a guarantee: it cannot see every kind of private detail. */
export function privacyRisks(text: string): PrivacyRisk[] {
  const risks: PrivacyRisk[] = [];
  if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(text)) risks.push('email');
  if (/(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{3,4}\)?[\s-]?)\d{3}[\s-]?\d{4}\b/.test(text)) risks.push('phone');
  if (/\b(password|passcode|api[_ -]?key|secret|token)\b/i.test(text) || /\bsk-[A-Za-z0-9]{20,}/.test(text)) risks.push('secret');
  return risks;
}
