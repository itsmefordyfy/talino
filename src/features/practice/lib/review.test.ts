import { describe, expect, test } from '@jest/globals';

import { PRIVATE_MARKERS, TASK } from '../test-support';
import { REVIEW_SCHEMA, parseReview, readStoredReview, tooShortReview } from './review';

const LEARNER = 'Hi Dana, I am sorry the draft is late. I underestimated the checkout page. I will send the full draft by Friday at noon and update you tomorrow evening.';

const good = (overrides: Record<string, unknown> = {}) => ({
  summary: 'Clear and apologetic, with a firm date, but it never says what happens if Friday slips.',
  criteria: [
    { id: 'clarity', score: 82, reason: 'The date and time are easy to find.' },
    { id: 'tone', score: 74, reason: 'Warm without grovelling.' },
    { id: 'professionalism', score: 70, reason: 'Appropriate for a client.' },
    { id: 'completeness', score: 56, reason: 'Leaves out a fallback if the date moves.' },
  ],
  missing: ['What you will do if Friday slips', 'A named next update'],
  improved: 'Hi Dana, I am sorry the draft is late. I underestimated the checkout page and should have told you sooner. You will have the full draft on Friday at noon, and I will update you tomorrow evening. If anything threatens that date I will tell you the same day.',
  changes: [
    { what: 'Added "should have told you sooner"', why: 'It owns the silence, not just the delay.' },
    { what: 'Added a same-day warning', why: 'It gives Dana a fallback she can rely on.' },
  ],
  nextStep: 'Rewrite it in your own words and add what you will do if the date slips.',
  tooShort: false,
  ...overrides,
});
const parse = (value: unknown, learnerText = LEARNER) => parseReview(JSON.stringify(value), { task: TASK, learnerText });

describe('parseReview', () => {
  test('a good review: the criteria the task names, their average, what is missing, the improved version and why it changed', () => {
    const review = parse(good());
    expect(review).toMatchObject({ kind: 'message-review', tooShort: false, overall: 71, rating: 'good' });
    expect(review?.criteria.map((criterion) => criterion.id)).toEqual(['clarity', 'tone', 'professionalism', 'completeness']);
    expect(review?.missing).toEqual(['What you will do if Friday slips', 'A named next update']);
    expect(review?.improved).toContain('Friday at noon');
    expect(review?.changes).toHaveLength(2);
  });

  test('only the criteria the task names are scored', () => {
    const extra = good();
    extra.criteria.push({ id: 'empathy', score: 1, reason: 'Not named.' });
    expect(parse(extra)?.criteria).toHaveLength(4);
    expect(parse(good({ criteria: good().criteria.slice(0, 3) }))).toBeNull();
  });

  test('an improved version is required, with at least one change explained', () => {
    expect(parse(good({ improved: ' ' }))).toBeNull();
    expect(parse(good({ changes: [] }))).toBeNull();
    expect(parse(good({ changes: [{ what: 'Added x', why: '' }] }))).toBeNull();
  });

  test('a message that needs no change may come back as it is, with nothing to explain', () => {
    const same = parse(good({ improved: LEARNER.toUpperCase(), changes: [], missing: [] }));
    expect(same).not.toBeNull();
    expect(same?.changes).toEqual([]);
  });

  test('missing items are trimmed, de-duplicated and kept to a short list', () => {
    const review = parse(good({ missing: ['  A date ', 'a date', '', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] }));
    expect(review?.missing[0]).toBe('A date');
    expect(review?.missing.length).toBeLessThanOrEqual(6);
    expect(review?.missing).not.toContain('');
  });

  test('an improved version too long to be a message is refused, not cut short', () => {
    expect(parse(good({ improved: 'word '.repeat(2000) }))).toBeNull();
  });

  test('too little to judge: no scores and no rewritten message', () => {
    const review = parse(good({ tooShort: true, summary: 'Too short to judge.' }));
    expect(review).toMatchObject({ kind: 'message-review', tooShort: true, overall: null, rating: null, criteria: [], missing: [], improved: '', changes: [], summary: 'Too short to judge.' });
  });

  test('the private list of what a complete answer holds is never recited in the review’s own words of feedback', () => {
    expect(parse(good({ summary: `You forgot ${PRIVATE_MARKERS.mustInclude} here.` }))).toBeNull();
    expect(parse(good({ improved: `Hi Dana. ${PRIVATE_MARKERS.mustInclude}.` }))).toBeNull();
    expect(parse(good({ changes: [{ what: 'Added x', why: PRIVATE_MARKERS.mustInclude }] }))).toBeNull();
  });

  test('missing items are the gaps in the learner’s message, so they are not held to that rule', () => {
    expect(parse(good({ missing: [PRIVATE_MARKERS.mustInclude] }))?.missing).toEqual([PRIVATE_MARKERS.mustInclude]);
  });

  test('unreadable or wrongly shaped replies, and invented extras, are not passed on', () => {
    expect(parseReview('x', { task: TASK, learnerText: LEARNER })).toBeNull();
    expect(parse(null)).toBeNull();
    expect(JSON.stringify(parse(good({ modelAnswer: 'copy this' })))).not.toContain('modelAnswer');
  });
});

describe('schema, local too-short review and stored reading', () => {
  test('the schema asks for every field it later requires', () => {
    expect(REVIEW_SCHEMA.required).toEqual(['summary', 'criteria', 'missing', 'improved', 'changes', 'nextStep', 'tooShort']);
  });
  test('a too-short review made on the server has no scores', () => {
    expect(tooShortReview('Write a little more.')).toEqual({ kind: 'message-review', tooShort: true, overall: null, rating: null, summary: 'Write a little more.', criteria: [], missing: [], improved: '', changes: [], nextStep: '' });
  });
  test('reads back what was saved, and nothing damaged', () => {
    const review = parse(good());
    expect(readStoredReview(JSON.stringify(review))).toEqual(review);
    expect(readStoredReview(null)).toBeNull();
    expect(readStoredReview('{')).toBeNull();
    expect(readStoredReview(JSON.stringify({ kind: 'roleplay', tooShort: false, summary: 'x', criteria: [] }))).toBeNull();
  });
});
