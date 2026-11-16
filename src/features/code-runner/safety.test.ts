import { describe, expect, test } from '@jest/globals';

import { runJs } from './index';

const ran = (source: string, limits?: Parameters<typeof runJs>[1]) => runJs(source, limits);

describe('resource limits', () => {
  test.each([
    ['while (true) {}'],
    ['for (;;) {}'],
    ['do {} while (true)'],
    ['let i = 0; while (i >= 0) { i++ }'],
    ['for (const x of [1, 2, 3]) { while (true) {} }'],
    ['try { while (true) {} } catch (e) { console.log("caught") }'],
    ['try { while (true) {} } finally { console.log("finally") }'],
    ['const f = () => f2(); const f2 = () => { while (true) { } }; f()'],
  ])('an endless loop ends with a friendly error: %s', (source) => {
    const started = Date.now();
    const result = ran(source);
    expect(result.ok).toBe(false);
    expect(result.error?.message).toBe('Your program ran too long (possible infinite loop)');
    expect(result.output).toEqual([]);
    expect(Date.now() - started).toBeLessThan(3000);
  });
  test('the step budget is configurable, and counted', () => {
    const result = ran('let n = 0; for (let i = 0; i < 1000; i++) n += i; console.log(n)', { maxSteps: 100 });
    expect(result.ok).toBe(false);
    expect(ran('let n = 0; for (let i = 0; i < 1000; i++) n += i; console.log(n)').output).toEqual(['499500']);
    expect(ran('1 + 1').steps).toBeGreaterThan(0);
  });
  test('a long but finite loop is fine', () => {
    expect(ran('let s = 0; for (let i = 0; i < 50000; i++) { s += i } console.log(s)').output).toEqual(['1249975000']);
  });
  test('built-ins that touch many items cost steps, so a loop of big calls still ends', () => {
    const result = ran('const big = new Array(500000).fill(1); for (let i = 0; i < 100000; i++) big.includes(2)');
    expect(result.ok).toBe(false);
  });

  test('infinite recursion is a catchable RangeError', () => {
    const result = ran(`function f() { return f() + 1 } try { f() } catch (e) { console.log(e.name, e.message, e instanceof RangeError) }`);
    expect(result.output).toEqual(['RangeError Maximum call stack size exceeded true']);
    const uncaught = ran(`const g = (n) => g(n + 1); g(0)`);
    expect(uncaught.error).toMatchObject({ name: 'RangeError', message: 'Maximum call stack size exceeded' });
  });
  test('the call depth is configurable; reasonable recursion works', () => {
    const deep = `function down(n) { return n === 0 ? 0 : 1 + down(n - 1) } console.log(down(150))`;
    expect(ran(deep).output).toEqual(['150']);
    expect(ran(deep, { maxCallDepth: 50 }).error?.name).toBe('RangeError');
  });
  test('mutual recursion through callbacks and methods is capped too', () => {
    expect(ran(`const a = { f() { return [1].map(() => this.f()) } }; a.f()`).error?.name).toBe('RangeError');
    expect(ran(`class A { constructor() { new A() } } new A()`).error?.name).toBe('RangeError');
    expect(ran(`const o = { get x() { return this.x } }; o.x`).error?.name).toBe('RangeError');
  });

  test('huge strings and arrays fail gracefully', () => {
    expect(ran(`'x'.repeat(1e9)`).error).toMatchObject({ name: 'RangeError', message: 'Invalid string length' });
    expect(ran(`console.log('x'.repeat(1e6).length)`).output).toEqual(['1000000']);
    expect(ran(`let s = 'ab'; while (true) { s = s + s }`).error).toMatchObject({ name: 'RangeError', message: 'Invalid string length' });
    expect(ran(`let s = 'ab'; for (let i = 0; i < 40; i++) { s += s }`).error?.name).toBe('RangeError');
    expect(ran(`'a'.padStart(1e9)`).error?.name).toBe('RangeError');
    expect(ran(`new Array(1e9)`).error).toMatchObject({ name: 'RangeError', message: 'Invalid array length' });
    expect(ran(`const a = []; a[1e9] = 1`).error?.name).toBe('RangeError');
    expect(ran(`const a = []; a.length = 1e9`).error?.name).toBe('RangeError');
    expect(ran(`const a = [1]; while (true) { a.push(...a, ...a) }`).error?.name).toBe('RangeError');
    expect(ran(`const a = [1]; while (true) { a.push(a.length) }`).ok).toBe(false);
    expect(ran(`let a = [1, 2, 3]; for (let i = 0; i < 40; i++) a = a.concat(a)`).error?.name).toBe('RangeError');
    expect(ran(`Array.from({ length: 1e9 })`).error?.name).toBe('RangeError');
    expect(ran(`'x'.repeat(5e5).replaceAll('x', 'xxxx')`).error?.name).toBe('RangeError');
    expect(ran(`const m = new Map(); for (let i = 0; i < 2e6; i++) m.set(i, i)`).ok).toBe(false);
    expect(ran(`console.log(new Array(1e6).length)`).output).toEqual(['1000000']);
  });
  test('the program can catch its own RangeError and carry on', () => {
    expect(ran(`try { 'x'.repeat(1e10) } catch (e) { console.log(e.name) } console.log('after')`).output).toEqual(['RangeError', 'after']);
  });

  test('output is capped', () => {
    const result = ran(`while (true) console.log('spam spam spam spam')`);
    expect(result.ok).toBe(false);
    expect(result.error?.message).toBe('Your program printed too much output');
    expect(result.output.join('').length).toBeLessThanOrEqual(20_000);
    const single = ran(`console.log('x'.repeat(50000))`);
    expect(single.output[0].length).toBe(20_000);
    expect(ran(`for (let i = 0; i < 5; i++) console.log('line ' + i)`, { maxOutputChars: 12 }).error?.message).toBe('Your program printed too much output');
  });
});

