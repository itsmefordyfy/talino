import type { ProgressStatus } from '@/features/courses/lib/discovery/filters';
import type { LessonRow } from '@/features/courses/lib/progress';
import type { LearnerSignals, SignalProfile } from '@/features/courses/lib/recommendations';
import { NOT_SURE } from '@/features/onboarding/lib/options';

/** The learner said something that can shape recommendations: an experience level, a goal or an interest other than "not sure". */
export function isPersonalized(profile: Pick<SignalProfile, 'experience' | 'goals' | 'interests'> | null | undefined): boolean {
  if (!profile) return false;
  return profile.experience !== null || profile.goals.length > 0 || profile.interests.some((interest) => interest !== NOT_SURE);
}

/** When each course was last worked on, from its lessons' completion times (ISO strings sort as time). */
export function lastActivityByCourse(rows: readonly Pick<LessonRow, 'course_id' | 'completed_at'>[]): Record<string, string> {
  const latest: Record<string, string> = {};
  for (const row of rows) {
    if (row.completed_at && (!latest[row.course_id] || row.completed_at > latest[row.course_id])) latest[row.course_id] = row.completed_at;
  }
  return latest;
}

/**
 * A short string that is the same exactly when two sets of signals would give the same recommendations, so the (a few
 * milliseconds of) ranking is redone only when the learner's answers, progress or exploring really changed, not on every
 * render or keystroke.
 */
export function signalsKey(signals: LearnerSignals): string {
  const sorted = <T>(values: Iterable<T>) => [...values].sort();
  return JSON.stringify([
    signals.experience,
    sorted(signals.goals),
    sorted(signals.interests),
    sorted(signals.styles),
    signals.dailyMinutes,
    signals.assessmentLevel,
    sorted(signals.completed),
    sorted([...signals.started].map(([id, entry]) => `${id}:${entry.fraction.toFixed(3)}:${entry.lastActivityAt ?? ''}`)),
    sorted([...(signals.quizAverageByCategory ?? [])].map(([category, average]) => `${category}:${average.toFixed(2)}`)),
    sorted(Object.entries(signals.exploredTechnologies ?? {}).map(([id, count]) => `${id}:${count}`)),
  ]);
}

/** Remembers the last result of `make` for the last key: a one-entry cache, enough because there is one learner. */
export function memoByKey<T>(): (key: string, make: () => T) => T {
  let lastKey: string | null = null;
  let last: T;
  return (key, make) => {
    if (lastKey !== key) {
      last = make();
      lastKey = key;
    }
    return last;
  };
}

/** The learner's progress on any course for the Progress filter: completed, in progress (some lessons done) or not started. */
export function progressStatusOf(signals: Pick<LearnerSignals, 'completed' | 'started'>): (courseId: string) => ProgressStatus {
  return (courseId) => (signals.completed.has(courseId) ? 'completed' : signals.started.has(courseId) ? 'in-progress' : 'not-started');
}
