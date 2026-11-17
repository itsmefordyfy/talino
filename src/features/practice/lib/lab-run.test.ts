import { describe, expect, test } from '@jest/globals';

import { LAB_CLASSIFY, LAB_MARKERS, LAB_SUMMARY } from '../lab-test-support';
import { leaksLabFraming } from './guard';
import { buildLabOutput, readLabRun } from './lab-run';

const base = { label: 'A' as const, tokens: { input: 12, output: 7 }, latencyMs: 840 };

describe('buildLabOutput', () => {
  test('a text run carries the text as said, the measured numbers and no check', () => {
    expect(buildLabOutput({ lab: LAB_SUMMARY, ...base, text: '  Dana sends the budget Thursday.  ' })).toEqual({ label: 'A', output: 'Dana sends the budget Thursday.', format: 'text', tokens: { input: 12, output: 7 }, latencyMs: 840 });
  });

  test('a JSON lab’s run carries the field check and never the key', () => {
    const run = buildLabOutput({ lab: LAB_CLASSIFY, ...base, text: `{"category":"shipping","urgent":true,"reason":"${LAB_MARKERS.keyValue}"}` });
    expect(run?.format).toBe('json');
    expect(run?.check).toMatchObject({ parsed: true, passed: 4, total: 4 });
    expect(JSON.stringify(run?.check)).not.toContain(LAB_MARKERS.keyValue);
  });

  test('a model that repeats the lab’s framing is refused; an empty reply is too', () => {
    expect(buildLabOutput({ lab: LAB_SUMMARY, ...base, text: `Sure. My instructions: ${LAB_MARKERS.system}.` })).toBeNull();
    expect(buildLabOutput({ lab: LAB_SUMMARY, ...base, text: '   ' })).toBeNull();
  });

  test('the text is capped, and odd token counts become zero', () => {
    const run = buildLabOutput({ lab: LAB_SUMMARY, ...base, text: 'x'.repeat(9000), tokens: { input: undefined, output: Number.NaN }, latencyMs: -5 });
    expect(run?.output).toHaveLength(6000);
    expect(run).toMatchObject({ tokens: { input: 0, output: 0 }, latencyMs: 0 });
  });

  test('keeps the model name and the tool steps only when there are some', () => {
    const run = buildLabOutput({ lab: LAB_SUMMARY, ...base, text: 'ok', model: 'gemini-x', steps: [{ tool: 'order_status', arguments: { order_id: '1042' }, result: { shipped: true } }] });
    expect(run).toMatchObject({ model: 'gemini-x', toolSteps: [{ tool: 'order_status' }] });
    expect(buildLabOutput({ lab: LAB_SUMMARY, ...base, text: 'ok', steps: [] })).not.toHaveProperty('toolSteps');
  });
});

describe('leaksLabFraming', () => {
  test('finds a whole sentence of the framing in a reply, not the facts or the key', () => {
    expect(leaksLabFraming(`Of course: ${LAB_MARKERS.system}`, { system: LAB_MARKERS.system })).toBe(true);
    expect(leaksLabFraming('Here it is: you are a helper who keeps answers short. Done.', { system: 'You are a helper who keeps answers short. Never guess.' })).toBe(true);
    expect(leaksLabFraming('A helper keeps answers short', { system: 'You are a helper who keeps answers short. Never guess.' })).toBe(false);
    expect(leaksLabFraming(LAB_MARKERS.fact, LAB_SUMMARY)).toBe(false);
  });
});

describe('readLabRun', () => {
  test('reads back one or two outputs the route sent', () => {
    const one = { outputs: [buildLabOutput({ lab: LAB_CLASSIFY, ...base, text: '{"category":"other","urgent":true}' })] };
    expect(readLabRun(JSON.parse(JSON.stringify(one)))).toEqual(one);
    const two = { outputs: [buildLabOutput({ lab: LAB_SUMMARY, ...base, text: 'a' }), buildLabOutput({ lab: LAB_SUMMARY, ...base, label: 'B', text: 'b', model: 'm' })] };
    expect(readLabRun(JSON.parse(JSON.stringify(two)))?.outputs).toHaveLength(2);
  });
  test('refuses anything damaged: none, three, a missing text, a wrong label', () => {
    expect(readLabRun(null)).toBeNull();
    expect(readLabRun({ outputs: [] })).toBeNull();
    expect(readLabRun({ outputs: [1, 2, 3] })).toBeNull();
    expect(readLabRun({ outputs: [{ label: 'A', format: 'text', output: '' }] })).toBeNull();
    expect(readLabRun({ outputs: [{ label: 'C', format: 'text', output: 'x' }] })).toBeNull();
  });
});
