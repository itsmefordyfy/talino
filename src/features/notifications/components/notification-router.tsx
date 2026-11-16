import * as Notifications from 'expo-notifications';
import { router, type Href } from 'expo-router';
import { useEffect } from 'react';

import { reportError } from '@/lib/monitoring';
import { setupNotificationHandler } from '@/lib/notification-handler';

import { hasNotificationPermission } from '../lib/permission';
import { LATER_ACTION, planLater } from '../lib/reminder-actions';

/** Shows reminders while the app is open, and opens the screen a tapped reminder points to (`data.url`). */
export function NotificationRouter() {
  useEffect(() => {
    if (process.env.EXPO_OS === 'web') return;
    setupNotificationHandler();
    // "In 1 hour": one more reminder with the same words, without opening Talino. Handled from the live listener only: the last response
    // is still there on the next cold start and must not move the reminder again.
    const snooze = async (response: Notifications.NotificationResponse) => {
      try {
        if (!(await hasNotificationPermission())) return;
        const { request } = response.notification;
        const later = planLater({ now: new Date(), originalId: request.identifier, title: request.content.title ?? 'Talino', body: request.content.body ?? '' });
        await Notifications.scheduleNotificationAsync({
          identifier: later.id,
          content: { title: later.title, body: later.body, data: request.content.data },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: later.date },
        });
      } catch (error) {
        reportError(error, 'notifications', { step: 'snooze' });
      }
    };
    const open = (response: Notifications.NotificationResponse | null) => {
      const url = response?.notification.request.content.data?.url;
      if (typeof url === 'string' && url.startsWith('/')) router.push(url as Href);
    };
    const last = Notifications.getLastNotificationResponse();
    if (last?.actionIdentifier !== LATER_ACTION) open(last);
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      if (response.actionIdentifier === LATER_ACTION) void snooze(response);
      else open(response);
    });
    return () => subscription.remove();
  }, []);
  return null;
}
