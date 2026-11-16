import { describe, expect, test } from '@jest/globals';

import { followPlace, followTarget } from './follow-zone';

// A 800 px tall reading area. Comfortable: from 128 px (clear of the header) down to 560 px.
const height = 800;

describe('followPlace', () => {
  test('a part in the middle of the screen is comfortable: nothing needs to move', () => {
    expect(followPlace({ top: 300, bottom: 380, height })).toBe('comfortable');
    expect(followPlace({ top: 128, bottom: 200, height })).toBe('comfortable');
    expect(followPlace({ top: 480, bottom: 560, height })).toBe('comfortable');
  });

  test('a part near the bottom or the top edge is visible but not comfortable', () => {
    expect(followPlace({ top: 600, bottom: 680, height })).toBe('visible');
    expect(followPlace({ top: 20, bottom: 100, height })).toBe('visible');
    // Only its end is still on screen.
    expect(followPlace({ top: -60, bottom: 40, height })).toBe('visible');
  });

  test('a part wholly off screen is hidden', () => {
    expect(followPlace({ top: 900, bottom: 980, height })).toBe('hidden');
    expect(followPlace({ top: -300, bottom: -200, height })).toBe('hidden');
  });

  test('a part taller than the comfortable zone is comfortable while its start is in the upper half', () => {
    expect(followPlace({ top: 150, bottom: 700, height })).toBe('comfortable');
    expect(followPlace({ top: 500, bottom: 1100, height })).toBe('visible');
  });
});

describe('followTarget', () => {
  test('puts the part a little above the middle of the screen', () => {
    expect(followTarget({ offset: 1000, top: 700, bottom: 780, height })).toBe(1000 + 700 - 288);
  });

  test('never scrolls above the start of the content', () => {
    expect(followTarget({ offset: 0, top: 100, bottom: 180, height })).toBe(0);
    expect(followTarget({ offset: 50, top: 100, bottom: 180, height })).toBe(0);
  });

  test('a part taller than the zone is aligned by its start, near the top', () => {
    expect(followTarget({ offset: 500, top: 900, bottom: 1700, height })).toBe(500 + 900 - 160);
  });
});
