import { describe, expect, test } from '@jest/globals';

import { buildExtraSteps, makeExtraInput, MAX_ITEMS, MAX_VALUE, MIN_ITEMS, parseExtraValues } from './sort-extra';
import { seededRandom } from './sorting';

const last = <T>(items: readonly T[]) => items[items.length - 1]!;
const ascending = (values: readonly number[]) => [...values].sort((a, b) => a - b);

function randomList(random: () => number, size = MIN_ITEMS + Math.floor(random() * (MAX_ITEMS - MIN_ITEMS + 1))) {
  return Array.from({ length: size }, () => Math.floor(random() * (MAX_VALUE + 1)));
}

describe('heap sort (extra)', () => {
  test('sorts ascending for many random lists, in place, with everything marked sorted at the end', () => {
    const random = seededRandom(4);
    for (let run = 0; run < 300; run += 1) {
      const input = randomList(random);
      const result = buildExtraSteps('heap', input);
      const final = last(result.steps);
      expect(final.values).toEqual(ascending(input));
      expect(result.result).toEqual(ascending(input));
      expect(final.heapSize).toBe(0);
      expect(final.sortedFrom).toBe(0);
      expect(final.phase).toBe('done');
      expect(result.moveKind).toBe('swaps');
    }
  });

  test('every step is a rearrangement of the same values, and the sorted tail never changes once set', () => {
    const input = [7, 2, 9, 4, 4, 1, 8];
    const result = buildExtraSteps('heap', input);
    for (const step of result.steps) {
      expect(ascending(step.values)).toEqual(ascending(input));
      const tail = step.values.slice(step.sortedFrom);
      expect(tail).toEqual(ascending(input).slice(step.sortedFrom));
      expect(step.counts).toBeNull();
    }
  });

  test('the heap region stays a max-heap during the extraction phase', () => {
    const result = buildExtraSteps('heap', [3, 8, 1, 9, 5, 7, 2]);
    const swaps = result.steps.filter((step) => step.phase === 'extract' && step.compare.length === 0 && step.moved.length === 0 && step.heapSize !== null);
    for (const step of swaps) for (let i = 1; i < (step.heapSize ?? 0); i += 1) expect(step.values[i]!).toBeLessThanOrEqual(step.values[Math.floor((i - 1) / 2)]!);
  });

  test('counters never go down; the last step carries the totals; an already sorted list still works', () => {
    const result = buildExtraSteps('heap', [1, 2, 3, 4, 5, 6]);
    let comparisons = 0;
    let moves = 0;
    for (const step of result.steps) {
      expect(step.comparisons).toBeGreaterThanOrEqual(comparisons);
      expect(step.moves).toBeGreaterThanOrEqual(moves);
      comparisons = step.comparisons;
      moves = step.moves;
    }
    expect(last(result.steps).comparisons).toBe(result.comparisons);
    expect(last(result.steps).moves).toBe(result.moves);
    expect(last(result.steps).values).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('does not mutate its input', () => {
    const input = [5, 3, 8, 1, 9, 2];
    buildExtraSteps('heap', input);
    expect(input).toEqual([5, 3, 8, 1, 9, 2]);
  });
});

describe('counting sort', () => {
  test('sorts ascending for many random lists without a single comparison', () => {
    const random = seededRandom(14);
    for (let run = 0; run < 300; run += 1) {
      const input = randomList(random);
      const result = buildExtraSteps('counting', input);
      const final = last(result.steps);
      expect(final.output).toEqual(ascending(input));
      expect(result.result).toEqual(ascending(input));
      expect(final.values).toEqual(input);
      expect(result.comparisons).toBe(0);
      expect(final.comparisons).toBe(0);
      expect(result.moveKind).toBe('writes');
    }
  });

  test('counts, then running totals, then placement: the writes are n + (k - 1) + n', () => {
    const input = [4, 2, 2, 8, 3, 3, 1];
    const result = buildExtraSteps('counting', input);
    const k = 9;
    expect(result.moves).toBe(input.length + (k - 1) + input.length);
    const afterCount = result.steps.find((step) => step.phase === 'prefix')!;
    expect(afterCount.counts).toEqual([0, 1, 2, 2, 1, 0, 0, 0, 1]);
    const afterPrefix = last(result.steps.filter((step) => step.phase === 'prefix'));
    expect(afterPrefix.counts).toEqual([0, 1, 3, 5, 6, 6, 6, 6, 7]);
    expect(last(result.steps).counts).toEqual([0, 0, 1, 3, 5, 6, 6, 6, 6]);
  });

  test('is stable: equal values keep their input order', () => {
    const random = seededRandom(6);
    for (let run = 0; run < 100; run += 1) {
      const input = randomList(random);
      const origin = last(buildExtraSteps('counting', input).steps).origin!;
      for (let i = 1; i < origin.length; i += 1) {
        if (input[origin[i]!] === input[origin[i - 1]!]) expect(origin[i]!).toBeGreaterThan(origin[i - 1]!);
      }
      expect([...origin].sort((a, b) => a! - b!)).toEqual(input.map((_, index) => index));
    }
  });

  test('the output fills one value at a time, from the right', () => {
    const result = buildExtraSteps('counting', [2, 1, 2, 0, 1, 2]);
    const filled = result.steps.filter((step) => step.phase === 'place').map((step) => step.output!.filter((value) => value !== null).length);
    expect(filled).toEqual([1, 2, 3, 4, 5, 6]);
    expect(result.steps.filter((step) => step.phase === 'place').map((step) => step.readIndex)).toEqual([5, 4, 3, 2, 1, 0]);
  });

  test('a list of one repeated value, and a list that is all zeros, both work', () => {
    expect(last(buildExtraSteps('counting', [0, 0, 0, 0, 0, 0]).steps).output).toEqual([0, 0, 0, 0, 0, 0]);
    expect(last(buildExtraSteps('counting', [9, 9, 9, 9, 9, 9]).steps).output).toEqual([9, 9, 9, 9, 9, 9]);
  });
});

describe('input helpers', () => {
  test('parses 6 to 12 digits and refuses the rest', () => {
    expect(parseExtraValues('3, 1, 4 1 5 9')).toEqual([3, 1, 4, 1, 5, 9]);
    expect(parseExtraValues('1 2 3')).toBeNull();
    expect(parseExtraValues('1 2 3 4 5 6 7 8 9 0 1 2 3')).toBeNull();
    expect(parseExtraValues('1 2 3 4 5 10')).toBeNull();
    expect(parseExtraValues('1 2 3 4 5 x')).toBeNull();
  });

  test('random input has the size asked, digits only, and repeats by seed', () => {
    const input = makeExtraInput(10, 3);
    expect(input).toHaveLength(10);
    expect(input.every((value) => value >= 0 && value <= MAX_VALUE)).toBe(true);
    expect(makeExtraInput(10, 3)).toEqual(input);
    expect(makeExtraInput(10, 4)).not.toEqual(input);
  });
});
