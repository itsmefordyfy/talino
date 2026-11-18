import { describe, expect, test } from '@jest/globals';

import { AI_BUILDER_JOURNEY } from '../data/journey';
import { buildCoursePath, courseToContinueAfter, type CoursePath, type PathNode } from './course-path';
import { computeJourney } from './engine';
import { emptyFacts, newLearner } from './test-helpers';
import type { CourseSnapshot, JourneyDefinition, JourneyFacts, JourneyLearner } from './types';

/**
 * A small journey with the shapes that matter: an optional course inside the current milestone, a milestone with no course (an action),
 * a second level, and a prerequisite that reaches back past the milestone before it.
 */
const MINI: JourneyDefinition = {
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
        {
          id: 'm1',
          kind: 'learn',
          title: 'M1',
          summary: '',
          why: '',
          objectives: [],
          icon: 'lightbulb',
          steps: [
            { kind: 'learn', courseId: 'c1' },
            { kind: 'learn', courseId: 'c2', optional: true },
            { kind: 'learn', courseId: 'c3' },
            { kind: 'build', courseId: 'c1', projectId: 'c1-p1' },
          ],
          requires: [],
        },
        { id: 'm2', kind: 'learn', title: 'M2', summary: '', why: '', objectives: [], icon: 'edit_note', steps: [{ kind: 'learn', courseId: 'c4' }] },
      ],
    },
    {
      id: 'intermediate',
      level: 'intermediate',
      title: 'Intermediate',
      forWhom: '',
      tagline: '',
      why: '',
      icon: 'rocket_launch',
      milestones: [
        { id: 'm3', kind: 'learn', title: 'M3', summary: '', why: '', objectives: [], icon: 'code', steps: [{ kind: 'learn', courseId: 'c5' }], requires: ['m1'] },
        { id: 'm4', kind: 'challenge', title: 'Show your work', summary: 'Portfolio', why: '', objectives: [], icon: 'folder_special', steps: [{ kind: 'action', action: 'portfolio' }] },
      ],
    },
  ],
};

const COURSES = ['c1', 'c2', 'c3', 'c4', 'c5'];

type Progress = Record<string, number | [number, number]>;

/** Facts for MINI: every course has 10 lessons unless a `[done, total]` pair says otherwise; `lastActive` sets when a course was last worked on. */
function miniFacts(progress: Progress = {}, lastActive: Record<string, string> = {}, extra: Partial<JourneyFacts> = {}): JourneyFacts {
  const courses = new Map<string, CourseSnapshot>();
  for (const id of COURSES) {
    const [done, total] = Array.isArray(progress[id]) ? (progress[id] as [number, number]) : [(progress[id] as number | undefined) ?? 0, 10];
    courses.set(id, {
      title: `Course ${id}`,
      description: `About ${id}`,
      lessonsDone: done,
      lessonsTotal: total,
      started: done > 0,
      complete: total > 0 && done >= total,
      nextLessonId: done >= total ? null : `${id}-${String(done + 1).padStart(2, '0')}`,
      nextLessonTitle: done >= total ? null : `Lesson ${done + 1} title`,
      nextLessonNumber: done >= total ? null : done + 1,
      minutesLeft: (total - done) * 15,
      owned: true,
      quizAverage: null,
      lastActiveAt: lastActive[id] ?? null,
    });
  }
  return { courses, projectTitles: new Map([['c1-p1', 'Project']]), passedProjects: new Set(), openProjects: new Set(), actions: { portfolio: false, resume: false }, ...extra };
}

const path = (facts: JourneyFacts, learner: JourneyLearner = newLearner, definition: JourneyDefinition = MINI): CoursePath => buildCoursePath(computeJourney(definition, facts, learner), facts);
const node = (p: CoursePath, key: string): PathNode => p.nodes.find((entry) => entry.key === key)!;
const statuses = (p: CoursePath) => Object.fromEntries(p.nodes.map((entry) => [entry.key, entry.status]));

