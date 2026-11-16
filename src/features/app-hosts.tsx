import { CloudAutoRestore, CloudBackupSync } from '@/features/backup';
import { CareerReminderSync } from '@/features/career';
import { BadgeSync } from '@/features/me';
import { DailyReminderSync, NotificationRouter } from '@/features/notifications';
import { ProCelebrationHost, useCustomerInfoUpdates } from '@/features/store';
import { WatchSync } from '@/features/watch';
import { WhatsNewHost } from '@/features/whats-new';

/**
 * Everything that runs beside the screens: purchases kept in step with the store, badges awarded as
 * progress changes (and celebrated), Talino Pro celebrated after a purchase, reminders kept in step with the settings and the tracker, a
 * Apple Watch kept in step with the streak, the week and Listen, a class kept up to date with the learner's progress, taps on reminders, the automatic backup of the learner's
 * progress and the restore that looks for one on a fresh install.
 */
export function AppHosts() {
  useCustomerInfoUpdates();
  return (
    <>
      <NotificationRouter />
      <DailyReminderSync />
      <CareerReminderSync />
      <WatchSync />
      <BadgeSync />
      <ProCelebrationHost />
      <CloudAutoRestore />
      <CloudBackupSync />
      <WhatsNewHost />
    </>
  );
}
