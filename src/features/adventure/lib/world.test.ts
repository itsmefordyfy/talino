import { describe, expect, test } from '@jest/globals';

// Imported by path, not through the courses index, which pulls in animated components Jest can't load.
import { COURSES } from '@/features/courses/content';
import type { Course } from '@/features/courses/content/types';
import { makeCourse } from '@/features/courses/lib/fixtures.test-helpers';
import { computeCourseProgress, type ProjectRow } from '@/features/courses/lib/progress';

import { buildWorld, chapterSizes, chapterTitles, nextAfter, remainingMissions } from './world';

type Row = { lesson_id: string; course_id: string; completed_at: string | null; quiz_correct: number | null; quiz_total: number | null; task_done: number };
const done = (course: Course, days: number[]): Row[] =>
  days.map((day) => ({ lesson_id: course.lessons[day - 1].id, course_id: course.id, completed_at: '2026-11-13T10:00:00.000Z', quiz_correct: 3, quiz_total: 3, task_done: 0 }));
const passedRow = (id: string, courseId: string): ProjectRow => ({ project_id: id, course_id: courseId, steps_done: '[]', submission: null, status: 'passed', feedback: null, review_token: null, reviewed_at: null });

const dev = makeCourse('developer', 20, [6, 12, 17]);

describe('chapterSizes', () => {
  test('splits as evenly as possible with chapters of about five', () => {
    expect(chapterSizes(20)).toEqual([5, 5, 5, 5]);
    expect(chapterSizes(7)).toEqual([4, 3]);
    expect(chapterSizes(5)).toEqual([5]);
    expect(chapterSizes(11)).toEqual([4, 4, 3]);
    expect(chapterSizes(1)).toEqual([1]);
    expect(chapterSizes(0)).toEqual([]);
  });

  test('always covers every lesson once', () => {
    for (let count = 1; count <= 40; count += 1) {
      const sizes = chapterSizes(count);
      expect(sizes.reduce((a, b) => a + b, 0)).toBe(count);
      expect(Math.max(...sizes)).toBeLessThanOrEqual(5);
      expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1);
    }
  });
});

describe('buildWorld', () => {
  test('a fresh world: the first mission is current, the rest locked, the boss locked', () => {
    const world = buildWorld(dev, computeCourseProgress(dev, [], []));
    const missions = world.chapters.flatMap((chapter) => chapter.missions);
    expect(missions).toHaveLength(20);
    expect(missions[0].state).toBe('current');
    expect(missions.slice(1).every((mission) => mission.state === 'locked')).toBe(true);
    expect(world.boss?.state).toBe('locked');
    expect(world.percent).toBe(0);
    expect(world.next).toMatchObject({ kind: 'mission' });
    expect(world.next?.kind === 'mission' && world.next.lesson.id).toBe('developer-01');
  });

  test('locked missions say what to finish first, and only one mission is ever current', () => {
    const world = buildWorld(dev, computeCourseProgress(dev, done(dev, [1, 2]), []));
    const missions = world.chapters.flatMap((chapter) => chapter.missions);
    expect(missions.filter((mission) => mission.state === 'current')).toHaveLength(1);
    expect(missions[2].state).toBe('current');
    expect(missions[3].finishFirst?.id).toBe('developer-03');
    expect(missions[5].finishFirst?.id).toBe('developer-03');
    expect(missions[0].finishFirst).toBeNull();
  });

  test('a lesson done out of order stays done and never makes a later one current', () => {
    const world = buildWorld(dev, computeCourseProgress(dev, done(dev, [4]), []));
    const missions = world.chapters.flatMap((chapter) => chapter.missions);
    expect(missions[3].state).toBe('done');
    expect(missions[0].state).toBe('current');
    expect(missions.filter((mission) => mission.state === 'current')).toHaveLength(1);
    expect(missions[4].state).toBe('locked');
  });

  test('chapter progress and state', () => {
    const world = buildWorld(dev, computeCourseProgress(dev, done(dev, [1, 2, 3, 4, 5, 6]), []));
    expect(world.chapters.map((chapter) => chapter.state)).toEqual(['done', 'current', 'locked', 'locked']);
    expect(world.chapters[0]).toMatchObject({ done: 5, total: 5, fraction: 1 });
    expect(world.chapters[1]).toMatchObject({ done: 1, total: 5, fraction: 0.2 });
    expect(world.missionsDone).toBe(6);
  });

  test('all lessons done with projects pending: the boss is current and is what comes next', () => {
    const all = Array.from({ length: 20 }, (_, index) => index + 1);
    const progress = computeCourseProgress(dev, done(dev, all), []);
    const world = buildWorld(dev, progress);
    expect(world.boss?.state).toBe('current');
    expect(world.boss?.projects.every((entry) => entry.state === 'current')).toBe(true);
    expect(world.complete).toBe(false);
    expect(world.next).toMatchObject({ kind: 'boss' });
    expect(world.chapters.every((chapter) => chapter.state === 'done')).toBe(true);
  });

  test('a world with every lesson done and every project passed is complete, with nothing next', () => {
    const all = Array.from({ length: 20 }, (_, index) => index + 1);
    const projects = dev.projects.map((project) => passedRow(project.id, dev.id));
    const progress = computeCourseProgress(dev, done(dev, all), projects);
    const world = buildWorld(dev, progress, new Set(dev.projects.map((project) => project.id)));
    expect(world.boss?.state).toBe('done');
    expect(world.complete).toBe(true);
    expect(world.next).toBeNull();
    expect(world.percent).toBe(100);
  });

  test('the boss is locked until every lesson is done, even when a project is already open', () => {
    const world = buildWorld(dev, computeCourseProgress(dev, done(dev, [1, 2, 3, 4, 5, 6]), []));
    expect(world.boss?.state).toBe('locked');
    expect(world.boss?.open).toBe(1);
    expect(world.boss?.projects[0]).toMatchObject({ open: true, state: 'locked', passed: false });
    expect(world.next).toMatchObject({ kind: 'mission' });
  });

  test('one passed project and others pending: the boss stays current', () => {
    const all = Array.from({ length: 20 }, (_, index) => index + 1);
    const progress = computeCourseProgress(dev, done(dev, all), [passedRow('developer-p1', 'developer')]);
    const world = buildWorld(dev, progress, new Set(['developer-p1']));
    expect(world.boss?.passed).toBe(1);
    expect(world.boss?.state).toBe('current');
    expect(world.boss?.projects.map((entry) => entry.state)).toEqual(['done', 'current', 'current']);
    expect(world.next).toMatchObject({ kind: 'boss', project: { id: 'developer-p2' } });
  });

  test('a course without projects has no boss', () => {
    const course = makeCourse('plain', 4);
    expect(buildWorld(course, computeCourseProgress(course, [], [])).boss).toBeNull();
  });

  test('every lesson appears exactly once, in order, on every real course', () => {
    for (const course of COURSES) {
      const world = buildWorld(course, computeCourseProgress(course, [], []));
      expect(world.chapters.flatMap((chapter) => chapter.missions.map((mission) => mission.lesson.id))).toEqual(course.lessons.map((lesson) => lesson.id));
      expect(world.boss?.projects.map((entry) => entry.project.id)).toEqual(course.projects.map((project) => project.id));
    }
  });
});

