import { describe, expect, test } from '@jest/globals';

import { ACTIVITY_KINDS, type Activity, type ArrangeActivity, type CodeChallengeActivity, type FillBlankActivity, type FixBugActivity, type MatchActivity, type PredictOutputActivity, type ScenarioActivity, type SqlChallengeActivity, type TapRevealActivity } from '../types';
import { SAMPLE_ACTIVITIES } from '../samples';
import { defineActivity, validateActivity, validateActivitySet, validateStructure } from './validate';

function sample<T extends Activity>(id: string): T {
  const found = SAMPLE_ACTIVITIES.find((activity) => activity.id === id);
  if (!found) throw new Error(`no sample ${id}`);
  return found as T;
}

const text = (problems: string[]) => problems.join(' | ');

describe('the sample activities', () => {
  test('there are two of every kind', () => {
    for (const kind of ACTIVITY_KINDS) expect(SAMPLE_ACTIVITIES.filter((a) => a.kind === kind)).toHaveLength(2);
  });
  test('ids are unique', () => {
    expect(validateActivitySet(SAMPLE_ACTIVITIES)).toEqual([]);
  });
  for (const activity of SAMPLE_ACTIVITIES.filter((a) => a.kind !== 'sql-challenge')) {
    test(`${activity.id} passes validateActivity`, () => {
      expect(validateActivity(activity)).toEqual([]);
    });
  }
  test('every sample has a gentle-to-nearly-the-answer ladder of at least 2 hints (3 for anything but tap-reveal)', () => {
    for (const activity of SAMPLE_ACTIVITIES) {
      expect(activity.hints.length).toBeGreaterThanOrEqual(activity.kind === 'tap-reveal' ? 1 : 3);
    }
  });
  test('the SQL samples are structurally valid (their queries run in the deep validation)', () => {
    for (const activity of SAMPLE_ACTIVITIES.filter((a) => a.kind === 'sql-challenge')) expect(validateStructure(activity)).toEqual([]);
  });
});

describe('common problems', () => {
  const base = sample<ScenarioActivity>('sample-scenario-deadline');
  test('id, title, prompt, explanation and concept are required', () => {
    const problems = text(validateStructure({ ...base, id: 'Bad_Id', title: ' ', prompt: '', explanation: '', concept: '' }));
    expect(problems).toMatch(/not kebab-case/);
    expect(problems).toMatch(/title is empty/);
    expect(problems).toMatch(/prompt is empty/);
    expect(problems).toMatch(/explanation is empty/);
    expect(problems).toMatch(/concept is empty/);
  });
  test('hints: at least two, none empty, none repeated', () => {
    expect(text(validateStructure({ ...base, hints: ['one'] }))).toMatch(/at least 2 hints/);
    expect(text(validateStructure({ ...base, hints: ['a', ' '] }))).toMatch(/hint is empty/);
    expect(text(validateStructure({ ...base, hints: ['a', 'a'] }))).toMatch(/identical/);
    expect(validateStructure({ ...sample<TapRevealActivity>('sample-tap-status-codes'), hints: [] })).toEqual([]);
  });
  test('an empty story is a problem', () => {
    expect(text(validateStructure({ ...base, story: ' ' }))).toMatch(/story is empty/);
  });
  test('duplicate ids across a set are reported', () => {
    expect(text(validateActivitySet([base, base]))).toMatch(/duplicate activity id/);
  });
});

describe('tap-reveal', () => {
  test('needs two cards with both sides', () => {
    const base = sample<TapRevealActivity>('sample-tap-variables');
    expect(text(validateStructure({ ...base, cards: [base.cards[0]] }))).toMatch(/at least 2 cards/);
    expect(text(validateStructure({ ...base, cards: [base.cards[0], { front: 'x', back: ' ' }] }))).toMatch(/empty side/);
  });
});

describe('predict-output', () => {
  const base = sample<PredictOutputActivity>('sample-predict-loop-sum');
  test('a snippet that errors is reported', () => {
    expect(text(validateActivity({ ...base, code: 'console.log(missing);' }))).toMatch(/errors when run/);
  });
  test('a snippet that prints nothing is reported', () => {
    expect(text(validateActivity({ ...base, code: 'let a = 1;' }))).toMatch(/prints nothing/);
  });
  test('an expected text that disagrees with the run is reported', () => {
    expect(text(validateActivity({ ...base, choices: undefined, expected: '11' }))).toMatch(/does not match what the snippet prints/);
  });
  test('the real answer must be among the choices exactly once', () => {
    expect(text(validateActivity({ ...base, choices: ['4', '24'] }))).toMatch(/0 choices equal the real output/);
    expect(text(validateActivity({ ...base, choices: ['10', '10'] }))).toMatch(/two choices are the same/);
    expect(text(validateStructure({ ...base, choices: ['10'] }))).toMatch(/at least 2 options/);
  });
  test('non-JavaScript needs a stored expected text', () => {
    expect(text(validateStructure({ ...base, language: 'python', code: 'print(2)' }))).toMatch(/expected is required/);
    expect(validateActivity({ ...base, language: 'python', code: 'print(10)', expected: '10' })).toEqual([]);
  });
});

