import { formatDate, toISODate } from '@/lib/dates';

import type { PlanKind, SubscriptionInfo } from '../types';
import { planKindFor } from './plans';

export type PlanText = {
  plans: Record<PlanKind, string>;
  renews: (date: string) => string;
  cancelled: (date: string) => string;
  paymentProblem: string;
};

/**
 * The status line for a subscriber: "Weekly · Renews Dec 1, 2026". A failed renewal says so before anything else; a cancelled plan
 * says Pro lasts until the period ends (it is not over yet); a grant with no end date is just its name.
 */
export function describePlan(info: SubscriptionInfo, text: PlanText, formatDate: (iso: string) => string): string {
  const kind = planKindFor(info.productIdentifier);
  const name = kind ? text.plans[kind] : null;
  const status = info.billingIssue
    ? text.paymentProblem
    : info.expirationDate
      ? info.willRenew
        ? text.renews(formatDate(info.expirationDate))
        : text.cancelled(formatDate(info.expirationDate))
      : null;
  return [name, status].filter(Boolean).join(' · ');
}

/** A store date (an ISO instant) as the learner's own calendar date, as Settings' plan card and the Plan screen show it. */
export function formatPlanDate(iso: string): string {
  return formatDate(toISODate(new Date(iso)));
}
