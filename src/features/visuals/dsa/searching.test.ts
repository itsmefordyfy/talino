import { describe, expect, test } from '@jest/globals';

import { binarySearchSteps, buildSearchPairs, linearSearchSteps, makeSearchArray } from './searching';

describe('searching', () => {
  test('both searches agree with indexOf for every target, present or missing', () => {
    for (const size of [1, 2, 3, 7, 8, 15]) {
      const values = makeSearchArray(size);
      for (let target = 0; target <= size * 3 + 3; target += 1) {
        const expected = values.indexOf(target);
        const linear = linearSearchSteps(values, target).at(-1)!;
        const binary = binarySearchSteps(values, target).at(-1)!;
        expect(linear.found ?? -1).toBe(expected);
        expect(binary.found ?? -1).toBe(expected);
        expect(linear.done && binary.done).toBe(true);
      }
    }
  });

  test('linear search checks index + 1 values when found, and all of them when missing', () => {
    const values = makeSearchArray(8);
    expect(linearSearchSteps(values, 2).at(-1)?.checked).toBe(1);
    expect(linearSearchSteps(values, values[5]!).at(-1)?.checked).toBe(6);
    expect(linearSearchSteps(values, 999).at(-1)?.checked).toBe(8);
  });

  test('binary search never needs more than floor(log2 n) + 1 checks', () => {
    for (const size of [1, 2, 5, 8, 15]) {
      const values = makeSearchArray(size);
      const limit = Math.floor(Math.log2(size)) + 1;
      for (let target = 0; target <= size * 3 + 3; target += 1) expect(binarySearchSteps(values, target).at(-1)?.checked).toBeLessThanOrEqual(limit);
    }
  });

  test('the range only ever shrinks and the middle stays inside it', () => {
    const values = makeSearchArray(15);
    for (let target = 0; target <= 48; target += 1) {
      let width = Infinity;
      for (const step of binarySearchSteps(values, target)) {
        expect(step.high - step.low + 1).toBeLessThanOrEqual(width);
        width = step.high - step.low + 1;
        if (step.mid !== null) {
          expect(step.mid).toBeGreaterThanOrEqual(step.low);
          expect(step.mid).toBeLessThanOrEqual(step.high);
        }
      }
    }
  });

  test('binary search on 15 values finds the last one in 4 checks while linear needs 15', () => {
    const values = makeSearchArray(15);
    expect(binarySearchSteps(values, values[14]!).at(-1)?.checked).toBe(4);
    expect(linearSearchSteps(values, values[14]!).at(-1)?.checked).toBe(15);
  });

  test('side by side steps last as long as the longer search', () => {
    const values = makeSearchArray(8);
    const pairs = buildSearchPairs(values, values[7]!);
    expect(pairs).toHaveLength(linearSearchSteps(values, values[7]!).length);
    expect(pairs.at(-1)?.binary.done).toBe(true);
    expect(buildSearchPairs([], 5).at(-1)?.linear.found).toBeNull();
  });
});
