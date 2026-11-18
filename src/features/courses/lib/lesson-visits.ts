/**
 * Where the learner left off in each course: the lesson they last opened, whether or not they finished it. Pure, so it is tested. A lesson
 * that was only opened writes nothing to the learning tables (those hold finished lessons and quiz results), so without this a course the
 * learner had started reading would not count as started anywhere. One entry per course, the newest kept.
 */

export type LessonVisit = { lessonId: string; /** ISO time the lesson was last opened. */ at: string };
export type LessonVisits = Readonly<Record<string, LessonVisit>>;
export type RecentVisit = LessonVisit & { courseId: string };

/** Courses remembered: far more than anyone opens, so the saved text stays small. */
export const MAX_VISITED_COURSES = 60;

const timeOf = (iso: string) => {
  const value = Date.parse(iso);
  return Number.isNaN(value) ? 0 : value;
};

/** What was saved, checked: anything that isn't a course id with a lesson id and a time is dropped. */
export function parseVisits(raw: unknown): LessonVisits {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const visits: Record<string, LessonVisit> = {};
  for (const [courseId, value] of Object.entries(raw)) {
    if (!value || typeof value !== 'object') continue;
    const { lessonId, at } = value as Record<string, unknown>;
    if (typeof lessonId === 'string' && lessonId && typeof at === 'string' && timeOf(at) > 0) visits[courseId] = { lessonId, at };
  }
  return visits;
}

/** The visits with this lesson as the course's latest; past `MAX_VISITED_COURSES` the courses opened longest ago are forgotten. */
export function withVisit(visits: LessonVisits, courseId: string, lessonId: string, at: string): LessonVisits {
  const next: Record<string, LessonVisit> = { ...visits, [courseId]: { lessonId, at } };
  const ids = Object.keys(next);
  if (ids.length <= MAX_VISITED_COURSES) return next;
  ids.sort((a, b) => timeOf(next[b]!.at) - timeOf(next[a]!.at));
  return Object.fromEntries(ids.slice(0, MAX_VISITED_COURSES).map((id) => [id, next[id]!]));
}

/** Courses by when a lesson was last opened in them, newest first. */
export function recentVisits(visits: LessonVisits, limit = MAX_VISITED_COURSES): RecentVisit[] {
  return Object.entries(visits)
    .map(([courseId, visit]) => ({ courseId, ...visit }))
    .sort((a, b) => timeOf(b.at) - timeOf(a.at) || a.courseId.localeCompare(b.courseId))
    .slice(0, limit);
}
