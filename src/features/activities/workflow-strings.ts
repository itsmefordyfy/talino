import { defineStrings } from '@/lib/i18n';

import type { WorkflowLane } from './types';

// Owner rule: no Filipino is written. The `fil` table is the same English text (a placeholder, not a translation), listed in ENGLISH_ONLY of strings-parity.test.ts.
const en = {
  lanes: {
    input: 'Input',
    ai: 'AI processing',
    tool: 'Tool or action',
    human: 'Human review',
    output: 'Output',
  } satisfies Record<WorkflowLane, string>,
  laneHints: {
    input: 'Where the request or data comes from',
    ai: 'A model reads, writes or decides',
    tool: 'Software that does something',
    human: 'A person checks before it goes on',
    output: 'What comes out at the end',
  } satisfies Record<WorkflowLane, string>,
  situation: 'The situation',
  yourWorkflow: 'Your workflow',
  paletteTitle: 'Parts you can use',
  paletteHelp: 'Tap a part to add it to the end of your workflow. Some parts are traps.',
  emptyWorkflow: 'Nothing here yet. Add your first step from the parts below.',
  stepCount: (count: number, min: number, max: number) => `${count} ${count === 1 ? 'step' : 'steps'} · use ${min} to ${max}`,
  stepCountState: { few: 'Add more steps', ok: 'Step count fits', full: 'Workflow is full' },
  stepRow: (n: number, lane: string, label: string) => `Step ${n}, ${lane}: ${label}`,
  moveUp: (n: number, label: string) => `Move step ${n}, ${label}, up`,
  moveDown: (n: number, label: string) => `Move step ${n}, ${label}, down`,
  remove: (n: number, label: string) => `Remove step ${n}, ${label}`,
  addPart: (lane: string, label: string, detail: string) => `${lane}: ${label}. ${detail}. Add to workflow`,
  addedPart: (lane: string, label: string, n: number) => `${lane}: ${label}. Already in your workflow as step ${n}`,
  fullPart: (lane: string, label: string) => `${lane}: ${label}. The workflow is full: remove a step to add this one`,
  added: 'Added',
  flagged: 'Involved in a rule that is not met',
  checkWorkflow: 'Check workflow',
  // The result of a check. Never the answer: the broken rules' own messages, and how many remain.
  emptyFeedback: 'Your workflow is empty. Add some steps first.',
  tooFew: (min: number) => `A workflow like this needs at least ${min} steps. Add more.`,
  tooMany: (max: number) => `That is more than ${max} steps. Remove the ones that do not earn their place.`,
  right: 'Every rule is met.',
  rulesRemain: (count: number) => (count === 1 ? ' One more rule is also not met yet.' : ` ${count} more rules are also not met yet.`),
  brokenSummary: (count: number) => (count === 1 ? 'One rule is not met yet.' : `${count} rules are not met yet.`),
  brokenTitle: 'Rules not met yet',
  brokenRule: (n: number, message: string) => `Rule ${n} not met: ${message}`,
  // The simulated run
  simulationTitle: 'Simulated run',
  simulationBadge: 'Simulated run, not a real model',
  simulationNote: 'A hand-written example of your workflow handling one request. No AI model was called.',
  simulationInput: 'The request',
  simulationOutput: 'What comes out',
  simulationStep: (n: number, label: string, line: string) => `Step ${n}, ${label}: ${line}`,
  // For a step the learner added that the example has no line for.
  genericStep: (label: string) => `${label}: this step runs.`,
  genericMark: 'Generic line',
  runAgain: 'Replay the run',
  runShowNext: 'Show next step',
  runFinished: 'Run finished',
};

export const workflowStrings = defineStrings({ en, fil: en });
export type WorkflowText = typeof en;
