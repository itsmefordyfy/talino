import type { VisualDefinition } from '../types';
import { AdrBuilderVisual } from './adr-builder-visual';
import { ArchitectureAssistantVisual } from './assistant-visual';
import { DiagramWorkbenchVisual } from './diagram-workbench-visual';
import { architectureVisualStrings } from './strings';
import { TradeoffMatrixVisual } from './tradeoff-matrix-visual';

/** The Software Architecture with AI course's tools: the learner's own diagrams, matrices and decision records, kept on the phone. */
const build = (en: typeof architectureVisualStrings.en): VisualDefinition[] => [
  { id: 'arch-diagram-workbench', category: 'architecture', title: en.workbench.title, summary: en.workbench.summary, description: en.workbench.description, topics: en.workbench.topics, Component: DiagramWorkbenchVisual },
  { id: 'arch-tradeoff-matrix', category: 'architecture', title: en.tradeoff.title, summary: en.tradeoff.summary, description: en.tradeoff.description, topics: en.tradeoff.topics, Component: TradeoffMatrixVisual },
  { id: 'arch-adr-builder', category: 'architecture', title: en.adr.title, summary: en.adr.summary, description: en.adr.description, topics: en.adr.topics, Component: AdrBuilderVisual },
  { id: 'arch-assistant', category: 'architecture', title: en.assistant.title, summary: en.assistant.summary, description: en.assistant.description, topics: en.assistant.topics, Component: ArchitectureAssistantVisual },
];

export const architectureVisuals = build(architectureVisualStrings.en);
/** The same visuals with their words in the `fil` table (English placeholders for now, by the owner's standing rule). */
export const architectureVisualsFil = build(architectureVisualStrings.fil);
