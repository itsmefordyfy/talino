/**
 * The architecture decision record (ADR) builder's pure logic: the draft the learner fills in, a defensive reader for saved drafts, plain-word checks for what a
 * useful record needs, and a MADR-style Markdown writer. Nothing here writes the decision for the learner and nothing calls an AI: the checks are rules.
 */

export const ADR_STATUSES = ['proposed', 'accepted', 'deprecated', 'superseded'] as const;
export type AdrStatus = (typeof ADR_STATUSES)[number];

export type AdrOption = { name: string; pros: string[]; cons: string[] };

export type AdrDraft = {
  title: string;
  status: AdrStatus;
  /** `YYYY-MM-DD`, or empty when unknown. */
  date: string;
  context: string;
  drivers: string[];
  /** 2 to 5 options, the learner's own. */
  options: AdrOption[];
  /** `chosen` is the name of one of the options; `reason` is why, in the learner's words. */
  decision: { chosen: string; reason: string };
  consequences: { good: string[]; bad: string[] };
  notes: string;
};

/** Sizes that keep a saved record far under the store's 20,000-character limit even when every field is full (the form enforces them, the reader clips to them). */
export const ADR_LIMITS = {
  title: 100,
  context: 1500,
  reason: 800,
  notes: 1000,
  optionName: 80,
  item: 160,
  drivers: 6,
  consequences: 5,
  proscons: 4,
  options: { min: 2, max: 5 },
} as const;

/** A title longer than this reads as a paragraph, not a name. */
export const ADR_TITLE_TOO_LONG = 80;

const emptyOption = (): AdrOption => ({ name: '', pros: [], cons: [] });

export const newAdrOption = emptyOption;

/** A blank record dated `date` (`YYYY-MM-DD`), with two empty options to start from. */
export function newAdrDraft(date: string): AdrDraft {
  return {
    title: '',
    status: 'proposed',
    date: isIsoDate(date) ? date : '',
    context: '',
    drivers: [],
    options: [emptyOption(), emptyOption()],
    decision: { chosen: '', reason: '' },
    consequences: { good: [], bad: [] },
    notes: '',
  };
}

/** Today's date (the phone's own calendar) as `YYYY-MM-DD`, for a new record. */
export const todayIso = (now: Date = new Date()): string => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

export const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown, max: number) => (typeof value === 'string' ? value.slice(0, max) : '');
const list = (value: unknown, max: number, itemMax: number): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').slice(0, max).map((item) => item.slice(0, itemMax)) : [];

/**
 * Reads a saved draft back, whatever is in it: anything that is not an object is `null`; missing or wrong-typed fields become empty, lists and text are clipped to
 * the form's limits, and the options are brought into the 2 to 5 range.
 */
export function parseAdrDraft(value: unknown): AdrDraft | null {
  if (!isRecord(value)) return null;
  const status = ADR_STATUSES.find((candidate) => candidate === value.status) ?? 'proposed';
  const date = typeof value.date === 'string' && isIsoDate(value.date) ? value.date : '';
  const rawOptions = Array.isArray(value.options) ? value.options.filter(isRecord).slice(0, ADR_LIMITS.options.max) : [];
  const options: AdrOption[] = rawOptions.map((option) => ({
    name: text(option.name, ADR_LIMITS.optionName),
    pros: list(option.pros, ADR_LIMITS.proscons, ADR_LIMITS.item),
    cons: list(option.cons, ADR_LIMITS.proscons, ADR_LIMITS.item),
  }));
  while (options.length < ADR_LIMITS.options.min) options.push(emptyOption());
  const decision = isRecord(value.decision) ? value.decision : {};
  const consequences = isRecord(value.consequences) ? value.consequences : {};
  return {
    title: text(value.title, ADR_LIMITS.title),
    status,
    date,
    context: text(value.context, ADR_LIMITS.context),
    drivers: list(value.drivers, ADR_LIMITS.drivers, ADR_LIMITS.item),
    options,
    decision: { chosen: text(decision.chosen, ADR_LIMITS.optionName), reason: text(decision.reason, ADR_LIMITS.reason) },
    consequences: { good: list(consequences.good, ADR_LIMITS.consequences, ADR_LIMITS.item), bad: list(consequences.bad, ADR_LIMITS.consequences, ADR_LIMITS.item) },
    notes: text(value.notes, ADR_LIMITS.notes),
  };
}

