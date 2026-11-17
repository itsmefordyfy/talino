/**
 * A course's lessons as a timeline (the "course screen" of the journey: lessons are the milestones inside a course). Pure: given the
 * course's lessons, which of them are really done, and whether the learner may open the course, it says how every lesson is drawn,
 * where Tali's encouraging waypoints sit and what Continue leads to. Nothing here is stored.
 *
 * - COMPLETED: the lesson's quiz passed (the existing rule: `completed_at`).
 * - CURRENT: the first lesson not done. Always exactly one until the course is finished.
 * - UPCOMING: the lessons after it. They open in order, one after another with no wait, so these are visible but inert, and are NOT
 *   drawn as locked: nothing outside the order holds them back.
 * - LOCKED: only when something outside the order does: the course isn't the learner's (a tap opens the paywall). Lessons already done stay completed either way.
 *   The journey itself never locks a course (owner, 2026-11-16).
 */

export type TimelineLessonState = 'completed' | 'current' | 'upcoming' | 'locked';
export type TimelineProjectState = 'completed' | 'open' | 'upcoming' | 'locked';

export type TimelineLesson = { id: string; day: number; title: string; summary: string; minutes: number };

export type TimelineInput = {
  lessons: readonly TimelineLesson[];
  /** The course's own lesson rule: done, next, or still behind an earlier one. */
  lessonState: (lessonId: string) => 'done' | 'next' | 'locked';
  projects: readonly { id: string; title: string; passed: boolean; open: boolean }[];
  /** The learner can open the course's lessons (a subscription, or the free starter). */
  owned: boolean;
};

export type TimelineItem =
  | { kind: 'lesson'; id: string; number: number; title: string; summary: string; minutes: number; state: TimelineLessonState }
  /** Tali's markers: halfway through a longer course, and the finish line. */
  | { kind: 'waypoint'; type: 'halfway' | 'finish'; reached: boolean }
  | { kind: 'project'; id: string; title: string; state: TimelineProjectState };

export type CourseTimeline = {
  items: readonly TimelineItem[];
  lessonsDone: number;
  lessonsTotal: number;
  /** 0 to 1. */
  fraction: number;
  /** 0 to 100, rounded. */
  percent: number;
  remaining: number;
  minutesLeft: number;
  started: boolean;
  complete: boolean;
  /** The first lesson not done (where the learner would continue), even when the course is locked for them. */
  currentLessonId: string | null;
  next: { id: string; number: number; title: string } | null;
  /** Why unfinished lessons are locked, if they are: the course isn't the learner's. */
  lock: 'pro' | null;
};

/** Courses at least this long get a halfway marker. */
const HALFWAY_FROM = 6;

export function buildTimeline({ lessons, lessonState, projects, owned }: TimelineInput): CourseTimeline {
  const total = lessons.length;
  const done = (lesson: TimelineLesson) => lessonState(lesson.id) === 'done';
  const lessonsDone = lessons.filter(done).length;
  const firstOpen = lessons.find((lesson) => !done(lesson)) ?? null;
  const lock: CourseTimeline['lock'] = owned ? null : 'pro';
  const complete = total > 0 && lessonsDone === total;
  const fraction = total > 0 ? lessonsDone / total : 0;

  const items: TimelineItem[] = [];
  const halfAt = total >= HALFWAY_FROM ? Math.ceil(total / 2) : null;
  lessons.forEach((lesson, i) => {
    const state: TimelineLessonState = done(lesson) ? 'completed' : lock ? 'locked' : lesson.id === firstOpen?.id ? 'current' : 'upcoming';
    items.push({ kind: 'lesson', id: lesson.id, number: lesson.day, title: lesson.title, summary: lesson.summary, minutes: lesson.minutes, state });
    if (halfAt !== null && i + 1 === halfAt) items.push({ kind: 'waypoint', type: 'halfway', reached: done(lesson) });
  });
  if (total > 0) items.push({ kind: 'waypoint', type: 'finish', reached: complete });
  if (total > 0) {
    for (const project of projects) {
      // What the learner already passed is never hidden by a lock.
      const state: TimelineProjectState = project.passed ? 'completed' : lock ? 'locked' : project.open ? 'open' : 'upcoming';
      items.push({ kind: 'project', id: project.id, title: project.title, state });
    }
  }

  return {
    items,
    lessonsDone,
    lessonsTotal: total,
    fraction,
    percent: Math.round(fraction * 100),
    remaining: total - lessonsDone,
    minutesLeft: lessons.filter((lesson) => !done(lesson)).reduce((sum, lesson) => sum + lesson.minutes, 0),
    started: lessonsDone > 0,
    complete,
    currentLessonId: firstOpen?.id ?? null,
    next: firstOpen ? { id: firstOpen.id, number: firstOpen.day, title: firstOpen.title } : null,
    lock,
  };
}
