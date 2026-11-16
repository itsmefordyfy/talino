import type { CourseProgress } from '@/features/courses/lib/progress';

/**
 * The course Today leads with: the one the learner chose (when it isn't finished), else the course
 * they touched most recently that isn't finished (`progress` comes in catalog order, so the first
 * started one), else the starter course. Courses they don't own are skipped.
 */
export function pickFocusCourse(progress: readonly CourseProgress[], chosen: string | null, owns: (courseId: string) => boolean): string {
  const open = (entry: CourseProgress | undefined) => !!entry && !entry.complete && owns(entry.courseId);
  const chosenEntry = progress.find((entry) => entry.courseId === chosen);
  if (open(chosenEntry)) return chosenEntry!.courseId;
  const started = progress.find((entry) => entry.started && open(entry) && entry.courseId !== 'starter');
  if (started) return started.courseId;
  const starter = progress.find((entry) => entry.courseId === 'starter');
  if (open(starter)) return 'starter';
  return progress.find(open)?.courseId ?? 'starter';
}

/** The last seven days, oldest first, each marked when a lesson was finished that day. */
export function weekDots(days: readonly string[], today: string, addDays: (iso: string, n: number) => string): { day: string; done: boolean }[] {
  const set = new Set(days);
  return Array.from({ length: 7 }, (_, index) => {
    const day = addDays(today, index - 6);
    return { day, done: set.has(day) };
  });
}
