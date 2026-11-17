import { workflowStrings, type WorkflowText } from '../workflow-strings';
import { WORKFLOW_LANES, type CheckResult, type WorkflowBuilderActivity, type WorkflowLane, type WorkflowPart, type WorkflowRule } from '../types';
import { brokenWorkflowRules } from './validate';

const defaultText = workflowStrings.en;

/** Appends a part to the workflow. Unknown ids, parts already in it and a full workflow leave it as it was. */
export function addWorkflowStep(order: readonly string[], partId: string, activity: Pick<WorkflowBuilderActivity, 'parts' | 'maxSteps'>): string[] {
  if (order.includes(partId) || order.length >= activity.maxSteps || !activity.parts.some((part) => part.id === partId)) return [...order];
  return [...order, partId];
}

export function removeWorkflowStep(order: readonly string[], partId: string): string[] {
  return order.filter((id) => id !== partId);
}

/** The palette grouped by lane in the order work flows through them; a lane with no parts is left out. Parts keep the author's order inside a lane. */
export function workflowLaneGroups(parts: readonly WorkflowPart[]): { lane: WorkflowLane; parts: WorkflowPart[] }[] {
  return WORKFLOW_LANES.map((lane) => ({ lane, parts: parts.filter((part) => part.lane === lane) })).filter((group) => group.parts.length > 0);
}

export type WorkflowCountState = 'few' | 'ok' | 'full';

/** Where the step count stands against the activity's limits: below the minimum, in range, or at the maximum (nothing more can be added). */
export function workflowCountState(count: number, activity: Pick<WorkflowBuilderActivity, 'minSteps' | 'maxSteps'>): WorkflowCountState {
  if (count < activity.minSteps) return 'few';
  return count >= activity.maxSteps ? 'full' : 'ok';
}

/** The rules a workflow breaks, as the rule objects (what the screen lists), in rule order. */
export function brokenRulesOf(activity: Pick<WorkflowBuilderActivity, 'rules'>, ids: readonly string[]): WorkflowRule[] {
  return activity.rules.filter((rule) => ids.includes(rule.id));
}

/**
 * The steps in the workflow that sit in a broken "forbid" or "before" rule, to mark them with a warning after a check. Only the learner's own steps are
 * ever marked: a "require" rule names a part that is missing, and naming it would hand over the answer.
 */
export function stepsInBrokenRules(activity: Pick<WorkflowBuilderActivity, 'rules'>, brokenIds: readonly string[], order: readonly string[]): string[] {
  const marked = new Set<string>();
  for (const rule of brokenRulesOf(activity, brokenIds)) {
    if (rule.kind === 'require') continue;
    for (const id of rule.parts) if (order.includes(id)) marked.add(id);
  }
  return order.filter((id) => marked.has(id));
}

/**
 * Checks an ordered workflow. Correct when no rule is broken and the step count is within `minSteps` and `maxSteps`. A wrong answer says why with the
 * first broken rule's own message (never the solution) and how many other rules are also not met, so the learner fixes them one at a time.
 * Like `arrange`, a wrong check is a try; `partial` is the share of rules met (0 for an empty workflow, where "forbid" rules are met by default).
 */
export function checkWorkflow(activity: WorkflowBuilderActivity, order: readonly string[], text: WorkflowText = defaultText): CheckResult {
  const known = order.filter((id, index) => order.indexOf(id) === index && activity.parts.some((part) => part.id === id));
  const steps = known.length;
  const broken = brokenWorkflowRules(activity.rules, known);
  const detail = { kind: 'workflow-builder' as const, broken, steps };
  const partial = steps === 0 ? 0 : (activity.rules.length - broken.length) / activity.rules.length;

  if (steps === 0) return { correct: false, partial: 0, feedback: text.emptyFeedback, detail };
  if (broken.length > 0) {
    const first = activity.rules.find((rule) => rule.id === broken[0]);
    return { correct: false, partial, feedback: `${first?.message ?? text.brokenSummary(broken.length)}${broken.length > 1 ? text.rulesRemain(broken.length - 1) : ''}`, detail };
  }
  if (steps < activity.minSteps) return { correct: false, partial: Math.min(partial, 0.9), feedback: text.tooFew(activity.minSteps), detail };
  if (steps > activity.maxSteps) return { correct: false, partial: Math.min(partial, 0.9), feedback: text.tooMany(activity.maxSteps), detail };
  return { correct: true, partial: 1, feedback: text.right, detail };
}

export type SimulatedStep = { partId: string; label: string; lane: WorkflowLane; line: string; /** False when the example has no line for this step and a generic one is shown. */ written: boolean };

export type SimulatedRun = { input: string; steps: SimulatedStep[]; output: string };

/**
 * The hand-written sample request walked through the learner's own steps. `simulation.steps` has a line for each step of the reference solution;
 * a step the learner added that has none gets a generic "this step runs" line, marked as such, so nothing is invented.
 */
export function simulateWorkflow(activity: WorkflowBuilderActivity, order: readonly string[], text: WorkflowText = defaultText): SimulatedRun {
  const steps = order.flatMap((id): SimulatedStep[] => {
    const part = activity.parts.find((candidate) => candidate.id === id);
    if (!part) return [];
    const written = activity.simulation.steps[id];
    const hasLine = typeof written === 'string' && written.trim() !== '';
    return [{ partId: id, label: part.label, lane: part.lane, line: hasLine ? written : text.genericStep(part.label), written: hasLine }];
  });
  return { input: activity.simulation.input, steps, output: activity.simulation.output };
}
