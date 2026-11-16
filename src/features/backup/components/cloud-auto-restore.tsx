import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { invalidateLocalQueries } from '@/db/invalidate';
import { reportError } from '@/lib/monitoring';

import { checkForBackup, startAutoRestore } from '../api/auto-restore';
import { createBackupContext } from '../api/default-context';
import { cloudProvider } from '../cloud/cloud-provider';
import { nextLookDelay } from '../lib/auto-restore';

/**
 * A fresh install's (or a new phone's) background restore, mounted once in `AppHosts`: the welcome shows at once
 * while this looks for a backup (iCloud on iPhone, the snapshot Android restored on Android), a few times as
 * iCloud catches up, and merges the newest good one in without asking. It never blocks, navigates or shows a
 * loading screen: the progress simply appears on whatever screen is open. An install that already has progress of
 * its own does nothing. A look that finds nothing is repeated for up to a week, then stops.
 */
export function CloudAutoRestore() {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    const ctx = createBackupContext(db);
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let attempt = 0;
    let busy = false;
    // A look asked for while one runs (iCloud's event, a return to the front) runs right after it.
    let wanted = false;
    let finished = false;
    let stopWatching: (() => void) | null = null;

    const stop = () => {
      finished = true;
      if (timer) clearTimeout(timer);
      timer = null;
      stopWatching?.();
      stopWatching = null;
    };

    const look = async () => {
      if (timer) clearTimeout(timer);
      timer = null;
      if (finished || cancelled) return;
      if (busy) {
        wanted = true;
        return;
      }
      busy = true;
      wanted = false;
      let result: Awaited<ReturnType<typeof checkForBackup>>;
      try {
        result = await checkForBackup(ctx);
      } catch (error) {
        reportError(error, 'app', { step: 'auto-restore' });
        busy = false;
        attempt += 1;
        if (!cancelled && !finished) timer = setTimeout(() => void look(), nextLookDelay(attempt));
        return;
      }
      busy = false;
      if (cancelled) return;
      if (result.restored) {
        stop();
        // Every screen reads the database again, whichever is open.
        await invalidateLocalQueries(queryClient);
        return;
      }
      if (!result.due) {
        stop();
        return;
      }
      if (wanted) {
        void look();
        return;
      }
      attempt += 1;
      timer = setTimeout(() => void look(), nextLookDelay(attempt));
    };

    void startAutoRestore(ctx).then((due) => {
      if (cancelled || !due) return;
      timer = setTimeout(() => void look(), nextLookDelay(0));
      try {
        // iPhone: iCloud says when a backup turns up, so the restore starts right then.
        stopWatching = cloudProvider.watch?.(() => void look()) ?? null;
      } catch (error) {
        reportError(error, 'app', { step: 'auto-restore-watch' });
      }
    }, (error: unknown) => reportError(error, 'app', { step: 'auto-restore-start' }));

    // Back from the background (a network came on, iCloud synced): look again if it is still due.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && !finished && ctx.autoRestore.get()?.status === 'pending') void look();
    });
    return () => {
      cancelled = true;
      stop();
      subscription.remove();
    };
  }, [db, queryClient]);

  return null;
}
