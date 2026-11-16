import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';

import { selectCareerReminders } from '@/features/settings/settings-slice';
import { useOnAppActive } from '@/hooks/use-on-app-active';
import { useLocalized } from '@/hooks/use-strings';
import { reportError } from '@/lib/monitoring';
import { setupNotificationHandler } from '@/lib/notification-handler';
import { useAppSelector } from '@/store/hooks';

import { useCareer } from '../hooks/use-career';
import { planCareerReminders, REMINDER_PREFIX, type CareerReminder } from '../lib/reminder-plan';
import { careerStrings } from '../strings';
import type { ApplicationRow } from '../types';

async function syncReminders(applications: readonly ApplicationRow[], enabled: boolean, plan: (rows: readonly ApplicationRow[]) => CareerReminder[]): Promise<void> {
  if (process.env.EXPO_OS === 'web') return;
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(scheduled.filter((request) => request.identifier.startsWith(REMINDER_PREFIX)).map((request) => Notifications.cancelScheduledNotificationAsync(request.identifier)));
    if (!enabled || applications.length === 0) return;
    // Asking belongs to a moment with a reason (the daily reminder's setup); here only an existing yes counts.
    const permission = await Notifications.getPermissionsAsync();
    if (!permission.granted) return;
    setupNotificationHandler();
    for (const reminder of plan(applications)) {
      await Notifications.scheduleNotificationAsync({
        identifier: reminder.identifier,
        content: { title: reminder.title, body: reminder.body, data: reminder.data },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: reminder.date },
      });
    }
  } catch (error) {
    reportError(error, 'notifications', { area: 'career' });
  }
}

/**
 * Keeps the phone's follow-up and interview reminders in step with the tracker: whenever the
 * applications or the Career reminders setting change (and on return to the app, where a permission
 * may have been granted meanwhile), every `career:` notification is cancelled and the plan scheduled
 * again. Runs one sync at a time so two quick saves never leave a stale reminder behind.
 */
export function CareerReminderSync() {
  const strings = useLocalized(careerStrings);
  const enabled = useAppSelector(selectCareerReminders);
  const career = useCareer();
  const applications = career.data?.applications;
  const [resumed, setResumed] = useState(0);
  const queue = useRef<Promise<void>>(Promise.resolve());

  useOnAppActive(() => setResumed((count) => count + 1));

  useEffect(() => {
    if (!applications) return;
    queue.current = queue.current.then(() => syncReminders(applications, enabled, (rows) => planCareerReminders(rows, new Date(), strings)));
  }, [applications, enabled, strings, resumed]);

  return null;
}
