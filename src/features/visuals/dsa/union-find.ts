import { unionFindStrings } from './union-find-strings';

type Text = typeof unionFindStrings.en;

export const ELEMENTS = 8;

export type UFState = { parent: number[]; /** Only meaningful at roots: how many elements the root's set holds. */ size: number[] };
export type UFOptions = { compress: boolean; bySize: boolean };
export type UFOp = 'idle' | 'find' | 'union';

export type UFStep = {
  parent: number[];
  size: number[];
  /** The elements followed so far during the current find. */
  path: number[];
  focus: number | null;
  /** The root once a find has reached it. */
  root: number | null;
  /** Elements whose parent was just changed by path compression. */
  rewired: number[];
  /** [child root, new parent root] when two sets were just joined. */
  linked: [number, number] | null;
  op: UFOp;
  /** Parent hops so far, counting every earlier operation of the session. */
  hops: number;
  rewires: number;
  caption: string;
};

export type UFRun = { steps: UFStep[]; state: UFState; hops: number; rewires: number };
export type UFCounters = { hops: number; rewires: number };

export const initialState = (): UFState => ({ parent: Array.from({ length: ELEMENTS }, (_, i) => i), size: Array.from({ length: ELEMENTS }, () => 1) });

/** The worst shape: 0 points to 1, 1 to 2, ... up to the root 7. */
export const chainState = (): UFState => ({ parent: Array.from({ length: ELEMENTS }, (_, i) => Math.min(i + 1, ELEMENTS - 1)), size: Array.from({ length: ELEMENTS }, (_, i) => (i === ELEMENTS - 1 ? ELEMENTS : 1)) });

export const idleStep = (state: UFState, caption: string, counters: UFCounters = { hops: 0, rewires: 0 }): UFStep => ({ parent: [...state.parent], size: [...state.size], path: [], focus: null, root: null, rewired: [], linked: null, op: 'idle', hops: counters.hops, rewires: counters.rewires, caption });

/** The root of an element, without changing anything. */
export function rootOf(parent: readonly number[], x: number): number {
  let at = x;
  while ((parent[at] ?? at) !== at) at = parent[at] ?? at;
  return at;
}

/** How many hops it takes to reach the root. */
export const depthOf = (parent: readonly number[], x: number): number => {
  let depth = 0;
  let at = x;
  while ((parent[at] ?? at) !== at) {
    at = parent[at] ?? at;
    depth += 1;
  }
  return depth;
};

/** The sets, each sorted, ordered by their smallest element. */
export function setsOf(parent: readonly number[]): number[][] {
  const groups = new Map<number, number[]>();
  parent.forEach((_, x) => {
    const root = rootOf(parent, x);
    groups.set(root, [...(groups.get(root) ?? []), x]);
  });
  return [...groups.values()].sort((a, b) => (a[0] ?? 0) - (b[0] ?? 0));
}

export const heightOf = (parent: readonly number[]): number => Math.max(0, ...parent.map((_, x) => depthOf(parent, x)));

export type ForestPoint = { x: number; y: number };
/** Where to draw each element: x in leaf slots (0 to the number of leaves), y in levels. Trees sit side by side, roots by index. */
export function forestLayout(parent: readonly number[]): { points: ForestPoint[]; slots: number; levels: number } {
  const children = parent.map(() => [] as number[]);
  const roots: number[] = [];
  parent.forEach((p, x) => {
    if (p === x) roots.push(x);
    else children[p]?.push(x);
  });
  const points: ForestPoint[] = parent.map(() => ({ x: 0, y: 0 }));
  let slot = 0;
  const place = (x: number, level: number): number => {
    const kids = children[x] ?? [];
    let at: number;
    if (kids.length === 0) {
      at = slot + 0.5;
      slot += 1;
    } else {
      const xs = kids.map((kid) => place(kid, level + 1));
      at = (Math.min(...xs) + Math.max(...xs)) / 2;
    }
    points[x] = { x: at, y: level };
    return at;
  };
  for (const root of roots) place(root, 0);
  return { points, slots: slot, levels: heightOf(parent) + 1 };
}

