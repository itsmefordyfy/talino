import { describe, expect, test } from '@jest/globals';

import { validateDiagram } from '../../diagrams/validate';
import { aiStrings } from '../strings';
import { APP_SCENARIOS, APP_SEQUENCES, appSpec, buildAppSteps, buildLlmSteps, buildRagSteps, LLM_SCENARIOS, llmSpec, ragSpec } from './workflows';
import { fmt, forward, START_INPUTS, START_NET } from './network';
import { networkSpec, workingLines } from './network-spec';
import { QUESTION_IDS } from './rag';

const s = aiStrings.en;

function expectValid(spec: unknown) {
  const result = validateDiagram(spec);
  if (!result.ok) throw new Error(result.errors.join(', '));
  return result.spec;
}

function expectStepsFit(spec: ReturnType<typeof expectValid>, steps: { caption: string; nodes?: readonly string[]; edges?: readonly number[] }[]) {
  const nodeIds = new Set<string>();
  let edgeCount = 0;
  if (spec.kind === 'flow' || spec.kind === 'architecture') {
    spec.nodes.forEach((node) => nodeIds.add(node.id));
    edgeCount = spec.edges.length;
  } else if (spec.kind === 'sequence') {
    spec.participants.forEach((participant) => nodeIds.add(participant.id));
    edgeCount = spec.messages.length;
  }
  for (const step of steps) {
    expect(step.caption.length).toBeGreaterThan(10);
    for (const node of step.nodes ?? []) expect(nodeIds.has(node)).toBe(true);
    for (const edge of step.edges ?? []) expect(edge).toBeLessThan(edgeCount);
  }
}

describe('LLM workflow', () => {
  test('the diagram is valid', () => {
    expectValid(llmSpec(s.llmWorkflow));
  });

  test('a passing check goes straight to use', () => {
    const steps = buildLlmSteps('ok', s.llmWorkflow);
    expectStepsFit(expectValid(llmSpec(s.llmWorkflow)), steps);
    expect(steps.map((step) => step.nodes?.[0])).toEqual(['prompt', 'context', 'model', 'answer', 'check', 'use']);
    expect(steps[4].payloads?.[0].tone).toBe('ok');
  });

  test('a problem loops back to the prompt through the dashed edge, then passes', () => {
    const spec = expectValid(llmSpec(s.llmWorkflow));
    const steps = buildLlmSteps('bad', s.llmWorkflow);
    expectStepsFit(spec, steps);
    expect(steps.map((step) => step.nodes?.[0])).toEqual(['prompt', 'context', 'model', 'answer', 'check', 'prompt', 'context', 'model', 'answer', 'check', 'use']);
    const loopEdge = spec.kind === 'flow' ? spec.edges[steps[5].edges?.[0] ?? 0] : null;
    expect(loopEdge).toMatchObject({ from: 'check', to: 'prompt' });
    expect(steps[4].payloads?.[0].tone).toBe('danger');
    expect(steps[9].payloads?.[0].tone).toBe('ok');
    for (const scenario of LLM_SCENARIOS) expect(buildLlmSteps(scenario, s.llmWorkflow).length).toBeGreaterThan(5);
  });
});

describe('AI app workflow', () => {
  test.each(APP_SCENARIOS)('%s: a valid sequence with a step per message', (scenario) => {
    const spec = expectValid(appSpec(scenario, s.appWorkflow));
    const steps = buildAppSteps(scenario, s.appWorkflow);
    expectStepsFit(spec, steps);
    expect(steps).toHaveLength(APP_SEQUENCES[scenario].length);
  });

  test('the key travels only from the server to the model on the safe path', () => {
    const spec = expectValid(appSpec('server', s.appWorkflow));
    if (spec.kind !== 'sequence') throw new Error('kind');
    const withKey = spec.messages.filter((message) => /key/i.test(message.label) && !/no API key/i.test(message.label));
    expect(withKey).toHaveLength(1);
    expect(withKey[0]).toMatchObject({ from: 'server', to: 'model' });
    expect(spec.messages[0].label).toContain('no API key');
    expect(spec.participants.map((p) => p.id)).toEqual(['app', 'server', 'model']);
  });

  test('in the unsafe design the app itself holds the key and there is no server', () => {
    const spec = expectValid(appSpec('app', s.appWorkflow));
    if (spec.kind !== 'sequence') throw new Error('kind');
    expect(spec.participants.map((p) => p.id)).toEqual(['app', 'model']);
    expect(spec.messages[0]).toMatchObject({ from: 'app', to: 'model' });
    expect(s.appWorkflow.captions.extract).toMatch(/pay/);
  });

  test('guardrails check the input before the model is called and the output after', () => {
    const keys = APP_SEQUENCES.server;
    expect(keys.indexOf('guardIn')).toBeLessThan(keys.indexOf('callModel'));
    expect(keys.indexOf('guardOut')).toBeGreaterThan(keys.indexOf('generated'));
    expect(keys.indexOf('answer')).toBe(keys.length - 1);
  });
});

