import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

import { notifyDataChanged } from '@/lib/data-changed';

import { invalidateLocalQueries } from './invalidate';

/**
 * Wraps a local-database write. Local reads are cheap, so every write simply invalidates every
 * local query: no hand-maintained dependency map that could go stale. A failed write invalidates too.
 * It also says the data changed (`notifyDataChanged`, which starts a cloud backup) unless told not to.
 */
export function useDbMutation<TVariables, TResult = void>(mutate: (db: SQLiteDatabase, variables: TVariables) => Promise<TResult>, options: { notify?: boolean } = {}) {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: TVariables) => mutate(db, variables),
    onSuccess: () => {
      // `notify: false` for data no backup, sync or reminder reads (Ollie's saved chats): a change there must not start a cloud backup of everything else.
      if (options.notify !== false) notifyDataChanged();
      return invalidateLocalQueries(queryClient);
    },
    onError: () => invalidateLocalQueries(queryClient),
  });
}
