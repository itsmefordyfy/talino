import { softmax, toPercents } from './llm-math';

/**
 * The self-attention illustration. The scores below are hand-written numbers that say how relevant one word is to another for each "head"; the
 * softmax that turns them into weights, and the percentages, are real arithmetic. No real model produced these numbers, and a real model's patterns
 * are less tidy. The words themselves live in the strings file; this file only knows how many each sentence has.
 */

export const ATTENTION_SENTENCE_IDS = ['trophy', 'animal', 'bank'] as const;
export type AttentionSentenceId = (typeof ATTENTION_SENTENCE_IDS)[number];

export const ATTENTION_HEAD_IDS = ['links', 'nearby'] as const;
export type AttentionHeadId = (typeof ATTENTION_HEAD_IDS)[number];

export const ATTENTION_STEP_IDS = ['scores', 'weights', 'blend'] as const;
export type AttentionStepId = (typeof ATTENTION_STEP_IDS)[number];

/** query word index -> other word index -> score. A word that is not listed for a query scores 0 (nothing special); every word of every example has an entry. */
type Links = Record<number, Record<number, number>>;

type SentenceData = { length: number; /** The word that makes the best first example: "it" or "bank". */ defaultQuery: number; links: Links };

const SENTENCES: Record<AttentionSentenceId, SentenceData> = {
  // The(0) trophy(1) did(2) not(3) fit(4) in(5) the(6) suitcase(7) because(8) it(9) was(10) too(11) big(12)
  trophy: {
    length: 13,
    defaultQuery: 9,
    links: {
      0: { 1: 3 },
      1: { 0: 2, 4: 2.5, 12: 1.5 },
      2: { 1: 1, 3: 2.5, 4: 2.5 },
      3: { 2: 1.5, 4: 3 },
      4: { 1: 3, 3: 1.5, 5: 1, 7: 2.8 },
      5: { 4: 1.5, 7: 3 },
      6: { 5: 1, 7: 3 },
      7: { 4: 1.5, 5: 2.5, 6: 2 },
      8: { 4: 2, 9: 1.5, 12: 1.5 },
      9: { 1: 4.2, 7: 1.8, 8: 0.6, 11: 0.8, 12: 1.6 },
      10: { 9: 3, 12: 2 },
      11: { 12: 3.5 },
      12: { 1: 2.5, 9: 2.5, 11: 1.5 },
    },
  },
  // The(0) animal(1) did(2) not(3) cross(4) the(5) street(6) because(7) it(8) was(9) too(10) tired(11)
  animal: {
    length: 12,
    defaultQuery: 8,
    links: {
      0: { 1: 3 },
      1: { 0: 2, 4: 2.5, 11: 1.8 },
      2: { 1: 1, 3: 2.5, 4: 2.5 },
      3: { 2: 1.5, 4: 3 },
      4: { 1: 3, 3: 1.5, 5: 1, 6: 2.8 },
      5: { 6: 3 },
      6: { 4: 2.5, 5: 2 },
      7: { 4: 2, 8: 1.5, 11: 1.5 },
      8: { 1: 4.2, 6: 1.8, 7: 0.6, 10: 0.8, 11: 1.6 },
      9: { 8: 3, 11: 2 },
      10: { 11: 3.5 },
      11: { 1: 2.5, 8: 2.5, 10: 1.5 },
    },
  },
  // She(0) sat(1) on(2) the(3) bank(4) of(5) the(6) river(7) and(8) watched(9) the(10) water(11)
  bank: {
    length: 12,
    defaultQuery: 4,
    links: {
      0: { 1: 3, 9: 1.5 },
      1: { 0: 3, 2: 1.5, 4: 2.5 },
      2: { 1: 2, 4: 3 },
      3: { 4: 3 },
      4: { 1: 1.6, 2: 0.8, 5: 1.2, 7: 4, 11: 2.2 },
      5: { 4: 2.5, 7: 2.5 },
      6: { 7: 3 },
      7: { 4: 2.5, 5: 1.5, 6: 1.5, 11: 1.8 },
      8: { 4: 1, 9: 2 },
      9: { 0: 2.5, 8: 1, 11: 3 },
      10: { 11: 3 },
      11: { 4: 1, 7: 2.5, 9: 2.5, 10: 1.5 },
    },
  },
};

export const sentenceLength = (id: AttentionSentenceId): number => SENTENCES[id].length;
export const defaultQuery = (id: AttentionSentenceId): number => SENTENCES[id].defaultQuery;
export const isValidQuery = (id: AttentionSentenceId, query: number): boolean => Number.isInteger(query) && query >= 0 && query < SENTENCES[id].length;

/** The "nearby words" head: the closer a word is, the higher its score, and beyond three words away it scores nothing. */
const NEARBY_SCORES = [0, 3, 1.6, 0.4] as const;

export type AttentionRow = {
  /** The word's place in the sentence. */
  index: number;
  score: number;
  /** After softmax: the weights of all the rows add up to 1. */
  weight: number;
  /** The weight as a whole percent; all the rows add up to exactly 100. */
  percent: number;
};

/** What `query` looks at: every other word, in sentence order, with its score, its softmax weight and its percent. */
export function attentionFor(id: AttentionSentenceId, head: AttentionHeadId, query: number): AttentionRow[] {
  const data = SENTENCES[id];
  if (!isValidQuery(id, query)) return [];
  const others: number[] = [];
  for (let index = 0; index < data.length; index += 1) if (index !== query) others.push(index);
  const scores = others.map((index) => (head === 'nearby' ? (NEARBY_SCORES[Math.abs(index - query)] ?? 0) : (data.links[query]?.[index] ?? 0)));
  const weights = softmax(scores);
  const percents = toPercents(weights);
  return others.map((index, position) => ({ index, score: scores[position], weight: weights[position], percent: percents[position] }));
}

/** The rows by weight, biggest first (ties keep sentence order). */
export const rankRows = (rows: readonly AttentionRow[]): AttentionRow[] => [...rows].sort((a, b) => b.weight - a.weight || a.index - b.index);

export type Blend = { top: AttentionRow[]; restPercent: number; restCount: number };

/** The biggest `count` contributions to the word's new meaning, and what is left over spread across the rest. */
export function blendOf(rows: readonly AttentionRow[], count = 3): Blend {
  const ranked = rankRows(rows);
  const top = ranked.slice(0, count);
  const rest = ranked.slice(count);
  return { top, restPercent: rest.reduce((total, row) => total + row.percent, 0), restCount: rest.length };
}
