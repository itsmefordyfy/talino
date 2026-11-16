import type { VisualDefinition } from '../types';
import { CollectionsVisual } from './collections-visual';
import { ConditionalsVisual } from './conditionals-visual';
import { FunctionsVisual } from './functions-visual';
import { LoopsVisual } from './loops-visual';
import { OperatorsVisual } from './operators-visual';
import { ScopeVisual } from './scope-visual';
import { fundamentalsStrings } from './strings';
import { VariablesVisual } from './variables-visual';


/** Programming fundamentals: variables, operators, conditionals, loops, functions, arrays and objects, scope. */
const build = (en: typeof fundamentalsStrings.en): VisualDefinition[] => [
  { id: 'variables-data-types', category: 'fundamentals', title: en.variables.title, summary: en.variables.summary, description: en.variables.description, topics: en.variables.topics, Component: VariablesVisual },
  { id: 'operators', category: 'fundamentals', title: en.operators.title, summary: en.operators.summary, description: en.operators.description, topics: en.operators.topics, Component: OperatorsVisual },
  { id: 'conditionals', category: 'fundamentals', title: en.conditionals.title, summary: en.conditionals.summary, description: en.conditionals.description, topics: en.conditionals.topics, Component: ConditionalsVisual },
  { id: 'loops', category: 'fundamentals', title: en.loops.title, summary: en.loops.summary, description: en.loops.description, topics: en.loops.topics, Component: LoopsVisual },
  { id: 'functions', category: 'fundamentals', title: en.functions.title, summary: en.functions.summary, description: en.functions.description, topics: en.functions.topics, Component: FunctionsVisual },
  { id: 'arrays-objects', category: 'fundamentals', title: en.collections.title, summary: en.collections.summary, description: en.collections.description, topics: en.collections.topics, Component: CollectionsVisual },
  { id: 'scope-execution-flow', category: 'fundamentals', title: en.scope.title, summary: en.scope.summary, description: en.scope.description, topics: en.scope.topics, Component: ScopeVisual },
];

export const fundamentalsVisuals = build(fundamentalsStrings.en);
/** The same visuals with their titles, summaries and descriptions in Tagalog (the components read their own language). */
export const fundamentalsVisualsFil = build(fundamentalsStrings.fil);
