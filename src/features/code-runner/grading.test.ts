import { describe, expect, test } from '@jest/globals';

import { runCodeTests, runJs, runnerStrings } from './index';

const fnTests = (cases: { args?: unknown[]; expected: unknown; hidden?: boolean; label?: string }[], fn = 'solve') => ({ kind: 'function' as const, fn, cases });

describe('function tests', () => {
  test('all pass', () => {
    const report = runCodeTests(`function solve(a, b) { return a + b }`, fnTests([{ args: [1, 2], expected: 3 }, { args: [-1, 1], expected: 0, label: 'zero' }]));
    expect(report).toMatchObject({ passed: 2, total: 2, fraction: 1, error: null });
    expect(report.results.map((r) => [r.label, r.pass, r.actual])).toEqual([['Test 1', true, 3], ['zero', true, 0]]);
  });
  test('partial credit and the actual value on a failure', () => {
    const report = runCodeTests(`const solve = (n) => n * 2`, fnTests([{ args: [1], expected: 2 }, { args: [2], expected: 5 }, { args: [3], expected: 6 }, { args: [4], expected: 9 }]));
    expect(report).toMatchObject({ passed: 2, total: 4, fraction: 0.5 });
    expect(report.results[1]).toMatchObject({ pass: false, expected: 5, actual: 4, error: null });
  });
  test('arrays, objects, strings, booleans, null and nested data are compared deeply', () => {
    const report = runCodeTests(
      `function solve(x) { return x }`,
      fnTests([
        { args: [[1, [2, 3]]], expected: [1, [2, 3]] },
        { args: [{ a: 1, b: { c: [true, null] } }], expected: { b: { c: [true, null] }, a: 1 } },
        { args: ['hi'], expected: 'hi' },
        { args: [null], expected: null },
        { args: [[1, 2]], expected: [1, 2, 3] },
        { args: [{ a: 1 }], expected: { a: 1, b: 2 } },
        { args: [1], expected: '1' },
      ]),
    );
    expect(report.results.map((r) => r.pass)).toEqual([true, true, true, true, false, false, false]);
  });
  test('numbers compare with a tiny tolerance, undefined object keys are ignored', () => {
    const report = runCodeTests(`function solve(a, b) { return a + b } function obj() { return { a: 1, b: undefined } }`, fnTests([{ args: [0.1, 0.2], expected: 0.3 }]));
    expect(report.passed).toBe(1);
    expect(runCodeTests(`function obj() { return { a: 1, b: undefined } }`, fnTests([{ expected: { a: 1 } }], 'obj')).passed).toBe(1);
  });
  test('arguments are copied for each case, so one case cannot change the next', () => {
    const shared = [3, 1, 2];
    const report = runCodeTests(`function solve(a) { a.sort(); return a }`, fnTests([{ args: [shared], expected: [1, 2, 3] }, { args: [shared], expected: [1, 2, 3] }]));
    expect(report.passed).toBe(2);
    expect(shared).toEqual([3, 1, 2]);
  });
  test('one case that throws does not stop the others', () => {
    const report = runCodeTests(`function solve(x) { return x.length }`, fnTests([{ args: ['abc'], expected: 3 }, { args: [null], expected: 0 }, { args: ['ab'], expected: 2 }]));
    expect(report).toMatchObject({ passed: 2, total: 3 });
    expect(report.results[1]).toMatchObject({ pass: false, error: "TypeError: Cannot read properties of null (reading 'length')" });
  });
  test('an endless loop in one case fails only that case', () => {
    const report = runCodeTests(`function solve(x) { while (x) {} return 1 }`, fnTests([{ args: [0], expected: 1 }, { args: [1], expected: 1 }, { args: [0], expected: 1 }]));
    expect(report.results.map((r) => r.pass)).toEqual([true, false, true]);
    expect(report.results[1].error).toBe('Your program ran too long (possible infinite loop)');
  });
  test('each case has its own step budget', () => {
    const cases = Array.from({ length: 30 }, () => ({ args: [5000], expected: 5000 }));
    const report = runCodeTests(`function solve(n) { let c = 0; for (let i = 0; i < n; i++) c++; return c }`, fnTests(cases), { maxSteps: 40_000 });
    expect(report.passed).toBe(30);
  });
  test('hidden cases keep their result but reveal neither expected nor actual', () => {
    const report = runCodeTests(`function solve(x) { return x + 1 }`, fnTests([{ args: [1], expected: 2 }, { args: [5], expected: 99, hidden: true }, { args: [5], expected: 6, hidden: true, label: 'Edge' }]));
    expect(report).toMatchObject({ passed: 2, total: 3 });
    expect(report.results[1]).toEqual({ label: 'Hidden test 2', pass: false, expected: undefined, actual: undefined, error: null, hidden: true });
    expect(report.results[2]).toMatchObject({ label: 'Edge', pass: true, hidden: true });
  });
  test('a missing or non-function name fails every case with a clear message', () => {
    const report = runCodeTests(`function other() {}`, fnTests([{ args: [1], expected: 1 }, { expected: 2 }]));
    expect(report).toMatchObject({ passed: 0, total: 2, fraction: 0 });
    expect(report.error?.message).toBe('Your code needs a function named solve');
    expect(report.results.every((r) => !r.pass && r.error)).toBe(true);
    expect(runCodeTests(`const solve = 5`, fnTests([{ expected: 1 }])).error?.message).toMatch(/function named solve/);
  });
  test('code that does not even run reports its error and fails all cases', () => {
    const report = runCodeTests(`function solve( {`, fnTests([{ expected: 1 }]));
    expect(report.error?.name).toBe('SyntaxError');
    expect(report.passed).toBe(0);
    const thrown = runCodeTests(`throw new Error('top level')\nfunction solve() {}`, fnTests([{ expected: 1 }]));
    expect(thrown.error).toMatchObject({ message: 'top level', line: 1 });
  });
  test('console output while loading and calling is returned', () => {
    const report = runCodeTests(`console.log('loaded'); function solve(x) { console.log('x=' + x); return x }`, fnTests([{ args: [1], expected: 1 }]));
    expect(report.output).toEqual(['loaded', 'x=1']);
  });
  test('classes, closures and state across cases work as in a real run', () => {
    const report = runCodeTests(`let calls = 0; function solve() { return ++calls }`, fnTests([{ expected: 1 }, { expected: 2 }]));
    expect(report.passed).toBe(2);
    expect(runCodeTests(`class Counter { constructor(s) { this.s = s } inc() { return this.s + 1 } } const solve = (n) => new Counter(n).inc()`, fnTests([{ args: [4], expected: 5 }])).passed).toBe(1);
  });
  test('returning a function, Map or Set is turned into plain data', () => {
    const report = runCodeTests(`const solve = () => new Set([1, 2])`, fnTests([{ expected: [1, 2] }]));
    expect(report.passed).toBe(1);
    expect(runCodeTests(`const solve = () => new Map([['a', 1]])`, fnTests([{ expected: [['a', 1]] }])).passed).toBe(1);
  });
  test('no cases is a pass of nothing', () => {
    expect(runCodeTests(`function solve() {}`, fnTests([]))).toMatchObject({ passed: 0, total: 0, fraction: 1 });
  });
});

