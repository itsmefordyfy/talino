import { describe, expect, test } from '@jest/globals';

import { buildSteps, extractSteps, heapifyValues, heapSortSteps, insertSteps, isHeap, levelOf, MAX_HEAP, parentOf, randomValues, START_VALUES, type HeapKind, type HeapRun } from './heap';
import { seededRandom } from './sorting';

const last = <T>(items: readonly T[]) => items[items.length - 1]!;
const KINDS: HeapKind[] = ['min', 'max'];

describe('heap index maths', () => {
  test('parent, level and the starter array', () => {
    expect([1, 2, 3, 4, 5, 6].map(parentOf)).toEqual([0, 0, 1, 1, 2, 2]);
    expect([0, 1, 2, 3, 6, 7, 14].map(levelOf)).toEqual([0, 1, 1, 2, 2, 3, 3]);
    for (const kind of KINDS) expect(isHeap(heapifyValues(START_VALUES, kind), kind)).toBe(true);
  });

  test('isHeap spots a broken array', () => {
    expect(isHeap([1, 5, 2, 9], 'min')).toBe(true);
    expect(isHeap([5, 1, 2], 'min')).toBe(false);
    expect(isHeap([9, 5, 7], 'max')).toBe(true);
    expect(isHeap([5, 9], 'max')).toBe(false);
  });
});

describe('insert', () => {
  test('sifts a small value up to the root of a min-heap and counts swaps and comparisons', () => {
    const run = insertSteps([4, 9, 7, 15, 12, 20, 11], 1, 'min');
    // 1 is added at index 7 (parent 3 = 15), then 9 at index 1, then 4 at the root: three comparisons, three swaps.
    expect(run.result).toEqual([1, 4, 7, 9, 12, 20, 11, 15]);
    expect(run.swaps).toBe(3);
    expect(run.comparisons).toBe(3);
    expect(isHeap(run.result, 'min')).toBe(true);
  });

  test('a value that already fits stays: one comparison, no swap', () => {
    const run = insertSteps([4, 9, 7], 50, 'min');
    expect(run.result).toEqual([4, 9, 7, 50]);
    expect(run.swaps).toBe(0);
    expect(run.comparisons).toBe(1);
  });

  test('into an empty heap needs no comparison', () => {
    const run = insertSteps([], 8, 'max');
    expect(run.result).toEqual([8]);
    expect(run.comparisons).toBe(0);
  });

  test('a full heap refuses and does not change', () => {
    const full = heapifyValues(randomValues(MAX_HEAP, 3), 'min');
    const run = insertSteps(full, 5, 'min');
    expect(run.result).toEqual(full);
    expect(run.steps).toHaveLength(1);
    expect(run.steps[0]!.caption).toContain(String(MAX_HEAP));
  });

  test('never moves more than the height of the tree', () => {
    const random = seededRandom(11);
    for (let run = 0; run < 200; run += 1) {
      const kind = KINDS[run % 2]!;
      const heap = heapifyValues(randomValues(1 + Math.floor(random() * (MAX_HEAP - 1)), run + 1), kind);
      const result = insertSteps(heap, 1 + Math.floor(random() * 60), kind);
      expect(result.swaps).toBeLessThanOrEqual(levelOf(heap.length));
      expect(isHeap(result.result, kind)).toBe(true);
      expect([...result.result].sort((a, b) => a - b)).toHaveLength(heap.length + 1);
    }
  });
});