describe('every course is a node', () => {
  test('one node per course the journey places, plus the milestone that has no course, in journey order', () => {
    const p = path(miniFacts());
    expect(p.nodes.map((entry) => entry.key)).toEqual(['c1', 'c2', 'c3', 'c4', 'c5', 'm4']);
    expect(node(p, 'm4').kind).toBe('action');
    expect(node(p, 'c1').kind).toBe('course');
    expect(p.nodes.map((entry) => entry.index)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  test('the real journey: one node per course step, none invented, none twice', () => {
    const facts = emptyFacts();
    const state = computeJourney(AI_BUILDER_JOURNEY, facts, newLearner);
    const real = buildCoursePath(state, facts);
    const steps = AI_BUILDER_JOURNEY.stages.flatMap((stage) => stage.milestones.flatMap((milestone) => milestone.steps.filter((step) => step.kind === 'learn')));
    const courseNodes = real.nodes.filter((entry) => entry.kind === 'course');
    expect(courseNodes).toHaveLength(steps.length);
    expect(new Set(courseNodes.map((entry) => entry.courseId)).size).toBe(courseNodes.length);
    expect(courseNodes.map((entry) => entry.courseId)).toEqual(steps.map((step) => (step.kind === 'learn' ? step.courseId : '')));
    // The learner starts on the first course, and it is the only current one.
    expect(real.nodes.filter((entry) => entry.status === 'current')).toHaveLength(1);
    expect(real.current?.courseId).toBe(courseNodes[0]!.courseId);
  });

  test('a course that is not in the app yet gets no node (it never blocks anyone)', () => {
    const facts = miniFacts();
    const courses = new Map(facts.courses);
    courses.delete('c4');
    const p = path({ ...facts, courses });
    expect(p.nodes.map((entry) => entry.key)).not.toContain('c4');
  });

  test('a node carries what the map shows: title, description, lesson count, percent', () => {
    const p = path(miniFacts({ c1: [3, 9] }));
    const c1 = node(p, 'c1');
    expect(c1).toMatchObject({ title: 'Course c1', description: 'About c1', lessonsDone: 3, lessonsTotal: 9, percent: 33, stageIndex: 0, level: 'beginner' });
    expect(c1.fraction).toBeCloseTo(3 / 9);
  });
});

describe('statuses for a new learner', () => {
  const p = path(miniFacts());

  test('the first course is current and every other course is open: nothing is locked (owner, 2026-11-16: any course can be chosen)', () => {
    expect(statuses(p)).toEqual({ c1: 'current', c2: 'available', c3: 'available', c4: 'available', c5: 'available', m4: 'available' });
    expect(p.nodes.every((entry) => !('blockedBy' in entry))).toBe(true);
  });

  test('the resume target is the current course, to start', () => {
    expect(p.current?.key).toBe('c1');
    expect(p.resume?.key).toBe('c1');
    expect(p.resume?.started).toBe(false);
    expect(p.alsoInProgress).toEqual([]);
  });
});

describe('progress and resuming', () => {
  test('part way through a course: still current, with its next lesson', () => {
    const p = path(miniFacts({ c1: 4 }));
    const c1 = node(p, 'c1');
    expect(c1.status).toBe('current');
    expect(c1.started).toBe(true);
    expect(c1).toMatchObject({ lessonsDone: 4, percent: 40, nextLessonId: 'c1-05', nextLessonNumber: 5, nextLessonTitle: 'Lesson 5 title' });
    expect(p.resume?.key).toBe('c1');
  });

  test('finishing a course completes it and moves current to the next required one', () => {
    const p = path(miniFacts({ c1: 10 }));
    expect(statuses(p)).toMatchObject({ c1: 'completed', c3: 'current', c2: 'available', c4: 'available' });
    expect(p.current?.key).toBe('c3');
    expect(p.resume?.key).toBe('c3');
  });

  test('a course with every lesson done is completed even while its project is still to pass', () => {
    const p = path(miniFacts({ c1: 10 }));
    expect(node(p, 'c1').status).toBe('completed');
    expect(node(p, 'c1').hasProject).toBe(true);
    expect(node(p, 'c1').projectPassed).toBe(false);
  });

  test('a course with no lessons is never "completed"', () => {
    const p = path(miniFacts({ c1: [0, 0] }));
    expect(node(p, 'c1').status).not.toBe('completed');
    expect(node(p, 'c1').percent).toBe(0);
  });

  test('different lesson counts: percent is of that course alone', () => {
    const p = path(miniFacts({ c1: [1, 3], c3: [7, 9] }));
    expect(node(p, 'c1').percent).toBe(33);
    expect(node(p, 'c3').percent).toBe(78);
  });

  test('finishing the journey leaves no current course, nothing to resume', () => {
    const done = miniFacts({ c1: 10, c2: 10, c3: 10, c4: 10, c5: 10 }, {}, { passedProjects: new Set(['c1-p1']), actions: { portfolio: true, resume: false } });
    const p = path(done);
    expect(p.current).toBeNull();
    expect(p.resume).toBeNull();
    expect(p.alsoInProgress).toEqual([]);
    expect(p.nodes.every((entry) => entry.status === 'completed')).toBe(true);
  });
});

describe('several courses started', () => {
  test('a started course ahead of the journey is in progress', () => {
    const p = path(miniFacts({ c1: 2, c4: 5 }));
    expect(node(p, 'c4').status).toBe('in-progress');
    expect(node(p, 'c1').status).toBe('current');
  });

  test('the journey course is the primary resume when it was started; the others are listed beside it, untouched', () => {
    const p = path(miniFacts({ c1: 2, c4: 5, c5: 1 }, { c4: '2026-11-10', c5: '2026-11-12', c1: '2026-11-01' }));
    expect(p.resume?.key).toBe('c1');
    expect(p.alsoInProgress.map((entry) => entry.key)).toEqual(['c4', 'c5']);
    expect(node(p, 'c4').lessonsDone).toBe(5);
    expect(node(p, 'c5').lessonsDone).toBe(1);
  });

  test('when the journey course was not started, the course worked on most recently is the resume target', () => {
    const p = path(miniFacts({ c4: 5, c5: 1 }, { c4: '2026-11-10', c5: '2026-11-12' }));
    expect(p.current?.key).toBe('c1');
    expect(p.resume?.key).toBe('c5');
    expect(p.alsoInProgress.map((entry) => entry.key)).toEqual(['c4']);
  });

  test('with no dates to compare, the one furthest along is chosen, then the earlier on the journey', () => {
    expect(path(miniFacts({ c4: 5, c5: 7 })).resume?.key).toBe('c5');
    expect(path(miniFacts({ c4: 5, c5: 5 })).resume?.key).toBe('c4');
  });

  test('a course ahead that has been finished counts as completed, and the journey still points at the same place', () => {
    const p = path(miniFacts({ c5: 10 }));
    expect(node(p, 'c5').status).toBe('completed');
    expect(p.current?.key).toBe('c1');
    expect(node(p, 'c3').status).toBe('available');
  });
});

describe('levels the learner skips', () => {
  const learner: JourneyLearner = { ...newLearner, chosenStart: 'intermediate' };

  test('untouched courses of earlier levels are skipped, and the start level holds the current course', () => {
    const p = path(miniFacts(), learner);
    expect(statuses(p)).toMatchObject({ c1: 'skipped', c2: 'skipped', c3: 'skipped', c4: 'skipped', c5: 'current' });
  });

  test('a course of a skipped level that the learner has started becomes their place: it is not skipped', () => {
    const p = path(miniFacts({ c4: 3 }), learner);
    expect(node(p, 'c4').status).toBe('current');
    expect(node(p, 'c1').status).toBe('skipped');
  });

  test('the course the learner picked for Home is never drawn as skipped ground, and the rest still are', () => {
    const facts = miniFacts();
    const p = buildCoursePath(computeJourney(MINI, facts, learner), facts, { pickedCourseId: 'c1' });
    expect(node(p, 'c1').status).toBe('available');
    expect(node(p, 'c2').status).toBe('skipped');
    // A pick doesn't count towards the level's required courses and doesn't move the journey's own place.
    expect(p.stages[0]).toMatchObject({ coursesDone: 0, coursesTotal: 0 });
    expect(p.current?.key).toBe('c5');
  });
});

describe('levels and stages', () => {
  test('each node knows its level and its place in it', () => {
    const p = path(miniFacts());
    expect(p.nodes.map((entry) => [entry.key, entry.level, entry.stageIndex, entry.indexInStage])).toEqual([
      ['c1', 'beginner', 0, 0],
      ['c2', 'beginner', 0, 1],
      ['c3', 'beginner', 0, 2],
      ['c4', 'beginner', 0, 3],
      ['c5', 'intermediate', 1, 0],
      ['m4', 'intermediate', 1, 1],
    ]);
  });

  test('a level counts the courses that are required of the learner: not the optional, not the skipped', () => {
    const p = path(miniFacts({ c1: 10 }));
    // Beginner: c1, c3, c4 count (c2 is optional).
    expect(p.stages[0]).toMatchObject({ stageIndex: 0, coursesDone: 1, coursesTotal: 3 });
    expect(p.stages[0]!.fraction).toBeCloseTo(1 / 3);
    const skipped = path(miniFacts(), { ...newLearner, chosenStart: 'intermediate' });
    expect(skipped.stages[0]).toMatchObject({ coursesDone: 0, coursesTotal: 0 });
  });

  test('partial progress in a course counts towards its level', () => {
    const p = path(miniFacts({ c1: 5 }));
    expect(p.stages[0]!.fraction).toBeCloseTo(0.5 / 3);
  });
});

describe('prerequisites that reach back', () => {
  test('a milestone that requires an earlier one further back is wired to that milestone’s last course', () => {
    const p = path(miniFacts());
    // m3 (c5) requires m1 (c1, c2, c3): the last of them is node 2, c5 is node 4, so [2, 4].
    expect(p.links).toEqual([[2, 4]]);
  });

  test('no link when the prerequisite is the course right before', () => {
    const p = path(miniFacts(), newLearner, {
      ...MINI,
      stages: [{ ...MINI.stages[0]!, milestones: [MINI.stages[0]!.milestones[0]!, { ...MINI.stages[0]!.milestones[1]!, requires: ['m1'] }] }],
    });
    expect(p.links).toEqual([]);
  });
});

describe('what comes after a finished course', () => {
  test('the journey’s current course, unless that is the one just finished', () => {
    const p = path(miniFacts({ c1: 10 }));
    expect(courseToContinueAfter(p, 'c1')?.key).toBe('c3');
    expect(courseToContinueAfter(p, 'c3')).toBeNull();
  });

  test('nothing when the journey is complete', () => {
    const p = path(miniFacts({ c1: 10, c2: 10, c3: 10, c4: 10, c5: 10 }, {}, { passedProjects: new Set(['c1-p1']), actions: { portfolio: true, resume: false } }));
    expect(courseToContinueAfter(p, 'c5')).toBeNull();
  });
});

describe('the action milestone', () => {
  test('is current when it is the learner’s place, and completed once done', () => {
    const lessons = miniFacts({ c1: 10, c2: 10, c3: 10, c4: 10, c5: 10 }, {}, { passedProjects: new Set(['c1-p1']) });
    const p = path(lessons);
    expect(node(p, 'm4').status).toBe('current');
    expect(p.current?.key).toBe('m4');
    expect(p.resume?.key).toBe('m4');
    const done = path({ ...lessons, actions: { portfolio: true, resume: false } });
    expect(node(done, 'm4').status).toBe('completed');
  });
});

describe('the same facts always give the same path', () => {
  test('pure and deterministic (nothing is stored or random), so a restart or a restored backup shows the same Home', () => {
    const facts = miniFacts({ c1: 10, c3: 4, c4: 2 }, { c3: '2026-11-12' });
    expect(JSON.stringify(path(facts))).toBe(JSON.stringify(path(facts)));
  });
});
