import { describe, expect, test } from '@jest/globals';

import { runJs } from './index';

const out = (source: string): string[] => {
  const result = runJs(source);
  if (!result.ok) throw new Error(`${result.error?.name}: ${result.error?.message} (line ${result.error?.line})`);
  return result.output;
};
const fails = (source: string) => {
  const result = runJs(source);
  expect(result.ok).toBe(false);
  return result.error!;
};

describe('values and operators', () => {
  test('arithmetic, strings and coercion follow JavaScript', () => {
    expect(out(`console.log(1 + 2 * 3, 7 % 3, 2 ** 10, 7 / 2, 'a' + 1, 1 + '2', '3' * '4', 10 - '3')`)).toEqual(['7 1 1024 3.5 a1 12 12 7']);
    expect(out(`console.log(0.1 + 0.2, 1 / 0, -1 / 0, 0 / 0, -0)`)).toEqual(['0.30000000000000004 Infinity -Infinity NaN -0']);
    expect(out(`console.log(typeof 1, typeof 'a', typeof true, typeof undefined, typeof null, typeof {}, typeof [], typeof (() => 1), typeof nope)`)).toEqual([
      'number string boolean undefined object object object function undefined',
    ]);
  });
  test('comparison and equality', () => {
    expect(out(`console.log(1 == '1', 1 === '1', null == undefined, null === undefined, NaN === NaN, 'b' > 'a', '10' < '9', 10 < 9, [] == false)`)).toEqual([
      'true false true false false true true false true',
    ]);
  });
  test('logical, nullish, optional chaining and ternary', () => {
    expect(out(`const o = { a: { b: 1 }, n: null }
console.log(0 || 'x', 1 && 'y', null ?? 'z', 0 ?? 'z', o?.a?.b, o.n?.b, o.q?.b.c.d, o.f?.(), 5 > 3 ? 'yes' : 'no')`)).toEqual(['x y z 0 1 undefined undefined undefined yes']);
  });
  test('bitwise operators and assignment operators', () => {
    expect(out(`let a = 5; a += 2; a *= 3; a -= 1; a /= 4; a **= 2; let b = 6 & 3 | 8 ^ 1; let c = 1 << 4; let d = -16 >> 2; let e = -1 >>> 28
console.log(a, b, c, d, e, ~5)`)).toEqual(['25 11 16 -4 15 -6']);
    expect(out(`let x = null; x ??= 4; let y = 0; y ||= 9; let z = 1; z &&= 7; console.log(x, y, z)`)).toEqual(['4 9 7']);
  });
  test('increment and decrement', () => {
    expect(out(`let i = 1; console.log(i++, ++i, i--, --i); const o = { n: 1 }; o.n++; ++o.n; const a = [1]; a[0] += 5; console.log(o.n, a[0])`)).toEqual(['1 3 3 1', '3 6']);
  });
  test('template literals', () => {
    expect(out('const n = 3; console.log(`n is ${n}, double ${n * 2}, ${[1, 2]}, ${{}}`)')).toEqual(['n is 3, double 6, 1,2, [object Object]']);
  });
  test('in and instanceof', () => {
    expect(out(`class A {} class B extends A {} console.log('a' in { a: 1 }, 'b' in { a: 1 }, 1 in [5, 6], new B() instanceof A, [] instanceof Array, ({}) instanceof Array)`)).toEqual([
      'true false true true true false',
    ]);
  });
});

