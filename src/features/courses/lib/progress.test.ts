import { describe, expect, test } from '@jest/globals';

import { makeCourse } from './fixtures.test-helpers';
import { computeCourseProgress, parseStepsDone, quizPassed, type LessonRow, type ProjectRow } from './progress';

const done = (lessonId: string, correct = 3, total = 3): LessonRow => ({ lesson_id: lessonId, course_id: 'c', completed_at: '2026-11-13T00:00:00Z', quiz_correct: correct, quiz_total: total, task_done: 0 });
const project = (id: string, status: ProjectRow['status']): ProjectRow => ({ project_id: id, course_id: 'c', steps_done: '[]', submission: null, status, feedback: null, review_token: null, reviewed_at: null });

describe('quizPassed', () => {
  test('passes at 60%, fails below', () => {
    expect(quizPassed(3, 5)).toBe(true);
    expect(quizPassed(2, 3)).toBe(true);
    expect(quizPassed(2, 4)).toBe(false);
    expect(quizPassed(0, 0)).toBe(false);
  });
});

describe('computeCourseProgress', () => {
  const course = makeCourse('c', 4, [2, 4]);

  test('a fresh course opens on lesson 1 with the rest locked', () => {
    const progress = computeCourseProgress(course, [], []);
    expect(progress.started).toBe(false);
    expect(progress.nextLesson?.id).toBe('c-01');
    expect(progress.lessonState('c-01')).toBe('next');
    expect(progress.lessonState('c-02')).toBe('locked');
    expect(progress.projectOpen('c-p1')).toBe(false);
    expect(progress.fraction).toBe(0);
    expect(progress.quizAverage).toBeNull();
  });

  test('lessons and projects count toward the fraction; a project opens after its day', () => {
    const progress = computeCourseProgress(course, [done('c-01'), done('c-02', 2, 3)], [project('c-p1', 'passed')]);
    expect(progress.lessonsDone).toBe(2);
    expect(progress.projectOpen('c-p1')).toBe(true);
    expect(progress.projectOpen('c-p2')).toBe(false);
    expect(progress.fraction).toBeCloseTo(3 / 6);
    expect(progress.quizAverage).toBeCloseTo(5 / 6);
    expect(progress.perfectQuizzes).toBe(1);
    expect(progress.lessonState('c-03')).toBe('next');
    expect(progress.skills.find((skill) => skill.id === 'odd')?.fraction).toBeCloseTo(0.5);
  });

  test('complete only when every lesson and every project has passed', () => {
    const lessons = ['c-01', 'c-02', 'c-03', 'c-04'].map((id) => done(id));
    expect(computeCourseProgress(course, lessons, [project('c-p1', 'passed'), project('c-p2', 'needs_work')]).complete).toBe(false);
    expect(computeCourseProgress(course, lessons, [project('c-p1', 'passed'), project('c-p2', 'passed')]).complete).toBe(true);
  });

  test("ignores another course's rows", () => {
    const other: LessonRow = { ...done('c-01'), course_id: 'other' };
    expect(computeCourseProgress(course, [other], []).lessonsDone).toBe(0);
  });
});

describe('parseStepsDone', () => {
  test('reads a JSON list and drops anything else', () => {
    expect(parseStepsDone('["a", 2, "b"]')).toEqual(['a', 'b']);
    expect(parseStepsDone('not json')).toEqual([]);
    expect(parseStepsDone(null)).toEqual([]);
  });
});
