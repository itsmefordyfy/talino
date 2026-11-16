import { describe, expect, test } from '@jest/globals';

import { buildCheckoutSteps, computeCharge, IMPLS } from './abstraction';

const last = <T>(items: readonly T[]) => items[items.length - 1]!;

describe('abstraction', () => {
  test('each concrete class charges in its own way', () => {
    expect(computeCharge('card', 100)).toBe(100);
    expect(computeCharge('wallet', 100)).toBe(102);
    expect(computeCharge('wallet', 33)).toBe(33.66);
    expect(computeCharge('cash', 99.6)).toBe(100);
    expect(computeCharge('cash', 99.4)).toBe(99);
  });

  test('a working implementation goes start, create, call, run, result', () => {
    for (const impl of ['card', 'wallet', 'cash'] as const) {
      const steps = buildCheckoutSteps(impl, 50);
      expect(steps.map((step) => step.stage)).toEqual(['start', 'create', 'call', 'run', 'result']);
      expect(last(steps).charged).toBe(computeCharge(impl, 50));
      expect(last(steps).failed).toBe(false);
    }
  });

  test('the abstract type cannot be created and a class missing pay() is refused', () => {
    for (const impl of ['abstract', 'broken'] as const) {
      const steps = buildCheckoutSteps(impl, 50);
      expect(steps.map((step) => step.stage)).toEqual(['start', 'error']);
      expect(last(steps).failed).toBe(true);
      expect(last(steps).charged).toBeNull();
    }
  });

  test('every implementation produces steps, and the checkout code never changes', () => {
    for (const impl of IMPLS) expect(buildCheckoutSteps(impl, 10).length).toBeGreaterThan(1);
    expect(buildCheckoutSteps('card', 10)[0]?.caption).toBe(buildCheckoutSteps('wallet', 99)[0]?.caption);
  });
});
