import { describe, expect, test } from '@jest/globals';

import { buildTimeline, type TimelineInput } from './timeline';

const lessons = (count: number) => Array.from({ length: count }, (_, i) => ({ id: `c-${String(i + 1).padStart(2, '0')}`, day: i + 1, title: `Lesson ${i + 1}`, summary: `About ${i + 1}`, minutes: 10 + i }));

/** Lessons open in order, like `computeCourseProgress`: done, the first not done is next, the rest wait. */
function input(count: number, done: number, extra: Partial<TimelineInput> = {}): TimelineInput {
  const list = lessons(count);
  return {
    lessons: list,
    lessonState: (id) => {
      const index = list.findIndex((lesson) => lesson.id === id);
      return index < done ? 'done' : index === done ? 'next' : 'locked';
    },
    projects: [],
    owned: true,
    ...extra,
  };
}

const lessonItems = (timeline: ReturnType<typeof buildTimeline>) => timeline.items.flatMap((item) => (item.kind === 'lesson' ? [item] : []));
const states = (timeline: ReturnType<typeof buildTimeline>) => lessonItems(timeline).map((item) => item.state);

describe('lesson states', () => {
  test('done lessons are completed, the next one is current, the rest are upcoming (visible, not locked)', () => {
    const timeline = buildTimeline(input(6, 2));
    expect(states(timeline)).toEqual(['completed', 'completed', 'current', 'upcoming', 'upcoming', 'upcoming']);
    expect(timeline.currentLessonId).toBe('c-03');
    expect(timeline.lock).toBeNull();
  });

  test('a new learner starts at lesson 1', () => {
    const timeline = buildTimeline(input(5, 0));
    expect(states(timeline)).toEqual(['current', 'upcoming', 'upcoming', 'upcoming', 'upcoming']);
    expect(timeline).toMatchObject({ lessonsDone: 0, percent: 0, complete: false, started: false });
  });

  test('a finished course has no current lesson and every lesson is completed', () => {
    const timeline = buildTimeline(input(5, 5));
    expect(states(timeline)).toEqual(Array(5).fill('completed'));
    expect(timeline.currentLessonId).toBeNull();
    expect(timeline).toMatchObject({ complete: true, percent: 100, remaining: 0, minutesLeft: 0 });
  });

  test('a lesson done out of order stays completed and the current lesson is the first not done', () => {
    const list = lessons(4);
    const timeline = buildTimeline({ ...input(4, 0), lessonState: (id) => (id === 'c-03' ? 'done' : id === 'c-01' ? 'next' : 'locked') });
    expect(states(timeline)).toEqual(['current', 'upcoming', 'completed', 'upcoming']);
    expect(list).toHaveLength(4);
  });

  test('a course the learner does not own: its first lesson is a free taste, so it is open and current', () => {
    const timeline = buildTimeline(input(5, 0, { owned: false }));
    expect(states(timeline)).toEqual(['current', 'locked', 'locked', 'locked', 'locked']);
    expect(timeline.lock).toBe('pro');
    expect(timeline.currentLessonId).toBe('c-01');
  });

  test('a course the learner does not own: unfinished lessons are locked (they open the paywall), finished ones stay completed', () => {
    const timeline = buildTimeline(input(5, 1, { owned: false }));
    expect(states(timeline)).toEqual(['completed', 'locked', 'locked', 'locked', 'locked']);
    expect(timeline.lock).toBe('pro');
    // Where they would start is still known, so the screen can say what Pro unlocks.
    expect(timeline.currentLessonId).toBe('c-02');
  });

});

