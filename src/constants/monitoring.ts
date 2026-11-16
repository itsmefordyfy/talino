/**
 * Where crash and error reports go (Sentry, project talino, organization fordytech-solutions; owner's setup 2026-11-15).
 * A DSN only lets an app send events, so it's safe to ship in the app; the auth token that uploads source maps is not,
 * and lives only in the build environment (.env.sentry-build-plugin, gitignored).
 */
export const SENTRY_DSN =
  process.env.EXPO_PUBLIC_SENTRY_DSN ??
  'https://b5319ca3cc2e113e6b6e92b2b8de0600@o4512190137303040.ingest.us.sentry.io/4512431509405696';

/**
 * Share of sessions whose performance (screen loads, slow frames) is sampled; errors are always sent. Above zero also
 * because Sentry names the screen an error happened on from these traces.
 */
export const SENTRY_TRACES_SAMPLE_RATE = 0.2;

/**
 * `store-build-<build number>` in a build for the stores, set only by the release scripts (scripts/release-*.mjs) and EAS
 * production (eas.json); empty everywhere else. Sentry reports only from such a build: development runs and local
 * release-like builds (`ios:prod`, `android:prod`) never do (as in the other apps, owner's call 2026-10-19).
 */
export const STORE_BUILD = process.env.EXPO_PUBLIC_STORE_BUILD ?? '';

export const isStoreBuild = (): boolean => STORE_BUILD.startsWith('store-build-');