describe('variables and scope', () => {
  test('let, const, var and hoisting', () => {
    expect(out(`console.log(v); var v = 1; console.log(f()); function f() { return 'hoisted' }`)).toEqual(['undefined', 'hoisted']);
    expect(out(`{ let a = 1; { let a = 2; console.log(a) } console.log(a) }`)).toEqual(['2', '1']);
    expect(out(`if (true) { var leaked = 5 } console.log(leaked)`)).toEqual(['5']);
  });
  test('temporal dead zone and const assignment', () => {
    expect(fails(`console.log(x); let x = 1`)).toMatchObject({ name: 'ReferenceError', message: "Cannot access 'x' before initialization", line: 1 });
    expect(fails(`const c = 1;\nc = 2`)).toMatchObject({ name: 'TypeError', message: 'Assignment to constant variable.', line: 2 });
  });
  test('closures keep their own variables, including per loop turn', () => {
    expect(out(`const fs = []; for (let i = 0; i < 3; i++) fs.push(() => i); console.log(fs.map((f) => f()))`)).toEqual(['[ 0, 1, 2 ]']);
    expect(out(`var fs = []; for (var i = 0; i < 3; i++) fs.push(() => i); console.log(fs.map((f) => f()))`)).toEqual(['[ 3, 3, 3 ]']);
    expect(out(`function counter() { let n = 0; return () => ++n } const c = counter(); c(); c(); console.log(c(), counter()())`)).toEqual(['3 1']);
  });
  test('unknown names are ReferenceErrors, like JavaScript', () => {
    expect(fails(`let a = 1;\nconsole.log(missing)`)).toMatchObject({ name: 'ReferenceError', message: 'missing is not defined', line: 2 });
  });
  test('undeclared assignment creates a global unless the code is strict', () => {
    expect(out(`sloppy = 4; console.log(sloppy)`)).toEqual(['4']);
    expect(fails(`'use strict'; strictVar = 4`)).toMatchObject({ name: 'ReferenceError' });
  });
});

describe('control flow', () => {
  test('if, loops, break, continue and labels', () => {
    expect(out(`let s = 0; for (let i = 1; i <= 10; i++) { if (i % 2) continue; if (i > 8) break; s += i } console.log(s)`)).toEqual(['20']);
    expect(out(`let n = 0; while (n < 3) n++; do { n += 10 } while (n < 5); console.log(n)`)).toEqual(['13']);
    expect(out(`outer: for (let i = 0; i < 3; i++) { for (let j = 0; j < 3; j++) { if (j === 1) continue outer; if (i === 2) break outer; console.log(i, j) } }`)).toEqual(['0 0', '1 0']);
  });
  test('for...of and for...in', () => {
    expect(out(`for (const x of [1, 2]) console.log(x); for (const c of 'hi') console.log(c); for (const [k, v] of new Map([['a', 1]])) console.log(k, v); for (const v of new Set([7])) console.log(v)`)).toEqual(['1', '2', 'h', 'i', 'a 1', '7']);
    expect(out(`for (const k in { a: 1, b: 2 }) console.log(k); for (const i in ['x', 'y']) console.log(i, typeof i)`)).toEqual(['a', 'b', '0 string', '1 string']);
    expect(out(`class A { constructor() { this.own = 1 } method() {} } for (const k in new A()) console.log(k)`)).toEqual(['own']);
  });
  test('switch with fall-through and default', () => {
    const src = (v: string) => `switch (${v}) { case 1: console.log('one'); case 2: console.log('two'); break; case 3: { console.log('three'); break } default: console.log('other') }`;
    expect(out(src('1'))).toEqual(['one', 'two']);
    expect(out(src('3'))).toEqual(['three']);
    expect(out(src('9'))).toEqual(['other']);
    expect(out(src("'1'"))).toEqual(['other']);
  });
  test('try, catch, finally and throw', () => {
    expect(out(`try { throw new Error('boom') } catch (e) { console.log(e.message, e.name, e instanceof Error) } finally { console.log('done') }`)).toEqual(['boom Error true', 'done']);
    expect(out(`function f() { try { return 'try' } finally { console.log('cleanup') } } console.log(f())`)).toEqual(['cleanup', 'try']);
    expect(out(`try { null.x } catch (e) { console.log(e instanceof TypeError, e.message) } try { throw 'plain' } catch (e) { console.log(e) } try { missing() } catch { console.log('no binding') }`)).toEqual([
      'true Cannot read properties of null (reading \'x\')',
      'plain',
      'no binding',
    ]);
    expect(out(`const f = () => { try { throw 1 } catch (e) { throw e + 1 } finally { return 'finally wins' } }; console.log(f())`)).toEqual(['finally wins']);
  });
  test('an uncaught error reports its name, message and line', () => {
    expect(fails(`console.log('a')\nthrow new RangeError('too far')`)).toMatchObject({ name: 'RangeError', message: 'too far', line: 2 });
    expect(fails(`throw 'oops'`)).toMatchObject({ name: 'Uncaught', message: 'oops' });
    const result = runJs(`console.log('before')\nundefined.x`);
    expect(result.output).toEqual(['before']);
    expect(result.error).toMatchObject({ name: 'TypeError', message: "Cannot read properties of undefined (reading 'x')", line: 2 });
  });
});

