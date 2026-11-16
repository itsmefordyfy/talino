import { describe, expect, test } from '@jest/globals';

import type { DiagramSpec } from '../types';
import { validateDiagram } from '../validate';
import { layoutDiagram, wrapText, type DiagramLayout } from './index';
import { compact, isotonic, placeWithSeparation } from './layered';
import { arrowHead, pathData } from './geometry';

function valid(input: unknown): DiagramSpec {
  const result = validateDiagram(input);
  if (!result.ok) throw new Error(result.errors.join(', '));
  return result.spec;
}

const flowOf = (count: number, extra: { from: number; to: number; label?: string }[] = [], kind: 'flow' | 'architecture' = 'flow') =>
  valid({
    kind,
    title: 'T',
    summary: 'S',
    nodes: Array.from({ length: count }, (_, i) => ({ id: `n${i}`, label: `Step number ${i}` })),
    edges: [...Array.from({ length: count - 1 }, (_, i) => ({ from: `n${i}`, to: `n${i + 1}` })), ...extra.map((e) => ({ from: `n${e.from}`, to: `n${e.to}`, ...(e.label ? { label: e.label } : {}) }))],
  });

const apiSequence = valid({
  kind: 'sequence',
  title: 'T',
  summary: 'S',
  participants: [
    { id: 'u', label: 'User' },
    { id: 'f', label: 'Frontend' },
    { id: 'b', label: 'Backend' },
    { id: 'd', label: 'Database' },
  ],
  messages: [
    { from: 'u', to: 'f', label: 'Click Save' },
    { from: 'f', to: 'b', label: 'POST /users with a JSON body and a long description' },
    { from: 'b', to: 'd', label: 'INSERT' },
    { from: 'b', to: 'b', label: 'validate' },
    { from: 'd', to: 'b', label: 'ok', dashed: true },
  ],
});

const classSpec = valid({
  kind: 'class',
  title: 'T',
  summary: 'S',
  classes: [
    { id: 'animal', label: 'Animal', stereotype: 'abstract', attributes: ['name: string'], methods: ['speak(): string'] },
    { id: 'dog', label: 'Dog', methods: ['fetch(): void'] },
    { id: 'cat', label: 'Cat', methods: ['purr(): void'] },
    { id: 'owner', label: 'Owner', attributes: ['pets: List<Animal>'] },
    { id: 'collar', label: 'Collar' },
  ],
  relations: [
    { from: 'dog', to: 'animal', type: 'inherits' },
    { from: 'cat', to: 'animal', type: 'inherits' },
    { from: 'owner', to: 'animal', type: 'aggregates', label: 'owns' },
    { from: 'dog', to: 'collar', type: 'composes' },
    { from: 'owner', to: 'collar', type: 'depends' },
  ],
});

const erSpec = valid({
  kind: 'er',
  title: 'T',
  summary: 'S',
  entities: [
    { id: 'user', label: 'User', attributes: [{ name: 'id', type: 'int', key: 'PK' }, { name: 'name', type: 'text' }] },
    { id: 'order', label: 'Order', attributes: [{ name: 'id', key: 'PK' }, { name: 'user_id', key: 'FK' }] },
    { id: 'item', label: 'OrderItem', attributes: [{ name: 'order_id', key: 'FK' }, { name: 'product_id', key: 'FK' }] },
    { id: 'product', label: 'Product', attributes: [{ name: 'id', key: 'PK' }] },
  ],
  relationships: [
    { from: 'user', to: 'order', fromCardinality: 'one', toCardinality: 'zero-or-many', label: 'places' },
    { from: 'order', to: 'item', fromCardinality: 'one', toCardinality: 'one-or-many', label: 'has' },
    { from: 'product', to: 'item', fromCardinality: 'one', toCardinality: 'zero-or-many', label: 'appears in' },
  ],
});

const overlaps = (layout: DiagramLayout) => {
  const found: string[] = [];
  const nodes = layout.nodes;
  for (let i = 0; i < nodes.length; i += 1)
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      if (a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height) found.push(`${a.id}/${b.id}`);
    }
  return found;
};

