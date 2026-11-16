import { describe, expect, test } from '@jest/globals';

import { mascotMood } from './mascot';

describe('mascotMood', () => {
  test('no pose before anything happens', () => {
    expect(mascotMood({ last: null, wrongTries: 0, hintsUsed: 0 })).toBeNull();
  });
  test('explaining while a hint is given', () => {
    expect(mascotMood({ last: 'hint', wrongTries: 1, hintsUsed: 1 })).toBe('explaining');
  });
  test('confused on a first wrong answer, determined after more', () => {
    expect(mascotMood({ last: 'wrong', wrongTries: 1, hintsUsed: 0 })).toBe('confused');
    expect(mascotMood({ last: 'wrong', wrongTries: 2, hintsUsed: 0 })).toBe('determined');
  });
  test('celebrating for a clean solve, excited otherwise', () => {
    expect(mascotMood({ last: 'solved', wrongTries: 0, hintsUsed: 0 })).toBe('celebrating');
    expect(mascotMood({ last: 'solved', wrongTries: 1, hintsUsed: 0 })).toBe('excited');
    expect(mascotMood({ last: 'solved', wrongTries: 0, hintsUsed: 1 })).toBe('excited');
  });
});