describe('no access to the host', () => {
  test.each([
    `constructor.constructor('return process')()`,
    `this.constructor.constructor('return process')()`,
    `(function () { return this.constructor })()`,
    `[].constructor.constructor('return process')()`,
    `({}).constructor.constructor('return process')()`,
    `(() => {}).constructor('return process')()`,
    `'x'.constructor.constructor('return globalThis')()`,
    `console.log.constructor('return process')()`,
    `Object.constructor('return process')()`,
    `class A { m() { return this.constructor.constructor('return process')() } } new A().m()`,
    `Function('return process')()`,
    `new Function('return process')()`,
    `eval('process')`,
    `globalThis.process`,
    `window.document`,
    `process.env`,
    `require('child_process')`,
    `import('fs')`,
    `Reflect.ownKeys(globalThis)`,
  ])('cannot reach the host: %s', (source) => {
    const result = ran(source);
    expect(result.ok).toBe(false);
    expect(['ReferenceError', 'TypeError', 'Unsupported', 'SyntaxError']).toContain(result.error?.name);
  });

  test('this is undefined, not the global object', () => {
    expect(ran(`console.log(this, (function () { return this })(), (() => this)())`).output).toEqual(['undefined undefined undefined']);
    expect(ran(`function f() { return this.x } f()`).error?.name).toBe('TypeError');
  });
  test('only the documented built-ins exist', () => {
    const names = ['Object', 'Array', 'String', 'Number', 'Boolean', 'Math', 'JSON', 'Map', 'Set', 'Error', 'TypeError', 'RangeError', 'ReferenceError', 'SyntaxError', 'console', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'NaN', 'Infinity'];
    expect(ran(`console.log(${names.map((n) => `typeof ${n}`).join(', ')})`).output[0].split(' ').every((t) => t !== 'undefined')).toBe(true);
    for (const gone of ['process', 'window', 'document', 'fetch', 'require', 'module', 'Buffer', 'setTimeout', 'Promise', 'Date', 'RegExp', 'Symbol', 'Proxy', 'Reflect', 'WebAssembly', 'XMLHttpRequest', 'Function', 'eval', 'globalThis', 'global', 'self']) {
      expect(ran(`console.log(typeof ${gone})`).output).toEqual(['undefined']);
    }
  });
  test('the real Object.prototype is never touched', () => {
    ran(`Object.prototype.polluted = 1; ({}).__proto__.polluted2 = 2; const o = {}; o['__proto__'].x = 1`);
    ran(`JSON.parse('{"__proto__": {"polluted3": 1}}'); Object.assign({}, JSON.parse('{"__proto__": {"polluted4": 1}}'))`);
    ran(`const o = {}; o.constructor.prototype.polluted5 = 1; [].constructor.prototype.polluted6 = 1`);
    const host = {} as Record<string, unknown>;
    for (const key of ['polluted', 'polluted2', 'polluted3', 'polluted4', 'polluted5', 'polluted6', 'x']) {
      expect(host[key]).toBeUndefined();
      expect(([] as unknown as Record<string, unknown>)[key]).toBeUndefined();
    }
  });
  test('__proto__, constructor and prototype are plain keys', () => {
    expect(ran(`const o = { __proto__: 5, constructor: 6, prototype: 7 }; console.log(o.__proto__, o.constructor, o.prototype, Object.keys(o))`).output).toEqual(["5 6 7 [ '__proto__', 'constructor', 'prototype' ]"]);
    expect(ran(`const o = {}; o.__proto__ = { hacked: true }; console.log(o.hacked, ({}).hacked, Object.keys(o))`).output).toEqual(["undefined undefined [ '__proto__' ]"]);
    expect(ran(`const o = JSON.parse('{"__proto__": {"admin": true}}'); console.log(o.admin, ({}).admin, Object.keys(o))`).output).toEqual(["undefined undefined [ '__proto__' ]"]);
    expect(ran(`const a = {}; const b = { ...JSON.parse('{"__proto__": {"x": 1}}') }; console.log(b.x, Object.keys(b), a.x)`).output).toEqual(["undefined [ '__proto__' ] undefined"]);
    expect(ran(`const m = new Map(); m.set('__proto__', 1); const [k] = m.keys(); console.log(k, m.get('__proto__'))`).output).toEqual(['__proto__ 1']);
  });
  test('prototype cycles cannot hang property lookups', () => {
    expect(ran(`const a = {}; const b = Object.create(a); Object.setPrototypeOf(a, b)`).error?.message).toBe('Cyclic __proto__ value');
  });
  test('a program cannot change what built-ins mean for the next run', () => {
    ran(`Array.prototype.map = () => 'broken'; Math.floor = () => 0; JSON.stringify = null`);
    expect(ran(`console.log([1].map((x) => x), Math.floor(1.5), JSON.stringify(1))`).output).toEqual(['[ 1 ] 1 1']);
  });
  test('error text cannot be used to inject host objects: errors are interpreter values', () => {
    expect(ran(`try { null.x } catch (e) { console.log(typeof e, Object.keys(e), typeof e.stack) }`).output).toEqual(["object [] string"]);
  });
});

