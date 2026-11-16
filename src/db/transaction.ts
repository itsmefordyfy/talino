import type { SQLiteDatabase } from 'expo-sqlite';

let queue: Promise<unknown> = Promise.resolve();

/**
 * Runs `task` in a transaction, one at a time. All screens share a single connection, and SQLite
 * rejects a BEGIN while another transaction is open, which would silently drop one of two
 * overlapping writes. Queuing makes them wait instead.
 */
export function runInTransaction(db: SQLiteDatabase, task: () => Promise<void>): Promise<void> {
  const run = queue.then(() => db.withTransactionAsync(task));
  // Keep the queue alive after a failure; the caller still sees the error.
  queue = run.catch(() => undefined);
  return run;
}

/**
 * Runs `task` alone, in the same queue as every write, without a transaction around it: for work
 * that must ATTACH another database first (not allowed inside a transaction) and then opens its own.
 */
export function runExclusively<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task);
  queue = run.catch(() => undefined);
  return run;
}
