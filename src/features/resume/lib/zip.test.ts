import { describe, expect, test } from '@jest/globals';
import { deflateRawSync, inflateRawSync } from 'node:zlib';

import { crc32, makeZip, readZipEntry } from './zip';

const bytes = (text: string) => new TextEncoder().encode(text);
const text = (data: Uint8Array | null) => (data ? new TextDecoder().decode(data) : null);
const inflate = (data: Uint8Array) => new Uint8Array(inflateRawSync(data));

describe('crc32', () => {
  test('matches the standard check value', () => {
    expect(crc32(bytes('123456789'))).toBe(0xcbf43926);
    expect(crc32(new Uint8Array())).toBe(0);
  });
});

describe('zip', () => {
  const files = [
    { name: 'a.txt', data: bytes('hello') },
    { name: 'dir/ünï.xml', data: bytes('<x>wörld</x>'.repeat(50)) },
  ];

  test('a stored archive is read back byte for byte', async () => {
    const zip = makeZip(files);
    expect(text(await readZipEntry(zip, 'a.txt', inflate))).toBe('hello');
    expect(text(await readZipEntry(zip, 'dir/ünï.xml', inflate))).toBe('<x>wörld</x>'.repeat(50));
    expect(await readZipEntry(zip, 'missing', inflate)).toBeNull();
  });

  test('a deflated archive is read back too (what Word writes)', async () => {
    const zip = makeZip(files, (data) => new Uint8Array(deflateRawSync(data)));
    expect(text(await readZipEntry(zip, 'dir/ünï.xml', inflate))).toBe('<x>wörld</x>'.repeat(50));
  });

  test('refuses bytes that are not a zip, a truncated one, and an entry that inflates past the limit', async () => {
    await expect(readZipEntry(bytes('not a zip at all'), 'a', inflate)).resolves.toBeNull();
    const zip = makeZip(files);
    await expect(readZipEntry(zip.slice(0, 30), 'a.txt', inflate)).resolves.toBeNull();
    const bomb = makeZip([{ name: 'a', data: new Uint8Array(2000) }], (data) => new Uint8Array(deflateRawSync(data)));
    await expect(readZipEntry(bomb, 'a', inflate, 1000)).resolves.toBeNull();
  });
});
