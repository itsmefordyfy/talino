import { describe, expect, test } from '@jest/globals';

import { availableHints, nextHint, shouldOfferHint, shownHints } from './hints';

const hints = ['gentle', 'middle', 'closer', 'nearly the answer'];

describe('availableHints', () => {
  test('guided and standard see every hint, independent only the last two', () => {
    expect(availableHints(hints, 'guided')).toEqual(hints);
    expect(availableHints(hints, 'standard')).toEqual(hints);
    expect(availableHints(hints, 'independent')).toEqual(['closer', 'nearly the answer']);
  });
  test('independent with one hint keeps it', () => {
    expect(availableHints(['only'], 'independent')).toEqual(['only']);
  });
});

describe('nextHint', () => {
  test('goes strictly in order, one at a time, and the last hint comes last', () => {
    const seen: string[] = [];
    for (let used = 0; used < hints.length; used += 1) {
      const hint = nextHint(hints, 'standard', used);
      expect(hint).not.toBeNull();
      expect(hint?.number).toBe(used + 1);
      expect(hint?.total).toBe(4);
      expect(hint?.isLast).toBe(used === 3);
      seen.push(hint?.text ?? '');
    }
    expect(seen).toEqual(hints);
    expect(seen.indexOf('nearly the answer')).toBe(3);
  });
  test('the answer-like final hint never appears before the others, in any guidance', () => {
    for (const guidance of ['guided', 'standard', 'independent'] as const) {
      const total = availableHints(hints, guidance).length;
      for (let used = 0; used < total - 1; used += 1) expect(nextHint(hints, guidance, used)?.text).not.toBe('nearly the answer');
    }
  });
  test('is null when none are left or there are no hints', () => {
    expect(nextHint(hints, 'standard', 4)).toBeNull();
    expect(nextHint(hints, 'independent', 2)).toBeNull();
    expect(nextHint([], 'guided', 0)).toBeNull();
  });
  test('independent starts at the second-to-last hint', () => {
    const first = nextHint(hints, 'independent', 0);
    expect(first).toMatchObject({ text: 'closer', number: 1, total: 2, isLast: false });
  });
  test('negative use counts as none', () => {
    expect(nextHint(hints, 'standard', -3)?.text).toBe('gentle');
  });
});

describe('shownHints', () => {
  test('returns the ones used so far', () => {
    expect(shownHints(hints, 'standard', 2)).toEqual(['gentle', 'middle']);
    expect(shownHints(hints, 'independent', 1)).toEqual(['closer']);
    expect(shownHints(hints, 'standard', 0)).toEqual([]);
  });
});

describe('shouldOfferHint', () => {
  test('guided is offered a hint after two wrong tries, once', () => {
    expect(shouldOfferHint('guided', 1, 0, hints)).toBe(false);
    expect(shouldOfferHint('guided', 2, 0, hints)).toBe(true);
    expect(shouldOfferHint('guided', 5, 0, hints)).toBe(true);
    expect(shouldOfferHint('guided', 2, 1, hints)).toBe(false);
  });
  test('standard and independent are never offered one', () => {
    expect(shouldOfferHint('standard', 9, 0, hints)).toBe(false);
    expect(shouldOfferHint('independent', 9, 0, hints)).toBe(false);
  });
  test('nothing to offer without hints', () => {
    expect(shouldOfferHint('guided', 3, 0, [])).toBe(false);
  });
});
