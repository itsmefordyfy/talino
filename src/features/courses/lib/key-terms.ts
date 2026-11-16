import type { Lesson } from '../content/types';
import type { InlinePart } from './plain-text';

/**
 * A lesson's key terms, bolded wherever they come up in its reading text (owner, 2026-11-15: "make the word bold if there's a keyword
 * inside the sentence"). Lessons have no glossary field, but their authors already bold each term where it is introduced
 * (`**token**`, `**pull request**`), so those bold words ARE the lesson's key terms; this finds them and bolds the term again in every
 * other paragraph or list item that mentions it. Presentation only: the characters never change, so Listen's sentences, word timing and
 * the recordings' hash are untouched.
 */
export type KeyTerm = {
  /** As the lesson bolds it the first time ("token", "API key", "Git"). */
  text: string;
  /** Names and acronyms ("Git", "API") match only as written; ordinary words ("token") in any case. */
  caseSensitive: boolean;
};

// Words bolded for emphasis ("**not**", "**always**"), not because they name something.
const EMPHASIS = new Set([
  'a', 'all', 'also', 'always', 'an', 'and', 'any', 'anything', 'are', 'as', 'at', 'be', 'before', 'after', 'both', 'but', 'by', 'can',
  "can't", 'cannot', 'do', 'does', "don't", 'done', 'each', 'even', 'ever', 'every', 'everything', 'exactly', 'first', 'for', 'from', 'had',
  'has', 'have', 'here', 'how', 'if', 'in', 'instead', 'is', 'it', 'its', 'just', 'last', 'least', 'less', 'more', 'most', 'must', 'never',
  'new', 'no', 'none', 'not', 'nothing', 'now', 'of', 'on', 'once', 'one', 'only', 'or', 'own', 'really', 'right', 'same', 'should',
  'something', 'still', 'than', 'that', 'the', 'then', 'there', 'these', 'this', 'those', 'to', 'today', 'too', 'two', 'very', 'was',
  'what', 'when', 'where', 'which', 'who', 'why', 'will', 'with', 'without', "won't", 'wrong', 'yes', 'you', 'your',
  // Verbs and words a lesson stresses mid-sentence ("trust what people **did**", "an app that **looks** finished").
  'again', 'another', 'better', 'best', 'could', 'did', 'different', 'few', 'he', 'her', 'him', 'i', 'keep', 'look', 'looks', 'made', 'make',
  'makes', 'many', 'may', 'me', 'might', 'much', 'my', 'need', 'needs', 'other', 'our', 'save', 'say', 'see', 'she', 'their', 'them', 'they',
  'try', 'us', 'use', 'used', 'uses', 'want', 'we', 'worse', 'would',
]);
// A bold phrase opening with one of these is an instruction ("**never commit**"), not a term.
const LEADS = new Set(['not', 'never', 'always', 'only', "don't", 'do', 'must', 'every', 'each', 'all', 'no', 'just', 'also', 'still', 'avoid', 'stop']);

// What follows a bold opening word when it is an instruction ("**Read** every line", "**Pin** your three best").
const IMPERATIVE_OBJECT = /^\s+(it|its|the|a|an|your|them|what|one|every|each|if|this|that|these|those|my|our|their|his|her|him|me|us|you|to|in|on|at|for|with|from|before|after|and|or)\b/i;

