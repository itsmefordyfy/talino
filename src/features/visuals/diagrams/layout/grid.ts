import { hasCycle } from '../validate';
import type { Cardinality, ClassSpec, ErSpec, RelationType } from '../types';
import { LABEL_FONT, LINE_HEIGHT, type DiagramLayout, type LayoutEdge, type LayoutLine, type LayoutNode, type Marker, type Point } from './types';
import { normalize } from './layered';
import { CHAR_WIDTH, wrapText } from './text';

const FONT = 12;
const LINE = 16;
const GAP_X = 14;
const GAP_Y = 34;
const MIN_CARD = 140;
const MAX_CARD = 240;
const PAD = 8;
const LANE = 7;

type CardContent = { id: string; title: string; stereotype?: string; sections: { text: string; kind: 'member' | 'key' }[][] };

const CARDINALITY_TEXT: Record<Cardinality, string> = { one: '1', 'zero-or-one': '0..1', 'one-or-many': '1..n', 'zero-or-many': '0..n' };

const RELATION_MARKERS: Record<RelationType, { start: Marker; end: Marker; dashed: boolean }> = {
  inherits: { start: 'none', end: 'triangle', dashed: false },
  implements: { start: 'none', end: 'triangle', dashed: true },
  composes: { start: 'diamond-filled', end: 'none', dashed: false },
  aggregates: { start: 'diamond', end: 'none', dashed: false },
  associates: { start: 'none', end: 'arrow', dashed: false },
  depends: { start: 'none', end: 'arrow', dashed: true },
};

function buildCard(content: CardContent, width: number, index: number): LayoutNode {
  const glyph = FONT * CHAR_WIDTH;
  const chars = (width - 16) / glyph;
  const lines: LayoutLine[] = [];
  let y = 6;
  if (content.stereotype) {
    lines.push({ text: `<<${content.stereotype}>>`, x: width / 2, y: y + LINE / 2, kind: 'stereotype', align: 'center' });
    y += LINE;
  }
  for (const text of wrapText(content.title, (width - 16) / (13 * CHAR_WIDTH))) {
    lines.push({ text, x: width / 2, y: y + LINE_HEIGHT / 2, kind: 'title', align: 'center' });
    y += LINE_HEIGHT;
  }
  y += 5;
  for (const section of content.sections) {
    // An empty compartment keeps its divider, so a class box always reads as a class.
    lines.push({ text: '', x: 0, y, kind: 'divider', align: 'left' });
    y += 5;
    for (const member of section) {
      for (const [k, text] of wrapText(member.text, chars).entries()) {
        lines.push({ text: k === 0 ? text : `  ${text}`, x: 8, y: y + LINE / 2, kind: member.kind, align: 'left' });
        y += LINE;
      }
    }
    y += 3;
  }
  return { id: content.id, index, x: 0, y: 0, width, height: Math.max(40, y + 3), shape: 'card', lines };
}

type GridInput = { cards: CardContent[]; rows: string[][] | null; links: { from: string; to: string; markerStart: Marker; markerEnd: Marker; dashed: boolean; label?: string; startText?: string; endText?: string }[] };

/**
 * Class and ER diagrams: cards on a grid (parents above children for classes), joined by lines that run
 * through the gutters between rows and the lanes beside the columns, never across a card.
 */
