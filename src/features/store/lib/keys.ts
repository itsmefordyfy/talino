/**
 * Which public RevenueCat SDK key a build uses (Bubblie's rule). Development prefers the Test Store
 * key, then the platform key. A release build takes only its own store's key, by prefix (`appl_` /
 * `goog_`): a Test Store key there would crash the SDK on purpose.
 */
export function pickRevenueCatKey({ dev, testKey, platformKey, prefix }: { dev: boolean; testKey: string | undefined; platformKey: string | undefined; prefix: string }): string | undefined {
  if (dev) return testKey || platformKey || undefined;
  return platformKey?.startsWith(prefix) ? platformKey : undefined;
}

const ANDROID = process.env.EXPO_OS === 'android';

/** The public SDK key for this build and platform (safe to ship: it only identifies the project). */
export const REVENUECAT_API_KEY: string | undefined = pickRevenueCatKey({
  dev: __DEV__,
  testKey: process.env.EXPO_PUBLIC_REVENUECAT_TEST_KEY,
  platformKey: ANDROID ? process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY : process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  prefix: ANDROID ? 'goog_' : 'appl_',
});

/** Where each store lets people cancel or change a subscription, when RevenueCat gives no link. */
export const STORE_SUBSCRIPTIONS_URL = {
  ios: 'https://apps.apple.com/account/subscriptions',
  android: 'https://play.google.com/store/account/subscriptions',
} as const;

/** The Android application id, for Google Play's page of one subscription. */
export const ANDROID_PACKAGE = 'com.fordytechsolutions.talino';
