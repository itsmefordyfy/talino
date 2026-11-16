import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { openPaywall } from './open-paywall';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({ router: { push: (arg: unknown) => mockPush(arg) } }));

beforeEach(() => {
  mockPush.mockClear();
});

describe('openPaywall', () => {
  test('always opens the app’s own paywall, keeping the reason', () => {
    openPaywall('tali');
    openPaywall('kit');
    openPaywall();
    expect(mockPush.mock.calls.map((call) => call[0])).toEqual([
      { pathname: '/paywall', params: { reason: 'tali' } },
      { pathname: '/paywall', params: { reason: 'kit' } },
      { pathname: '/paywall', params: { reason: 'default' } },
    ]);
  });

  test('an unknown reason falls back to the default headline', () => {
    openPaywall('nonsense' as never);
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/paywall', params: { reason: 'default' } });
  });
});
