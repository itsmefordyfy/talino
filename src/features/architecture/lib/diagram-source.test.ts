import { describe, expect, test } from '@jest/globals';

import { evaluateSource, normalizeTyping } from './diagram-source';

describe('evaluateSource', () => {
  test('valid text is the drawn text', () => {
    expect(evaluateSource('flowchart TD\n A --> B', null)).toEqual({ source: 'flowchart TD\n A --> B', errors: [], goodSource: 'flowchart TD\n A --> B' });
  });

  test('invalid text keeps the last good drawing and carries the parser line-numbered messages', () => {
    const view = evaluateSource('flowchart TD\n A --> B\n B -- C', 'flowchart TD\n A --> B');
    expect(view.goodSource).toBe('flowchart TD\n A --> B');
    expect(view.errors).toHaveLength(1);
    expect(view.errors[0]).toMatch(/^Line 3:/);
  });

  test('invalid text with nothing good before it has no drawing', () => {
    expect(evaluateSource('nonsense', null)).toMatchObject({ goodSource: null, errors: [expect.stringContaining('supported')] });
  });

  test('blank text clears the drawing and is not an error', () => {
    expect(evaluateSource('  \n ', 'flowchart TD\n A --> B')).toEqual({ source: '  \n ', errors: [], goodSource: null });
  });
});

describe('normalizeTyping', () => {
  test('puts plain quotes, dashes and spaces back so keyboard "smart" characters do not break a diagram', () => {
    expect(normalizeTyping('Person(a, “Owner”)')).toBe('Person(a, "Owner")');
    expect(normalizeTyping('it’s a – b c…')).toBe("it's a - b c...");
    expect(normalizeTyping('flowchart TD\n A --> B')).toBe('flowchart TD\n A --> B');
  });
});
