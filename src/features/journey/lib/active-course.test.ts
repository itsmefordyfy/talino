import { describe, expect, test } from '@jest/globals';

import { myLearning, resolveActiveCourse } from './active-course';
import { buildCoursePath, type CoursePath } from './course-path';
import { computeJourney } from './engine';
import { cleanHomeCourse } from './home-course';
import { newLearner } from './test-helpers';
import type { CourseSnapshot, JourneyDefinition, JourneyFacts } from './types';

/** Three beginner courses in one milestone (c1 required, c2 optional, c3 required), a second milestone (c4) and a milestone with no course. */
const JOURNEY: JourneyDefinition = {
  id: 'mini',
  title: 'Mini',
  destination: { title: 'End', summary: 'End', abilities: [] },
  stages: [
    {
      id: 'beginner',
      level: 'beginner',
      title: 'Beginner',
      forWhom: '',
      tagline: '',
      why: '',
      icon: 'school',
      milestones: [
        { id: 'm1', kind: 'learn', title: 'M1', summary: '', why: '', objectives: [], icon: 'lightbulb', steps: [{ kind: 'learn', courseId: 'c1' }, { kind: 'learn', courseId: 'c2', optional: true }, { kind: 'learn', courseId: 'c3' }], requires: [] },
        { id: 'm2', kind: 'learn', title: 'M2', summary: '', why: '', objectives: [], icon: 'edit_note', steps: [{ kind: 'learn', courseId: 'c4' }] },
        { id: 'm3', kind: 'challenge', title: 'Show your work', summary: 'Portfolio', why: '', objectives: [], icon: 'folder_special', steps: [{ kind: 'action', action: 'portfolio' }] },
      ],
    },
  ],
};

const IDS = ['c1', 'c2', 'c3', 'c4'];

/** Every course has 10 lessons; `done` sets how many are finished, `active` when the last one was. */
function facts(done: Record<string, number> = {}, active: Record<string, string> = {}): JourneyFacts {
  const courses = new Map<string, CourseSnapshot>();
  for (const id of IDS) {
    const n = done[id] ?? 0;
    courses.set(id, { title: `Course ${id}`, description: '', lessonsDone: n, lessonsTotal: 10, started: n > 0, complete: n >= 10, nextLessonId: n >= 10 ? null : `${id}-${n + 1}`, nextLessonTitle: null, nextLessonNumber: n >= 10 ? null : n + 1, minutesLeft: (10 - n) * 15, owned: true, quizAverage: null, lastActiveAt: active[id] ?? null });
  }
  return { courses, projectTitles: new Map(), passedProjects: new Set(), openProjects: new Set(), actions: { portfolio: false, resume: false } };
}

const pathOf = (done: Record<string, number> = {}, active: Record<string, string> = {}): CoursePath => {
  const f = facts(done, active);
  return buildCoursePath(computeJourney(JOURNEY, f, newLearner), f);
};
const pick = (id: string, at: string) => ({ id, at });
const keys = (list: ReturnType<typeof myLearning>) => list.map((entry) => entry.node.key);

describe('resolveActiveCourse', () => {
  test('a new learner with no pick is on the journey’s first course', () => {
    expect(resolveActiveCourse(pathOf(), null)?.key).toBe('c1');
  });

  test('with no pick it follows the journey’s own resume rule (the started current course, else the one worked on last)', () => {
    expect(resolveActiveCourse(pathOf({ c1: 3 }, { c1: '2026-11-02T00:00:00Z' }), null)?.key).toBe('c1');
    // c1 untouched but c4 was started from elsewhere: the course worked on is where Home resumes.
    expect(resolveActiveCourse(pathOf({ c4: 2 }, { c4: '2026-11-02T00:00:00Z' }), null)?.key).toBe('c4');
  });

  test('the learner’s pick shows even before a lesson is done in it', () => {
    expect(resolveActiveCourse(pathOf({ c1: 3 }, { c1: '2026-11-02T00:00:00Z' }), pick('c3', '2026-11-03T00:00:00Z'))?.key).toBe('c3');
  });

  test('a lesson finished in another course after the pick moves Home to that course; before the pick it does not', () => {
    const p = pathOf({ c1: 3, c4: 1 }, { c1: '2026-11-02T00:00:00Z', c4: '2026-11-05T00:00:00Z' });
    expect(resolveActiveCourse(p, pick('c1', '2026-11-04T00:00:00Z'))?.key).toBe('c4');
    expect(resolveActiveCourse(p, pick('c1', '2026-11-06T00:00:00Z'))?.key).toBe('c1');
  });

  test('continuing the picked course keeps it', () => {
    const p = pathOf({ c1: 3, c4: 1 }, { c1: '2026-11-07T00:00:00Z', c4: '2026-11-05T00:00:00Z' });
    expect(resolveActiveCourse(p, pick('c1', '2026-11-04T00:00:00Z'))?.key).toBe('c1');
  });

  test('a pick of a course that is no longer in the journey is ignored', () => {
    expect(resolveActiveCourse(pathOf(), pick('gone', '2026-11-03T00:00:00Z'))?.key).toBe('c1');
  });

  test('a finished course stays active, shown complete, until the learner moves on', () => {
    const p = pathOf({ c1: 10 }, { c1: '2026-11-02T00:00:00Z' });
    const active = resolveActiveCourse(p, pick('c1', '2026-11-01T00:00:00Z'));
    expect(active).toMatchObject({ key: 'c1', status: 'completed', percent: 100 });
    expect(p.current?.key).not.toBe('c1');
  });

  test('every course done: the one worked on last, never the portfolio step', () => {
    const p = pathOf({ c1: 10, c2: 10, c3: 10, c4: 10 }, { c1: '2026-11-01T00:00:00Z', c2: '2026-11-02T00:00:00Z', c3: '2026-11-03T00:00:00Z', c4: '2026-11-04T00:00:00Z' });
    expect(p.resume?.kind).toBe('action');
    expect(resolveActiveCourse(p, null)).toMatchObject({ key: 'c4', kind: 'course' });
  });

  test('is a pure function of the lessons and the pick (same input, same course)', () => {
    const p = pathOf({ c1: 2, c3: 1 }, { c1: '2026-11-02T00:00:00Z', c3: '2026-11-03T00:00:00Z' });
    const choice = pick('c1', '2026-11-04T00:00:00Z');
    expect(resolveActiveCourse(p, choice)?.key).toBe(resolveActiveCourse(pathOf({ c1: 2, c3: 1 }, { c1: '2026-11-02T00:00:00Z', c3: '2026-11-03T00:00:00Z' }), choice)?.key);
  });

  test('a journey with no courses has none', () => {
    const empty = { ...pathOf(), nodes: [] as CoursePath['nodes'], resume: null };
    expect(resolveActiveCourse(empty, null)).toBeNull();
  });
});