function expectSound(layout: DiagramLayout, width: number, mayScroll = false) {
  expect(overlaps(layout)).toEqual([]);
  expect(layout.fontSize).toBeGreaterThanOrEqual(12);
  for (const node of layout.nodes) {
    expect(node.x).toBeGreaterThanOrEqual(0);
    expect(node.y).toBeGreaterThanOrEqual(0);
    expect(node.x + node.width).toBeLessThanOrEqual(layout.width);
    expect(node.y + node.height).toBeLessThanOrEqual(layout.height);
  }
  for (const edge of layout.edges) {
    expect(edge.points.length).toBeGreaterThanOrEqual(2);
    for (const point of edge.points) {
      expect(Number.isFinite(point.x) && Number.isFinite(point.y)).toBe(true);
      expect(point.x).toBeGreaterThanOrEqual(-0.5);
      expect(point.x).toBeLessThanOrEqual(layout.width + 0.5);
      expect(point.y).toBeGreaterThanOrEqual(-0.5);
      expect(point.y).toBeLessThanOrEqual(layout.height + 0.5);
    }
  }
  if (!mayScroll) {
    expect(layout.width).toBeLessThanOrEqual(width);
    expect(layout.needsScroll).toBe(false);
  } else {
    expect(layout.needsScroll).toBe(layout.width > width);
  }
}

describe('text helpers', () => {
  test('wrapText breaks at spaces and inside long words', () => {
    expect(wrapText('one two three', 7)).toEqual(['one two', 'three']);
    expect(wrapText('supercalifragilistic', 8).every((line) => line.length <= 8)).toBe(true);
    expect(wrapText('', 10)).toEqual(['']);
  });

  test('isotonic and placeWithSeparation', () => {
    expect(isotonic([1, 3, 2, 4])).toEqual([1, 2.5, 2.5, 4]);
    const placed = placeWithSeparation([0, 0, 0], [0, 10, 10]);
    expect(placed[1] - placed[0]).toBeCloseTo(10);
    expect(placed[2] - placed[1]).toBeCloseTo(10);
    expect((placed[0] + placed[2]) / 2).toBeCloseTo(0);
  });

  test('compact slides the layers that stick out toward the middle until the drawing fits', () => {
    const item = (pos: number) => ({ key: `i${pos}`, node: 0, rank: 0, main: 20, cross: 20, order: 0, pos, up: [], down: [] });
    const layers = [[item(0), item(40)], [item(80)], [item(10), item(50)]];
    compact(layers, 80);
    const all = layers.flat();
    const left = Math.min(...all.map((i) => i.pos - 10));
    const right = Math.max(...all.map((i) => i.pos + 10));
    expect(right - left).toBeLessThanOrEqual(80.5);
    expect(layers[1][0].pos).toBeLessThan(80);
    // each layer keeps its own spacing: only whole layers move
    expect(layers[0][1].pos - layers[0][0].pos).toBe(40);
    expect(layers[2][1].pos - layers[2][0].pos).toBe(40);
  });

  test('geometry', () => {
    const [tip, left, right] = arrowHead({ x: 10, y: 10 }, { x: 0, y: 10 });
    expect(tip).toEqual({ x: 10, y: 10 });
    expect(left.x).toBeLessThan(10);
    expect(left.y).not.toBe(right.y);
    expect(pathData([{ x: 0, y: 0 }, { x: 10, y: 20 }], 'polyline')).toBe('M0 0 L10 20');
    expect(pathData([{ x: 0, y: 0 }, { x: 10, y: 20 }], 'smooth-v')).toMatch(/^M0 0 C0 10 10 10 10 20$/);
  });
});

