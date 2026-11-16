/**
 * What Listen says, cut into the pieces the screen can follow. Every lesson's spoken text is a list of SEGMENTS: usually one sentence
 * each, or a whole on-screen thing announced in a line ("There is a table on screen."). A segment knows which UNIT of the lesson screen
 * it belongs to (a paragraph, a list item, the title...) and, for text, which sentence of it, so the screen can highlight exactly the
 * words being spoken and a tap on a sentence can find the audio that says it.
 *
 * Pure, with no native imports: the Kokoro export script (`scripts/audio/export-scripts.cjs`) uses this same file to cut each lesson
 * into the pieces it synthesises one by one, which is where the exact start and end of every sentence in a recording comes from.
 */
import type { Language } from '@/lib/language';

import type { Lesson, LessonBlock } from '../content/types';
import { splitLesson } from './lesson-structure';
import { parseInline, stripInline, type InlinePart, type OutlineSection } from './plain-text';
import { speechPhrases, type SpeechPhrases } from './speech-phrases';

/** A sentence shorter than this joins its neighbour: a highlight that flashes for a word looks like a flicker, and "Yes." alone sounds odd. */
const MIN_SENTENCE = 20;

/** Words that end in a full stop without ending the sentence ("e.g.", "Dr."): matched against the word before the stop. */
const ABBREVIATIONS = new Set(['e.g', 'i.e', 'vs', 'etc', 'approx', 'dr', 'mr', 'mrs', 'ms', 'prof', 'st', 'inc', 'ltd', 'no', 'fig', 'u.s', 'a.m', 'p.m', 'sr', 'jr', 'cf', 'ex']);

export type TextRange = { start: number; end: number };

/**
 * Where each sentence of a plain text starts and ends (end exclusive; the whitespace between sentences is in no range). A sentence ends
 * at . ! ? or an ellipsis, with any closing quote or bracket, followed by a space, unless the stop belongs to an abbreviation or an initial. A colon never ends one. Short sentences are joined to the next (or, at the end, the one before).
 */
