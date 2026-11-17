import { describe, expect, test } from '@jest/globals';

import { ApiError } from '@/lib/api';

import { practiceStrings } from '../strings';
import { lookOf, problemFrom, problemOfInput, returnTime } from './problem';

const text = practiceStrings.en;
const noon = new Date('2026-11-17T12:00:00');

describe('problemFrom', () => {
  test('reads the code and the time the allowance returns from the route’s answer', () => {
    const error = new ApiError('practice_limit', 429, { resetsAt: '2026-11-18T09:20:00.000Z' });
    expect(problemFrom(error)).toEqual({ code: 'practice_limit', resetsAt: '2026-11-18T09:20:00.000Z' });
  });
  test('ignores a time that is not a time, and names unknown failures', () => {
    expect(problemFrom(new ApiError('practice_limit', 429, { resetsAt: 'soon' })).resetsAt).toBeNull();
    expect(problemFrom(new Error('boom'))).toEqual({ code: 'unknown', resetsAt: null });
    expect(problemFrom(new ApiError('network')).code).toBe('network');
  });
  test('a bare 429 from the host reads as the limit', () => {
    expect(problemFrom(new ApiError('unknown', 429)).code).toBe('chat_limit');
  });
});

describe('what each problem says and offers', () => {
  test('the allowance running out names the time, offers Pro and no retry', () => {
    const later = new Date(noon.getTime() + 3 * 3_600_000).toISOString();
    const look = lookOf({ code: 'practice_limit', resetsAt: later }, text, noon, 'en-US');
    expect(look.message).toMatch(/opens at 3:00 PM/);
    expect(look).toMatchObject({ retryable: false, offerPro: true, tone: 'info' });
  });
  test('tomorrow is a word, never a date', () => {
    const tomorrow = new Date(noon.getTime() + 24 * 3_600_000).toISOString();
    expect(lookOf({ code: 'practice_limit', resetsAt: tomorrow }, text, noon, 'en-US').message).toMatch(/opens tomorrow at 12:00 PM/);
  });
  test('without a time it still says when to expect it', () => {
    expect(lookOf({ code: 'practice_limit', resetsAt: null }, text, noon).message).toMatch(/within 24 hours/);
  });
  test('offline is calm and can be retried; the words are saved', () => {
    const look = lookOf({ code: 'network', resetsAt: null }, text, noon);
    expect(look).toMatchObject({ tone: 'info', retryable: true, offerPro: false });
    expect(look.message).toMatch(/saved/);
  });
  test('an unknown code falls back to the generic line that also says the words are saved', () => {
    const look = lookOf({ code: 'weird', resetsAt: null }, text, noon);
    expect(look.message).toBe(text.errors.unknown);
    expect(look.retryable).toBe(true);
  });
  test('a full conversation points to ending it, with no retry', () => {
    expect(lookOf({ code: 'conversation_full', resetsAt: null }, text, noon)).toMatchObject({ retryable: false });
  });
  test('a message that is too short or copied from the task is explained, not retried', () => {
    expect(lookOf(problemOfInput({ ok: false, reason: 'not_original' }), text, noon)).toMatchObject({ retryable: false, message: text.errors.not_original });
    expect(lookOf(problemOfInput({ ok: false, reason: 'too_short' }), text, noon).message).toBe(text.tooShortReview);
  });
});

describe('returnTime', () => {
  test('null for nothing, garbage or the past', () => {
    expect(returnTime(null, noon, text.ui)).toBeNull();
    expect(returnTime('nope', noon, text.ui)).toBeNull();
    expect(returnTime(new Date(noon.getTime() - 1000).toISOString(), noon, text.ui)).toBeNull();
  });
});

describe('a lab prompt that cannot be run', () => {
  test.each(['lab_too_short', 'lab_not_edited', 'lab_same_prompts'])('%s says what to change, offers no retry and no Pro', (code) => {
    const look = lookOf({ code, resetsAt: null }, text, noon);
    expect(look.message).toBe(text.errors[code]);
    expect(look).toMatchObject({ tone: 'info', retryable: false, offerPro: false });
  });
});
