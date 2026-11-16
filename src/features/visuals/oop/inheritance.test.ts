import { describe, expect, test } from '@jest/globals';

import { buildInheritanceSteps, CLASS_IDS, execute, lookupChain, METHOD_NAMES, resolveMethod } from './inheritance';

const last = <T>(items: readonly T[]) => items[items.length - 1]!;

describe('method resolution', () => {
  test('the lookup chain runs from the class up to the root', () => {
    expect(lookupChain('Puppy')).toEqual(['Puppy', 'Dog', 'Animal']);
    expect(lookupChain('Cat')).toEqual(['Cat', 'Animal']);
    expect(lookupChain('Animal')).toEqual(['Animal']);
  });

  test('the nearest class that defines the method provides it', () => {
    expect(resolveMethod('Puppy', 'eat').provider).toBe('Animal');
    expect(resolveMethod('Puppy', 'fetch').provider).toBe('Dog');
    expect(resolveMethod('Puppy', 'speak').provider).toBe('Puppy');
    expect(resolveMethod('Dog', 'speak').provider).toBe('Dog');
    expect(resolveMethod('Cat', 'speak').provider).toBe('Cat');
    expect(resolveMethod('Animal', 'speak').provider).toBe('Animal');
    expect(resolveMethod('Puppy', 'eat').checked).toEqual([{ cls: 'Puppy', defines: false }, { cls: 'Dog', defines: false }, { cls: 'Animal', defines: true }]);
  });

  test('a method nobody on the chain defines is not found (siblings do not share methods)', () => {
    expect(resolveMethod('Cat', 'fetch').provider).toBeNull();
    expect(resolveMethod('Dog', 'climb').provider).toBeNull();
    expect(resolveMethod('Animal', 'play').provider).toBeNull();
    expect(execute('Cat', 'fetch')).toBeNull();
  });

  test('overriding replaces the parent version, and super adds to it', () => {
    expect(execute('Animal', 'speak')?.output).toBe('...');
    expect(execute('Dog', 'speak')?.output).toBe('Woof');
    expect(execute('Cat', 'speak')?.output).toBe('Meow');
    expect(execute('Puppy', 'speak')).toEqual({ output: 'Woof (squeaky)', ran: ['Puppy', 'Dog'] });
  });

  test('every class inherits everything its ancestors define', () => {
    for (const cls of CLASS_IDS) {
      for (const method of ['eat', 'sleep'] as const) expect(execute(cls, method)).not.toBeNull();
    }
  });

  test('steps end with the output, or with a failure when the method is missing', () => {
    for (const cls of CLASS_IDS) {
      for (const method of METHOD_NAMES) {
        const steps = buildInheritanceSteps(cls, method);
        const result = execute(cls, method);
        expect(last(steps).failed).toBe(result === null);
        expect(last(steps).output).toBe(result?.output ?? null);
        expect(steps[0]?.checking).toBeNull();
        const checkedOrder = steps.filter((step) => step.checking !== null).map((step) => step.checking);
        expect(checkedOrder).toEqual(resolveMethod(cls, method).checked.map((entry) => entry.cls));
      }
    }
  });

  test('a super call shows both classes running', () => {
    const steps = buildInheritanceSteps('Puppy', 'speak');
    expect(steps.some((step) => step.running.length === 1 && step.running[0] === 'Puppy' && step.caption.includes('super'))).toBe(true);
    expect(last(steps).running).toEqual(['Puppy', 'Dog']);
  });
});
