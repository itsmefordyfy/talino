import { mulberry32, softmax } from './llm-math';

/**
 * The next-token sampling illustration. The scores (logits) for each prompt are made-up numbers in a hand-written table; the temperature softmax, the
 * top-k and top-p filters, the renormalising and the seeded draws are real arithmetic on them. The words live in the strings file.
 *
 * The order is the one most libraries use: temperature first, then top-k (keep the k most likely), then top-p on what is left (renormalised, keep the
 * smallest set of the most likely tokens whose probabilities add up to p), then renormalise once more so the survivors add up to 1.
 */

export const SAMPLING_PROMPT_IDS = ['learn', 'capital', 'story'] as const;
export type SamplingPromptId = (typeof SAMPLING_PROMPT_IDS)[number];

/** Made-up scores, ten candidates per prompt, highest first (the strings file lists the tokens in the same order). */
export const SAMPLING_LOGITS: Record<SamplingPromptId, readonly number[]> = {
  learn: [3.4, 2.6, 2.4, 2.0, 1.6, 1.2, 0.6, 0.2, -0.8, -1.9],
  capital: [7.0, 3.4, 2.9, 2.3, 1.8, 1.5, 1.2, 0.6, 0.2, -0.5],
  story: [3.0, 2.8, 2.5, 2.4, 1.9, 1.7, 1.4, 1.0, 0.5, -0.6],
};

export const CANDIDATE_COUNT = 10;

export const MIN_TEMPERATURE = 0.2;
export const MAX_TEMPERATURE = 2;
export const TEMPERATURE_STEP = 0.1;
export const MIN_TOP_P = 0.1;
export const MAX_TOP_P = 1;
export const TOP_P_STEP = 0.05;
export const DRAWS = 10;

export type SamplingSettings = { temperature: number; /** How many of the most likely tokens stay (1 to all). */ topK: number; /** The share of probability the kept tokens must cover (0 to 1). */ topP: number };

export const DEFAULT_SETTINGS: SamplingSettings = { temperature: 1, topK: CANDIDATE_COUNT, topP: 1 };

export const clampTopK = (k: number, count = CANDIDATE_COUNT): number => Math.min(count, Math.max(1, Math.round(k)));

export type OutReason = 'top-k' | 'top-p';

export type SamplingCandidate = {
  /** Place in the table, 0 = the first row. */
  index: number;
  logit: number;
  /** The probability after the temperature alone (before any filter). */
  tempProb: number;
  /** 0 = the most likely after the temperature. */
  rank: number;
  kept: boolean;
  /** Why it was dropped, when it was. */
  outBy: OutReason | null;
  /** The final probability: 0 when dropped, and all the kept ones add up to 1. */
  final: number;
};

/** Runs the whole chain on a table of scores. One entry per score, in the table's order. */
export function sampleTable(logits: readonly number[], settings: SamplingSettings): SamplingCandidate[] {
  const count = logits.length;
  if (count === 0) return [];
  const tempProbs = softmax(logits, settings.temperature);
  // Most likely first; equal probabilities keep the table's order so the result never depends on the sort's stability.
  const order = tempProbs.map((_, index) => index).sort((a, b) => tempProbs[b] - tempProbs[a] || a - b);
  const rankOf: number[] = [];
  order.forEach((index, rank) => {
    rankOf[index] = rank;
  });

  const k = clampTopK(settings.topK, count);
  const keptByK = order.slice(0, k);
  const keptMass = keptByK.reduce((total, index) => total + tempProbs[index], 0);

  // top-p on the renormalised survivors of top-k. p >= 1 keeps them all; otherwise add tokens until their total reaches p (always at least one).
  const keptSet = new Set<number>();
  if (settings.topP >= 1) {
    keptByK.forEach((index) => keptSet.add(index));
  } else {
    let running = 0;
    for (const index of keptByK) {
      keptSet.add(index);
      running += tempProbs[index] / keptMass;
      if (running >= settings.topP - 1e-9) break;
    }
  }

  const finalMass = [...keptSet].reduce((total, index) => total + tempProbs[index], 0);
  return logits.map((logit, index) => {
    const kept = keptSet.has(index);
    return {
      index,
      logit,
      tempProb: tempProbs[index],
      rank: rankOf[index],
      kept,
      outBy: kept ? null : rankOf[index] >= k ? 'top-k' : 'top-p',
      final: kept ? tempProbs[index] / finalMass : 0,
    };
  });
}

export type SamplingFacts = {
  /** The most likely token now, its final probability, and what its probability is with the temperature at 1 and no filter. */
  topIndex: number;
  topFinal: number;
  topAtOne: number;
  keptCount: number;
  outByK: number;
  outByP: number;
  /** What the temperature did to the table's shape. */
  temperatureEffect: 'sharper' | 'flatter' | 'same';
};

export function factsOf(logits: readonly number[], settings: SamplingSettings, table: readonly SamplingCandidate[] = sampleTable(logits, settings)): SamplingFacts {
  const top = table.find((candidate) => candidate.rank === 0) ?? table[0];
  return {
    topIndex: top.index,
    topFinal: top.final,
    topAtOne: softmax(logits, 1)[top.index],
    keptCount: table.filter((candidate) => candidate.kept).length,
    outByK: table.filter((candidate) => candidate.outBy === 'top-k').length,
    outByP: table.filter((candidate) => candidate.outBy === 'top-p').length,
    temperatureEffect: settings.temperature < 1 ? 'sharper' : settings.temperature > 1 ? 'flatter' : 'same',
  };
}

/** A different seed for each prompt and each press of Draw, so a press gives new tokens and the same press always gives the same ones. */
export const drawSeed = (promptIndex: number, presses: number): number => 1000 * (promptIndex + 1) + 7919 * presses + 17;

/** Picks `count` table indexes by inverse cumulative distribution from a seeded generator. A token with probability 0 is never picked. */
export function drawTokens(probabilities: readonly number[], count: number, seed: number): number[] {
  const random = mulberry32(seed);
  const total = probabilities.reduce((sum, value) => sum + value, 0);
  let lastPossible = -1;
  probabilities.forEach((value, index) => {
    if (value > 0) lastPossible = index;
  });
  if (lastPossible < 0 || !(total > 0)) return [];
  const picks: number[] = [];
  for (let n = 0; n < count; n += 1) {
    const target = random() * total;
    let running = 0;
    let chosen = lastPossible;
    for (let index = 0; index < probabilities.length; index += 1) {
      running += probabilities[index];
      if (probabilities[index] > 0 && running > target) {
        chosen = index;
        break;
      }
    }
    picks.push(chosen);
  }
  return picks;
}

/** How many times each table index was drawn. */
export function tally(picks: readonly number[], size: number): number[] {
  const counts = Array.from({ length: size }, () => 0);
  for (const pick of picks) counts[pick] += 1;
  return counts;
}
