import { describeDiagram } from './describe';
import { DIAGRAM_LIMITS, type Cardinality, type ClassBox, type ClassRelation, type DiagramEdge, type DiagramNode, type DiagramResult, type DiagramSpec, type ErAttribute, type ErEntity, type ErRelationship, type NodeShape, type SequenceMessage, type SequenceParticipant } from './types';
import { validateDiagram } from './validate';

/** Longest source text and number of lines we read; anything bigger is refused, never truncated. */
export const MERMAID_MAX_CHARS = 6000;
export const MERMAID_MAX_LINES = 200;

const SUPPORTED = 'Supported diagrams: flowchart (TD or LR), sequenceDiagram, classDiagram, erDiagram and the C4 diagrams C4Context, C4Container and C4Component.';

class MermaidError extends Error {}

function bad(line: number | null, message: string): never {
  throw new MermaidError(line === null ? message : `Line ${line}: ${message}`);
}

type Line = { no: number; text: string };

function stripQuotes(text: string): string {
  const trimmed = text.trim();
  return trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"') ? trimmed.slice(1, -1).trim() : trimmed;
}

// No hyphen in ids: it would swallow the start of an arrow in "A-->B".
const ID = '[A-Za-z0-9_]+';

/* ------------------------------- flowchart ------------------------------- */

