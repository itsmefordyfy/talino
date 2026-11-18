import { describe, expect, test } from '@jest/globals';

import { formatNumber, formatVector, mulberry32, softmax, toPercents } from './llm-math';

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0);

describe('softmax', () => {
  test('adds up to 1 and keeps the order of the scores', () => {
    const probs = softmax([2, 1, 0.5, -1]);
    expect(sum(probs)).toBeCloseTo(1, 10);
    for (let i = 1; i < probs.length; i += 1) expect(probs[i]).toBeLessThan(probs[i - 1]);
  });

  test('equal scores share equally, and an empty list gives an empty list', () => {
    expect(softmax([1, 1, 1, 1]).every((value) => Math.abs(value - 0.25) < 1e-12)).toBe(true);
    expect(softmax([])).toEqual([]);
  });

  test('a low temperature sharpens towards the top score and a high one flattens', () => {
    const base = softmax([3, 2, 1]);
    const cold = softmax([3, 2, 1], 0.2);
    const hot = softmax([3, 2, 1], 3);
    expect(cold[0]).toBeGreaterThan(base[0]);
    expect(hot[0]).toBeLessThan(base[0]);
    expect(sum(cold)).toBeCloseTo(1, 10);
    expect(sum(hot)).toBeCloseTo(1, 10);
  });

  test('temperature 0 (or less) is greedy and never overflows on big scores', () => {
    expect(softmax([1, 5, 3], 0)).toEqual([0, 1, 0]);
    expect(softmax([1, 5, 5], -1)).toEqual([0, 1, 0]);
    const big = softmax([1000, 999, 998]);
    expect(big.every(Number.isFinite)).toBe(true);
    expect(sum(big)).toBeCloseTo(1, 10);
  });
});

describe('toPercents', () => {
  test('always adds up to exactly 100', () => {
    for (const shares of [[1, 1, 1], [0.57, 0.29, 0.14], [0.333, 0.333, 0.334], [0.005, 0.995], [1]]) expect(sum(toPercents(shares))).toBe(100);
  });

  test('nothing to share gives zeros', () => {
    expect(toPercents([0, 0])).toEqual([0, 0]);
  });
});

describe('mulberry32', () => {
  test('is repeatable for a seed, differs by seed and stays in [0, 1)', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const first = Array.from({ length: 20 }, () => a());
    expect(first).toEqual(Array.from({ length: 20 }, () => b()));
    expect(first).not.toEqual(Array.from({ length: 20 }, mulberry32(43)));
    for (const value of first) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe('formatting', () => {
  test('numbers drop trailing zeros and never show -0', () => {
    expect(formatNumber(0.3)).toBe('0.3');
    expect(formatNumber(-0.001)).toBe('0');
    expect(formatNumber(1.234)).toBe('1.23');
    expect(formatVector([0.2, 0.8, -0.3])).toBe('[0.2, 0.8, -0.3]');
  });
});
