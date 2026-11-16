import { addDays, toISODate, type ISODate } from '@/lib/dates';

type LessonDone = { lesson_id: string; course_id: string; completed_at: string | null };

/** The local calendar day of a stored timestamp. */
const dayOf = (timestamp: string): ISODate => toISODate(new Date(timestamp));

/** Lessons finished in the last seven days (today included): the figure the weekly goal is measured against. */
export function lessonsThisWeek(rows: readonly LessonDone[], today: ISODate): number {
  const first = addDays(today, -6);
  return rows.filter((row) => {
    if (!row.completed_at) return false;
    const day = dayOf(row.completed_at);
    return day >= first && day <= today;
  }).length;
}

/** The latest finished lessons, newest first. */
export function recentLessons(rows: readonly LessonDone[], limit = 3): LessonDone[] {
  return rows
    .filter((row): row is LessonDone & { completed_at: string } => !!row.completed_at)
    .sort((a, b) => (a.completed_at < b.completed_at ? 1 : a.completed_at > b.completed_at ? -1 : 0))
    .slice(0, limit);
}

/** How the week is going against a target, as a 0 to 1 fraction that never exceeds a full bar. */
export function weekFraction(done: number, target: number): number {
  return target > 0 ? Math.min(1, done / target) : 0;
}
