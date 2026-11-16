import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { getCourse, useLearning } from '@/features/courses/data';
import { selectLanguage, selectDailyMinutes, selectDailyReminder, selectDailyReminderTime, selectFocusCourseId, selectReminderDays } from '@/features/settings/settings-slice';
import { useOnAppActive } from '@/hooks/use-on-app-active';
import { todayISO } from '@/lib/dates';
import { reportError } from '@/lib/monitoring';
import { useAppSelector } from '@/store/hooks';

import { DAILY_PREFIX, planDailyReminders } from '../lib/daily-plan';
import { cancelScheduled, hasNotificationPermission } from '../lib/permission';
import { DAILY_CATEGORY, LATER_PREFIX, REMINDER_BUTTONS } from '../lib/reminder-actions';

let running: Promise<void> = Promise.resolve();

/** The Start now / In 1 hour buttons on the reminder (and on a paired Watch's copy of it). Safe to repeat. */
export async function registerReminderButtons(): Promise<void> {
  await Notifications.setNotificationCategoryAsync(
    DAILY_CATEGORY,
    REMINDER_BUTTONS.map((button) => ({ identifier: button.identifier, buttonTitle: button.buttonTitle, options: { opensAppToForeground: button.opensApp } })),
  );
}

/** Keeps the week's daily lesson reminders in step with the setting, the time and today's progress. */
export function DailyReminderSync() {
  const enabled = useAppSelector(selectDailyReminder);
  const time = useAppSelector(selectDailyReminderTime);
  const focus = useAppSelector(selectFocusCourseId);
  const days = useAppSelector(selectReminderDays);
  const minutes = useAppSelector(selectDailyMinutes);
  const language = useAppSelector(selectLanguage);
  const learning = useLearning();
  const { doneToday, current } = learning.streak;
  const courseTitle = (focus ? getCourse(focus)?.title : null) ?? null;
  const key = `${enabled}|${time.hour}:${time.minute}|${doneToday}|${current}|${courseTitle}|${days.join(',')}|${minutes}|${language}|${learning.isPending}`;

  const sync = () => {
    if (learning.isPending || process.env.EXPO_OS === 'web') return;
    // One run at a time, so two quick changes can't schedule a day twice.
    running = running.then(async () => {
      try {
        await cancelScheduled(DAILY_PREFIX);
        // A lesson done means a snoozed reminder for the same day has no reason left to fire.
        if (doneToday || !enabled) await cancelScheduled(LATER_PREFIX);
        await registerReminderButtons();
        if (!enabled || !(await hasNotificationPermission())) return;
        const plan = planDailyReminders({ now: new Date(), today: todayISO(), time, doneToday, streak: current, courseTitle, days, minutes, language });
        for (const reminder of plan) {
          await Notifications.scheduleNotificationAsync({
            identifier: reminder.id,
            content: { title: reminder.title, body: reminder.body, data: { url: '/' }, categoryIdentifier: DAILY_CATEGORY },
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: reminder.date },
          });
        }
      } catch (error) {
        reportError(error, 'notifications', { step: 'daily' });
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` captures every input of `sync`.
  useEffect(sync, [key]);
  useOnAppActive(sync);
  return null;
}
