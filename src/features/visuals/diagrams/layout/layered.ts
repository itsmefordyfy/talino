import type { FlowSpec, NodeShape } from '../types';
import { LABEL_FONT, LINE_HEIGHT, NODE_FONT, type DiagramLayout, type LayoutEdge, type LayoutLine, type LayoutNode, type Point } from './types';
import { CHAR_WIDTH, maxLineLength, wrapText } from './text';

const PAD_X = 8;
const PAD_Y = 8;
const MIN_W = 64;
const MIN_H = 36;
const GAP = 10;
const DUMMY_CROSS = 8;
const OUTER = 8;
/** A line's start or end stays this far in from a node's corners. */
const PORT_MARGIN = 10;
/** Most room between two lines leaving the same side of a node. */
const PORT_STEP = 22;
/** A track with no label: just room for a sideways run. */
const TRACK_MIN = 12;
/** Room between two runs or labels on the same track. */
const TRACK_PAD = 8;
/** Room between the outermost track and the nodes above and below it (the arrow head needs it). */
const GAP_EDGE = 14;

export type LayeredOptions = {
  direction: 'TD' | 'LR';
  maxNodeWidth: number;
  /** Room across the layers (x for top to bottom). Layers that stick out are slid inward until the drawing fits, at the cost of straight arrows. */
  fit?: number;
};

type Size = { w: number; h: number; lines: string[] };

/** How far a decision's pointed ends reach in from its sides (it is drawn as a wide six-sided box, not a diamond). */
export const DECISION_INSET = 14;

/**
 * Size of a node for its label and shape, wrapped to at most `maxWidth` wide. A decision (`diamond`) is drawn as a wide box with pointed
 * ends: a true diamond only has room for a few letters per line, which turned a short question into a tall, hard-to-read shape on a phone.
 * Circles need extra room around their text.
 */
export function sizeNode(label: string, shape: NodeShape, maxWidth: number): Size {
  const glyph = NODE_FONT * CHAR_WIDTH;
  const share = shape === 'circle' ? 0.7 : 1;
  const inset = shape === 'diamond' ? DECISION_INSET : 0;
  const usable = shape === 'circle' ? maxWidth * share : maxWidth - 2 * PAD_X - 2 * inset;
  const lines = wrapText(label, usable / glyph);
  const textW = Math.ceil(maxLineLength(lines) * glyph);
  const textH = lines.length * LINE_HEIGHT;
  if (shape === 'diamond') {
    const w = Math.min(maxWidth, Math.max(MIN_W + 2 * inset, textW + 2 * PAD_X + 2 * inset));
    return { w, h: Math.max(MIN_H + 6, textH + 2 * PAD_Y + 4), lines };
  }
  if (shape === 'circle') {
    const d = Math.max(56, Math.ceil(Math.max(textW, textH) / share));
    return { w: d, h: d, lines };
  }
  const w = Math.min(maxWidth, Math.max(MIN_W, textW + 2 * PAD_X));
  const h = Math.max(MIN_H, textH + 2 * PAD_Y) + (shape === 'database' ? 12 : 0);
  return { w, h, lines };
}

type Item = { key: string; node: number; rank: number; main: number; cross: number; order: number; pos: number; up: Item[]; down: Item[] };

/** Isotonic regression (pool adjacent violators): the closest non-decreasing sequence to `values`. */
export function isotonic(values: readonly number[]): number[] {
  const blocks: { sum: number; count: number }[] = [];
  for (const value of values) {
    blocks.push({ sum: value, count: 1 });
    while (blocks.length > 1) {
      const last = blocks[blocks.length - 1];
      const before = blocks[blocks.length - 2];
      if (before.sum / before.count <= last.sum / last.count) break;
      blocks.splice(blocks.length - 2, 2, { sum: before.sum + last.sum, count: before.count + last.count });
    }
  }
  return blocks.flatMap((block) => Array.from({ length: block.count }, () => block.sum / block.count));
}

/** Closest positions to `desired` that keep each neighbor at least `separation[i]` apart (separation[0] is ignored). */
export function placeWithSeparation(desired: readonly number[], separation: readonly number[]): number[] {
  const offsets: number[] = [];
  let total = 0;
  desired.forEach((_, i) => {
    total += i === 0 ? 0 : separation[i];
    offsets.push(total);
  });
  const fitted = isotonic(desired.map((value, i) => value - offsets[i]));
  return fitted.map((value, i) => value + offsets[i]);
}

