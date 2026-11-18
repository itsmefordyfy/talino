import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { addStudyMs, flushStudy, getStudiedMs, resetStudyClockForTests, subscribeStudy } from './study-clock';

const mockStore = new Map<string, string>();
jest.mock('expo-sqlite/kv-store', () => ({
  __esModule: true,
  default: {
    getItemSync: (key: string) => mockStore.get(key) ?? null,
    setItemAsync: (key: string, value: string) => {
      mockStore.set(key, value);
      return Promise.resolve();
    },
  },
}));

describe('study clock', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 10, 18, 10, 0, 0));
    mockStore.clear();
    resetStudyClockForTests();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test('adds up today’s time and tells listeners', () => {
    const heard = jest.fn();
    const stop = subscribeStudy(heard);
    addStudyMs(1_000);
    addStudyMs(2_000);
    expect(getStudiedMs()).toBe(3_000);
    expect(heard).toHaveBeenCalledTimes(2);
    stop();
    addStudyMs(1_000);
    expect(heard).toHaveBeenCalledTimes(2);
  });

  test('ignores zero, negative and nonsense', () => {
    addStudyMs(0);
    addStudyMs(-5);
    addStudyMs(Number.NaN);
    expect(getStudiedMs()).toBe(0);
  });

  test('saves when asked and reads the same day back after a restart', () => {
    addStudyMs(90_000);
    flushStudy();
    expect(JSON.parse(mockStore.get('study-time:v1') ?? 'null')).toEqual({ day: '2026-11-18', ms: 90_000 });
    resetStudyClockForTests();
    expect(getStudiedMs()).toBe(90_000);
  });

  test('a saved day from yesterday reads as zero and today starts fresh', () => {
    mockStore.set('study-time:v1', JSON.stringify({ day: '2026-11-17', ms: 30 * 60_000 }));
    expect(getStudiedMs()).toBe(0);
    addStudyMs(1_000);
    expect(getStudiedMs()).toBe(1_000);
  });

  test('midnight passing starts a new day without a restart', () => {
    addStudyMs(10 * 60_000);
    expect(getStudiedMs()).toBe(10 * 60_000);
    jest.setSystemTime(new Date(2026, 10, 19, 0, 0, 5));
    expect(getStudiedMs()).toBe(0);
    addStudyMs(2_000);
    expect(getStudiedMs()).toBe(2_000);
  });
});
