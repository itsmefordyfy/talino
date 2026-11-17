import { describe, expect, test } from '@jest/globals';

import { workflowStrings } from '../workflow-strings';
import { checkActivity } from './check';
import { validateStructure, workflowProblems } from './validate';
import { addWorkflowStep, brokenRulesOf, checkWorkflow, removeWorkflowStep, simulateWorkflow, stepsInBrokenRules, workflowCountState, workflowLaneGroups } from './workflow';
import { SAMPLE_WORKFLOW as activity } from './workflow-sample';

describe('the sample workflow', () => {
  test('is a valid activity, and the reference solution passes its own check', () => {
    expect(validateStructure(activity)).toEqual([]);
    expect(workflowProblems(activity)).toEqual([]);
    expect(checkWorkflow(activity, activity.solution).correct).toBe(true);
  });
});

describe('building the workflow', () => {
  test('adds a part once, at the end, and never beyond maxSteps or for an unknown id', () => {
    expect(addWorkflowStep([], 'read-message', activity)).toEqual(['read-message']);
    expect(addWorkflowStep(['read-message'], 'draft-reply', activity)).toEqual(['read-message', 'draft-reply']);
    expect(addWorkflowStep(['read-message'], 'read-message', activity)).toEqual(['read-message']);
    expect(addWorkflowStep([], 'not-a-part', activity)).toEqual([]);
    const full = ['read-message', 'draft-reply', 'check-price', 'owner-review', 'send-reply', 'log-order'];
    expect(addWorkflowStep(full, 'send-direct', activity)).toEqual(full);
  });

  test('never changes the list it was given', () => {
    const order = ['read-message'];
    addWorkflowStep(order, 'draft-reply', activity);
    removeWorkflowStep(order, 'read-message');
    expect(order).toEqual(['read-message']);
  });

  test('removes a part and keeps the others in order', () => {
    expect(removeWorkflowStep(['a', 'b', 'c'], 'b')).toEqual(['a', 'c']);
    expect(removeWorkflowStep(['a', 'b'], 'zzz')).toEqual(['a', 'b']);
  });

  test('groups the palette by lane in flow order, keeping the author order inside a lane and skipping empty lanes', () => {
    const groups = workflowLaneGroups(activity.parts);
    expect(groups.map((group) => group.lane)).toEqual(['input', 'ai', 'tool', 'human', 'output']);
    expect(groups[4].parts.map((part) => part.id)).toEqual(['send-reply', 'log-order']);
    expect(workflowLaneGroups(activity.parts.filter((part) => part.lane !== 'tool')).map((group) => group.lane)).toEqual(['input', 'ai', 'human', 'output']);
  });

  test('the step counter is few below the minimum, ok in range, full at the maximum', () => {
    expect([0, 3, 4, 5, 6, 7].map((count) => workflowCountState(count, activity))).toEqual(['few', 'few', 'ok', 'ok', 'full', 'full']);
  });
});

