import { graphPathsStrings } from './graph-paths-strings';

type Text = typeof graphPathsStrings.en;

export type PathNode = { id: string; x: number; y: number };
/** An edge `from` to `to`. In an undirected graph it works both ways; in a task graph `from` must be finished before `to`. */
export type PathEdge = { from: string; to: string; w: number };
export type PathGraph = { nodes: readonly PathNode[]; edges: readonly PathEdge[] };

/** A small undirected road map with weights (positions are shares of the drawing area). */
export const WEIGHTED: PathGraph = {
  nodes: [
    { id: 'A', x: 0.06, y: 0.5 },
    { id: 'B', x: 0.3, y: 0.1 },
    { id: 'C', x: 0.3, y: 0.9 },
    { id: 'D', x: 0.55, y: 0.5 },
    { id: 'E', x: 0.78, y: 0.1 },
    { id: 'F', x: 0.78, y: 0.9 },
    { id: 'G', x: 0.95, y: 0.5 },
  ],
  edges: [
    { from: 'A', to: 'B', w: 4 },
    { from: 'A', to: 'C', w: 2 },
    { from: 'B', to: 'C', w: 1 },
    { from: 'B', to: 'D', w: 5 },
    { from: 'C', to: 'D', w: 8 },
    { from: 'D', to: 'E', w: 3 },
    { from: 'D', to: 'F', w: 6 },
    { from: 'E', to: 'G', w: 5 },
    { from: 'F', to: 'G', w: 2 },
    { from: 'E', to: 'F', w: 1 },
  ],
};

/** Seven tasks with dependencies: an edge A to B means A must be done before B. */
export const TASKS: PathGraph = {
  nodes: [
    { id: 'A', x: 0.05, y: 0.5 },
    { id: 'B', x: 0.26, y: 0.12 },
    { id: 'C', x: 0.26, y: 0.88 },
    { id: 'D', x: 0.5, y: 0.12 },
    { id: 'E', x: 0.5, y: 0.88 },
    { id: 'F', x: 0.73, y: 0.5 },
    { id: 'G', x: 0.95, y: 0.5 },
  ],
  edges: [
    { from: 'A', to: 'B', w: 1 },
    { from: 'A', to: 'C', w: 1 },
    { from: 'B', to: 'D', w: 1 },
    { from: 'C', to: 'D', w: 1 },
    { from: 'C', to: 'E', w: 1 },
    { from: 'D', to: 'F', w: 1 },
    { from: 'E', to: 'F', w: 1 },
    { from: 'F', to: 'G', w: 1 },
  ],
};

/** The extra dependency that closes a loop (C, D, F, C): F before C, while C is before D before F. */
export const CYCLE_EDGE: PathEdge = { from: 'F', to: 'C', w: 1 };

export const tasksGraph = (withCycle: boolean): PathGraph => (withCycle ? { nodes: TASKS.nodes, edges: [...TASKS.edges, CYCLE_EDGE] } : TASKS);

/** Edges leaving a node, in the order the edges are listed (undirected graphs list each edge once; it works both ways). */
function neighbours(graph: PathGraph, id: string, directed: boolean): { to: string; w: number }[] {
  const out: { to: string; w: number }[] = [];
  for (const edge of graph.edges) {
    if (edge.from === id) out.push({ to: edge.to, w: edge.w });
    else if (!directed && edge.to === id) out.push({ to: edge.from, w: edge.w });
  }
  return out.sort((a, b) => a.to.localeCompare(b.to));
}

export type DijkstraStep = {
  /** Aligned with `graph.nodes`: the best distance known so far (null is infinity). */
  dist: (number | null)[];
  /** Aligned with `graph.nodes`: the node each best distance came from. */
  prev: (string | null)[];
  settled: string[];
  current: string | null;
  /** The edge being checked, and whether it improved the distance. */
  edge: { from: string; to: string; improved: boolean } | null;
  /** The traced cheapest path to the target (only on the last steps). */
  path: string[];
  settledCount: number;
  /** Edges checked so far (each is one relaxation attempt). */
  relaxations: number;
  /** Relaxations that lowered a distance. */
  updates: number;
  caption: string;
};

export type DijkstraRun = { steps: DijkstraStep[]; dist: (number | null)[]; prev: (string | null)[]; path: string[] | null };

