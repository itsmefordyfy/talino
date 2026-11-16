import { describe, expect, test } from '@jest/globals';

import { hasAllAccess, hasAnyPurchase, ownsCourse } from './access';
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
