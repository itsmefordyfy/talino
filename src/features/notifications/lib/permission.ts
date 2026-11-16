import * as Notifications from 'expo-notifications';

import { reportError } from '@/lib/monitoring';

/** Asks for notification permission (at the moment the learner turns a reminder on). True when granted. */
export async function requestNotificationPermission(): Promise<boolean> {
  if (process.env.EXPO_OS === 'web') return false;
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    return (await Notifications.requestPermissionsAsync()).granted;
  } catch (error) {
    reportError(error, 'notifications', { step: 'permission' });
    return false;
  }
}

export async function hasNotificationPermission(): Promise<boolean> {
  if (process.env.EXPO_OS === 'web') return false;
  try {
    return (await Notifications.getPermissionsAsync()).granted;
  } catch {
    return false;
  }
}

/** Cancels every scheduled notification whose identifier starts with `prefix`. */
export async function cancelScheduled(prefix: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(scheduled.filter((item) => item.identifier.startsWith(prefix)).map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)));
}
