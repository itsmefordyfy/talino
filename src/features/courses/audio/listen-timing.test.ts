import { describe, expect, test } from '@jest/globals';

import { parseTiming, resumePoint, segmentAtTime, timingMatches, timingUrl, wordAtTime, type ListenTiming } from './listen-timing';

const timing: ListenTiming = {
  hash: 'abcdef12',
  duration: 20,
  segments: [
    [0, 2],
    [2.5, 5],
    [5.15, 9],
    [9.6, 12],
    [12.15, 20],
  ],
};

describe('parseTiming', () => {
  const file = { v: 1, hash: 'abcdef12', duration: 20, segments: timing.segments };

  test('reads a good file', () => {
    expect(parseTiming(file)).toEqual(timing);
  });

  test.each([
    ['not an object', 'text'],
    ['an unknown version', { ...file, v: 2 }],
    ['a bad hash', { ...file, hash: 'xyz' }],
    ['no length', { ...file, duration: 0 }],
    ['no segments', { ...file, segments: [] }],
    ['a segment that ends before it starts', { ...file, segments: [[3, 1]] }],
    ['segments out of order', { ...file, segments: [[5, 6], [2, 3]] }],
    ['a time past the end of the audio', { ...file, segments: [[0, 99]] }],
    ['a number that is not a number', { ...file, segments: [[0, null]] }],
    ['a pair with three numbers', { ...file, segments: [[0, 1, 2]] }],
  ])('refuses %s', (_name, value) => {
    expect(parseTiming(value)).toBeNull();
  });
});

describe('timingMatches', () => {
  test('needs the same words and the same number of segments', () => {
    expect(timingMatches(timing, { hash: 'abcdef12', count: 5 })).toBe(true);
    expect(timingMatches(timing, { hash: 'abcdef12', count: 6 })).toBe(false);
    expect(timingMatches(timing, { hash: '00000000', count: 5 })).toBe(false);
  });

  test('and a recording about as long as the one it was made for', () => {
    expect(timingMatches(timing, { hash: 'abcdef12', count: 5, audioDuration: 20.4 })).toBe(true);
    expect(timingMatches(timing, { hash: 'abcdef12', count: 5, audioDuration: 23 })).toBe(false);
    // The player does not know the length yet: nothing to contradict.
    expect(timingMatches(timing, { hash: 'abcdef12', count: 5, audioDuration: 0 })).toBe(true);
  });
});

describe('segmentAtTime', () => {
  test('is the segment whose start has been reached', () => {
    expect(segmentAtTime(timing, 0)).toBe(0);
    expect(segmentAtTime(timing, 1.99)).toBe(0);
    expect(segmentAtTime(timing, 2.5)).toBe(1);
    expect(segmentAtTime(timing, 9.59)).toBe(2);
    expect(segmentAtTime(timing, 9.6)).toBe(3);
    expect(segmentAtTime(timing, 19.9)).toBe(4);
  });

  test('stays on the sentence just spoken through the pause after it', () => {
    expect(segmentAtTime(timing, 2.2)).toBe(0);
    expect(segmentAtTime(timing, 12.1)).toBe(3);
  });

  test('is the first segment before anything starts and the last after everything ends, and never throws on odd times', () => {
    expect(segmentAtTime({ ...timing, segments: [[1, 2], [3, 4]] }, 0.2)).toBe(0);
    expect(segmentAtTime(timing, 500)).toBe(4);
    expect(segmentAtTime(timing, -3)).toBe(0);
    expect(segmentAtTime(timing, Number.NaN)).toBe(0);
  });
});

describe('timingUrl', () => {
  test('sits next to the recording', () => {
    expect(timingUrl('https://audio.example.com/', 'dev-01', { voice: 'am_puck' })).toBe('https://audio.example.com/am_puck/dev-01.timing.json');
    expect(timingUrl(undefined, 'dev-01')).toBeNull();
    expect(timingUrl('http://evil.example.com', 'dev-01')).toBeNull();
  });
});

describe('resumePoint', () => {
  const saved = { segment: 12, time: 95.5, hash: 'abcdef12' };

  test('carries on where the learner stopped', () => {
    expect(resumePoint(saved, { hash: 'abcdef12', count: 40 })).toEqual({ segment: 12, time: 95.5 });
  });

  test('starts over when the lesson changed, nothing was saved, or the learner had barely begun or had finished', () => {
    expect(resumePoint(saved, { hash: 'ffffffff', count: 40 })).toBeNull();
    expect(resumePoint(null, { hash: 'abcdef12', count: 40 })).toBeNull();
    expect(resumePoint({ ...saved, segment: 0, time: 1 }, { hash: 'abcdef12', count: 40 })).toBeNull();
    expect(resumePoint({ ...saved, segment: 39, time: 400 }, { hash: 'abcdef12', count: 40 })).toBeNull();
    expect(resumePoint({ ...saved, segment: 45 }, { hash: 'abcdef12', count: 40 })).toBeNull();
  });

  test('a recording without timing carries on by seconds alone', () => {
    expect(resumePoint({ segment: 0, time: 95, hash: 'abcdef12' }, { hash: 'abcdef12', count: 40 })).toEqual({ segment: 0, time: 95 });
  });

  test('backs up a little so the learner hears the sentence they were in from its start', () => {
    expect(resumePoint({ segment: 12, time: 95.5, hash: 'abcdef12' }, { hash: 'abcdef12', count: 40, segmentStart: 93 })).toEqual({ segment: 12, time: 93 });
  });
});

describe('word times', () => {
  const file = { v: 1, hash: 'abcdef12', duration: 20, segments: timing.segments };
  const words = [[0, 0.5, 1.2], [2.5, 3], [5.15, 6, 7, 8.5], [9.6], [12.15, 13, 14]];

  test('a file with one list of word starts per segment keeps them', () => {
    expect(parseTiming({ ...file, words })?.words).toEqual(words);
  });

  test.each([
    ['one list too few', words.slice(1)],
    ['not lists', words.map(() => 'x')],
    ['words out of order', [[0, 2, 1], ...words.slice(1)]],
    ['a time that is not a number', [[0, null], ...words.slice(1)]],
    ['a time past the end', [[0, 99], ...words.slice(1)]],
  ])('drops malformed word times (%s) but keeps the sentence timing', (_name, bad) => {
    const parsed = parseTiming({ ...file, words: bad });
    expect(parsed).not.toBeNull();
    expect(parsed?.words).toBeUndefined();
    expect(parsed?.segments).toEqual(timing.segments);
  });

  test('wordAtTime: the last word whose start has been reached; the first before any; null with no word times', () => {
    const withWords = { words };
    expect(wordAtTime(withWords, 2, 5)).toBe(0);
    expect(wordAtTime(withWords, 2, 5.15)).toBe(0);
    expect(wordAtTime(withWords, 2, 6.9)).toBe(1);
    expect(wordAtTime(withWords, 2, 7)).toBe(2);
    expect(wordAtTime(withWords, 2, 99)).toBe(3);
    expect(wordAtTime(withWords, 9, 1)).toBeNull();
    expect(wordAtTime({}, 0, 1)).toBeNull();
    expect(wordAtTime(withWords, 0, Number.NaN)).toBeNull();
  });
});
