import { describe, expect, test } from '@jest/globals';

import { DAILY_PREFIX } from './daily-plan';
import { LATER_PREFIX, planLater, REMINDER_BUTTONS } from './reminder-actions';

describe('planLater', () => {
  const now = new Date(2026, 10, 16, 19, 0);

  test('the same words, an hour on', () => {
    const later = planLater({ now, originalId: 'daily:2026-11-16', title: 'Keep your 3-day streak', body: 'Ready.' });
    expect(later).toMatchObject({ id: 'daily-later:daily:2026-11-16', title: 'Keep your 3-day streak', body: 'Ready.' });
    expect(later.date.getTime() - now.getTime()).toBe(60 * 60_000);
  });

  test('snoozing a snoozed reminder keeps one id, so handling a tap twice adds nothing', () => {
    const first = planLater({ now, originalId: 'daily:2026-11-16', title: 't', body: 'b' });
    const again = planLater({ now, originalId: first.id, title: 't', body: 'b' });
    expect(again.id).toBe(first.id);
  });

  test('its id is outside the week plan, so planning the week never clears it', () => {
    expect(LATER_PREFIX.startsWith(DAILY_PREFIX)).toBe(false);
  });

  test('two buttons: start opens the app, later does not', () => {
    expect(REMINDER_BUTTONS.map((button) => [button.identifier, button.opensApp])).toEqual([['start', true], ['later', false]]);
  });
});
