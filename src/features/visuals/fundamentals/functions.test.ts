import { describe, expect, test } from '@jest/globals';

import { buildFunctionSteps, callText, FUNCTION_PRESETS, functionSource } from './functions';

const preset = (id: string) => FUNCTION_PRESETS.find((entry) => entry.id === id)!;

describe('functions', () => {
  test('add binds the parameters, runs the body and returns', () => {
    const build = buildFunctionSteps(preset('add'), ['3', '4']);
    if (!build.ok) throw new Error('expected ok');
    expect(build.returned).toBe(7);
    expect(build.steps.map((step) => step.phase)).toEqual(['defined', 'call', 'bind', 'run', 'return']);
    expect(build.steps[2]?.bound).toEqual([{ name: 'a', value: '3' }, { name: 'b', value: '4' }]);
    expect(build.steps[3]?.locals).toEqual([{ name: 'total', value: '7' }]);
    expect(build.steps.at(-1)?.output).toBe('7');
  });

  test('text arguments are quoted and joined', () => {
    const build = buildFunctionSteps(preset('greet'), ['Ana', '?']);
    if (!build.ok) throw new Error('expected ok');
    expect(build.returned).toBe('Hello, Ana?');
    expect(build.steps.at(-1)?.output).toBe('"Hello, Ana?"');
    expect(callText(preset('greet'), ['Ana', '?'])).toBe('greet("Ana", "?")');
  });

  test('isEven runs two body lines and returns a boolean', () => {
    const odd = buildFunctionSteps(preset('isEven'), ['7']);
    const even = buildFunctionSteps(preset('isEven'), ['10']);
    if (!odd.ok || !even.ok) throw new Error('expected ok');
    expect(odd.returned).toBe(false);
    expect(even.returned).toBe(true);
    expect(odd.steps).toHaveLength(6);
    expect(odd.steps.at(-1)?.output).toBe('False');
  });

  test('area multiplies, decimals work and the lines point into the source', () => {
    const build = buildFunctionSteps(preset('area'), ['2.5', '4']);
    if (!build.ok) throw new Error('expected ok');
    expect(build.returned).toBe(10);
    for (const step of build.steps) if (step.line !== null) expect(step.line).toBeLessThanOrEqual(functionSource(preset('area')).length);
  });

  test('a number parameter that is not a number is reported, not run', () => {
    const build = buildFunctionSteps(preset('add'), ['3', 'x']);
    expect(build.ok).toBe(false);
    if (!build.ok) expect(build.param).toBe('b');
    expect(buildFunctionSteps(preset('add'), ['', '1']).ok).toBe(false);
  });

  test('the same arguments always give the same result', () => {
    for (const entry of FUNCTION_PRESETS) {
      const args = entry.params.map((param) => param.initial);
      const a = buildFunctionSteps(entry, args);
      const b = buildFunctionSteps(entry, args);
      expect(a).toEqual(b);
    }
  });
});
