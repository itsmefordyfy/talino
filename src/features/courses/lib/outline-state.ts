import type { LessonState } from './progress';

/** How a lesson row in the course outline is drawn. */
export type OutlineRowState = 'done' | 'current' | 'next' | 'locked';

/**
 * The state a lesson shows in the course outline. The lesson on screen is always "current" (even a finished one: it is where
 * the learner is). A lesson locked behind an earlier one shows as locked only for a course the learner owns; for a course they
 * don't own every row opens the paywall, so none is drawn as locked behind an earlier lesson, they show their real progress state
 * with a lock only on the ones that would stay locked.
 */
export function outlineRowState(lessonState: LessonState, isCurrent: boolean): OutlineRowState {
  if (isCurrent) return 'current';
  return lessonState;
}

/** Whether pressing the row does nothing: a lesson not yet reachable in a course the learner owns, or the lesson already open. */
export function outlineRowInert(lessonState: LessonState, isCurrent: boolean, owned: boolean): boolean {
  return isCurrent || (owned && lessonState === 'locked');
}
