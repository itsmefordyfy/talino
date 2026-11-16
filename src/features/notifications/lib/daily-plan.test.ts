import { describe, expect, test } from '@jest/globals';

import { planDailyReminders } from './daily-plan';

describe('planDailyReminders', () => {
  const base = { today: '2026-11-13', time: { hour: 19, minute: 0 }, streak: 3, courseTitle: 'Developer' };

  test('a week of reminders at the chosen time, today first with the streak', () => {
    const plan = planDailyReminders({ ...base, now: new Date(2026, 10, 13, 8, 0), doneToday: false });
    expect(plan).toHaveLength(7);
    expect(plan[0]).toMatchObject({ id: 'daily:2026-11-13', title: 'Keep your 3-day streak' });
    expect(plan[0].date.getHours()).toBe(19);
    expect(plan[1].title).toBe('Your 15 minutes with Talino');
  });

  test('today is skipped once done or once its time has passed', () => {
    expect(planDailyReminders({ ...base, now: new Date(2026, 10, 13, 8, 0), doneToday: true })[0].id).toBe('daily:2026-11-14');
    expect(planDailyReminders({ ...base, now: new Date(2026, 10, 13, 20, 0), doneToday: false })[0].id).toBe('daily:2026-11-14');
  });

  test('only the chosen weekdays, in the learner’s own minutes', () => {
    // 2026-11-13 is a Friday (5); Monday (1) and Wednesday (3) fall on the 16th and 18th.
    const plan = planDailyReminders({ ...base, now: new Date(2026, 10, 13, 8, 0), doneToday: false, days: [1, 3], minutes: 10 });
    expect(plan.map((reminder) => reminder.id)).toEqual(['daily:2026-11-16', 'daily:2026-11-18']);
    expect(plan[0].title).toBe('Your 10 minutes with Talino');
  });
});
