import { describe, expect, test } from '@jest/globals';

import { toBase64 } from './base64';

describe('toBase64', () => {
  test('matches the standard encoding for every length remainder', () => {
    for (const length of [0, 1, 2, 3, 4, 5, 100]) {
      const bytes = Uint8Array.from({ length }, (_, n) => (n * 37 + 11) % 256);
      expect(toBase64(bytes)).toBe(Buffer.from(bytes).toString('base64'));
    }
  });

  test('handles a file bigger than one chunk', () => {
    const bytes = Uint8Array.from({ length: 200_000 }, (_, n) => n % 256);
    expect(toBase64(bytes)).toBe(Buffer.from(bytes).toString('base64'));
  });
});