describe('extract', () => {
  test('returns the root, moves the last value to the root and sifts it down', () => {
    const run = extractSteps([1, 4, 7, 9, 12, 20, 11, 15], 'min');
    expect(run.result).toEqual([4, 9, 7, 15, 12, 20, 11]);
    expect(isHeap(run.result, 'min')).toBe(true);
    expect(run.steps[1]!.values.at(-1)).toBe(1);
    expect(run.steps[1]!.tail).toBe('removed');
    expect(last(run.steps).values).toEqual(run.result);
    expect(last(run.steps).tail).toBe('none');
  });

  test('the extracted value is always the best one, and repeating it gives sorted order', () => {
    const random = seededRandom(5);
    for (let run = 0; run < 100; run += 1) {
      const kind = KINDS[run % 2]!;
      let heap = heapifyValues(randomValues(2 + Math.floor(random() * 13), run + 1), kind);
      const expected = [...heap].sort((a, b) => (kind === 'min' ? a - b : b - a));
      const taken: number[] = [];
      while (heap.length > 0) {
        taken.push(heap[0]!);
        const result: HeapRun = extractSteps(heap, kind);
        expect(isHeap(result.result, kind)).toBe(true);
        expect(result.result).toHaveLength(heap.length - 1);
        heap = result.result;
      }
      expect(taken).toEqual(expected);
    }
  });

  test('a single value leaves an empty heap; an empty heap is refused', () => {
    expect(extractSteps([7], 'min').result).toEqual([]);
    const empty = extractSteps([], 'max');
    expect(empty.result).toEqual([]);
    expect(empty.steps).toHaveLength(1);
  });

  test('does not mutate its input', () => {
    const input = [1, 4, 7, 9];
    extractSteps(input, 'min');
    insertSteps(input, 0, 'min');
    expect(input).toEqual([1, 4, 7, 9]);
  });
});

describe('build heap', () => {
  test('turns any array into a heap of the same values, in at most n swaps', () => {
    const random = seededRandom(8);
    for (let run = 0; run < 200; run += 1) {
      const kind = KINDS[run % 2]!;
      const input = randomValues(1 + Math.floor(random() * MAX_HEAP), run + 1);
      const result = buildSteps(input, kind);
      expect(isHeap(result.result, kind)).toBe(true);
      expect([...result.result].sort((a, b) => a - b)).toEqual([...input].sort((a, b) => a - b));
      expect(result.result).toEqual(heapifyValues(input, kind));
      expect(result.swaps).toBeLessThanOrEqual(input.length);
      expect(last(result.steps).comparisons).toBe(result.comparisons);
    }
  });

  test('an array that is already a heap needs no swaps', () => {
    expect(buildSteps([1, 2, 3, 4, 5, 6, 7], 'min').swaps).toBe(0);
  });

  test('every step keeps the same values until a swap', () => {
    const run = buildSteps([9, 4, 7, 1, 8], 'min');
    for (const step of run.steps) expect([...step.values].sort((a, b) => a - b)).toEqual([1, 4, 7, 8, 9]);
  });
});

describe('heap sort', () => {
  test('a max-heap sorts ascending and a min-heap descending, for many random inputs', () => {
    const random = seededRandom(21);
    for (let run = 0; run < 300; run += 1) {
      const kind = KINDS[run % 2]!;
      const input = Array.from({ length: Math.floor(random() * 16) }, () => 1 + Math.floor(random() * 20));
      const result = heapSortSteps(input, kind);
      const expected = [...input].sort((a, b) => (kind === 'max' ? a - b : b - a));
      const finalStep = last(result.steps);
      expect(finalStep.values).toEqual(expected);
      expect(finalStep.size).toBe(0);
      expect(finalStep.tail).toBe('sorted');
      // The stored heap is left as it was, because the sort works on a copy.
      expect(result.result).toEqual(input);
    }
  });

  test('counters never go down and the last step carries the totals', () => {
    const run = heapSortSteps(heapifyValues(randomValues(12, 4), 'max'), 'max');
    let comparisons = 0;
    let swaps = 0;
    for (const step of run.steps) {
      expect(step.comparisons).toBeGreaterThanOrEqual(comparisons);
      expect(step.swaps).toBeGreaterThanOrEqual(swaps);
      comparisons = step.comparisons;
      swaps = step.swaps;
    }
    expect(last(run.steps).comparisons).toBe(run.comparisons);
    expect(last(run.steps).swaps).toBe(run.swaps);
  });

  test('the sorted tail grows by one value at a time', () => {
    const run = heapSortSteps([5, 3, 8, 1], 'max');
    const sizes = run.steps.filter((step) => step.tail === 'sorted').map((step) => step.size);
    expect(Math.max(...sizes)).toBeLessThanOrEqual(3);
    for (let i = 1; i < sizes.length; i += 1) expect(sizes[i]!).toBeLessThanOrEqual(sizes[i - 1]!);
  });

  test('heap sort does O(n log n) comparisons', () => {
    const n = 15;
    const result = heapSortSteps(randomValues(n, 9), 'max');
    expect(result.comparisons).toBeLessThanOrEqual(2 * n * Math.ceil(Math.log2(n + 1)));
  });
});
