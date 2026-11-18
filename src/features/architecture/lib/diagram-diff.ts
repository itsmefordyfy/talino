import { parseMermaidSubset, type DiagramKind, type DiagramSpec } from '@/features/visuals/diagrams';

/** A part of a diagram (a node, participant, class or entity) by id. */
export type DiffNode = { id: string; label: string };
/** An arrow (an edge, message, relation or relationship) with the words on it ('' when it has none). */
export type DiffArrow = { from: string; to: string; label: string };

export type DiagramDiff =
  | {
      comparable: true;
      /** Nothing was added, removed or relabelled. */
      identical: boolean;
      nodes: { added: DiffNode[]; removed: DiffNode[]; relabelled: { id: string; before: string; after: string }[] };
      arrows: { added: DiffArrow[]; removed: DiffArrow[]; relabelled: { from: string; to: string; before: string; after: string }[] };
    }
  | { comparable: false; kindA: DiagramKind; kindB: DiagramKind };

type Parts = { nodes: Map<string, string>; arrows: Map<string, DiffArrow> };

/** A flowchart and a C4 view are both drawn as nodes and arrows, so they can be compared; the other kinds only with their own kind. */
const family = (kind: DiagramKind) => (kind === 'flow' || kind === 'architecture' ? 'graph' : kind);

/**
 * Arrows are matched by what they connect, in that direction. A pair that appears more than once (a sequence diagram repeats messages) is matched
 * by its n-th appearance, so adding a second call between the same two parts shows as one added arrow, not a change to the first.
 */
function arrowMap(arrows: readonly DiffArrow[]): Map<string, DiffArrow> {
  const seen = new Map<string, number>();
  const map = new Map<string, DiffArrow>();
  for (const arrow of arrows) {
    const base = `${arrow.from}>${arrow.to}`;
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    map.set(`${base}#${count}`, arrow);
  }
  return map;
}

function partsOf(spec: DiagramSpec): Parts {
  switch (spec.kind) {
    case 'flow':
    case 'architecture':
      return { nodes: new Map(spec.nodes.map((node) => [node.id, node.label])), arrows: arrowMap(spec.edges.map((edge) => ({ from: edge.from, to: edge.to, label: edge.label ?? '' }))) };
    case 'sequence':
      return { nodes: new Map(spec.participants.map((p) => [p.id, p.label])), arrows: arrowMap(spec.messages.map((m) => ({ from: m.from, to: m.to, label: m.label }))) };
    case 'class':
      return { nodes: new Map(spec.classes.map((box) => [box.id, box.label])), arrows: arrowMap(spec.relations.map((r) => ({ from: r.from, to: r.to, label: r.label ?? r.type }))) };
    case 'er':
      return { nodes: new Map(spec.entities.map((entity) => [entity.id, entity.label])), arrows: arrowMap(spec.relationships.map((r) => ({ from: r.from, to: r.to, label: r.label }))) };
  }
}

/**
 * What changed from diagram `a` (before) to `b` (after): parts and arrows added, removed or relabelled, matched by id. A moved or restyled part is not a change;
 * only what the diagram says is. Diagrams of different families (a sequence and an ER diagram, say) are not compared.
 */
export function diffDiagrams(a: DiagramSpec, b: DiagramSpec): DiagramDiff {
  if (family(a.kind) !== family(b.kind)) return { comparable: false, kindA: a.kind, kindB: b.kind };
  const before = partsOf(a);
  const after = partsOf(b);

  const nodes: Extract<DiagramDiff, { comparable: true }>['nodes'] = { added: [], removed: [], relabelled: [] };
  for (const [id, label] of after.nodes) {
    const old = before.nodes.get(id);
    if (old === undefined) nodes.added.push({ id, label });
    else if (old !== label) nodes.relabelled.push({ id, before: old, after: label });
  }
  for (const [id, label] of before.nodes) if (!after.nodes.has(id)) nodes.removed.push({ id, label });

  const arrows: Extract<DiagramDiff, { comparable: true }>['arrows'] = { added: [], removed: [], relabelled: [] };
  for (const [key, arrow] of after.arrows) {
    const old = before.arrows.get(key);
    if (!old) arrows.added.push(arrow);
    else if (old.label !== arrow.label) arrows.relabelled.push({ from: arrow.from, to: arrow.to, before: old.label, after: arrow.label });
  }
  for (const [key, arrow] of before.arrows) if (!after.arrows.has(key)) arrows.removed.push(arrow);

  const identical = [nodes.added, nodes.removed, nodes.relabelled, arrows.added, arrows.removed, arrows.relabelled].every((list) => list.length === 0);
  return { comparable: true, identical, nodes, arrows };
}

export type SourceDiff = { ok: true; diff: DiagramDiff } | { ok: false; side: 'a' | 'b'; errors: string[] };

/** Parses two Mermaid sources and compares them; the first one that does not parse is reported with the parser's own messages. */
export function diffSources(a: string, b: string): SourceDiff {
  const first = parseMermaidSubset(a);
  if (!first.ok) return { ok: false, side: 'a', errors: first.errors };
  const second = parseMermaidSubset(b);
  if (!second.ok) return { ok: false, side: 'b', errors: second.errors };
  return { ok: true, diff: diffDiagrams(first.spec, second.spec) };
}
