/** Diagram engine: validate (or parse Mermaid) into a `DiagramSpec`, lay it out, draw it. Also the building blocks the other visuals share. */
export type {
  Cardinality,
  ClassBox,
  ClassRelation,
  ClassSpec,
  DiagramDirection,
  DiagramEdge,
  DiagramKind,
  DiagramNode,
  DiagramResult,
  DiagramSpec,
  ErAttribute,
  ErEntity,
  ErRelationship,
  ErSpec,
  FlowSpec,
  NodeShape,
  RelationType,
  SequenceMessage,
  SequenceParticipant,
  SequenceSpec,
} from './types';
export { DIAGRAM_ID_PATTERN, DIAGRAM_KINDS, DIAGRAM_LIMITS } from './types';
export { validateDiagram } from './validate';
export { parseMermaidSubset } from './mermaid';
export { describeDiagram } from './describe';
export { DIAGRAM_SPEC_PROMPT } from './prompt';
export { extractJson, fallbackSummary, parseDiagramJson } from './from-text';
export { layoutDiagram } from './layout';
export type { DiagramLayout } from './layout';
export { stableSteps, stableValue } from './stable-steps';
export { DiagramView, messageKey, noteOf } from './components/diagram-view';
export type { DiagramViewProps } from './components/diagram-view';
export { DiagramFallback, DiagramFromJson, DiagramFromMermaid } from './components/diagram-from';
export type { DiagramFromJsonProps, DiagramFromMermaidProps } from './components/diagram-from';
export { PayloadBox } from './components/payload-box';
export type { Payload, PayloadTone } from './components/payload-box';
export { StagedVisual } from './components/staged-visual';
export type { StagedStep, StagedVisualProps } from './components/staged-visual';
