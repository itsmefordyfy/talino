import { defineStrings } from '@/lib/i18n';

import type { StepKind } from './lib/agent-loop';

// Owner rule: no Filipino is written. The `fil` table is the same English text (a placeholder, not a translation), listed in ENGLISH_ONLY of strings-parity.test.ts.
const en = {
  title: 'The agent loop: plan, act, observe, decide',
  summary: 'Step through a small AI agent finishing a task, and see why it asks a person before an action that cannot be undone.',
  description:
    'An illustration of an AI agent working through a fixed example: refunding a late order. Step through the loop: goal, plan, call a tool, observe the result, decide, ask a person for approval before the refund, and finish. A switch removes the approval step so you can see the risk. A panel shows the tool call and its result, a log lists what happened, and counters track tool calls and money refunded. Everything is a hand-written illustration, not a real agent or model.',
  topics: ['agent', 'ai agent', 'agent loop', 'tool use', 'tools', 'function calling', 'human in the loop', 'approval', 'guardrails', 'react loop', 'observe', 'plan', 'autonomy'],
  illustration: 'Illustration with a made-up order and made-up tools. It is a hand-written script, not a real agent or model.',
  taskTitle: 'The task',
  task: 'A customer says order 1042 arrived late and asks for a refund. The agent has three tools: order_lookup, refund_policy and issue_refund (and an email tool).',
  gateLabel: 'Ask a person before the refund',
  gateOn: 'Approval step on',
  gateOff: 'Approval step off',
  gateHint: 'The refund cannot be taken back, so a person approves it first. Turn this off to see what can go wrong.',
  stages: { goal: 'Goal', plan: 'Plan', act: 'Act', observe: 'Observe', decide: 'Decide', approve: 'Approval', finish: 'Finish' } satisfies Record<StepKind, string>,
  stageLabel: (name: string, n: number, total: number) => `Stage ${n} of ${total}: ${name}`,
  toolTitle: 'Tool call',
  toolNone: 'No tool is called in this step.',
  toolName: 'Tool',
  toolInput: 'Input',
  toolResult: 'Result',
  pending: 'Not run yet: waiting for a person to approve.',
  logTitle: 'Log',
  logEmpty: 'Nothing has happened yet.',
  logItem: (n: number, stage: string, line: string) => `${n}. ${stage}: ${line}`,
  counters: {
    steps: (n: number, total: number) => `Step ${n} of ${total}`,
    tools: (n: number) => `Tool calls: ${n}`,
    approvals: (n: number) => `Approvals asked: ${n}`,
    refunded: (pesos: number) => `Refunded: ${pesos.toLocaleString('en-US')} pesos`,
  },
  approval: { waiting: 'Waiting for a person', rejected: 'Rejected by the person', approved: 'Approved by the person' },
  riskTitle: 'The risk',
  risk: 'With no approval step, the agent\'s slip went straight to the payment tool. The money is gone and the customer was told the wrong amount. A person checking first would have caught it.',
  safeTitle: 'Why the approval step matters',
  safe: 'The agent proposed a wrong amount, but the person compared it with the order and stopped it before the refund. The agent is helpful for the routine steps, and a person decides the ones that cannot be undone.',
  pesos: (n: number) => `${n.toLocaleString('en-US')} pesos`,
  script: {
    goal: { caption: 'Goal: refund order 1042 if the policy allows it, then tell the customer. Every agent starts from a goal.', log: 'refund order 1042 if the policy allows, then tell the customer.' },
    plan: { caption: 'Plan: look up the order, check the policy, decide, refund, and email. An agent breaks the goal into steps it can take with its tools.', log: 'look up the order, check the policy, decide, refund, email.' },
    lookup: { caption: 'Act: the agent calls a tool. order_lookup is read-only, so it is safe to run on its own.', log: 'called order_lookup for order 1042.', input: 'order_id: 1042', result: 'Delivered 3 days late. Total: 850 pesos.' },
    lookupSeen: { caption: 'Observe: the agent reads the tool\'s result. Its next move depends on what it finds.', log: 'order 1042 was 3 days late and cost 850 pesos.' },
    policy: { caption: 'Act: a second tool call, this time to check the refund policy.', log: 'called refund_policy for late delivery.', input: 'topic: late delivery', result: 'Refund the order total if delivery is more than 2 days late.' },
    policySeen: { caption: 'Observe: the policy says a delivery more than 2 days late gets a refund of the order total.', log: 'the policy says 3 days late qualifies for a full refund.' },
    decide: { caption: 'Decide: the order qualifies, so the next action is a refund. This time the agent slips and writes 8,500 pesos instead of 850. Agents make small mistakes like this.', log: 'the order qualifies; proposed issue_refund(1042, 8,500 pesos).' },
    waiting: { caption: 'Approval: a refund cannot be undone, so the agent stops and asks a person. Nothing is sent until the person answers.', log: 'asked a person to approve issue_refund(1042, 8,500 pesos).', input: 'order_id: 1042, amount: 8,500 pesos' },
    rejected: { caption: 'Approval: the person compares 8,500 with the order total of 850 and says no. The agent goes back to deciding.', log: 'the person rejected it: the amount is wrong.' },
    redecide: { caption: 'Decide again: with the person\'s correction, the agent proposes a refund of 850 pesos, the order total.', log: 'proposed issue_refund(1042, 850 pesos).' },
    approved: { caption: 'Approval: the person checks 850 against the order and approves. Only now may the refund tool run.', log: 'the person approved issue_refund(1042, 850 pesos).', input: 'order_id: 1042, amount: 850 pesos' },
    refund: { caption: 'Act: the refund tool runs. It is the one step that moves money, and it ran only after approval.', log: 'called issue_refund(1042, 850 pesos).', input: 'order_id: 1042, amount: 850 pesos', result: 'Refund of 850 pesos sent.' },
    refundSeen: { caption: 'Observe: the agent confirms the refund went through.', log: 'the refund of 850 pesos was sent.' },
    email: { caption: 'Act: the agent tells the customer, using an email tool.', log: 'called send_email to the customer.', input: 'to: customer, text: "We refunded 850 pesos for order 1042."', result: 'Email sent.' },
    finish: { caption: 'Finish: the goal is met: the late order was refunded the right amount and the customer was told. The loop ends when the goal is met or the agent is stopped.', log: 'refunded 850 pesos and told the customer.' },
    // The same run with no approval step.
    unguardedRefund: { caption: 'Act: with no approval step, the refund tool runs straight away, with the wrong amount.', log: 'called issue_refund(1042, 8,500 pesos).', input: 'order_id: 1042, amount: 8,500 pesos', result: 'Refund of 8,500 pesos sent.' },
    unguardedSeen: { caption: 'Observe: the tool reports success. The agent has no way to know that the amount was wrong, and the money has already left.', log: 'the refund of 8,500 pesos was sent.' },
    unguardedEmail: { caption: 'Act: the agent tells the customer the wrong amount.', log: 'called send_email to the customer.', input: 'to: customer, text: "We refunded 8,500 pesos for order 1042."', result: 'Email sent.' },
    unguardedFinish: { caption: 'Finish: the agent thinks it is done. In fact 7,650 pesos too much was paid out, and getting it back is slow and awkward.', log: 'refunded 8,500 pesos and told the customer.' },
  },
  intro: 'Step through the loop with Next, or press Play.',
};

export const agentLoopStrings = defineStrings({ en, fil: en });
export type AgentLoopText = typeof en;