describe('fix-bug', () => {
  const base = sample<FixBugActivity>('sample-fix-off-by-one');
  test('bugLine must be inside the code and on a real line', () => {
    expect(text(validateStructure({ ...base, bugLine: 0 }))).toMatch(/outside the code/);
    expect(text(validateStructure({ ...base, bugLine: 99 }))).toMatch(/outside the code/);
    expect(text(validateStructure({ ...base, code: 'a\n\nc', bugLine: 2, tests: undefined }))).toMatch(/blank line/);
  });
  test('needs a correct fix, and one correct choice only when choosing', () => {
    expect(text(validateStructure({ ...base, fixes: base.fixes.map((f) => ({ ...f, correct: false })) }))).toMatch(/at least one correct fix/);
    expect(text(validateStructure({ ...base, fixes: base.fixes.map((f) => ({ ...f, correct: true })) }))).toMatch(/more than one correct/);
    expect(text(validateStructure({ ...base, fixes: [base.fixes[0]] }))).toMatch(/at least 2 options/);
    expect(text(validateStructure({ ...base, fixes: [base.fixes[0], { ...base.fixes[1], line: base.fixes[0].line }] }))).toMatch(/same line/);
    expect(text(validateStructure({ ...base, fixes: [base.fixes[0], { ...base.fixes[1], why: '' }] }))).toMatch(/no explanation/);
  });
  test('the listed fixes are run against the tests: a wrong one that passes, a right one that fails', () => {
    const wrongPasses = { ...base, fixes: [...base.fixes, { line: 'for (let i = 1; i <= n; i += 1) {', correct: false, why: 'x' }] };
    expect(text(validateActivity(wrongPasses))).toMatch(/wrong fix .* passes the tests/);
    const rightFails = { ...base, fixes: [{ ...base.fixes[0], line: 'for (let i = 1; i < n + 5; i++) {' }, base.fixes[1]] };
    expect(text(validateActivity(rightFails))).toMatch(/correct fix .* does not pass/);
  });
  test('the broken code must fail the tests', () => {
    expect(text(validateActivity({ ...base, code: base.code.replace('i < n', 'i <= n') }))).toMatch(/already passes its tests/);
  });
  test('tests need JavaScript', () => {
    expect(text(validateStructure({ ...base, language: 'python' }))).toMatch(/only work with javascript/);
  });
});

describe('arrange', () => {
  const base = sample<ArrangeActivity>('sample-arrange-count-evens');
  test('needs 3 non-blank lines', () => {
    expect(text(validateStructure({ ...base, solution: ['a', 'b'], alternatives: undefined, reasons: undefined }))).toMatch(/at least 3 lines/);
    expect(text(validateStructure({ ...base, solution: ['a', ' ', 'c'], alternatives: undefined, reasons: undefined }))).toMatch(/blank line/);
  });
  test('alternatives must be reorderings of the solution', () => {
    expect(text(validateStructure({ ...base, alternatives: [['x', 'y', 'z']] }))).toMatch(/not a reordering/);
  });
  test('reasons must match the number of lines', () => {
    expect(text(validateStructure({ ...base, reasons: ['one'] }))).toMatch(/reasons has 1 entries/);
  });
  test('a solution that does not run, or fails its tests, is reported', () => {
    expect(text(validateActivity({ ...base, solution: [...base.solution.slice(0, 7), 'console.log(oops);'], alternatives: undefined, reasons: undefined }))).toMatch(/the solution does not run correctly/);
    expect(text(validateActivity({ ...base, tests: { kind: 'output', expected: ['3'] } }))).toMatch(/does not run correctly/);
  });
  test('an alternative that breaks the program is reported', () => {
    const broken = [...base.solution];
    [broken[2], broken[7]] = [broken[7], broken[2]];
    expect(text(validateActivity({ ...base, alternatives: [broken] }))).toMatch(/alternative 1 does not run correctly/);
  });
});

describe('fill-blank', () => {
  const base = sample<FillBlankActivity>('sample-fill-function');
  test('the number of ___ blanks must equal the blanks listed', () => {
    expect(text(validateStructure({ ...base, blanks: [base.blanks[0]] }))).toMatch(/has 2 ___ blanks but blanks lists 1/);
    expect(text(validateStructure({ ...base, code: 'no blanks', blanks: [] }))).toMatch(/no ___ blank/);
  });
  test('every blank needs an answer, and the bank must hold it', () => {
    expect(text(validateStructure({ ...base, blanks: [{ answers: [] }, base.blanks[1]] }))).toMatch(/blank 1 needs at least one/);
    expect(text(validateStructure({ ...base, bank: ['function', 'const', 'let'] }))).toMatch(/not in the word bank/);
    expect(text(validateStructure({ ...base, bank: ['function'] }))).toMatch(/fewer words than blanks/);
  });
  test('a bank must hold a repeated answer as many times as it is needed', () => {
    const twice: FillBlankActivity = { ...base, code: '___ a\n___ b', blanks: [{ answers: ['x'] }, { answers: ['x'] }], bank: ['x', 'y'], tests: undefined };
    expect(text(validateStructure(twice))).toMatch(/"x" fewer times/);
  });
  test('the program with the answers filled in must run and pass', () => {
    expect(text(validateActivity({ ...base, blanks: [{ answers: ['function'] }, { answers: ['const'] }] }))).toMatch(/canonical answers/);
    const variant: FillBlankActivity = { ...sample<FillBlankActivity>('sample-fill-loop'), blanks: [{ answers: ['<=', '<'] }, { answers: ['+'] }] };
    expect(text(validateActivity(variant))).toMatch(/accepted variant "<" for blank 1 fails/);
  });
});

