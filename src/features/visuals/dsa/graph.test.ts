import { describe, expect, test } from '@jest/globals';

import { adjacency, bfsSteps, dfsSteps, GRAPHS } from './graph';
import { seededRandom } from './sorting';

const last = <T>(items: readonly T[]) => items[items.length - 1]!;

function randomGraph(random: () => number, size: number) {
  const ids = Array.from({ length: size }, (_, index) => String.fromCharCode(65 + index));
  const edges: [string, string][] = [];
  for (let i = 0; i < size; i += 1) for (let j = i + 1; j < size; j += 1) if (random() < 0.35) edges.push([ids[i]!, ids[j]!]);
  return { ids, edges };
}

function recursiveDfs(adj: Map<string, string[]>, start: string): string[] {
  const order: string[] = [];
  const visit = (u: string) => {
    order.push(u);
    for (const v of adj.get(u) ?? []) if (!order.includes(v)) visit(v);
  };
  visit(start);
  return order;
}

function distances(adj: Map<string, string[]>, start: string): Map<string, number> {
  const dist = new Map([[start, 0]]);
  const queue = [start];
  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const v of adj.get(u) ?? []) {
      if (!dist.has(v)) {
        dist.set(v, (dist.get(u) ?? 0) + 1);
        queue.push(v);
      }
    }
  }
  return dist;
}

describe('graph traversal', () => {
  const tree = GRAPHS[0]!;
  test('BFS and DFS orders on the first graph', () => {
    expect(last(bfsSteps(tree, 'A')).order).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    expect(last(dfsSteps(tree, 'A')).order).toEqual(['A', 'B', 'D', 'E', 'F', 'C', 'G']);
    expect(last(bfsSteps(tree, 'E')).order).toEqual(['E', 'B', 'F', 'A', 'D', 'C', 'G']);
  });

  test('both reach every node of the example graphs from every start, exactly once', () => {
    for (const graph of GRAPHS) {
      for (const node of graph.nodes) {
        for (const steps of [bfsSteps(graph, node.id), dfsSteps(graph, node.id)]) {
          expect([...last(steps).order].sort()).toEqual(graph.nodes.map((n) => n.id));
        }
      }
    }
  });

  test('BFS visits in non-decreasing distance from the start; DFS equals the recursive order (random graphs)', () => {
    const random = seededRandom(5);
    for (let run = 0; run < 150; run += 1) {
      const { ids, edges } = randomGraph(random, 4 + Math.floor(random() * 5));
      const adj = adjacency({ edges });
      const start = ids[Math.floor(random() * ids.length)]!;
      const dist = distances(adj, start);
      const bfs = last(bfsSteps({ edges }, start)).order;
      expect(bfs.length).toBe(dist.size);
      const along = bfs.map((id) => dist.get(id)!);
      expect(along).toEqual([...along].sort((a, b) => a - b));
      expect(last(dfsSteps({ edges }, start)).order).toEqual(recursiveDfs(adj, start));
    }
  });

  test('the BFS frontier is a queue and the DFS frontier a stack, next-out first', () => {
    const bfs = bfsSteps(tree, 'A');
    const afterA = bfs.find((step) => step.current === 'A' && step.edge?.[1] === 'C')!;
    expect(afterA.frontier).toEqual(['B', 'C']);
    const dfs = dfsSteps(tree, 'A');
    const pushed = dfs.find((step) => step.current === 'A' && step.edge)!;
    expect(pushed.frontier).toEqual(['B', 'C']); // B is on top, so it is explored first
  });

  test('DFS skips a node that is already visited', () => {
    const dfs = dfsSteps(tree, 'A');
    expect(dfs.some((step) => step.caption.toLowerCase().includes('already visited'))).toBe(true);
  });

  test('a start node alone in the graph visits just itself', () => {
    expect(last(bfsSteps({ edges: [['B', 'C']] }, 'A')).order).toEqual(['A']);
    expect(last(dfsSteps({ edges: [['B', 'C']] }, 'A')).order).toEqual(['A']);
  });

  test('adjacency is symmetric and sorted', () => {
    const adj = adjacency(tree);
    expect(adj.get('B')).toEqual(['A', 'D', 'E']);
    expect(adj.get('F')).toEqual(['C', 'E']);
  });
});