describe('output tests', () => {
  test('exact match', () => {
    const report = runCodeTests(`console.log('Hello'); console.log(1 + 2)`, { kind: 'output', expected: ['Hello', '3'] });
    expect(report).toMatchObject({ passed: 2, total: 2, fraction: 1, error: null, output: ['Hello', '3'] });
  });
  test('partial credit per line, extra and missing lines count against it', () => {
    const wrong = runCodeTests(`console.log('a'); console.log('x'); console.log('c')`, { kind: 'output', expected: ['a', 'b', 'c'] });
    expect(wrong).toMatchObject({ passed: 2, total: 3 });
    expect(wrong.fraction).toBeCloseTo(2 / 3);
    expect(wrong.results[1]).toMatchObject({ pass: false, expected: 'b', actual: 'x' });
    const extra = runCodeTests(`console.log('a'); console.log('b')`, { kind: 'output', expected: ['a'] });
    expect(extra).toMatchObject({ passed: 1, total: 2 });
    const missing = runCodeTests(`console.log('a')`, { kind: 'output', expected: ['a', 'b'] });
    expect(missing.results[1]).toMatchObject({ pass: false, expected: 'b', actual: undefined });
  });
  test('multi-line console.log entries count per line, trailing spaces are ignored', () => {
    expect(runCodeTests(`console.log('a\\nb  ')`, { kind: 'output', expected: ['a', 'b'] }).passed).toBe(2);
  });
  test('an error part way keeps the lines printed so far and reports the error', () => {
    const report = runCodeTests(`console.log('ok'); boom()`, { kind: 'output', expected: ['ok', 'more'] });
    expect(report.error?.message).toBe('boom is not defined');
    expect(report.passed).toBe(1);
  });
  test('nothing expected and nothing printed passes; an error with nothing expected fails', () => {
    expect(runCodeTests(`const x = 1`, { kind: 'output', expected: [] })).toMatchObject({ fraction: 1 });
    expect(runCodeTests(`x.y`, { kind: 'output', expected: [] })).toMatchObject({ fraction: 0 });
  });
});

describe('Tagalog messages', () => {
  const fil = runnerStrings.fil;
  test('labels, the missing function and the run limits are in Tagalog', () => {
    const missing = runCodeTests('const a = 1', fnTests([{ args: [1], expected: 1 }, { args: [2], expected: 2, hidden: true }]), undefined, fil);
    expect(missing.error?.message).toBe('Kailangan ng function na may pangalang solve sa code mo');
    expect(missing.results.map((r) => r.label)).toEqual(['Test 1', 'Hidden test 2']);
    const loop = runJs('while (true) {}', undefined, fil);
    expect(loop.error?.message).toBe(fil.ranTooLong);
    expect(runJs('import x from "y"', undefined, fil).error?.message).toBe(fil.importExport);
    expect(runJs('const r = /a/', undefined, fil).error?.message).toBe('Hindi pa supported ang Regular expressions sa Talino playground');
  });
  test('JavaScript-style errors stay English', () => {
    expect(runJs('missing + 1', undefined, fil).error?.message).toBe('missing is not defined');
  });
});
