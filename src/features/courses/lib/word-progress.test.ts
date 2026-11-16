import { describe, expect, test } from '@jest/globals';

import { activeFraction, saidOffset, saidOffsetAtTime } from './word-progress';

const text = 'A model predicts the next word, then the next, one step at a time.';

describe('saidOffset', () => {
  test('the first word is lit as soon as the sentence starts, and everything once it is over', () => {
    expect(text.slice(0, saidOffset(text, 0))).toBe('A');
    expect(saidOffset(text, 1)).toBe(text.length);
    expect(saidOffset(text, 5)).toBe(text.length);
  });

  test('moves forward through whole words only, never backward, never into the middle of a word', () => {
    let last = 0;
    for (let step = 0; step <= 100; step += 1) {
      const offset = saidOffset(text, step / 100);
      expect(offset).toBeGreaterThanOrEqual(last);
      last = offset;
      const said = text.slice(0, offset);
      expect(said === '' || said.endsWith(' ') === false).toBe(true);
      expect(text.startsWith(said)).toBe(true);
      // The offset sits at the end of a word: the next character is a space or the end.
      expect(offset === text.length || text[offset] === ' ').toBe(true);
    }
  });

  test('halfway through, about half of the words are lit; a long word takes longer than a short one', () => {
    const half = text.slice(0, saidOffset(text, 0.5)).split(' ').length;
    expect(half).toBeGreaterThanOrEqual(5);
    expect(half).toBeLessThanOrEqual(9);
    const uneven = 'a extraordinarily b';
    expect(uneven.slice(0, saidOffset(uneven, 0.03))).toBe('a');
    expect(uneven.slice(0, saidOffset(uneven, 0.5))).toBe('a extraordinarily');
    expect(saidOffset(uneven, 0.97)).toBe(uneven.length);
  });

  test('a comma adds a pause, so the words after it light a little later', () => {
    const plain = 'one two three four';
    const paused = 'one two, three four';
    const lit = (value: string) => value.slice(0, saidOffset(value, 0.5)).split(' ').length;
    expect(lit(plain)).toBe(3);
    expect(lit(paused)).toBe(2);
  });

  test('copes with nothing, odd numbers and spaces', () => {
    expect(saidOffset('', 0.5)).toBe(0);
    expect(saidOffset('   ', 0.5)).toBe(0);
    expect(saidOffset(text, Number.NaN)).toBe(0);
    expect(saidOffset(text, -3)).toBe(1);
  });
});

describe('activeFraction', () => {
  const timing = { segments: [[0, 4], [4, 10]] as const };

  test('a recording: how far the position is between the sentence’s start and end', () => {
    const base = { mode: 'recording' as const, activeSegment: 1, timing, spokenFraction: null };
    expect(activeFraction({ ...base, position: 4 })).toBe(0);
    expect(activeFraction({ ...base, position: 7 })).toBeCloseTo(0.5);
    expect(activeFraction({ ...base, position: 99 })).toBe(1);
    expect(activeFraction({ ...base, position: 1 })).toBe(0);
  });

  test('the phone voice uses its own word markers; with none, nothing is claimed', () => {
    expect(activeFraction({ mode: 'phone', activeSegment: 0, position: 0, timing: null, spokenFraction: 0.4 })).toBe(0.4);
    expect(activeFraction({ mode: 'phone', activeSegment: 0, position: 0, timing: null, spokenFraction: null })).toBeNull();
  });

  test('a live voice (one clip per sentence) uses its clip’s own playback fraction', () => {
    expect(activeFraction({ mode: 'sentences', activeSegment: 3, position: 1.5, timing: null, spokenFraction: 0.25 })).toBe(0.25);
    expect(activeFraction({ mode: 'sentences', activeSegment: 3, position: 0, timing: null, spokenFraction: null })).toBeNull();
  });

  test('no timing, no active sentence or nothing playing: unknown (the whole sentence is lit, as before)', () => {
    expect(activeFraction({ mode: 'recording', activeSegment: 0, position: 1, timing: null, spokenFraction: null })).toBeNull();
    expect(activeFraction({ mode: 'recording', activeSegment: null, position: 1, timing, spokenFraction: null })).toBeNull();
    expect(activeFraction({ mode: null, activeSegment: 0, position: 1, timing, spokenFraction: null })).toBeNull();
    expect(activeFraction({ mode: 'recording', activeSegment: 9, position: 1, timing, spokenFraction: null })).toBeNull();
  });
});

describe('saidOffsetAtTime', () => {
  const sentence = 'Kokoro says each word at its own time.';
  const starts = [10, 10.6, 11, 11.3, 11.7, 11.9, 12.1, 12.4];

  test('lights the word being spoken and every word before it, nothing after', () => {
    expect(sentence.slice(0, saidOffsetAtTime(sentence, starts, 10) as number)).toBe('Kokoro');
    expect(sentence.slice(0, saidOffsetAtTime(sentence, starts, 11.29) as number)).toBe('Kokoro says each');
    expect(sentence.slice(0, saidOffsetAtTime(sentence, starts, 11.3) as number)).toBe('Kokoro says each word');
    expect(saidOffsetAtTime(sentence, starts, 99)).toBe(sentence.length);
  });

  test('the first word is lit from the start of the sentence, even a hair early', () => {
    expect(sentence.slice(0, saidOffsetAtTime(sentence, starts, 9.9) as number)).toBe('Kokoro');
  });

  test('a long pause keeps the same word lit until the next one starts (no flicker, no skipping)', () => {
    const lit = saidOffsetAtTime(sentence, [0, 5, 5.2, 5.4, 5.6, 5.8, 6, 6.2], 4.9);
    expect(sentence.slice(0, lit as number)).toBe('Kokoro');
  });

  test('null (so the estimate is used) when there are no times or not one per word', () => {
    expect(saidOffsetAtTime(sentence, undefined, 10)).toBeNull();
    expect(saidOffsetAtTime(sentence, starts.slice(1), 10)).toBeNull();
    expect(saidOffsetAtTime('', [], 10)).toBeNull();
    expect(saidOffsetAtTime(sentence, starts, Number.NaN)).toBeNull();
  });
});
