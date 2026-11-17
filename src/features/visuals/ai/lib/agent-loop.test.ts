import { describe, expect, test } from '@jest/globals';

import { agentLoopStrings } from '../agent-loop-strings';
import { buildAgentSteps, IRREVERSIBLE_TOOL, ORDER_TOTAL, outcomeOf, stageIndex, stagesFor, WRONG_AMOUNT, type AgentStep } from './agent-loop';

const t = agentLoopStrings.en;
const guarded = buildAgentSteps(true, t);
const unguarded = buildAgentSteps(false, t);

const refundCalls = (steps: AgentStep[]) => steps.flatMap((step, index) => (step.kind === 'act' && step.tool?.name === IRREVERSIBLE_TOOL ? [index] : []));

describe('both runs', () => {
  test('start from the goal and a plan and end by finishing', () => {
    for (const steps of [guarded, unguarded]) {
      expect(steps.slice(0, 2).map((step) => step.kind)).toEqual(['goal', 'plan']);
      expect(steps[steps.length - 1].kind).toBe('finish');
      expect(steps.filter((step) => step.kind === 'finish')).toHaveLength(1);
    }
  });

  test('every step has a caption and a log line, and only act and approval steps show a tool', () => {
    for (const steps of [guarded, unguarded]) {
      for (const step of steps) {
        expect(step.caption.length).toBeGreaterThan(20);
        expect(step.log.length).toBeGreaterThan(10);
        if (step.tool !== null) expect(['act', 'approve']).toContain(step.kind);
        if (step.kind === 'act') expect(step.tool).not.toBeNull();
      }
    }
  });

  test('every act is followed by an observation, except the last one (the email), which is followed by the finish', () => {
    for (const steps of [guarded, unguarded]) {
      steps.forEach((step, index) => {
        if (step.kind !== 'act') return;
        const next = steps[index + 1].kind;
        expect(['observe', 'finish']).toContain(next);
      });
    }
  });

  test('totals never go down, and a tool result is present for every finished call', () => {
    for (const steps of [guarded, unguarded]) {
      for (let index = 1; index < steps.length; index += 1) {
        expect(steps[index].toolCalls).toBeGreaterThanOrEqual(steps[index - 1].toolCalls);
        expect(steps[index].approvals).toBeGreaterThanOrEqual(steps[index - 1].approvals);
        expect(steps[index].refunded).toBeGreaterThanOrEqual(steps[index - 1].refunded);
      }
      for (const step of steps) if (step.kind === 'act') expect(step.tool?.result).toBeTruthy();
    }
  });

  test('the agent proposes the wrong amount once, in both runs', () => {
    for (const steps of [guarded, unguarded]) {
      const first = steps.find((step) => step.kind === 'decide');
      expect(first?.mistake).toBe(true);
      expect(first?.caption).toContain('8,500');
    }
  });
});

describe('with the approval step', () => {
  test('a person is asked before the irreversible tool, rejects the wrong amount, and approves the right one', () => {
    const approvals = guarded.filter((step) => step.kind === 'approve').map((step) => step.approval);
    expect(approvals).toEqual(['waiting', 'rejected', 'approved']);
  });

  test('the payment tool runs exactly once, only after an approval, and only with the right amount', () => {
    const calls = refundCalls(guarded);
    expect(calls).toHaveLength(1);
    const approvedAt = guarded.findIndex((step) => step.approval === 'approved');
    expect(approvedAt).toBeGreaterThan(-1);
    expect(calls[0]).toBeGreaterThan(approvedAt);
    // Nothing after the approval is a rejection or a second wrong proposal.
    expect(guarded.slice(approvedAt).some((step) => step.approval === 'rejected' || step.mistake)).toBe(false);
    expect(guarded[calls[0]].tool?.input).toContain('850 pesos');
    expect(guarded[calls[0]].tool?.input).not.toContain('8,500');
  });

  test('a call that waits for approval has no result yet, and no money has moved before the refund runs', () => {
    for (const step of guarded.filter((entry) => entry.kind === 'approve')) expect(step.tool?.result).toBeNull();
    const refundAt = refundCalls(guarded)[0];
    for (const step of guarded.slice(0, refundAt)) expect(step.refunded).toBe(0);
    expect(guarded[refundAt].refunded).toBe(ORDER_TOTAL);
  });

  test('ends safely with the right total and counts two approvals', () => {
    const last = guarded[guarded.length - 1];
    expect(last).toMatchObject({ refunded: ORDER_TOTAL, approvals: 2, mistake: false });
    expect(outcomeOf(guarded, guarded.length - 1)).toBe('safe');
    expect(outcomeOf(guarded, 0)).toBe('running');
  });
});

describe('without the approval step', () => {
  test('there is no approval step, and the payment tool runs with the wrong amount', () => {
    expect(unguarded.some((step) => step.kind === 'approve' || step.approval !== null)).toBe(false);
    const calls = refundCalls(unguarded);
    expect(calls).toHaveLength(1);
    expect(unguarded[calls[0]].tool?.input).toContain('8,500');
    expect(unguarded[calls[0]].refunded).toBe(WRONG_AMOUNT);
  });

  test('ends with the wrong money out, and says so', () => {
    const last = unguarded[unguarded.length - 1];
    expect(last).toMatchObject({ refunded: WRONG_AMOUNT, approvals: 0, mistake: true });
    expect(outcomeOf(unguarded, unguarded.length - 1)).toBe('risk');
    expect(WRONG_AMOUNT - ORDER_TOTAL).toBe(7650);
    expect(last.caption).toContain('7,650');
  });

  test('is shorter: the approval steps are what the gate adds', () => {
    expect(guarded.length - unguarded.length).toBe(guarded.filter((step) => step.kind === 'approve').length + 1);
  });
});

describe('the stage strip', () => {
  test('has an approval stage only with the gate, and every step maps to a stage that exists', () => {
    expect(stagesFor(true)).toContain('approve');
    expect(stagesFor(false)).not.toContain('approve');
    for (const [gate, steps] of [[true, guarded], [false, unguarded]] as const) {
      for (const step of steps) expect(stagesFor(gate)[stageIndex(step.kind, gate)]).toBe(step.kind);
    }
  });
});

describe('honesty', () => {
  test('the strings say it is a hand-written illustration, not a real agent', () => {
    expect(t.illustration).toMatch(/not a real agent/i);
    expect(t.description).toMatch(/not a real agent/i);
  });
});
