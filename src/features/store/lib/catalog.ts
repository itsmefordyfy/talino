/**
 * What Talino sells, as it must be set up in RevenueCat (docs/revenuecat.md): one subscription, Talino Pro, in three plans (weekly,
 * monthly, yearly; the dashboard may offer only some), all attached to the entitlement `talino_pro`. The app only reads the entitlement,
 * so prices and plans can change in the dashboard. Per-course entitlements are not sold any more, but the server still grants them
 * without a purchase (a teacher's class codes, referral rewards), so `courseEntitlement` stays.
 */

/** The Talino Pro entitlement (RevenueCat → Entitlements). Kept under its old constant name: the server and the app import it by that name. */
export const ALL_ACCESS_ENTITLEMENT = 'talino_pro';
export const OFFERING_ID = 'default';
/** Shown instead of `default` to a learner who entered a friend's invite code, when the dashboard has it. */

/** The simulated store's product ids (real ones are whatever the stores and RevenueCat hold; `planKindFor` reads the plan from either). */
export const PRODUCT_IDS = {
  weekly: 'talino_pro_weekly',
  monthly: 'talino_pro_monthly',
  yearly: 'talino_pro_yearly',
} as const;

const snake = (id: string) => id.replace(/-/g, '_');

/** `developer` → `course_developer`; `mini-python-ai` → `mini_python_ai`. */
export function courseEntitlement(courseId: string): string {
  return courseId.startsWith('mini-') ? snake(courseId) : `course_${snake(courseId)}`;
}

/** The plans' prices, for the simulated store only (live prices always come from the store). Monthly is optional in the dashboard, so the simulated store offers weekly and yearly. */
export const MOCK_PRICES_PHP = { weekly: 199, monthly: 449, yearly: 1999 } as const;
