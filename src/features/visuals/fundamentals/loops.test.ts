import { describe, expect, test } from '@jest/globals';

import { buildLoopSteps, iterationCount, loopSource, loopValues, type LoopInput } from './loops';

describe('loop iteration counts', () => {
  test('match range(start, end, step)', () => {
    expect(loopValues({ start: 1, end: 6, step: 1 })).toEqual([1, 2, 3, 4, 5]);
    expect(loopValues({ start: 0, end: 10, step: 3 })).toEqual([0, 3, 6, 9]);
    expect(loopValues({ start: 5, end: 0, step: -2 })).toEqual([5, 3, 1]);
    expect(loopValues({ start: 3, end: 3, step: 1 })).toEqual([]);
    expect(loopValues({ start: 5, end: 1, step: 1 })).toEqual([]);
    expect(loopValues({ start: 1, end: 5, step: -1 })).toEqual([]);
    expect(loopValues({ start: 1, end: 5, step: 0 })).toEqual([]);
  });

  test('equal ceil((end - start) / step) for every small input', () => {
    for (let start = -10; start <= 10; start += 1) {
      for (let end = -10; end <= 20; end += 1) {
        for (const step of [-5, -3, -2, -1, 1, 2, 3, 5]) {
          const expected = Math.max(0, Math.ceil((end - start) / step));
          expect(iterationCount({ start, end, step })).toBe(expected);
        }
      }
    }
  });
});

describe('loop steps', () => {
  const inputs: LoopInput[] = [];
  for (const kind of ['for', 'while'] as const) {
    for (const [start, end, step] of [[1, 6, 1], [0, 10, 3], [5, 0, -2], [4, 4, 1], [2, 1, 1], [-3, 4, 2]] as const) inputs.push({ kind, start, end, step });
  }

  test('for and while end with the same total, and the final step has finished every iteration', () => {
    for (const input of inputs) {
      const steps = buildLoopSteps(input);
      const values = loopValues(input);
      const last = steps.at(-1)!;
      expect(last.finished).toBe(values.length);
      expect(last.total).toBe(values.reduce((sum, value) => sum + value, 0));
      expect(last.condition).toBe(false);
    }
  });

  test('a while loop tests the condition once more than it runs the body', () => {
    const steps = buildLoopSteps({ kind: 'while', start: 1, end: 4, step: 1 });
    expect(steps.filter((step) => step.condition !== null)).toHaveLength(4);
    expect(steps.filter((step) => step.condition === true)).toHaveLength(3);
  });

  test('lines point at real source lines', () => {
    for (const input of inputs) {
      const source = loopSource(input);
      for (const step of buildLoopSteps(input)) for (const line of step.lines) expect(line).toBeLessThanOrEqual(source.length);
    }
  });

  test('a zero step is refused rather than looping forever', () => {
    expect(buildLoopSteps({ kind: 'while', start: 0, end: 5, step: 0 })).toHaveLength(1);
  });

  test('i takes the expected values in the for loop', () => {
    const steps = buildLoopSteps({ kind: 'for', start: 5, end: 0, step: -2 });
    expect(steps.filter((step) => step.lines[0] === 2 && step.condition === null).map((step) => step.i)).toEqual([5, 3, 1]);
  });
});
