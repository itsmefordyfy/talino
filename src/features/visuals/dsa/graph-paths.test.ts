import { describe, expect, test } from '@jest/globals';

import { CYCLE_EDGE, dijkstraSteps, TASKS, tasksGraph, topoSteps, WEIGHTED, type PathGraph } from './graph-paths';
import { seededRandom } from './sorting';

const last = <T>(items: readonly T[]) => items[items.length - 1]!;

/** Bellman-Ford on an undirected graph: an independent way to get every shortest distance. */
function bruteDistances(graph: PathGraph, start: string): Map<string, number> {
  const dist = new Map<string, number>([[start, 0]]);
  for (let round = 0; round < graph.nodes.length; round += 1) {
    for (const { from, to, w } of graph.edges) {
      const a = dist.get(from);
      const b = dist.get(to);
      if (a !== undefined && (b === undefined || a + w < b)) dist.set(to, a + w);
      if (b !== undefined && (a === undefined || b + w < a)) dist.set(from, b + w);
    }
  }
  return dist;
}

function randomWeighted(random: () => number, size: number): PathGraph {
  const nodes = Array.from({ length: size }, (_, i) => ({ id: String.fromCharCode(65 + i), x: random(), y: random() }));
  const edges: PathGraph['edges'][number][] = [];
  for (let i = 0; i < size; i += 1) for (let j = i + 1; j < size; j += 1) if (random() < 0.4) edges.push({ from: nodes[i]!.id, to: nodes[j]!.id, w: Math.floor(random() * 9) });
  return { nodes, edges };
}

function pathWeight(graph: PathGraph, path: readonly string[]): number {
  let total = 0;
  for (let i = 0; i + 1 < path.length; i += 1) {
    const weights = graph.edges.filter((e) => (e.from === path[i] && e.to === path[i + 1]) || (e.to === path[i] && e.from === path[i + 1])).map((e) => e.w);
    expect(weights.length).toBeGreaterThan(0);
    total += Math.min(...weights);
  }
  return total;
}

describe('Dijkstra', () => {
  test('distances from A on the road map', () => {
    const run = dijkstraSteps(WEIGHTED, 'A', 'G');
    expect(WEIGHTED.nodes.map((n, i) => [n.id, run.dist[i]])).toEqual([['A', 0], ['B', 3], ['C', 2], ['D', 8], ['E', 11], ['F', 12], ['G', 14]]);
    expect(run.path).toEqual(['A', 'C', 'B', 'D', 'E', 'F', 'G']);
  });

  test('matches a brute-force check from every start on the fixed graph, and the path costs exactly the distance', () => {
    for (const start of WEIGHTED.nodes) {
      const brute = bruteDistances(WEIGHTED, start.id);
      for (const target of WEIGHTED.nodes) {
        const run = dijkstraSteps(WEIGHTED, start.id, target.id);
        WEIGHTED.nodes.forEach((node, i) => expect(run.dist[i]).toBe(brute.get(node.id) ?? null));
        expect(run.path).not.toBeNull();
        expect(pathWeight(WEIGHTED, run.path!)).toBe(brute.get(target.id));
        expect(run.path![0]).toBe(start.id);
        expect(last(run.path!)).toBe(target.id);
      }
    }
  });

  test('matches brute force on random graphs, including unreachable nodes and zero weights', () => {
    const random = seededRandom(17);
    for (let run = 0; run < 150; run += 1) {
      const graph = randomWeighted(random, 3 + Math.floor(random() * 5));
      const start = graph.nodes[Math.floor(random() * graph.nodes.length)]!.id;
      const target = graph.nodes[Math.floor(random() * graph.nodes.length)]!.id;
      const result = dijkstraSteps(graph, start, target);
      const brute = bruteDistances(graph, start);
      graph.nodes.forEach((node, i) => expect(result.dist[i]).toBe(brute.get(node.id) ?? null));
      if (brute.has(target)) expect(pathWeight(graph, result.path!)).toBe(brute.get(target));
      else expect(result.path).toBeNull();
      expect(last(result.steps).dist).toEqual(result.dist);
    }
  });

  test('settles nodes in order of distance and never settles one twice', () => {
    const run = dijkstraSteps(WEIGHTED, 'A', 'G');
    const final = last(run.steps);
    expect(new Set(final.settled).size).toBe(final.settled.length);
    expect(final.settled).toHaveLength(7);
    const distOf = (id: string) => run.dist[WEIGHTED.nodes.findIndex((n) => n.id === id)]!;
    const distances = final.settled.map(distOf);
    expect(distances).toEqual([...distances].sort((a, b) => a - b));
  });

  test('counters: every settled node checks its unsettled neighbours once', () => {
    const run = dijkstraSteps(WEIGHTED, 'A', 'G');
    const final = last(run.steps);
    // Each of the 10 undirected edges is checked exactly once, from the endpoint settled first.
    expect(final.relaxations).toBe(WEIGHTED.edges.length);
    expect(final.updates).toBeLessThanOrEqual(final.relaxations);
    let seen = 0;
    for (const step of run.steps) {
      expect(step.relaxations).toBeGreaterThanOrEqual(seen);
      seen = step.relaxations;
    }
  });

  test('start equals target gives a one-node path of cost 0; an unreachable target gives no path', () => {
    expect(dijkstraSteps(WEIGHTED, 'D', 'D').path).toEqual(['D']);
    const split: PathGraph = { nodes: [{ id: 'A', x: 0, y: 0 }, { id: 'B', x: 1, y: 1 }], edges: [] };
    const result = dijkstraSteps(split, 'A', 'B');
    expect(result.path).toBeNull();
    expect(result.dist).toEqual([0, null]);
  });
});

