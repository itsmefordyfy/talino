import { describe, expect, test } from '@jest/globals';

import { buildTrace, callCount, codeFor, expectedResult, INPUT_RANGE, listFor, RECURSION_FNS, type RecursionFn, type RecursionSpec } from './recursion-stack';

const last = <T>(items: readonly T[]) => items[items.length - 1]!;
const run = (fn: RecursionFn, n: number, memo = false) => buildTrace({ fn, n, memo });

describe('every function over its whole input range', () => {
  test('the last step holds the right answer, an empty stack and the call total', () => {
    for (const fn of RECURSION_FNS) {
      for (let n = INPUT_RANGE[fn].min; n <= INPUT_RANGE[fn].max; n += 1) {
        for (const memo of [false, true]) {
          const steps = run(fn, n, memo);
          const final = last(steps);
          expect(final.done).toBe(true);
          expect(final.stack).toEqual([]);
          expect(final.result).toBe(expectedResult(fn, n));
          expect(final.calls).toBe(callCount({ fn, n, memo }));
          expect(steps.filter((step) => step.done)).toHaveLength(1);
        }
      }
    }
  });
  test('the first step is an empty stack with no calls', () => {
    for (const fn of RECURSION_FNS) {
      const first = run(fn, INPUT_RANGE[fn].start)[0]!;
      expect(first.stack).toEqual([]);
      expect(first.calls).toBe(0);
      expect(first.line).toBeNull();
    }
  });
  test('the running line is a real line of the code', () => {
    for (const fn of RECURSION_FNS) {
      for (const memo of [false, true]) {
        const lines = codeFor(fn, memo).length;
        for (const step of run(fn, INPUT_RANGE[fn].start, memo)) {
          if (step.line !== null) {
            expect(step.line).toBeGreaterThanOrEqual(1);
            expect(step.line).toBeLessThanOrEqual(lines);
          }
        }
      }
    }
  });
  test('the stack only changes by one frame at a time and never holds a frame twice', () => {
    for (const fn of RECURSION_FNS) {
      const steps = run(fn, INPUT_RANGE[fn].max, true);
      for (let index = 1; index < steps.length - 1; index += 1) {
        const ids = steps[index]!.stack.map((frame) => frame.id);
        expect(new Set(ids).size).toBe(ids.length);
        expect(Math.abs(ids.length - steps[index - 1]!.stack.length)).toBeLessThanOrEqual(1);
      }
    }
  });
  test('a bad input is clamped into the range', () => {
    expect(last(run('factorial', 99)).result).toBe('720');
    expect(last(run('factorial', 0)).result).toBe('1');
  });
});

describe('factorial', () => {
  test('factorial(4) calls itself four times and the stack grows to four frames', () => {
    const steps = run('factorial', 4);
    expect(last(steps).result).toBe('24');
    expect(last(steps).calls).toBe(4);
    expect(last(steps).deepest).toBe(4);
    expect(Math.max(...steps.map((step) => step.stack.length))).toBe(4);
  });
  test('the stack grows then unwinds, each return carrying its value', () => {
    const steps = run('factorial', 3);
    const labels = steps.map((step) => step.stack.map((frame) => frame.label).join(' > '));
    expect(labels).toEqual(['', 'factorial(3)', 'factorial(3) > factorial(2)', 'factorial(3) > factorial(2) > factorial(1)', 'factorial(3) > factorial(2) > factorial(1)', 'factorial(3) > factorial(2)', 'factorial(3)', '']);
    const returns = steps.flatMap((step) => step.stack.filter((frame) => frame.returning).map((frame) => `${frame.label}=${frame.value}`));
    expect(returns).toEqual(['factorial(1)=1', 'factorial(2)=2', 'factorial(3)=6']);
  });
  test('a waiting frame shows what it will add up once the call below answers', () => {
    const steps = run('factorial', 3);
    expect(steps[3]!.stack[0]!.wait).toBe('3 × factorial(2)');
    expect(steps[5]!.stack[1]!.wait).toBe('2 × 1');
  });
});

describe('fibonacci and memoization', () => {
  test('without memoization the calls follow the Fibonacci tree', () => {
    const expected: Record<number, number> = { 1: 1, 2: 3, 3: 5, 4: 9, 5: 15, 6: 25 };
    for (const [n, calls] of Object.entries(expected)) expect(callCount({ fn: 'fibonacci', n: Number(n), memo: false })).toBe(calls);
  });
  test('with memoization it takes 2n - 1 calls (and fib(1) is a single call)', () => {
    for (let n = 2; n <= 6; n += 1) expect(callCount({ fn: 'fibonacci', n, memo: true })).toBe(2 * n - 1);
    expect(callCount({ fn: 'fibonacci', n: 1, memo: true })).toBe(1);
  });
  test('memoization never changes the answer and saves calls from fib(4) up', () => {
    for (let n = 1; n <= 6; n += 1) {
      expect(last(run('fibonacci', n, true)).result).toBe(last(run('fibonacci', n, false)).result);
    }
    expect(callCount({ fn: 'fibonacci', n: 6, memo: true })).toBeLessThan(callCount({ fn: 'fibonacci', n: 6, memo: false }));
  });
  test('the memo fills as answers are saved and a hit is answered at once', () => {
    const steps = run('fibonacci', 5, true);
    expect(last(steps).memo.map(([key]) => key)).toEqual([2, 3, 4, 5]);
    expect(last(steps).memo.map(([, value]) => value)).toEqual([1, 2, 3, 5]);
    const hit = steps.find((step) => step.stack.some((frame) => frame.hit && frame.returning));
    expect(hit).toBeDefined();
    expect(run('fibonacci', 5, false).every((step) => step.memo.length === 0)).toBe(true);
  });
});

describe('sum of a list', () => {
  test('makes one call per value plus the empty list, on shrinking lists', () => {
    for (let length = 3; length <= 5; length += 1) {
      const steps = run('sum', length);
      expect(last(steps).calls).toBe(length + 1);
      expect(last(steps).result).toBe(String(listFor(length).reduce((total, value) => total + value, 0)));
    }
    const labels = run('sum', 3).find((step) => step.stack.length === 4)?.stack.map((frame) => frame.label);
    expect(labels).toEqual(['sum([4, 2, 7])', 'sum([2, 7])', 'sum([7])', 'sum([])']);
  });
});

describe('countdown', () => {
  test('prints on the way down, in order, and returns nothing', () => {
    const steps = run('countdown', 3);
    expect(last(steps).output).toEqual(['3', '2', '1', 'Liftoff!']);
    expect(last(steps).calls).toBe(4);
    expect(steps.some((step) => step.stack.some((frame) => frame.returning && frame.value === null))).toBe(true);
    expect(steps.map((step) => step.output.length)).toEqual([...steps.map((step) => step.output.length)].sort((a, b) => a - b));
  });
});

describe('purity', () => {
  test('building a trace twice gives the same steps', () => {
    const spec: RecursionSpec = { fn: 'fibonacci', n: 4, memo: true };
    expect(buildTrace(spec)).toEqual(buildTrace(spec));
  });
  test('snapshots are independent of each other', () => {
    const steps = run('factorial', 3);
    expect(steps[1]!.stack[0]!.returning).toBe(false);
    expect(steps[6]!.stack[0]!.returning).toBe(true);
  });
});