function layoutGrid(kind: 'class' | 'er', input: GridInput, width: number): DiagramLayout {
  const avail = Math.max(MIN_CARD, width - 2 * PAD);
  // Lanes for edges that skip rows run beside the last column; leave room for a few.
  const reserve = LANE * Math.min(6, input.links.length);
  const columns = Math.max(1, Math.floor((avail - reserve + GAP_X) / (MIN_CARD + GAP_X)));
  const cardWidth = Math.max(MIN_CARD - 20, Math.min(MAX_CARD, Math.floor((avail - reserve - (columns - 1) * GAP_X) / columns)));
  const indexOf = new Map(input.cards.map((card, i) => [card.id, i] as const));
  const nodes = input.cards.map((card, i) => buildCard(card, cardWidth, i));

  // Rows: given (classes: by depth), then wrapped to the number of columns.
  const baseRows = input.rows ?? [input.cards.map((card) => card.id)];
  const rows: string[][] = [];
  for (const row of baseRows) for (let i = 0; i < row.length; i += columns) rows.push(row.slice(i, i + columns));
  const place = new Map<string, { row: number; col: number }>();
  rows.forEach((row, r) => row.forEach((id, c) => place.set(id, { row: r, col: c })));

  const rowHeight = rows.map((row) => Math.max(0, ...row.map((id) => nodes[indexOf.get(id) ?? 0].height)));
  const rowTop: number[] = [];
  let cursor = PAD;
  rows.forEach((_, r) => {
    rowTop.push(cursor);
    cursor += rowHeight[r] + GAP_Y;
  });
  const colLeft = (c: number) => PAD + c * (cardWidth + GAP_X);
  rows.forEach((row, r) =>
    row.forEach((id, c) => {
      const node = nodes[indexOf.get(id) ?? 0];
      node.x = colLeft(c);
      node.y = rowTop[r];
    }),
  );
  const gutterY = (r: number) => rowTop[r] + rowHeight[r] + GAP_Y / 2; // below row r
  const laneBase = colLeft(columns - 1) + cardWidth + 8;
  const usage = new Map<string, number>();
  const nextUsage = (key: string) => {
    const used = usage.get(key) ?? 0;
    usage.set(key, used + 1);
    return used;
  };
  const laneUse = { count: 0 };

  const edges: LayoutEdge[] = input.links.map((link, e) => {
    const a = nodes[indexOf.get(link.from) ?? 0];
    const b = nodes[indexOf.get(link.to) ?? 0];
    const pa = place.get(link.from) ?? { row: 0, col: 0 };
    const pb = place.get(link.to) ?? { row: 0, col: 0 };
    const cx = (n: LayoutNode, shift: number) => n.x + n.width / 2 + shift;
    const shiftA = ((nextUsage(`out-${link.from}`) % 5) - 2) * 6;
    const shiftB = ((nextUsage(`in-${link.to}`) % 5) - 2) * 6;
    let points: Point[];
    if (pa.row === pb.row) {
      if (Math.abs(pa.col - pb.col) === 1) {
        const y = rowTop[pa.row] + Math.min(a.height, b.height) / 2 + shiftA;
        const first: Point = { x: pa.col < pb.col ? a.x + a.width : a.x, y };
        const last: Point = { x: pa.col < pb.col ? b.x : b.x + b.width, y };
        points = [first, last];
      } else {
        const lift = rowTop[pa.row] - GAP_Y / 2 - (nextUsage(`top-${pa.row}`) % 4) * 5;
        points = [
          { x: cx(a, shiftA), y: a.y },
          { x: cx(a, shiftA), y: lift },
          { x: cx(b, shiftB), y: lift },
          { x: cx(b, shiftB), y: b.y },
        ];
      }
    } else {
      const down = pb.row > pa.row;
      const start: Point = { x: cx(a, shiftA), y: down ? a.y + a.height : a.y };
      const end: Point = { x: cx(b, shiftB), y: down ? b.y : b.y + b.height };
      const leave = down ? gutterY(pa.row) : rowTop[pa.row] - GAP_Y / 2;
      const arrive = down ? rowTop[pb.row] - GAP_Y / 2 : gutterY(pb.row);
      const slot = (nextUsage(`gut-${Math.round(leave)}`) % 4) * 4;
      if (Math.abs(pb.row - pa.row) === 1) {
        const y = (leave + arrive) / 2 + slot - 6;
        points = [start, { x: start.x, y }, { x: end.x, y }, end];
      } else {
        const lane = laneBase + (laneUse.count++ % 6) * LANE;
        points = [start, { x: start.x, y: leave + (down ? slot : -slot) }, { x: lane, y: leave + (down ? slot : -slot) }, { x: lane, y: arrive }, { x: end.x, y: arrive }, end];
      }
    }
    const second = points[1];
    const start = points[0];
    const beforeEnd = points[points.length - 2];
    const end = points[points.length - 1];
    const label = link.label
      ? (() => {
          const lines = wrapText(link.label, 18);
          const mid = points.length === 2 ? { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 } : { x: (points[1].x + points[2].x) / 2, y: (points[1].y + points[2].y) / 2 };
          return { lines, x: mid.x, y: mid.y, width: Math.ceil(Math.max(...lines.map((line) => line.length)) * LABEL_FONT * CHAR_WIDTH) + 8, height: lines.length * 15 + 2 };
        })()
      : undefined;
    const offset = (from: Point, to: Point): Point => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.hypot(dx, dy) || 1;
      return { x: from.x + (dx / len) * 12 + (dy / len) * 9, y: from.y + (dy / len) * 12 - (dx / len) * 9 };
    };
    const startAt = link.startText ? offset(start, second) : null;
    const endAt = link.endText ? offset(end, beforeEnd) : null;
    return {
      index: e,
      from: link.from,
      to: link.to,
      points,
      curve: 'polyline',
      ...(label ? { label } : {}),
      dashed: link.dashed,
      markerStart: link.markerStart,
      markerEnd: link.markerEnd,
      ...(startAt && link.startText ? { startText: { text: link.startText, ...startAt } } : {}),
      ...(endAt && link.endText ? { endText: { text: link.endText, ...endAt } } : {}),
    };
  });

  return normalize({ kind, width: 0, height: 0, needsScroll: false, fontSize: FONT, direction: null, nodes, edges, lifelines: [] });
}

