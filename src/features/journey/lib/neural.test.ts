import { describe, expect, test } from '@jest/globals';

import { AI_BUILDER_JOURNEY } from '../data/journey';
import { arcBetween, crossLinks, curveLength, nearestPoints, neuralMesh, seeded } from './neural';

describe('neuralMesh', () => {
  test('is the same picture every time for the same size', () => {
    expect(neuralMesh(390, 2000)).toEqual(neuralMesh(390, 2000));
    expect(seeded(3)()).toBe(seeded(3)());
  });

  test('keeps every neuron inside the map and every synapse between two real neurons', () => {
    const mesh = neuralMesh(390, 3000);
    expect(mesh.points.length).toBeGreaterThan(50);
    for (const point of mesh.points) {
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.x).toBeLessThanOrEqual(390);
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(3000);
    }
    for (const [a, b] of mesh.edges) {
      expect(mesh.points[a]).toBeDefined();
      expect(mesh.points[b]).toBeDefined();
      expect(a).not.toBe(b);
    }
  });

  test('never joins the same pair twice, and stays light enough to draw (about one neuron per cell)', () => {
    const mesh = neuralMesh(390, 8000);
    const keys = mesh.edges.map(([a, b]) => (a < b ? `${a}-${b}` : `${b}-${a}`));
    expect(new Set(keys).size).toBe(keys.length);
    expect(mesh.points.length).toBeLessThan(400);
    expect(mesh.edges.length).toBeLessThanOrEqual(mesh.points.length * 2);
  });

  test('leaves the milestones clear', () => {
    const avoid = [{ x: 195, y: 500, radius: 80 }];
    for (const point of neuralMesh(390, 1000, { avoid }).points) expect(Math.hypot(point.x - 195, point.y - 500)).toBeGreaterThanOrEqual(80);
  });

  test('an empty map has no neurons', () => {
    expect(neuralMesh(0, 500)).toEqual({ points: [], edges: [] });
  });
});

describe('nearestPoints', () => {
  test('gives the closest neurons first, within reach', () => {
    const mesh = { points: [{ x: 0, y: 0, r: 1, bright: false }, { x: 10, y: 0, r: 1, bright: false }, { x: 500, y: 0, r: 1, bright: false }], edges: [] };
    expect(nearestPoints(mesh, { x: 9, y: 0 }, 3, 100)).toEqual([1, 0]);
  });
});

describe('crossLinks', () => {
  test('wires a milestone to one further back that it really requires', () => {
    expect(crossLinks([{ id: 'a' }, { id: 'b' }, { id: 'c', requires: ['a'] }, { id: 'd', requires: ['c'] }])).toEqual([[0, 2]]);
  });

  test('the real journey has some, all pointing backwards', () => {
    const milestones = AI_BUILDER_JOURNEY.stages.flatMap((stage) => stage.milestones);
    const links = crossLinks(milestones);
    expect(links.length).toBeGreaterThan(3);
    for (const [from, to] of links) expect(from).toBeLessThan(to - 1);
  });
});

describe('curveLength', () => {
  test('a straight drop is its height, and a swing is longer than the straight line', () => {
    expect(curveLength({ x: 0, y: 0 }, { x: 0, y: 200 })).toBeCloseTo(200, 0);
    expect(curveLength({ x: 0, y: 0 }, { x: 100, y: 200 })).toBeGreaterThan(Math.hypot(100, 200));
  });
});

describe('arcBetween', () => {
  test('bows away from the centre and never leaves the map', () => {
    expect(arcBetween({ x: 300, y: 0 }, { x: 300, y: 400 }, 60, 390)).toBe('M 300 0 Q 360 200, 300 400');
    expect(arcBetween({ x: 60, y: 0 }, { x: 60, y: 400 }, 80, 390)).toBe('M 60 0 Q 12 200, 60 400');
  });
});

