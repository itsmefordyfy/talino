import type { QueryClient } from '@tanstack/react-query';

/**
 * Every query that reads this phone's data again, after a write, a sync or a restore. Queries that
 * read a server mark themselves `meta: { server: true }` (RevenueCat's plan and offerings) and are
 * left out: a local write can't change them, and refetching them on every save sent RevenueCat a
 * customer-info read per write (and the offerings, with the paywall or upgrade card open). They
 * keep their own schedule (staleness, return to the app, purchases).
 */
export function invalidateLocalQueries(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ predicate: (query) => query.meta?.server !== true });
}