describe('RAG steps', () => {
  const spec = expectValid(ragSpec(s.rag));

  test.each(QUESTION_IDS)('%s with retrieval: seven stages, a real ranking and a cited answer', (question) => {
    const steps = buildRagSteps(question, true, s.rag);
    expectStepsFit(spec, steps);
    expect(steps).toHaveLength(7);
    const ranking = steps[2].payloads?.[0].lines ?? [];
    expect(ranking).toHaveLength(5);
    expect(ranking.filter((line) => line.startsWith('→'))).toHaveLength(2);
    // sorted by similarity, best first
    const scores = ranking.map((line) => Number(line.split(': ').pop()));
    expect([...scores].sort((a, b) => b - a)).toEqual(scores);
    expect(steps[4].payloads?.[0].lines.some((line) => line.startsWith('[1] '))).toBe(true);
    expect(steps[6].payloads?.[0].lines[0]).toMatch(/\[1\]/);
    expect(steps[6].payloads?.[0].tone).toBe('ok');
  });

  test('the returns question retrieves returns and refunds; the answer cites both', () => {
    const steps = buildRagSteps('returns', true, s.rag);
    expect(steps[3].payloads?.[0].lines[0]).toContain('Returns');
    expect(steps[3].payloads?.[0].lines[1]).toContain('Refunds');
    expect(steps[6].payloads?.[0].lines[0]).toContain('[1]');
    expect(steps[6].payloads?.[0].lines[0]).toContain('[2]');
  });

  test('with retrieval off the prompt is only the question and the answer has no citations', () => {
    for (const question of QUESTION_IDS) {
      const steps = buildRagSteps(question, false, s.rag);
      expectStepsFit(spec, steps);
      expect(steps).toHaveLength(4);
      expect(steps[1].payloads?.[0].lines).toEqual([s.rag.questions[question]]);
      expect(steps.some((step) => step.nodes?.includes('search') || step.nodes?.includes('kb'))).toBe(false);
      const answer = steps[3].payloads?.[0];
      expect(answer?.tone).toBe('warn');
      expect(answer?.lines.join(' ')).not.toMatch(/\[\d\]/);
    }
  });

  test('the knowledge base facts the grounded answers rely on are really in the chunks', () => {
    const chunks = buildRagSteps('returns', true, s.rag)[3].payloads?.[0].lines.join(' ') ?? '';
    expect(chunks).toContain('30 days');
    expect(chunks).toContain('7 days');
    const shipping = buildRagSteps('shipping', true, s.rag)[3].payloads?.[0].lines.join(' ') ?? '';
    expect(shipping).toContain('Singapore');
    expect(shipping).toContain('3 to 5 business days');
  });
});

describe('network diagram', () => {
  test('is valid and shows the weights and values that forward() computed', () => {
    const spec = expectValid(networkSpec(START_NET, START_INPUTS, 'relu', s.network));
    if (spec.kind !== 'flow') throw new Error('kind');
    expect(spec.edges.map((edge) => edge.label)).toEqual(['1.0', '0.5', '2.0', '-1.0', '1.5', '1.0']);
    const out = forward(START_NET, START_INPUTS, 'relu').out;
    expect(spec.nodes.find((node) => node.id === 'out')?.label).toBe(`Output = ${fmt(out)}`);
    const lines = workingLines(START_NET, START_INPUTS, 'relu', s.network);
    expect(lines).toHaveLength(6);
    expect(lines[0]).toBe('z1 = 0.8·1.0 + 0.6·2.0 + -0.5 = 1.50');
    expect(lines[5]).toBe(`output = sigmoid(${fmt(forward(START_NET, START_INPUTS, 'relu').zo)}) = ${fmt(out)}`);
  });
});
