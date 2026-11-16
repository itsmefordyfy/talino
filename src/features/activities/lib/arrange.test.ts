import { describe, expect, test } from '@jest/globals';

import { SAMPLE_ACTIVITIES } from '../samples';
import type { ArrangeActivity, MatchActivity } from '../types';
import { arrangeStart, matchDefinitionOrder, moveItem, swapItems } from './arrange';

const arranges = SAMPLE_ACTIVITIES.filter((a): a is ArrangeActivity => a.kind === 'arrange');
const matches = SAMPLE_ACTIVITIES.filter((a): a is MatchActivity => a.kind === 'match');

describe('arrangeStart', () => {
  test('is the same lines as the solution, shuffled, and never already solved', () => {
    expect(arranges.length).toBeGreaterThan(0);
    for (const activity of arranges) {
      const start = arrangeStart(activity);
      expect([...start].sort()).toEqual([...activity.solution].sort());
      for (const accepted of [activity.solution, ...(activity.alternatives ?? [])]) expect(start).not.toEqual(accepted);
    }
  });
  test('is deterministic', () => {
    expect(arrangeStart(arranges[0])).toEqual(arrangeStart(arranges[0]));
  });
  test('copes with repeated lines', () => {
    const repeated: ArrangeActivity = { ...arranges[0], id: 'repeat', solution: ['a', 'b', 'b', 'c'], alternatives: undefined, reasons: undefined, tests: undefined };
    const start = arrangeStart(repeated);
    expect([...start].sort()).toEqual(['a', 'b', 'b', 'c']);
    expect(start).not.toEqual(['a', 'b', 'b', 'c']);
  });
});

describe('moveItem and swapItems', () => {
  test('move shifts the others', () => {
    expect(moveItem(['a', 'b', 'c', 'd'], 0, 2)).toEqual(['b', 'c', 'a', 'd']);
    expect(moveItem(['a', 'b', 'c', 'd'], 3, 1)).toEqual(['a', 'd', 'b', 'c']);
  });
  test('moves out of range, or to the same place, change nothing', () => {
    expect(moveItem(['a', 'b'], 0, 5)).toEqual(['a', 'b']);
    expect(moveItem(['a', 'b'], -1, 0)).toEqual(['a', 'b']);
    expect(moveItem(['a', 'b'], 1, 1)).toEqual(['a', 'b']);
  });
  test('move up and down by one', () => {
    expect(moveItem(['a', 'b', 'c'], 1, 0)).toEqual(['b', 'a', 'c']);
    expect(moveItem(['a', 'b', 'c'], 1, 2)).toEqual(['a', 'c', 'b']);
  });
  test('swap exchanges two and ignores bad indexes', () => {
    expect(swapItems(['a', 'b', 'c'], 0, 2)).toEqual(['c', 'b', 'a']);
    expect(swapItems(['a', 'b', 'c'], 0, 0)).toEqual(['a', 'b', 'c']);
    expect(swapItems(['a', 'b', 'c'], 0, 9)).toEqual(['a', 'b', 'c']);
  });
  test('do not change their input', () => {
    const input = ['a', 'b', 'c'];
    moveItem(input, 0, 2);
    swapItems(input, 0, 2);
    expect(input).toEqual(['a', 'b', 'c']);
  });
});

describe('matchDefinitionOrder', () => {
  test('is a shuffled permutation of the pairs', () => {
    for (const activity of matches) {
      const order = matchDefinitionOrder(activity);
      expect([...order].sort((a, b) => a - b)).toEqual(activity.pairs.map((_, i) => i));
      expect(order).not.toEqual(activity.pairs.map((_, i) => i));
    }
  });
});
