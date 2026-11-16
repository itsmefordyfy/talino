import { requireOptionalNativeModule } from 'expo';
import { Linking } from 'react-native';

import { reportError } from '@/lib/monitoring';

/** The part of `expo-store-review` used here. */
type StoreReviewModule = { storeUrl: () => string | null };

/**
 * expo-store-review, when this build has it. Talino doesn't depend on it yet (owner's call), so the module is loaded only if it is
 * installed and its native side is in the build (an optional require: Metro bundles it as an optional dependency, and without the
 * package or the native code this is null). Null hides Settings → Rate Talino.
 */
const StoreReview: StoreReviewModule | null = loadStoreReview();

function loadStoreReview(): StoreReviewModule | null {
  try {
    if (!requireOptionalNativeModule('ExpoStoreReview')) return null;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('expo-store-review') as StoreReviewModule;
  } catch {
    return null;
  }
}

/** The store page with its review box open: App Store's write-review action, Google Play's all-reviews view. Pure, for tests. */
export function reviewUrlFor(storeUrl: string | null | undefined, os: string): string | null {
  if (!storeUrl) return null;
  const action = os === 'ios' ? 'action=write-review' : 'showAllReviews=true';
  return `${storeUrl}${storeUrl.includes('?') ? '&' : '?'}${action}`;
}

/**
 * Talino's store page with its reviews open (Settings → Rate Talino), from `ios.appStoreUrl` / `android.playStoreUrl` in app.json.
 * Null until that store's address is set, or in a build without the review module: the row hides.
 */
export function storeReviewUrl(): string | null {
  return reviewUrlFor(StoreReview?.storeUrl(), process.env.EXPO_OS ?? '');
}

/** Opens the store page. A tap from the learner, so it never uses up the stores' limited review sheet. */
export async function openStoreReview(url: string): Promise<void> {
  try {
    await Linking.openURL(url);
  } catch (error) {
    reportError(error, 'app', { step: 'open_store_review' });
  }
}
