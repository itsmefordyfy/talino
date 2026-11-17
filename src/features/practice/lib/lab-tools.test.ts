import { describe, expect, test } from '@jest/globals';

import { LAB_MARKERS, LAB_TOOLS } from '../lab-test-support';
import { MAX_CALLS_PER_ROUND, MAX_TOOL_ROUNDS, readToolSteps, runLabTool, sanitizeToolSteps, toolDeclarations } from './lab-tools';

const tools = LAB_TOOLS.tools ?? [];

describe('toolDeclarations', () => {
  test('declares each tool with its parameters and never its fixtures', () => {
    const declared = toolDeclarations(tools);
    expect(declared).toHaveLength(2);
    expect(declared[0]).toMatchObject({ name: 'order_status', parameters: { type: 'OBJECT', properties: { order_id: { type: 'STRING' } }, required: ['order_id'] } });
    const text = JSON.stringify(declared);
    for (const marker of [LAB_MARKERS.fixtureResult, LAB_MARKERS.fixtureOther, LAB_MARKERS.fixtureHours]) expect(text).not.toContain(marker);
    expect(text).not.toContain('fixtures');
  });
  test('numbers are declared as numbers', () => {
    const [declared] = toolDeclarations([{ name: 'add_tax', description: 'Adds tax.', params: [{ name: 'amount', type: 'number', description: 'Amount.' }], fixtures: [] }]);
    expect(declared.parameters.properties.amount.type).toBe('NUMBER');
  });
  test('the limits are small and fixed', () => {
    expect(MAX_TOOL_ROUNDS).toBe(3);
    expect(MAX_CALLS_PER_ROUND).toBeLessThanOrEqual(3);
  });
});

describe('runLabTool', () => {
  test('answers a call whose arguments equal a fixture, from the fixture only', () => {
    expect(runLabTool(LAB_TOOLS, 'order_status', { order_id: '1042' })).toEqual({ tool: 'order_status', arguments: { order_id: '1042' }, result: { status: LAB_MARKERS.fixtureResult, shipped: true } });
  });
  test('ignores case and spaces in a text argument, and takes a number sent for a text parameter', () => {
    expect(runLabTool(LAB_TOOLS, 'store_hours', { day: ' Monday ' }).result).toEqual({ hours: LAB_MARKERS.fixtureHours });
    expect(runLabTool(LAB_TOOLS, 'order_status', { order_id: 1042 }).result).toMatchObject({ shipped: true });
  });
  test('an argument no fixture has is "not found", and says nothing about the fixtures', () => {
    const step = runLabTool(LAB_TOOLS, 'order_status', { order_id: '9999' });
    expect(step.result).toEqual({ error: 'not found' });
    expect(JSON.stringify(step)).not.toContain(LAB_MARKERS.fixtureResult);
    expect(runLabTool(LAB_TOOLS, 'order_status', {}).result).toEqual({ error: 'not found' });
    expect(runLabTool(LAB_TOOLS, 'order_status', 'not an object').result).toEqual({ error: 'not found' });
  });
  test('a tool the lab does not have is "not found"', () => {
    expect(runLabTool(LAB_TOOLS, 'delete_everything', { x: 1 })).toEqual({ tool: 'delete_everything', arguments: {}, result: { error: 'not found' } });
  });
  test('arguments the tool does not declare are dropped, and long ones are capped', () => {
    const step = runLabTool(LAB_TOOLS, 'order_status', { order_id: '1042', extra: 'x', other: 1 });
    expect(step.arguments).toEqual({ order_id: '1042' });
    expect(String(runLabTool(LAB_TOOLS, 'order_status', { order_id: 'y'.repeat(900) }).arguments.order_id)).toHaveLength(200);
  });
});

describe('sanitizeToolSteps and readToolSteps', () => {
  const step = { tool: 'order_status', arguments: { order_id: '1042' }, result: { status: 'shipped', shipped: true } };
  test('keeps steps for the lab’s own tools, scalar values only, at most six', () => {
    expect(sanitizeToolSteps(LAB_TOOLS, [step])).toEqual([step]);
    expect(sanitizeToolSteps(LAB_TOOLS, [{ ...step, tool: 'other' }])).toEqual([]);
    expect(sanitizeToolSteps(LAB_TOOLS, [{ ...step, result: { nested: { a: 1 }, ok: true } }])[0].result).toEqual({ ok: true });
    expect(sanitizeToolSteps(LAB_TOOLS, Array.from({ length: 12 }, () => step))).toHaveLength(6);
    expect(sanitizeToolSteps(LAB_TOOLS, 'nope')).toEqual([]);
    expect(sanitizeToolSteps(LAB_TOOLS, [null, 3])).toEqual([]);
  });
  test('the phone reads back what the route sent', () => {
    expect(readToolSteps(JSON.parse(JSON.stringify([step])))).toEqual([step]);
    expect(readToolSteps(undefined)).toEqual([]);
    expect(readToolSteps([{ tool: 3 }])).toEqual([]);
  });
});
