import { coachErrorCode } from '@/features/coach/api/client';
import { ApiError } from '@/lib/api';

import type { PracticeText } from '../strings';
import type { ReviewInputCheck } from './review-input';

/**
 * Why a practice step did not go through, in the learner's words. The learner's text is always saved on the phone first, so every problem
 * here says so and (except the allowance running out) can be tried again. Pure: the screens pass `now` and the words.
 */
export type PracticeProblem = {
  code: string;
  /** When the day's allowance opens again, if the server said (an ISO time). */
  resetsAt: string | null;
};

export function problemFrom(error: unknown): PracticeProblem {
  const code = coachErrorCode(error);
  const resetsAt = error instanceof ApiError && typeof error.body.resetsAt === 'string' && Number.isFinite(Date.parse(error.body.resetsAt)) ? error.body.resetsAt : null;
  return { code, resetsAt };
}

/** The reason a message was not sent for review at all (checked on the phone before anything is asked of the server). */
export const problemOfInput = (check: Extract<ReviewInputCheck, { ok: false }>): PracticeProblem => ({ code: check.reason, resetsAt: null });

export type ProblemLook = {
  message: string;
  tone: 'info' | 'warning';
  /** Another try can help; false when the allowance ran out or the conversation is full. */
  retryable: boolean;
  /** Offer Talino Pro (the allowance is the reason). */
  offerPro: boolean;
};

/** "at 3:20 PM" today, "tomorrow at 3:20 PM", never a date; null when unknown or already past. */
export function returnTime(iso: string | null, now: Date, words: { at: (time: string) => string; tomorrowAt: (time: string) => string }, locale?: string): string | null {
  if (!iso) return null;
  const when = new Date(iso);
  if (!Number.isFinite(when.getTime()) || when <= now) return null;
  const time = when.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
  return when.toDateString() === now.toDateString() ? words.at(time) : words.tomorrowAt(time);
}

export function lookOf(problem: PracticeProblem, text: PracticeText, now: Date, locale?: string): ProblemLook {
  const known = text.errors[problem.code];
  if (problem.code === 'practice_limit') return { message: text.ui.limitBody(returnTime(problem.resetsAt, now, text.ui, locale)), tone: 'info', retryable: false, offerPro: true };
  if (problem.code === 'conversation_full') return { message: known, tone: 'info', retryable: false, offerPro: false };
  if (problem.code === 'network') return { message: known, tone: 'info', retryable: true, offerPro: false };
  // A message too short to send says what to do about it; one copied from the task says why it cannot be reviewed.
  if (problem.code === 'too_short') return { message: text.tooShortReview, tone: 'info', retryable: false, offerPro: false };
  // A lab prompt that cannot be run says what to change; none of these is a failure and none uses a session.
  if (problem.code === 'lab_too_short' || problem.code === 'lab_not_edited' || problem.code === 'lab_same_prompts') return { message: known, tone: 'info', retryable: false, offerPro: false };
  if (problem.code === 'not_original') return { message: known, tone: 'info', retryable: false, offerPro: false };
  return { message: known ?? text.errors.unknown, tone: 'warning', retryable: true, offerPro: false };
}
