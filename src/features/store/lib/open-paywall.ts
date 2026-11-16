import { router } from 'expo-router';

import { paywallReason, type PaywallReason } from './paywall-reasons';

/**
 * The one way into the paywall: the app's own screen (`/paywall`), always. RevenueCat's own Paywall (designed in its dashboard, shown through
 * `react-native-purchases-ui`) is not used (owner, 2026-11-15: "do not use the paywall from RevenueCat"); RevenueCat still sells and verifies
 * the plans behind this screen. Managing a subscription is the app's own Plan screen (`/subscription`), not RevenueCat's Customer Center.
 */
export function openPaywall(reason: PaywallReason = 'default'): void {
  router.push({ pathname: '/paywall', params: { reason: paywallReason(reason) } });
}