describe('layoutDiagram: flow', () => {
  test.each([264, 296, 360, 480, 640, 900])('a seven step chain fits %d pt without overlap', (width) => {
    expectSound(layoutDiagram(flowOf(7), width), width);
  });

  test('portrait phones get top to bottom, wide screens left to right', () => {
    expect(layoutDiagram(flowOf(4), 300).direction).toBe('TD');
    const wide = layoutDiagram(flowOf(4), 900);
    expect(wide.direction).toBe('LR');
    const narrowLayout = layoutDiagram(flowOf(4), 300);
    expect(narrowLayout.height).toBeGreaterThan(narrowLayout.width);
  });

  test('a TD preference is kept on a wide screen', () => {
    const spec = valid({ kind: 'flow', title: 'T', summary: 'S', direction: 'TD', nodes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], edges: [{ from: 'a', to: 'b' }] });
    expect(layoutDiagram(spec, 900).direction).toBe('TD');
  });

  test('every edge ends on its nodes: arrows follow the spec direction', () => {
    const spec = flowOf(4);
    const layout = layoutDiagram(spec, 300);
    const byId = new Map(layout.nodes.map((node) => [node.id, node] as const));
    layout.edges.forEach((edge) => {
      const from = byId.get(edge.from);
      const to = byId.get(edge.to);
      expect(from && to).toBeTruthy();
      if (!from || !to) return;
      const first = edge.points[0];
      const last = edge.points[edge.points.length - 1];
      expect(first.y).toBeCloseTo(from.y + from.height, 0);
      expect(last.y).toBeCloseTo(to.y, 0);
    });
  });

  test('branches, merges and long edges', () => {
    const spec = valid({
      kind: 'flow',
      title: 'T',
      summary: 'S',
      nodes: [
        { id: 'a', label: 'Start', shape: 'circle' },
        { id: 'b', label: 'Valid?', shape: 'diamond' },
        { id: 'c', label: 'Save the record' },
        { id: 'd', label: 'Show an error message' },
        { id: 'e', label: 'Done' },
        { id: 'f', label: 'Log it', shape: 'database' },
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c', label: 'yes' },
        { from: 'b', to: 'd', label: 'no' },
        { from: 'c', to: 'e' },
        { from: 'd', to: 'e' },
        { from: 'a', to: 'e', dashed: true },
        { from: 'e', to: 'f' },
      ],
    });
    for (const width of [264, 360, 700]) expectSound(layoutDiagram(spec, width), width);
  });

  test('a loop (cycle) is drawn without hanging, back edge ends at the right node', () => {
    const spec = flowOf(5, [{ from: 4, to: 0, label: 'again' }]);
    const layout = layoutDiagram(spec, 360);
    expectSound(layout, 360);
    const back = layout.edges[layout.edges.length - 1];
    expect(back.from).toBe('n4');
    expect(back.to).toBe('n0');
    const byId = new Map(layout.nodes.map((node) => [node.id, node] as const));
    expect(back.points[0].y).toBeGreaterThan(byId.get('n0')?.y ?? 0);
    expect(back.label).toBeDefined();
  });

  test('two-way arrows between the same nodes start at different points', () => {
    const spec = valid({ kind: 'flow', title: 'T', summary: 'S', nodes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'a' }] });
    const layout = layoutDiagram(spec, 300);
    expect(layout.edges[0].points[0].x).not.toBe(layout.edges[1].points[1 - 1 + 0].x);
  });

  // Owner's screenshot 2026-11-15: a plant app's screens, two-way arrows between a list and two screens, each labelled. All four labels
  // sat on one line ("Tap Sa ve TapRemove") and the four arrows left the list from the same two points.
  const plantFlow = valid({
    kind: 'flow',
    title: 'Flowchart',
    summary: 'S',
    nodes: [
      { id: 'list', label: 'Plant list' },
      { id: 'add', label: 'Add a plant' },
      { id: 'details', label: 'Plant details' },
    ],
    edges: [
      { from: 'list', to: 'add', label: 'Tap Add' },
      { from: 'add', to: 'list', label: 'Save' },
      { from: 'list', to: 'details', label: 'Tap a plant' },
      { from: 'details', to: 'list', label: 'Remove' },
    ],
  });

  const boxesOverlap = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) =>
    a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

  const labelProblems = (layout: DiagramLayout) => {
    const found: string[] = [];
    const labels = layout.edges.flatMap((edge) => (edge.label ? [{ edge: edge.index, x: edge.label.x - edge.label.width / 2, y: edge.label.y - edge.label.height / 2, w: edge.label.width, h: edge.label.height }] : []));
    for (let i = 0; i < labels.length; i += 1)
      for (let j = i + 1; j < labels.length; j += 1) if (boxesOverlap(labels[i], labels[j])) found.push(`label ${labels[i].edge} / label ${labels[j].edge}`);
    for (const label of labels)
      for (const node of layout.nodes) if (boxesOverlap(label, { x: node.x, y: node.y, w: node.width, h: node.height })) found.push(`label ${label.edge} / node ${node.id}`);
    return found;
  };

  const sharedPorts = (layout: DiagramLayout) => {
    const ends = new Map<string, number>();
    for (const edge of layout.edges)
      for (const point of [edge.points[0], edge.points[edge.points.length - 1]]) {
        const key = `${Math.round(point.x)},${Math.round(point.y)}`;
        ends.set(key, (ends.get(key) ?? 0) + 1);
      }
    return [...ends.entries()].filter(([, count]) => count > 1).map(([key]) => key);
  };

  /** Sideways runs (a TD drawing's horizontal pieces) in the same place, which draw two lines as one. */
  const sharedRuns = (layout: DiagramLayout) => {
    const runs = layout.edges.flatMap((edge) =>
      edge.points.slice(1).flatMap((b, k) => {
        const a = edge.points[k];
        return Math.abs(a.y - b.y) < 0.5 && Math.abs(a.x - b.x) >= 1 ? [{ edge: edge.index, y: a.y, lo: Math.min(a.x, b.x), hi: Math.max(a.x, b.x) }] : [];
      }),
    );
    const found: string[] = [];
    for (let i = 0; i < runs.length; i += 1)
      for (let j = i + 1; j < runs.length; j += 1) {
        const a = runs[i];
        const b = runs[j];
        if (a.edge !== b.edge && Math.abs(a.y - b.y) < 4 && a.lo < b.hi && b.lo < a.hi) found.push(`${a.edge}/${b.edge}`);
      }
    return found;
  };

  test('labels never sit on each other or on a node, and no two arrows share an end point (owner screenshot)', () => {
    for (const width of [300, 360, 700]) {
      const layout = layoutDiagram(plantFlow, width);
      expectSound(layout, width, true);
      expect(labelProblems(layout)).toEqual([]);
      expect(sharedPorts(layout)).toEqual([]);
      if (layout.direction === 'TD') expect(sharedRuns(layout)).toEqual([]);
    }
  });

  test('random labelled graphs keep labels apart', () => {
    let seed = 5;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const words = ['Yes', 'No', 'Tap Save', 'Retry later', 'On error', 'Valid', 'Send request'];
    for (let round = 0; round < 30; round += 1) {
      const count = 2 + Math.floor(random() * 8);
      const seen = new Set<string>();
      const edges: { from: string; to: string; label: string }[] = [];
      for (let k = 0; k < count * 1.4; k += 1) {
        const a = Math.floor(random() * count);
        const b = Math.floor(random() * count);
        if (a === b || seen.has(`${a}-${b}`)) continue;
        seen.add(`${a}-${b}`);
        edges.push({ from: `n${a}`, to: `n${b}`, label: words[Math.floor(random() * words.length)] });
      }
      const spec = valid({ kind: 'flow', title: 'T', summary: 'S', nodes: Array.from({ length: count }, (_, i) => ({ id: `n${i}`, label: `Screen ${i}` })), edges });
      const width = [300, 360, 700][round % 3];
      const layout = layoutDiagram(spec, width);
      expectSound(layout, width, true);
      expect(labelProblems(layout)).toEqual([]);
      expect(sharedPorts(layout)).toEqual([]);
    }
  });

  test('too many siblings for the room scroll sideways instead of shrinking text', () => {
    const nodes = Array.from({ length: 10 }, (_, i) => ({ id: `c${i}`, label: `Child ${i}` }));
    const spec = valid({ kind: 'flow', title: 'T', summary: 'S', direction: 'TD', nodes: [{ id: 'root', label: 'Root' }, ...nodes], edges: nodes.map((node) => ({ from: 'root', to: node.id })) });
    const layout = layoutDiagram(spec, 264);
    expectSound(layout, 264, true);
    expect(layout.needsScroll).toBe(true);
    expect(layout.fontSize).toBeGreaterThanOrEqual(12);
  });

  test('architecture with groups and an unconnected node', () => {
    const spec = valid({
      kind: 'architecture',
      title: 'T',
      summary: 'S',
      nodes: [
        { id: 'client', label: 'Client', group: 'Clients' },
        { id: 'api', label: 'API gateway', group: 'Edge' },
        { id: 'auth', label: 'Auth service', group: 'Services' },
        { id: 'orders', label: 'Orders service', group: 'Services' },
        { id: 'db', label: 'Database', shape: 'database', group: 'Data' },
        { id: 'lonely', label: 'Monitoring' },
      ],
      edges: [
        { from: 'client', to: 'api' },
        { from: 'api', to: 'auth' },
        { from: 'api', to: 'orders' },
        { from: 'orders', to: 'db' },
        { from: 'auth', to: 'db' },
      ],
    });
    for (const width of [264, 360, 700]) expectSound(layoutDiagram(spec, width), width);
    expect(layoutDiagram(spec, 360).nodes.find((node) => node.id === 'api')?.group).toBe('Edge');
  });

  test('random graphs never overlap or leave the drawing', () => {
    let seed = 11;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let round = 0; round < 40; round += 1) {
      const count = 2 + Math.floor(random() * 14);
      const seen = new Set<string>();
      const edges: { from: string; to: string }[] = [];
      for (let k = 0; k < count * 1.5; k += 1) {
        const a = Math.floor(random() * count);
        const b = Math.floor(random() * count);
        if (a === b || seen.has(`${a}-${b}`)) continue;
        seen.add(`${a}-${b}`);
        edges.push({ from: `n${a}`, to: `n${b}` });
      }
      const spec = valid({
        kind: 'flow',
        title: 'T',
        summary: 'S',
        nodes: Array.from({ length: count }, (_, i) => ({ id: `n${i}`, label: i % 3 === 0 ? 'A rather long label that wraps' : `Node ${i}`, shape: (['box', 'rounded', 'diamond', 'circle', 'database'] as const)[i % 5] })),
        edges,
      });
      const width = [264, 360, 700][round % 3];
      expectSound(layoutDiagram(spec, width), width, true);
    }
  });
});

