import type { DiagramSpec, StagedStep } from '../../diagrams';

export const PATH_IDS = ['login', 'browse', 'order'] as const;
export type PathId = (typeof PATH_IDS)[number];

/** Component ids and the arrows between them, in a fixed order that the paths below refer to by position. */
export const COMPONENTS = ['web', 'mobile', 'gateway', 'auth', 'catalog', 'orders', 'payments', 'cache', 'db', 'provider'] as const;
export type ComponentId = (typeof COMPONENTS)[number];

export const LINKS: readonly (readonly [ComponentId, ComponentId])[] = [
  ['web', 'gateway'], // 0
  ['mobile', 'gateway'], // 1
  ['gateway', 'auth'], // 2
  ['gateway', 'catalog'], // 3
  ['gateway', 'orders'], // 4
  ['catalog', 'cache'], // 5
  ['catalog', 'db'], // 6
  ['orders', 'payments'], // 7
  ['payments', 'provider'], // 8
  ['orders', 'db'], // 9
  ['auth', 'db'], // 10
];

/** A request path: the arrows it uses, in order. Each hop starts where the path already is. */
export const PATHS: Readonly<Record<PathId, readonly number[]>> = {
  login: [1, 2, 10],
  browse: [0, 3, 5, 6],
  order: [1, 4, 7, 8, 9],
};

export type ArchStrings = {
  title: string;
  summary: string;
  components: Record<ComponentId, { label: string; note: string }>;
  groups: { clients: string; edge: string; services: string; data: string; outside: string };
};

const GROUP: Record<ComponentId, keyof ArchStrings['groups']> = { web: 'clients', mobile: 'clients', gateway: 'edge', auth: 'services', catalog: 'services', orders: 'services', payments: 'services', cache: 'data', db: 'data', provider: 'outside' };
const SHAPE: Partial<Record<ComponentId, 'database' | 'actor'>> = { cache: 'database', db: 'database' };

export function architectureSpec(s: ArchStrings): DiagramSpec {
  return {
    kind: 'architecture',
    title: s.title,
    summary: s.summary,
    direction: 'TD',
    nodes: COMPONENTS.map((id) => ({ id, label: s.components[id].label, note: s.components[id].note, group: s.groups[GROUP[id]], ...(SHAPE[id] ? { shape: SHAPE[id] } : {}) })),
    edges: LINKS.map(([from, to]) => ({ from, to })),
  };
}

export type PathStep = { edge: number; from: ComponentId; to: ComponentId; /** Nodes lit at this hop, including those already visited. */ nodes: ComponentId[]; edges: number[] };

/** The hops of a path with what is lit at each one: the arrows used so far and the components touched. */
export function pathSteps(id: PathId): PathStep[] {
  const visited: ComponentId[] = [];
  const used: number[] = [];
  return PATHS[id].map((edge) => {
    const [from, to] = LINKS[edge];
    for (const node of [from, to]) if (!visited.includes(node)) visited.push(node);
    used.push(edge);
    return { edge, from, to, nodes: [...visited], edges: [...used] };
  });
}

/** The stepper's stages for a path: the sentence for each hop, with every component and arrow reached so far lit. */
export function buildPathSteps(id: PathId, hops: Record<PathId, readonly string[]>): StagedStep[] {
  return pathSteps(id).map((step, index) => ({ caption: hops[id][index] ?? '', nodes: step.nodes, edges: step.edges }));
}
