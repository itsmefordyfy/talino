import { addDays, type ISODate } from '@/lib/dates';

export type Streak = {
  /** Days in a row up to today, or up to yesterday while today isn't done yet (it is still alive). */
  current: number;
  best: number;
  /** A lesson was finished today. */
  doneToday: boolean;
};

/** The streak from the days with a finished lesson (any order, duplicates allowed). */
export function computeStreak(days: readonly ISODate[], today: ISODate): Streak {
  const set = new Set(days);
  const doneToday = set.has(today);
  let current = 0;
  let cursor = doneToday ? today : addDays(today, -1);
  while (set.has(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }
  let best = 0;
  for (const day of set) {
    // Count runs from their first day only.
    if (set.has(addDays(day, -1))) continue;
    let length = 1;
    let next = addDays(day, 1);
    while (set.has(next)) {
      length += 1;
      next = addDays(next, 1);
    }
    best = Math.max(best, length);
  }
  return { current, best: Math.max(best, current), doneToday };
}
