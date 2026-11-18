import kvStore from 'expo-sqlite/kv-store';
import { useSyncExternalStore } from 'react';

import { parseVisits, withVisit, type LessonVisits } from '../lib/lesson-visits';

/**
 * The lesson last opened in each course ("where you left off"), kept on this phone only, in the key-value store like today's study time:
 * it is a bookmark, not progress, so it is never backed up or synced and losing it loses nothing the learner earned. Module state with a
 * tiny subscribe, so the lesson screen records and My Learning reads without either re-rendering the other.
 */

const KEY = 'lesson-visits:v1';

let current: LessonVisits | null = null;
const listeners = new Set<() => void>();

export function getLessonVisits(): LessonVisits {
  if (current) return current;
  try {
    const raw = kvStore.getItemSync(KEY);
    current = parseVisits(raw ? JSON.parse(raw) : null);
  } catch {
    current = {};
  }
  return current;
}

/** Notes that this lesson was opened. Best-effort: a failed save only means the bookmark is lost after a restart. */
export function recordLessonVisit(courseId: string, lessonId: string, at: Date = new Date()): void {
  const known = getLessonVisits()[courseId];
  // Reopening the lesson already marked changes nothing worth a write.
  if (known?.lessonId === lessonId && at.getTime() - Date.parse(known.at) < 60_000) return;
  current = withVisit(getLessonVisits(), courseId, lessonId, at.toISOString());
  kvStore.setItemAsync(KEY, JSON.stringify(current)).catch((error: unknown) => {
    if (__DEV__) console.warn('Saving the lesson bookmark failed', error);
  });
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The lessons last opened, per course, updating as lessons are opened. */
export function useLessonVisits(): LessonVisits {
  return useSyncExternalStore(subscribe, getLessonVisits);
}
