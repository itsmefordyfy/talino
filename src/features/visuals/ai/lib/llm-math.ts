/**
 * The few real formulas the three "How Large Language Models Work" visuals share. The inputs are made-up numbers; the arithmetic done on them is real.
 */

/**
 * Turns scores into probabilities that add up to 1: each score is divided by the temperature, then exponentiated and normalised. The largest score is
 * subtracted first so a big number can never overflow. A temperature at or below zero (or so small it would) means "always the top score": all of the
 * probability goes to the first highest score, which is how greedy choosing is described.
 */
export function softmax(scores: readonly number[], temperature = 1): number[] {
  if (scores.length === 0) return [];
  const top = Math.max(...scores);
  if (!(temperature > 1e-6)) {
    const winner = scores.indexOf(top);
    return scores.map((_, index) => (index === winner ? 1 : 0));
  }
  const exps = scores.map((score) => Math.exp((score - top) / temperature));
  const total = exps.reduce((sum, value) => sum + value, 0);
  return exps.map((value) => value / total);
}

/**
 * Rounds shares to whole percents that add up to exactly 100 (largest remainder), so a list of "57%, 29%, 14%" never reads as 99 or 101.
 * Nothing to share (all zero) gives all zeros.
 */
export function toPercents(shares: readonly number[]): number[] {
  const total = shares.reduce((sum, value) => sum + value, 0);
  if (!(total > 0)) return shares.map(() => 0);
  const exact = shares.map((value) => (value / total) * 100);
  const floors = exact.map((value) => Math.floor(value));
  let left = 100 - floors.reduce((sum, value) => sum + value, 0);
  const order = exact.map((value, index) => ({ index, rest: value - Math.floor(value) })).sort((a, b) => b.rest - a.rest || a.index - b.index);
  for (const { index } of order) {
    if (left <= 0) break;
    floors[index] += 1;
    left -= 1;
  }
  return floors;
}

/** A small seeded random generator (mulberry32): the same seed always gives the same numbers in [0, 1), so a "random" draw is repeatable in tests. */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A number shown to at most two decimals without trailing zeros ("0.3", "-0.2", never "-0"). */
export function formatNumber(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

/** A list of numbers shown as "[0.2, 0.8, -0.3]". */
export const formatVector = (values: readonly number[]): string => `[${values.map(formatNumber).join(', ')}]`;