describe('chapter titles', () => {
  test('come from the course skill labels, never invented', () => {
    for (const course of COURSES) {
      // A course made of modules titles its chapters with them (the module titles come from its syllabus).
      const labels = new Set([...course.skills.map((skill) => skill.label), ...(course.modules ?? []).map((module) => module.title)]);
      const world = buildWorld(course, computeCourseProgress(course, [], []));
      for (const chapter of world.chapters) {
        expect(chapter.title === null || labels.has(chapter.title)).toBe(true);
        expect(chapter.title).not.toBeNull();
      }
    }
  });

  test('the dominant skill wins, and a skill already used is passed over for the next best', () => {
    const course = makeCourse('x', 10);
    const groups = [course.lessons.slice(0, 5), course.lessons.slice(5, 10)];
    const titles = chapterTitles(course, groups);
    expect(titles[0].skillId).toBe('odd');
    expect(titles[1].skillId).toBe('even');
    expect(titles.map((title) => title.part)).toEqual([1, 1]);
  });

  test('when no other skill is left the same title carries a part number', () => {
    const course = makeCourse('x', 10);
    course.skills = [{ id: 'odd', label: 'Odd' }];
    for (const lesson of course.lessons) lesson.skills = ['odd'];
    const titles = chapterTitles(course, [course.lessons.slice(0, 5), course.lessons.slice(5)]);
    expect(titles.map((title) => title.title)).toEqual(['Odd', 'Odd']);
    expect(titles.map((title) => title.part)).toEqual([1, 2]);
  });

  test('lessons that name no known skill leave the title empty', () => {
    const course = makeCourse('x', 3);
    for (const lesson of course.lessons) lesson.skills = ['unknown'];
    expect(chapterTitles(course, [course.lessons])[0].title).toBeNull();
  });
});

describe('next and remaining', () => {
  test('nextAfter gives the following mission, then the boss, then nothing', () => {
    const progress = computeCourseProgress(dev, done(dev, [1]), []);
    const world = buildWorld(dev, progress);
    expect(nextAfter(world, 'developer-01')).toMatchObject({ kind: 'mission', lesson: { id: 'developer-02' } });

    const all = Array.from({ length: 20 }, (_, index) => index + 1);
    const finished = buildWorld(dev, computeCourseProgress(dev, done(dev, all), []));
    expect(nextAfter(finished, 'developer-20')).toMatchObject({ kind: 'boss', project: { id: 'developer-p1' } });

    const complete = buildWorld(dev, computeCourseProgress(dev, done(dev, all), dev.projects.map((p) => passedRow(p.id, dev.id))), new Set(dev.projects.map((p) => p.id)));
    expect(nextAfter(complete, 'developer-20')).toBeNull();
  });

  test('remainingMissions lists what is not done', () => {
    const world = buildWorld(dev, computeCourseProgress(dev, done(dev, [1, 2, 3]), []));
    expect(remainingMissions(world)).toHaveLength(17);
  });
});

describe('a course made of modules', () => {
  const long = { ...makeCourse('long-course', 12, [10]), modules: [
    { id: 'one', title: 'Module One', summary: 'The first module of the course.', firstDay: 1, lastDay: 3 },
    { id: 'two', title: 'Module Two', summary: 'The second module of the course.', firstDay: 4, lastDay: 9 },
    { id: 'three', title: 'Module Three', summary: 'The third module of the course.', firstDay: 10, lastDay: 12 },
  ] };

  test('has one chapter per module, titled with it, covering every lesson once', () => {
    const world = buildWorld(long, computeCourseProgress(long, [], []));
    expect(world.chapters.map((chapter) => chapter.title)).toEqual(['Module One', 'Module Two', 'Module Three']);
    expect(world.chapters.map((chapter) => chapter.total)).toEqual([3, 6, 3]);
    expect(world.chapters.flatMap((chapter) => chapter.missions).map((mission) => mission.lesson.day)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  test('a course with no modules is split as before', () => {
    const world = buildWorld(dev, computeCourseProgress(dev, [], []));
    expect(world.chapters).toHaveLength(4);
  });
});