describe('numbers shown at the top', () => {
  test('percent, lessons left and minutes left come from the lessons really done', () => {
    const timeline = buildTimeline(input(12, 4));
    expect(timeline).toMatchObject({ lessonsDone: 4, lessonsTotal: 12, percent: 33, remaining: 8, started: true });
    // Lessons 5..12 take 14..21 minutes.
    expect(timeline.minutesLeft).toBe([14, 15, 16, 17, 18, 19, 20, 21].reduce((a, b) => a + b, 0));
  });

  test('the next lesson is described the way Home says it: "Lesson 5"', () => {
    const timeline = buildTimeline(input(12, 4));
    expect(timeline.next).toEqual({ id: 'c-05', number: 5, title: 'Lesson 5' });
  });

  test('courses with different lesson counts each get their own percent', () => {
    expect(buildTimeline(input(3, 1)).percent).toBe(33);
    expect(buildTimeline(input(9, 7)).percent).toBe(78);
    expect(buildTimeline(input(15, 1)).percent).toBe(7);
  });

  test('a course with no lessons is empty, never complete', () => {
    const timeline = buildTimeline(input(0, 0));
    expect(timeline).toMatchObject({ lessonsTotal: 0, percent: 0, complete: false, currentLessonId: null });
    expect(timeline.items).toEqual([]);
  });
});

describe('waypoints where Tali encourages', () => {
  const waypoints = (timeline: ReturnType<typeof buildTimeline>) => timeline.items.flatMap((item, i) => (item.kind === 'waypoint' ? [{ type: item.type, reached: item.reached, after: timeline.items[i - 1]?.kind === 'lesson' ? (timeline.items[i - 1] as { number: number }).number : null }] : []));

  test('halfway sits after the middle lesson of a longer course, and is reached once that lesson is done', () => {
    expect(waypoints(buildTimeline(input(12, 5)))).toContainEqual({ type: 'halfway', reached: false, after: 6 });
    expect(waypoints(buildTimeline(input(12, 6)))).toContainEqual({ type: 'halfway', reached: true, after: 6 });
    expect(waypoints(buildTimeline(input(7, 4)))).toContainEqual({ type: 'halfway', reached: true, after: 4 });
  });

  test('a short course has no halfway marker', () => {
    expect(waypoints(buildTimeline(input(5, 3))).map((entry) => entry.type)).toEqual(['finish']);
  });

  test('the finish marker closes the lessons and is reached when the course is complete', () => {
    const open = buildTimeline(input(8, 7));
    const done = buildTimeline(input(8, 8));
    expect(waypoints(open).at(-1)).toMatchObject({ type: 'finish', reached: false, after: 8 });
    expect(waypoints(done).at(-1)).toMatchObject({ type: 'finish', reached: true });
  });
});

describe('the course’s project', () => {
  const project = (state: 'passed' | 'open' | 'later') => [{ id: 'c-p1', title: 'Build it', passed: state === 'passed', open: state !== 'later' }];

  test('comes after the finish marker: completed when passed, open when its day is done, upcoming before that', () => {
    const last = (timeline: ReturnType<typeof buildTimeline>) => timeline.items.at(-1);
    expect(last(buildTimeline(input(6, 6, { projects: project('passed') })))).toMatchObject({ kind: 'project', id: 'c-p1', state: 'completed' });
    expect(last(buildTimeline(input(6, 6, { projects: project('open') })))).toMatchObject({ kind: 'project', state: 'open' });
    expect(last(buildTimeline(input(6, 2, { projects: project('later') })))).toMatchObject({ kind: 'project', state: 'upcoming' });
  });

  test('is locked when the course is not the learner’s', () => {
    expect(buildTimeline(input(6, 0, { projects: project('open'), owned: false })).items.at(-1)).toMatchObject({ kind: 'project', state: 'locked' });
  });

  test('a passed project stays completed even if the course is locked (nothing the learner did is hidden)', () => {
    expect(buildTimeline(input(6, 6, { projects: project('passed'), owned: false })).items.at(-1)).toMatchObject({ state: 'completed' });
  });
});

describe('the same inputs always give the same timeline', () => {
  test('pure: a restart or restored progress shows the same screen', () => {
    expect(JSON.stringify(buildTimeline(input(10, 3)))).toBe(JSON.stringify(buildTimeline(input(10, 3))));
  });
});
