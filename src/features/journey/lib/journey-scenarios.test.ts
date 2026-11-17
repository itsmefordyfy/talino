import { describe, expect, test } from '@jest/globals';

import { COURSES, getCourse } from '@/features/courses/content';
import { computeCourseProgress, type LessonRow, type ProjectRow } from '@/features/courses/lib/progress';

import { AI_BUILDER_JOURNEY } from '../data/journey';
import { buildCoursePath, courseToContinueAfter } from './course-path';
import { computeJourney } from './engine';
import { buildFacts } from './facts';
import { newLearner } from './test-helpers';
import { buildTimeline } from './timeline';
import type { JourneyLearner } from './types';

/**
 * The learner's journey as the app builds it, end to end on the REAL catalog and the real journey: lesson rows in, Home's course path
 * out. These are the owner's scenarios (2026-11-16): a new learner, several lessons then leaving, resuming at the exact lesson,
 * finishing a course, reopening the app, another phone, several started courses, different lesson counts, locked prerequisites.
 */

/** The journey's courses in the order Home draws them. */
// Only courses that are in the app have a node (a course placed on the journey before its content lands never blocks anyone).
const ORDER = AI_BUILDER_JOURNEY.stages.flatMap((stage) => stage.milestones.flatMap((milestone) => milestone.steps.flatMap((step) => (step.kind === 'learn' && getCourse(step.courseId) ? [step.courseId] : []))));
const REQUIRED_FIRST = ORDER[0]!;

/** A lesson row for the first `count` lessons of a course, finished on `day` of November. */
function rows(courseId: string, count: number, day = 1): LessonRow[] {
  return getCourse(courseId)!.lessons.slice(0, count).map((lesson, i) => ({ lesson_id: lesson.id, course_id: courseId, completed_at: `2026-11-${String(day).padStart(2, '0')}T0${i % 10}:00:00Z`, quiz_correct: 4, quiz_total: 4, task_done: 1 }));
}

function homeFor(lessonRows: readonly LessonRow[], projectRows: readonly ProjectRow[] = [], learner: JourneyLearner = newLearner) {
  const progress = new Map(COURSES.map((course) => [course.id, computeCourseProgress(course, lessonRows, projectRows)]));
  const facts = buildFacts(AI_BUILDER_JOURNEY, {
    lessonRows,
    passedProjects: projectRows.filter((row) => row.status === 'passed').map((row) => row.project_id),
    progressFor: (id) => progress.get(id) ?? null,
    getCourse,
    localize: (course) => course,
    owns: () => true,
    actions: { portfolio: false, resume: false },
  });
  const state = computeJourney(AI_BUILDER_JOURNEY, facts, learner);
  return { state, facts, path: buildCoursePath(state, facts), progress };
}
const home = homeFor;

/** The course that becomes the learner's place once the first is finished (a late addition to the journey may stand aside, so it is read, not assumed). */
const SECOND = (() => {
  const first = getCourse(REQUIRED_FIRST)!;
  const all = first.lessons.map((lesson) => ({ lesson_id: lesson.id, course_id: first.id, completed_at: '2026-11-01T00:00:00Z', quiz_correct: 4, quiz_total: 4, task_done: 1 }));
  return homeFor(all).path.current!.courseId!;
})();

describe('1. a new learner opens Home', () => {
  const { path } = home([]);

  test('sees every course of the journey in its level, in order, the first one current', () => {
    expect(path.nodes.filter((node) => node.kind === 'course').map((node) => node.courseId)).toEqual(ORDER);
    expect(path.current?.courseId).toBe(REQUIRED_FIRST);
    expect(path.resume?.courseId).toBe(REQUIRED_FIRST);
    expect(path.resume?.started).toBe(false);
    expect(path.nodes.map((node) => node.level)).toEqual([...path.nodes].sort((a, b) => a.index - b.index).map((node) => node.level));
  });

  test('every course node carries the real catalog lesson count', () => {
    for (const node of path.nodes.filter((entry) => entry.kind === 'course')) expect(node.lessonsTotal).toBe(getCourse(node.courseId!)!.lessons.length);
  });

  test('7. courses with different lesson counts each report their own percent', () => {
    const totals = new Set(path.nodes.filter((node) => node.kind === 'course').map((node) => node.lessonsTotal));
    expect(totals.size).toBeGreaterThan(3);
  });

  test('no course is locked: every course after the first is open to choose, and only the first is current', () => {
    const open = path.nodes.filter((node) => node.kind === 'course' && node.status === 'available');
    expect(open.length).toBeGreaterThan(30);
    expect(path.nodes.filter((node) => node.status === 'current')).toHaveLength(1);
  });
});

describe('2-4. several lessons, leaving, coming back, and continuing', () => {
  const done = 4;
  const { path } = home(rows(REQUIRED_FIRST, done));
  const course = getCourse(REQUIRED_FIRST)!;

  test('Home shows the exact progress of the course the learner left', () => {
    const node = path.resume!;
    expect(node.courseId).toBe(REQUIRED_FIRST);
    expect(node.status).toBe('current');
    expect(node).toMatchObject({ lessonsDone: done, lessonsTotal: course.lessons.length, started: true });
    expect(node.percent).toBe(Math.round((done / course.lessons.length) * 100));
  });

  test('and points at the next unfinished lesson, by its number, title and id', () => {
    const node = path.resume!;
    expect(node.nextLessonId).toBe(course.lessons[done]!.id);
    expect(node.nextLessonNumber).toBe(done + 1);
    expect(node.nextLessonTitle).toBe(course.lessons[done]!.title);
  });

  test('the course screen has the same lesson current, with the finished ones behind it', () => {
    const progress = computeCourseProgress(course, rows(REQUIRED_FIRST, done), []);
    const timeline = buildTimeline({ lessons: course.lessons, lessonState: progress.lessonState, projects: [], owned: true });
    expect(timeline.currentLessonId).toBe(course.lessons[done]!.id);
    expect(timeline.lessonsDone).toBe(done);
    expect(timeline.items.flatMap((item) => (item.kind === 'lesson' ? [item.state] : [])).slice(0, done + 2)).toEqual([...Array(done).fill('completed'), 'current', 'upcoming']);
  });

  test('completing a lesson then leaving still points at the following lesson', () => {
    const after = home(rows(REQUIRED_FIRST, done + 1)).path.resume!;
    expect(after.nextLessonId).toBe(course.lessons[done + 1]!.id);
    expect(after.lessonsDone).toBe(done + 1);
  });
});

