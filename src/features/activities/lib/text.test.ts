import { describe, expect, test } from '@jest/globals';

import { countBlanks, fillBlanks, formatValue, hashString, insertAtSelection, isKebabCase, normalizeCode, normalizeOutput, parseInlineText, replaceLine, stripInlineMarkup, seededRandom, shuffledIndexes, splitBlanks } from './text';

describe('normalizeOutput', () => {
  test('ignores line endings, trailing spaces and surrounding blank lines', () => {
    expect(normalizeOutput('a  \r\nb\r\n\r\n')).toBe('a\nb');
    expect(normalizeOutput('\n\n3\n')).toBe('3');
  });
  test('keeps inner blank lines and leading spaces', () => {
    expect(normalizeOutput('a\n\n  b')).toBe('a\n\n  b');
  });
});

describe('normalizeCode', () => {
  test('trims and collapses spaces', () => {
    expect(normalizeCode('  if   (x >=  1) {  ')).toBe('if (x >= 1) {');
  });
});

describe('isKebabCase', () => {
  test('accepts kebab-case and rejects the rest', () => {
    expect(isKebabCase('predict-loop-2')).toBe(true);
    for (const bad of ['', 'Predict', 'a_b', 'a--b', '-a', 'a-', 'a b']) expect(isKebabCase(bad)).toBe(false);
  });
});

describe('formatValue', () => {
  test('writes values the way a learner would', () => {
    expect(formatValue('hi')).toBe('"hi"');
    expect(formatValue(3)).toBe('3');
    expect(formatValue(NaN)).toBe('NaN');
    expect(formatValue(-Infinity)).toBe('-Infinity');
    expect(formatValue(undefined)).toBe('undefined');
    expect(formatValue(null)).toBe('null');
    expect(formatValue([1, 'a'])).toBe('[1,"a"]');
    expect(formatValue({ a: 1 })).toBe('{"a":1}');
    expect(formatValue(() => 1)).toBe('a function');
  });
});

describe('blanks', () => {
  const code = 'a ___ b\n___ c';
  test('split, count and fill', () => {
    expect(splitBlanks(code)).toEqual(['a ', ' b\n', ' c']);
    expect(countBlanks(code)).toBe(2);
    expect(countBlanks('none')).toBe(0);
    expect(fillBlanks(code, ['x', 'y'])).toBe('a x b\ny c');
    expect(fillBlanks(code, ['x'])).toBe('a x b\n___ c');
  });
});

describe('replaceLine', () => {
  test('keeps the original indentation and trims the replacement', () => {
    expect(replaceLine('a\n  b\nc', 2, '  x ')).toBe('a\n  x\nc');
  });
});

describe('shuffles', () => {
  test('are deterministic', () => {
    expect(hashString('abc')).toBe(hashString('abc'));
    expect(hashString('abc')).not.toBe(hashString('abd'));
    const a = seededRandom(7);
    const b = seededRandom(7);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  test('are permutations that are never the identity or a forbidden order', () => {
    for (let n = 3; n <= 8; n += 1) {
      for (const seed of ['a', 'b', 'c', 'd', 'e']) {
        const order = shuffledIndexes(n, seed, [[...Array.from({ length: n }, (_, i) => i)].reverse()]);
        expect([...order].sort((x, y) => x - y)).toEqual(Array.from({ length: n }, (_, i) => i));
        expect(order.join()).not.toBe(Array.from({ length: n }, (_, i) => i).join());
        expect(order.join()).not.toBe(Array.from({ length: n }, (_, i) => n - 1 - i).join());
      }
    }
  });
  test('a single item stays', () => {
    expect(shuffledIndexes(1, 'x')).toEqual([0]);
  });
});

describe('insertAtSelection', () => {
  test('inserts at the caret', () => {
    expect(insertAtSelection('abcd', { start: 2, end: 2 }, '()')).toEqual({ value: 'ab()cd', cursor: 4 });
  });
  test('replaces a selection, in either direction', () => {
    expect(insertAtSelection('abcd', { start: 1, end: 3 }, '-')).toEqual({ value: 'a-d', cursor: 2 });
    expect(insertAtSelection('abcd', { start: 3, end: 1 }, '-')).toEqual({ value: 'a-d', cursor: 2 });
  });
  test('clamps a selection past the end', () => {
    expect(insertAtSelection('ab', { start: 9, end: 9 }, '  ')).toEqual({ value: 'ab  ', cursor: 4 });
  });
});

describe('parseInlineText', () => {
  test('splits bold and code', () => {
    expect(parseInlineText('a **b** `c` d')).toEqual([{ text: 'a ' }, { text: 'b', bold: true }, { text: ' ' }, { text: 'c', code: true }, { text: ' d' }]);
  });
  test('leaves unmatched markers as text', () => {
    expect(parseInlineText('a ** b `c')).toEqual([{ text: 'a ** b `c' }]);
  });
});

describe('stripInlineMarkup', () => {
  test('keeps the words and drops the markers', () => {
    expect(stripInlineMarkup('Use `let` for **changing** values')).toBe('Use let for changing values');
  });
});
