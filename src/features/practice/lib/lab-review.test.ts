import { describe, expect, test } from '@jest/globals';

import { GOOD_PROMPT, LAB_CLASSIFY, LAB_COMPARE_MODELS, LAB_COMPARE_PROMPTS, LAB_MARKERS, LAB_SUMMARY } from '../lab-test-support';
import { keyChecksFor } from './lab-check';
import { parseLabReview, readStoredLabReview } from './lab-review';

const OUTPUT = 'Dana will send the budget on Thursday. Rico paid a deposit of 900 dollars.';

const model = (overrides: Record<string, unknown> = {}) => ({
  summary: 'A clear request that names the reader and a length.',
  criteria: [
    { id: 'audience', score: 85, quote: 'for my manager', reason: 'You say who it is for.' },
    { id: 'length', score: 70, quote: 'three short bullet points', reason: 'You set a length.' },
    { id: 'keeps-owners', score: 20, quote: '', reason: 'Nothing asks to keep owners.' },
  ],
  suggestions: ['Say which details must not be lost.', 'Ask it to name its sources.'],
  outputChecks: [
    { output: 'A', claim: 'Dana will send the budget on Thursday', status: 'supported', note: 'The notes say Thursday.' },
    { output: 'A', claim: 'Rico paid a deposit of 900 dollars', status: 'not-in-material', note: 'The notes say a different amount.' },
  ],
  comparison: '',
  nextStep: 'Run it again with the owners named.',
  ...overrides,
});

const parse = (value: unknown, options: Partial<Parameters<typeof parseLabReview>[1]> = {}) =>
  parseLabReview(typeof value === 'string' ? value : JSON.stringify(value), { lab: LAB_SUMMARY, prompts: [GOOD_PROMPT], outputs: [OUTPUT], keyChecks: [], ...options });

