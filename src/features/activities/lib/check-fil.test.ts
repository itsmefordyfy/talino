import { describe, expect, test } from '@jest/globals';

import { runnerStrings } from '@/features/code-runner/strings';

import { SAMPLE_ACTIVITIES } from '../samples';
import { activityStrings } from '../strings';
import type { Activity, CodeChallengeActivity, TapRevealActivity } from '../types';
import { checkActivity, describeCase } from './check';

const fil = activityStrings.fil;

function sample<T extends Activity>(id: string): T {
  const found = SAMPLE_ACTIVITIES.find((activity) => activity.id === id);
  if (!found) throw new Error(`no sample ${id}`);
  return found as T;
}

describe('Tagalog feedback', () => {
  test('has the same shape as English', () => {
    expect(Object.keys(fil).sort()).toEqual(Object.keys(activityStrings.en).sort());
    expect(Object.keys(fil.runner.sql).sort()).toEqual(Object.keys(runnerStrings.en.sql).sort());
  });

  test('tap-reveal speaks Tagalog', async () => {
    const activity = sample<TapRevealActivity>('sample-tap-variables');
    const partial = await checkActivity(activity, { kind: 'tap-reveal', opened: [0, 1] }, fil);
    expect(partial.feedback).toBe('Isang card na lang.');
    const done = await checkActivity(activity, { kind: 'tap-reveal', opened: [0, 1, 2] }, fil);
    expect(done.feedback).toBe(fil.tapRevealDone);
  });

  test('a failing code challenge is explained in Tagalog, with the label and a Tagalog framing', async () => {
    const activity = sample<CodeChallengeActivity>(SAMPLE_ACTIVITIES.find((a) => a.kind === 'code-challenge' && a.tests.kind === 'function')!.id);
    const wrong = await checkActivity(activity, { kind: 'code-challenge', code: 'function nothing() {}' }, fil);
    expect(wrong.correct).toBe(false);
    expect(wrong.feedback).not.toMatch(/Your code|did not|should give/);
    expect(wrong.feedback).toMatch(/Kailangan ng function|pumasa|check/);
  });

  test('a syntax error is framed in Tagalog', async () => {
    const activity = sample<CodeChallengeActivity>(SAMPLE_ACTIVITIES.find((a) => a.kind === 'code-challenge' && a.tests.kind === 'function')!.id);
    const result = await checkActivity(activity, { kind: 'code-challenge', code: 'let = ;' }, fil);
    expect(result.feedback.startsWith('May error ang code mo sa line 1:')).toBe(true);
  });

  test('describeCase uses the Tagalog words', () => {
    expect(describeCase({ label: 'Test 1', pass: true, expected: 1, actual: 1, error: null, hidden: false }, fil).message).toBe('Pumasa');
    expect(describeCase({ label: 'Test 1', pass: false, expected: 1, actual: 2, error: null, hidden: false }, fil).message).toBe('Test 1: 2 ang ibinigay ng code mo, pero dapat 1.');
    expect(describeCase({ label: 'Test 2', pass: false, expected: undefined, actual: undefined, error: null, hidden: true }, fil).message).toBe(fil.hiddenFail);
  });
});
