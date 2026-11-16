import { useQuery } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';

import { useOnAppActive } from '@/hooks/use-on-app-active';

import { autoRestoreStore, runStateStore } from '../api/default-context';
import { cloudProvider } from '../cloud/cloud-provider';
import type { AutoRestoreState } from '../lib/auto-restore';
import type { CloudAvailability } from '../lib/status';
import { backupQueryKeys } from './query-keys';

/** The automatic backup's last run and whether one is going now; updates the screen as it changes. */
export function useRunState() {
  return useSyncExternalStore(runStateStore.subscribe, runStateStore.get, runStateStore.get);
}

/**
 * iCloud's availability on iPhone (null until asked; "unavailable" elsewhere). Asked again when the app comes back to
 * the front, because the learner may have just turned iCloud Drive on in Settings.
 */
export function useCloudAvailability(): CloudAvailability | null {
  const query = useQuery({ queryKey: backupQueryKeys.cloud, queryFn: () => cloudProvider.status(), meta: { server: true }, staleTime: 0 });
  useOnAppActive(() => void query.refetch());
  return query.data ?? null;
}

/** The fresh-install restore's state (null: it never started). It is a quick local read, taken each time the screen draws. */
export function readAutoRestoreState(): AutoRestoreState | null {
  return autoRestoreStore.get();
}
