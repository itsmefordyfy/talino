import { describe, expect, test } from '@jest/globals';

import { buildSortSteps, makeInput, parseCustom, seededRandom, SORT_ALGORITHMS, type SortAlgorithm } from './sorting';

const sortedCopy = (values: readonly number[]) => [...values].sort((a, b) => a - b);
const randomArray = (random: () => number, maxLength = 16, maxValue = 20) => Array.from({ length: 1 + Math.floor(random() * maxLength) }, () => 1 + Math.floor(random() * maxValue));

describe.each(SORT_ALGORITHMS)('%s sort', (algorithm: SortAlgorithm) => {
  test('sorts 200 random arrays (duplicates included) and the last step shows it', () => {
    const random = seededRandom(7);
    for (let run = 0; run < 200; run += 1) {
      const input = randomArray(random);
      const { steps } = buildSortSteps(algorithm, input);
      const last = steps.at(-1)!;
      expect(last.values).toEqual(sortedCopy(input));
      expect(last.sorted).toEqual(input.map((_, index) => index));
    }
  });

  test('every step is a rearrangement of the input and its indexes are valid', () => {
    const random = seededRandom(11);
    for (let run = 0; run < 60; run += 1) {
      const input = randomArray(random);
      const expected = sortedCopy(input);
      for (const step of buildSortSteps(algorithm, input).steps) {
        expect(sortedCopy(step.values)).toEqual(expected);
        for (const index of [...step.compare, ...step.moved, ...step.sorted, ...(step.pivot === null ? [] : [step.pivot])]) {
          expect(index).toBeGreaterThanOrEqual(0);
          expect(index).toBeLessThan(input.length);
        }
      }
    }
  });

  test('the input array is never changed, and counts never go down', () => {
    const input = [5, 3, 8, 1, 9, 2];
    const copy = [...input];
    const run = buildSortSteps(algorithm, input);
    expect(input).toEqual(copy);
    let comparisons = 0;
    let moves = 0;
    for (const step of run.steps) {
      expect(step.comparisons).toBeGreaterThanOrEqual(comparisons);
      expect(step.moves).toBeGreaterThanOrEqual(moves);
      comparisons = step.comparisons;
      moves = step.moves;
    }
    expect(run.steps.at(-1)?.comparisons).toBe(run.comparisons);
  });

  test('handles empty, single and already equal arrays', () => {
    expect(buildSortSteps(algorithm, []).steps.at(-1)?.values).toEqual([]);
    expect(buildSortSteps(algorithm, [4]).steps.at(-1)?.values).toEqual([4]);
    expect(buildSortSteps(algorithm, [3, 3, 3]).steps.at(-1)?.values).toEqual([3, 3, 3]);
  });
});

describe('counts', () => {
  const n = 10;
  const sorted = makeInput('sorted', n, 1);
  const reversed = makeInput('reversed', n, 1);
  test('bubble stops early on sorted input and needs n(n-1)/2 on reversed', () => {
    expect(buildSortSteps('bubble', sorted)).toMatchObject({ comparisons: n - 1, moves: 0 });
    expect(buildSortSteps('bubble', reversed)).toMatchObject({ comparisons: (n * (n - 1)) / 2, moves: (n * (n - 1)) / 2 });
  });
  test('selection always makes n(n-1)/2 comparisons and at most n-1 swaps', () => {
    for (const input of [sorted, reversed, makeInput('random', n, 3)]) {
      const run = buildSortSteps('selection', input);
      expect(run.comparisons).toBe((n * (n - 1)) / 2);
      expect(run.moves).toBeLessThanOrEqual(n - 1);
    }
    expect(buildSortSteps('selection', sorted).moves).toBe(0);
  });
  test('insertion is linear on sorted input and quadratic on reversed', () => {
    expect(buildSortSteps('insertion', sorted)).toMatchObject({ comparisons: n - 1, moves: 0 });
    expect(buildSortSteps('insertion', reversed)).toMatchObject({ comparisons: (n * (n - 1)) / 2, moves: (n * (n - 1)) / 2 });
  });
  test('merge sort comparisons stay within n log2 n and it counts writes', () => {
    for (const size of [2, 5, 8, 16]) {
      const run = buildSortSteps('merge', makeInput('random', size, 5));
      expect(run.comparisons).toBeLessThanOrEqual(Math.ceil(size * Math.log2(size)));
      expect(run.moveKind).toBe('writes');
    }
    // Writing every element once per level: 8 elements, 3 levels.
    expect(buildSortSteps('merge', makeInput('random', 8, 5)).moves).toBe(24);
  });
  test('quick sort is quadratic on sorted input with a last-element pivot and much cheaper on random input', () => {
    expect(buildSortSteps('quick', sorted).comparisons).toBe((n * (n - 1)) / 2);
    expect(buildSortSteps('quick', makeInput('random', 16, 9)).comparisons).toBeLessThan(120);
  });
});

describe('inputs', () => {
  test('patterns have the right shape', () => {
    expect(makeInput('sorted', 5, 1)).toEqual([1, 2, 3, 4, 5]);
    expect(makeInput('reversed', 5, 1)).toEqual([5, 4, 3, 2, 1]);
    expect(sortedCopy(makeInput('random', 12, 4))).toEqual(makeInput('sorted', 12, 4));
    expect(makeInput('random', 12, 4)).toEqual(makeInput('random', 12, 4));
    expect(makeInput('random', 12, 4)).not.toEqual(makeInput('random', 12, 5));
    expect(sortedCopy(makeInput('nearly', 10, 2))).toEqual(makeInput('sorted', 10, 2));
  });
  test('custom values are validated', () => {
    expect(parseCustom('5, 2, 9')).toEqual([5, 2, 9]);
    expect(parseCustom('5 2 9')).toEqual([5, 2, 9]);
    expect(parseCustom('5')).toBeNull();
    expect(parseCustom('5, x')).toBeNull();
    expect(parseCustom('0, 3')).toBeNull();
    expect(parseCustom('100, 3')).toBeNull();
    expect(parseCustom(Array(17).fill('1').join(','))).toBeNull();
  });
});
