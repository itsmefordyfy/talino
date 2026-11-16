import { describe, expect, test } from '@jest/globals';

import { isStoreBuild, SENTRY_DSN } from './monitoring';

describe('Sentry setup', () => {
  test('the DSN is the talino project’s (an app can send events with it, nothing more)', () => {
    expect(SENTRY_DSN).toMatch(/^https:\/\/[0-9a-f]{32}@o\d+\.ingest\.us\.sentry\.io\/4512431509405696$/);
  });

  test('reports only come from a store build, never from development or a local release-like build', () => {
    expect(isStoreBuild()).toBe(false); // the test run sets no EXPO_PUBLIC_STORE_BUILD
  });
});