describe('parseLabReview', () => {
  test('scores exactly the lab’s criteria, in its order, and the overall is their average', () => {
    const review = parse(model());
    expect(review).not.toBeNull();
    expect(review?.criteria.map((criterion) => criterion.id)).toEqual(['audience', 'length', 'keeps-owners']);
    expect(review?.criteria[0].label).toBe('Says who the summary is for');
    expect(review).toMatchObject({ kind: 'prompt-lab', tooShort: false, overall: 58, rating: 'fair' });
  });

  test('a criterion the lab does not name is ignored, and a missing one refuses the whole review', () => {
    const extra = model();
    (extra.criteria as unknown[]).push({ id: 'invented', score: 99, quote: 'for my manager', reason: 'x' });
    expect(parse(extra)?.criteria).toHaveLength(3);
    expect(parse(model({ criteria: (model().criteria as unknown[]).slice(0, 2) }))).toBeNull();
  });

  test('a score of 40 or more needs a quote that is in the learner’s prompt', () => {
    expect(parse(model({ criteria: [{ id: 'audience', score: 85, quote: 'for the board of directors', reason: 'x' }, ...(model().criteria as unknown[]).slice(1)] }))).toBeNull();
    expect(parse(model({ criteria: [{ id: 'audience', score: 85, quote: '', reason: 'x' }, ...(model().criteria as unknown[]).slice(1)] }))).toBeNull();
    // Nothing to quote is honest only with no credit.
    expect(parse(model())?.criteria[2]).toMatchObject({ score: 20, quote: '' });
  });

  test('a quote may join two pieces of the prompt with an ellipsis, however it was cased', () => {
    const review = parse(model({ criteria: [{ id: 'audience', score: 90, quote: 'FOR MY MANAGER … every date', reason: 'x' }, ...(model().criteria as unknown[]).slice(1)] }));
    expect(review?.criteria[0].score).toBe(90);
  });

  test('for a comparison of prompts a quote may come from either prompt', () => {
    const review = parse(model({ comparison: 'B names the reader; A does not.' }), { lab: LAB_COMPARE_PROMPTS, prompts: ['Write a note about noise.', GOOD_PROMPT], outputs: ['x', 'y'] });
    expect(review).toBeNull(); // the criteria are the summary lab's, not this lab's
    const own = { criteria: LAB_COMPARE_PROMPTS.criteria.map((criterion) => ({ id: criterion.id, score: 80, quote: 'Write a note about noise', reason: 'ok' })) };
    expect(parse(model({ ...own, comparison: 'B names the reader; A does not.', outputChecks: [] }), { lab: LAB_COMPARE_PROMPTS, prompts: ['Write a note about noise.', GOOD_PROMPT], outputs: ['x', 'y'] })).not.toBeNull();
  });

  test('needs a summary, a next step and at least one suggestion, and caps suggestions at four without repeats', () => {
    expect(parse(model({ summary: '' }))).toBeNull();
    expect(parse(model({ nextStep: '' }))).toBeNull();
    expect(parse(model({ suggestions: [] }))).toBeNull();
    const many = parse(model({ suggestions: ['One.', 'one.', 'Two.', 'Three.', 'Four.', 'Five.'] }));
    expect(many?.suggestions).toEqual(['One.', 'Two.', 'Three.', 'Four.']);
  });

  test('output checks keep only claims that really are in the output they name, and only valid statuses', () => {
    const review = parse(
      model({
        outputChecks: [
          { output: 'A', claim: 'Dana will send the budget on Thursday', status: 'supported', note: 'Yes.' },
          { output: 'A', claim: 'The venue was cancelled', status: 'not-in-material', note: 'Nobody said it.' },
          { output: 'A', claim: 'Rico paid a deposit', status: 'perhaps', note: 'x' },
          { output: 'B', claim: 'Dana will send the budget on Thursday', status: 'supported', note: 'There is no B.' },
        ],
      }),
    );
    expect(review?.outputChecks).toEqual([{ output: 'A', claim: 'Dana will send the budget on Thursday', status: 'supported', note: 'Yes.' }]);
  });

  test('a lab with no material or facts has no output checks, whatever the model sent', () => {
    const own = { criteria: LAB_COMPARE_MODELS.criteria.map((criterion) => ({ id: criterion.id, score: 80, quote: 'Write a product blurb', reason: 'ok' })), comparison: 'One run, two replies that differ in length.' };
    const review = parse(model(own), { lab: LAB_COMPARE_MODELS, prompts: ['Write a product blurb for hikers please.'], outputs: ['Dana will send the budget on Thursday', 'y'] });
    expect(review?.outputChecks).toEqual([]);
    expect(review?.comparison).toContain('One run');
  });

  test('a comparison lab must come with a comparison; any other lab has none', () => {
    const own = { criteria: LAB_COMPARE_MODELS.criteria.map((criterion) => ({ id: criterion.id, score: 80, quote: 'Write a product blurb', reason: 'ok' })) };
    expect(parse(model({ ...own, comparison: '' }), { lab: LAB_COMPARE_MODELS, prompts: ['Write a product blurb please.'], outputs: ['x', 'y'] })).toBeNull();
    expect(parse(model({ comparison: 'A comparison nobody asked for.' }))?.comparison).toBe('');
  });

  test('a coach that repeats the model’s side of the lab is refused', () => {
    expect(parse(model({ summary: `As instructed: ${LAB_MARKERS.system}` }))).toBeNull();
    expect(parse(model({ suggestions: [`Remember that ${LAB_MARKERS.fact}.`] }))).toBeNull();
    expect(parse(model({ outputChecks: [{ output: 'A', claim: 'Dana will send the budget on Thursday', status: 'supported', note: `The facts say ${LAB_MARKERS.fact}` }] }))).toBeNull();
    const keyed = { ...LAB_CLASSIFY, criteria: LAB_SUMMARY.criteria };
    expect(parse(model({ nextStep: `The answer is ${LAB_MARKERS.keyValue}` }), { lab: keyed })).toBeNull();
  });

  test('not JSON, or not an object, is refused', () => {
    expect(parse('nope')).toBeNull();
    expect(parse('[1]')).toBeNull();
  });

  test('attaches the key checks it was given, unchanged', () => {
    const checks = keyChecksFor(LAB_CLASSIFY, ['{"category":"shipping"}']);
    const review = parse(model(), { keyChecks: checks });
    expect(review?.keyChecks).toEqual(checks);
  });
});

describe('readStoredLabReview', () => {
  test('reads back what was stored and refuses a damaged or foreign result', () => {
    const review = parse(model(), { keyChecks: keyChecksFor(LAB_CLASSIFY, ['{"category":"billing"}']) });
    expect(review).not.toBeNull();
    expect(readStoredLabReview(JSON.stringify(review))).toEqual(review);
    expect(readStoredLabReview(null)).toBeNull();
    expect(readStoredLabReview('{')).toBeNull();
    expect(readStoredLabReview(JSON.stringify({ kind: 'roleplay' }))).toBeNull();
    expect(readStoredLabReview(JSON.stringify({ ...review, criteria: [3] }))).toBeNull();
  });
});
