import {
  CARDINALITIES,
  DIAGRAM_ID_PATTERN,
  DIAGRAM_KINDS,
  DIAGRAM_LIMITS,
  NODE_SHAPES,
  RELATION_TYPES,
  type Cardinality,
  type ClassBox,
  type ClassRelation,
  type DiagramEdge,
  type DiagramNode,
  type DiagramResult,
  type DiagramSpec,
  type ErAttribute,
  type ErEntity,
  type ErRelationship,
  type NodeShape,
  type RelationType,
  type SequenceMessage,
  type SequenceParticipant,
} from './types';

const MAX_ERRORS = 20;
const LIMITS = DIAGRAM_LIMITS;

/** Control characters, line breaks and bidirectional overrides: never allowed in a label. */
const FORBIDDEN_CHARS = /[\u0000-\u001F\u007F-\u009F\u2028\u2029\u202A-\u202E\u2066-\u2069]/;
/** Markup or script-looking text. Labels are drawn as plain text, so this is defence in depth, not the only guard. */
const MARKUP = /<\s*\/|<\s*!|<\s*(script|style|iframe|img|svg|a|b|i|u|div|span|p|br|link|object|embed|form|input|button|html|body|meta|math|video|audio)\b|\b(javascript|vbscript)\s*:|\bdata:(text|image|application)\//i;

type Ctx = { errors: string[] };

function fail(ctx: Ctx, message: string) {
  if (ctx.errors.length < MAX_ERRORS) ctx.errors.push(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Reads a plain-text string; reports and returns undefined when it is missing (if required), too long, or unsafe. */
function readText(ctx: Ctx, value: unknown, path: string, max: number, required: boolean): string | undefined {
  if (value === undefined || value === null) {
    if (required) fail(ctx, `${path} is required`);
    return undefined;
  }
  if (typeof value !== 'string') {
    fail(ctx, `${path} must be a string`);
    return undefined;
  }
  const text = value.trim();
  if (text.length === 0) {
    if (required) fail(ctx, `${path} must not be empty`);
    return undefined;
  }
  if (text.length > max) {
    fail(ctx, `${path} is too long (${text.length} characters, the limit is ${max})`);
    return undefined;
  }
  if (FORBIDDEN_CHARS.test(text)) {
    fail(ctx, `${path} must be a single line of plain text (no control characters)`);
    return undefined;
  }
  if (MARKUP.test(text)) {
    fail(ctx, `${path} looks like HTML or script; only plain text is allowed`);
    return undefined;
  }
  return text;
}

function readId(ctx: Ctx, value: unknown, path: string): string | undefined {
  if (typeof value !== 'string' || !DIAGRAM_ID_PATTERN.test(value)) {
    fail(ctx, `${path} must be 1 to 32 letters, digits, "_" or "-"${typeof value === 'string' ? ` (got "${value.slice(0, 40)}")` : ''}`);
    return undefined;
  }
  return value;
}

function readList(ctx: Ctx, value: unknown, path: string, max: number, min: number): unknown[] {
  if (value === undefined && min === 0) return [];
  if (!Array.isArray(value)) {
    fail(ctx, `${path} must be a list`);
    return [];
  }
  if (value.length < min) fail(ctx, `${path} needs at least ${min} item${min === 1 ? '' : 's'}`);
  if (value.length > max) {
    fail(ctx, `${path} has too many items (${value.length}, the limit is ${max})`);
    return [];
  }
  return value;
}

function readBool(ctx: Ctx, value: unknown, path: string): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'boolean') {
    fail(ctx, `${path} must be true or false`);
    return undefined;
  }
  return value;
}

function readShape(ctx: Ctx, value: unknown, path: string): NodeShape | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || !(NODE_SHAPES as readonly string[]).includes(value)) {
    fail(ctx, `${path} must be one of ${NODE_SHAPES.join(', ')}`);
    return undefined;
  }
  return value as NodeShape;
}