/** Rows of class ids by inheritance depth: parents (and interfaces) on the first row, their children below. */
export function classRows(spec: ClassSpec): string[][] {
  const depth = new Map<string, number>(spec.classes.map((box) => [box.id, 0] as const));
  const links = spec.relations.map((relation) => {
    // The parent / whole / target sits above its child / part / source.
    if (relation.type === 'inherits' || relation.type === 'implements') return { upper: relation.to, lower: relation.from };
    if (relation.type === 'composes' || relation.type === 'aggregates') return { upper: relation.from, lower: relation.to };
    return null;
  }).filter((link): link is { upper: string; lower: string } => link !== null);
  const ids = spec.classes.map((box) => box.id);
  if (hasCycle(ids, links.map((link) => [link.upper, link.lower] as const))) return [ids];
  for (let pass = 0; pass < ids.length; pass += 1) {
    let changed = false;
    for (const link of links) {
      const want = (depth.get(link.upper) ?? 0) + 1;
      if ((depth.get(link.lower) ?? 0) < want) {
        depth.set(link.lower, want);
        changed = true;
      }
    }
    if (!changed) break;
  }
  const rows: string[][] = [];
  for (const id of ids) {
    const d = depth.get(id) ?? 0;
    (rows[d] ??= []).push(id);
  }
  return rows.filter((row) => row !== undefined);
}

export function layoutClass(spec: ClassSpec, width: number): DiagramLayout {
  const cards: CardContent[] = spec.classes.map((box) => ({
    id: box.id,
    title: box.label,
    ...(box.stereotype ? { stereotype: box.stereotype } : {}),
    sections: [(box.attributes ?? []).map((text) => ({ text, kind: 'member' as const })), (box.methods ?? []).map((text) => ({ text, kind: 'member' as const }))],
  }));
  const links = spec.relations.map((relation) => {
    const style = RELATION_MARKERS[relation.type];
    return { from: relation.from, to: relation.to, markerStart: style.start, markerEnd: style.end, dashed: style.dashed, ...(relation.label ? { label: relation.label } : {}) };
  });
  return layoutGrid('class', { cards, rows: classRows(spec), links }, width);
}

/** Entity order: breadth-first from the first entity along relationships, so related entities sit close together. */
export function erOrder(spec: ErSpec): string[] {
  const order: string[] = [];
  const seen = new Set<string>();
  for (const entity of spec.entities) {
    if (seen.has(entity.id)) continue;
    const queue = [entity.id];
    seen.add(entity.id);
    for (let head = 0; head < queue.length; head += 1) {
      const id = queue[head];
      order.push(id);
      for (const relationship of spec.relationships) {
        const other = relationship.from === id ? relationship.to : relationship.to === id ? relationship.from : null;
        if (other !== null && !seen.has(other)) {
          seen.add(other);
          queue.push(other);
        }
      }
    }
  }
  return order;
}

export function layoutEr(spec: ErSpec, width: number): DiagramLayout {
  const byId = new Map(spec.entities.map((entity) => [entity.id, entity] as const));
  const cards: CardContent[] = erOrder(spec).flatMap((id) => {
    const entity = byId.get(id);
    if (!entity) return [];
    return [
      {
        id,
        title: entity.label,
        sections: [(entity.attributes ?? []).map((attribute) => ({ text: `${attribute.key ? `${attribute.key} ` : ''}${attribute.name}${attribute.type ? `: ${attribute.type}` : ''}`, kind: attribute.key ? ('key' as const) : ('member' as const) }))],
      },
    ];
  });
  const links = spec.relationships.map((relationship) => ({
    from: relationship.from,
    to: relationship.to,
    markerStart: 'none' as Marker,
    markerEnd: 'none' as Marker,
    dashed: false,
    label: relationship.label,
    startText: CARDINALITY_TEXT[relationship.fromCardinality],
    endText: CARDINALITY_TEXT[relationship.toCardinality],
  }));
  const layout = layoutGrid('er', { cards, rows: null, links }, width);
  // Cards were placed in breadth-first order; hand the nodes back in the spec's own order.
  const position = new Map(spec.entities.map((entity, i) => [entity.id, i] as const));
  layout.nodes.sort((x, y) => (position.get(x.id) ?? 0) - (position.get(y.id) ?? 0));
  layout.nodes.forEach((node, i) => (node.index = i));
  return layout;
}
