/**
 * The buttons on the daily lesson reminder, on the Lock Screen, in the notification shade and on a paired Apple Watch (a reminder
 * mirrors to the Watch, which draws the same buttons). A tap on the reminder itself still opens Talino as before.
 *
 * - `start`: opens Talino on the lesson (the reminder's own link), like a tap.
 * - `later`: plans one more reminder an hour on, without opening the app.
 *
 * The words are English only (owner's rule: no Filipino text written by Claude), the same as the Watch app's.
 */
export const DAILY_CATEGORY = 'daily-lesson';
export const START_ACTION = 'start';
export const LATER_ACTION = 'later';

/** A snoozed reminder has its own id prefix, so planning the week again (which clears `daily:`) never removes it. */
export const LATER_PREFIX = 'daily-later:';
export const LATER_MINUTES = 60;

export const REMINDER_BUTTONS = [
  { identifier: START_ACTION, buttonTitle: 'Start now', opensApp: true },
  { identifier: LATER_ACTION, buttonTitle: 'In 1 hour', opensApp: false },
] as const;

export type SnoozedReminder = { id: string; date: Date; title: string; body: string };

/**
 * The reminder to schedule when the learner taps "In 1 hour": the same words, an hour from `now`. The id is made from the original
 * reminder's, so tapping again, or handling the same tap twice, replaces it rather than adding another.
 */
export function planLater(input: { now: Date; originalId: string; title: string; body: string }): SnoozedReminder {
  const base = input.originalId.startsWith(LATER_PREFIX) ? input.originalId.slice(LATER_PREFIX.length) : input.originalId;
  return { id: `${LATER_PREFIX}${base}`, date: new Date(input.now.getTime() + LATER_MINUTES * 60_000), title: input.title, body: input.body };
}
