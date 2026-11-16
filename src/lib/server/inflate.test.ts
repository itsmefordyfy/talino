import { describe, expect, test } from '@jest/globals';
import { deflateRawSync } from 'node:zlib';

import { inflateRaw } from './inflate';

describe('inflateRaw', () => {
  test('inflates what zlib deflated', async () => {
    const text = 'résumé '.repeat(500);
    const out = await inflateRaw(new Uint8Array(deflateRawSync(Buffer.from(text))));
    expect(new TextDecoder().decode(out)).toBe(text);
  });

  test('refuses output past the limit and bytes that are not deflate', async () => {
    await expect(inflateRaw(new Uint8Array(deflateRawSync(Buffer.alloc(100_000))), 1000)).rejects.toThrow();
    await expect(inflateRaw(new TextEncoder().encode('this is not deflate data at all'))).rejects.toThrow();
  });
});