describe('topological sort (Kahn)', () => {
  const respectsEdges = (graph: PathGraph, order: readonly string[]) => graph.edges.every((e) => order.indexOf(e.from) < order.indexOf(e.to));

  test('orders the task graph so every dependency comes first', () => {
    const run = topoSteps(TASKS);
    expect(run.order).toHaveLength(TASKS.nodes.length);
    expect(run.leftover).toEqual([]);
    expect(respectsEdges(TASKS, run.order)).toBe(true);
    expect(last(run.steps).stuck).toBe(false);
    expect(last(run.steps).indegree.every((d) => d === 0)).toBe(true);
  });

  test('a loop stops the sort with the loop and what depends on it left over', () => {
    const run = topoSteps(tasksGraph(true));
    expect(run.order).toEqual(['A', 'B']);
    expect(run.leftover).toEqual(['C', 'D', 'E', 'F', 'G']);
    const final = last(run.steps);
    expect(final.stuck).toBe(true);
    expect(final.queue).toEqual([]);
    expect(final.leftover).toEqual(run.leftover);
    expect(CYCLE_EDGE.to).toBe('C');
  });

  test('random DAGs always sort fully; adding a back edge on a path always leaves nodes over', () => {
    const random = seededRandom(9);
    for (let run = 0; run < 200; run += 1) {
      const size = 3 + Math.floor(random() * 5);
      const nodes = Array.from({ length: size }, (_, i) => ({ id: String.fromCharCode(65 + i), x: random(), y: random() }));
      const edges: PathGraph['edges'][number][] = [];
      for (let i = 0; i < size; i += 1) for (let j = i + 1; j < size; j += 1) if (random() < 0.4) edges.push({ from: nodes[i]!.id, to: nodes[j]!.id, w: 1 });
      const dag: PathGraph = { nodes, edges };
      const result = topoSteps(dag);
      expect(result.leftover).toEqual([]);
      expect(respectsEdges(dag, result.order)).toBe(true);
      expect(result.order.length).toBe(size);
      // A loop through the first edge: its target must now come before its source.
      const first = edges[0];
      if (first) {
        const looped = topoSteps({ nodes, edges: [...edges, { from: first.to, to: first.from, w: 1 }] });
        expect(looped.leftover).toContain(first.from);
        expect(looped.leftover).toContain(first.to);
        expect([...looped.order, ...looped.leftover].sort()).toEqual(nodes.map((n) => n.id).sort());
      }
    }
  });

  test('in-degrees only ever go down and the cleared count reaches the number of edges taken', () => {
    const run = topoSteps(TASKS);
    for (let i = 1; i < run.steps.length; i += 1) {
      run.steps[i]!.indegree.forEach((d, k) => expect(d).toBeLessThanOrEqual(run.steps[i - 1]!.indegree[k]!));
    }
    expect(last(run.steps).clearedCount).toBe(TASKS.edges.length);
    expect(run.steps[0]!.queue).toEqual(['A']);
  });
});
