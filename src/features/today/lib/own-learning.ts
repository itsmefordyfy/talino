import type { PathPlan } from '@/features/courses';

/** Most other started courses Today lists under the one it leads with. */
export const TODAY_OTHER_STARTED = 2;

export type StartedEntry = { fraction: number; lastActivityAt?: string };

/** Ids of the courses started and not finished other than the one Today leads with, the most recently worked on first. */
export function otherStarted(started: ReadonlyMap<string, StartedEntry>, leadingCourseId: string | null, limit = TODAY_OTHER_STARTED): string[] {
  return [...started]
    .filter(([id]) => id !== leadingCourseId)
    .sort(([, a], [, b]) => (b.lastActivityAt ?? '').localeCompare(a.lastActivityAt ?? '') || b.fraction - a.fraction)
    .slice(0, limit)
    .map(([id]) => id);
}

/**
 * The learning path the learner is actually on: among the plans, the unfinished one with the most progress (courses done, then how far the
 * course in hand is). A path nobody has started is never returned, so Today shows only a road the learner already walks (finding one
 * is Discover's job). Ties go to the better fit.
 */
export function pathInProgress(plans: readonly PathPlan[]): PathPlan | null {
  const progress = (plan: PathPlan) => plan.steps.reduce((sum, step) => sum + (step.state === 'done' ? 1 : step.fraction), 0);
  const open = plans.filter((plan) => plan.done < plan.total && progress(plan) > 0);
  return [...open].sort((a, b) => progress(b) - progress(a) || b.fit - a.fit)[0] ?? null;
}

export type PathAction = { courseId: string; kind: 'continue' | 'start' };

/** What the path card's button does: carry on the course in progress, or start the next one. Null when the path is finished. */
export function pathAction(plan: Pick<PathPlan, 'nextStep'>): PathAction | null {
  const step = plan.nextStep;
  if (!step) return null;
  return { courseId: step.facts.id, kind: step.state === 'current' ? 'continue' : 'start' };
}

/**
 * The course a brand-new learner is invited to begin with: the one they chose, else the first step of their plan, else the free starter.
 * Only a course they own and haven't finished is offered (the starter is always free).
 */
export function firstLessonCourseId(input: { chosen: string | null; planStartId: string | null; owns: (courseId: string) => boolean; complete: (courseId: string) => boolean }): string {
  const usable = (id: string | null): id is string => !!id && input.owns(id) && !input.complete(id);
  return [input.chosen, input.planStartId].find(usable) ?? 'starter';
}
