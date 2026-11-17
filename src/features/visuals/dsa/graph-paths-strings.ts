import { defineStrings } from '@/lib/i18n';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
const distance = (value: number | null) => (value === null ? '∞' : String(value));

// Owner rule: no Filipino is written. The `fil` table is the same English text (a placeholder, not a translation).
const en = {
  title: 'Shortest paths and task order',
  summary: 'Dijkstra finds the cheapest route through a weighted graph; a topological sort orders tasks so every dependency comes first, and a loop proves it impossible.',
  description:
    'Choose Dijkstra or topological sort. Dijkstra: pick a start and a target on a weighted graph, then step through it. The table shows each node\'s best known distance and where it came from, amber marks the node being settled, and the cheapest path is traced at the end. Topological sort: Kahn\'s algorithm repeatedly takes a task with no unfinished prerequisites. Add the loop and it stops with tasks left over, which proves a cycle.',
  topics: ['dijkstra', 'shortest path', 'weighted graph', 'relaxation', 'priority queue', 'topological sort', 'kahn', 'kahn algorithm', 'in-degree', 'dependencies', 'dag', 'directed acyclic graph', 'cycle detection', 'task order', 'graph', 'O(V + E)'],
  modeLabel: 'Algorithm',
  modes: { dijkstra: 'Dijkstra', topo: 'Topological sort' },
  startLabel: 'Start node',
  targetLabel: 'Target node',
  cycleLabel: 'Dependencies',
  cycleOptions: { off: 'No loop', on: 'Add a loop: F before C' },
  graphLabel: 'Graph',
  none: 'none',
  nodeLabel: 'Node',
  distLabel: 'Distance',
  viaLabel: 'Came from',
  indegreeLabel: 'Waiting on',
  tableHint: 'Each column is a node: its name, its best known distance (∞ = not reached yet), and the node it came from.',
  settledLabel: 'Settled',
  queueLabel: 'Queue (ready to start)',
  orderLabel: 'Order so far',
  leftoverLabel: 'Left over',
  counters: { settled: 'Settled', relaxations: 'Edges checked', updates: 'Distances improved', taken: 'Taken', removed: 'Dependencies cleared' },
  legend: { current: 'Being settled', settled: 'Settled', path: 'Shortest path', ready: 'Ready', stuck: 'Stuck in a loop', checked: 'Edge being checked' },
  complexityLabel: 'Cost',
  complexity: {
    dijkstra: 'Dijkstra: O((V + E) log V) with a priority queue (this picture scans for the smallest distance, which is O(V²)). It needs every weight to be zero or more.',
    topo: 'Kahn\'s algorithm: O(V + E). Each task is taken once and each dependency is cleared once.',
  },
  graphDescription: (mode: string, nodes: number, edges: number) => `${mode}: a graph with ${plural(nodes, 'node')} and ${plural(edges, 'edge')}.`,
  nodeState: (id: string, state: string, dist: number | null) => `Node ${id}, ${state}${dist === null ? '' : `, distance ${dist}`}`,
  edgeLabel: (from: string, to: string, weight: number) => `Edge ${from} to ${to}, weight ${weight}`,
  states: { current: 'being settled', settled: 'settled', path: 'on the shortest path', ready: 'ready', stuck: 'stuck in a loop', waiting: 'not reached yet', done: 'done' },
  // Dijkstra
  dStart: (start: string) => `Dijkstra from ${start}: every distance starts at ∞ except ${start}, which is 0. Then always settle the unsettled node with the smallest known distance. This needs every weight to be 0 or more.`,
  dSettle: (node: string, dist: number) => `Settle ${node}: ${dist} is the smallest known distance among the unsettled nodes. Because no weight is negative, no other route can reach ${node} more cheaply.`,
  dBetter: (from: string, to: string, weight: number, fromDist: number, candidate: number, old: number | null) =>
    `Check the edge ${from} to ${to} (weight ${weight}): ${fromDist} + ${weight} = ${candidate}, which beats ${distance(old)}. Update ${to} to ${candidate} and remember it came from ${from}.`,
  dKept: (from: string, to: string, weight: number, fromDist: number, candidate: number, current: number) =>
    `Check the edge ${from} to ${to} (weight ${weight}): ${fromDist} + ${weight} = ${candidate}, which does not beat ${current}. Keep ${current}.`,
  dUnreachable: (nodes: readonly string[]) => `No route reaches ${nodes.join(', ')} from the start, so their distance stays ∞. Dijkstra stops.`,
  dSearchDone: (settled: number) => `All reachable nodes are settled (${plural(settled, 'node')}). Each distance in the table is now the cheapest possible.`,
  dTarget: (start: string, target: string, path: readonly string[], total: number) => `Cheapest path from ${start} to ${target}: ${path.join(' → ')}, total weight ${total}. Found by following "came from" links back from ${target}.`,
  dTargetSame: (start: string) => `The start and the target are both ${start}, so the path is just ${start} and costs 0.`,
  dTargetNone: (target: string) => `${target} cannot be reached from the start, so there is no path.`,
  // Topological sort
  kStart: (queue: readonly string[]) => `Kahn's algorithm: count how many tasks each task waits on (its in-degree). ${queue.length === 0 ? 'Every task waits on another one, so none can start.' : `${queue.join(', ')} wait${queue.length === 1 ? 's' : ''} on nothing, so ${queue.length === 1 ? 'it goes' : 'they go'} in the queue.`}`,
  kTake: (node: string, remaining: number) => `Take ${node} from the front of the queue and put it in the order. ${remaining === 0 ? 'No other task is ready right now.' : `${plural(remaining, 'task')} still ready.`} Now its dependants stop waiting on it.`,
  kClear: (from: string, to: string, left: number) => `${to} no longer waits on ${from}: ${left === 0 ? `it waits on nothing now` : `it still waits on ${plural(left, 'task')}`}.`,
  kReady: (to: string) => `${to} waits on nothing now, so it joins the queue.`,
  kDone: (order: readonly string[]) => `Done: every task is in the order ${order.join(' → ')}. Each task comes after everything it depends on.`,
  kCycle: (order: readonly string[], left: readonly string[]) =>
    `Stuck: the queue is empty but ${plural(left.length, 'task')} (${left.join(', ')}) ${left.length === 1 ? 'is' : 'are'} not in the order. Each one still waits on another unfinished task, so they wait on each other: that is a cycle. ${order.length === 0 ? 'No task could start.' : `Only ${plural(order.length, 'task')} could be ordered.`} No valid order exists.`,
};

export const graphPathsStrings = defineStrings({ en, fil: en });