describe('functions', () => {
  test('declarations, expressions, arrows, defaults, rest and recursion', () => {
    expect(out(`function add(a, b = 10) { return a + b } const mul = function (a, b) { return a * b }; const sq = (x) => x * x
console.log(add(1), add(1, 2), mul(3, 4), sq(5))`)).toEqual(['11 3 12 25']);
    expect(out(`const sum = (...n) => n.reduce((a, b) => a + b, 0); const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1)); function fib(n) { return n < 2 ? n : fib(n - 1) + fib(n - 2) }
console.log(sum(1, 2, 3), fact(10), fib(15), sum(...[4, 5]))`)).toEqual(['6 3628800 610 9']);
  });
  test('this, call, apply, bind and arguments', () => {
    expect(out(`function who() { return this.name } const o = { name: 'o', who, arrow: () => typeof this }
console.log(o.who(), who.call({ name: 'c' }), who.apply({ name: 'a' }, []), who.bind({ name: 'b' })(), o.arrow())`)).toEqual(['o c a b undefined']);
    expect(out(`function f() { return arguments.length + ':' + Array.from(arguments).join('') } console.log(f(1, 2, 3))`)).toEqual(['3:123']);
  });
  test('function properties and toString', () => {
    expect(out(`function foo(a, b) {} const bar = () => {}; console.log(foo.name, foo.length, bar.name, typeof foo.prototype)`)).toEqual(['foo 2 bar object']);
    expect(out(`function greet() { return 1 } console.log(greet.toString())`)).toEqual(['function greet() { return 1 }']);
  });
  test('calling something that is not a function names the expression', () => {
    expect(fails(`const o = {};\no.nope()`)).toMatchObject({ name: 'TypeError', message: 'o.nope is not a function', line: 2 });
    expect(fails(`let x = 5; x()`)).toMatchObject({ message: 'x is not a function' });
  });
  test('old-style constructors with prototypes', () => {
    expect(out(`function Dog(name) { this.name = name } Dog.prototype.speak = function () { return this.name + ' barks' }; console.log(new Dog('Rex').speak())`)).toEqual(['Rex barks']);
  });
});

describe('destructuring and spread', () => {
  test('arrays and objects', () => {
    expect(out(`const [a, , b = 5, ...rest] = [1, 2, undefined, 4, 5]; const { x, y: { z }, w = 'dw', ...others } = { x: 1, y: { z: 2 }, p: 3, q: 4 }
console.log(a, b, rest, x, z, w, others)`)).toEqual(['1 5 [ 4, 5 ] 1 2 dw { p: 3, q: 4 }']);
    expect(out(`let a = 1, b = 2; [a, b] = [b, a]; const o = {}; ({ k: o.v } = { k: 9 }); console.log(a, b, o.v)`)).toEqual(['2 1 9']);
    expect(out(`const f = ({ a, b = 2 }, [c]) => a + b + c; console.log(f({ a: 1 }, [3]))`)).toEqual(['6']);
  });
  test('spread in calls, arrays and objects', () => {
    expect(out(`const a = [1, 2]; console.log(Math.max(...a, 5), [...a, ...'hi', ...new Set([9])], { ...{ p: 1 }, q: 2, ...null })`)).toEqual(['5 [ 1, 2, \'h\', \'i\', 9 ] { p: 1, q: 2 }']);
  });
  test('destructuring undefined explains itself', () => {
    expect(fails(`const { a } = undefined`)).toMatchObject({ name: 'TypeError' });
    expect(fails(`const [a] = null`)).toMatchObject({ name: 'TypeError', message: 'null is not iterable' });
  });
});

