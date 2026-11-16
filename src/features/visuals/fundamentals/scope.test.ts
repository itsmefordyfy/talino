import { describe, expect, test } from '@jest/globals';

import { buildScopeSteps, lookup, SCOPE_PROGRAMS, SCOPE_SOURCE, visibleScopes, type Frame } from './scope';

const names = (frames: readonly Frame[]) => visibleScopes(frames).flatMap((scope) => scope.vars.filter((variable) => !variable.shadowed).map((variable) => variable.name));

describe('scope resolution', () => {
  test('lookup goes innermost to global, and never into the caller', () => {
    const frames: Frame[] = [
      { name: 'global', scopes: [{ kind: 'global', label: 'G', vars: [{ name: 'g', value: '1' }, { name: 'caller', value: '9' }] }] },
      { name: 'outer', scopes: [{ kind: 'function', label: 'outer', vars: [{ name: 'secret', value: '2' }] }] },
      { name: 'inner', scopes: [{ kind: 'function', label: 'inner', vars: [{ name: 'x', value: '3' }] }, { kind: 'block', label: 'block', vars: [{ name: 'b', value: '4' }] }] },
    ];
    expect(lookup(frames, 'b')).toEqual({ found: { scope: 'block', value: '4' }, tried: ['block'] });
    expect(lookup(frames, 'x')?.found?.scope).toBe('inner');
    expect(lookup(frames, 'g')).toEqual({ found: { scope: 'G', value: '1' }, tried: ['block', 'inner', 'G'] });
    expect(lookup(frames, 'secret').found).toBeNull(); // outer's local is not in inner's scope chain
    expect(names(frames)).toEqual(['b', 'x', 'g', 'caller']);
  });

  test('an inner variable shadows an outer one of the same name', () => {
    const frames: Frame[] = [
      { name: 'global', scopes: [{ kind: 'global', label: 'G', vars: [{ name: 'n', value: '1' }] }] },
      { name: 'f', scopes: [{ kind: 'function', label: 'f', vars: [{ name: 'n', value: '2' }] }] },
    ];
    expect(lookup(frames, 'n').found?.value).toBe('2');
    const scopes = visibleScopes(frames);
    expect(scopes[0]?.vars[0]?.shadowed).toBe(false);
    expect(scopes[1]?.vars[0]?.shadowed).toBe(true);
  });
});

describe('program traces', () => {
  test('every step line points into the source, and the stack always has the global frame', () => {
    for (const program of SCOPE_PROGRAMS) {
      const steps = buildScopeSteps(program, 5);
      for (const step of steps) {
        expect(step.line).toBeGreaterThanOrEqual(1);
        expect(step.line).toBeLessThanOrEqual(SCOPE_SOURCE[program].length);
        expect(step.frames[0]?.name).toBe('global');
      }
    }
  });

  test('the function program takes the block path only when y > 12', () => {
    const big = buildScopeSteps('function', 5);
    expect(big.at(-1)?.output).toEqual(['30']);
    expect(big.some((step) => step.frames.at(-1)?.scopes.some((scope) => scope.kind === 'block'))).toBe(true);
    const small = buildScopeSteps('function', 1);
    expect(small.at(-1)?.output).toEqual(['11']);
    expect(small.some((step) => step.frames.at(-1)?.scopes.some((scope) => scope.kind === 'block'))).toBe(false);
    expect(buildScopeSteps('function', 2).at(-1)?.output).toEqual(['12']);
    expect(buildScopeSteps('function', 3).at(-1)?.output).toEqual(['26']);
  });

  test('function locals disappear after the return; the result lands in the global scope', () => {
    const last = buildScopeSteps('function', 5).at(-1)!;
    expect(last.frames).toHaveLength(1);
    expect(last.frames[0]?.scopes[0]?.vars.map((variable) => variable.name)).toEqual(['g', 'f', 'r']);
  });

  test('x and y exist only inside f; g is visible inside it', () => {
    const inside = buildScopeSteps('function', 5).find((step) => step.frames.length === 2 && step.frames[1]?.scopes[0]?.vars.some((variable) => variable.name === 'y'))!;
    expect(names(inside.frames)).toEqual(expect.arrayContaining(['x', 'y', 'g']));
    expect(names(inside.frames)).not.toContain('r');
  });

  test('shadowing prints 3, 2, 1', () => {
    expect(buildScopeSteps('shadowing').at(-1)?.output).toEqual(['3', '2', '1']);
  });

  test('a block variable is not visible after the block: ReferenceError', () => {
    const steps = buildScopeSteps('block');
    const last = steps.at(-1)!;
    expect(last.error).toBe('ReferenceError: bonus is not defined');
    expect(last.output).toEqual(['5']);
    expect(steps.some((step) => step.frames[0]?.scopes.some((scope) => scope.vars.some((variable) => variable.name === 'bonus')))).toBe(true);
    expect(last.frames[0]?.scopes).toHaveLength(1);
  });
});
