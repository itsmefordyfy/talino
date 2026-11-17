import type { RoleplayScenario } from '../types';
import { leaksPrivate } from './guard';
import { cleanText } from './sanitize';
import { averageScore, parseCriteria, quoteAppears, ratingFor, type CriterionScore, type Rating } from './scoring';

/**
 * The debrief after a role-play: the model's JSON (Gemini's response schema), checked, and the rules that keep it honest. Scores exist
 * only for the criteria the scenario names, the overall is their average, every strength and growth area quotes the learner's own
 * words (a debrief whose quotes were never said is refused), and a conversation too thin to judge says so instead of scoring it.
 */

export const REPORT_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    criteria: {
      type: 'ARRAY',
      items: { type: 'OBJECT', properties: { id: { type: 'STRING' }, score: { type: 'INTEGER' }, reason: { type: 'STRING' } }, required: ['id', 'score', 'reason'] },
    },
    strengths: {
      type: 'ARRAY',
      items: { type: 'OBJECT', properties: { quote: { type: 'STRING' }, point: { type: 'STRING' } }, required: ['quote', 'point'] },
    },
    growth: {
      type: 'ARRAY',
      items: { type: 'OBJECT', properties: { quote: { type: 'STRING' }, point: { type: 'STRING' } }, required: ['quote', 'point'] },
    },
    nextStep: { type: 'STRING' },
    tooShort: { type: 'BOOLEAN' },
  },
  required: ['summary', 'criteria', 'strengths', 'growth', 'nextStep', 'tooShort'],
} as const;

/** A moment from the conversation: the learner's own words, and what the coach makes of them. */
export type Evidence = { quote: string; point: string };

export type PracticeReport = {
  kind: 'roleplay';
  /** Too little was said to judge: there are no scores. */
  tooShort: boolean;
  /** 0 to 100, the average of the criteria; null when `tooShort`. */
  overall: number | null;
  rating: Rating | null;
  summary: string;
  criteria: CriterionScore[];
  strengths: Evidence[];
  growth: Evidence[];
  /** One specific thing to try next time. */
  nextStep: string;
};

const MAX_SUMMARY_CHARS = 700;
const MAX_QUOTE_CHARS = 300;
const MAX_POINT_CHARS = 400;
const MAX_EVIDENCE = 3;

export type ParseReportOptions = {
  scenario: RoleplayScenario;
  /** What the learner said, one entry per turn: the only text a quote may come from. */
  learnerLines: readonly string[];
};

/** A debrief with nothing judged, for a conversation too short to score (built on the server without asking the model). */
export const tooShortReport = (summary: string): PracticeReport => ({ kind: 'roleplay', tooShort: true, overall: null, rating: null, summary, criteria: [], strengths: [], growth: [], nextStep: '' });

/** Null means an entry is unusable and the whole debrief must be refused: a quote nobody said, or a missing quote or point. */
function evidenceOf(value: unknown, learnerLines: readonly string[]): Evidence[] | null {
  if (!Array.isArray(value)) return null;
  const list: Evidence[] = [];
  for (const item of value.slice(0, MAX_EVIDENCE)) {
    if (typeof item !== 'object' || item === null) return null;
    const entry = item as Record<string, unknown>;
    const quote = cleanText(entry.quote, MAX_QUOTE_CHARS);
    const point = cleanText(entry.point, MAX_POINT_CHARS);
    if (!quote || !point || !quoteAppears(quote, learnerLines)) return null;
    list.push({ quote, point });
  }
  return list;
}

/** The model's JSON checked for shape and honesty; null when it isn't a usable debrief (the route gives the allowance back). */
export function parseReport(text: string, { scenario, learnerLines }: ParseReportOptions): PracticeReport | null {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const value = raw as Record<string, unknown>;
  const summary = cleanText(value.summary, MAX_SUMMARY_CHARS);
  if (!summary || leaksPrivate(summary, scenario)) return null;
  if (value.tooShort === true) return tooShortReport(summary);

  const criteria = parseCriteria(value.criteria, scenario.criteria);
  const strengths = evidenceOf(value.strengths, learnerLines);
  const growth = evidenceOf(value.growth, learnerLines);
  const nextStep = cleanText(value.nextStep, MAX_POINT_CHARS);
  // Everyone has something to work on; a debrief with no growth area and no next step is flattery, not feedback.
  if (!criteria || !strengths || !growth || growth.length === 0 || !nextStep) return null;

  const spoken = [...criteria.map((criterion) => criterion.reason), ...strengths.map((entry) => entry.point), ...growth.map((entry) => entry.point), nextStep];
  if (spoken.some((line) => leaksPrivate(line, scenario))) return null;

  const overall = averageScore(criteria);
  return { kind: 'roleplay', tooShort: false, overall, rating: ratingFor(overall), summary, criteria, strengths, growth, nextStep };
}

/** The stored report text read back; null when it is damaged (the screen then offers to get feedback again). */
export function readStoredReport(text: string | null | undefined): PracticeReport | null {
  if (!text) return null;
  try {
    const value = JSON.parse(text) as Partial<PracticeReport>;
    if (value.kind !== 'roleplay' || typeof value.tooShort !== 'boolean' || typeof value.summary !== 'string' || !Array.isArray(value.criteria) || !Array.isArray(value.strengths) || !Array.isArray(value.growth)) return null;
    const overall = typeof value.overall === 'number' ? value.overall : null;
    return {
      kind: 'roleplay',
      tooShort: value.tooShort,
      overall,
      rating: overall === null ? null : ratingFor(overall),
      summary: value.summary,
      criteria: value.criteria,
      strengths: value.strengths,
      growth: value.growth,
      nextStep: typeof value.nextStep === 'string' ? value.nextStep : '',
    };
  } catch {
    return null;
  }
}
