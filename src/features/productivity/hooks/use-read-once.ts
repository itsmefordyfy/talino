import { useEffect, useRef, useState } from 'react';

import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

export type ReadOnce<T> = { status: 'loading' } | { status: 'error'; retry: () => void } | { status: 'ready'; data: T };

/**
 * Reads something from the database when a tool opens (and again for a new `key`), and never refreshes it afterwards. A tool that is seeded from
 * its saved state and then owns it (the running timer, the prompt being edited) must not be re-seeded when a later write elsewhere refetches
 * every local query, and must not start from a cached copy that is older than its last save, so these reads stay out of the query cache.
 */
export function useReadOnce<T>(key: string, read: (db: SQLiteDatabase) => Promise<T>): ReadOnce<T> {
  const db = useSQLiteContext();
  const [attempt, setAttempt] = useState(0);
  const [done, setDone] = useState<{ id: string; outcome: { ok: true; data: T } | { ok: false } } | null>(null);
  const id = `${key}#${attempt}`;
  const readRef = useRef(read);
  useEffect(() => {
    readRef.current = read;
  });

  useEffect(() => {
    let alive = true;
    readRef.current(db).then(
      (data) => alive && setDone({ id, outcome: { ok: true, data } }),
      () => alive && setDone({ id, outcome: { ok: false } }),
    );
    return () => {
      alive = false;
    };
  }, [db, id]);

  if (!done || done.id !== id) return { status: 'loading' };
  if (!done.outcome.ok) return { status: 'error', retry: () => setAttempt((count) => count + 1) };
  return { status: 'ready', data: done.outcome.data };
}