describe('layoutDiagram: sequence', () => {
  test('lifelines, one arrow per message in order, within the width', () => {
    const layout = layoutDiagram(apiSequence, 340);
    expectSound(layout, 340);
    expect(layout.lifelines).toHaveLength(4);
    expect(layout.edges).toHaveLength(5);
    const ys = layout.edges.map((edge) => edge.points[0].y);
    expect([...ys].sort((a, b) => a - b)).toEqual(ys);
    const self = layout.edges[3];
    expect(self.points).toHaveLength(4);
    const reply = layout.edges[4];
    expect(reply.dashed).toBe(true);
    expect(reply.points[0].x).toBeGreaterThan(reply.points[1].x);
  });

  test('many participants scroll sideways', () => {
    const participants = Array.from({ length: 8 }, (_, i) => ({ id: `p${i}`, label: `Participant ${i}` }));
    const spec = valid({ kind: 'sequence', title: 'T', summary: 'S', participants, messages: [{ from: 'p0', to: 'p7', label: 'hello' }] });
    const layout = layoutDiagram(spec, 300);
    expect(layout.needsScroll).toBe(true);
    expect(overlaps(layout)).toEqual([]);
  });
});

describe('layoutDiagram: class and ER grids', () => {
  test.each([264, 360, 640])('class diagram at %d pt', (width) => {
    const layout = layoutDiagram(classSpec, width);
    expectSound(layout, width, true);
    expect(layout.edges).toHaveLength(5);
  });

  test('parents sit above their children', () => {
    const layout = layoutDiagram(classSpec, 640);
    const y = (id: string) => layout.nodes.find((node) => node.id === id)?.y ?? 0;
    expect(y('animal')).toBeLessThan(y('dog'));
    expect(y('animal')).toBeLessThan(y('cat'));
  });

  test('inheritance triangle is at the parent end, composition diamond at the whole', () => {
    const layout = layoutDiagram(classSpec, 640);
    expect(layout.edges[0].markerEnd).toBe('triangle');
    expect(layout.edges[3].markerStart).toBe('diamond-filled');
    expect(layout.edges[4].dashed).toBe(true);
  });

  test.each([264, 360, 640])('ER diagram at %d pt carries cardinality text', (width) => {
    const layout = layoutDiagram(erSpec, width);
    expectSound(layout, width, true);
    expect(layout.edges[0].startText?.text).toBe('1');
    expect(layout.edges[0].endText?.text).toBe('0..n');
    expect(layout.edges[1].endText?.text).toBe('1..n');
    expect(layout.nodes.map((node) => node.id)).toEqual(['user', 'order', 'item', 'product']);
  });

  test('cards show key attributes and dividers', () => {
    const layout = layoutDiagram(erSpec, 360);
    const user = layout.nodes.find((node) => node.id === 'user');
    expect(user?.lines.some((line) => line.kind === 'key' && line.text.startsWith('PK id'))).toBe(true);
    expect(user?.lines.some((line) => line.kind === 'divider')).toBe(true);
  });
});