describe('5-6. finishing a course', () => {
  const all = getCourse(REQUIRED_FIRST)!.lessons.length;
  const { path } = home(rows(REQUIRED_FIRST, all));

  test('the course is completed and the next one becomes current and open', () => {
    expect(path.nodes.find((node) => node.courseId === REQUIRED_FIRST)).toMatchObject({ status: 'completed', percent: 100 });
    expect(path.current?.courseId).not.toBe(REQUIRED_FIRST);
    expect(path.current?.status).toBe('current');
    expect(courseToContinueAfter(path, REQUIRED_FIRST)?.key).toBe(path.current?.key);
  });

  test('the course after it is now the resume target, to start', () => {
    expect(path.resume?.key).toBe(path.current?.key);
    expect(path.resume?.started).toBe(false);
  });

  test('what comes after the new current course stays open to choose', () => {
    const after = path.nodes.find((node) => node.index === path.current!.index + 1 && node.kind === 'course');
    if (after) expect(after.status).not.toBe('current');
    if (after) expect(['available', 'in-progress', 'completed', 'skipped']).toContain(after.status);
  });
});

describe('8. closing and reopening the app', () => {
  test('the same rows give exactly the same Home, in whatever order the database returns them', () => {
    const a = [...rows(REQUIRED_FIRST, 5), ...rows(SECOND, 2, 2)];
    const first = JSON.stringify(home(a).path);
    expect(JSON.stringify(home([...a].reverse()).path)).toBe(first);
    expect(JSON.stringify(home(a).path)).toBe(first);
  });
});

describe('9. another device', () => {
  const finished = getCourse(REQUIRED_FIRST)!.lessons.length;
  const phoneA = [...rows(REQUIRED_FIRST, finished), ...rows(SECOND, 2, 3)];
  const phoneB = [...rows(REQUIRED_FIRST, finished), ...rows(SECOND, 4, 4)];

  /** A restore merges by lesson id and never overwrites what is already there (`INSERT OR IGNORE`). */
  const merge = (local: readonly LessonRow[], incoming: readonly LessonRow[]) => {
    const seen = new Set(local.map((row) => row.lesson_id));
    return [...local, ...incoming.filter((row) => !seen.has(row.lesson_id))];
  };

  test('progress from both phones adds up, and no lesson is counted twice', () => {
    const merged = home(merge(phoneA, phoneB)).path.nodes.find((node) => node.courseId === SECOND)!;
    expect(merged.lessonsDone).toBe(4);
    expect(home(merge(phoneB, phoneA)).path.nodes.find((node) => node.courseId === SECOND)!.lessonsDone).toBe(4);
  });

  test('merging a phone into itself changes nothing', () => {
    expect(JSON.stringify(home(merge(phoneA, phoneA)).path)).toBe(JSON.stringify(home(phoneA).path));
  });

  test('the phone that was behind now resumes where the other left off', () => {
    const resume = home(merge(phoneA, phoneB)).path.resume!;
    expect(resume.courseId).toBe(SECOND);
    expect(resume.nextLessonNumber).toBe(5);
  });
});

describe('several courses started', () => {
  const finished = getCourse(REQUIRED_FIRST)!.lessons.length;
  // The learner finished the first course, is part way through the second (the journey's), and also began a course far ahead from the Courses tab.
  const far = ORDER[ORDER.length - 3]!;
  const lessonRows = [...rows(REQUIRED_FIRST, finished, 1), ...rows(SECOND, 2, 5), ...rows(far, 3, 9)];
  const { path } = home(lessonRows);

  test('the journey’s own course is the primary resume; the other started course is listed, with its progress intact', () => {
    expect(path.resume?.courseId).toBe(SECOND);
    expect(path.alsoInProgress.map((node) => node.courseId)).toEqual([far]);
    expect(path.alsoInProgress[0]).toMatchObject({ lessonsDone: 3, status: 'in-progress' });
  });

  test('a started course that is far ahead is open, not locked', () => {
    expect(path.nodes.find((node) => node.courseId === far)!.status).toBe('in-progress');
  });

  test('when the journey’s course was not started, the course worked on most recently is the resume target', () => {
    const only = home([...rows(REQUIRED_FIRST, finished, 1), ...rows(far, 3, 9), ...rows(ORDER[ORDER.length - 4]!, 2, 12)]).path;
    expect(only.current?.started).toBe(false);
    expect(only.resume?.courseId).toBe(ORDER[ORDER.length - 4]);
    expect(only.resume?.courseId).not.toBe(only.current?.courseId);
    expect(only.alsoInProgress.map((node) => node.courseId)).toEqual([far]);
  });
});

describe('a learner who starts at a higher level', () => {
  test('earlier courses they never touched are skipped, not locked, and the start level holds their first course', () => {
    const { path } = home([], [], { ...newLearner, chosenStart: 'advanced' });
    expect(path.nodes.filter((node) => node.stageIndex < 2).every((node) => node.status === 'skipped')).toBe(true);
    expect(path.current?.stageIndex).toBe(2);
  });
});