/** Dijkstra's algorithm on an undirected graph with non-negative weights: settle the closest unsettled node, then try to improve its neighbours. */
export function dijkstraSteps(graph: PathGraph, start: string, target: string, t: Text = graphPathsStrings.en): DijkstraRun {
  const ids = graph.nodes.map((node) => node.id);
  const indexOf = (id: string) => ids.indexOf(id);
  const dist: (number | null)[] = ids.map((id) => (id === start ? 0 : null));
  const prev: (string | null)[] = ids.map(() => null);
  const settled: string[] = [];
  let relaxations = 0;
  let updates = 0;
  const steps: DijkstraStep[] = [];
  const snap = (caption: string, current: string | null, edge: DijkstraStep['edge'] = null, path: string[] = []) =>
    steps.push({ dist: [...dist], prev: [...prev], settled: [...settled], current, edge, path, settledCount: settled.length, relaxations, updates, caption });

  snap(t.dStart(start), null);
  for (;;) {
    let best = -1;
    for (let i = 0; i < ids.length; i += 1) {
      const d = dist[i];
      if (d === null || d === undefined || settled.includes(ids[i] ?? '')) continue;
      const bestDist = best === -1 ? null : dist[best];
      if (best === -1 || (bestDist !== null && bestDist !== undefined && d < bestDist)) best = i;
    }
    if (best === -1) break;
    const u = ids[best] ?? start;
    const du = dist[best] ?? 0;
    settled.push(u);
    snap(t.dSettle(u, du), u);
    for (const { to, w } of neighbours(graph, u, false)) {
      if (settled.includes(to)) continue;
      const j = indexOf(to);
      const candidate = du + w;
      const old = dist[j] ?? null;
      relaxations += 1;
      if (old === null || candidate < old) {
        dist[j] = candidate;
        prev[j] = u;
        updates += 1;
        snap(t.dBetter(u, to, w, du, candidate, old), u, { from: u, to, improved: true });
      } else {
        snap(t.dKept(u, to, w, du, candidate, old), u, { from: u, to, improved: false });
      }
    }
  }
  const unreached = ids.filter((_, i) => dist[i] === null);
  snap(unreached.length > 0 ? t.dUnreachable(unreached) : t.dSearchDone(settled.length), null);

  const path = tracePath(ids, prev, dist, start, target);
  if (path === null) snap(t.dTargetNone(target), null);
  else if (start === target) snap(t.dTargetSame(start), null, null, path);
  else snap(t.dTarget(start, target, path, dist[indexOf(target)] ?? 0), null, null, path);
  return { steps, dist, prev, path };
}

/** Follow "came from" links back from the target; null when the target was never reached. */
export function tracePath(ids: readonly string[], prev: readonly (string | null)[], dist: readonly (number | null)[], start: string, target: string): string[] | null {
  if (dist[ids.indexOf(target)] === null || dist[ids.indexOf(target)] === undefined) return null;
  const path = [target];
  let at = target;
  while (at !== start) {
    const before = prev[ids.indexOf(at)];
    if (before === null || before === undefined) return null;
    path.unshift(before);
    at = before;
  }
  return path;
}

export type TopoStep = {
  /** Aligned with `graph.nodes`: how many unfinished tasks each task still waits on. */
  indegree: number[];
  queue: string[];
  order: string[];
  current: string | null;
  edge: [string, string] | null;
  /** Dependencies already cleared, as "A>B". */
  cleared: string[];
  /** Tasks never reached when the sort got stuck (only on the last step of a graph with a cycle). */
  leftover: string[];
  /** The sort ended without ordering every task. */
  stuck: boolean;
  /** Dependencies cleared so far. */
  clearedCount: number;
  caption: string;
};

export type TopoRun = { steps: TopoStep[]; order: string[]; leftover: string[] };

/** Kahn's algorithm: repeatedly take a task that waits on nothing and clear its dependencies. */
export function topoSteps(graph: PathGraph, t: Text = graphPathsStrings.en): TopoRun {
  const ids = graph.nodes.map((node) => node.id);
  const indegree = ids.map((id) => graph.edges.filter((edge) => edge.to === id).length);
  const queue = ids.filter((_, i) => indegree[i] === 0);
  const order: string[] = [];
  const cleared: string[] = [];
  const steps: TopoStep[] = [];
  const snap = (caption: string, current: string | null, edge: [string, string] | null = null, leftover: string[] = [], stuck = false) =>
    steps.push({ indegree: [...indegree], queue: [...queue], order: [...order], current, edge, cleared: [...cleared], leftover, stuck, clearedCount: cleared.length, caption });

  snap(t.kStart(queue), null);
  while (queue.length > 0) {
    const u = queue.shift() ?? '';
    order.push(u);
    snap(t.kTake(u, queue.length), u);
    for (const { to } of neighbours(graph, u, true)) {
      const j = ids.indexOf(to);
      indegree[j] = (indegree[j] ?? 0) - 1;
      cleared.push(`${u}>${to}`);
      const left = indegree[j] ?? 0;
      if (left === 0) {
        queue.push(to);
        snap(`${t.kClear(u, to, left)} ${t.kReady(to)}`, u, [u, to]);
      } else {
        snap(t.kClear(u, to, left), u, [u, to]);
      }
    }
  }
  const leftover = ids.filter((id) => !order.includes(id));
  if (leftover.length === 0) snap(t.kDone(order), null);
  else snap(t.kCycle(order, leftover), null, null, leftover, true);
  return { steps, order, leftover };
}