export function sentenceRanges(text: string): TextRange[] {
  const ranges: TextRange[] = [];
  let start = 0;
  while (start < text.length && /\s/.test(text[start])) start += 1;
  if (start >= text.length) return ranges;
  const stop = /[.!?…]+["'”’)\]]*(?=\s)/g;
  stop.lastIndex = start;
  for (let match = stop.exec(text); match; match = stop.exec(text)) {
    const end = match.index + match[0].length;
    let next = end;
    while (next < text.length && /\s/.test(text[next])) next += 1;
    if (next >= text.length) break;
    const before = text.slice(start, match.index);
    const word = (before.match(/([A-Za-z.]+)$/)?.[1] ?? '').toLowerCase();
    const isInitial = /(^|\s)[A-Z]$/.test(before);
    const endsWithPeriod = match[0].startsWith('.');
    if (endsWithPeriod && (ABBREVIATIONS.has(word) || isInitial)) continue;
    ranges.push({ start, end });
    start = next;
    stop.lastIndex = next;
  }
  let last = text.length;
  while (last > start && /\s/.test(text[last - 1])) last -= 1;
  ranges.push({ start, end: last });

  // Join short sentences to the one after them; a short one at the very end joins the one before.
  const joined: TextRange[] = [];
  let carry: TextRange | null = null;
  for (const range of ranges) {
    const current: TextRange = carry ? { start: carry.start, end: range.end } : { ...range };
    carry = null;
    if (current.end - current.start < MIN_SENTENCE && range !== ranges[ranges.length - 1]) carry = current;
    else joined.push(current);
  }
  if (joined.length > 1) {
    const tail = joined[joined.length - 1];
    if (tail.end - tail.start < MIN_SENTENCE) {
      joined.pop();
      joined[joined.length - 1] = { start: joined[joined.length - 1].start, end: tail.end };
    }
  }
  return joined.flatMap((range) => splitLong(text, range));
}

/** A sentence this long is cut at semicolons (never into pieces shorter than MIN_PIECE), so one highlight and one jump never cover a minute of speech. */
const LONG_SENTENCE = 420;
const MIN_PIECE = 120;

function splitLong(text: string, range: TextRange): TextRange[] {
  if (range.end - range.start <= LONG_SENTENCE) return [range];
  const pieces: TextRange[] = [];
  let start = range.start;
  const stop = /;(?=\s)/g;
  const slice = text.slice(range.start, range.end);
  for (let match = stop.exec(slice); match; match = stop.exec(slice)) {
    const end = range.start + match.index + 1;
    if (end - start >= MIN_PIECE && range.end - end >= MIN_PIECE) {
      pieces.push({ start, end });
      start = end;
      while (start < range.end && /\s/.test(text[start])) start += 1;
    }
  }
  pieces.push({ start, end: range.end });
  return pieces;
}

/** The inline parts that fall inside [start, end) of their plain text, with bold and code marks kept (a mark may be cut in two). */
export function sliceParts(parts: readonly InlinePart[], start: number, end: number): InlinePart[] {
  const out: InlinePart[] = [];
  let at = 0;
  for (const part of parts) {
    const from = Math.max(start, at);
    const to = Math.min(end, at + part.text.length);
    if (to > from) out.push({ ...part, text: part.text.slice(from - at, to - at) });
    at += part.text.length;
  }
  return out;
}

export type SpeechSegment = {
  /** Position in the lesson's spoken order. */
  index: number;
  /** The part of the lesson screen this belongs to (`title`, `summary`, `b3`, `b5-i1`...). */
  unit: string;
  /** Which sentence of the unit's text, from 0; null when the segment is the whole unit (a label, an announcement, a heading). */
  sentence: number | null;
  /** Exactly what is said. */
  text: string;
  /** The silence after it: a short one between sentences, a longer one at the end of a paragraph or list item. */
  pause: 'sentence' | 'paragraph';
  /** The start of a new section of the lesson (a heading): the player's section marks. */
  heading?: boolean;
};

type Draft = Omit<SpeechSegment, 'index'>;

function addText(into: Draft[], unit: string, text: string) {
  const ranges = sentenceRanges(text);
  ranges.forEach((range, sentence) => into.push({ unit, sentence, text: text.slice(range.start, range.end), pause: sentence === ranges.length - 1 ? 'paragraph' : 'sentence' }));
}

function addWhole(into: Draft[], unit: string, text: string, extra: { heading?: boolean; pause?: Draft['pause'] } = {}) {
  into.push({ unit, sentence: null, text, pause: extra.pause ?? 'paragraph', ...(extra.heading ? { heading: true } : {}) });
}

/** The unit ids the screen uses for a lesson block (`b<index in lesson.body>`) and for the pieces inside it. */
export const blockUnit = (bodyIndex: number) => `b${bodyIndex}`;
export const itemUnit = (unit: string, item: number) => `${unit}-i${item}`;
export const detailsSummaryUnit = (unit: string) => `${unit}-s`;
export const detailsBodyUnit = (unit: string, item: number) => `${unit}-d${item}`;
export const versionTextUnit = (unit: string) => `${unit}-t`;
export const objectiveUnit = (item: number) => `obj${item}`;

type SpeechLesson = Pick<Lesson, 'title' | 'summary' | 'intro' | 'body'>;

function addBlock(into: Draft[], block: LessonBlock, unit: string, say: SpeechPhrases) {
  switch (block.type) {
    case 'paragraph':
      addText(into, unit, stripInline(block.text));
      break;
    case 'heading':
      addWhole(into, unit, stripInline(block.text), { heading: true });
      break;
    case 'list':
      block.items.forEach((item, j) => addText(into, itemUnit(unit, j), stripInline(item)));
      break;
    case 'tip':
    case 'warning':
      addWhole(into, unit, block.type === 'tip' ? say.tip : say.warning, { pause: 'sentence' });
      addText(into, unit, stripInline(block.text));
      break;
    case 'prompt':
      addWhole(into, unit, say.prompt);
      break;
    case 'code':
      addWhole(into, unit, say.code(block.language));
      break;
    case 'details':
      addText(into, detailsSummaryUnit(unit), stripInline(block.summary));
      block.body.forEach((paragraph, j) => addText(into, detailsBodyUnit(unit, j), stripInline(paragraph)));
      break;
    case 'takeaways':
      addWhole(into, unit, say.takeaways, { pause: 'sentence' });
      block.items.forEach((item, j) => addText(into, itemUnit(unit, j), stripInline(item)));
      break;
    case 'table':
      addWhole(into, unit, block.caption ? say.tableWithCaption(stripInline(block.caption)) : say.table);
      break;
    case 'diagram':
    case 'visual':
      addWhole(into, unit, block.caption ? say.diagramWithCaption(stripInline(block.caption)) : say.diagram);
      break;
    case 'version':
      addWhole(into, unit, say.version(block.checked), { pause: 'sentence' });
      addText(into, versionTextUnit(unit), stripInline(block.text));
      if (block.plans) addWhole(into, unit, say.plans(stripInline(block.plans)));
      break;
    case 'toolComparison':
      addWhole(into, unit, say.toolComparison);
      break;
    default:
      break;
  }
}

/**
 * The lesson as Listen reads it, one segment per sentence, in the order it is said: the title, the summary, what the learner will be
 * able to do and why it matters, then the teaching and the key takeaways. It says exactly what `lessonScript` says (a test holds that
 * for every lesson). Blocks written for particular levels are not read (the recordings cover the lesson everybody shares), and
 * activities and the quiz are not read. `language` is the lesson's language: the words Listen adds ("Key takeaways.") are said in it.
 */
export function lessonSegments(lesson: SpeechLesson, language: Language = 'en'): SpeechSegment[] {
  const say = speechPhrases(language);
  const drafts: Draft[] = [];
  addWhole(drafts, 'title', lesson.title);
  addText(drafts, 'summary', stripInline(lesson.summary));
  if (lesson.intro) {
    addWhole(drafts, 'objectives-label', say.objectives);
    lesson.intro.objectives.forEach((objective, j) => addText(drafts, objectiveUnit(j), stripInline(objective)));
    addWhole(drafts, 'why-label', say.why, { pause: 'sentence' });
    addText(drafts, 'why', stripInline(lesson.intro.why));
  }
  // The blocks keep their place in `lesson.body` as their unit id, so the screen (which may draw a different selection of them) finds each one.
  const shared = lesson.body.filter((block) => !block.audience);
  const order = splitLesson(shared).learn;
  for (const block of order) addBlock(drafts, block, blockUnit(lesson.body.indexOf(block)), say);
  return drafts.map((draft, index) => ({ index, ...draft }));
}

/** 32-bit FNV-1a of the words, as 8 hex digits: a recording's timing file carries it, and only matches a lesson that says the same words. */
function fnv1a(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

export function hashSegments(segments: readonly SpeechSegment[]): string {
  return fnv1a(`${segments.length}\n${segments.map((segment) => segment.text).join('\n')}`);
}

/** Look-ups from a place on the screen to the segment that says it. */
export type SegmentIndex = {
  segments: readonly SpeechSegment[];
  /** The segment for sentence `sentence` of `unit`, or null. */
  ofSentence: (unit: string, sentence: number) => number | null;
  /** The first segment of a unit, or null when the unit is not spoken. */
  first: (unit: string) => number | null;
  /** The first and last segment of a unit. */
  range: (unit: string) => [number, number] | null;
  /** The segment that speaks the unit as a whole (no sentence number), or null. */
  whole: (unit: string) => number | null;
};

export function segmentIndexOf(segments: readonly SpeechSegment[]): SegmentIndex {
  const sentences = new Map<string, number>();
  const wholes = new Map<string, number>();
  const ranges = new Map<string, [number, number]>();
  for (const segment of segments) {
    if (segment.sentence === null) {
      if (!wholes.has(segment.unit)) wholes.set(segment.unit, segment.index);
    } else sentences.set(`${segment.unit}#${segment.sentence}`, segment.index);
    const range = ranges.get(segment.unit);
    if (range) range[1] = segment.index;
    else ranges.set(segment.unit, [segment.index, segment.index]);
  }
  return {
    segments,
    ofSentence: (unit, sentence) => sentences.get(`${unit}#${sentence}`) ?? null,
    first: (unit) => ranges.get(unit)?.[0] ?? null,
    range: (unit) => ranges.get(unit) ?? null,
    whole: (unit) => wholes.get(unit) ?? null,
  };
}

/** The section marks for the player, from where each heading is really spoken in a recording (instead of a guess from the text's length). */
export function outlineFromTiming(title: string, segments: readonly SpeechSegment[], timing: { duration: number; segments: readonly (readonly [number, number])[] }): OutlineSection[] {
  const sections: OutlineSection[] = [{ title, at: 0 }];
  if (timing.duration <= 0) return sections;
  for (const segment of segments) {
    const start = timing.segments[segment.index]?.[0];
    if (segment.heading && start !== undefined && start > 0) sections.push({ title: segment.text, at: Math.min(1, start / timing.duration) });
  }
  return sections;
}

/** The title of the section a segment is in: the last heading spoken at or before it, else the lesson's own title. */
export function sectionTitleOf(segments: readonly SpeechSegment[], active: number | null, lessonTitle: string): string {
  if (active === null) return lessonTitle;
  for (let i = Math.min(active, segments.length - 1); i >= 0; i--) if (segments[i].heading) return segments[i].text;
  return lessonTitle;
}

export { parseInline };
