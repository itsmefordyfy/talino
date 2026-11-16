import { describe, expect, test } from '@jest/globals';

import { COMPANIONS, companionOf, isCompanionId, nameText, withCompanionName } from './companions';

describe('companions', () => {
  test('Tali is the male coach in a male voice, Tala the female coach in a female one', () => {
    expect(COMPANIONS.tali).toMatchObject({ name: 'Tali', voice: 'am_puck' });
    expect(COMPANIONS.tala).toMatchObject({ name: 'Tala', voice: 'af_heart' });
    expect(COMPANIONS.tali.voice).not.toBe(COMPANIONS.tala.voice);
  });

  test('both are Kokoro v1 US English voices (am_ male, af_ female), named as the folders the recordings are hosted under', () => {
    // Kokoro's ids carry the accent and gender in their prefix: a (American English) + m (male) / f (female).
    expect(COMPANIONS.tali.voice).toMatch(/^am_[a-z]+$/);
    expect(COMPANIONS.tala.voice).toMatch(/^af_[a-z]+$/);
  });

  test('an unknown saved value is Tali', () => {
    expect(companionOf('tala').id).toBe('tala');
    expect(companionOf('nobody').id).toBe('tali');
    expect(companionOf(undefined).id).toBe('tali');
    expect(isCompanionId('tali')).toBe(true);
    expect(isCompanionId('Tali')).toBe(false);
  });
});

describe('nameText', () => {
  test('swaps the whole word only', () => {
    expect(nameText('Ask Tali. Tali’s tip: Talino and Taliesin stay.', 'tala')).toBe('Ask Tala. Tala’s tip: Talino and Taliesin stay.');
  });
  test('leaves Tali’s own text alone', () => {
    expect(nameText('Ask Tali', 'tali')).toBe('Ask Tali');
  });
});

describe('withCompanionName', () => {
  const table = { title: 'Meet Tali', list: ['Tali says hi', 3], nested: { line: 'Tali' }, count: (n: number) => `${n} chats with Tali`, keep: 7 };

  test('returns the table itself for Tali', () => {
    expect(withCompanionName(table, 'tali')).toBe(table);
  });

  test('swaps strings, lists, nested objects and what functions return', () => {
    const tala = withCompanionName(table, 'tala');
    expect(tala.title).toBe('Meet Tala');
    expect(tala.list).toEqual(['Tala says hi', 3]);
    expect(tala.nested.line).toBe('Tala');
    expect(tala.count(2)).toBe('2 chats with Tala');
    expect(tala.keep).toBe(7);
    expect(table.title).toBe('Meet Tali');
  });

  test('is computed once per table', () => {
    expect(withCompanionName(table, 'tala')).toBe(withCompanionName(table, 'tala'));
  });
});