/** What a saved record's content holds, or `null` when it is not JSON or not a draft. */
export function parseAdrContent(content: string): AdrDraft | null {
  try {
    return parseAdrDraft(JSON.parse(content));
  } catch {
    return null;
  }
}

/** The text stored for a saved record. */
export const adrToContent = (draft: AdrDraft): string => JSON.stringify(draft);

// ---- Editing helpers (pure, so the form stays thin) ----

/** Renames option `index`; when the decision named the old name, it follows the new one, so a rename never silently breaks the decision. */
export function renameOption(draft: AdrDraft, index: number, name: string): AdrDraft {
  const previous = draft.options[index]?.name ?? '';
  const follows = previous.trim() !== '' && draft.decision.chosen.trim() === previous.trim();
  return { ...draft, options: draft.options.map((option, at) => (at === index ? { ...option, name } : option)), decision: follows ? { ...draft.decision, chosen: name } : draft.decision };
}

/** Removes option `index` unless that would leave fewer than two; the decision is cleared if it named the removed option. */
export function removeOption(draft: AdrDraft, index: number): AdrDraft {
  if (draft.options.length <= ADR_LIMITS.options.min) return draft;
  const removed = draft.options[index]?.name.trim() ?? '';
  const clears = removed !== '' && draft.decision.chosen.trim() === removed;
  return { ...draft, options: draft.options.filter((_, at) => at !== index), decision: clears ? { ...draft.decision, chosen: '' } : draft.decision };
}

/** Adds an empty option, up to five. */
export const addOption = (draft: AdrDraft): AdrDraft => (draft.options.length >= ADR_LIMITS.options.max ? draft : { ...draft, options: [...draft.options, emptyOption()] });

/** True when the draft holds nothing the learner typed (a fresh record), ignoring status and date. */
export function isBlankDraft(draft: AdrDraft): boolean {
  const empty = (value: string) => value.trim() === '';
  return (
    empty(draft.title) &&
    empty(draft.context) &&
    empty(draft.decision.chosen) &&
    empty(draft.decision.reason) &&
    empty(draft.notes) &&
    draft.drivers.every(empty) &&
    draft.consequences.good.every(empty) &&
    draft.consequences.bad.every(empty) &&
    draft.options.every((option) => empty(option.name) && option.pros.every(empty) && option.cons.every(empty))
  );
}

// ---- Checks ----

export type AdrField = 'title' | 'date' | 'context' | 'drivers' | 'options' | 'decision' | 'reason' | 'good' | 'bad' | 'notes';

/** `missing`: the record is not usable without it. `improve`: it would be stronger with it. Neither blocks saving. */
export type AdrSeverity = 'missing' | 'improve';

export type AdrProblemId =
  | 'title-empty'
  | 'title-question'
  | 'title-long'
  | 'date-missing'
  | 'date-format'
  | 'context-empty'
  | 'context-thin'
  | 'drivers-none'
  | 'options-few'
  | 'option-thin'
  | 'decision-none'
  | 'decision-unknown'
  | 'reason-missing'
  | 'reason-vague'
  | 'good-none'
  | 'bad-none'
  | 'tbd';

export type AdrProblem = { id: AdrProblemId; field: AdrField; severity: AdrSeverity; message: string; /** The option a finding is about, when it is about one. */ optionIndex?: number };

const clean = (value: string) => value.trim();
const realItems = (items: readonly string[]) => items.map(clean).filter((item) => item !== '');
const sameName = (a: string, b: string) => clean(a).toLowerCase() === clean(b).toLowerCase();