/** Slides the layers that define the left or right edge of the drawing toward the middle until it is no wider than `target`. */
export function compact(layers: Item[][], target: number): void {
  for (let guard = 0; guard < 200; guard += 1) {
    const extents = layers.map((layer) => (layer.length === 0 ? null : { left: Math.min(...layer.map((item) => item.pos - item.cross / 2)), right: Math.max(...layer.map((item) => item.pos + item.cross / 2)) }));
    const present = extents.filter((extent): extent is { left: number; right: number } => extent !== null);
    if (present.length === 0) return;
    const left = Math.min(...present.map((extent) => extent.left));
    const right = Math.max(...present.map((extent) => extent.right));
    const excess = right - left - target;
    if (excess <= 0.5) return;
    let moved = false;
    for (let r = 0; r < layers.length && !moved; r += 1) {
      const extent = extents[r];
      if (!extent) continue;
      let shift = 0;
      if (extent.left <= left + 1e-6 && extent.right < right - 1e-6) shift = Math.min(excess, right - extent.right);
      else if (extent.right >= right - 1e-6 && extent.left > left + 1e-6) shift = -Math.min(excess, extent.left - left);
      if (shift !== 0) {
        for (const item of layers[r]) item.pos += shift;
        moved = true;
      }
    }
    if (!moved) return;
  }
}

/**
 * Layered (Sugiyama-style) drawing of a flowchart or architecture diagram: break cycles, rank nodes by
 * longest path, add stand-ins for edges that skip layers, order each layer to reduce crossings
 * (barycenter sweeps), then place nodes with a least-squares pull toward their neighbors. Pure: returns
 * coordinates only.
 */