describe('match', () => {
  const base = sample<MatchActivity>('sample-match-types');
  test('needs 3 distinct pairs', () => {
    expect(text(validateStructure({ ...base, pairs: base.pairs.slice(0, 2) }))).toMatch(/at least 3 pairs/);
    expect(text(validateStructure({ ...base, pairs: [...base.pairs.slice(0, 2), { ...base.pairs[2], term: base.pairs[0].term }] }))).toMatch(/two terms are the same/);
    expect(text(validateStructure({ ...base, pairs: [...base.pairs.slice(0, 2), { ...base.pairs[2], definition: base.pairs[0].definition }] }))).toMatch(/two definitions are the same/);
  });
});

describe('scenario', () => {
  const base = sample<ScenarioActivity>('sample-scenario-deadline');
  test('exactly one best option', () => {
    expect(text(validateStructure({ ...base, options: base.options.map((o) => ({ ...o, quality: 'poor' as const })) }))).toMatch(/exactly one "best"/);
    expect(text(validateStructure({ ...base, options: base.options.map((o) => ({ ...o, quality: 'best' as const })) }))).toMatch(/exactly one "best"/);
  });
  test('situation, text and consequence are required', () => {
    expect(text(validateStructure({ ...base, situation: '' }))).toMatch(/situation is empty/);
    expect(text(validateStructure({ ...base, options: [base.options[0], { ...base.options[1], consequence: '' }] }))).toMatch(/no consequence/);
    expect(text(validateStructure({ ...base, options: [base.options[0]] }))).toMatch(/at least 2 options/);
  });
});

describe('code-challenge', () => {
  const base = sample<CodeChallengeActivity>('sample-code-average');
  const robot = sample<CodeChallengeActivity>('sample-robot-star');
  test('the reference solution must pass its own tests', () => {
    expect(text(validateActivity({ ...base, solution: 'function average(a, b) { return a + b; }' }))).toMatch(/fails its own tests/);
  });
  test('the starter must not already pass', () => {
    expect(text(validateActivity({ ...base, starter: base.solution }))).toMatch(/starter code already passes/);
  });
  test('tests need cases', () => {
    expect(text(validateStructure({ ...base, tests: { kind: 'function', fn: 'average', cases: [] } }))).toMatch(/no cases/);
    expect(text(validateStructure({ ...base, tests: { kind: 'output', expected: [] } }))).toMatch(/expected is empty/);
  });
  test('a broken robot world is reported', () => {
    expect(text(validateStructure({ ...robot, tests: { kind: 'robot', world: { ...(robot.tests.kind === 'robot' ? robot.tests.world : (null as never)), goal: { x: 40, y: 0 } } } }))).toMatch(/goal is outside/);
  });
  test('a robot solution that does not finish the world is reported', () => {
    expect(text(validateActivity({ ...robot, solution: 'moveRight();' }))).toMatch(/does not finish the robot world/);
    expect(text(validateActivity({ ...robot, solution: 'nope();' }))).toMatch(/solution errors/);
  });
  test('a robot starter that already solves it is reported', () => {
    expect(text(validateActivity({ ...robot, starter: robot.solution }))).toMatch(/starter code already solves/);
  });
});

describe('sql-challenge structure', () => {
  const base = sample<SqlChallengeActivity>('sample-sql-top-scores');
  test('setup, solution and an expectation are required', () => {
    expect(text(validateStructure({ ...base, setup: '' }))).toMatch(/setup is empty/);
    expect(text(validateStructure({ ...base, solution: ' ' }))).toMatch(/solution is empty/);
    expect(text(validateStructure({ ...base, expected: { rows: [], ordered: false } }))).toMatch(/needs rows or columns/);
  });
});

describe('defineActivity', () => {
  const base = sample<ScenarioActivity>('sample-scenario-deadline');
  test('returns a good activity unchanged', () => {
    expect(defineActivity(base)).toBe(base);
  });
  test('throws in development when the structure is wrong, naming the activity', () => {
    expect(() => defineActivity({ ...base, id: 'bad-one', hints: [] })).toThrow(/Activity "bad-one".*at least 2 hints/);
  });
});
