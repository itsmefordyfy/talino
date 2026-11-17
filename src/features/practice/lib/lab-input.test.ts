import { describe, expect, test } from '@jest/globals';

import { GOOD_PROMPT, LAB_COMPARE_MODELS, LAB_COMPARE_PROMPTS, LAB_SUMMARY, OTHER_GOOD_PROMPT } from '../lab-test-support';
import { checkLabPrompts, labRunsDone, MIN_LAB_PROMPT_WORDS, outputsPerRun, promptsPerRun, wordsChanged } from './lab-input';

describe('wordsChanged', () => {
  test('counts the words added or removed, ignoring case and punctuation', () => {
    expect(wordsChanged('Summarise this.', 'summarise THIS')).toBe(0);
    expect(wordsChanged('Summarise this.', 'Please summarise this')).toBe(1);
    expect(wordsChanged('a b c', 'a x y z')).toBe(5);
  });
});

describe('checkLabPrompts, one prompt', () => {
  test('a real edit of the starter, long enough, is accepted', () => {
    expect(checkLabPrompts(LAB_SUMMARY, [GOOD_PROMPT])).toEqual({ ok: true });
  });
  test('the starter prompt unedited is refused, whatever its case or spacing', () => {
    expect(checkLabPrompts(LAB_SUMMARY, [LAB_SUMMARY.starterPrompt])).toEqual({ ok: false, reason: 'lab_too_short', index: 0 });
    const longStarter = { ...LAB_SUMMARY, starterPrompt: 'Summarise the notes below in a few short lines for the team please.' };
    expect(checkLabPrompts(longStarter, [`  ${longStarter.starterPrompt.toUpperCase()} `])).toEqual({ ok: false, reason: 'lab_not_edited', index: 0 });
  });
  test('adding a single word is not a real edit', () => {
    const longStarter = { ...LAB_SUMMARY, starterPrompt: 'Summarise the notes below in a few short lines for the team.' };
    expect(checkLabPrompts(longStarter, [`${longStarter.starterPrompt} Thanks`])).toMatchObject({ ok: false, reason: 'lab_not_edited' });
  });
  test('an empty or tiny prompt is too short', () => {
    expect(checkLabPrompts(LAB_SUMMARY, [''])).toMatchObject({ ok: false, reason: 'lab_too_short' });
    expect(checkLabPrompts(LAB_SUMMARY, ['Write three bullets please'])).toMatchObject({ ok: false, reason: 'lab_too_short' });
    expect(MIN_LAB_PROMPT_WORDS).toBeGreaterThanOrEqual(6);
  });
  test('the wrong number of prompts is not a prompt', () => {
    expect(checkLabPrompts(LAB_SUMMARY, [])).toEqual({ ok: false, reason: 'bad_prompts', index: 0 });
    expect(checkLabPrompts(LAB_SUMMARY, [GOOD_PROMPT, GOOD_PROMPT])).toMatchObject({ ok: false, reason: 'bad_prompts' });
  });
});

describe('checkLabPrompts, two prompts', () => {
  test('A may be the starter (the baseline) but B must be a real edit and differ from A', () => {
    expect(checkLabPrompts(LAB_COMPARE_PROMPTS, [LAB_COMPARE_PROMPTS.starterPrompt, OTHER_GOOD_PROMPT])).toEqual({ ok: true });
    expect(checkLabPrompts(LAB_COMPARE_PROMPTS, [LAB_COMPARE_PROMPTS.starterPrompt, LAB_COMPARE_PROMPTS.starterPrompt])).toMatchObject({ ok: false, index: 1 });
    expect(checkLabPrompts(LAB_COMPARE_PROMPTS, [OTHER_GOOD_PROMPT, OTHER_GOOD_PROMPT])).toMatchObject({ ok: false, reason: 'lab_same_prompts' });
  });
  test('a baseline needs a few words too, but not a whole prompt', () => {
    expect(checkLabPrompts(LAB_COMPARE_PROMPTS, ['Noise.', OTHER_GOOD_PROMPT])).toMatchObject({ ok: false, reason: 'lab_too_short', index: 0 });
    expect(checkLabPrompts(LAB_COMPARE_PROMPTS, ['Write about noise', OTHER_GOOD_PROMPT])).toEqual({ ok: true });
  });
});

describe('runs', () => {
  test('a comparison of prompts has two prompts and two outputs, of models one prompt and two outputs', () => {
    expect([promptsPerRun(LAB_SUMMARY), outputsPerRun(LAB_SUMMARY)]).toEqual([1, 1]);
    expect([promptsPerRun(LAB_COMPARE_PROMPTS), outputsPerRun(LAB_COMPARE_PROMPTS)]).toEqual([2, 2]);
    expect([promptsPerRun(LAB_COMPARE_MODELS), outputsPerRun(LAB_COMPARE_MODELS)]).toEqual([1, 2]);
  });
  test('runs done are counted from the saved prompts, so they cannot drift', () => {
    const user = { role: 'user' as const };
    const model = { role: 'assistant' as const };
    expect(labRunsDone(LAB_SUMMARY, [])).toBe(0);
    expect(labRunsDone(LAB_SUMMARY, [user, model, user, model])).toBe(2);
    expect(labRunsDone(LAB_COMPARE_PROMPTS, [user, model, user, model, user, model, user, model])).toBe(2);
    expect(labRunsDone(LAB_COMPARE_MODELS, [user, model, model, user, model, model])).toBe(2);
  });
});
