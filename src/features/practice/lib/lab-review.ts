import type { LabTask } from '../types';
import { leaksPrivate } from './guard';
import { readKeyChecks, type KeyCheck } from './lab-check';
import { cleanText } from './sanitize';
import { averageScore, quoteAppears, ratingFor, type Rating } from './scoring';

/**
 * The prompt coach's review of a lab: the model's JSON (Gemini's response schema), treated as untrusted and checked. Scores exist only for the
 * criteria the lab names, the overall is their average, every score of 40 or more must quote the learner's own prompt (a quote nobody wrote
 * refuses the review), and the claims the output checks point at must be words the output really contains. The key check is not the model's: it is
 * computed by code and attached by the route.
 */

export const LAB_REVIEW_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    criteria: {
      type: 'ARRAY',
      items: { type: 'OBJECT', properties: { id: { type: 'STRING' }, score: { type: 'INTEGER' }, quote: { type: 'STRING' }, reason: { type: 'STRING' } }, required: ['id', 'score', 'quote', 'reason'] },
    },
    suggestions: { type: 'ARRAY', items: { type: 'STRING' } },
    outputChecks: {
      type: 'ARRAY',
      items: { type: 'OBJECT', properties: { output: { type: 'STRING' }, claim: { type: 'STRING' }, status: { type: 'STRING' }, note: { type: 'STRING' } }, required: ['output', 'claim', 'status', 'note'] },
    },
    comparison: { type: 'STRING' },
    nextStep: { type: 'STRING' },
  },
  required: ['summary', 'criteria', 'suggestions', 'outputChecks', 'comparison', 'nextStep'],
} as const;

export const CLAIM_STATUSES = ['supported', 'not-in-material', 'unclear'] as const;
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

export type LabCriterionScore = { id: string; label: string; score: number; /** The learner's own words that earned it; empty when the prompt did not do it. */ quote: string; reason: string };

/** One important claim of a model output, read against the lab's material by an AI: always shown as AI-assessed, to be verified. */
export type ClaimCheck = { output: 'A' | 'B'; claim: string; status: ClaimStatus; note: string };

export type LabReview = {
  kind: 'prompt-lab';
  /** Always false: a prompt too thin to run never reaches a review. Kept so every result has the same base shape. */
  tooShort: false;
  overall: number;
  rating: Rating;
  summary: string;
  criteria: LabCriterionScore[];
  suggestions: string[];
  outputChecks: ClaimCheck[];
  /** The lab's key against each output, by code, revealed with the review; empty for a lab with no key. */
  keyChecks: KeyCheck[];
  /** Outputs A and B against the checklist, for a comparison lab; empty otherwise. */
  comparison: string;
  nextStep: string;
};

const MAX_SUMMARY_CHARS = 700;
const MAX_QUOTE_CHARS = 300;
const MAX_REASON_CHARS = 400;
const MAX_SUGGESTIONS = 4;
const MAX_SUGGESTION_CHARS = 300;
const MAX_CLAIMS = 6;
const MAX_CLAIM_CHARS = 200;
const MAX_NOTE_CHARS = 300;
const MAX_COMPARISON_CHARS = 700;
/** A score at or above this is credit, and credit needs evidence in the learner's own words. */
export const QUOTE_REQUIRED_FROM = 40;

export type ParseLabReviewOptions = {
  lab: LabTask;
  /** What the learner wrote: the only text a quote may come from (A and B for a comparison of prompts). */
  prompts: readonly string[];
  /** What the model said on the run being reviewed: the only text a claim may point at. */
  outputs: readonly string[];
  /** Computed by code from the outputs; attached as it is. */
  keyChecks: KeyCheck[];
};

