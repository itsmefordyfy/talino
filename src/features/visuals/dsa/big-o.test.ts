import { describe, expect, test } from '@jest/globals';

import { chartMax, COMPLEXITIES, curvePoints, formatOps, heightShare, operations } from './big-o';

describe('Big O', () => {
  test('operation counts at known sizes', () => {
    expect(COMPLEXITIES.map((c) => operations(c, 8))).toEqual([1, 3, 8, 24, 64]);
    expect(COMPLEXITIES.map((c) => operations(c, 1024))).toEqual([1, 10, 1024, 10240, 1048576]);
    expect(COMPLEXITIES.map((c) => operations(c, 1))).toEqual([1, 0, 1, 0, 1]);
  });

  test('growth classes are ordered for every n of at least 2', () => {
    for (let n = 2; n <= 1000; n += 1) {
      const [constant, log, linear, linearithmic, quadratic] = COMPLEXITIES.map((c) => operations(c, n)) as [number, number, number, number, number];
      expect(constant).toBeLessThanOrEqual(Math.max(log, 1));
      expect(log).toBeLessThan(linear);
      expect(linear).toBeLessThanOrEqual(linearithmic);
      expect(linearithmic).toBeLessThanOrEqual(quadratic);
    }
  });

  test('what doubling n does to each class', () => {
    const n = 64;
    expect(operations('constant', 2 * n)).toBe(operations('constant', n));
    expect(operations('logarithmic', 2 * n) - operations('logarithmic', n)).toBe(1);
    expect(operations('linear', 2 * n) / operations('linear', n)).toBe(2);
    expect(operations('quadratic', 2 * n) / operations('quadratic', n)).toBe(4);
    const ratio = operations('linearithmic', 2 * n) / operations('linearithmic', n);
    expect(ratio).toBeGreaterThan(2);
    expect(ratio).toBeLessThan(4);
  });

  test('no curve ever decreases', () => {
    for (const c of COMPLEXITIES) for (let n = 1; n < 200; n += 1) expect(operations(c, n + 1)).toBeGreaterThanOrEqual(operations(c, n));
  });

  test('chart points stay within the chart on both axes', () => {
    for (const scale of ['linear', 'log'] as const) {
      const yMax = chartMax(COMPLEXITIES, 64);
      expect(yMax).toBe(4096);
      for (const c of COMPLEXITIES) {
        const points = curvePoints(c, 64, yMax, scale);
        expect(points).toHaveLength(64);
        expect(points[0]?.x).toBe(0);
        expect(points[63]?.x).toBe(1);
        for (const point of points) {
          expect(point.y).toBeGreaterThanOrEqual(0);
          expect(point.y).toBeLessThanOrEqual(1);
        }
      }
      expect(heightShare('quadratic', 64, yMax, scale)).toBe(1);
    }
    expect(heightShare('constant', 10, 4096, 'log')).toBe(0);
  });

  test('formatting', () => {
    expect([formatOps(3), formatOps(2.5849625), formatOps(0)]).toEqual(['3', '2.6', '0']);
  });
});
