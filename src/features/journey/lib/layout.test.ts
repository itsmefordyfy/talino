import { describe, expect, test } from '@jest/globals';

import { CURRENT_NODE_SIZE, curveBetween, GUIDE_HEIGHT, layoutJourney, NODE_CENTER, ROW_HEIGHT, STAGE_HEIGHT, swingOf } from './layout';

describe('layoutJourney', () => {
  const stages = [
    { nodeCount: 3, collapsed: false },
    { nodeCount: 2, collapsed: false },
  ];
  const layout = layoutJourney(stages, 390);

  test('a banner for each stage, then a node for each milestone, top to bottom with no overlap', () => {
    expect(layout.items.filter((item) => item.kind === 'stage')).toHaveLength(2);
    expect(layout.items.filter((item) => item.kind === 'node')).toHaveLength(5);
    for (let i = 1; i < layout.items.length; i += 1) {
      const before = layout.items[i - 1]!;
      expect(layout.items[i]!.y).toBeGreaterThanOrEqual(before.y + before.height);
    }
  });

  test('one path point per node, in journey order, at the node centre', () => {
    expect(layout.points.map((point) => point.nodeIndex)).toEqual([0, 1, 2, 3, 4]);
    const nodes = layout.items.filter((item) => item.kind === 'node');
    layout.points.forEach((point, i) => {
      expect(point.y).toBe(nodes[i]!.y + (nodes[i] as { guideHeight: number }).guideHeight + NODE_CENTER);
      expect(point.x).toBe((nodes[i] as { x: number }).x);
    });
  });

  test('nodes swing left and right and always stay inside the width', () => {
    const xs = layout.points.map((point) => point.x);
    expect(new Set(xs).size).toBeGreaterThan(1);
    for (const x of xs) {
      expect(x - CURRENT_NODE_SIZE / 2).toBeGreaterThanOrEqual(0);
      expect(x + CURRENT_NODE_SIZE / 2).toBeLessThanOrEqual(390);
    }
    for (const width of [320, 360, 768]) for (const point of layoutJourney(stages, width).points) {
      expect(point.x - CURRENT_NODE_SIZE / 2).toBeGreaterThanOrEqual(0);
      expect(point.x + CURRENT_NODE_SIZE / 2).toBeLessThanOrEqual(width);
    }
  });

  test('the swing is a wave: never the same side twice in a row', () => {
    expect([0, 1, 2, 3, 4, 5].map(swingOf)).toEqual([0, 1, 0, -1, 0, 1]);
  });

  test('a collapsed stage keeps its banner, drops its nodes and keeps numbering', () => {
    const collapsed = layoutJourney([{ nodeCount: 3, collapsed: true }, { nodeCount: 2, collapsed: false }], 390);
    expect(collapsed.items.filter((item) => item.kind === 'node')).toHaveLength(2);
    expect(collapsed.points.map((point) => point.nodeIndex)).toEqual([3, 4]);
  });

  test("room is kept above only the current node for Tali's guide, and the path still runs through the node", () => {
    const withGuide = layoutJourney(stages, 390, 1);
    const nodes = withGuide.items.filter((item) => item.kind === 'node') as { guideHeight: number; y: number; height: number }[];
    expect(nodes.map((node) => node.guideHeight)).toEqual([0, GUIDE_HEIGHT, 0, 0, 0]);
    expect(withGuide.height).toBe(layout.height + GUIDE_HEIGHT);
    expect(withGuide.points[1]!.y).toBe(nodes[1]!.y + GUIDE_HEIGHT + NODE_CENTER);
  });

  test('the height covers everything with room for the destination', () => {
    expect(layout.height).toBeGreaterThan(2 * STAGE_HEIGHT + 5 * ROW_HEIGHT);
  });
});

describe('curveBetween', () => {
  test('starts and ends at the two centres with vertical tangents', () => {
    expect(curveBetween({ x: 10, y: 20 }, { x: 110, y: 220 })).toBe('M 10 20 C 10 120, 110 120, 110 220');
  });
});