export function layoutLayered(spec: FlowSpec, options: LayeredOptions): DiagramLayout {
  const vertical = options.direction === 'TD';
  const count = spec.nodes.length;
  const indexOf = new Map(spec.nodes.map((node, i) => [node.id, i] as const));
  const links = spec.edges.map((edge) => ({ s: indexOf.get(edge.from) ?? 0, t: indexOf.get(edge.to) ?? 0 }));

  // 1. Cycle breaking: an edge that closes a loop is ranked as if reversed (and drawn from its real source).
  const outgoing: number[][] = Array.from({ length: count }, () => []);
  links.forEach((link, i) => outgoing[link.s].push(i));
  const reversed = links.map(() => false);
  const state = new Array<number>(count).fill(0);
  const visit = (u: number) => {
    state[u] = 1;
    for (const e of outgoing[u]) {
      const v = links[e].t;
      if (state[v] === 1) reversed[e] = true;
      else if (state[v] === 0) visit(v);
    }
    state[u] = 2;
  };
  for (let u = 0; u < count; u += 1) if (state[u] === 0) visit(u);
  const oriented = links.map((link, i) => (reversed[i] ? { a: link.t, b: link.s } : { a: link.s, b: link.t }));

  // 2. Ranks by longest path.
  const indegree = new Array<number>(count).fill(0);
  const forward: number[][] = Array.from({ length: count }, () => []);
  oriented.forEach(({ a, b }) => {
    indegree[b] += 1;
    forward[a].push(b);
  });
  const rank = new Array<number>(count).fill(0);
  const queue = indegree.flatMap((d, i) => (d === 0 ? [i] : []));
  for (let head = 0; head < queue.length; head += 1) {
    const u = queue[head];
    for (const v of forward[u]) {
      rank[v] = Math.max(rank[v], rank[u] + 1);
      indegree[v] -= 1;
      if (indegree[v] === 0) queue.push(v);
    }
  }

  // 3. Node sizes, then main/cross sizes for the chosen direction.
  const sizes = spec.nodes.map((node) => sizeNode(node.label, node.shape ?? 'rounded', options.maxNodeWidth));
  const items: Item[] = spec.nodes.map((_, i) => ({
    key: `n${i}`,
    node: i,
    rank: rank[i],
    main: vertical ? sizes[i].h : sizes[i].w,
    cross: vertical ? sizes[i].w : sizes[i].h,
    order: 0,
    pos: 0,
    up: [],
    down: [],
  }));
  const chains: Item[][] = oriented.map(({ a, b }, e) => {
    const chain: Item[] = [items[a]];
    for (let r = rank[a] + 1; r < rank[b]; r += 1) {
      const dummy: Item = { key: `d${e}-${r}`, node: -1, rank: r, main: 0, cross: DUMMY_CROSS, order: 0, pos: 0, up: [], down: [] };
      items.push(dummy);
      chain.push(dummy);
    }
    chain.push(items[b]);
    return chain;
  });
  chains.forEach((chain) => {
    for (let i = 1; i < chain.length; i += 1) {
      chain[i - 1].down.push(chain[i]);
      chain[i].up.push(chain[i - 1]);
    }
  });

  const layerCount = Math.max(0, ...rank) + 1;
  const layers: Item[][] = Array.from({ length: layerCount }, () => []);
  items.forEach((item) => layers[item.rank].push(item));
  layers.forEach((layer) => layer.forEach((item, i) => (item.order = i)));

  // 4. Crossing reduction.
  const sweep = (down: boolean) => {
    const range = down ? layers.slice(1) : layers.slice(0, -1).reverse();
    for (const layer of range) {
      const bary = new Map<Item, number>();
      for (const item of layer) {
        const neighbors = down ? item.up : item.down;
        bary.set(item, neighbors.length > 0 ? neighbors.reduce((sum, other) => sum + other.order, 0) / neighbors.length : item.order);
      }
      layer.sort((x, y) => (bary.get(x) ?? 0) - (bary.get(y) ?? 0) || x.order - y.order);
      layer.forEach((item, i) => (item.order = i));
    }
  };
  for (let pass = 0; pass < 4; pass += 1) {
    sweep(true);
    sweep(false);
  }

  // 5. Positions across the layers.
  const separation = (layer: Item[]) => layer.map((item, i) => (i === 0 ? 0 : (layer[i - 1].cross + item.cross) / 2 + (item.node < 0 || layer[i - 1].node < 0 ? 8 : GAP)));
  // Start with each layer packed and centered on zero (the fit of all-zero wishes).
  layers.forEach((layer) => placeWithSeparation(layer.map(() => 0), separation(layer)).forEach((value, i) => (layer[i].pos = value)));
  const relax = (layer: Item[], useUp: boolean) => {
    const desired = layer.map((item) => {
      const neighbors = useUp ? item.up : item.down;
      return neighbors.length > 0 ? neighbors.reduce((sum, other) => sum + other.pos, 0) / neighbors.length : item.pos;
    });
    placeWithSeparation(desired, separation(layer)).forEach((value, i) => (layer[i].pos = value));
  };
  for (let pass = 0; pass < 8; pass += 1) {
    for (let r = 1; r < layerCount; r += 1) relax(layers[r], true);
    for (let r = layerCount - 2; r >= 0; r -= 1) relax(layers[r], false);
  }

  if (options.fit !== undefined) compact(layers, options.fit);

  // 6. Where each line leaves and meets a node. All the lines on one side of a node share its width, ordered by where their other end
  //    is (ties by edge, the same way at both ends, so two arrows between the same nodes run side by side and never cross). Before
  //    2026-11-15 only lines between the same two nodes were spread, so four arrows leaving one screen drew over each other.
  const portSpan = (item: Item): number => {
    if (item.node < 0) return 0;
    const shape = spec.nodes[item.node].shape ?? 'rounded';
    if (shape === 'circle') return item.cross * 0.4;
    if (shape === 'diamond') return vertical ? Math.max(0, item.cross - 2 * DECISION_INSET - 2 * PORT_MARGIN) : item.cross * 0.3;
    return Math.max(0, item.cross - 2 * PORT_MARGIN);
  };
  const outPort = new Array<number>(chains.length).fill(0);
  const inPort = new Array<number>(chains.length).fill(0);
  const sides = new Map<Item, { out: { e: number; other: number }[]; in: { e: number; other: number }[] }>();
  const sideOf = (item: Item) => {
    let side = sides.get(item);
    if (!side) {
      side = { out: [], in: [] };
      sides.set(item, side);
    }
    return side;
  };
  chains.forEach((chain, e) => {
    sideOf(chain[0]).out.push({ e, other: chain[1].pos });
    sideOf(chain[chain.length - 1]).in.push({ e, other: chain[chain.length - 2].pos });
  });
  sides.forEach((side, item) => {
    for (const [list, target] of [[side.out, outPort], [side.in, inPort]] as const) {
      list.sort((a, b) => a.other - b.other || a.e - b.e);
      const n = list.length;
      const step = n > 1 ? Math.min(PORT_STEP, portSpan(item) / (n - 1)) : 0;
      list.forEach((entry, k) => (target[entry.e] = item.pos + (k - (n - 1) / 2) * step));
    }
  });

  // 7. Each gap between two layers: a line that has to move sideways gets its own track (the height of its sideways run), and so does
  //    a label, which sits on its line's run. Runs or labels that would overlap never share a track, and the gap grows to hold its
  //    tracks, so labels can't pile up on one line and two runs can't draw as one.
  const labelLines = spec.edges.map((edge) => (edge.label ? wrapText(edge.label, vertical ? 24 : 14) : null));
  const labelWidth = labelLines.map((lines) => (lines ? Math.ceil(maxLineLength(lines) * LABEL_FONT * CHAR_WIDTH) + 10 : 0));
  const labelHeight = labelLines.map((lines) => (lines ? lines.length * 15 + 4 : 0));
  const labelCross = (e: number) => (vertical ? labelWidth[e] : labelHeight[e]);
  const labelMain = (e: number) => (vertical ? labelHeight[e] : labelWidth[e]);
  type Segment = { e: number; k: number; from: number; to: number; labelled: boolean; track: number; mid: number };
  const segments: Segment[][] = Array.from({ length: Math.max(0, layerCount - 1) }, () => []);
  chains.forEach((chain, e) => {
    for (let k = 0; k < chain.length - 1; k += 1) {
      const from = k === 0 ? outPort[e] : chain[k].pos;
      const to = k === chain.length - 2 ? inPort[e] : chain[k + 1].pos;
      segments[chain[k].rank].push({ e, k, from, to, labelled: k === 0 && labelLines[e] !== null, track: -1, mid: 0 });
    }
  });
  const baseGap = vertical ? 40 : 52;
  const gaps = new Array<number>(Math.max(0, layerCount - 1)).fill(baseGap);
  const trackCenters: number[][] = [];
  segments.forEach((list, r) => {
    const needs = list.filter((segment) => segment.labelled || Math.abs(segment.from - segment.to) >= 1);
    const spans = needs.map((segment) => {
      let lo = Math.min(segment.from, segment.to);
      let hi = Math.max(segment.from, segment.to);
      if (segment.labelled) {
        // On the run's middle when the line bends, on the line itself when it is straight.
        const centre = Math.abs(segment.from - segment.to) >= 1 ? (segment.from + segment.to) / 2 : segment.from;
        lo = Math.min(lo, centre - labelCross(segment.e) / 2);
        hi = Math.max(hi, centre + labelCross(segment.e) / 2);
      }
      return { segment, lo, hi };
    });
    spans.sort((a, b) => a.lo - b.lo || a.hi - b.hi);
    const trackEnds: number[] = [];
    const thickness: number[] = [];
    for (const span of spans) {
      let t = trackEnds.findIndex((end) => end + TRACK_PAD <= span.lo);
      if (t < 0) {
        t = trackEnds.length;
        trackEnds.push(-Infinity);
        thickness.push(TRACK_MIN);
      }
      trackEnds[t] = span.hi;
      span.segment.track = t;
      if (span.segment.labelled) thickness[t] = Math.max(thickness[t], labelMain(span.segment.e) + 6);
    }
    const total = thickness.reduce((sum, value) => sum + value, 0);
    gaps[r] = Math.max(baseGap, total + 2 * GAP_EDGE);
    const centers: number[] = [];
    let cursor = (gaps[r] - total) / 2;
    thickness.forEach((value) => {
      centers.push(cursor + value / 2);
      cursor += value;
    });
    trackCenters.push(centers);
  });
  const bandSize = layers.map((layer) => Math.max(0, ...layer.map((item) => item.main)));
  const bandStart: number[] = [];
  let cursor = 0;
  layers.forEach((_, r) => {
    bandStart.push(cursor);
    cursor += bandSize[r] + (gaps[r] ?? 0);
  });
  const bandCenter = (r: number) => bandStart[r] + bandSize[r] / 2;
  const trackAt = (r: number, t: number) => bandStart[r] + bandSize[r] + trackCenters[r][t];

  // 8. Coordinates (TD: cross is x, main is y; LR: the other way round).
  const at = (cross: number, main: number): Point => (vertical ? { x: cross, y: main } : { x: main, y: cross });
  const nodes: LayoutNode[] = spec.nodes.map((node, i) => {
    const item = items[i];
    const centre = at(item.pos, bandCenter(item.rank));
    const shape: NodeShape = node.shape ?? 'rounded';
    const lineBlock = sizes[i].lines.length * LINE_HEIGHT;
    const top = (sizes[i].h - lineBlock) / 2 + (shape === 'database' ? 5 : 0);
    const lines: LayoutLine[] = sizes[i].lines.map((text, k) => ({ text, x: sizes[i].w / 2, y: top + k * LINE_HEIGHT + LINE_HEIGHT / 2, kind: 'text', align: 'center' }));
    return { id: node.id, index: i, x: centre.x - sizes[i].w / 2, y: centre.y - sizes[i].h / 2, width: sizes[i].w, height: sizes[i].h, shape, lines, ...(node.group ? { group: node.group } : {}) };
  });

  const segmentOf = new Map<string, Segment>();
  segments.forEach((list) => list.forEach((segment) => segmentOf.set(`${segment.e}:${segment.k}`, segment)));

  const edges: LayoutEdge[] = chains.map((chain, e) => {
    const first = chain[0];
    const points: Point[] = [at(outPort[e], bandCenter(first.rank) + first.main / 2)];
    let label: LayoutEdge['label'];
    for (let k = 0; k < chain.length - 1; k += 1) {
      const segment = segmentOf.get(`${e}:${k}`) as Segment;
      const next = chain[k + 1];
      const bends = Math.abs(segment.from - segment.to) >= 1;
      if (segment.track >= 0) {
        const run = trackAt(chain[k].rank, segment.track);
        if (bends) points.push(at(segment.from, run), at(segment.to, run));
        if (segment.labelled && labelLines[e]) {
          const spot = at(bends ? (segment.from + segment.to) / 2 : segment.from, run);
          label = { lines: labelLines[e] as string[], x: spot.x, y: spot.y, width: labelWidth[e], height: labelHeight[e] };
        }
      }
      points.push(at(segment.to, bandCenter(next.rank) - next.main / 2));
    }
    const ordered = reversed[e] ? [...points].reverse() : points;
    const spec_ = spec.edges[e];
    return {
      index: e,
      from: spec_.from,
      to: spec_.to,
      points: ordered,
      curve: 'rounded',
      ...(label ? { label } : {}),
      dashed: spec_.dashed === true,
      markerStart: spec_.bidirectional ? 'arrow' : 'none',
      markerEnd: 'arrow',
    };
  });

  return normalize({ kind: spec.kind, width: 0, height: 0, needsScroll: false, fontSize: LABEL_FONT, direction: options.direction, nodes, edges, lifelines: [] });
}

