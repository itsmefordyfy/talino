import kvStore from 'expo-sqlite/kv-store';

import { todayISO } from '@/lib/dates';

import { addStudyTime, emptyStudyDay, studiedToday, studyDayFor, type StudyDay } from '../lib/study-time';

/**
 * Today's learning time, kept on this phone only (the phone's key-value store, like the Watch's snapshot: it is a day's counter, not
 * the learner's data, so it is never backed up or synced). Module state with a tiny subscribe, so the lesson screen adds time and the
 * Lock Screen card reads it without either re-rendering the other.
 */

const KEY = 'study-time:v1';
/** Saved at most this often while time is being added, and at once when learning stops. */
const SAVE_EVERY_MS = 5_000;

let current: StudyDay | null = null;
let savedAt = 0;
let dirty = false;
const listeners = new Set<() => void>();

function read(today: string): StudyDay {
  if (current && current.day === today) return current;
  try {
    const raw = kvStore.getItemSync(KEY);
    current = studyDayFor(raw ? JSON.parse(raw) : null, today);
  } catch {
    current = emptyStudyDay(today);
  }
  return current;
}

/** Milliseconds learned today (a new local day starts from zero). */
export function getStudiedMs(today: string = todayISO()): number {
  return studiedToday(read(today), today);
}

/** Adds time that was spent learning (already judged by `elapsedStep`), saves it soon and tells the listeners. */
export function addStudyMs(ms: number, now: number = Date.now()): void {
  if (!(ms > 0)) return;
  const today = todayISO();
  current = addStudyTime(read(today), today, ms);
  dirty = true;
  if (now - savedAt >= SAVE_EVERY_MS) flushStudy(now);
  for (const listener of listeners) listener();
}

/** Writes the counter now, if it changed since the last write. Best-effort: the in-memory count stays right either way. */
export function flushStudy(now: number = Date.now()): void {
  if (!dirty || !current) return;
  dirty = false;
  savedAt = now;
  kvStore.setItemAsync(KEY, JSON.stringify(current)).catch((error: unknown) => {
    if (__DEV__) console.warn('Saving study time failed', error);
  });
}

export function subscribeStudy(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Test seam: forget the in-memory state so the next read comes from storage. */
export function resetStudyClockForTests(): void {
  current = null;
  savedAt = 0;
  dirty = false;
  listeners.clear();
}
