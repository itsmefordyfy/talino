import { describe, expect, test } from '@jest/globals';

import { layoutJourney, STAGE_HEIGHT } from './layout';
import { fieldStrength } from './neural';
import { levelZones } from './zones';

const layout = layoutJourney(
  [
    { nodeCount: 3, collapsed: false },
    { nodeCount: 2, collapsed: true },
    { nodeCount: 4, collapsed: false },
    { nodeCount: 1, collapsed: false },
  ],
  390,
);

describe('the background is washed level by level', () => {
  test('one zone per level, from the map\'s top to its bottom, with no gap and no overlap', () => {
    const zones = levelZones(layout, ['beginner', 'intermediate', 'advanced', 'expert']);
    expect(zones).toHaveLength(4);
    expect(zones[0]!.top).toBe(0);
    for (let i = 1; i < zones.length; i += 1) expect(zones[i]!.top).toBe(zones[i - 1]!.bottom);
    expect(zones[3]!.bottom).toBe(layout.height);
  });

  test('each zone starts where its banner starts, and carries its level\'s tone', () => {
    const zones = levelZones(layout, ['beginner', 'intermediate', 'advanced', 'expert']);
    const banners = layout.items.filter((item) => item.kind === 'stage');
    // The first zone reaches up to the top of the map; the others begin at their banner.
    for (let i = 1; i < zones.length; i += 1) expect(zones[i]!.top).toBe(banners[i]!.y);
    expect(zones.map((zone) => zone.tone)).toEqual(['mint', 'blue', 'violet', 'amber']);
  });

  test('a folded level is as short as its banner, and still has its own zone', () => {
    const zones = levelZones(layout, ['beginner', 'intermediate', 'advanced', 'expert']);
    expect(zones[1]!.bottom - zones[1]!.top).toBe(STAGE_HEIGHT);
  });

  test('no levels, no zones', () => {
    expect(levelZones(layoutJourney([], 390), [])).toEqual([]);
  });
});

describe('the field of faint neurons fades away from the road', () => {
  const anchors = [{ x: 100, y: 100 }];
  test('full strength at and near the road, the floor far from it, never below the floor', () => {
    expect(fieldStrength({ x: 100, y: 100 }, anchors, { near: 100, far: 300, floor: 0.4 })).toBe(1);
    expect(fieldStrength({ x: 100, y: 190 }, anchors, { near: 100, far: 300, floor: 0.4 })).toBe(1);
    expect(fieldStrength({ x: 100, y: 900 }, anchors, { near: 100, far: 300, floor: 0.4 })).toBeCloseTo(0.4, 5);
  });

  test('falls steadily in between', () => {
    const at = (distance: number) => fieldStrength({ x: 100, y: 100 + distance }, anchors, { near: 100, far: 300, floor: 0.4 });
    expect(at(150)).toBeLessThan(1);
    expect(at(150)).toBeGreaterThan(at(250));
    expect(at(250)).toBeGreaterThan(0.4);
  });

  test('uses the nearest of several anchors, and no anchors means no fade', () => {
    expect(fieldStrength({ x: 500, y: 500 }, [{ x: 0, y: 0 }, { x: 500, y: 520 }], { near: 100, far: 300, floor: 0.4 })).toBe(1);
    expect(fieldStrength({ x: 500, y: 500 }, [], { near: 100, far: 300, floor: 0.4 })).toBe(1);
  });
});
