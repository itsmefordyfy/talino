import { defineStrings } from '@/lib/i18n';

/** The welcome's notifications step (owner, 2026-11-16). English only (owner's standing rule: no Filipino text), so `fil` copies it. */
const en = {
  title: 'Stay on track',
  body: 'Allow notifications and Talino can nudge you at the right time. You can change this any time in Settings.',
  points: [
    { icon: 'notifications', text: 'A reminder for your daily lesson, at the time you chose' },
    { icon: 'local_fire_department', text: 'A heads-up before your streak is at risk' },
    { icon: 'work', text: 'Follow-ups and interviews from your Career tracker' },
  ],
  allow: 'Allow notifications',
  notNow: 'Not now',
  allowed: 'Notifications are on.',
  denied: 'Notifications are off for Talino. You can turn them on in your phone’s Settings.',
};

export const onboardingNotificationStrings = defineStrings({ en, fil: en });
