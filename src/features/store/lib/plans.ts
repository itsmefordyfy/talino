import type { PlanKind, StoreItem } from '../types';

const BY_PACKAGE_TYPE: Record<string, PlanKind> = { WEEKLY: 'weekly', MONTHLY: 'monthly', ANNUAL: 'yearly' };

/**
 * Which plan a store product is: from its id (`weekly`, `talino_pro_yearly`, `…:base` on Google Play), else from RevenueCat's
 * package type. Null for anything that is not a plan, so a stray product in the offering is skipped, never shown.
 */
export function planKindFor(productId: string, packageType?: string): PlanKind | null {
  const id = productId.split(':')[0].toLowerCase();
  if (id.includes('week')) return 'weekly';
  if (id.includes('month')) return 'monthly';
  if (id.includes('year') || id.includes('annual')) return 'yearly';
  return (packageType && BY_PACKAGE_TYPE[packageType]) || null;
}

const ORDER: PlanKind[] = ['yearly', 'monthly', 'weekly'];

/** Best value first. Works with any subset of the plans and never changes the list it is given. */
export function sortPlans(items: readonly StoreItem[]): StoreItem[] {
  return [...items].sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind));
}

/**
 * The saving of the yearly plan, as a whole percent, against paying the same time monthly (12 payments) or, with no monthly plan,
 * weekly (52 payments). Null for every other plan and whenever there is nothing honest to compare (no other plan, a zero price, or
 * a yearly plan that costs more).
 */
export function savingPercent(item: StoreItem, items: readonly StoreItem[]): number | null {
  if (item.kind !== 'yearly') return null;
  const monthly = items.find((candidate) => candidate.kind === 'monthly' && candidate.price > 0);
  const weekly = items.find((candidate) => candidate.kind === 'weekly' && candidate.price > 0);
  const payingInstead = monthly ? monthly.price * 12 : weekly ? weekly.price * 52 : 0;
  if (payingInstead <= 0) return null;
  const percent = Math.round((1 - item.price / payingInstead) * 100);
  return percent > 0 ? percent : null;
}

/**
 * What a week costs on the yearly plan ("₱38.44"), in the store's own currency: the line that makes the deal clear next to the weekly price.
 * Null for every other plan, a zero price, or a runtime that can't format the currency.
 */
export function weeklyEquivalent(item: StoreItem): string | null {
  if (item.kind !== 'yearly' || item.price <= 0) return null;
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: item.currencyCode }).format(item.price / 52);
  } catch {
    return null;
  }
}
