import * as Notifications from 'expo-notifications';

let handlerSet = false;

/**
 * Reminders show as banners even while Talino is open. One handler for every kind of reminder
 * (the daily lesson, career follow-ups); the first call sets it, later ones do nothing.
 */
export function setupNotificationHandler(): void {
  if (handlerSet || process.env.EXPO_OS === 'web') return;
  handlerSet = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
  });
}