describe('objects, classes and collections', () => {
  test('object literals: computed keys, shorthand, methods, getters and setters', () => {
    expect(out(`const k = 'dyn'; const n = 1; const o = { [k]: 1, n, m() { return this.n }, get double() { return this.n * 2 }, set v(x) { this.n = x } }
o.v = 5; console.log(o.dyn, o.m(), o.double, Object.keys(o))`)).toEqual(["1 5 10 [ 'dyn', 'n', 'm', 'double', 'v' ]"]);
  });
  test('classes: constructor, methods, static, getters, fields, private names and inheritance', () => {
    expect(out(`class Animal { static count = 0; legs = 4; #secret = 'hidden'
  constructor(name) { this.name = name; Animal.count++ }
  speak() { return this.name + ' makes a sound' }
  get label() { return 'animal:' + this.name }
  static create(n) { return new this(n) }
  reveal() { return this.#secret } }
class Dog extends Animal { constructor(name) { super(name); this.tricks = [] } speak() { return super.speak() + ' (woof)' } }
const d = Dog.create('Rex'); const a = new Animal('Generic')
console.log(d.speak(), d.label, d.legs, d.reveal(), Animal.count, d instanceof Animal, d.constructor.name, Object.keys(d))
console.log(d)`)).toEqual(["Rex makes a sound (woof) animal:Rex 4 hidden 2 true Dog [ 'legs', 'name', 'tricks' ]", "Dog { legs: 4, name: 'Rex', tricks: [] }"]);
  });
  test('extending Error and built-in collections', () => {
    expect(out(`class ValidationError extends Error { constructor(m) { super(m); this.name = 'ValidationError' } }
try { throw new ValidationError('bad input') } catch (e) { console.log(e.name, e.message, e instanceof ValidationError, e instanceof Error, String(e)) }`)).toEqual(['ValidationError bad input true true ValidationError: bad input']);
    expect(out(`class Stack extends Array { top() { return this[this.length - 1] } } const s = new Stack(); s.push(1, 2); console.log(s.top(), s.length, Array.isArray(s))`)).toEqual(['2 2 true']);
  });
  test('class rules: needs new, super before this, no calling', () => {
    expect(fails(`class A {} A()`)).toMatchObject({ message: "Class constructor A cannot be invoked without 'new'" });
    expect(fails(`class A {} class B extends A { constructor() { this.x = 1; super() } } new B()`)).toMatchObject({ name: 'ReferenceError' });
    expect(fails(`const notClass = () => {}; new notClass()`)).toMatchObject({ message: 'notClass is not a constructor' });
  });
  test('Map and Set', () => {
    expect(out(`const m = new Map(); m.set('a', 1).set('b', 2); console.log(m.get('a'), m.has('z'), m.size, [...m.keys()], [...m.values()], m); m.delete('a'); m.forEach((v, k) => console.log(k, v))
const s = new Set([1, 2, 2, 3]); s.add(4); console.log(s.size, s.has(2), [...s], s)`)).toEqual(["1 false 2 [ 'a', 'b' ] [ 1, 2 ] Map(2) { 'a' => 1, 'b' => 2 }", 'b 2', '4 true [ 1, 2, 3, 4 ] Set(4) { 1, 2, 3, 4 }']);
    expect(fails(`Map()`)).toMatchObject({ message: "Constructor Map requires 'new'" });
  });
  test('Object helpers', () => {
    expect(out(`const o = { a: 1, b: 2 }; console.log(Object.keys(o), Object.values(o), Object.entries(o), Object.assign({}, o, { c: 3 }), Object.fromEntries([['x', 1]]), Object.entries('hi'))`)).toEqual([
      "[ 'a', 'b' ] [ 1, 2 ] [ [ 'a', 1 ], [ 'b', 2 ] ] { a: 1, b: 2, c: 3 } { x: 1 } [ [ '0', 'h' ], [ '1', 'i' ] ]",
    ]);
    expect(out(`const o = Object.freeze({ a: 1 }); o.a = 2; o.b = 3; delete o.a; console.log(o, Object.isFrozen(o))`)).toEqual(['{ a: 1 } true']);
    expect(fails(`'use strict'; const o = Object.freeze({ a: 1 }); o.a = 2`)).toMatchObject({ name: 'TypeError' });
    expect(out(`console.log({ 2: 'b', 1: 'a', x: 1 }, Object.keys({ b: 1, 1: 1 }), 'hasOwn', ({ a: 1 }).hasOwnProperty('a'), Object.hasOwn({ a: 1 }, 'b'))`)).toEqual([
      "{ '1': 'a', '2': 'b', x: 1 } [ '1', 'b' ] hasOwn true false",
    ]);
  });
  test('Object.create, prototypes and defineProperty', () => {
    expect(out(`const base = { hi() { return 'hi ' + this.n } }; const o = Object.create(base); o.n = 'o'; console.log(o.hi(), Object.getPrototypeOf(o) === base)
const d = {}; Object.defineProperty(d, 'hidden', { value: 1, enumerable: false }); Object.defineProperty(d, 'g', { get() { return 7 }, enumerable: true }); console.log(d.hidden, d.g, Object.keys(d))`)).toEqual(['hi o true', "1 7 [ 'g' ]"]);
  });
});

