import type { CoursePath, PathNode } from './course-path';
import type { HomeCourseChoice } from './home-course';

/**
 * Which course Home's lesson timeline shows (owner's brief, 2026-11-16: "the timeline belongs to the learner's currently active course").
 * Pure: the answer comes from the learner's real lessons and, when they made one, their pick, so a restart, a restored backup or another
 * phone with the same lesson rows gives the same Home. Nothing here writes anything, and picking a course never touches progress.
 */

const timeOf = (iso: string | null | undefined) => {
  const value = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(value) ? 0 : value;
};

/** The course nodes only: the milestone with no course (portfolio, résumé) has no lessons to show. */
export const courseNodes = (path: CoursePath): readonly PathNode[] => path.nodes.filter((node) => node.kind === 'course');

/** The course whose lesson was finished most recently (ties go to the earlier one on the journey). */
function lastWorked(courses: readonly PathNode[]): PathNode | null {
  return courses.filter((node) => node.lastActiveAt).sort((a, b) => timeOf(b.lastActiveAt) - timeOf(a.lastActiveAt) || a.index - b.index)[0] ?? null;
}

/**
 * The active course:
 *  - the learner's pick, unless they finished a lesson in another course after making it (then that course: starting or continuing a
 *    course makes it the one Home shows);
 *  - with no pick (or one that is no longer in the journey): where the journey itself would resume;
 *  - a journey whose courses are all done keeps the course worked on last, shown complete.
 * Never a made-up course: null only when the journey has no courses at all.
 */
export function resolveActiveCourse(path: CoursePath, choice: HomeCourseChoice | null): PathNode | null {
  const courses = courseNodes(path);
  if (courses.length === 0) return null;
  const worked = lastWorked(courses);
  const chosen = choice ? (courses.find((node) => node.courseId === choice.id) ?? null) : null;
  if (chosen) {
    return worked && worked.key !== chosen.key && timeOf(worked.lastActiveAt) > timeOf(choice!.at) ? worked : chosen;
  }
  if (path.resume?.kind === 'course') return path.resume;
  return worked ?? courses[courses.length - 1]!;
}

export type LearningGroup = 'in-progress' | 'ready' | 'completed';

export type LearningEntry = { node: PathNode; group: LearningGroup; active: boolean };

/**
 * "My Learning": the courses the learner can switch to from Home. Started courses (finished ones last), the journey's own next course
 * when it hasn't been started, and the active course whatever it is. Locked courses and untouched skipped ones are not offered: they
 * are in the All courses view and in Discover. Order: in progress (active first, then most recent), ready to start, finished.
 * `opened` is when a lesson was last opened in each course (courseId to ISO time): a course whose lesson was opened but not yet finished
 * counts as in progress too, and as worked on at that time, so a learner who starts reading finds the course here.
 */
export function myLearning(path: CoursePath, activeKey: string | null, opened: Readonly<Record<string, string>> = {}): LearningEntry[] {
  const entries: LearningEntry[] = [];
  const lastTouched = (node: PathNode) => Math.max(timeOf(node.lastActiveAt), node.courseId ? timeOf(opened[node.courseId]) : 0);
  for (const node of courseNodes(path)) {
    const active = node.key === activeKey;
    const began = node.started || (!!node.courseId && !!opened[node.courseId]);
    if (!active && !began && node.status !== 'current') continue;
    const group: LearningGroup = node.status === 'completed' ? 'completed' : began ? 'in-progress' : 'ready';
    entries.push({ node, group, active });
  }
  const rank = { 'in-progress': 0, ready: 1, completed: 2 } as const;
  return entries.sort(
    (a, b) =>
      rank[a.group] - rank[b.group] ||
      Number(b.active) - Number(a.active) ||
      (a.group === 'ready' ? Number(b.node.status === 'current') - Number(a.node.status === 'current') : lastTouched(b.node) - lastTouched(a.node)) ||
      a.node.index - b.node.index,
  );
}
