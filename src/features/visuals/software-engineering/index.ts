import type { VisualDefinition } from '../types';
import { ArchitectureVisual } from './components/architecture';
import { GitVisual } from './components/git';
import { PatternsVisual } from './components/patterns';
import { PipelineVisual } from './components/pipeline';
import { SdlcVisual } from './components/sdlc';
import { softwareStrings } from './strings';


/** Interactive visuals for software engineering. */
const build = (s: typeof softwareStrings.en): VisualDefinition[] => [
  {
    id: 'se-sdlc',
    title: s.sdlc.title,
    category: 'software-engineering',
    summary: s.sdlc.summary,
    description: s.sdlc.description,
    topics: ['sdlc', 'software development lifecycle', 'plan design build test release maintain', 'agile', 'waterfall', 'iteration'],
    Component: SdlcVisual,
  },
  {
    id: 'se-git-branching',
    title: s.git.title,
    category: 'software-engineering',
    summary: s.git.summary,
    description: s.git.description,
    topics: ['git', 'branch', 'merge', 'rebase', 'commit', 'fast-forward', 'head', 'version control'],
    Component: GitVisual,
  },
  {
    id: 'se-ci-cd-pipeline',
    title: s.pipeline.title,
    category: 'software-engineering',
    summary: s.pipeline.summary,
    description: s.pipeline.description,
    topics: ['ci cd', 'continuous integration', 'continuous delivery', 'pipeline', 'build', 'test', 'deploy', 'github actions'],
    Component: PipelineVisual,
  },
  {
    id: 'se-system-architecture',
    title: s.architecture.title,
    category: 'software-engineering',
    summary: s.architecture.summary,
    description: s.architecture.description,
    topics: ['architecture', 'system design', 'api gateway', 'microservices', 'cache', 'database', 'layers', 'services'],
    Component: ArchitectureVisual,
  },
  {
    id: 'se-design-patterns',
    title: s.patterns.title,
    category: 'software-engineering',
    summary: s.patterns.summary,
    description: s.patterns.description,
    topics: ['design patterns', 'observer', 'factory', 'singleton', 'class diagram', 'oop', 'dependency injection'],
    Component: PatternsVisual,
  },
];

export const softwareEngineeringVisuals = build(softwareStrings.en);
/** The same visuals with their titles, summaries and descriptions in Tagalog (the components read their own language). */
export const softwareEngineeringVisualsFil = build(softwareStrings.fil);