/** Ids collected with a Map/Set, never an object, so an id like "__proto__" is just a string. */
function collectIds(ctx: Ctx, items: unknown[], path: string, label: string): Set<string> {
  const ids = new Set<string>();
  items.forEach((item, index) => {
    // Invalid ids are reported when the item itself is read; only duplicates are reported here.
    const id = isRecord(item) && typeof item.id === 'string' && DIAGRAM_ID_PATTERN.test(item.id) ? item.id : undefined;
    if (id === undefined) return;
    if (ids.has(id)) fail(ctx, `${path}[${index}].id "${id}" is used twice; every ${label} needs its own id`);
    ids.add(id);
  });
  return ids;
}

function readEndpoint(ctx: Ctx, value: unknown, ids: ReadonlySet<string>, path: string, noun: string): string | undefined {
  if (typeof value !== 'string' || !DIAGRAM_ID_PATTERN.test(value)) {
    fail(ctx, `${path} must be the id of a ${noun}`);
    return undefined;
  }
  if (!ids.has(value)) {
    fail(ctx, `${path} "${value}" does not match any ${noun} id`);
    return undefined;
  }
  return value;
}

function withDefined<T extends object>(value: T): T {
  const out: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) if (entry !== undefined) out[key] = entry;
  return out as T;
}

function readNodes(ctx: Ctx, list: unknown[], path: string, group: boolean): DiagramNode[] {
  const nodes: DiagramNode[] = [];
  list.forEach((item, index) => {
    const at = `${path}[${index}]`;
    if (!isRecord(item)) return fail(ctx, `${at} must be an object`);
    const id = readId(ctx, item.id, `${at}.id`);
    const label = readText(ctx, item.label, `${at}.label`, LIMITS.maxLabel, true);
    const shape = readShape(ctx, item.shape, `${at}.shape`);
    const note = readText(ctx, item.note, `${at}.note`, LIMITS.maxNote, false);
    const groupName = group ? readText(ctx, item.group, `${at}.group`, LIMITS.maxGroup, false) : undefined;
    if (id !== undefined && label !== undefined) nodes.push(withDefined({ id, label, shape, note, group: groupName }));
  });
  return nodes;
}

function readEdges(ctx: Ctx, list: unknown[], ids: ReadonlySet<string>, path: string): DiagramEdge[] {
  const edges: DiagramEdge[] = [];
  const seen = new Set<string>();
  list.forEach((item, index) => {
    const at = `${path}[${index}]`;
    if (!isRecord(item)) return fail(ctx, `${at} must be an object`);
    const from = readEndpoint(ctx, item.from, ids, `${at}.from`, 'node');
    const to = readEndpoint(ctx, item.to, ids, `${at}.to`, 'node');
    const label = readText(ctx, item.label, `${at}.label`, LIMITS.maxLabel, false);
    const dashed = readBool(ctx, item.dashed, `${at}.dashed`);
    const bidirectional = readBool(ctx, item.bidirectional, `${at}.bidirectional`);
    if (from === undefined || to === undefined) return;
    if (from === to) return fail(ctx, `${at} points from "${from}" to itself; self-loops are not supported`);
    const key = `${from}\u0000${to}`;
    if (seen.has(key)) return fail(ctx, `${at} repeats the arrow from "${from}" to "${to}"`);
    seen.add(key);
    edges.push(withDefined({ from, to, label, dashed, bidirectional }));
  });
  return edges;
}

