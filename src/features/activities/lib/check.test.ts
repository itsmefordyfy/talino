import { describe, expect, test } from '@jest/globals';

import { SAMPLE_ACTIVITIES } from '../samples';
import type {
  Activity,
  ArrangeActivity,
  CodeChallengeActivity,
  FillBlankActivity,
  FixBugActivity,
  MatchActivity,
  PredictOutputActivity,
  ScenarioActivity,
  TapRevealActivity,
} from '../types';
import { checkActivity, expectedOutputOf } from './check';

function sample<T extends Activity>(id: string): T {
  const found = SAMPLE_ACTIVITIES.find((activity) => activity.id === id);
  if (!found) throw new Error(`no sample ${id}`);
  return found as T;
}

describe('tap-reveal', () => {
  const activity = sample<TapRevealActivity>('sample-tap-variables');
  test('is solved only when every card has been opened', async () => {
    const partial = await checkActivity(activity, { kind: 'tap-reveal', opened: [0, 1] });
    expect(partial).toMatchObject({ correct: false, progress: true, detail: { kind: 'tap-reveal', remaining: 1 } });
    expect(partial.partial).toBeCloseTo(2 / 3);
    const done = await checkActivity(activity, { kind: 'tap-reveal', opened: [2, 0, 1] });
    expect(done).toMatchObject({ correct: true, partial: 1 });
  });
  test('ignores repeated and out-of-range indexes', async () => {
    const result = await checkActivity(activity, { kind: 'tap-reveal', opened: [0, 0, 9, -1] });
    expect(result.correct).toBe(false);
    expect(result.detail).toMatchObject({ remaining: 2 });
  });
});

describe('predict-output', () => {
  const choice = sample<PredictOutputActivity>('sample-predict-loop-sum');
  const typed = sample<PredictOutputActivity>('sample-predict-array');

  test('the expected output is computed by running the JavaScript', () => {
    expect(expectedOutputOf(choice)).toBe('10');
    expect(expectedOutputOf(typed)).toBe('4\nBen');
  });
  test('right answer, with forgiving line endings and trailing spaces', async () => {
    expect((await checkActivity(choice, { kind: 'predict-output', text: '10' })).correct).toBe(true);
    expect((await checkActivity(typed, { kind: 'predict-output', text: '4  \r\nBen\n' })).correct).toBe(true);
  });
  test('a wrong choice with a note shows the note and can try again', async () => {
    const wrong = await checkActivity(choice, { kind: 'predict-output', text: '4' });
    expect(wrong.correct).toBe(false);
    expect(wrong.feedback).toMatch(/last value/);
    expect((await checkActivity(choice, { kind: 'predict-output', text: '10' })).correct).toBe(true);
  });
  test('wrong answers get specific, non-spoiling feedback', async () => {
    const lines = await checkActivity(typed, { kind: 'predict-output', text: '4' });
    expect(lines.feedback).toMatch(/2 lines.*1/);
    expect(lines.feedback).not.toMatch(/Ben/);
    expect((await checkActivity(typed, { kind: 'predict-output', text: '4\nben' })).feedback).toMatch(/capital letters/);
    expect((await checkActivity(typed, { kind: 'predict-output', text: '4\nBe n' })).feedback).toMatch(/spaces/);
    expect((await checkActivity(typed, { kind: 'predict-output', text: '4\n"Ben"' })).feedback).toMatch(/quotation marks/);
    expect((await checkActivity(typed, { kind: 'predict-output', text: '3\nAna' })).feedback).toMatch(/one line at a time/);
    expect((await checkActivity(typed, { kind: 'predict-output', text: '   ' })).correct).toBe(false);
  });
  test('non-JavaScript uses the stored expected text', async () => {
    const py: PredictOutputActivity = { ...choice, id: 'py', language: 'python', code: 'print(1+1)', expected: '2', choices: ['2', '11'] };
    expect(expectedOutputOf(py)).toBe('2');
    expect((await checkActivity(py, { kind: 'predict-output', text: '2' })).correct).toBe(true);
    expect((await checkActivity(py, { kind: 'predict-output', text: '11' })).correct).toBe(false);
    expect(expectedOutputOf({ ...py, expected: undefined })).toBeNull();
    expect((await checkActivity({ ...py, expected: undefined }, { kind: 'predict-output', text: '2' })).correct).toBe(false);
  });
});

