import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';

import { isStoreBuild, SENTRY_DSN, SENTRY_TRACES_SAMPLE_RATE } from '@/constants/monitoring';

/** Follows Expo Router screen changes, so each error shows which screen it happened on. */
export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

/**
 * Starts crash and error reporting (Sentry, adopted 2026-11-15, set up as the other apps): crashes, unhandled errors and
 * `reportError` calls. Everything the learner enters (name, answers, résumé, career notes, coach chats) stays on the phone:
 * reports carry the error, the device, the screen and the feature, never personal data.
 */
export function initMonitoring() {
  Sentry.init({
    dsn: SENTRY_DSN,
    // Store builds only (App Store, Google Play, TestFlight, made by the release scripts or EAS production): development and
    // local release-like builds never reach Sentry or its quota.
    enabled: !__DEV__ && isStoreBuild(),
    environment: 'production',
    sendDefaultPii: false,
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
    integrations: [navigationIntegration],
    // Native-only features Expo Go doesn't include.
    enableNativeFramesTracking: !isRunningInExpoGo(),
    beforeBreadcrumb(breadcrumb) {
      // Console logs can hold whatever was being debugged (answers, résumé text, chat); keep them out.
      if (breadcrumb.category === 'console') return null;
      // A tap is named by its control's accessibility label, which can hold the learner's own words.
      if (breadcrumb.category === 'touch') return { ...breadcrumb, message: 'Touch event', data: undefined };
      return breadcrumb;
    },
  });
}

/** The part of the app an error came from, as a `feature` tag to filter by in Sentry. */
export type Feature = 'app' | 'courses' | 'coach' | 'career' | 'certificates' | 'portfolio' | 'purchases' | 'notifications' | 'classes' | 'companion' | 'interview' | 'practice';

/**
 * Reports an error the app recovered from (the screen shows a message or carries on), tagged with its feature. `extra` holds
 * short, non-personal facts (an error code, a step), never what the learner typed. Development builds log it as well (Sentry is
 * off there).
 */
export function reportError(error: unknown, feature: Feature, extra?: Record<string, unknown>): void {
  if (__DEV__) console.warn(`[${feature}]`, error instanceof Error ? error.message : String(error), extra ?? '');
  Sentry.captureException(error instanceof Error ? error : new Error(String(error)), { tags: { feature }, extra });
}

export { Sentry };
