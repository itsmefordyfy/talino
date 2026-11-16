import Storage from 'expo-sqlite/kv-store';

import { notifyDataChanged } from '@/lib/data-changed';


/**
 * Read synchronously at startup so the first frame already has the owner's language and
 * appearance: no spinner or flash of the wrong language. Stored values are merged over `initial`,
 * so new fields get their defaults.
 */
export function loadSlice<T extends object>(key: string, initial: T): T {
  try {
    const raw = Storage.getItemSync(key);
    return raw ? { ...initial, ...(JSON.parse(raw) as Partial<T>) } : initial;
  } catch {
    return initial;
  }
}

/** Whether this phone has saved `key` before: false only on a fresh install (or after the app's data is cleared). */
export function hasSavedSlice(key: string): boolean {
  try {
    return Storage.getItemSync(key) !== null;
  } catch {
    return false;
  }
}

/** Each key's write in flight, so writes to one key happen in order. */
const writing = new Map<string, Promise<void>>();

/**
 * Saves a slice in the background, one write per key at a time and always the latest value: two
 * quick changes (an appearance and a language set together) started two async writes that could
 * finish out of order, leaving the older state on disk (seen in Bubblie, 2026-11-02).
 */
export function saveSlice(key: string, value: unknown): void {
  const json = JSON.stringify(value);
  const previous = writing.get(key) ?? Promise.resolve();
  const next = previous
    .then(() => Storage.setItemAsync(key, json))
    .then(notifyDataChanged, (error: unknown) => {
      // Persisting is best-effort; the in-memory store stays correct.
      if (__DEV__) console.warn('Saving settings failed', key, error);
    });
  writing.set(key, next);
}