function readFlow(ctx: Ctx, input: Record<string, unknown>, kind: 'flow' | 'architecture', title: string | undefined, summary: string | undefined): DiagramSpec | null {
  const list = readList(ctx, input.nodes, 'nodes', LIMITS.maxNodes, 1);
  const ids = collectIds(ctx, list, 'nodes', 'node');
  const nodes = readNodes(ctx, list, 'nodes', true);
  const edgeList = readList(ctx, input.edges, 'edges', LIMITS.maxEdges, 0);
  const edges = readEdges(ctx, edgeList, ids, 'edges');
  let direction: 'TD' | 'LR' | undefined;
  if (input.direction !== undefined) {
    if (input.direction === 'TD' || input.direction === 'LR') direction = input.direction;
    else fail(ctx, 'direction must be "TD" (top to bottom) or "LR" (left to right)');
  }
  if (ctx.errors.length > 0 || title === undefined || summary === undefined) return null;
  return withDefined({ kind, title, summary, direction, nodes, edges });
}

function readSequence(ctx: Ctx, input: Record<string, unknown>, title: string | undefined, summary: string | undefined): DiagramSpec | null {
  const list = readList(ctx, input.participants, 'participants', LIMITS.maxNodes, 1);
  const ids = collectIds(ctx, list, 'participants', 'participant');
  const participants: SequenceParticipant[] = [];
  list.forEach((item, index) => {
    const at = `participants[${index}]`;
    if (!isRecord(item)) return fail(ctx, `${at} must be an object`);
    const id = readId(ctx, item.id, `${at}.id`);
    const label = readText(ctx, item.label, `${at}.label`, LIMITS.maxLabel, true);
    const shape = readShape(ctx, item.shape, `${at}.shape`);
    const note = readText(ctx, item.note, `${at}.note`, LIMITS.maxNote, false);
    if (id !== undefined && label !== undefined) participants.push(withDefined({ id, label, shape, note }));
  });
  const messageList = readList(ctx, input.messages, 'messages', LIMITS.maxEdges, 1);
  const messages: SequenceMessage[] = [];
  messageList.forEach((item, index) => {
    const at = `messages[${index}]`;
    if (!isRecord(item)) return fail(ctx, `${at} must be an object`);
    const from = readEndpoint(ctx, item.from, ids, `${at}.from`, 'participant');
    const to = readEndpoint(ctx, item.to, ids, `${at}.to`, 'participant');
    const label = readText(ctx, item.label, `${at}.label`, LIMITS.maxLabel, true);
    const dashed = readBool(ctx, item.dashed, `${at}.dashed`);
    const note = readText(ctx, item.note, `${at}.note`, LIMITS.maxNote, false);
    if (from !== undefined && to !== undefined && label !== undefined) messages.push(withDefined({ from, to, label, dashed, note }));
  });
  if (ctx.errors.length > 0 || title === undefined || summary === undefined) return null;
  return { kind: 'sequence', title, summary, participants, messages };
}

function readMembers(ctx: Ctx, value: unknown, path: string): string[] | undefined {
  if (value === undefined) return undefined;
  const list = readList(ctx, value, path, LIMITS.maxMembers, 0);
  const out: string[] = [];
  list.forEach((item, index) => {
    const text = readText(ctx, item, `${path}[${index}]`, LIMITS.maxMember, true);
    if (text !== undefined) out.push(text);
  });
  return out;
}

/** True when following `from -> to` edges revisits a node (a parent that is its own descendant). */
export function hasCycle(ids: readonly string[], edges: readonly (readonly [string, string])[]): boolean {
  const next = new Map<string, string[]>();
  for (const [from, to] of edges) next.set(from, [...(next.get(from) ?? []), to]);
  const state = new Map<string, 1 | 2>();
  const visit = (id: string): boolean => {
    state.set(id, 1);
    for (const to of next.get(id) ?? []) {
      const seen = state.get(to);
      if (seen === 1) return true;
      if (seen === undefined && visit(to)) return true;
    }
    state.set(id, 2);
    return false;
  };
  return ids.some((id) => state.get(id) === undefined && visit(id));
}

