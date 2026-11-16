import { useState } from 'react';

/**
 * What a learner has picked but not finished, kept while the app is open. Practice unmounts its activities when the learner
 * goes back to the lesson ("Review the lesson") and remounts them on return; without this every matched pair and chosen
 * option would be gone. Memory only on purpose: a solve is saved by the game layer, and a half-done pick is not worth keeping
 * across launches (or worth showing against changed content).
 */
const drafts = new Map<string, unknown>();

const keyOf = (activityId: string, slot: string) => `${activityId}:${slot}`;

/** `useState` whose value outlives the component: the same activity and slot start from where they were left. */
export function useActivityDraft<T>(activityId: string, slot: string, initial: T): [T, (next: T | ((current: T) => T)) => void] {
  const key = keyOf(activityId, slot);
  const [value, setValue] = useState<T>(() => (drafts.has(key) ? (drafts.get(key) as T) : initial));
  const set = (next: T | ((current: T) => T)) =>
    setValue((current) => {
      const resolved = typeof next === 'function' ? (next as (current: T) => T)(current) : next;
      drafts.set(key, resolved);
      return resolved;
    });
  return [value, set];
}

/** Forgets every draft of an activity (it was solved, or the learner starts over). */
export function clearActivityDraft(activityId: string): void {
  const prefix = `${activityId}:`;
  for (const key of [...drafts.keys()]) if (key.startsWith(prefix)) drafts.delete(key);
}

/** Forgets everything (tests, and "Delete all data"). */
export function clearAllActivityDrafts(): void {
  drafts.clear();
}
