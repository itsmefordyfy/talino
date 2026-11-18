/**
 * Time spent learning today, for the daily goal (and its Lock Screen Live Activity). Pure, so it is tested: the clock that feeds it
 * (`api/study-clock.ts`) only measures, and these rules decide what counts.
 *
 * What counts: time while a lesson is open (reading, listening, the quiz, the practice) and the app is in front. Time in the background,
 * with the phone locked or in another app, never counts, and neither does a gap longer than `MAX_STEP_MS` between two ticks (the app
 * was frozen or the phone slept for a moment): that gap adds at most one step. A new local day starts from zero.
 */

/** A local calendar day as `YYYY-MM-DD` (the same shape as `lib/dates` `ISODate`; kept here so this file imports nothing). */
export type StudyDayId = string;

export type StudyDay = { day: StudyDayId; ms: number };

/** One tick adds at most this much, whatever the clock says. */
export const MAX_STEP_MS = 5_000;
/** More than this in a day is not learning (a lesson left open on a desk): the total stops here. */
export const MAX_DAY_MS = 12 * 60 * 60 * 1000;

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const emptyStudyDay = (day: StudyDayId): StudyDay => ({ day, ms: 0 });

/** A saved value read back defensively: anything unknown, or from another day, is a fresh day. */
export function studyDayFor(saved: unknown, today: StudyDayId): StudyDay {
  const record = saved as Partial<StudyDay> | null | undefined;
  if (!record || record.day !== today || !DAY_PATTERN.test(String(record.day))) return emptyStudyDay(today);
  const ms = Number(record.ms);
  return { day: today, ms: Number.isFinite(ms) && ms > 0 ? Math.min(MAX_DAY_MS, Math.round(ms)) : 0 };
}

/** The time between two ticks that counts as learning: nothing for a first tick or a clock that went backwards, and at most one step. */
export function elapsedStep(lastTickAt: number | null, now: number): number {
  if (lastTickAt === null) return 0;
  const gap = now - lastTickAt;
  if (!Number.isFinite(gap) || gap <= 0) return 0;
  return Math.min(gap, MAX_STEP_MS);
}

/** Adds `ms` of learning to `current` as of `today`: a day change starts over, and the day's total is capped. */
export function addStudyTime(current: StudyDay, today: StudyDayId, ms: number): StudyDay {
  const base = current.day === today ? current : emptyStudyDay(today);
  const add = Number.isFinite(ms) && ms > 0 ? ms : 0;
  return { day: today, ms: Math.min(MAX_DAY_MS, Math.round(base.ms + add)) };
}

/** Today's milliseconds from a record that may be from yesterday. */
export const studiedToday = (current: StudyDay, today: StudyDayId): number => (current.day === today ? current.ms : 0);
