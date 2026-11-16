import { describe, expect, test } from '@jest/globals';

import { LEARNING_PATHS } from '@/features/courses/content/catalog';
import { planForPath } from '@/features/courses/lib/recommendations';
import { FACTS, finished, signalsFor } from '@/features/courses/lib/recommendations/recommendations.test-helpers';
import type { LearnerProfile } from '@/features/onboarding/lib/profile';

import { firstLessonCourseId, otherStarted, pathAction, pathInProgress } from './own-learning';

const web: Partial<LearnerProfile> = { experience: 'intermediate', goals: ['frontend'], interests: ['react', 'javascript'] };
const plansFor = (signals: ReturnType<typeof signalsFor>) => LEARNING_PATHS.map((path) => planForPath(path, signals, FACTS)).filter((plan): plan is NonNullable<typeof plan> => plan !== null);
const progressOf = (courseId: string, fraction: number) => ({ courseId, fraction, complete: false, started: true, quizAverage: null, lessonsDone: 2 });

describe('otherStarted', () => {
  test('lists started courses except the leading one, most recent first, within the limit', () => {
    const started = new Map([
      ['a', { fraction: 0.5, lastActivityAt: '2026-11-10T10:00:00Z' }],
      ['b', { fraction: 0.2, lastActivityAt: '2026-11-13T10:00:00Z' }],
      ['c', { fraction: 0.1, lastActivityAt: '2026-11-12T10:00:00Z' }],
      ['d', { fraction: 0.9 }],
    ]);
    expect(otherStarted(started, 'a')).toEqual(['b', 'c']);
    expect(otherStarted(started, null, 4)).toEqual(['b', 'c', 'a', 'd']);
    expect(otherStarted(new Map(), null)).toEqual([]);
    expect(otherStarted(new Map([['a', { fraction: 0.1 }]]), 'a')).toEqual([]);
  });
});

describe('pathInProgress', () => {
  test('a learner who has started nothing is on no path: Today shows none (finding one is Discover\'s job)', () => {
    expect(pathInProgress(plansFor(signalsFor(web)))).toBeNull();
  });

  test('a path appears once one of its courses is started, whatever the learner\'s interests say', () => {
    const path = LEARNING_PATHS.find((entry) => entry.courseIds.some((id) => FACTS.some((facts) => facts.id === id)))!;
    const courseId = path.courseIds.find((id) => FACTS.some((facts) => facts.id === id))!;
    const plans = plansFor(signalsFor({ goals: ['backend'], interests: ['go'] }, [progressOf(courseId, 0.3)]));
    const found = pathInProgress(plans);
    expect(found).not.toBeNull();
    expect(found!.path.courseIds).toContain(courseId);
  });

  test('a finished path is not shown, and the one with the most progress wins', () => {
    const path = LEARNING_PATHS.find((entry) => entry.courseIds.filter((id) => FACTS.some((facts) => facts.id === id)).length >= 2)!;
    const ids = path.courseIds.filter((id) => FACTS.some((facts) => facts.id === id));
    expect(pathInProgress(plansFor(signalsFor(web, finished(...ids)))?.filter((plan) => plan.path.id === path.id) ?? [])).toBeNull();
    const one = plansFor(signalsFor(web, [...finished(ids[0])]));
    expect(pathInProgress(one.filter((plan) => plan.path.id === path.id))?.done).toBe(1);
  });
});

describe('pathAction', () => {
  test('continue a course in progress; start the next one otherwise; nothing when the path is done', () => {
    const path = LEARNING_PATHS.find((entry) => entry.courseIds.some((id) => FACTS.some((facts) => facts.id === id)))!;
    const fresh = planForPath(path, signalsFor(web), FACTS)!;
    const nextId = fresh.nextStep!.facts.id;
    expect(pathAction(fresh)).toEqual({ courseId: nextId, kind: 'start' });
    const midway = planForPath(path, signalsFor(web, [progressOf(nextId, 0.4)]), FACTS)!;
    expect(pathAction(midway)).toEqual({ courseId: nextId, kind: 'continue' });
    const all = planForPath(path, signalsFor(web, finished(...path.courseIds)), FACTS)!;
    expect(pathAction(all)).toBeNull();
  });
});

describe('firstLessonCourseId', () => {
  const free = { owns: (id: string) => id === 'starter', complete: () => false };
  test('the free starter when nothing else is chosen or planned', () => {
    expect(firstLessonCourseId({ chosen: null, planStartId: null, ...free })).toBe('starter');
  });
  test('the learner\'s own choice, then their plan\'s first step, when they have it and haven\'t finished it', () => {
    const owns = (id: string) => ['starter', 'developer', 'builder'].includes(id);
    expect(firstLessonCourseId({ chosen: 'builder', planStartId: 'developer', owns, complete: () => false })).toBe('builder');
    expect(firstLessonCourseId({ chosen: null, planStartId: 'developer', owns, complete: () => false })).toBe('developer');
    expect(firstLessonCourseId({ chosen: 'builder', planStartId: 'developer', owns, complete: (id) => id === 'builder' })).toBe('developer');
  });
  test('a course they do not own is never offered as the first lesson', () => {
    expect(firstLessonCourseId({ chosen: 'developer', planStartId: 'builder', ...free })).toBe('starter');
  });
});
