import { describe, expect, test } from '@jest/globals';

import { cutShortNote, trimTurns, wasCutShort } from './history';

describe('trimTurns', () => {
  test('a chat that fits goes whole', () => {
    expect(trimTurns([1, 2, 3], 16)).toEqual([1, 2, 3]);
  });

  test('a long chat keeps its first message and the latest ones, never more than the limit', () => {
    const turns = Array.from({ length: 40 }, (_, index) => index);
    const kept = trimTurns(turns, 16);
    expect(kept).toHaveLength(16);
    expect(kept[0]).toBe(0);
    expect(kept.slice(1)).toEqual(turns.slice(-15));
  });
});

describe('a reply cut off for length', () => {
  test('is recognised and says so in the learner’s language', () => {
    expect(wasCutShort('MAX_TOKENS')).toBe(true);
    expect(wasCutShort('STOP')).toBe(false);
    expect(wasCutShort(undefined)).toBe(false);
    expect(cutShortNote('en')).toContain('continue');
    expect(cutShortNote('fil')).toContain('Naputol');
  });
});