function recorder(state: UFState, base: UFCounters, op: UFOp, t: Text) {
  const parent = [...state.parent];
  const size = [...state.size];
  let hops = base.hops;
  let rewires = base.rewires;
  const steps: UFStep[] = [];
  const snap = (caption: string, extra: Partial<Pick<UFStep, 'path' | 'focus' | 'root' | 'rewired' | 'linked'>> = {}) =>
    steps.push({ parent: [...parent], size: [...size], path: extra.path ?? [], focus: extra.focus ?? null, root: extra.root ?? null, rewired: extra.rewired ?? [], linked: extra.linked ?? null, op, hops, rewires, caption });

  /** Find with the steps recorded; compresses the path when asked. */
  const find = (x: number, compress: boolean): number => {
    const path = [x];
    const before = hops;
    snap(t.fStart(x), { path, focus: x });
    let at = x;
    while ((parent[at] ?? at) !== at) {
      const next = parent[at] ?? at;
      hops += 1;
      path.push(next);
      snap(t.fHop(at, next), { path, focus: next });
      at = next;
    }
    const root = at;
    snap(t.fRoot(x, root, hops - before), { path, focus: root, root });
    if (compress) {
      const todo = path.filter((node) => node !== root && parent[node] !== root);
      if (todo.length === 0) {
        snap(t.fCompressNone(root), { path, root });
      } else {
        snap(t.fCompressStart(todo.length, root), { path, root });
        for (const node of todo) {
          parent[node] = root;
          rewires += 1;
          snap(t.fRewire(node, root), { path, root, rewired: [node], focus: node });
        }
      }
    } else if (path.length > 2) {
      snap(t.fNoCompress, { path, root });
    }
    return root;
  };

  return { parent, size, steps, snap, find, counters: () => ({ hops, rewires }) };
}

/** Find the root of x, with or without path compression. */
export function findSteps(state: UFState, x: number, options: UFOptions, base: UFCounters = { hops: 0, rewires: 0 }, t: Text = unionFindStrings.en): UFRun {
  const r = recorder(state, base, 'find', t);
  const root = r.find(x, options.compress);
  const { hops, rewires } = r.counters();
  r.snap(t.fDone(x, root, hops - base.hops), { root, focus: root });
  return { steps: r.steps, state: { parent: r.parent, size: r.size }, hops, rewires };
}

/** Union of the sets of a and b: two finds, then one root is hung under the other (the smaller under the bigger when union by size is on). */
export function unionSteps(state: UFState, a: number, b: number, options: UFOptions, base: UFCounters = { hops: 0, rewires: 0 }, t: Text = unionFindStrings.en): UFRun {
  const r = recorder(state, base, 'union', t);
  r.snap(t.uStart(a, b), { path: [], focus: a });
  const ra = r.find(a, options.compress);
  const rb = r.find(b, options.compress);
  if (ra === rb) {
    r.snap(t.uSame(a, b, ra), { root: ra });
  } else {
    let child = ra;
    let top = rb;
    if (options.bySize && (r.size[ra] ?? 1) > (r.size[rb] ?? 1)) {
      child = rb;
      top = ra;
    }
    const childSize = r.size[child] ?? 1;
    const topSize = r.size[top] ?? 1;
    r.parent[child] = top;
    r.size[top] = topSize + childSize;
    r.snap(options.bySize ? t.uLinkSize(child, top, childSize, topSize) : t.uLinkPlain(child, top), { linked: [child, top], root: top, focus: child });
  }
  const { hops, rewires } = r.counters();
  r.snap(t.uDone(a, b, setsOf(r.parent).length), { root: rootOf(r.parent, a) });
  return { steps: r.steps, state: { parent: r.parent, size: r.size }, hops, rewires };
}
