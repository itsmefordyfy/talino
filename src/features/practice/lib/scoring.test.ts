import { describe, expect, test } from '@jest/globals';

import { averageScore, parseCriteria, quoteAppears, ratingFor } from './scoring';

describe('ratingFor', () => {
  test('words for the overall score', () => {
    expect([95, 85, 84, 70, 69, 50, 49, 0].map(ratingFor)).toEqual(['excellent', 'excellent', 'good', 'good', 'fair', 'fair', 'needs_improvement', 'needs_improvement']);
  });
});

describe('parseCriteria', () => {
  const allowed = ['clarity', 'tone', 'accountability'] as const;
  const entry = (id: string, score: unknown = 70, reason: unknown = 'Because.') => ({ id, score, reason });

  test('scores exactly the named criteria, in the scenario’s order, clamped to 0-100', () => {
    const result = parseCriteria([entry('accountability', 120), entry('clarity', 55.4), entry('tone', -5)], allowed);
    expect(result).toEqual([
      { id: 'clarity', score: 55, reason: 'Because.' },
      { id: 'tone', score: 0, reason: 'Because.' },
      { id: 'accountability', score: 100, reason: 'Because.' },
    ]);
  });

  test('a criterion the item does not name is ignored, never scored', () => {
    const result = parseCriteria([entry('clarity'), entry('tone'), entry('accountability'), entry('grammar', 10)], allowed);
    expect(result?.map((criterion) => criterion.id)).toEqual(['clarity', 'tone', 'accountability']);
  });

  test('every named criterion needs a score and a reason, once', () => {
    expect(parseCriteria([entry('clarity'), entry('tone')], allowed)).toBeNull();
    expect(parseCriteria([entry('clarity'), entry('tone'), entry('accountability', 'high')], allowed)).toBeNull();
    expect(parseCriteria([entry('clarity'), entry('tone'), entry('accountability', 70, '  ')], allowed)).toBeNull();
    expect(parseCriteria([entry('clarity'), entry('clarity', 10), entry('tone'), entry('accountability')], allowed)?.[0].score).toBe(70);
    expect(parseCriteria('nope', allowed)).toBeNull();
  });
});

describe('averageScore', () => {
  test('is the rounded mean, never a number of its own', () => {
    expect(averageScore([{ id: 'clarity', score: 70, reason: '' }, { id: 'tone', score: 55, reason: '' }])).toBe(63);
  });
});

describe('quoteAppears', () => {
  const lines = ['Hi Dana, I’m sorry the draft is late. I underestimated the checkout page.', 'I can send the full draft by Friday at noon!'];

  test('finds the learner’s words whatever the case, quotes and punctuation', () => {
    expect(quoteAppears('"I\'m sorry the draft is late"', lines)).toBe(true);
    expect(quoteAppears('i underestimated the CHECKOUT page', lines)).toBe(true);
    expect(quoteAppears('by Friday at noon', lines)).toBe(true);
  });

  test('allows an ellipsis between two pieces that were really said', () => {
    expect(quoteAppears('I’m sorry … by Friday at noon', lines)).toBe(true);
    expect(quoteAppears("I'm sorry... the checkout page", lines)).toBe(true);
    expect(quoteAppears('I’m sorry … by Monday morning', lines)).toBe(false);
  });

  test('refuses words that were never said, and quotes that are too short to mean anything', () => {
    expect(quoteAppears('I take full responsibility', lines)).toBe(false);
    expect(quoteAppears('I', lines)).toBe(false);
    expect(quoteAppears('   ', lines)).toBe(false);
  });

  test('a quote cannot span two separate messages', () => {
    expect(quoteAppears('the checkout page I can send', lines)).toBe(false);
  });
});