function readClass(ctx: Ctx, input: Record<string, unknown>, title: string | undefined, summary: string | undefined): DiagramSpec | null {
  const list = readList(ctx, input.classes, 'classes', LIMITS.maxNodes, 1);
  const ids = collectIds(ctx, list, 'classes', 'class');
  const classes: ClassBox[] = [];
  list.forEach((item, index) => {
    const at = `classes[${index}]`;
    if (!isRecord(item)) return fail(ctx, `${at} must be an object`);
    const id = readId(ctx, item.id, `${at}.id`);
    const label = readText(ctx, item.label, `${at}.label`, LIMITS.maxLabel, true);
    const stereotype = readText(ctx, item.stereotype, `${at}.stereotype`, 20, false);
    const attributes = readMembers(ctx, item.attributes, `${at}.attributes`);
    const methods = readMembers(ctx, item.methods, `${at}.methods`);
    const note = readText(ctx, item.note, `${at}.note`, LIMITS.maxNote, false);
    if (id !== undefined && label !== undefined) classes.push(withDefined({ id, label, stereotype, attributes, methods, note }));
  });
  const relationList = readList(ctx, input.relations, 'relations', LIMITS.maxEdges, 0);
  const relations: ClassRelation[] = [];
  const seen = new Set<string>();
  relationList.forEach((item, index) => {
    const at = `relations[${index}]`;
    if (!isRecord(item)) return fail(ctx, `${at} must be an object`);
    const from = readEndpoint(ctx, item.from, ids, `${at}.from`, 'class');
    const to = readEndpoint(ctx, item.to, ids, `${at}.to`, 'class');
    const label = readText(ctx, item.label, `${at}.label`, LIMITS.maxLabel, false);
    let type: RelationType | undefined;
    if (typeof item.type === 'string' && (RELATION_TYPES as readonly string[]).includes(item.type)) type = item.type as RelationType;
    else fail(ctx, `${at}.type must be one of ${RELATION_TYPES.join(', ')}`);
    if (from === undefined || to === undefined || type === undefined) return;
    if (from === to) return fail(ctx, `${at} relates "${from}" to itself; show that as an attribute instead`);
    const key = `${from}\u0000${to}\u0000${type}`;
    if (seen.has(key)) return fail(ctx, `${at} repeats the same "${type}" relation`);
    seen.add(key);
    relations.push(withDefined({ from, to, type, label }));
  });
  const parents = relations.filter((relation) => relation.type === 'inherits' || relation.type === 'implements').map((relation) => [relation.from, relation.to] as const);
  if (hasCycle(classes.map((box) => box.id), parents)) fail(ctx, 'inheritance forms a loop: a class cannot (even indirectly) inherit from itself');
  if (ctx.errors.length > 0 || title === undefined || summary === undefined) return null;
  return { kind: 'class', title, summary, classes, relations };
}

function readCardinality(ctx: Ctx, value: unknown, path: string): Cardinality | undefined {
  if (typeof value === 'string' && (CARDINALITIES as readonly string[]).includes(value)) return value as Cardinality;
  fail(ctx, `${path} must be one of ${CARDINALITIES.join(', ')}`);
  return undefined;
}

