import { describe, expect, test } from '@jest/globals';

import { cornerSvg, rosettePath, sealSvg } from './certificate-art';

describe('rosettePath', () => {
  test('is one closed path with a scallop for every petal', () => {
    const path = rosettePath(50, 50, 40, 16, 4);
    expect(path.startsWith('M')).toBe(true);
    expect(path.endsWith('Z')).toBe(true);
    expect(path.match(/Q/g)).toHaveLength(16);
  });

  test('stays inside its outer radius and outside its inner one', () => {
    const numbers = rosettePath(50, 50, 40, 12, 5)
      .replace(/[MQZ]/g, ' ')
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    for (let i = 0; i < numbers.length; i += 2) {
      const distance = Math.hypot(numbers[i] - 50, numbers[i + 1] - 50);
      // Control points sit just past the tips, so allow the curve's own overshoot.
      expect(distance).toBeLessThanOrEqual(40 + 5 + 0.01);
      expect(distance).toBeGreaterThanOrEqual(40 - 5 - 0.01);
    }
  });
});

describe('the drawn art', () => {
  test('the seal and the corner are complete SVGs with their own gradient ids', () => {
    for (const svg of [sealSvg('a'), cornerSvg('a')]) {
      expect(svg.startsWith('<svg')).toBe(true);
      expect(svg.endsWith('</svg>')).toBe(true);
      expect(svg).toContain('id="a-');
      expect(svg).toContain('url(#a-');
    }
  });

  test('two copies on one page never share a gradient id', () => {
    const ids = (svg: string) => [...svg.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
    const first = ids(cornerSvg('top'));
    const second = ids(cornerSvg('bottom'));
    expect(first.some((id) => second.includes(id))).toBe(false);
  });
});
