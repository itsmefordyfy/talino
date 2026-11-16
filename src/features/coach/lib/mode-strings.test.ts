import { describe, expect, test } from '@jest/globals';

import { allModes, modeInfo } from './modes';

describe('Tali modes in Tagalog', () => {
  test('every mode has a Tagalog label and description, and ids and courses never change', () => {
    const en = allModes('en');
    const fil = allModes('fil');
    expect(fil.map((mode) => [mode.id, mode.courseId, mode.icon])).toEqual(en.map((mode) => [mode.id, mode.courseId, mode.icon]));
    for (const [index, mode] of fil.entries()) {
      expect(mode.description).not.toBe(en[index].description);
      expect(mode.label.length).toBeGreaterThan(0);
    }
  });

  test('English stays the default, which the model prompt uses', () => {
    expect(modeInfo('general')?.description).toMatch(/^Your AI career/);
    expect(modeInfo('general', 'fil')?.description).toMatch(/^Ang AI career/);
  });
});