describe('fix-bug', () => {
  const choose = sample<FixBugActivity>('sample-fix-off-by-one');
  const typed = sample<FixBugActivity>('sample-fix-comparison');

  test('tapping the wrong line says it is fine and moves nothing forward', async () => {
    const result = await checkActivity(choose, { kind: 'fix-bug', line: 2 });
    expect(result).toMatchObject({ correct: false, partial: 0, detail: { kind: 'fix-bug', stage: 'line' } });
    expect(result.progress).toBeUndefined();
    expect(result.feedback).toMatch(/Line 2/);
  });
  test('a custom note replaces the generic one', async () => {
    expect((await checkActivity(typed, { kind: 'fix-bug', line: 5 })).feedback).toBe(typed.lineNote);
  });
  test('the right line moves to choosing the fix, as progress rather than a wrong try', async () => {
    const result = await checkActivity(choose, { kind: 'fix-bug', line: 3 });
    expect(result).toMatchObject({ correct: false, progress: true, partial: 0.5, detail: { stage: 'fix' } });
  });
  test('the right fix solves it; a listed wrong fix explains itself', async () => {
    const good = await checkActivity(choose, { kind: 'fix-bug', line: 3, fix: 'for (let i = 1; i <= n; i++) {' });
    expect(good).toMatchObject({ correct: true, detail: { stage: 'done' } });
    const bad = await checkActivity(choose, { kind: 'fix-bug', line: 3, fix: 'for (let i = 2; i <= n; i++) {' });
    expect(bad).toMatchObject({ correct: false, partial: 0.5 });
    expect(bad.feedback).toMatch(/skips the number 1/);
  });
  test('whitespace in a typed fix does not matter', async () => {
    expect((await checkActivity(typed, { kind: 'fix-bug', line: 2, fix: '  if (age   >=  18)  {' })).correct).toBe(true);
  });
  test('an unlisted fix that makes the tests pass is accepted', async () => {
    expect((await checkActivity(typed, { kind: 'fix-bug', line: 2, fix: 'if (18 <= age) {' })).correct).toBe(true);
  });
  test('an unlisted fix that fails the tests explains the failing case', async () => {
    const result = await checkActivity(typed, { kind: 'fix-bug', line: 2, fix: 'if (age > 17.5 && age < 18) {' });
    expect(result.correct).toBe(false);
    expect(result.feedback).toMatch(/does not fix it yet/);
    expect(result.feedback).toMatch(/isAdult\(/);
  });
  test('an unlisted fix with no tests gets the generic answer', async () => {
    const noTests: FixBugActivity = { ...choose, tests: undefined };
    expect((await checkActivity(noTests, { kind: 'fix-bug', line: 3, fix: 'whatever' })).feedback).toMatch(/does not fix it yet/);
  });
  test('an empty typed fix is not accepted', async () => {
    expect((await checkActivity(typed, { kind: 'fix-bug', line: 2, fix: '   ' })).correct).toBe(false);
  });
});

describe('arrange', () => {
  const simple = sample<ArrangeActivity>('sample-arrange-greeting');
  const alt = sample<ArrangeActivity>('sample-arrange-count-evens');

  test('the solution is correct', async () => {
    const result = await checkActivity(simple, { kind: 'arrange', order: simple.solution });
    expect(result).toMatchObject({ correct: true, partial: 1, detail: { firstWrong: null } });
  });
  test('a declared alternative is correct too', async () => {
    const result = await checkActivity(alt, { kind: 'arrange', order: alt.alternatives?.[0] ?? [] });
    expect(result.correct).toBe(true);
  });
  test('an undeclared reordering is not accepted', async () => {
    // Swapping the two set-up lines is declared; moving the print line up is not.
    const order = [...alt.solution];
    [order[6], order[7]] = [order[7], order[6]];
    expect((await checkActivity(alt, { kind: 'arrange', order })).correct).toBe(false);
  });
  test('explains the first wrong line, with its reason and the lines already right', async () => {
    const order = [...simple.solution];
    [order[1], order[2]] = [order[2], order[1]];
    const result = await checkActivity(simple, { kind: 'arrange', order });
    expect(result.correct).toBe(false);
    expect(result.detail).toMatchObject({ kind: 'arrange', firstWrong: 1 });
    expect(result.feedback).toMatch(/The first line is right/);
    expect(result.feedback).toMatch(/Line 2 is not in the right place/);
    expect(result.feedback).toContain(simple.reasons?.[1]);
    expect(result.partial).toBeCloseTo(3 / 5);
  });
  test('a wrong first line is reported as line 1', async () => {
    const order = [...simple.solution].reverse();
    const result = await checkActivity(simple, { kind: 'arrange', order });
    expect(result.detail).toMatchObject({ firstWrong: 0 });
    expect(result.feedback).toMatch(/^Line 1 is not/);
  });
  test('a different length is never correct', async () => {
    expect((await checkActivity(simple, { kind: 'arrange', order: simple.solution.slice(0, 4) })).correct).toBe(false);
  });
  test('prefers the accepted order that is closest to the answer', async () => {
    const order = [...(alt.alternatives?.[0] ?? [])];
    [order[6], order[7]] = [order[7], order[6]];
    const result = await checkActivity(alt, { kind: 'arrange', order });
    expect(result.detail).toMatchObject({ firstWrong: 6 });
  });
});

describe('fill-blank', () => {
  const bank = sample<FillBlankActivity>('sample-fill-function');
  const typed = sample<FillBlankActivity>('sample-fill-loop');

  test('all right', async () => {
    expect(await checkActivity(bank, { kind: 'fill-blank', values: ['function', 'return'] })).toMatchObject({ correct: true, partial: 1 });
  });
  test('per-blank feedback and partial credit', async () => {
    const result = await checkActivity(bank, { kind: 'fill-blank', values: ['function', 'const'] });
    expect(result.correct).toBe(false);
    expect(result.partial).toBe(0.5);
    expect(result.detail).toMatchObject({ kind: 'fill-blank', blanks: [{ correct: true }, { correct: false, feedback: 'This keyword hands a value back to whoever called the function.' }] });
    expect(result.feedback).toMatch(/1 of 2 blanks are right/);
    expect(result.feedback).toMatch(/Blank 2/);
  });
  test('empty blanks ask to be filled', async () => {
    const result = await checkActivity(typed, { kind: 'fill-blank', values: ['<=', ''] });
    expect(result.detail).toMatchObject({ blanks: [{ correct: true }, { correct: false, feedback: 'Fill this blank first.' }] });
  });
  test('accepts declared variants and ignores spacing', async () => {
    const withVariants: FillBlankActivity = { ...typed, blanks: [{ answers: ['<=', '< =x'] }, { answers: ['+'] }] };
    expect((await checkActivity(withVariants, { kind: 'fill-blank', values: [' <= ', '+'] })).correct).toBe(true);
    expect((await checkActivity(withVariants, { kind: 'fill-blank', values: ['< =x', '+'] })).correct).toBe(true);
  });
  test('missing values count as empty', async () => {
    expect((await checkActivity(typed, { kind: 'fill-blank', values: [] })).partial).toBe(0);
  });
});

describe('match', () => {
  const activity = sample<MatchActivity>('sample-match-types');
  const identity = Object.fromEntries(activity.pairs.map((_, i) => [i, i]));

  test('every pair right solves it', async () => {
    expect(await checkActivity(activity, { kind: 'match', pairs: identity })).toMatchObject({ correct: true, partial: 1 });
  });
  test('right pairs so far are progress, not a wrong try', async () => {
    const result = await checkActivity(activity, { kind: 'match', pairs: { 0: 0, 1: 1 } });
    expect(result).toMatchObject({ correct: false, progress: true, detail: { right: [0, 1], wrong: [] } });
    expect(result.partial).toBeCloseTo(2 / 5);
  });
  test('a wrong pair says why, using the note of the meaning', async () => {
    const result = await checkActivity(activity, { kind: 'match', pairs: { 0: 1 } });
    expect(result.correct).toBe(false);
    expect(result.progress).toBeUndefined();
    expect(result.detail).toMatchObject({ wrong: [0], right: [] });
    expect(result.feedback).toContain('is not the match for this one');
    expect(result.feedback).toContain(activity.pairs[1].note);
  });
  test('a wrong pair among right ones keeps the credit for the right ones', async () => {
    const result = await checkActivity(activity, { kind: 'match', pairs: { 0: 0, 1: 2, 2: 2 } });
    expect(result.detail).toMatchObject({ right: [0, 2], wrong: [1] });
    expect(result.partial).toBeCloseTo(2 / 5);
  });
  test('ignores terms that do not exist', async () => {
    const result = await checkActivity(activity, { kind: 'match', pairs: { 99: 0 } });
    expect(result.detail).toMatchObject({ right: [], wrong: [] });
  });
});

describe('scenario', () => {
  const activity = sample<ScenarioActivity>('sample-scenario-deadline');

  test('the best option solves it and shows its consequence', async () => {
    const result = await checkActivity(activity, { kind: 'scenario', option: 0 });
    expect(result).toMatchObject({ correct: true, partial: 1, detail: { quality: 'best' } });
    expect(result.feedback).toContain(activity.options[0].consequence);
  });
  test('an acceptable option has partial credit and its own consequence, and invites another try', async () => {
    const result = await checkActivity(activity, { kind: 'scenario', option: 1 });
    expect(result).toMatchObject({ correct: false, partial: 0.6, detail: { quality: 'acceptable' } });
    expect(result.feedback).toContain(activity.options[1].consequence);
    expect(result.feedback).toMatch(/stronger one/);
  });
  test('a poor option has no credit but never ends the activity', async () => {
    const result = await checkActivity(activity, { kind: 'scenario', option: 2 });
    expect(result).toMatchObject({ correct: false, partial: 0, detail: { quality: 'poor' } });
    expect(result.feedback).toContain(activity.options[2].consequence);
    expect((await checkActivity(activity, { kind: 'scenario', option: 0 })).correct).toBe(true);
  });
  test('an option that does not exist is not correct', async () => {
    expect((await checkActivity(activity, { kind: 'scenario', option: 7 })).correct).toBe(false);
  });
});

describe('code-challenge with tests', () => {
  const activity = sample<CodeChallengeActivity>('sample-code-average');

  test('the reference solution passes everything, hidden checks included', async () => {
    const result = await checkActivity(activity, { kind: 'code-challenge', code: activity.solution });
    expect(result).toMatchObject({ correct: true, partial: 1, detail: { kind: 'code-challenge', passed: 4, total: 4 } });
  });
  test('the starter passes nothing and explains in plain language', async () => {
    const result = await checkActivity(activity, { kind: 'code-challenge', code: activity.starter });
    expect(result.correct).toBe(false);
    expect(result.partial).toBe(0);
    expect(result.feedback).toMatch(/0 of 4 checks pass/);
    expect(result.feedback).toMatch(/average\(2, 4\): your code gave undefined but it should give 3/);
  });
  test('partial credit; hidden checks are summarised, never described', async () => {
    const code = 'function average(a, b) {\n  return (a + b) / 2 + (a < 0 ? 1 : 0);\n}';
    const result = await checkActivity(activity, { kind: 'code-challenge', code });
    expect(result.correct).toBe(false);
    expect(result.partial).toBe(0.75);
    expect(result.detail?.kind).toBe('code-challenge');
    if (result.detail?.kind === 'code-challenge') {
      const hidden = result.detail.cases.filter((c) => c.hidden);
      expect(hidden).toHaveLength(1);
      expect(hidden[0].pass).toBe(false);
      expect(hidden[0].message).not.toMatch(/-2|expected|should give/);
      expect(result.feedback).toMatch(/hidden check did not pass/);
    }
  });
  test('a runtime error in a case is explained', async () => {
    const code = 'function average(a, b) {\n  return nope(a, b);\n}';
    const result = await checkActivity(activity, { kind: 'code-challenge', code });
    expect(result.correct).toBe(false);
    expect(result.feedback).toMatch(/nope/);
  });
  test('a syntax error says which line', async () => {
    const result = await checkActivity(activity, { kind: 'code-challenge', code: 'function average(a, b) {\n  return (a + b / 2;\n}' });
    expect(result.correct).toBe(false);
    expect(result.feedback).toMatch(/error/);
    expect(result.detail).toMatchObject({ kind: 'code-challenge' });
  });
  test('an output test compares what was printed', async () => {
    const output: CodeChallengeActivity = { ...activity, id: 'out', tests: { kind: 'output', expected: ['hi'] }, solution: 'console.log("hi");', starter: '' };
    expect((await checkActivity(output, { kind: 'code-challenge', code: 'console.log("hi");' })).correct).toBe(true);
    expect((await checkActivity(output, { kind: 'code-challenge', code: 'console.log("ho");' })).correct).toBe(false);
  });
});

describe('code-challenge with the robot', () => {
  const activity = sample<CodeChallengeActivity>('sample-robot-star');

  test('the solution finishes the world', async () => {
    const result = await checkActivity(activity, { kind: 'code-challenge', code: activity.solution });
    expect(result).toMatchObject({ correct: true, partial: 1, detail: { passed: 3, total: 3 } });
    if (result.detail?.kind === 'code-challenge') expect(result.detail.world?.reachedGoal).toBe(true);
  });
  test('loops work', async () => {
    const code = 'for (let i = 0; i < 2; i++) moveRight();\npickUp();\nfor (let i = 0; i < 2; i++) moveDown();\nfor (let i = 0; i < 2; i++) moveRight();';
    expect((await checkActivity(activity, { kind: 'code-challenge', code })).correct).toBe(true);
  });
  test('hitting a wall stops the robot and is explained', async () => {
    const result = await checkActivity(activity, { kind: 'code-challenge', code: 'moveLeft();' });
    expect(result.correct).toBe(false);
    expect(result.feedback).toMatch(/bumped into a wall on command 1/);
  });
  test('skipping the star gives partial credit', async () => {
    const result = await checkActivity(activity, { kind: 'code-challenge', code: 'moveDown();\nmoveDown();\nmoveRight();\nmoveRight();\nmoveRight();\nmoveRight();' });
    expect(result.correct).toBe(false);
    expect(result.partial).toBeCloseTo(2 / 3);
    expect(result.feedback).toMatch(/star is still on the grid/);
  });
  test('picking up nothing is explained', async () => {
    expect((await checkActivity(activity, { kind: 'code-challenge', code: 'pickUp();' })).feedback).toMatch(/nothing there/);
  });
  test('no commands says so', async () => {
    expect((await checkActivity(activity, { kind: 'code-challenge', code: '// nothing' })).feedback).toMatch(/no commands/);
  });
  test('a program error reports the learner own line', async () => {
    const result = await checkActivity(activity, { kind: 'code-challenge', code: 'moveRight();\nmoveSideways();' });
    expect(result.correct).toBe(false);
    expect(result.feedback).toMatch(/line 2/);
  });
});

describe('checkActivity', () => {
  test('refuses an answer for another kind', async () => {
    await expect(checkActivity(SAMPLE_ACTIVITIES[0], { kind: 'scenario', option: 0 })).rejects.toThrow(/answer is for/);
  });
  test('wrong answers never end an activity: the right one still works afterwards', async () => {
    const activity = sample<ScenarioActivity>('sample-scenario-ai-code');
    for (const option of [2, 1, 2]) expect((await checkActivity(activity, { kind: 'scenario', option })).correct).toBe(false);
    expect((await checkActivity(activity, { kind: 'scenario', option: 0 })).correct).toBe(true);
  });
  test('every wrong result explains itself', async () => {
    const wrongs = await Promise.all([
      checkActivity(sample<PredictOutputActivity>('sample-predict-array'), { kind: 'predict-output', text: 'x' }),
      checkActivity(sample<FixBugActivity>('sample-fix-off-by-one'), { kind: 'fix-bug', line: 1 }),
      checkActivity(sample<ArrangeActivity>('sample-arrange-greeting'), { kind: 'arrange', order: [] }),
      checkActivity(sample<FillBlankActivity>('sample-fill-function'), { kind: 'fill-blank', values: ['', ''] }),
      checkActivity(sample<MatchActivity>('sample-match-git'), { kind: 'match', pairs: { 0: 1 } }),
      checkActivity(sample<ScenarioActivity>('sample-scenario-deadline'), { kind: 'scenario', option: 2 }),
      checkActivity(sample<CodeChallengeActivity>('sample-code-average'), { kind: 'code-challenge', code: '' }),
    ]);
    for (const result of wrongs) {
      expect(result.correct).toBe(false);
      expect(result.feedback.length).toBeGreaterThan(10);
    }
  });
});