describe('myLearning', () => {
  test('a new learner is offered the journey’s first course, and only it', () => {
    expect(keys(myLearning(pathOf(), 'c1'))).toEqual(['c1']);
    expect(myLearning(pathOf(), 'c1')[0]).toMatchObject({ group: 'ready', active: true });
  });

  test('started courses come first (the active one on top), then what is ready, then finished courses', () => {
    const p = pathOf({ c1: 10, c3: 2, c4: 5 }, { c1: '2026-11-01T00:00:00Z', c3: '2026-11-02T00:00:00Z', c4: '2026-11-03T00:00:00Z' });
    const list = myLearning(p, 'c3');
    expect(keys(list)).toEqual(['c3', 'c4', 'c1']);
    expect(list.map((entry) => entry.group)).toEqual(['in-progress', 'in-progress', 'completed']);
    expect(list.filter((entry) => entry.active).map((entry) => entry.node.key)).toEqual(['c3']);
  });

  test('without an active pick the most recently worked course leads', () => {
    const p = pathOf({ c1: 3, c3: 4 }, { c1: '2026-11-02T00:00:00Z', c3: '2026-11-03T00:00:00Z' });
    expect(keys(myLearning(p, null))).toEqual(['c3', 'c1']);
  });

  test('a course whose lesson was only opened is in progress, ordered by when it was opened', () => {
    const p = pathOf({ c1: 3 }, { c1: '2026-11-02T00:00:00Z' });
    const list = myLearning(p, 'c1', { c4: '2026-11-04T00:00:00Z' });
    expect(keys(list)).toEqual(['c1', 'c4']);
    expect(list.find((entry) => entry.node.key === 'c4')).toMatchObject({ group: 'in-progress', active: false });
    // Opened after c1 was last worked on, and c1 not the active one: the opened course is the more recent.
    expect(keys(myLearning(p, null, { c4: '2026-11-04T00:00:00Z' }))).toEqual(['c4', 'c1']);
  });

  test('an opened course that is already finished stays under finished', () => {
    const p = pathOf({ c1: 10 }, { c1: '2026-11-02T00:00:00Z' });
    expect(myLearning(p, 'c3', { c1: '2026-11-04T00:00:00Z' }).find((entry) => entry.node.key === 'c1')).toMatchObject({ group: 'completed' });
  });

  test('the journey’s next course is offered while it is untouched, and courses the learner never touched are not', () => {
    const p = pathOf({ c1: 10 }, { c1: '2026-11-02T00:00:00Z' });
    const list = myLearning(p, 'c1');
    expect(keys(list)).toEqual([p.current!.key, 'c1']);
    expect(list[0]).toMatchObject({ group: 'ready', active: false });
    expect(p.nodes.filter((node) => node.status === 'available').every((node) => !keys(list).includes(node.key))).toBe(true);
  });

  test('the active course is always offered, even a not-started one that is not the journey’s next', () => {
    const p = pathOf({ c1: 3 }, { c1: '2026-11-02T00:00:00Z' });
    expect(keys(myLearning(p, 'c2'))).toContain('c2');
  });

  test('never lists the milestone that has no course', () => {
    const p = pathOf({ c1: 10, c2: 10, c3: 10, c4: 10 });
    expect(myLearning(p, 'c4').every((entry) => entry.node.kind === 'course')).toBe(true);
  });
});

describe('cleanHomeCourse', () => {
  test('keeps a course id with a real time', () => {
    expect(cleanHomeCourse({ id: 'c1', at: '2026-11-16T10:00:00.000Z' })).toEqual({ id: 'c1', at: '2026-11-16T10:00:00.000Z' });
  });
  test.each([[null], [undefined], [{}], [{ id: '', at: '2026-11-16T10:00:00Z' }], [{ id: 'c1' }], [{ id: 'c1', at: 'yesterday' }], [{ id: 7, at: '2026-11-16T10:00:00Z' }], ['c1']])('treats %j as no choice', (value) => {
    expect(cleanHomeCourse(value)).toBeNull();
  });
});
