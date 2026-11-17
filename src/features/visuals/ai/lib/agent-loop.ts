import type { AgentLoopText } from '../agent-loop-strings';

/**
 * The agent loop illustration: a fixed, hand-written script of an agent refunding a late order. With the approval gate on, the agent's wrong amount is
 * stopped by a person before the irreversible refund; with it off, the same slip goes straight to the payment tool. Nothing is run or generated.
 */

export type StepKind = 'goal' | 'plan' | 'act' | 'observe' | 'decide' | 'approve' | 'finish';
export type ApprovalState = 'waiting' | 'rejected' | 'approved';

export type ToolCall = { name: string; input: string; result: string | null };

export type AgentStep = {
  kind: StepKind;
  caption: string;
  /** One line for the log. */
  log: string;
  /** The tool call this step shows (null when no tool is involved). `result` is null while a call waits for approval. */
  tool: ToolCall | null;
  approval: ApprovalState | null;
  /** Running totals at the end of this step. */
  toolCalls: number;
  approvals: number;
  refunded: number;
  /** The proposed or sent amount is the wrong one (the agent's slip). */
  mistake: boolean;
};

export const ORDER_TOTAL = 850;
export const WRONG_AMOUNT = 8500;
/** The tool that moves money and cannot be undone: the only one that is gated. */
export const IRREVERSIBLE_TOOL = 'issue_refund';

type Totals = { toolCalls: number; approvals: number; refunded: number };

/** Builds the steps of the run, with or without the approval gate. Pure and deterministic. */
export function buildAgentSteps(gate: boolean, t: AgentLoopText): AgentStep[] {
  const s = t.script;
  const steps: AgentStep[] = [];
  const totals: Totals = { toolCalls: 0, approvals: 0, refunded: 0 };
  const push = (kind: StepKind, text: { caption: string; log: string }, extra: { tool?: ToolCall; approval?: ApprovalState; mistake?: boolean } = {}) => {
    steps.push({ kind, caption: text.caption, log: text.log, tool: extra.tool ?? null, approval: extra.approval ?? null, ...totals, mistake: extra.mistake ?? false });
  };
  const call = (name: string, input: string, result: string | null): ToolCall => ({ name, input, result });

  push('goal', s.goal);
  push('plan', s.plan);
  totals.toolCalls += 1;
  push('act', s.lookup, { tool: call('order_lookup', s.lookup.input, s.lookup.result) });
  push('observe', s.lookupSeen);
  totals.toolCalls += 1;
  push('act', s.policy, { tool: call('refund_policy', s.policy.input, s.policy.result) });
  push('observe', s.policySeen);
  push('decide', s.decide, { mistake: true });

  if (gate) {
    totals.approvals += 1;
    push('approve', s.waiting, { tool: call(IRREVERSIBLE_TOOL, s.waiting.input, null), approval: 'waiting', mistake: true });
    push('approve', s.rejected, { tool: call(IRREVERSIBLE_TOOL, s.waiting.input, null), approval: 'rejected', mistake: true });
    push('decide', s.redecide);
    totals.approvals += 1;
    push('approve', s.approved, { tool: call(IRREVERSIBLE_TOOL, s.approved.input, null), approval: 'approved' });
    totals.toolCalls += 1;
    totals.refunded += ORDER_TOTAL;
    push('act', s.refund, { tool: call(IRREVERSIBLE_TOOL, s.refund.input, s.refund.result) });
    push('observe', s.refundSeen);
    totals.toolCalls += 1;
    push('act', s.email, { tool: call('send_email', s.email.input, s.email.result) });
    push('finish', s.finish);
  } else {
    totals.toolCalls += 1;
    totals.refunded += WRONG_AMOUNT;
    push('act', s.unguardedRefund, { tool: call(IRREVERSIBLE_TOOL, s.unguardedRefund.input, s.unguardedRefund.result), mistake: true });
    push('observe', s.unguardedSeen, { mistake: true });
    totals.toolCalls += 1;
    push('act', s.unguardedEmail, { tool: call('send_email', s.unguardedEmail.input, s.unguardedEmail.result), mistake: true });
    push('finish', s.unguardedFinish, { mistake: true });
  }
  return steps;
}

/** The loop's stages in order; the approval stage exists only when the gate is on. */
export function stagesFor(gate: boolean): StepKind[] {
  return gate ? ['goal', 'plan', 'act', 'observe', 'decide', 'approve', 'finish'] : ['goal', 'plan', 'act', 'observe', 'decide', 'finish'];
}

/** Which stage a step belongs to (an approval step never exists without the gate). */
export function stageIndex(kind: StepKind, gate: boolean): number {
  return Math.max(0, stagesFor(gate).indexOf(kind));
}

/** How the run ended, for the closing panel: the money went out wrong (no gate), a person stopped the slip (gate), or not finished yet. */
export type Outcome = 'running' | 'risk' | 'safe';

export function outcomeOf(steps: readonly AgentStep[], index: number): Outcome {
  const step = steps[index];
  if (!step || step.kind !== 'finish') return 'running';
  return step.mistake ? 'risk' : 'safe';
}
