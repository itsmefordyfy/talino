import { describe, expect, test } from '@jest/globals';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Read as text: the component itself needs native image and animation modules.
const source = readFileSync(join(__dirname, 'tali.tsx'), 'utf8');
const folder = join(__dirname, '../../../assets/images/tali');
const poses = [...source.matchAll(/^ {2}(\w+): require\('@\/assets\/images\/tali\/([\w-]+)\.webp'\),$/gm)].map(([, mood, file]) => ({ mood, file }));

describe('Tali poses', () => {
  test('lists all twenty poses from the character sheet', () => {
    expect(poses).toHaveLength(20);
    expect(new Set(poses.map((pose) => pose.file)).size).toBe(20);
  });

  test('every pose has its picture, named after the mood', () => {
    for (const { mood, file } of poses) {
      expect(file).toBe(mood.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`));
      expect(existsSync(join(__dirname, '../../../assets/images/tali', `${file}.webp`))).toBe(true);
    }
  });

  test('the folder holds those pictures and no others', () => {
    expect(readdirSync(folder).filter((name) => !name.startsWith('.')).sort()).toEqual(poses.map((pose) => `${pose.file}.webp`).sort());
  });

  // Lossless: a lossy re-save would soften the outlines and the eyes, and smear the clean edge into a halo on dark screens.
  test('every picture is lossless WebP with transparency', () => {
    for (const { file } of poses) {
      const bytes = readFileSync(join(folder, `${file}.webp`));
      expect(bytes.toString('latin1', 0, 4)).toBe('RIFF');
      expect(bytes.toString('latin1', 12, 16)).toBe('VP8L');
      // VP8L header: the bit after the 14-bit width and height says the picture has alpha.
      expect((bytes[24] >> 4) & 1).toBe(1);
    }
  });
});

describe('Tala poses', () => {
  const talaFolder = join(__dirname, '../../../assets/images/tala');
  const talaPoses = [...source.matchAll(/^ {2}(\w+): require\('@\/assets\/images\/tala\/([\w-]+)\.webp'\),$/gm)].map(([, mood, file]) => ({ mood, file }));

  test('has the same twenty poses as Tali, in the same order', () => {
    expect(talaPoses.map((pose) => pose.mood)).toEqual(poses.map((pose) => pose.mood));
  });

  test('every pose has its picture, and the folder holds those and no others', () => {
    for (const { mood, file } of talaPoses) {
      expect(file).toBe(mood);
      expect(existsSync(join(talaFolder, `${file}.webp`))).toBe(true);
    }
    expect(readdirSync(talaFolder).filter((name) => !name.startsWith('.')).sort()).toEqual(talaPoses.map((pose) => `${pose.file}.webp`).sort());
  });

  test('every picture is lossless WebP with transparency on one square canvas', () => {
    const sides = new Set<string>();
    for (const { file } of talaPoses) {
      const bytes = readFileSync(join(talaFolder, `${file}.webp`));
      expect(bytes.toString('latin1', 0, 4)).toBe('RIFF');
      expect(bytes.toString('latin1', 12, 16)).toBe('VP8L');
      expect((bytes[24] >> 4) & 1).toBe(1);
      // VP8L: 14 bits of width-1 then 14 bits of height-1, little-endian from byte 21.
      const bits = bytes.readUInt32LE(21);
      sides.add(`${(bits & 0x3fff) + 1}x${((bits >> 14) & 0x3fff) + 1}`);
    }
    expect([...sides]).toEqual(['984x984']);
  });

  test('the tight crop for Tala matches her canvas (328 px, 104 rows of air)', () => {
    expect(source).toMatch(/tala: \{ side: 328, cropTop: 104 \}/);
  });
});
