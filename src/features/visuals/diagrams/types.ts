/**
 * The diagram schema: plain, validated data that describes a diagram. The AI mentor (or a lesson author)
 * writes this JSON, `validateDiagram` checks it, and `DiagramView` draws it. Nothing in a spec is ever
 * executed or interpreted as markup: every string is drawn as text.
 */

export const DIAGRAM_LIMITS = {
  /** Nodes, participants, classes or entities. */
  maxNodes: 24,
  /** Edges, messages, relations or relationships. */
  maxEdges: 40,
  maxLabel: 60,
  maxTitle: 80,
  maxSummary: 400,
  maxNote: 240,
  maxGroup: 30,
  /** Attributes or methods per class, attributes per entity. */
  maxMembers: 12,
  maxMember: 60,
} as const;

/** Ids are letters, digits, `_` and `-`, 1 to 32 characters. */
export const DIAGRAM_ID_PATTERN = /^[A-Za-z0-9_-]{1,32}$/;

export const DIAGRAM_KINDS = ['flow', 'sequence', 'class', 'er', 'architecture'] as const;
export type DiagramKind = (typeof DIAGRAM_KINDS)[number];

export const NODE_SHAPES = ['box', 'rounded', 'diamond', 'circle', 'database', 'actor'] as const;
export type NodeShape = (typeof NODE_SHAPES)[number];

export type DiagramDirection = 'TD' | 'LR';

export type DiagramNode = {
  id: string;
  label: string;
  shape?: NodeShape;
  /** A sentence or two shown under the diagram when the learner taps the node. */
  note?: string;
  /** Architecture diagrams: the layer or area this component belongs to; same group, same color. */
  group?: string;
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  /** An arrow head at both ends. */
  bidirectional?: boolean;
};

type Common = { title: string; summary: string };

export type FlowSpec = Common & {
  kind: 'flow' | 'architecture';
  /** Preferred direction; a narrow phone always gets top to bottom. */
  direction?: DiagramDirection;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};

export type SequenceParticipant = { id: string; label: string; shape?: NodeShape; note?: string };
export type SequenceMessage = { from: string; to: string; label: string; /** A reply is drawn dashed. */ dashed?: boolean; note?: string };

export type SequenceSpec = Common & {
  kind: 'sequence';
  participants: SequenceParticipant[];
  messages: SequenceMessage[];
};

export const RELATION_TYPES = ['inherits', 'implements', 'composes', 'aggregates', 'associates', 'depends'] as const;
export type RelationType = (typeof RELATION_TYPES)[number];

export type ClassBox = {
  id: string;
  label: string;
  /** For example `interface` or `abstract`; drawn as <<interface>> above the name. */
  stereotype?: string;
  attributes?: string[];
  methods?: string[];
  note?: string;
};

/**
 * `inherits`: `from` extends `to` (the parent). `implements`: `from` implements the interface `to`.
 * `composes` / `aggregates`: `from` is the whole, `to` the part. `associates`: `from` knows `to`.
 * `depends`: `from` uses `to` briefly.
 */
export type ClassRelation = { from: string; to: string; type: RelationType; label?: string };

export type ClassSpec = Common & { kind: 'class'; classes: ClassBox[]; relations: ClassRelation[] };

export const CARDINALITIES = ['one', 'zero-or-one', 'one-or-many', 'zero-or-many'] as const;
export type Cardinality = (typeof CARDINALITIES)[number];

export type ErAttribute = { name: string; type?: string; key?: 'PK' | 'FK' };
export type ErEntity = { id: string; label: string; attributes?: ErAttribute[]; note?: string };
/** `fromCardinality` is how many `from` records sit on their end of the relationship, `toCardinality` how many `to` records. */
export type ErRelationship = { from: string; to: string; fromCardinality: Cardinality; toCardinality: Cardinality; label: string };

export type ErSpec = Common & { kind: 'er'; entities: ErEntity[]; relationships: ErRelationship[] };

export type DiagramSpec = FlowSpec | SequenceSpec | ClassSpec | ErSpec;

export type DiagramResult = { ok: true; spec: DiagramSpec } | { ok: false; errors: string[] };