function readEr(ctx: Ctx, input: Record<string, unknown>, title: string | undefined, summary: string | undefined): DiagramSpec | null {
  const list = readList(ctx, input.entities, 'entities', LIMITS.maxNodes, 1);
  const ids = collectIds(ctx, list, 'entities', 'entity');
  const entities: ErEntity[] = [];
  list.forEach((item, index) => {
    const at = `entities[${index}]`;
    if (!isRecord(item)) return fail(ctx, `${at} must be an object`);
    const id = readId(ctx, item.id, `${at}.id`);
    const label = readText(ctx, item.label, `${at}.label`, LIMITS.maxLabel, true);
    const note = readText(ctx, item.note, `${at}.note`, LIMITS.maxNote, false);
    const attributeList = readList(ctx, item.attributes, `${at}.attributes`, LIMITS.maxMembers, 0);
    const attributes: ErAttribute[] = [];
    attributeList.forEach((attribute, position) => {
      const where = `${at}.attributes[${position}]`;
      if (!isRecord(attribute)) return fail(ctx, `${where} must be an object`);
      const name = readText(ctx, attribute.name, `${where}.name`, 40, true);
      const type = readText(ctx, attribute.type, `${where}.type`, 30, false);
      let key: 'PK' | 'FK' | undefined;
      if (attribute.key !== undefined) {
        if (attribute.key === 'PK' || attribute.key === 'FK') key = attribute.key;
        else fail(ctx, `${where}.key must be "PK" or "FK"`);
      }
      if (name !== undefined) attributes.push(withDefined({ name, type, key }));
    });
    if (id !== undefined && label !== undefined) entities.push(withDefined({ id, label, attributes, note }));
  });
  const relationshipList = readList(ctx, input.relationships, 'relationships', LIMITS.maxEdges, 0);
  const relationships: ErRelationship[] = [];
  const seen = new Set<string>();
  relationshipList.forEach((item, index) => {
    const at = `relationships[${index}]`;
    if (!isRecord(item)) return fail(ctx, `${at} must be an object`);
    const from = readEndpoint(ctx, item.from, ids, `${at}.from`, 'entity');
    const to = readEndpoint(ctx, item.to, ids, `${at}.to`, 'entity');
    const fromCardinality = readCardinality(ctx, item.fromCardinality, `${at}.fromCardinality`);
    const toCardinality = readCardinality(ctx, item.toCardinality, `${at}.toCardinality`);
    const label = readText(ctx, item.label, `${at}.label`, LIMITS.maxLabel, true);
    if (from === undefined || to === undefined || fromCardinality === undefined || toCardinality === undefined || label === undefined) return;
    if (from === to) return fail(ctx, `${at} relates "${from}" to itself; self-relationships are not supported`);
    const key = [from, to].sort().join('\u0000');
    if (seen.has(key)) return fail(ctx, `${at} repeats the relationship between "${from}" and "${to}"`);
    seen.add(key);
    relationships.push({ from, to, fromCardinality, toCardinality, label });
  });
  if (ctx.errors.length > 0 || title === undefined || summary === undefined) return null;
  return { kind: 'er', title, summary, entities, relationships };
}

/**
 * Checks untrusted data (an AI answer, a lesson's JSON) and returns a clean, normalized `DiagramSpec`
 * or a list of plain-English errors. Never throws; unknown properties are dropped, never copied.
 */
export function validateDiagram(input: unknown): DiagramResult {
  const ctx: Ctx = { errors: [] };
  try {
    if (!isRecord(input)) return { ok: false, errors: ['The diagram must be an object with a kind, title, summary and its parts'] };
    const kind = input.kind;
    if (typeof kind !== 'string' || !(DIAGRAM_KINDS as readonly string[]).includes(kind)) {
      fail(ctx, `kind must be one of ${DIAGRAM_KINDS.join(', ')}`);
    }
    const title = readText(ctx, input.title, 'title', LIMITS.maxTitle, true);
    const summary = readText(ctx, input.summary, 'summary', LIMITS.maxSummary, true);
    let spec: DiagramSpec | null = null;
    switch (kind) {
      case 'flow':
      case 'architecture':
        spec = readFlow(ctx, input, kind, title, summary);
        break;
      case 'sequence':
        spec = readSequence(ctx, input, title, summary);
        break;
      case 'class':
        spec = readClass(ctx, input, title, summary);
        break;
      case 'er':
        spec = readEr(ctx, input, title, summary);
        break;
    }
    if (spec && ctx.errors.length === 0) return { ok: true, spec };
    return { ok: false, errors: ctx.errors.length > 0 ? ctx.errors : ['The diagram is not valid'] };
  } catch {
    return { ok: false, errors: ['The diagram could not be read'] };
  }
}