describe('runJs never throws', () => {
  const never = (source: unknown) => {
    expect(() => runJs(source as string)).not.toThrow();
    const result = runJs(source as string);
    expect(typeof result.ok).toBe('boolean');
    expect(Array.isArray(result.output)).toBe(true);
    return result;
  };

  test('odd inputs', () => {
    for (const input of ['', ' ', '\n', ';', ';;;', '\u0000', '\uD800', 'a'.repeat(200_000), undefined, null, 5, {}, [], '/*', '"', '`${', '#!shebang', '<!--', '\\']) never(input);
    expect(never('a'.repeat(200_000)).error?.message).toMatch(/too long/);
  });
  test('deep nesting', () => {
    never('('.repeat(5000) + '1' + ')'.repeat(5000));
    never('['.repeat(5000) + ']'.repeat(5000));
    never('{'.repeat(5000) + '}'.repeat(5000));
    never('a => '.repeat(3000) + 'a');
    never('1' + '+1'.repeat(20000));
    never('f(' .repeat(3000) + ')'.repeat(3000));
    never('!'.repeat(20000) + 'x');
    never('if (1) '.repeat(3000) + ';');
    never('let a = ' + '[1,'.repeat(2000) + ']'.repeat(2000));
    never('const o = ' + '{a:'.repeat(2000) + '1' + '}'.repeat(2000) + '; console.log(o)');
    never('x' + '.y'.repeat(20000));
    never('`${'.repeat(1000) + '1' + '}`'.repeat(1000));
    expect(never('1' + '+1'.repeat(20000)).ok).toBeDefined();
  });
  test('deeply nested data at run time', () => {
    never(`let o = {}; for (let i = 0; i < 100000; i++) o = { o }; console.log(o); JSON.stringify(o)`);
    never(`let a = []; for (let i = 0; i < 100000; i++) a = [a]; console.log(a); String(a); a.flat(Infinity)`);
    never(`let a = []; for (let i = 0; i < 100000; i++) a = [a]; JSON.stringify(a)`);
    never(`let s = '['.repeat(100000) + ']'.repeat(100000); JSON.parse(s)`);
  });
  test('random token soup', () => {
    let seed = 12345;
    const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    const tokens = ['let', 'const', 'var', 'x', 'y', '=', '+', '-', '*', '/', '(', ')', '[', ']', '{', '}', ';', ',', '.', '?.', '=>', 'function', 'class', 'new', 'this', 'super', 'return', 'if', 'else', 'for', 'while', 'in', 'of', 'try', 'catch', 'throw', '1', '2.5', "'s'", '`t${x}`', 'null', 'undefined', 'typeof', '...', '?', ':', '!', '&&', '||', '??', 'async', 'await', 'yield', '#p', 'static', 'get', 'set', 'switch', 'case', 'break', 'continue', '\n', '++', '--', '**', '<<', '==='];
    for (let n = 0; n < 400; n++) {
      const length = 1 + Math.floor(rand() * 25);
      const source = Array.from({ length }, () => tokens[Math.floor(rand() * tokens.length)]).join(' ');
      never(source);
    }
  });
  test('random characters', () => {
    let seed = 99;
    const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    for (let n = 0; n < 200; n++) {
      const source = Array.from({ length: 1 + Math.floor(rand() * 60) }, () => String.fromCharCode(Math.floor(rand() * 0x2fff))).join('');
      never(source);
    }
  });
  test('mutating programs and odd runtime paths', () => {
    for (const source of [
      `const a = [1, 2, 3]; a.forEach(() => a.push(1))`,
      `const a = [1, 2, 3]; a.map(() => a.pop())`,
      `const m = new Map([[1, 1]]); m.forEach(() => m.set(Math.random(), 1))`,
      `const s = new Set([1]); s.forEach((v) => s.add(v + 1))`,
      `for (const x of [1]) { var [a, b = a] = [x] }`,
      `class A extends null {}`,
      `class A extends 5 {}`,
      `new (class { constructor() { return 5 } })()`,
      `[...{}]`,
      `[...5]`,
      `const { a } = null`,
      `null.x = 1`,
      `({}).x.y.z`,
      `JSON.stringify({ toJSON() { throw 1 } })`,
      `[1, 2].sort(() => { throw new Error('x') })`,
      `'abc'.replace({}, 1)`,
      `Object.defineProperty(1, 'x', {})`,
      `Object.setPrototypeOf({}, 5)`,
      `Object.create(5)`,
      `String(Object.create(null))`,
      `Object.create(null) + ''`,
      `\`\${Object.create(null)}\``,
      `[] instanceof 5`,
      `'x' in 5`,
      `delete null.x`,
      `x = x`,
      `let x = x`,
      `class A { static x = A.y.z }`,
      `(function f() { f = 1; return typeof f })()`,
      `const f = (a = b, b) => 1; f()`,
      `label: label2: for (;;) { break label }`,
      `new.target`,
      `super.x`,
      `arguments.length`,
      `console.log(console)`,
      `console.log(Math, JSON, Object, Array, console.log)`,
      `console.log(new Error('x'), [new Error('y')], { e: new TypeError('z') })`,
    ]) never(source);
  });
});
