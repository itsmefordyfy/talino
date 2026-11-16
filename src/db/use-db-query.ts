import { keepPreviousData as previousData, useQuery, type QueryKey } from '@tanstack/react-query';
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

/**
 * Reads from the local database through TanStack Query for caching and loading/error state.
 *
 * Every mounted screen stays subscribed, including ones under a sheet or on another tab, so a
 * write anywhere refetches and shows up everywhere at once. Local reads are cheap, and a screen
 * only re-renders when its data actually changed.
 */
export function useDbQuery<TResult>(
  queryKey: QueryKey,
  read: (db: SQLiteDatabase) => Promise<TResult>,
  options?: {
    enabled?: boolean;
    /** While a new key loads, keep returning the previous key's data instead of none. */
    keepPreviousData?: boolean;
  },
) {
  const db = useSQLiteContext();
  return useQuery({
    queryKey,
    queryFn: () => read(db),
    enabled: options?.enabled,
    placeholderData: options?.keepPreviousData ? previousData : undefined,
  });
}
