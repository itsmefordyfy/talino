import { getTechnology } from '../../content/catalog/technologies';
import type { CourseFacts, CourseType } from '../catalog-facts';
import { CATEGORY_LABELS, GOAL_LABELS, LEVEL_LABELS } from './filters';
import type { Course } from '../../content/types';

/**
 * Catalog search: every word typed must match somewhere (AND), as a whole word, the start of a word, part of a word
 * (3+ letters; shorter words match whole words only) or, when nothing in the whole catalog matches a word of 5+
 * letters, a word one edit away (a typo). Punctuation is ignored and a few spellings are folded together, so
 * "next.js", "nextjs" and "next js" are the same search, "c#" finds C#, "node js" finds Node.js.
 *
 * Each course has one searchable document, built once per course object and cached, so a search only compares the
 * typed words against ready strings.
 *
 * Scoring. A word's score is its best field (weight x match quality) plus a tenth of its other fields, so a word that
 * shows up in the title and the tags edges out one that shows up in the title only. Match quality: whole word 1,
 * word start 0.5, inside a word 0.25, typo 0.3. Weights, highest to lowest, and why:
 *   title 100        what the course is called is the strongest signal
 *   technology 70    the technologies the course's metadata lists, by label and alias ("rn", "js", "gpt"): a course that
 *                    teaches React Native beats one that mentions it in passing
 *   level, type 55   "beginner", "free", "masterclass": a whole word here is what the learner meant ("free" must
 *                    not lose to "Freelancing" in a title)
 *   tag 45           the curated search words
 *   tagline, skill 25
 *   category 20
 *   goal 15
 *   objective 12     what the learner can do afterwards
 *   description 6    prose: it mentions many things in passing
 *   lesson title 4
 * On top of the word scores, a query of several words earns phrase bonuses when the words are consecutive (word starts
 * count) in the title (+80, +30 more at the start), a technology name (+50), a tag (+25), the tagline or a skill (+15),
 * and a title that is exactly the query earns +120. Ties keep catalog order.
 */

export type SearchField = 'title' | 'technology' | 'tag' | 'level' | 'type' | 'tagline' | 'skill' | 'category' | 'goal' | 'objective' | 'description' | 'lesson';

export type SearchResult = {
  facts: CourseFacts;
  score: number;
  /** The fields that matched, strongest first (title, technology, tag...), so a card can say why it showed up. */
  matched: SearchField[];
};

export const FIELD_WEIGHTS: Readonly<Record<SearchField, number>> = {
  title: 100,
  technology: 70,
  tag: 45,
  level: 55,
  type: 55,
  tagline: 25,
  skill: 25,
  category: 20,
  goal: 15,
  objective: 12,
  description: 6,
  lesson: 4,
};

const FIELD_KEYS = Object.keys(FIELD_WEIGHTS) as SearchField[];

const QUALITY = { word: 1, start: 0.5, inside: 0.25, typo: 0.3 } as const;
/** Share of a word's other matching fields that is added to its best one. */
const REINFORCE = 0.1;
const PHRASE = { title: 80, titleStart: 30, titleExact: 120, technology: 50, tag: 25, tagline: 15, skill: 15 } as const;
/** Shortest word that may match inside a word, and shortest that may be a typo. */
const MIN_PARTIAL = 3;
const MIN_TYPO = 5;

/** Words that carry no meaning in "how to build a website", dropped from a search unless nothing else is left. */
const STOP_WORDS = new Set(['a', 'an', 'the', 'to', 'of', 'for', 'and', 'in', 'on', 'with', 'my', 'how', 'do', 'is', 'i', 'course', 'class']);

// ---------------------------------------------------------------------------------------------- text

const JS_FRAMEWORKS = 'next|node|react|express|vue|nuxt|nest|three|d3|ember|backbone';
const JS_SPELLINGS = new RegExp(`\\b(${JS_FRAMEWORKS})[.\\s-]?js\\b`, 'g');

