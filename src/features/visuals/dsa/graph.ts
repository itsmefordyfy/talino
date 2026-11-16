import { dsaStrings } from './strings';

type Text = typeof dsaStrings.en.graph;

export type GraphNode = { id: string; x: number; y: number };
export type Graph = { id: 'tree' | 'ring'; nodes: readonly GraphNode[]; edges: readonly (readonly [string, string])[] };

/** Two small undirected graphs; positions are shares of the drawing area. */
export const GRAPHS: readonly Graph[] = [
  { id: 'tree', nodes: [{ id: 'A', x: 0.5, y: 0.08 }, { id: 'B', x: 0.2, y: 0.38 }, { id: 'C', x: 0.8, y: 0.38 }, { id: 'D', x: 0.07, y: 0.85 }, { id: 'E', x: 0.35, y: 0.85 }, { id: 'F', x: 0.65, y: 0.85 }, { id: 'G', x: 0.93, y: 0.85 }], edges: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F'], ['C', 'G'], ['E', 'F']] },
  { id: 'ring', nodes: [{ id: 'A', x: 0.08, y: 0.5 }, { id: 'B', x: 0.33, y: 0.1 }, { id: 'C', x: 0.33, y: 0.9 }, { id: 'D', x: 0.67, y: 0.1 }, { id: 'E', x: 0.67, y: 0.9 }, { id: 'F', x: 0.92, y: 0.5 }], edges: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['B', 'D'], ['C', 'E'], ['D', 'F'], ['E', 'F']] },
];

/** Neighbours of each node, in alphabetical order (the order BFS and DFS look at them here). */
export function adjacency(graph: Pick<Graph, 'edges'>): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const [a, b] of graph.edges) {
    map.set(a, [...(map.get(a) ?? []), b]);
    map.set(b, [...(map.get(b) ?? []), a]);
  }
  for (const list of map.values()) list.sort();
  return map;
}

export type GraphAlgorithm = 'bfs' | 'dfs';

export type GraphStep = {
  /** Nodes in the order they were visited. */
  order: string[];
  current: string | null;
  /** The waiting list: BFS queue (front first) or DFS stack (top first). The next node out is always index 0. */
  frontier: string[];
  /** Nodes already found (in the frontier or visited), so they are never added twice (BFS). */
  seen: string[];
  /** The edge being looked at. */
  edge: [string, string] | null;
  caption: string;
};

export function bfsSteps(graph: Pick<Graph, 'edges'>, start: string, t: Text = dsaStrings.en.graph): GraphStep[] {
  const adj = adjacency(graph);
  const order: string[] = [];
  const queue = [start];
  const seen = new Set([start]);
  const snap = (caption: string, current: string | null, edge: [string, string] | null = null): GraphStep => ({ order: [...order], current, frontier: [...queue], seen: [...seen], edge, caption });
  const steps: GraphStep[] = [snap(t.bfsStart(start), null)];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    steps.push(snap(t.bfsDequeue(u, queue.length), u));
    for (const v of adj.get(u) ?? []) {
      if (seen.has(v)) {
        steps.push(snap(t.bfsSeen(u, v), u, [u, v]));
      } else {
        seen.add(v);
        queue.push(v);
        steps.push(snap(t.bfsEnqueue(u, v), u, [u, v]));
      }
    }
  }
  steps.push(snap(t.done(order.join(', '), 'bfs'), null));
  return steps;
}

export function dfsSteps(graph: Pick<Graph, 'edges'>, start: string, t: Text = dsaStrings.en.graph): GraphStep[] {
  const adj = adjacency(graph);
  const order: string[] = [];
  const stack = [start];
  const visited = new Set<string>();
  const snap = (caption: string, current: string | null, edge: [string, string] | null = null): GraphStep => ({ order: [...order], current, frontier: [...stack].reverse(), seen: [...new Set([...visited, ...stack])], edge, caption });
  const steps: GraphStep[] = [snap(t.dfsStart(start), null)];
  while (stack.length > 0) {
    const u = stack.pop()!;
    if (visited.has(u)) {
      steps.push(snap(t.dfsSkip(u), u));
      continue;
    }
    visited.add(u);
    order.push(u);
    const fresh = (adj.get(u) ?? []).filter((v) => !visited.has(v));
    steps.push(snap(t.dfsVisit(u), u));
    // Pushed in reverse so the alphabetically first neighbour ends on top and is explored first.
    for (const v of [...fresh].reverse()) stack.push(v);
    if (fresh.length > 0) steps.push(snap(t.dfsPush(u, fresh), u, [u, fresh[0] ?? u]));
  }
  steps.push(snap(t.done(order.join(', '), 'dfs'), null));
  return steps;
}

export const graphSteps = (algorithm: GraphAlgorithm, graph: Pick<Graph, 'edges'>, start: string, t: Text = dsaStrings.en.graph) => (algorithm === 'bfs' ? bfsSteps(graph, start, t) : dfsSteps(graph, start, t));
