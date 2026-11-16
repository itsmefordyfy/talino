import { describe, expect, test } from '@jest/globals';

import { paragraphStarts, targetSegment } from './segment-nav';
import type { SpeechSegment } from './speech-segments';

// Two paragraphs of three and two sentences, then a tip (label + sentence) and a one-line paragraph.
const pauses: SpeechSegment['pause'][] = ['sentence', 'sentence', 'paragraph', 'sentence', 'paragraph', 'sentence', 'paragraph', 'paragraph'];
const segments: SpeechSegment[] = pauses.map((pause, index) => ({ index, unit: `u${index}`, sentence: 0, text: `Sentence number ${index} here.`, pause }));

describe('paragraphStarts', () => {
  test('a paragraph starts at the beginning and after every long pause', () => {
    expect(paragraphStarts(segments)).toEqual([0, 3, 5, 7]);
  });
});

describe('targetSegment by sentence', () => {
  test('moves one sentence on or back, and stops at either end', () => {
    expect(targetSegment(segments, 2, 1, 'sentence')).toBe(3);
    expect(targetSegment(segments, 2, -1, 'sentence')).toBe(1);
    expect(targetSegment(segments, 0, -1, 'sentence')).toBe(0);
    expect(targetSegment(segments, 7, 1, 'sentence')).toBe(7);
  });

  test('going back after a few seconds into a sentence plays it again from its start first', () => {
    expect(targetSegment(segments, 4, -1, 'sentence', { restart: true })).toBe(4);
    expect(targetSegment(segments, 4, -1, 'sentence', { restart: false })).toBe(3);
  });
});

describe('targetSegment by paragraph', () => {
  test('forward goes to the start of the next paragraph, and stays on the last', () => {
    expect(targetSegment(segments, 1, 1, 'paragraph')).toBe(3);
    expect(targetSegment(segments, 3, 1, 'paragraph')).toBe(5);
    expect(targetSegment(segments, 7, 1, 'paragraph')).toBe(7);
  });

  test('back goes to the start of this paragraph, then to the one before it', () => {
    expect(targetSegment(segments, 2, -1, 'paragraph')).toBe(0);
    expect(targetSegment(segments, 3, -1, 'paragraph')).toBe(0);
    expect(targetSegment(segments, 5, -1, 'paragraph')).toBe(3);
    expect(targetSegment(segments, 0, -1, 'paragraph')).toBe(0);
  });

  test('an out of range or missing position is treated as the start', () => {
    expect(targetSegment(segments, null, 1, 'sentence')).toBe(1);
    expect(targetSegment(segments, 99, -1, 'sentence')).toBe(6);
    expect(targetSegment([], 0, 1, 'sentence')).toBe(0);
  });
});