/** Whether a bold span names a term (1 to 4 words), rather than labelling a paragraph ("In plain words."), stressing a word or quoting something. */
export function isKeyTerm(raw: string): boolean {
  const term = raw.trim();
  if (term.length < 2 || term.length > 40) return false;
  if (/[`"“”‘’'*()[\]\n]/.test(term)) return false;
  if (/[.,:;!?]$/.test(term) || !/^[A-Za-z]/.test(term)) return false;
  const words = term.split(/\s+/);
  if (words.length > 4) return false;
  const lower = words.map((word) => word.toLowerCase());
  if (LEADS.has(lower[0]) || lower.every((word) => EMPHASIS.has(word))) return false;
  // Two letters are a term only as an acronym ("AI", "UI"); "go" or "it" would light up everywhere.
  if (term.length < 3 && term !== term.toUpperCase()) return false;
  return true;
}

type LessonText = Pick<Lesson, 'body' | 'intro'>;

/** The reading text of a lesson where terms are introduced and later bolded: never titles, headings, labels, code, prompts or tables. */
function readingTexts(lesson: LessonText): string[] {
  const texts: string[] = [...(lesson.intro?.objectives ?? []), ...(lesson.intro ? [lesson.intro.why] : [])];
  for (const block of lesson.body) {
    if (block.type === 'paragraph' || block.type === 'tip' || block.type === 'warning') texts.push(block.text);
    else if (block.type === 'list' || block.type === 'takeaways') texts.push(...block.items);
    else if (block.type === 'details') texts.push(...block.body);
  }
  return texts;
}

/** The lesson's key terms, longest first so "API key" is found before "API". */
export function lessonKeyTerms(lesson: LessonText): KeyTerm[] {
  const found = new Map<string, KeyTerm>();
  // The same pattern `parseInline` uses for bold, so a term is exactly what the screen draws bold.
  const pattern = /\*\*(.+?)\*\*/g;
  for (const text of readingTexts(lesson)) {
    for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
      const term = match[1].trim();
      if (!isKeyTerm(term)) continue;
      // "**Tokens** cost money" is capitalised only because it opens the sentence: it is the word "tokens".
      const opensSentence = /(^|[.!?:][*"”')\]]*\s+)$/.test(text.slice(0, match.index));
      // "**Run** it and compare", "**Ask** the AI": a bold verb opening an instruction, not a term being named.
      if (opensSentence && !/\s/.test(term) && IMPERATIVE_OBJECT.test(text.slice(match.index + match[0].length))) continue;
      const caseSensitive = /[A-Z]/.test(term.slice(1)) || (/^[A-Z]/.test(term) && !opensSentence);
      const key = term.toLowerCase();
      const known = found.get(key);
      if (!known) found.set(key, { text: term, caseSensitive });
      else if (!caseSensitive) known.caseSensitive = false;
    }
  }
  return [...found.values()].sort((a, b) => b.text.length - a.text.length);
}

function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** The term as a pattern: spaces match any run of spaces, and a plural ("tokens", "APIs") counts as the term. */
function termSource(term: string): string {
  const stem = /s$/i.test(term) && term.length > 3 ? term.slice(0, -1) : term;
  const body = escape(stem).replace(/\s+/g, '\\s+');
  return /[A-Za-z]$/.test(stem) ? `${body}(?:s|es)?` : body;
}

// A hyphen counts as part of the word, so "token" never lights up half of "token-based".
const WORD_CHAR = /[A-Za-z0-9_À-ɏ-]/;

function isWholeWord(text: string, start: number, end: number): boolean {
  return !WORD_CHAR.test(text.charAt(start - 1)) && !WORD_CHAR.test(text.charAt(end));
}

type Mention = { part: number; start: number; end: number };

/**
 * `parts` (from `parseInline`) with the first mention of each key term in this block drawn bold. Once per paragraph or list item reads
 * better than every mention. Code is never touched, and a block that already bolds a term gets no second bold for it. Returns the same
 * characters in the same order, so sentence ranges and Listen's word offsets are identical.
 */
export function emphasizeKeyTerms(parts: readonly InlinePart[], terms: readonly KeyTerm[]): readonly InlinePart[] {
  if (terms.length === 0) return parts;
  const picks: Mention[] = [];
  for (const term of terms) {
    const flags = term.caseSensitive ? 'g' : 'gi';
    const source = termSource(term.text);
    const whole = new RegExp(`^(?:${source})$`, term.caseSensitive ? '' : 'i');
    if (parts.some((part) => part.bold && whole.test(part.text.trim()))) continue;
    const pick = firstMention(parts, new RegExp(source, flags), picks);
    if (pick) picks.push(pick);
  }
  if (picks.length === 0) return parts;
  const out: InlinePart[] = [];
  parts.forEach((part, index) => {
    const here = picks.filter((pick) => pick.part === index).sort((a, b) => a.start - b.start);
    if (here.length === 0) {
      out.push(part);
      return;
    }
    let at = 0;
    for (const pick of here) {
      if (pick.start > at) out.push({ ...part, text: part.text.slice(at, pick.start) });
      out.push({ ...part, text: part.text.slice(pick.start, pick.end), bold: true });
      at = pick.end;
    }
    if (at < part.text.length) out.push({ ...part, text: part.text.slice(at) });
  });
  return out;
}

function firstMention(parts: readonly InlinePart[], pattern: RegExp, taken: readonly Mention[]): Mention | null {
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    if (part.bold || part.code) continue;
    pattern.lastIndex = 0;
    for (let match = pattern.exec(part.text); match; match = pattern.exec(part.text)) {
      const start = match.index;
      const end = start + match[0].length;
      const overlaps = taken.some((pick) => pick.part === index && start < pick.end && end > pick.start);
      if (!overlaps && isWholeWord(part.text, start, end)) return { part: index, start, end };
      // A zero-length match can't happen (every term has letters), but never loop on one.
      if (match[0].length === 0) pattern.lastIndex += 1;
    }
  }
  return null;
}
