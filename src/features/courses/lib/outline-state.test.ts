import { describe, expect, test } from '@jest/globals';

import { outlineRowInert, outlineRowState } from './outline-state';

describe('outlineRowState', () => {
  test('the open lesson is current, whatever its progress', () => {
    expect(outlineRowState('done', true)).toBe('current');
    expect(outlineRowState('next', true)).toBe('current');
    expect(outlineRowState('locked', true)).toBe('current');
  });
  test('other lessons keep their progress state', () => {
    expect(outlineRowState('done', false)).toBe('done');
    expect(outlineRowState('next', false)).toBe('next');
    expect(outlineRowState('locked', false)).toBe('locked');
  });
});

describe('outlineRowInert', () => {
  test('a lesson not reachable yet does nothing in an owned course', () => {
    expect(outlineRowInert('locked', false, true)).toBe(true);
  });
  test('in a course the learner does not own the row still opens the paywall', () => {
    expect(outlineRowInert('locked', false, false)).toBe(false);
  });
  test('the open lesson does nothing', () => {
    expect(outlineRowInert('done', true, true)).toBe(true);
  });
  test('a finished or next lesson is pressable', () => {
    expect(outlineRowInert('done', false, true)).toBe(false);
    expect(outlineRowInert('next', false, true)).toBe(false);
  });
});