const SHAPE_BREAK = /^(\(\[|\[\[|\{\{|\[\/|\[\\|>|\(\()/;

type NodeRef = { id: string; label?: string; shape?: NodeShape; end: number };

function closeIndex(text: string, from: number, close: string): number {
  if (text[from] === '"') {
    const quoteEnd = text.indexOf('"', from + 1);
    return quoteEnd === -1 ? -1 : text.indexOf(close, quoteEnd + 1);
  }
  return text.indexOf(close, from);
}

function readNodeRef(text: string, start: number, no: number): NodeRef {
  const match = new RegExp(`^${ID}`).exec(text.slice(start));
  if (!match) bad(no, `expected a node name but found "${text.slice(start, start + 12)}"`);
  const id = match[0];
  const at = start + id.length;
  const rest = text.slice(at);
  const open = (token: string, close: string, shape: NodeShape): NodeRef => {
    const bodyStart = at + token.length;
    const end = closeIndex(text, bodyStart, close);
    if (end === -1) bad(no, `the label of "${id}" is missing its closing "${close}"`);
    const label = stripQuotes(text.slice(bodyStart, end));
    if (label.length === 0) bad(no, `"${id}" has an empty label`);
    return { id, label, shape, end: end + close.length };
  };
  if (rest.startsWith('((')) return open('((', '))', 'circle');
  if (rest.startsWith('[(')) return open('[(', ')]', 'database');
  if (SHAPE_BREAK.test(rest)) bad(no, `the shape starting with "${rest.slice(0, 2)}" isn't supported; use [box], (rounded), {decision}, ((circle)) or [(database)]`);
  if (rest.startsWith('[')) return open('[', ']', 'box');
  if (rest.startsWith('(')) return open('(', ')', 'rounded');
  if (rest.startsWith('{')) return open('{', '}', 'diamond');
  return { id, end: at };
}

type LinkRead = { dashed: boolean; bidirectional: boolean; label?: string; end: number };

function readLink(text: string, start: number, no: number): LinkRead {
  const rest = text.slice(start);
  let consumed = 0;
  let dashed = false;
  let bidirectional = false;
  let label: string | undefined;
  const textual = /^--\s+(.+?)\s+-->/.exec(rest);
  if (textual && !/^---/.test(rest)) {
    label = stripQuotes(textual[1]);
    consumed = textual[0].length;
  } else if (rest.startsWith('<-->')) {
    bidirectional = true;
    consumed = 4;
  } else if (rest.startsWith('-.->')) {
    dashed = true;
    consumed = 4;
  } else if (rest.startsWith('==>')) {
    consumed = 3;
  } else if (rest.startsWith('-->')) {
    consumed = 3;
  } else if (/^(---|--x|--o|-\.-|===|~~~)/.test(rest)) {
    bad(no, 'only arrows are supported between nodes; use "-->" (or "-.->" for a dashed arrow)');
  } else if (rest.startsWith('&')) {
    bad(no, 'several nodes joined with "&" are not supported; write one arrow per pair');
  } else {
    bad(no, `expected an arrow like "-->" but found "${rest.slice(0, 12)}"`);
  }
  const after = rest.slice(consumed);
  const pipe = /^\s*\|([^|]*)\|/.exec(after);
  if (pipe) {
    label = stripQuotes(pipe[1]);
    consumed += pipe[0].length;
  }
  return { dashed, bidirectional, label: label && label.length > 0 ? label : undefined, end: start + consumed };
}

function parseFlowchart(lines: Line[], direction: 'TD' | 'LR'): { nodes: DiagramNode[]; edges: DiagramEdge[]; direction: 'TD' | 'LR' } {
  const nodes = new Map<string, DiagramNode>();
  const edges: DiagramEdge[] = [];
  const touch = (ref: NodeRef) => {
    const existing = nodes.get(ref.id);
    if (!existing) {
      nodes.set(ref.id, { id: ref.id, label: ref.label ?? ref.id, ...(ref.shape ? { shape: ref.shape } : {}) });
    } else if (ref.label !== undefined) {
      existing.label = ref.label;
      if (ref.shape) existing.shape = ref.shape;
    }
  };
  for (const { no, text } of lines) {
    if (/^(subgraph|end|style|classDef|class|click|linkStyle|direction|accTitle|accDescr)\b/.test(text)) bad(no, `"${text.split(/\s/)[0]}" isn't supported yet; remove it and keep just nodes and arrows`);
    for (const statement of text.split(';')) {
      const part = statement.trim();
      if (part.length === 0) continue;
      let pos = 0;
      let previous = readNodeRef(part, 0, no);
      touch(previous);
      pos = previous.end;
      for (;;) {
        while (part[pos] === ' ') pos += 1;
        if (pos >= part.length) break;
        const link = readLink(part, pos, no);
        pos = link.end;
        while (part[pos] === ' ') pos += 1;
        const next = readNodeRef(part, pos, no);
        touch(next);
        edges.push({ from: previous.id, to: next.id, ...(link.label ? { label: link.label } : {}), ...(link.dashed ? { dashed: true } : {}), ...(link.bidirectional ? { bidirectional: true } : {}) });
        previous = next;
        pos = next.end;
      }
    }
  }
  return { nodes: [...nodes.values()], edges, direction };
}

/* ------------------------------- sequence -------------------------------- */

function parseSequence(lines: Line[]): { participants: SequenceParticipant[]; messages: SequenceMessage[] } {
  const participants = new Map<string, SequenceParticipant>();
  const messages: SequenceMessage[] = [];
  const ensure = (id: string) => {
    if (!participants.has(id)) participants.set(id, { id, label: id });
  };
  for (const { no, text } of lines) {
    const declaration = new RegExp(`^(participant|actor)\\s+(${ID})(?:\\s+as\\s+(.+))?$`).exec(text);
    if (declaration) {
      const id = declaration[2];
      const label = declaration[3] ? stripQuotes(declaration[3]) : id;
      participants.set(id, { id, label, ...(declaration[1] === 'actor' ? { shape: 'actor' as const } : {}) });
      continue;
    }
    const message = new RegExp(`^(${ID})\\s*(-->>|->>)\\s*(${ID})\\s*:\\s*(.+)$`).exec(text);
    if (message) {
      ensure(message[1]);
      ensure(message[3]);
      messages.push({ from: message[1], to: message[3], label: stripQuotes(message[4]), ...(message[2] === '-->>' ? { dashed: true } : {}) });
      continue;
    }
    if (/^(Note|loop|alt|else|opt|par|and|critical|break|rect|end|activate|deactivate|autonumber|box|title|link|links|create|destroy)\b/i.test(text)) {
      bad(no, `"${text.split(/\s/)[0]}" isn't supported yet; use participants and "->>" / "-->>" messages`);
    }
    bad(no, `can't read this sequence line; write "A->>B: message" or "A-->>B: reply"`);
  }
  return { participants: [...participants.values()], messages };
}

/* --------------------------------- class --------------------------------- */

type ClassDraft = { id: string; label: string; stereotype?: string; attributes: string[]; methods: string[] };

const CLASS_RELATION = new RegExp(`^(${ID})\\s*(?:"[^"]*"\\s*)?(<\\|--|<\\|\\.\\.|\\*--|o--|--\\|>|\\.\\.\\|>|--\\*|--o|-->|\\.\\.>)\\s*(?:"[^"]*"\\s*)?(${ID})\\s*(?::\\s*(.+))?$`);

function parseClassDiagram(lines: Line[]): { classes: ClassBox[]; relations: ClassRelation[] } {
  const classes = new Map<string, ClassDraft>();
  const relations: ClassRelation[] = [];
  const ensure = (id: string): ClassDraft => {
    let draft = classes.get(id);
    if (!draft) {
      draft = { id, label: id, attributes: [], methods: [] };
      classes.set(id, draft);
    }
    return draft;
  };
  const addMember = (draft: ClassDraft, raw: string) => {
    const member = raw.trim();
    if (member.length === 0) return;
    const annotation = /^<<\s*([A-Za-z ]+?)\s*>>$/.exec(member);
    if (annotation) {
      draft.stereotype = annotation[1];
      return;
    }
    if (member.includes('(')) draft.methods.push(member);
    else draft.attributes.push(member);
  };
  let open: ClassDraft | null = null;
  for (const { no, text } of lines) {
    if (open) {
      if (text === '}') open = null;
      else addMember(open, text);
      continue;
    }
    const block = new RegExp(`^class\\s+(${ID})\\s*\\{\\s*(.*)$`).exec(text);
    if (block) {
      const draft = ensure(block[1]);
      const rest = block[2].trim();
      if (rest.endsWith('}')) addMember(draft, rest.slice(0, -1));
      else {
        open = draft;
        if (rest.length > 0) addMember(draft, rest);
      }
      continue;
    }
    const plain = new RegExp(`^class\\s+(${ID})$`).exec(text);
    if (plain) {
      ensure(plain[1]);
      continue;
    }
    const annotated = new RegExp(`^<<\\s*([A-Za-z ]+?)\\s*>>\\s+(${ID})$`).exec(text);
    if (annotated) {
      ensure(annotated[2]).stereotype = annotated[1];
      continue;
    }
    const relation = CLASS_RELATION.exec(text);
    if (relation) {
      const [, a, arrow, b, rawLabel] = relation;
      ensure(a);
      ensure(b);
      const label = rawLabel ? stripQuotes(rawLabel) : undefined;
      const extra = label ? { label } : {};
      if (arrow === '<|--') relations.push({ from: b, to: a, type: 'inherits', ...extra });
      else if (arrow === '--|>') relations.push({ from: a, to: b, type: 'inherits', ...extra });
      else if (arrow === '<|..') relations.push({ from: b, to: a, type: 'implements', ...extra });
      else if (arrow === '..|>') relations.push({ from: a, to: b, type: 'implements', ...extra });
      else if (arrow === '*--') relations.push({ from: a, to: b, type: 'composes', ...extra });
      else if (arrow === '--*') relations.push({ from: b, to: a, type: 'composes', ...extra });
      else if (arrow === 'o--') relations.push({ from: a, to: b, type: 'aggregates', ...extra });
      else if (arrow === '--o') relations.push({ from: b, to: a, type: 'aggregates', ...extra });
      else if (arrow === '-->') relations.push({ from: a, to: b, type: 'associates', ...extra });
      else relations.push({ from: a, to: b, type: 'depends', ...extra });
      continue;
    }
    const member = new RegExp(`^(${ID})\\s*:\\s*(.+)$`).exec(text);
    if (member) {
      addMember(ensure(member[1]), member[2]);
      continue;
    }
    bad(no, `can't read this class line; use "class X", "X : +member", or a relation such as "Animal <|-- Dog"`);
  }
  if (open) bad(null, `the class "${open.id}" block is missing its closing "}"`);
  const boxes: ClassBox[] = [...classes.values()].map((draft) => ({
    id: draft.id,
    label: draft.label,
    ...(draft.stereotype ? { stereotype: draft.stereotype } : {}),
    ...(draft.attributes.length > 0 ? { attributes: draft.attributes } : {}),
    ...(draft.methods.length > 0 ? { methods: draft.methods } : {}),
  }));
  return { classes: boxes, relations };
}

/* ----------------------------------- ER ---------------------------------- */

const LEFT_CARDINALITY: Record<string, Cardinality> = { '||': 'one', '|o': 'zero-or-one', '}o': 'zero-or-many', '}|': 'one-or-many' };
const RIGHT_CARDINALITY: Record<string, Cardinality> = { '||': 'one', 'o|': 'zero-or-one', 'o{': 'zero-or-many', '|{': 'one-or-many' };
const ER_RELATIONSHIP = new RegExp(`^(${ID})\\s+(\\|\\||\\|o|\\}o|\\}\\|)(--|\\.\\.)(\\|\\||o\\||o\\{|\\|\\{)\\s+(${ID})\\s*:\\s*(.+)$`);

function parseEr(lines: Line[]): { entities: ErEntity[]; relationships: ErRelationship[] } {
  const entities = new Map<string, ErEntity>();
  const relationships: ErRelationship[] = [];
  const ensure = (id: string): ErEntity => {
    let entity = entities.get(id);
    if (!entity) {
      entity = { id, label: id, attributes: [] };
      entities.set(id, entity);
    }
    return entity;
  };
  let open: ErEntity | null = null;
  for (const { no, text } of lines) {
    if (open) {
      if (text === '}') {
        open = null;
        continue;
      }
      const parts = /^(\S+)\s+(\S+)(?:\s+(.*))?$/.exec(text);
      if (!parts) bad(no, `can't read this attribute; write "type name" with an optional PK or FK`);
      const keys = (parts[3] ?? '').replace(/"[^"]*"/g, '').split(/[\s,]+/);
      const key = keys.includes('PK') ? 'PK' : keys.includes('FK') ? 'FK' : undefined;
      const attribute: ErAttribute = { name: parts[2], type: parts[1], ...(key ? { key } : {}) };
      (open.attributes ?? []).push(attribute);
      continue;
    }
    const block = new RegExp(`^(${ID})\\s*\\{\\s*$`).exec(text);
    if (block) {
      open = ensure(block[1]);
      continue;
    }
    const relationship = ER_RELATIONSHIP.exec(text);
    if (relationship) {
      const [, from, left, , right, to, label] = relationship;
      ensure(from);
      ensure(to);
      relationships.push({ from, to, fromCardinality: LEFT_CARDINALITY[left], toCardinality: RIGHT_CARDINALITY[right], label: stripQuotes(label) });
      continue;
    }
    if (new RegExp(`^${ID}$`).test(text)) {
      ensure(text);
      continue;
    }
    bad(no, `can't read this line; use "A ||--o{ B : has" or "A { type name PK }"`);
  }
  if (open) bad(null, `the entity "${open.id}" block is missing its closing "}"`);
  return { entities: [...entities.values()], relationships };
}


/* ----------------------------------- C4 ---------------------------------- */

const C4_ELEMENT = new RegExp(`^(Person|Person_Ext|System|System_Ext|SystemDb|SystemDb_Ext|Container|Container_Ext|ContainerDb|ContainerDb_Ext|Component|Component_Ext|ComponentDb|ComponentDb_Ext)\\s*\\((.*)\\)$`);
const C4_BOUNDARY = new RegExp(`^(Boundary|Enterprise_Boundary|System_Boundary|Container_Boundary)\\s*\\((.*)\\)\\s*\\{$`);
const C4_REL = new RegExp(`^(Rel|BiRel|Rel_U|Rel_D|Rel_L|Rel_R)\\s*\\((.*)\\)$`);
const C4_IGNORED = /^(UpdateLayoutConfig|UpdateElementStyle|UpdateRelStyle|LAYOUT_[A-Z_]+|SHOW_LEGEND|HIDE_STEREOTYPE)\b/;

/** Splits the arguments of a C4 call on commas that are not inside double quotes; each is unquoted and trimmed. */
function splitC4Args(text: string, no: number): string[] {
  const args: string[] = [];
  let current = '';
  let quoted = false;
  for (const char of text) {
    if (char === '"') quoted = !quoted;
    if (char === ',' && !quoted) {
      args.push(stripQuotes(current));
      current = '';
    } else current += char;
  }
  if (quoted) bad(no, 'a quote is not closed');
  args.push(stripQuotes(current));
  return args.filter((arg, index) => !(index === args.length - 1 && arg === '' && args.length > 1));
}

function parseC4(lines: Line[], keyword: string): { nodes: DiagramNode[]; edges: DiagramEdge[]; title?: string } {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  const boundaries: string[] = [];
  let title: string | undefined;
  for (const { no, text } of lines) {
    if (C4_IGNORED.test(text)) continue;
    const titled = /^title\s+(.+)$/i.exec(text);
    if (titled) {
      title = stripQuotes(titled[1]);
      continue;
    }
    if (text === '}') {
      if (boundaries.length === 0) bad(no, 'a "}" closes nothing; there is no open boundary');
      boundaries.pop();
      continue;
    }
    const boundary = C4_BOUNDARY.exec(text);
    if (boundary) {
      const args = splitC4Args(boundary[2], no);
      if (args.length < 2 || !new RegExp(`^${ID}$`).test(args[0])) bad(no, 'a boundary needs an id and a label: System_Boundary(id, "Label") {');
      boundaries.push(cut(args[1], DIAGRAM_LIMITS.maxGroup));
      continue;
    }
    const element = C4_ELEMENT.exec(text);
    if (element) {
      const kind = element[1];
      const args = splitC4Args(element[2], no);
      if (args.length < 2 || !new RegExp(`^${ID}$`).test(args[0])) bad(no, `${kind} needs an id and a label, for example ${kind}(id, "Label", "Description")`);
      const person = kind.startsWith('Person');
      const technical = kind.startsWith('Container') || kind.startsWith('Component');
      const technology = technical ? args[2] : undefined;
      const description = technical ? args[3] : args[2];
      const note = [technology ? `[${technology}]` : '', description ?? ''].filter(Boolean).join(' ');
      const external = kind.endsWith('_Ext');
      const group = boundaries.length > 0 ? boundaries[boundaries.length - 1] : external ? 'External' : person ? 'People' : undefined;
      nodes.push({
        id: args[0],
        label: cut(args[1], DIAGRAM_LIMITS.maxLabel),
        shape: person ? 'actor' : kind.includes('Db') ? 'database' : 'box',
        ...(note ? { note: cut(note, DIAGRAM_LIMITS.maxNote) } : {}),
        ...(group ? { group } : {}),
      });
      continue;
    }
    const rel = C4_REL.exec(text);
    if (rel) {
      const args = splitC4Args(rel[2], no);
      if (args.length < 3) bad(no, `${rel[1]} needs two ids and a label, for example ${rel[1]}(from, to, "What it does")`);
      const label = args[3] ? `${args[2]} (${args[3]})` : args[2];
      edges.push({ from: args[0], to: args[1], label: cut(label, DIAGRAM_LIMITS.maxLabel), ...(rel[1] === 'BiRel' ? { bidirectional: true } : {}) });
      continue;
    }
    if (/^(Rel_Back|Rel_Neighbor|RelIndex|Lay_|Deployment_Node|Node)/.test(text)) bad(no, `"${text.split(/[\s(]/)[0]}" isn't supported yet; use Person, System, Container, Component, a Boundary and Rel`);
    bad(no, `can't read this ${keyword} line; write something like System(id, "Name", "What it does") or Rel(a, b, "Uses")`);
  }
  if (boundaries.length > 0) bad(null, 'a boundary is missing its closing "}"');
  return { nodes, edges, title };
}

/* --------------------------------- entry --------------------------------- */

export type MermaidOptions = { title?: string; summary?: string };

function cut(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Reads a safe subset of Mermaid into a `DiagramSpec`: `flowchart TD|LR` (nodes `A[Box]`, `(Rounded)`,
 * `{Decision}`, `((Circle))`, `[(Database)]`, arrows `-->`, `-.->`, `-->|label|`), `sequenceDiagram`
 * (`participant`, `->>`, `-->>`), `classDiagram` (`class`, members, `<|--`, `*--`, `o--`, `-->`, `..>`,
 * `..|>`), `erDiagram` (`A ||--o{ B : has`, attribute blocks) and the C4 views `C4Context`, `C4Container` and `C4Component`
 * (`Person`, `System`, `Container`, `Component` and their `_Ext` / `Db` forms, `System_Boundary(id, "Name") { }`, `Rel`, `BiRel`; drawn as an
 * architecture diagram, the boundary or External/People becoming the colour group). The text is only ever parsed, never
 * evaluated; anything else is a friendly error. The result is checked by `validateDiagram` as well.
 */
export function parseMermaidSubset(text: string, options: MermaidOptions = {}): DiagramResult {
  try {
    if (typeof text !== 'string') return { ok: false, errors: ['The diagram text must be a string'] };
    if (text.length > MERMAID_MAX_CHARS) return { ok: false, errors: [`The diagram text is too long (more than ${MERMAID_MAX_CHARS} characters)`] };
    let source = text.replace(/\r\n?/g, '\n');
    let frontTitle: string | undefined;
    const front = /^\s*---\n([\s\S]*?)\n---\n/.exec(source);
    if (front) {
      const titleLine = /^title:\s*(.+)$/m.exec(front[1]);
      frontTitle = titleLine ? stripQuotes(titleLine[1]) : undefined;
      source = source.slice(front[0].length);
    }
    const rawLines = source.split('\n');
    if (rawLines.length > MERMAID_MAX_LINES) return { ok: false, errors: [`The diagram text has too many lines (the limit is ${MERMAID_MAX_LINES})`] };
    const lines: Line[] = [];
    rawLines.forEach((raw, index) => {
      const cleaned = raw.replace(/(^|\s)%%.*$/, '').trim();
      if (cleaned.length > 0) lines.push({ no: index + 1, text: cleaned });
    });
    const header = lines.shift();
    if (!header) return { ok: false, errors: [`The diagram is empty. ${SUPPORTED}`] };
    const heading = header.text.split(/\s+/);
    const keyword = heading[0].toLowerCase();
    let draft: DiagramSpec;
    const title = options.title ?? frontTitle;
    const placeholder = { summary: 'placeholder' };
    if (keyword === 'flowchart' || keyword === 'graph') {
      const dir = (heading[1] ?? 'TD').toUpperCase();
      if (dir !== 'TD' && dir !== 'TB' && dir !== 'LR') bad(header.no, `the direction "${heading[1]}" isn't supported; use TD (top to bottom) or LR (left to right)`);
      if (heading.length > 2) bad(header.no, `unexpected text after the direction: "${heading.slice(2).join(' ')}"`);
      const parsed = parseFlowchart(lines, dir === 'LR' ? 'LR' : 'TD');
      draft = { kind: 'flow', title: title ?? 'Flowchart', ...placeholder, direction: parsed.direction, nodes: parsed.nodes, edges: parsed.edges };
    } else if (keyword === 'sequencediagram' && heading.length === 1) {
      draft = { kind: 'sequence', title: title ?? 'Sequence diagram', ...placeholder, ...parseSequence(lines) };
    } else if (keyword === 'classdiagram' && heading.length === 1) {
      draft = { kind: 'class', title: title ?? 'Class diagram', ...placeholder, ...parseClassDiagram(lines) };
    } else if ((keyword === 'c4context' || keyword === 'c4container' || keyword === 'c4component') && heading.length === 1) {
      const parsed = parseC4(lines, heading[0]);
      draft = { kind: 'architecture', title: title ?? parsed.title ?? 'C4 diagram', ...placeholder, direction: 'TD', nodes: parsed.nodes, edges: parsed.edges };
    } else if (keyword === 'erdiagram' && heading.length === 1) {
      draft = { kind: 'er', title: title ?? 'Entity relationship diagram', ...placeholder, ...parseEr(lines) };
    } else {
      bad(header.no, `"${cut(header.text, 30)}" isn't a supported diagram type. ${SUPPORTED}`);
    }
    // The summary is generated from the structure unless the caller gives one.
    const described = options.summary ?? cut(describeDiagram(draft), DIAGRAM_LIMITS.maxSummary);
    return validateDiagram({ ...draft, summary: described });
  } catch (error) {
    if (error instanceof MermaidError) return { ok: false, errors: [error.message] };
    return { ok: false, errors: ['The diagram text could not be read'] };
  }
}