describe('built-in methods', () => {
  test('array methods', () => {
    expect(out(`const a = [3, 1, 2]; a.push(4); a.unshift(0); console.log(a.pop(), a.shift(), a, a.indexOf(2), a.includes(9), a.slice(1), a.slice(-2), a.concat([9], 8), a.join('-'))`)).toEqual([
      '4 0 [ 3, 1, 2 ] 2 false [ 1, 2 ] [ 1, 2 ] [ 3, 1, 2, 9, 8 ] 3-1-2',
    ]);
    expect(out(`const a = [1, 2, 3, 4, 5]; console.log(a.splice(1, 2), a, a.splice(1, 0, 'x', 'y'), a, a.splice(-1), a)`)).toEqual(["[ 2, 3 ] [ 1, 'x', 'y', 4 ] [] [ 1, 'x', 'y', 4 ] [ 5 ] [ 1, 'x', 'y', 4 ]"]);
    expect(out(`const a = [1, 2, 3, 4]; console.log(a.map((x) => x * 2), a.filter((x) => x % 2), a.reduce((s, x) => s + x), a.reduce((s, x) => s + x, 10), a.find((x) => x > 2), a.findIndex((x) => x > 9), a.some((x) => x > 3), a.every((x) => x > 3), a.findLast((x) => x < 3))`)).toEqual([
      '[ 2, 4, 6, 8 ] [ 1, 3 ] 10 20 3 -1 true false 2',
    ]);
    expect(out(`const log = []; [5, 6].forEach((v, i, arr) => log.push(v + i + arr.length)); console.log(log, [1, [2, [3, [4]]]].flat(), [1, [2, [3, [4]]]].flat(Infinity), [[1], [2]].flatMap((x) => x), [1, 2, 3].at(-1), new Array(3).fill(0), Array.from({ length: 3 }, (_, i) => i * i), Array.from('abc'), Array.from(new Set([1, 1, 2])), Array.of(7), Array(2).join('-'))`)).toEqual([
      '[ 7, 9 ] [ 1, 2, [ 3, [ 4 ] ] ] [ 1, 2, 3, 4 ] [ 1, 2 ] 3 [ 0, 0, 0 ] [ 0, 1, 4 ] [ \'a\', \'b\', \'c\' ] [ 1, 2 ] [ 7 ] -',
    ]);
  });
  test('sort defaults to string order and takes a comparator', () => {
    expect(out(`console.log([10, 9, 1, 100].sort(), [10, 9, 1, 100].sort((a, b) => a - b), ['b', 'a', 'C'].sort(), [3, undefined, 1].sort(), [1, 2, 3].reverse(), [2, 1].toSorted(), [1, 2].toReversed())`)).toEqual([
      '[ 1, 10, 100, 9 ] [ 1, 9, 10, 100 ] [ \'C\', \'a\', \'b\' ] [ 1, 3, undefined ] [ 3, 2, 1 ] [ 1, 2 ] [ 2, 1 ]',
    ]);
    expect(out(`const people = [{ n: 'a', age: 30 }, { n: 'b', age: 25 }, { n: 'c', age: 30 }]; console.log(people.sort((x, y) => y.age - x.age).map((p) => p.n).join(''))`)).toEqual(['acb']);
  });
  test('string methods', () => {
    expect(out(`const s = '  Hello, World  '; console.log(s.trim(), s.trim().length, s.toUpperCase(), s.trim().toLowerCase(), s.trim()[0], s.trim().at(-1), s.trim().charAt(1), s.indexOf('o'), s.includes('World'), s.trim().startsWith('Hello'), s.trim().endsWith('d'))`)).toEqual([
      'Hello, World 12   HELLO, WORLD   hello, world H d e 6 true true true',
    ]);
    expect(out(`console.log('a,b,c'.split(','), 'abc'.split(''), 'abc'.slice(1), 'abc'.slice(-2), 'abcdef'.substring(4, 1), 'a-b-c'.replace('-', '+'), 'a-b-c'.replaceAll('-', '+'), 'ab'.repeat(3), '5'.padStart(3, '0'), 'x'.padEnd(3, '-') + '|', 'abc'.replace('b', (m) => m.toUpperCase()), 'a b'.split(' ', 1))`)).toEqual([
      "[ 'a', 'b', 'c' ] [ 'a', 'b', 'c' ] bc bc bcd a+b-c a+b+c ababab 005 x--| aBc [ 'a' ]",
    ]);
    expect(out(`console.log('abc'.length, 'abc'[1], 'abc'[9], 'abc'.charCodeAt(0), String.fromCharCode(72, 105), 'b'.localeCompare('a'), [...'héllo'].length, 'abc'.concat('d', 1))`)).toEqual(['3 b undefined 97 Hi 1 5 abcd1']);
  });
  test('Math, Number and conversions', () => {
    expect(out(`console.log(Math.floor(2.7), Math.ceil(2.1), Math.round(2.5), Math.round(-2.5), Math.trunc(-2.7), Math.abs(-3), Math.max(1, 5, 3), Math.min(), Math.pow(2, 8), Math.sqrt(16), Math.sign(-4), Math.PI.toFixed(2), Math.hypot(3, 4))`)).toEqual(['2 3 3 -2 -2 3 5 Infinity 256 4 -1 3.14 5']);
    expect(out(`console.log(Number('42'), Number(''), Number('abc'), Number(null), Number(undefined), Number(true), parseInt('42px'), parseInt('ff', 16), parseFloat('3.14abc'), isNaN('x'), Number.isNaN('x'), Number.isInteger(5.0), Number.isInteger(5.5), (1234.5678).toFixed(2), (255).toString(16), (0.5).toString(2), Number.MAX_SAFE_INTEGER, (1234567.891).toLocaleString())`)).toEqual([
      '42 0 NaN 0 NaN 1 42 255 3.14 true false true false 1234.57 ff 0.1 9007199254740991 1,234,567.891',
    ]);
    expect(out(`console.log(String(123), String(null), String([1, 2]), String({}), Boolean(''), Boolean('0'), Boolean([]), !!NaN, [] + [], [] + {}, [1] * 2)`)).toEqual(['123 null 1,2 [object Object] false true true false  [object Object] 2']);
  });
  test('Math.random is repeatable and within range', () => {
    const first = runJs(`console.log(Math.random(), Math.random())`).output;
    expect(runJs(`console.log(Math.random(), Math.random())`).output).toEqual(first);
    const [a] = first[0].split(' ').map(Number);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(1);
  });
  test('JSON', () => {
    expect(out(`console.log(JSON.stringify({ a: 1, b: [1, 'x', null, undefined, () => 1], c: undefined, d: { e: true } }), JSON.stringify('q"'), JSON.stringify([undefined]), JSON.stringify(undefined), JSON.stringify(NaN))`)).toEqual([
      '{"a":1,"b":[1,"x",null,null,null],"d":{"e":true}} "q\\"" [null] undefined null',
    ]);
    expect(out(`console.log(JSON.stringify({ a: [1, 2], b: {} }, null, 2)); console.log(JSON.stringify({ a: 1, b: 2 }, ['a']), JSON.stringify({ a: 1 }, (k, v) => (typeof v === 'number' ? v + 1 : v)))`)).toEqual([
      '{\n  "a": [\n    1,\n    2\n  ],\n  "b": {}\n}',
      '{"a":1} {"a":2}',
    ]);
    expect(out(`const o = JSON.parse('{"a":[1,{"b":null}],"s":"x"}'); console.log(o, o.a[1].b); try { JSON.parse('{bad') } catch (e) { console.log(e.name) }
const c = {}; c.self = c; try { JSON.stringify(c) } catch (e) { console.log(e.name, e.message) }`)).toEqual(["{ a: [ 1, { b: null } ], s: 'x' } null", 'SyntaxError', 'TypeError Converting circular structure to JSON']);
  });
  test('the last expression statement is returned', () => {
    expect(runJs(`const x = 2; x * 21`).returned).toBe(42);
    expect(runJs(`[1, { a: 2 }]`).returned).toEqual([1, { a: 2 }]);
    expect(runJs(`const x = 1`).returned).toBeUndefined();
  });
});

