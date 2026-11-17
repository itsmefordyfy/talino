import { describe, expect, test } from '@jest/globals';

import { TASK } from '../test-support';
import { checkReviewText, minReviewWords } from './review-input';

const long = 'Hi Dana, I am sorry the draft is late because the checkout page took longer than I planned. I will send the whole draft on Friday at noon and update you tomorrow evening.';

describe('message review input', () => {
  test('the minimum is a third of the shortest target, never under ten words', () => {
    expect(minReviewWords(TASK)).toBe(20);
    expect(minReviewWords({ ...TASK, targetWords: { min: 15, max: 40 } })).toBe(10);
  });

  test('a real message is accepted', () => {
    expect(checkReviewText(TASK, long)).toEqual({ ok: true });
  });

  test('too little text is too short', () => {
    expect(checkReviewText(TASK, 'Sorry it is late.')).toEqual({ ok: false, reason: 'too_short' });
    expect(checkReviewText(TASK, '   ')).toEqual({ ok: false, reason: 'too_short' });
  });

  test('the task text pasted back is not the learner’s work', () => {
    expect(checkReviewText(TASK, TASK.received ?? '')).toEqual({ ok: false, reason: 'not_original' });
    // A paste with a word or two changed is the same paste.
    expect(checkReviewText(TASK, `${TASK.situation} ${TASK.brief}`.toUpperCase())).toEqual({ ok: false, reason: 'not_original' });
    expect(checkReviewText(TASK, `Dear Dana, ${TASK.situation} Thanks.`)).toEqual({ ok: false, reason: 'not_original' });
  });

  test('reusing a few of the task’s words is fine', () => {
    expect(checkReviewText(TASK, 'Hi Dana, you asked what is going on with the draft, so here is the honest answer: the checkout page ran long, I did not warn you, and I am sorry. Friday at noon is my new date.')).toEqual({ ok: true });
  });
});
