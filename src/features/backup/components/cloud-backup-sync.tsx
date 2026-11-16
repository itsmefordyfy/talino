import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { selectAutoBackup } from '@/features/settings/settings-slice';
import { onDataChanged } from '@/lib/data-changed';
import { useAppSelector } from '@/store/hooks';

import { runAutoBackup } from '../api/auto-backup';
import { createBackupContext } from '../api/default-context';
import { createBackupScheduler } from '../lib/scheduler';

/**
 * The automatic backup, running beside the screens (mounted once, in `AppHosts`). While the switch is on, any
 * change to the learner's data or a saved setting (every write and every saved setting calls `notifyDataChanged`)
 * is backed up once things settle: about 15 seconds after the last change, at most a minute after the first
 * of a burst. The app going to the background runs a waiting backup at once. At launch (or when the switch is
 * turned on) a backup is due if the last run failed, none was ever made, or the switch was just turned on.
 * Off, nothing runs. A failed run is remembered for the Backup & Restore screen and tried again with the next
 * change; it never gets in the way of learning.
 */
export function CloudBackupSync() {
  const db = useSQLiteContext();
  const enabled = useAppSelector(selectAutoBackup);
  const launched = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const ctx = createBackupContext(db);
    const scheduler = createBackupScheduler({
      run: async () => {
        await runAutoBackup(createBackupContext(db));
      },
    });
    const { state } = ctx.runState.get();
    // First time in this launch: only if something is owed. Turned on later: back up what changed while it was off.
    if (launched.current || state.lastError !== null || state.lastSnapshotAt === null) scheduler.markChanged();
    launched.current = true;
    const stopListening = onDataChanged(() => scheduler.markChanged());
    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'background' || next === 'inactive') scheduler.flush();
    });
    return () => {
      scheduler.dispose();
      stopListening();
      subscription.remove();
    };
  }, [enabled, db]);

  return null;
}
