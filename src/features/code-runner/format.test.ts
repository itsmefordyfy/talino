import { describe, expect, test } from '@jest/globals';

import { runJs, SUPPORTED_JS } from './index';

const out = (source: string) => runJs(source).output;

describe('console formatting that differs from Node on purpose', () => {
  test('errors print as Name: message (no stack), in brackets when nested', () => {
    expect(out(`console.log(new Error('boom')); console.log(new TypeError('bad')); console.log({ e: new RangeError('r') }); console.log([new Error('x')])`)).toEqual([
      'Error: boom',
      'TypeError: bad',
      '{ e: [RangeError: r] }',
      '[ [Error: x] ]',
    ]);
    expect(out(`class MyErr extends Error { constructor(m) { super(m); this.name = 'MyErr'; this.code = 7 } } console.log(new MyErr('oops'))`)).toEqual(['MyErr: oops { code: 7 }']);
  });
  test('console.error, warn, info and debug are captured in order with log', () => {
    expect(out(`console.log('a'); console.error('b'); console.warn('c'); console.info('d'); console.debug('e')`)).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(out(`console.log()`)).toEqual(['']);
  });
  test('circular references are marked', () => {
    expect(out(`const o = { name: 'loop' }; o.self = o; console.log(o)`)).toEqual(["<ref *1> { name: 'loop', self: [Circular *1] }"]);
  });
});

describe('SUPPORTED_JS', () => {
  test('is a short readable list that names the main features and the gaps', () => {
    expect(SUPPORTED_JS.length).toBeGreaterThan(5);
    const text = SUPPORTED_JS.join(' ');
    for (const word of ['classes', 'destructuring', 'Map', 'JSON', 'async/await']) expect(text.toLowerCase()).toContain(word.toLowerCase());
  });
});
