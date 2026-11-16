import { describe, expect, test } from '@jest/globals';

import { isOnline } from './network';

describe('isOnline', () => {
  test('is online when the phone says so', () => {
    expect(isOnline({ isConnected: true, isInternetReachable: true })).toBe(true);
  });

  test('is offline when not connected, or connected with no internet', () => {
    expect(isOnline({ isConnected: false, isInternetReachable: false })).toBe(false);
    expect(isOnline({ isConnected: true, isInternetReachable: false })).toBe(false);
    expect(isOnline({ isConnected: false })).toBe(false);
  });

  test('an unknown state is not treated as offline', () => {
    expect(isOnline({})).toBe(true);
    expect(isOnline({ isConnected: true, isInternetReachable: undefined })).toBe(true);
  });
});
