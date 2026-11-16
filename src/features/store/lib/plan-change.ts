import type { PlanKind, StoreItem, SubscriptionInfo, SubscriptionStore } from '../types';
import { planKindFor } from './plans';

/**
 * Switching between Talino Pro's plans from the app (Pawfetti's, Ulamin's and CarMind's rules, adapted to Talino's weekly / monthly /
 * yearly plans). Pure, so it is tested; the Plan screen picks the words for what these return.
 */

/** How long each plan runs, in months, to tell a longer plan from a shorter one. */
const PLAN_LENGTH_MONTHS: Record<PlanKind, number> = { weekly: 0.25, monthly: 1, yearly: 12 };

/** True when `to` runs longer than `from` (weekly to yearly); from an unknown plan, any plan counts as longer. */
export function isLongerPlan(from: PlanKind | null, to: PlanKind): boolean {
  return from === null || PLAN_LENGTH_MONTHS[to] > PLAN_LENGTH_MONTHS[from];
}

/** The store this app version sells through. */
export function deviceStore(os: string | undefined = process.env.EXPO_OS): SubscriptionStore | null {
  return os === 'ios' ? 'app_store' : os === 'android' ? 'play_store' : null;
}

/**
 * Whether the plan can be changed or cancelled from this phone: bought in this platform's store (or RevenueCat's Test Store). One bought
 * on the other platform's store is managed there, and Pro granted with no end date has nothing to change.
 */
export function isManagedHere(info: SubscriptionInfo, os: string | undefined = process.env.EXPO_OS): boolean {
  if (!info.expirationDate) return false;
  return info.store === 'test_store' || info.store === deviceStore(os);
}

/** The plan the subscriber is on: from the product id, else from Google Play's base plan when the plans share one product. */
export function currentPlanKind(info: SubscriptionInfo): PlanKind | null {
  return planKindFor(info.productIdentifier) ?? (info.planIdentifier ? planKindFor(info.planIdentifier) : null);
}

/** Whether a plan on offer is the one the subscriber is on. */
export function isCurrentPlan(plan: StoreItem, info: SubscriptionInfo | null): boolean {
  if (!info) return false;
  const kind = currentPlanKind(info);
  return kind ? plan.kind === kind : plan.productId === info.productIdentifier;
}

/**
 * Google Play's replacement for a plan change, so the new plan replaces the old one instead of running beside it (two subscriptions, two
 * charges). A longer plan starts now and credits the time left; a shorter one starts at the next renewal. Null where nothing is replaced:
 * the App Store (StoreKit switches within the subscription group itself), Free, the same plan, or a plan not bought on Google Play.
 */
export function playReplacement(
  target: StoreItem,
  current: SubscriptionInfo | null,
  os: string | undefined = process.env.EXPO_OS,
): { oldProductIdentifier: string; mode: 'WITH_TIME_PRORATION' | 'DEFERRED' } | null {
  if (os !== 'android' || !current || current.store !== 'play_store' || isCurrentPlan(target, current)) return null;
  return {
    // Google Play replaces the subscription, not one of its base plans ("talino_pro:weekly" is the base plan of "talino_pro").
    oldProductIdentifier: current.productIdentifier.split(':')[0],
    mode: isLongerPlan(currentPlanKind(current), target.kind) ? 'WITH_TIME_PRORATION' : 'DEFERRED',
  };
}

/** Whether a change took effect, read from what the store returned: the new plan now, or the old one until it renews. */
export function planChangeTiming(target: StoreItem, after: SubscriptionInfo | null): 'now' | 'at_renewal' {
  return after && isCurrentPlan(target, after) ? 'now' : 'at_renewal';
}

/** What to say under "Switch to …": the App Store decides when; Google Play starts a longer plan now and a shorter one at renewal. */
export function changeNoteKind(target: StoreItem, current: SubscriptionInfo, os: string | undefined = process.env.EXPO_OS): 'app_store' | 'now' | 'at_renewal' {
  if (os === 'ios' && current.store === 'app_store') return 'app_store';
  return isLongerPlan(currentPlanKind(current), target.kind) ? 'now' : 'at_renewal';
}

/** Where a plan this phone can't change is managed instead. */
export function manageWhere(info: SubscriptionInfo): 'granted' | 'app_store' | 'play_store' | 'elsewhere' {
  if (!info.expirationDate || info.store === 'promotional') return 'granted';
  if (info.store === 'app_store' || info.store === 'play_store') return info.store;
  return 'elsewhere';
}