function objectOf(text: string): Record<string, unknown> | null {
  try {
    const raw: unknown = JSON.parse(text);
    return typeof raw === 'object' && raw !== null && !Array.isArray(raw) ? (raw as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** The criteria the model scored, held to the lab's own list: all of them, once each, in the lab's order; null when any is missing or has credit without a real quote. */
function criteriaOf(value: unknown, lab: LabTask, prompts: readonly string[]): LabCriterionScore[] | null {
  if (!Array.isArray(value)) return null;
  const found = new Map<string, LabCriterionScore>();
  for (const item of value) {
    if (typeof item !== 'object' || item === null) continue;
    const entry = item as Record<string, unknown>;
    const named = lab.criteria.find((criterion) => criterion.id === entry.id);
    if (!named || found.has(named.id)) continue;
    const score = typeof entry.score === 'number' && Number.isFinite(entry.score) ? Math.max(0, Math.min(100, Math.round(entry.score))) : null;
    const reason = cleanText(entry.reason, MAX_REASON_CHARS);
    const quote = cleanText(entry.quote, MAX_QUOTE_CHARS);
    if (score === null || !reason) continue;
    if (quote && !quoteAppears(quote, prompts)) return null;
    if (!quote && score >= QUOTE_REQUIRED_FROM) return null;
    found.set(named.id, { id: named.id, label: named.label, score, quote, reason });
  }
  const ordered = lab.criteria.map((criterion) => found.get(criterion.id));
  return ordered.every((criterion): criterion is LabCriterionScore => criterion !== undefined) ? ordered : null;
}

function claimsOf(value: unknown, lab: LabTask, outputs: readonly string[]): ClaimCheck[] {
  // A lab with no material or facts has nothing to check a claim against, so whatever the model sent is ignored.
  if (!Array.isArray(value) || !(lab.material || (lab.facts && lab.facts.length > 0))) return [];
  const claims: ClaimCheck[] = [];
  for (const item of value) {
    if (claims.length >= MAX_CLAIMS) break;
    if (typeof item !== 'object' || item === null) continue;
    const entry = item as Record<string, unknown>;
    const label = entry.output === 'A' || entry.output === 'B' ? entry.output : null;
    const claim = cleanText(entry.claim, MAX_CLAIM_CHARS);
    const note = cleanText(entry.note, MAX_NOTE_CHARS);
    const status = CLAIM_STATUSES.find((candidate) => candidate === entry.status);
    // A claim that is not in the output it names cannot be checked: drop it rather than show a check of words nobody said.
    const source = label === 'B' ? outputs[1] : outputs[0];
    if (!label || !claim || !note || !status || source === undefined || !quoteAppears(claim, [source])) continue;
    claims.push({ output: label, claim, status, note });
  }
  return claims;
}

/** The model's JSON checked for shape and honesty; null when it isn't a usable review (the route gives the allowance back). */
export function parseLabReview(text: string, { lab, prompts, outputs, keyChecks }: ParseLabReviewOptions): LabReview | null {
  const value = objectOf(text);
  if (!value) return null;
  const summary = cleanText(value.summary, MAX_SUMMARY_CHARS);
  const nextStep = cleanText(value.nextStep, MAX_SUGGESTION_CHARS);
  const comparison = cleanText(value.comparison, MAX_COMPARISON_CHARS);
  if (!summary || !nextStep) return null;
  // A comparison lab owes the learner a comparison; any other lab has none, whatever the model said.
  if (lab.compare && !comparison) return null;

  const criteria = criteriaOf(value.criteria, lab, prompts);
  if (!criteria) return null;
  const seen = new Set<string>();
  const suggestions = (Array.isArray(value.suggestions) ? value.suggestions : [])
    .map((item) => cleanText(item, MAX_SUGGESTION_CHARS))
    .filter((item) => {
      const key = item.toLowerCase();
      if (!item || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_SUGGESTIONS);
  // Everyone has something to work on; a review with nothing to try is flattery, not feedback.
  if (suggestions.length === 0) return null;

  const outputChecks = claimsOf(value.outputChecks, lab, outputs);
  // A claim's own words come from the output, so they are exempt; everything the coach says in its own voice must not repeat the model's side of the lab.
  const spoken = [summary, nextStep, comparison, ...suggestions, ...criteria.map((criterion) => criterion.reason), ...outputChecks.map((check) => check.note)];
  if (spoken.some((line) => leaksPrivate(line, lab))) return null;

  const overall = averageScore(criteria);
  return { kind: 'prompt-lab', tooShort: false, overall, rating: ratingFor(overall), summary, criteria, suggestions, outputChecks, keyChecks, comparison: lab.compare ? comparison : '', nextStep };
}

/** The stored review text read back; null when it is damaged. */
export function readStoredLabReview(text: string | null | undefined): LabReview | null {
  if (!text) return null;
  let value: Record<string, unknown>;
  try {
    const raw: unknown = JSON.parse(text);
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
    value = raw as Record<string, unknown>;
  } catch {
    return null;
  }
  if (value.kind !== 'prompt-lab' || typeof value.summary !== 'string' || typeof value.overall !== 'number' || !Array.isArray(value.criteria) || !Array.isArray(value.suggestions)) return null;
  const criteria: LabCriterionScore[] = [];
  for (const item of value.criteria) {
    if (typeof item !== 'object' || item === null) return null;
    const entry = item as Record<string, unknown>;
    if (typeof entry.id !== 'string' || typeof entry.label !== 'string' || typeof entry.score !== 'number' || typeof entry.reason !== 'string') return null;
    criteria.push({ id: entry.id, label: entry.label, score: entry.score, quote: typeof entry.quote === 'string' ? entry.quote : '', reason: entry.reason });
  }
  const outputChecks: ClaimCheck[] = [];
  for (const item of Array.isArray(value.outputChecks) ? value.outputChecks : []) {
    if (typeof item !== 'object' || item === null) continue;
    const entry = item as Record<string, unknown>;
    const status = CLAIM_STATUSES.find((candidate) => candidate === entry.status);
    if ((entry.output !== 'A' && entry.output !== 'B') || typeof entry.claim !== 'string' || typeof entry.note !== 'string' || !status) continue;
    outputChecks.push({ output: entry.output, claim: entry.claim, status, note: entry.note });
  }
  return {
    kind: 'prompt-lab',
    tooShort: false,
    overall: value.overall,
    rating: ratingFor(value.overall),
    summary: value.summary,
    criteria,
    suggestions: value.suggestions.filter((item): item is string => typeof item === 'string'),
    outputChecks,
    keyChecks: readKeyChecks(value.keyChecks),
    comparison: typeof value.comparison === 'string' ? value.comparison : '',
    nextStep: typeof value.nextStep === 'string' ? value.nextStep : '',
  };
}
