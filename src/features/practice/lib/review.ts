import type { MessageTask } from '../types';
import type { LabReview } from './lab-review';
import { leaksPrivate } from './guard';
import type { PracticeReport } from './report';
import { cleanText } from './sanitize';
import { averageScore, parseCriteria, ratingFor, type CriterionScore, type Rating } from './scoring';

/**
 * The message coach's review: the model's JSON (Gemini's response schema), checked. Scores exist only for the criteria the task names,
 * the overall is their average, what is missing and what changed are plain lists, and the improved version sits beside the learner's
 * own text as a model of how to improve (the learner is asked to rewrite it in their own words; only their own text is ever stored as
 * their work). A message too thin to judge says so instead of being scored.
 */

export const REVIEW_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    criteria: {
      type: 'ARRAY',
      items: { type: 'OBJECT', properties: { id: { type: 'STRING' }, score: { type: 'INTEGER' }, reason: { type: 'STRING' } }, required: ['id', 'score', 'reason'] },
    },
    missing: { type: 'ARRAY', items: { type: 'STRING' } },
    improved: { type: 'STRING' },
    changes: {
      type: 'ARRAY',
      items: { type: 'OBJECT', properties: { what: { type: 'STRING' }, why: { type: 'STRING' } }, required: ['what', 'why'] },
    },
    nextStep: { type: 'STRING' },
    tooShort: { type: 'BOOLEAN' },
  },
  required: ['summary', 'criteria', 'missing', 'improved', 'changes', 'nextStep', 'tooShort'],
} as const;

export type ReviewChange = { what: string; why: string };

export type ReviewResult = {
  kind: 'message-review';
  tooShort: boolean;
  overall: number | null;
  rating: Rating | null;
  summary: string;
  criteria: CriterionScore[];
  /** What a complete answer holds that the learner's message does not, described as gaps (never as wording to copy). */
  missing: string[];
  /** A stronger version, shown beside the original. Empty when too short to judge. */
  improved: string;
  changes: ReviewChange[];
  nextStep: string;
};

const MAX_SUMMARY_CHARS = 700;
const MAX_MISSING = 6;
const MAX_MISSING_CHARS = 200;
const MAX_CHANGES = 6;
const MAX_CHANGE_CHARS = 300;
/** A message is typed in a box this size; an improved version past it is not a message. */
export const MAX_IMPROVED_CHARS = 3000;

export const tooShortReview = (summary: string): ReviewResult => ({ kind: 'message-review', tooShort: true, overall: null, rating: null, summary, criteria: [], missing: [], improved: '', changes: [], nextStep: '' });

export type ParseReviewOptions = {
  task: MessageTask;
  /** The learner's own message, as reviewed. */
  learnerText: string;
};

function changesOf(value: unknown): ReviewChange[] | null {
  if (!Array.isArray(value)) return null;
  const list: ReviewChange[] = [];
  for (const item of value.slice(0, MAX_CHANGES)) {
    if (typeof item !== 'object' || item === null) return null;
    const entry = item as Record<string, unknown>;
    const what = cleanText(entry.what, MAX_CHANGE_CHARS);
    const why = cleanText(entry.why, MAX_CHANGE_CHARS);
    if (!what || !why) return null;
    list.push({ what, why });
  }
  return list;
}

const sameWords = (a: string, b: string) => a.toLowerCase().replace(/\s+/g, ' ').trim() === b.toLowerCase().replace(/\s+/g, ' ').trim();

/** The model's JSON checked for shape and honesty; null when it isn't a usable review (the route gives the allowance back). */
export function parseReview(text: string, { task, learnerText }: ParseReviewOptions): ReviewResult | null {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const value = raw as Record<string, unknown>;
  const summary = cleanText(value.summary, MAX_SUMMARY_CHARS);
  if (!summary || leaksPrivate(summary, task)) return null;
  if (value.tooShort === true) return tooShortReview(summary);

  const criteria = parseCriteria(value.criteria, task.criteria);
  const changes = changesOf(value.changes);
  const nextStep = cleanText(value.nextStep, MAX_CHANGE_CHARS);
  const rawImproved = typeof value.improved === 'string' ? value.improved.trim() : '';
  if (!criteria || !changes || !nextStep || !rawImproved || rawImproved.length > MAX_IMPROVED_CHARS) return null;
  const improved = cleanText(rawImproved, MAX_IMPROVED_CHARS);
  // A rewritten message must say what changed; only a message handed back unchanged may have nothing to explain.
  if (changes.length === 0 && !sameWords(improved, learnerText)) return null;

  const seen = new Set<string>();
  const missing = (Array.isArray(value.missing) ? value.missing : [])
    .map((item) => cleanText(item, MAX_MISSING_CHARS))
    .filter((item) => {
      const key = item.toLowerCase();
      if (!item || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_MISSING);

  // `missing` is the learner-facing statement of what their message lacks, so it is deliberately not held to this rule.
  const spoken = [improved, nextStep, ...criteria.map((criterion) => criterion.reason), ...changes.flatMap((change) => [change.what, change.why])];
  if (spoken.some((line) => leaksPrivate(line, task))) return null;

  const overall = averageScore(criteria);
  return { kind: 'message-review', tooShort: false, overall, rating: ratingFor(overall), summary, criteria, missing, improved, changes, nextStep };
}

/** The stored review text read back; null when it is damaged. */
export function readStoredReview(text: string | null | undefined): ReviewResult | null {
  if (!text) return null;
  try {
    const value = JSON.parse(text) as Partial<ReviewResult>;
    if (value.kind !== 'message-review' || typeof value.tooShort !== 'boolean' || typeof value.summary !== 'string' || !Array.isArray(value.criteria) || !Array.isArray(value.missing) || !Array.isArray(value.changes)) return null;
    const overall = typeof value.overall === 'number' ? value.overall : null;
    return {
      kind: 'message-review',
      tooShort: value.tooShort,
      overall,
      rating: overall === null ? null : ratingFor(overall),
      summary: value.summary,
      criteria: value.criteria,
      missing: value.missing,
      improved: typeof value.improved === 'string' ? value.improved : '',
      changes: value.changes,
      nextStep: typeof value.nextStep === 'string' ? value.nextStep : '',
    };
  } catch {
    return null;
  }
}

/** Either kind of result, as the repo stores it. */
export type PracticeResult = PracticeReport | ReviewResult | LabReview;
