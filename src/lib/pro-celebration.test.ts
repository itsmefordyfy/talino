import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { celebratePro, celebrateProAfterClose, currentProCelebration, endProCelebration, SHEET_CLOSE_MS } from './pro-celebration';

beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  endProCelebration();
  jest.useRealTimers();
});

describe('pro celebration', () => {
  test('starts with none showing; each celebration is a new number; ending clears it', () => {
    expect(currentProCelebration()).toBe(0);
    celebratePro();
    const first = currentProCelebration();
    expect(first).toBeGreaterThan(0);
    celebratePro();
    expect(currentProCelebration()).toBeGreaterThan(first);
    endProCelebration();
    expect(currentProCelebration()).toBe(0);
  });

  test('after the paywall closes: nothing until the sheet has slid away, then the celebration', () => {
    celebrateProAfterClose();
    jest.advanceTimersByTime(SHEET_CLOSE_MS - 1);
    expect(currentProCelebration()).toBe(0);
    jest.advanceTimersByTime(1);
    expect(currentProCelebration()).toBeGreaterThan(0);
  });
});