describe('errors that learners hit', () => {
  test('syntax errors report the line', () => {
    const error = fails(`const a = 1;\nconst b = ;`);
    expect(error.name).toBe('SyntaxError');
    expect(error.line).toBe(2);
    expect(fails(`let x = 1; let x = 2`).name).toBe('SyntaxError');
    expect(fails(`function (`).name).toBe('SyntaxError');
  });
  test('line numbers follow the failing statement', () => {
    expect(fails(`function f() {\n  const o = null;\n  return o.value;\n}\nf()`)).toMatchObject({ line: 3 });
  });
  test('output reaches the caller even when the program fails later', () => {
    const result = runJs(`console.log(1); console.log(2); nope()`);
    expect(result.output).toEqual(['1', '2']);
    expect(result.ok).toBe(false);
  });
  test('unsupported features say so', () => {
    for (const code of [`async function f() {}`, `await 1`, `setTimeout(() => {}, 1)`, `new Promise(() => {})`, `import fs from 'fs'`, `const m = require('fs')`, `eval('1')`, `new Function('return 1')`, `function* g() { yield 1 }`, `/abc/.test('x')`, `window.alert`, `process.exit()`, `fetch('x')`, `globalThis.x`, `new Date()`, `Symbol('a')`, `with ({}) {}`]) {
      const error = fails(code);
      expect(`${code} -> ${error.name}`).toMatch(/Unsupported/);
      expect(error.message).toMatch(/isn't supported in the Talino playground yet/);
    }
    expect(runJs(`console.log(typeof window, typeof process, typeof require)`).output).toEqual(['undefined undefined undefined']);
  });
});
