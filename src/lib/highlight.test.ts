import { describe, expect, test } from '@jest/globals';

import { breakLigatures, highlight, languageKey } from './highlight';

const kinds = (code: string, language: string) => highlight(code, language).filter((token) => token.kind !== 'plain' && token.kind !== 'punctuation').map((token) => `${token.kind}:${token.text}`);

describe('highlight', () => {
  test('never loses or changes text, whatever the input', () => {
    const samples: [string, string][] = [
      ['const a = "unterminated', 'javascript'],
      ["def f(x):\n    return x * 2  # double", 'python'],
      ['{"a": [1, 2, null], "b": "c"}', 'json'],
      ['npm install --save react', 'bash'],
      ["SELECT name FROM users WHERE id = 'x';", 'sql'],
      ['<div class="a">hi</div>', 'html'],
      ['body { color: #fff; margin: 0px }', 'css'],
      ['anything at all {{{ ]]] ``` ', 'unknown-language'],
      ['', 'javascript'],
    ];
    for (const [code, language] of samples) {
      expect(highlight(code, language).map((token) => token.text).join('')).toBe(code);
    }
  });

  test('colors comments, strings, numbers, keywords and calls in JavaScript', () => {
    expect(kinds('const total = add(2, 3); // sum\nconst s = "hi";', 'ts')).toEqual(['keyword:const', 'function:add', 'number:2', 'number:3', 'comment:// sum', 'keyword:const', 'string:"hi"']);
  });

  test('does not color a keyword inside a longer word', () => {
    expect(kinds('constant = 1', 'js')).toEqual(['number:1']);
  });

  test('handles Python comments and strings', () => {
    expect(kinds("name = 'Ana'  # who", 'py')).toEqual(["string:'Ana'", 'comment:# who']);
  });

  test('treats JSON keys differently from values', () => {
    expect(kinds('{"a": "b", "n": true}', 'json')).toEqual(['function:"a"', 'string:"b"', 'function:"n"', 'keyword:true']);
  });

  test('an unknown or missing language is plain text', () => {
    expect(highlight('x = 1', 'brainfuck')).toEqual([{ text: 'x = 1', kind: 'plain' }]);
    expect(languageKey(undefined)).toBeNull();
    expect(languageKey('TypeScript')).toBe('js');
  });
});

describe('breakLigatures', () => {
  test('separates neighbouring symbols so they are drawn one by one, and changes nothing else', () => {
    const shown = breakLigatures('i <= 4; i++; a => b !== c');
    expect(shown.replace(/‌/g, '')).toBe('i <= 4; i++; a => b !== c');
    expect(shown).toContain('<‌=');
    expect(shown).toContain('+‌+');
    expect(breakLigatures('let total = 0;')).toBe('let total = 0;');
  });
});
