import { describe, expect, test } from '@jest/globals';

import { chunkForSpeech } from './speech-chunks';

describe('chunkForSpeech', () => {
  test('short text stays whole, with blank lines dropped', () => {
    expect(chunkForSpeech('One.\n\nTwo.\nThree.', 100)).toEqual(['One.\nTwo.\nThree.']);
    expect(chunkForSpeech('   ')).toEqual([]);
  });

  test('no chunk is over the limit and nothing is lost', () => {
    const text = Array.from({ length: 60 }, (_, index) => `Sentence number ${index} says something fairly ordinary.`).join(' ');
    const chunks = chunkForSpeech(text, 200);
    expect(chunks.length).toBeGreaterThan(5);
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(200);
    expect(chunks.join(' ').replace(/\s+/g, ' ')).toBe(text);
  });

  test('cuts at sentence ends, and a run with no spaces is cut hard rather than dropped', () => {
    const chunks = chunkForSpeech(`${'Alpha beta gamma. '.repeat(20)}`, 100);
    for (const chunk of chunks) expect(chunk.endsWith('.')).toBe(true);
    const blob = 'x'.repeat(260);
    const hard = chunkForSpeech(blob, 100);
    expect(hard.join('')).toBe(blob);
    expect(Math.max(...hard.map((chunk) => chunk.length))).toBeLessThanOrEqual(100);
  });

  test('packs short lines together up to the limit', () => {
    const chunks = chunkForSpeech(['aaaa', 'bbbb', 'cccc', 'dddd'].join('\n'), 60);
    expect(chunks).toEqual(['aaaa\nbbbb\ncccc\ndddd']);
    expect(chunkForSpeech(['a'.repeat(40), 'b'.repeat(40)].join('\n'), 60)).toHaveLength(2);
  });
});
