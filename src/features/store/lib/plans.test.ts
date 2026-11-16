import { describe, expect, test } from '@jest/globals';

import type { StoreItem } from '../types';
import { describePlan } from './describe-plan';
import { planKindFor, savingPercent, sortPlans, weeklyEquivalent } from './plans';

const item = (productId: string, kind: StoreItem['kind'], price: number): StoreItem => ({
  productId,
  kind,
  title: productId,
  priceString: `₱${price}`,
  price,
  currencyCode: 'PHP',
  offeringId: 'default',
  packageId: productId,
});

const weekly = item('weekly', 'weekly', 199);
const monthly = item('monthly', 'monthly', 449);
const yearly = item('yearly', 'yearly', 1999);

describe('planKindFor', () => {
  test('reads the plan from the product id, whatever the prefix', () => {
    expect(planKindFor('weekly')).toBe('weekly');
    expect(planKindFor('talino_pro_weekly')).toBe('weekly');
    expect(planKindFor('talino_pro_monthly')).toBe('monthly');
    expect(planKindFor('yearly')).toBe('yearly');
    expect(planKindFor('talino_pro_annual')).toBe('yearly');
  });

  test('ignores the base-plan suffix Google Play adds after a colon', () => {
    expect(planKindFor('talino_pro_yearly:base')).toBe('yearly');
  });

  test('falls back to the package type when the id says nothing', () => {
    expect(planKindFor('x', 'ANNUAL')).toBe('yearly');
    expect(planKindFor('x', 'MONTHLY')).toBe('monthly');
    expect(planKindFor('x', 'WEEKLY')).toBe('weekly');
  });

  test('is null for anything that is not a plan (a course product, a lifetime pack)', () => {
    expect(planKindFor('talino_course_developer')).toBeNull();
    expect(planKindFor('x', 'LIFETIME')).toBeNull();
    expect(planKindFor('x')).toBeNull();
  });
});

describe('sortPlans', () => {
  test('puts the yearly plan first, then monthly, then weekly', () => {
    expect(sortPlans([weekly, monthly, yearly]).map((plan) => plan.kind)).toEqual(['yearly', 'monthly', 'weekly']);
  });

  test('works with only some of the plans (a half-set-up offering)', () => {
    expect(sortPlans([weekly, yearly]).map((plan) => plan.kind)).toEqual(['yearly', 'weekly']);
    expect(sortPlans([weekly]).map((plan) => plan.kind)).toEqual(['weekly']);
    expect(sortPlans([])).toEqual([]);
  });

  test('does not change the list it is given', () => {
    const list = [weekly, yearly];
    sortPlans(list);
    expect(list.map((plan) => plan.kind)).toEqual(['weekly', 'yearly']);
  });
});

describe('savingPercent', () => {
  test('is the yearly plan against twelve monthly payments', () => {
    expect(savingPercent(yearly, [monthly, yearly])).toBe(63);
  });

  test('is the yearly plan against 52 weekly payments when there is no monthly plan', () => {
    expect(savingPercent(yearly, [weekly, yearly])).toBe(81);
  });

  test('prefers the monthly comparison when both exist', () => {
    expect(savingPercent(yearly, [weekly, monthly, yearly])).toBe(63);
  });

  test('is null for the weekly and monthly plans, and when nothing can be compared', () => {
    expect(savingPercent(weekly, [weekly, monthly, yearly])).toBeNull();
    expect(savingPercent(monthly, [weekly, monthly, yearly])).toBeNull();
    expect(savingPercent(yearly, [yearly])).toBeNull();
  });

  test('is null instead of negative or infinite when a price is zero or the plan costs more', () => {
    expect(savingPercent(yearly, [item('monthly', 'monthly', 0), yearly])).toBeNull();
    expect(savingPercent(item('yearly', 'yearly', 9999), [monthly, item('yearly', 'yearly', 9999)])).toBeNull();
  });
});

describe('describePlan', () => {
  const text = {
    plans: { weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly' },
    renews: (date: string) => `Renews ${date}`,
    cancelled: (date: string) => `Cancelled, Pro until ${date}`,
    paymentProblem: 'Payment problem',
  };
  const date = (iso: string) => `D(${iso.slice(0, 10)})`;
  const base = { store: 'app_store' as const, expirationDate: '2026-12-01T00:00:00Z', willRenew: true, billingIssue: false };

  test('names the plan from the product id and says when it renews', () => {
    expect(describePlan({ ...base, productIdentifier: 'weekly' }, text, date)).toBe('Weekly · Renews D(2026-12-01)');
    expect(describePlan({ ...base, productIdentifier: 'talino_pro_yearly' }, text, date)).toBe('Yearly · Renews D(2026-12-01)');
  });

  test('a cancelled plan says Pro lasts until the period ends', () => {
    expect(describePlan({ ...base, productIdentifier: 'monthly', willRenew: false }, text, date)).toBe('Monthly · Cancelled, Pro until D(2026-12-01)');
  });

  test('a payment problem wins over everything else', () => {
    expect(describePlan({ ...base, productIdentifier: 'weekly', billingIssue: true, willRenew: false }, text, date)).toBe('Weekly · Payment problem');
  });

  test('a plan with no end date (a promotional grant) is just its name', () => {
    expect(describePlan({ ...base, productIdentifier: 'weekly', expirationDate: null }, text, date)).toBe('Weekly');
  });

  test('a product that is not one of the plans still reads sensibly', () => {
    expect(describePlan({ ...base, productIdentifier: 'rc_promo_talino_pro', store: 'promotional' }, text, date)).toBe('Renews D(2026-12-01)');
  });
});

describe('weeklyEquivalent', () => {
  test('is the yearly price over 52 weeks, in the store currency', () => {
    expect(weeklyEquivalent(yearly)).toMatch(/38[.,]44/);
    expect(weeklyEquivalent(yearly)).toContain('₱');
  });

  test('is null for the weekly and monthly plans, a free price and a currency it cannot format', () => {
    expect(weeklyEquivalent(weekly)).toBeNull();
    expect(weeklyEquivalent(monthly)).toBeNull();
    expect(weeklyEquivalent(item('yearly', 'yearly', 0))).toBeNull();
    expect(weeklyEquivalent({ ...yearly, currencyCode: 'not a currency' })).toBeNull();
  });
});
