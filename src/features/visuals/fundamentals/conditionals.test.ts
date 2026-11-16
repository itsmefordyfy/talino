import { describe, expect, test } from '@jest/globals';

import { buildConditionalSteps, CONDITIONAL_PROGRAMS, conditionalSource, takenBranch } from './conditionals';

const grade = CONDITIONAL_PROGRAMS[0]!;
const ticket = CONDITIONAL_PROGRAMS[1]!;

describe('conditionals', () => {
  test('the first true condition wins, the rest are skipped', () => {
    expect(takenBranch(grade, 95)).toBe(0);
    expect(takenBranch(grade, 90)).toBe(0);
    expect(takenBranch(grade, 89)).toBe(1);
    expect(takenBranch(grade, 75)).toBe(1);
    expect(takenBranch(grade, 60)).toBe(2);
    expect(takenBranch(grade, 59)).toBe(3);
    expect(takenBranch(ticket, 4)).toBe(0);
    expect(takenBranch(ticket, 5)).toBe(1);
    expect(takenBranch(ticket, 59)).toBe(2);
    expect(takenBranch(ticket, 60)).toBe(3);
  });

  test('steps check conditions in order and stop at the true one', () => {
    const steps = buildConditionalSteps(grade, 82);
    expect(steps).toHaveLength(4); // start, check >=90, check >=75, run
    expect(steps[2]?.tried).toEqual(['false', 'true', 'pending']);
    expect(steps[3]?.taken).toBe(1);
    expect(steps[3]?.tried[2]).toBe('pending');
  });

  test('else runs after every condition is false', () => {
    const steps = buildConditionalSteps(grade, 10);
    expect(steps).toHaveLength(1 + 3 + 1);
    const last = steps[steps.length - 1]!;
    expect(last.tried).toEqual(['false', 'false', 'false']);
    expect(last.taken).toBe(3);
  });

  test('steps agree with takenBranch for every value', () => {
    for (const program of CONDITIONAL_PROGRAMS) {
      for (let value = program.min; value <= program.max; value += 1) {
        const last = buildConditionalSteps(program, value).at(-1)!;
        expect(last.taken).toBe(takenBranch(program, value));
      }
    }
  });

  test('source lines line up with the highlighted lines', () => {
    const source = conditionalSource(grade);
    expect(source[0]).toBe('if score >= 90:');
    expect(source[2]).toBe('elif score >= 75:');
    expect(source.at(-2)).toBe('else:');
    const steps = buildConditionalSteps(grade, 82);
    expect(source[(steps[2]?.lines[0] ?? 0) - 1]).toBe('elif score >= 75:');
    expect(source[(steps[3]?.lines[0] ?? 0) - 1]).toBe('    grade = "B"');
  });
});
