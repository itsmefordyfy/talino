import { describe, expect, test } from '@jest/globals';

import type { StoreItem, SubscriptionInfo } from '../types';
import { changeNoteKind, currentPlanKind, isCurrentPlan, isLongerPlan, isManagedHere, manageWhere, planChangeTiming, playReplacement } from './plan-change';

const item = (kind: StoreItem['kind'], productId = `talino_pro_${kind}`): StoreItem => ({ productId, kind, title: '', priceString: '₱1', price: 1, currencyCode: 'PHP', offeringId: 'default', packageId: productId });

const subscription = (changes: Partial<SubscriptionInfo> = {}): SubscriptionInfo => ({
  productIdentifier: 'talino_pro_weekly',
  store: 'play_store',
  expirationDate: '2026-12-01T00:00:00Z',
  willRenew: true,
  billingIssue: false,
  ...changes,
});

describe('isLongerPlan', () => {
  test('a plan that runs longer is longer, never the other way', () => {
    expect(isLongerPlan('weekly', 'yearly')).toBe(true);
    expect(isLongerPlan('weekly', 'monthly')).toBe(true);
    expect(isLongerPlan('monthly', 'yearly')).toBe(true);
    expect(isLongerPlan('yearly', 'weekly')).toBe(false);
    expect(isLongerPlan('yearly', 'monthly')).toBe(false);
  });

  test('from an unknown plan, any plan counts as longer', () => {
    expect(isLongerPlan(null, 'weekly')).toBe(true);
  });
});

describe('currentPlanKind', () => {
  test('reads the plan from the product id, else from Google Play’s base plan', () => {
    expect(currentPlanKind(subscription())).toBe('weekly');
    expect(currentPlanKind(subscription({ productIdentifier: 'talino_pro', planIdentifier: 'yearly' }))).toBe('yearly');
    expect(currentPlanKind(subscription({ productIdentifier: 'talino_pro', planIdentifier: null }))).toBeNull();
  });
});

describe('isManagedHere', () => {
  test('a plan from this phone’s store, or the test store', () => {
    expect(isManagedHere(subscription(), 'android')).toBe(true);
    expect(isManagedHere(subscription({ store: 'app_store' }), 'ios')).toBe(true);
    expect(isManagedHere(subscription({ store: 'test_store' }), 'ios')).toBe(true);
  });

  test('not a plan from the other store, a grant, or Pro with no end date', () => {
    expect(isManagedHere(subscription(), 'ios')).toBe(false);
    expect(isManagedHere(subscription({ store: 'app_store' }), 'android')).toBe(false);
    expect(isManagedHere(subscription({ store: 'promotional' }), 'android')).toBe(false);
    expect(isManagedHere(subscription({ expirationDate: null }), 'android')).toBe(false);
  });
});

describe('isCurrentPlan', () => {
  test('the plan the subscriber is on, by kind', () => {
    expect(isCurrentPlan(item('weekly'), subscription())).toBe(true);
    expect(isCurrentPlan(item('yearly'), subscription())).toBe(false);
  });

  test('Google Play: one subscription with a base plan per length', () => {
    const play = subscription({ productIdentifier: 'talino_pro', planIdentifier: 'yearly' });
    expect(isCurrentPlan(item('yearly', 'talino_pro:yearly'), play)).toBe(true);
    expect(isCurrentPlan(item('weekly', 'talino_pro:weekly'), play)).toBe(false);
  });

  test('nothing is current on Free', () => {
    expect(isCurrentPlan(item('weekly'), null)).toBe(false);
  });
});

describe('playReplacement', () => {
  test('a longer plan replaces the old one now, with the time left credited', () => {
    expect(playReplacement(item('yearly'), subscription(), 'android')).toEqual({ oldProductIdentifier: 'talino_pro_weekly', mode: 'WITH_TIME_PRORATION' });
  });

  test('a shorter plan waits for the renewal', () => {
    const yearly = subscription({ productIdentifier: 'talino_pro_yearly' });
    expect(playReplacement(item('weekly'), yearly, 'android')).toEqual({ oldProductIdentifier: 'talino_pro_yearly', mode: 'DEFERRED' });
  });

  test('replaces the subscription, not its base plan, on Google Play', () => {
    const play = subscription({ productIdentifier: 'talino_pro', planIdentifier: 'weekly' });
    expect(playReplacement(item('yearly', 'talino_pro:yearly'), play, 'android')).toEqual({ oldProductIdentifier: 'talino_pro', mode: 'WITH_TIME_PRORATION' });
  });

  test('nothing to replace on the App Store, on Free, for the same plan, or for a plan bought elsewhere', () => {
    expect(playReplacement(item('yearly'), subscription({ store: 'app_store' }), 'ios')).toBeNull();
    expect(playReplacement(item('yearly'), subscription(), 'ios')).toBeNull();
    expect(playReplacement(item('yearly'), null, 'android')).toBeNull();
    expect(playReplacement(item('weekly'), subscription(), 'android')).toBeNull();
    expect(playReplacement(item('yearly'), subscription({ store: 'app_store' }), 'android')).toBeNull();
  });
});

describe('planChangeTiming', () => {
  test('now when the store already returned the new plan, else at renewal', () => {
    expect(planChangeTiming(item('yearly'), subscription({ productIdentifier: 'talino_pro_yearly' }))).toBe('now');
    expect(planChangeTiming(item('yearly'), subscription())).toBe('at_renewal');
    expect(planChangeTiming(item('yearly'), null)).toBe('at_renewal');
  });
});

describe('changeNoteKind', () => {
  test('the App Store decides; Google Play starts a longer plan now and a shorter one at renewal', () => {
    expect(changeNoteKind(item('yearly'), subscription({ store: 'app_store' }), 'ios')).toBe('app_store');
    expect(changeNoteKind(item('yearly'), subscription(), 'android')).toBe('now');
    expect(changeNoteKind(item('weekly'), subscription({ productIdentifier: 'talino_pro_yearly' }), 'android')).toBe('at_renewal');
  });

  test('the test store follows the simple rule', () => {
    expect(changeNoteKind(item('yearly'), subscription({ store: 'test_store' }), 'ios')).toBe('now');
  });
});

describe('manageWhere', () => {
  test('where a plan this phone can’t change is managed instead', () => {
    expect(manageWhere(subscription({ store: 'promotional' }))).toBe('granted');
    expect(manageWhere(subscription({ expirationDate: null }))).toBe('granted');
    expect(manageWhere(subscription({ store: 'app_store' }))).toBe('app_store');
    expect(manageWhere(subscription())).toBe('play_store');
    expect(manageWhere(subscription({ store: 'other' }))).toBe('elsewhere');
  });
});