/** "Next.js" -> "nextjs", "C#" -> "csharp", ".NET" -> "dotnet"; everything else lower case words split on punctuation. */
function normalise(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/c\+\+/g, 'cpp')
    .replace(/(^|[^a-z0-9])c#/g, '$1csharp')
    .replace(/\bc sharp\b/g, 'csharp')
    .replace(/\basp\.net\b/g, 'aspnet')
    .replace(/(^|[^a-z0-9])\.net\b/g, '$1dotnet')
    .replace(JS_SPELLINGS, '$1js')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Plural "s" dropped on both sides ("hooks" = "hook"); words that end in ss or us and short words stay. */
function stem(token: string): string {
  return token.length > 3 && token.endsWith('s') && !token.endsWith('ss') && !token.endsWith('us') ? token.slice(0, -1) : token;
}

function tokenise(text: string): string[] {
  const normalised = normalise(text);
  return normalised === '' ? [] : normalised.split(' ').map(stem);
}

/** The words of a query, in order, duplicates removed, stop words dropped (unless they are all there is). */
function queryWords(text: string): string[] {
  const all = [...new Set(tokenise(text))];
  const meaningful = all.filter((word) => !STOP_WORDS.has(word));
  return meaningful.length > 0 ? meaningful : all;
}

// ---------------------------------------------------------------------------------------------- documents

type FieldIndex = {
  /** " unique words separated by spaces ", so " word " finds a whole word and " wo" a word start. */
  text: string;
  tokens: string[];
};

type PhraseField = 'title' | 'technology' | 'tag' | 'tagline' | 'skill';

type SearchDoc = {
  signature: string;
  fields: Record<SearchField, FieldIndex>;
  /** Every field's words together, to reject a course for a word in one check. */
  all: FieldIndex;
  /** Ordered words for phrase checks: one entry per title, technology name, tag, tagline and skill. */
  phrases: Record<PhraseField, string[][]>;
};

function indexOfTexts(texts: readonly string[]): FieldIndex {
  const set = new Set<string>();
  for (const text of texts) for (const token of tokenise(text)) set.add(token);
  const tokens = [...set];
  return { text: tokens.length > 0 ? ` ${tokens.join(' ')} ` : ' ', tokens };
}

const LEVEL_WORDS: Record<string, string> = LEVEL_LABELS;

const TYPE_WORDS: Record<CourseType, string> = {
  free: 'free',
  career: 'career course',
  'learning-path': 'learning path',
  masterclass: 'masterclass',
  course: 'course',
  mini: 'mini course short',
};

function technologyNames(id: string): string[] {
  const technology = getTechnology(id);
  return technology ? [technology.label, ...technology.aliases, id] : [id];
}

function signatureOf(facts: CourseFacts): string {
  return [facts.category, facts.learningLevel, facts.types.join(), facts.technologies.join(), facts.tags.join(), facts.goals.join(), facts.objectives.length].join('|');
}

function buildDoc(facts: CourseFacts): SearchDoc {
  const { course } = facts;
  const technologyTexts = facts.technologies.flatMap(technologyNames);
  const skillTexts = (course.skills ?? []).map((skill) => skill.label);
  const fields: Record<SearchField, FieldIndex> = {
    title: indexOfTexts([course.title]),
    technology: indexOfTexts(technologyTexts),
    tag: indexOfTexts(facts.tags),
    level: indexOfTexts([LEVEL_WORDS[facts.learningLevel] ?? facts.learningLevel, 'level']),
    type: indexOfTexts(facts.types.map((type) => TYPE_WORDS[type])),
    tagline: indexOfTexts([course.tagline ?? '']),
    skill: indexOfTexts(skillTexts),
    category: indexOfTexts([CATEGORY_LABELS[facts.category] ?? '']),
    goal: indexOfTexts(facts.goals.map((goal) => GOAL_LABELS[goal] ?? '')),
    objective: indexOfTexts(facts.objectives),
    description: indexOfTexts([course.description ?? '']),
    lesson: indexOfTexts((course.lessons ?? []).map((lesson) => lesson.title)),
  };
  const everything = new Set<string>();
  for (const key of FIELD_KEYS) for (const token of fields[key].tokens) everything.add(token);
  const tokens = [...everything];
  const ordered = (texts: readonly string[]) => texts.map(tokenise).filter((words) => words.length > 0);
  return {
    signature: signatureOf(facts),
    fields,
    all: { text: tokens.length > 0 ? ` ${tokens.join(' ')} ` : ' ', tokens },
    phrases: {
      title: ordered([course.title]),
      technology: ordered(technologyTexts),
      tag: ordered(facts.tags),
      tagline: ordered([course.tagline ?? '']),
      skill: ordered(skillTexts),
    },
  };
}

const DOCS = new WeakMap<Course, SearchDoc>();

function docOf(facts: CourseFacts): SearchDoc {
  const cached = DOCS.get(facts.course);
  // The signature guards a course object that is paired with different metadata (tests do that); it is a cheap string.
  const signature = cached ? signatureOf(facts) : '';
  if (cached && cached.signature === signature) return cached;
  const doc = buildDoc(facts);
  DOCS.set(facts.course, doc);
  return doc;
}

// ---------------------------------------------------------------------------------------------- matching

/** 1 whole word, 0.85 word start, 0.5 inside a word, 0 none. Words shorter than 3 letters only match whole words. */
function plainQuality(index: FieldIndex, word: string): number {
  const text = index.text;
  if (word.length < MIN_PARTIAL) return text.includes(` ${word} `) ? QUALITY.word : 0;
  if (!text.includes(word)) return 0;
  if (text.includes(` ${word} `)) return QUALITY.word;
  if (text.includes(` ${word}`)) return QUALITY.start;
  return QUALITY.inside;
}

/** Whether two words are one insertion, deletion or substitution apart (or equal). */
function withinOneEdit(a: string, b: string): boolean {
  const diff = a.length - b.length;
  if (diff > 1 || diff < -1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  if (i === a.length && i === b.length) return true;
  if (diff === 0) return a.slice(i + 1) === b.slice(i + 1);
  return diff > 0 ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
}

function typoQuality(index: FieldIndex, word: string): number {
  for (const token of index.tokens) if (withinOneEdit(token, word)) return QUALITY.typo;
  return 0;
}

function hasWord(doc: SearchDoc, word: string, typo: boolean): boolean {
  return typo ? typoQuality(doc.all, word) > 0 : plainQuality(doc.all, word) > 0;
}

/** Whether `words` appear one after another in `tokens`, each as a word start (whole word when it is shorter than 3). */
function inSequence(tokens: readonly string[], words: readonly string[], at?: 'start'): boolean {
  const last = tokens.length - words.length;
  for (let start = 0; start <= last; start += 1) {
    if (at === 'start' && start > 0) return false;
    let ok = true;
    for (let k = 0; k < words.length; k += 1) {
      const token = tokens[start + k];
      if (words[k].length < MIN_PARTIAL ? token !== words[k] : !token.startsWith(words[k])) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }
  return false;
}

function phraseBonus(doc: SearchDoc, words: readonly string[]): number {
  let bonus = 0;
  const { phrases } = doc;
  const title = phrases.title[0];
  if (title && title.length === words.length && words.every((word, index) => title[index] === word)) bonus += PHRASE.titleExact;
  // One word has no phrase: its word-start match already scored, and "free" must not count as the start of "Freelancing".
  if (words.length < 2) return bonus;
  if (title) {
    if (inSequence(title, words)) {
      bonus += PHRASE.title;
      if (inSequence(title, words, 'start')) bonus += PHRASE.titleStart;
    }
  }
  if (phrases.technology.some((name) => inSequence(name, words))) bonus += PHRASE.technology;
  if (phrases.tag.some((tag) => inSequence(tag, words))) bonus += PHRASE.tag;
  if (phrases.tagline.some((line) => inSequence(line, words))) bonus += PHRASE.tagline;
  if (phrases.skill.some((skill) => inSequence(skill, words))) bonus += PHRASE.skill;
  return bonus;
}

type Prepared = { words: string[]; typo: boolean[] } | 'none';

/** The words of a query and which of them need typo matching (no course has them as typed); 'none' when a word matches nothing. */
function prepare(docs: readonly SearchDoc[], text: string): Prepared | null {
  const words = queryWords(text);
  if (words.length === 0) return null;
  const typo: boolean[] = [];
  for (const word of words) {
    if (docs.some((doc) => hasWord(doc, word, false))) {
      typo.push(false);
    } else if (word.length >= MIN_TYPO && docs.some((doc) => hasWord(doc, word, true))) {
      typo.push(true);
    } else {
      return 'none';
    }
  }
  return { words, typo };
}

function scoreDoc(doc: SearchDoc, words: readonly string[], typo: readonly boolean[]): { score: number; matched: SearchField[] } {
  let score = 0;
  const byField = new Map<SearchField, number>();
  for (let w = 0; w < words.length; w += 1) {
    let best = 0;
    let rest = 0;
    for (const key of FIELD_KEYS) {
      const index = doc.fields[key];
      const quality = typo[w] ? typoQuality(index, words[w]) : plainQuality(index, words[w]);
      if (quality === 0) continue;
      const value = FIELD_WEIGHTS[key] * quality;
      byField.set(key, (byField.get(key) ?? 0) + value);
      if (value > best) {
        rest += best;
        best = value;
      } else {
        rest += value;
      }
    }
    score += best + REINFORCE * rest;
  }
  score += phraseBonus(doc, words);
  const matched = [...byField.entries()].sort((a, b) => b[1] - a[1]).map(([key]) => key);
  return { score, matched };
}

// ---------------------------------------------------------------------------------------------- public

/** The courses that match every word of the text, in catalog order, without scoring them (used for facet counts). */
export function matchCatalog(facts: readonly CourseFacts[], text: string): CourseFacts[] {
  const docs = facts.map(docOf);
  const prepared = prepare(docs, text);
  if (prepared === null) return [...facts];
  if (prepared === 'none') return [];
  const { words, typo } = prepared;
  return facts.filter((_, index) => words.every((word, w) => hasWord(docs[index], word, typo[w])));
}

/**
 * The courses that match the text, best first. Blank text (or only punctuation) returns every course, unscored, in the
 * order given. Ties keep the order given, so pass the catalog in catalog order.
 */
export function searchCatalog(facts: readonly CourseFacts[], text: string): SearchResult[] {
  const docs = facts.map(docOf);
  const prepared = prepare(docs, text);
  if (prepared === null) return facts.map((fact) => ({ facts: fact, score: 0, matched: [] }));
  if (prepared === 'none') return [];
  const { words, typo } = prepared;
  const found: { result: SearchResult; index: number }[] = [];
  for (let index = 0; index < facts.length; index += 1) {
    const doc = docs[index];
    if (!words.every((word, w) => hasWord(doc, word, typo[w]))) continue;
    const { score, matched } = scoreDoc(doc, words, typo);
    found.push({ result: { facts: facts[index], score, matched }, index });
  }
  found.sort((a, b) => b.result.score - a.result.score || a.index - b.index);
  return found.map((entry) => entry.result);
}