/** Moves everything so the drawing starts at the outer margin and sets its size. Includes labels and edge text. */
export function normalize(layout: DiagramLayout): DiagramLayout {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const include = (x: number, y: number) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };
  layout.nodes.forEach((node) => {
    include(node.x, node.y);
    include(node.x + node.width, node.y + node.height);
  });
  layout.edges.forEach((edge) => {
    edge.points.forEach((point) => include(point.x, point.y));
    if (edge.label) {
      include(edge.label.x - edge.label.width / 2, edge.label.y - edge.label.height / 2);
      include(edge.label.x + edge.label.width / 2, edge.label.y + edge.label.height / 2);
    }
    for (const text of [edge.startText, edge.endText]) if (text) include(text.x + (text.text.length * 8) / 2, text.y + 8);
  });
  layout.lifelines.forEach((line) => {
    include(line.x, line.y1);
    include(line.x, line.y2);
  });
  if (!Number.isFinite(minX)) return { ...layout, width: OUTER * 2, height: OUTER * 2 };
  const dx = OUTER - minX;
  const dy = OUTER - minY;
  layout.nodes.forEach((node) => {
    node.x += dx;
    node.y += dy;
  });
  layout.edges.forEach((edge) => {
    edge.points = edge.points.map((point) => ({ x: point.x + dx, y: point.y + dy }));
    if (edge.label) {
      edge.label.x += dx;
      edge.label.y += dy;
    }
    for (const text of [edge.startText, edge.endText]) if (text) {
      text.x += dx;
      text.y += dy;
    }
  });
  layout.lifelines = layout.lifelines.map((line) => ({ ...line, x: line.x + dx, y1: line.y1 + dy, y2: line.y2 + dy }));
  return { ...layout, width: Math.ceil(maxX - minX + OUTER * 2), height: Math.ceil(maxY - minY + OUTER * 2) };
}
