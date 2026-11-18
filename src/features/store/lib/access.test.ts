import { describe, expect, test } from '@jest/globals';

import { canOpenLesson, hasAllAccess, hasAnyPurchase, isFreeLesson, ownsCourse } from './access';
import { ALL_ACCESS_ENTITLEMENT, courseEntitlement } from './catalog';

describe('catalog ids', () => {
  test('Talino Pro is the one entitlement the subscription grants', () => {
    expect(ALL_ACCESS_ENTITLEMENT).toBe('talino_pro');
  });

  // The server still grants these without a purchase (a teacher's class codes, referral rewards), so they must keep their names.
  test('career and mini-course entitlements', () => {
    expect(courseEntitlement('developer')).toBe('course_developer');
    expect(courseEntitlement('mini-python-ai')).toBe('mini_python_ai');
  });
});

describe('ownsCourse', () => {
  const developer = { id: 'developer', kind: 'career' as const };
  test('the starter course is free', () => {
    expect(ownsCourse(null, { id: 'starter', kind: 'starter' })).toBe(true);
  });
  test('its own entitlement or All-Access', () => {
    expect(ownsCourse({ entitlements: [] }, developer)).toBe(false);
    expect(ownsCourse({ entitlements: ['course_developer'] }, developer)).toBe(true);
    expect(ownsCourse({ entitlements: ['talino_pro'] }, developer)).toBe(true);
    expect(ownsCourse({ entitlements: ['course_builder'] }, developer)).toBe(false);
  });
  test('plan flags', () => {
    expect(hasAllAccess({ entitlements: ['talino_pro'] })).toBe(true);
    expect(hasAnyPurchase({ entitlements: [] })).toBe(false);
    expect(hasAnyPurchase({ entitlements: ['mini_ai_qa'] })).toBe(true);
  });
});

describe('the free first lesson', () => {
  const course = { id: 'developer', kind: 'career' as const, lessons: [{ id: 'developer-01' }, { id: 'developer-02' }, { id: 'developer-03' }] };
  test('only the first lesson of a course is free', () => {
    expect(isFreeLesson(course, 'developer-01')).toBe(true);
    expect(isFreeLesson(course, 'developer-02')).toBe(false);
    expect(isFreeLesson({ lessons: [] }, 'x')).toBe(false);
  });
  test('without the course, the first lesson opens and the rest do not', () => {
    expect(canOpenLesson(null, course, 'developer-01')).toBe(true);
    expect(canOpenLesson({ entitlements: [] }, course, 'developer-02')).toBe(false);
  });
  test('with the course or Talino Pro, every lesson opens', () => {
    expect(canOpenLesson({ entitlements: ['course_developer'] }, course, 'developer-03')).toBe(true);
    expect(canOpenLesson({ entitlements: [ALL_ACCESS_ENTITLEMENT] }, course, 'developer-03')).toBe(true);
  });
});
