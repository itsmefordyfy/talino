import { describe, expect, test } from '@jest/globals';

import { planDailyReminders } from './daily-plan';

describe('planDailyReminders in Tagalog', () => {
  const base = { today: '2026-11-13', time: { hour: 19, minute: 0 }, streak: 3, courseTitle: 'Developer', now: new Date(2026, 10, 13, 8, 0), doneToday: false };

  test('the same plan, with the words in the chosen language', () => {
    const en = planDailyReminders(base);
    const fil = planDailyReminders({ ...base, language: 'fil' });
    expect(fil.map((reminder) => reminder.id)).toEqual(en.map((reminder) => reminder.id));
    expect(fil[0].title).toBe('Ingatan ang 3-day streak mo');
    expect(fil[1].title).toBe('Ang 15 minuto mo para sa Talino');
    expect(fil[0].body).toBe('Handa na ang lesson mo ngayon sa Developer.');
    expect(planDailyReminders({ ...base, courseTitle: null, language: 'fil' })[1].body).toContain('Handa na ang lesson');
  });
});