/** Options with a name, once per distinct name (two options called "Postgres" are one real option). */
export function realOptions(draft: AdrDraft): AdrOption[] {
  const seen = new Set<string>();
  return draft.options.filter((option) => {
    const key = clean(option.name).toLowerCase();
    if (key === '' || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const QUESTION_START = /^(should|shall|how|what|which|why|when|where|who|do|does|did|can|could|would|is|are|will)\b/i;
const TBD = /\b(tbd|tba|todo|to be decided|to be determined|to be confirmed|fill in|xxx)\b/i;

/** Phrases that sound like reasons and are not: "because it is the best" says nothing a reader can check. */
const VAGUE_PHRASES = [
  'industry standard',
  'industry-standard',
  'best practice',
  'best practices',
  'everyone uses it',
  'everybody uses it',
  'everyone else uses it',
  'most popular',
  'very popular',
  'popular',
  'obviously',
  'clearly',
  'of course',
  'just works',
  'the best',
  'best',
  'modern',
  'standard',
  'simple',
  'easy',
  'better',
  'right',
  'good',
  'common sense',
  'we always do',
  'future-proof',
  'future proof',
  'scalable',
  'robust',
];
const FILLER_WORDS = new Set(['a', 'an', 'the', 'it', 'is', 'its', "it's", 'are', 'was', 'be', 'to', 'of', 'and', 'or', 'we', 'i', 'this', 'that', 'one', 'option', 'choice', 'way', 'because', 'so', 'as', 'for', 'on', 'in', 'at', 'very', 'really', 'just', 'too', 'also', 'more', 'most', 'than', 'with', 'our', 'my', 'us', 'will', 'can', 'solution', 'approach', 'thing', 'what', 'everyone', 'everybody', 'does', 'do', 'use', 'using', 'used', 'choose', 'chose', 'pick', 'picked', 'go', 'going', 'no', 'not', 'since', 'if', 'then', 'there', 'they', 'you', 'your']);

/** The words of `reason` left once vague phrases and filler are taken out: what could actually be checked. */
export function substantiveWords(reason: string): string[] {
  let rest = ` ${reason.toLowerCase().replace(/[^a-z0-9'\- ]+/g, ' ')} `;
  for (const phrase of [...VAGUE_PHRASES].sort((a, b) => b.length - a.length)) rest = rest.split(` ${phrase} `).join('  ');
  return rest.split(/\s+/).filter((word) => word !== '' && !FILLER_WORDS.has(word));
}

const sentences = (value: string) => value.split(/[.!?]+(?:\s|$)/).filter((part) => part.trim() !== '').length;
const lines = (value: string) => value.split(/\r?\n/).filter((line) => line.trim() !== '').length;
const wordCount = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

export const ADR_FIELD_LABEL: Record<AdrField, string> = { title: 'title', date: 'date', context: 'context', drivers: 'decision drivers', options: 'options', decision: 'decision', reason: 'reason', good: 'good consequences', bad: 'costs', notes: 'notes' };

/** The placeholders (TBD, TODO…) left in each field, one finding per field. */
function tbdFields(draft: AdrDraft): AdrField[] {
  const found: AdrField[] = [];
  const check = (field: AdrField, ...values: string[]) => {
    if (values.some((value) => TBD.test(value))) found.push(field);
  };
  check('title', draft.title);
  check('context', draft.context);
  check('drivers', ...draft.drivers);
  check('options', ...draft.options.flatMap((option) => [option.name, ...option.pros, ...option.cons]));
  check('decision', draft.decision.chosen);
  check('reason', draft.decision.reason);
  check('good', ...draft.consequences.good);
  check('bad', ...draft.consequences.bad);
  check('notes', draft.notes);
  return found;
}

/**
 * What a useful record is still missing, in the order a learner fills the form in, each in plain words and tied to a field. Rules, not an AI: it cannot tell
 * whether the reasoning is right, only whether it is there. The findings never stop a save; the learner reads them and decides.
 */
export function adrProblems(draft: AdrDraft): AdrProblem[] {
  const out: AdrProblem[] = [];
  const add = (problem: AdrProblem) => out.push(problem);

  const title = clean(draft.title);
  if (title === '') add({ id: 'title-empty', field: 'title', severity: 'missing', message: 'Give the record a short title that names the decision, for example "Use PostgreSQL for tenant data".' });
  else if (title.endsWith('?') || QUESTION_START.test(title)) add({ id: 'title-question', field: 'title', severity: 'improve', message: 'The title reads as a question. A record states the decision that was made, for example "Use PostgreSQL for tenant data".' });
  else if (title.length > ADR_TITLE_TOO_LONG) add({ id: 'title-long', field: 'title', severity: 'improve', message: `The title is long (${title.length} characters). Keep it to a short phrase and put the detail in the context.` });

  if (clean(draft.date) === '') add({ id: 'date-missing', field: 'date', severity: 'improve', message: 'Add the date, so a reader later knows what was true when you decided.' });
  else if (!isIsoDate(clean(draft.date))) add({ id: 'date-format', field: 'date', severity: 'improve', message: 'Write the date as year-month-day, for example 2026-11-18.' });

  const context = clean(draft.context);
  if (context === '') add({ id: 'context-empty', field: 'context', severity: 'missing', message: 'Describe the situation: what is the system, what forces you to decide now, and what limits you have (team, time, budget, rules).' });
  else if ((lines(context) < 2 && sentences(context) < 2) || wordCount(context) < 12) add({ id: 'context-thin', field: 'context', severity: 'improve', message: 'The context is one short line. A reader who was not in the room needs the situation, the pressure to decide and the limits in a few sentences.' });

  if (realItems(draft.drivers).length === 0) add({ id: 'drivers-none', field: 'drivers', severity: 'improve', message: 'List what the decision has to satisfy (for example "tenant data must be isolated", "two developers will run it"). Options are compared against these.' });

  const options = realOptions(draft);
  if (options.length < 2) add({ id: 'options-few', field: 'options', severity: 'missing', message: options.length === 0 ? 'Name at least two real options you considered, including the one you did not choose.' : 'Only one option is named. A decision needs at least two real options, including doing the simple thing or doing nothing.' });
  draft.options.forEach((option, index) => {
    if (clean(option.name) !== '' && realItems(option.pros).length === 0 && realItems(option.cons).length === 0) {
      add({ id: 'option-thin', field: 'options', severity: 'improve', optionIndex: index, message: `"${clean(option.name)}" has no pros or cons yet. Say what it gives you and what it costs.` });
    }
  });

  const chosen = clean(draft.decision.chosen);
  if (chosen === '') add({ id: 'decision-none', field: 'decision', severity: 'missing', message: 'Say which option you chose.' });
  else if (!draft.options.some((option) => clean(option.name) !== '' && (sameName(option.name, chosen) || chosen.toLowerCase().includes(clean(option.name).toLowerCase())))) {
    add({ id: 'decision-unknown', field: 'decision', severity: 'missing', message: `The decision "${chosen}" is not one of the options listed. Choose one of them, or add it as an option.` });
  }

  const reason = clean(draft.decision.reason);
  if (reason === '') add({ id: 'reason-missing', field: 'reason', severity: 'missing', message: 'State why you chose it, tied to the context or a driver. A decision without a reason cannot be revisited.' });
  else if (substantiveWords(reason).length < 2) add({ id: 'reason-vague', field: 'reason', severity: 'improve', message: 'The reason is a general claim ("best", "obviously", "industry standard") that a reader cannot check. Name the requirement or constraint it answers.' });

  if (realItems(draft.consequences.good).length === 0) add({ id: 'good-none', field: 'good', severity: 'improve', message: 'Say what gets easier because of this decision.' });
  if (realItems(draft.consequences.bad).length === 0) add({ id: 'bad-none', field: 'bad', severity: 'missing', message: 'Name at least one cost you accept. Every decision costs something: more to run, harder to change, a skill to learn, a risk you carry.' });

  for (const field of tbdFields(draft)) add({ id: 'tbd', field, severity: 'missing', message: `The ${ADR_FIELD_LABEL[field]} still has a placeholder ("TBD" or "TODO"). Fill it in, or say plainly that it is not decided yet and why.` });

  return out;
}

// ---- Markdown ----

/** One line: runs of whitespace (newlines too) become a single space, so a field can never add structure of its own to a list or a heading. */
const oneLine = (value: string) => value.replace(/\s+/g, ' ').trim();

/** A paragraph of the learner's own text, kept as written apart from trailing spaces and carriage returns. */
const paragraph = (value: string) => value.replace(/\r/g, '').split('\n').map((line) => line.trimEnd()).join('\n').trim();

const bullets = (items: readonly string[], prefix = '') => realItems(items).map((item) => `* ${prefix}${oneLine(item)}`);

const STATUS_LABEL: Record<AdrStatus, string> = { proposed: 'proposed', accepted: 'accepted', deprecated: 'deprecated', superseded: 'superseded' };

/**
 * The record as Markdown in the MADR layout (title, status, date, context, drivers, considered options, decision outcome, consequences, pros and cons of each option,
 * notes). It is plain text for copying: nothing is escaped or turned into HTML, so what the learner typed is what is copied; only line breaks inside a list item or a
 * heading are folded into spaces, so one field cannot add headings or items of its own.
 */
export function adrToMarkdown(draft: AdrDraft): string {
  const title = oneLine(draft.title) || 'Untitled decision';
  const out: string[] = [`# ${title}`, '', `* Status: ${STATUS_LABEL[draft.status]}`, `* Date: ${oneLine(draft.date) || 'not set'}`, ''];

  out.push('## Context and Problem Statement', '', paragraph(draft.context) || 'Not written yet.', '');

  const drivers = bullets(draft.drivers);
  if (drivers.length > 0) out.push('## Decision Drivers', '', ...drivers, '');

  const options = draft.options.filter((option) => oneLine(option.name) !== '');
  out.push('## Considered Options', '', ...(options.length > 0 ? options.map((option) => `* ${oneLine(option.name)}`) : ['* Not written yet.']), '');

  const chosen = oneLine(draft.decision.chosen);
  const reason = paragraph(draft.decision.reason);
  out.push('## Decision Outcome', '', chosen ? `Chosen option: "${chosen}"${reason ? ', because:' : '.'}` : 'No option chosen yet.');
  if (reason) out.push('', reason);
  out.push('');

  const good = bullets(draft.consequences.good, 'Good, because ');
  const bad = bullets(draft.consequences.bad, 'Bad, because ');
  out.push('### Consequences', '', ...(good.length + bad.length > 0 ? [...good, ...bad] : ['* Not written yet.']), '');

  if (options.length > 0) {
    out.push('## Pros and Cons of the Options', '');
    for (const option of options) {
      const pros = bullets(option.pros, 'Good, because ');
      const cons = bullets(option.cons, 'Bad, because ');
      out.push(`### ${oneLine(option.name)}`, '', ...(pros.length + cons.length > 0 ? [...pros, ...cons] : ['* Not written yet.']), '');
    }
  }

  const notes = paragraph(draft.notes);
  if (notes) out.push('## More Information', '', notes, '');

  return `${out.join('\n').trimEnd()}\n`;
}

/** The most characters of the learner's own record sent along when they ask Tali to challenge it (the chat box takes 4,000). */
export const MAX_CHALLENGE_RECORD_CHARS = 3200;

export const CHALLENGE_REQUEST =
  'Challenge this decision: what assumption would make it wrong, what option is missing, and what consequence did I leave out? Ask me questions first; do not rewrite my record or decide for me.';

/** What Tali is asked: the learner's record as Markdown (clipped, never the request), then the challenge. */
export function adrChallengePrompt(draft: AdrDraft): string {
  const markdown = adrToMarkdown(draft).trim();
  const clipped = markdown.length > MAX_CHALLENGE_RECORD_CHARS ? `${markdown.slice(0, MAX_CHALLENGE_RECORD_CHARS).trimEnd()}\n[…record shortened…]` : markdown;
  return `Here is my architecture decision record.\n\n${clipped}\n\n${CHALLENGE_REQUEST}`;
}