describe('checkWorkflow', () => {
  test('an empty workflow is wrong with partial 0 and its own message', () => {
    const result = checkWorkflow(activity, []);
    expect(result).toMatchObject({ correct: false, partial: 0, feedback: workflowStrings.en.emptyFeedback });
    expect(result.detail).toMatchObject({ kind: 'workflow-builder', steps: 0 });
  });

  test('the first broken rule is named with its message and the others are counted, never the order', () => {
    const result = checkWorkflow(activity, ['read-message', 'paste-password', 'send-direct']);
    const detail = result.detail;
    expect(detail?.kind === 'workflow-builder' && detail.broken).toEqual(['needs-ai', 'needs-review', 'no-password', 'no-auto-send']);
    expect(result.feedback).toBe(`${activity.rules[0].message} 3 more rules are also not met yet.`);
    expect(result.correct).toBe(false);
    for (const id of activity.solution) expect(result.feedback).not.toContain(id);
  });

  test('one broken rule has no "more rules" tail', () => {
    // review after send: only "review-before-send" is broken.
    const result = checkWorkflow(activity, ['read-message', 'draft-reply', 'send-reply', 'owner-review']);
    expect(result.feedback).toBe(activity.rules.find((rule) => rule.id === 'review-before-send')?.message);
    expect(result.partial).toBeCloseTo(5 / 6);
  });

  test('a rule that is met by leaving parts out is still met, but too few steps is not a pass', () => {
    const result = checkWorkflow(activity, ['read-message', 'draft-reply', 'owner-review']);
    expect(result.correct).toBe(false);
    expect(result.feedback).toBe(workflowStrings.en.tooFew(4));
    expect(result.detail).toMatchObject({ broken: [], steps: 3 });
  });

  test('any order that meets every rule within the limits is correct, not only the reference one', () => {
    expect(checkWorkflow(activity, ['draft-reply', 'read-message', 'owner-review', 'send-reply']).correct).toBe(true);
    expect(checkWorkflow(activity, ['read-message', 'draft-reply', 'owner-review', 'send-reply', 'log-order']).correct).toBe(true);
  });

  test('too many steps is not a pass even when every rule is met', () => {
    const tooMany = checkWorkflow({ ...activity, maxSteps: 4 }, ['read-message', 'draft-reply', 'check-price', 'owner-review', 'send-reply']);
    expect(tooMany.correct).toBe(false);
    expect(tooMany.feedback).toBe(workflowStrings.en.tooMany(4));
  });

  test('ignores repeated and unknown ids', () => {
    const result = checkWorkflow(activity, ['read-message', 'read-message', 'nope', 'draft-reply', 'owner-review', 'send-reply']);
    expect(result.detail).toMatchObject({ steps: 4 });
    expect(result.correct).toBe(true);
  });

  test('brokenRulesOf returns the rule objects in rule order', () => {
    expect(brokenRulesOf(activity, ['no-password', 'needs-ai']).map((rule) => rule.id)).toEqual(['needs-ai', 'no-password']);
  });

  test('marks only the learner steps in broken forbid and before rules, never a missing part', () => {
    const order = ['read-message', 'paste-password', 'send-reply', 'owner-review'];
    const result = checkWorkflow(activity, order);
    const broken = result.detail?.kind === 'workflow-builder' ? result.detail.broken : [];
    expect(broken).toEqual(['needs-ai', 'no-password', 'review-before-send']);
    // needs-ai is a "require" rule: draft-reply is not in the workflow and is not named.
    expect(stepsInBrokenRules(activity, broken, order)).toEqual(['paste-password', 'send-reply', 'owner-review']);
  });

  test('checkActivity routes the workflow answer, and refuses another kind of answer', async () => {
    expect(await checkActivity(activity, { kind: 'workflow-builder', order: activity.solution })).toMatchObject({ correct: true, partial: 1 });
    await expect(checkActivity(activity, { kind: 'arrange', order: activity.solution })).rejects.toThrow(/workflow-builder/);
  });
});

describe('simulateWorkflow', () => {
  test('walks the learner steps in their order, with the written lines and the final output', () => {
    const run = simulateWorkflow(activity, ['draft-reply', 'read-message', 'owner-review', 'send-reply']);
    expect(run.steps.map((step) => step.partId)).toEqual(['draft-reply', 'read-message', 'owner-review', 'send-reply']);
    expect(run.steps[0]).toMatchObject({ line: activity.simulation.steps['draft-reply'], written: true, lane: 'ai' });
    expect(run.input).toBe(activity.simulation.input);
    expect(run.output).toBe(activity.simulation.output);
  });

  test('a step the example has no line for gets the generic line, marked as not written', () => {
    const run = simulateWorkflow(activity, ['read-message', 'draft-reply', 'owner-review', 'send-reply', 'log-order']);
    const extra = run.steps[4];
    expect(extra).toMatchObject({ partId: 'log-order', written: false, line: workflowStrings.en.genericStep('Save the order in the log') });
  });

  test('skips an id that is not in the palette', () => {
    expect(simulateWorkflow(activity, ['nope', 'read-message']).steps.map((step) => step.partId)).toEqual(['read-message']);
  });
});
