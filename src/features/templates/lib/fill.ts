/** What Talino can fill in from the learner's profile and progress. */
export const PLACEHOLDERS = ['name', 'headline', 'skills', 'topProject', 'topProjectLink', 'portfolioLink', 'course'] as const;
export type Placeholder = (typeof PLACEHOLDERS)[number];

export type TemplateValues = Partial<Record<Placeholder, string | null>>;

/** What each placeholder asks for, shown in brackets while it's still empty. */
export const PLACEHOLDER_HINTS: Record<Placeholder, string> = {
  name: 'your name',
  headline: 'your headline',
  skills: 'your top skills',
  topProject: 'your best project',
  topProjectLink: 'link to your project',
  portfolioLink: 'link to your portfolio',
  course: 'your Talino course',
};

const isPlaceholder = (key: string): key is Placeholder => (PLACEHOLDERS as readonly string[]).includes(key);

/** `hiringManager` → "hiring manager": a readable hint for a blank only the learner can fill. */
export function hintFor(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .trim();
}

/**
 * What never goes to the AI: the name and the links stay as `{{tokens}}` in the text it sees (the résumé route's rule: no name or
 * contact details), and are filled in from the learner's own values once the draft is back.
 */
export const PRIVATE_PLACEHOLDERS: readonly Placeholder[] = ['name', 'portfolioLink', 'topProjectLink'];

export type FilledTemplate = {
  text: string;
  /** The hints left in brackets, in order of first appearance, each once. */
  blanks: string[];
};

/**
 * Fills `{{placeholders}}` from the learner's details. A known one with no value yet, and anything
 * Talino can't know (`{{company}}`), stays visible as `[hint]` so the learner sees what to complete
 * before sending; nothing is silently dropped.
 */
export function fillTemplate(body: string, values: TemplateValues, hints: Record<Placeholder, string> = PLACEHOLDER_HINTS, keep: readonly string[] = []): FilledTemplate {
  const blanks: string[] = [];
  const text = body.replace(/\{\{\s*([A-Za-z][\w-]*)\s*\}\}/g, (_match, key: string) => {
    // A kept token is left exactly as it is, to be filled in later.
    if (keep.includes(key)) return `{{${key}}}`;
    const value = isPlaceholder(key) ? values[key]?.trim() : undefined;
    if (value) return value;
    const hint = isPlaceholder(key) ? hints[key] : hintFor(key);
    if (!blanks.includes(hint)) blanks.push(hint);
    return `[${hint}]`;
  });
  return { text, blanks };
}

/** The `[brackets]` still in a text, each once, in order: what is left for the learner to complete (an AI draft leaves some). */
export function bracketBlanks(text: string): string[] {
  const found: string[] = [];
  for (const match of text.matchAll(/\[([^\[\]\n]{2,60})\]/g)) if (!found.includes(match[1])) found.push(match[1]);
  return found;
}
