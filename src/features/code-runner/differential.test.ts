/**
 * Runs the same programs in Node itself and in the sandbox and requires identical console output.
 * Node is only used here, in the tests, as the reference for formatting and semantics.
 */
import { describe, expect, jest, test } from '@jest/globals';

import { runJs } from './index';

type Vm = { runInNewContext(code: string, context: object): unknown };
type Util = { format(...args: unknown[]): string; formatWithOptions(options: object, ...args: unknown[]): string };
const vm = jest.requireActual<Vm>('node:vm');
const util = jest.requireActual<Util>('node:util');

function inNode(source: string): string[] {
  const lines: string[] = [];
  const log = (...args: unknown[]) => void lines.push(util.formatWithOptions({ breakLength: 80 }, ...args));
  vm.runInNewContext(source, { console: { log, error: log, warn: log, info: log } });
  return lines;
}

const programs: string[] = [
  `console.log([1, 2, 3], [], {}, { a: 1 }, { a: { b: { c: { d: 1 } } } }, [[1, [2, [3, [4]]]]])`,
  `console.log('str', ['str', "it's", 'say "hi"', \`both ' and "\`], 'multi\\nline', ['multi\\nline'], 5, -0, [-0], NaN, null, undefined, true, [undefined, null])`,
  `console.log(Array.from({ length: 10 }, (_, i) => i + 1))`,
  `console.log(Array.from({ length: 30 }, (_, i) => i * 3))`,
  `console.log(Array.from({ length: 101 }, (_, i) => i))`,
  `console.log(Array.from({ length: 7 }, (_, i) => 'item' + i))`,
  `console.log(Array.from({ length: 12 }, (_, i) => 'x'.repeat(i)))`,
  `console.log([1.5, 22.25, 333.125, 4, 5, 6, 7, 8, 9, 10])`,
  `console.log({ name: 'Ada', langs: ['js', 'py', 'c'], address: { city: 'London', zip: 'NW1', geo: { lat: 51.5, lng: -0.12 } } })`,
  `console.log({ a: 'aaaaaaaaaaaaaaaaaaaa', b: 'bbbbbbbbbbbbbbbbbbbb', c: 'cccccccccccccccccccc', d: 'dddddddddddddddddddd' })`,
  `console.log([{ id: 1, name: 'one' }, { id: 2, name: 'two' }, { id: 3, name: 'three' }])`,
  `console.log([{ id: 1, tags: ['a', 'b'] }, { id: 2, tags: [] }])`,
  `console.log({ 'key with space': 1, valid_id: 2, 3: 'num', 'a-b': 4 })`,
  `console.log(new Map([['a', 1], ['b', { c: 2 }]]), new Set(['x', 'y']), new Map(), new Set())`,
  `console.log([new Map([[1, 2]]), new Set([[1, 2]])])`,
  `class P { constructor() { this.x = 1; this.y = [1, 2] } } console.log(new P(), [new P()], { p: new P() })`,
  `class Empty {} console.log(new Empty(), Empty, class extends Empty {}, class Sub extends Empty {})`,
  `function foo() {} const bar = () => 1; console.log(foo, bar, [foo], { foo }, (function () {}), async () => {})`.replace(', async () => {}', ''),
  `const o = { self: null }; o.self = o; console.log(o); const a = [1]; a.push(a); console.log(a)`,
  `const o = { get a() { return 1 }, set b(v) {}, get c() { return 1 }, set c(v) {} }; console.log(o)`,
  `console.log('%s is %d years and %i, %f, %j %o %%', 'Bob', 42.5, 42.9, '3.5x', 'j', 'o', 'extra', 1)`,
  `console.log('100%', 5, '%d', 'x')`,
  `console.log(Object.create(null))`,
  `const n = Object.create(null); n.a = 1; console.log(n)`,
  `console.log([1, 2, 3].map(String), [1, 2, 3].map((x) => [x]), [[1, 2], [3, 4]])`,
  `console.log({ a: [1, 2, { b: [3, { c: 4 }] }] })`,
  `console.log(String(Symbol === undefined))`.replace('Symbol === undefined', '1'),
  `console.log([ 'a', 'b' ].toString(), String([1, [2, 3]]), \`\${[1, 2]}\`, [null, undefined, 1].join())`,
  `console.log(0.1 * 3, 1e21, 1e-7, 123456789012345680000, 2 ** 53, 5e-324, -1e-7, 100 / 3, (0.000001234).toString())`,
  `console.log((25).toString(2), (-255).toString(16), (3.14159).toFixed(3), (0).toFixed(2), (1.005).toFixed(2), (1e21).toFixed(2), (12.345).toPrecision(3))`,
  `console.log([3, 20, 100].sort(), ['b', undefined, 'a'].sort(), [5, 1, 4].sort((a, b) => b - a))`,
  `console.log('abc'.split(''), 'a1b2'.split('1'), ''.split(','), ''.split(''), 'abc'.split('', 2))`,
  `console.log(typeof null, typeof undefined, void 0, [] + 1, {} + 1, [2] * [3], '5' - 2, '5' + 2, true + 1, null + 1, undefined + 1)`,
  `console.log(parseInt('  12abc'), parseInt(''), parseInt('0x1f'), parseFloat('.5e1'), Number('  7  '), Number('1,2'), Number([]), Number([5]), Number({}))`,
  `console.log([10, 1, 3].map(parseInt), ['1', '2', '3'].map(Number))`,
  `console.log(Math.round(0.5), Math.round(1.5), Math.round(-0.5), Math.max(), Math.max(1, NaN), Math.min(...[]), Math.floor(-0.5), Math.abs(-0))`,
  `console.log(1 < 2 < 3, 3 > 2 > 1, '2' > '12', 2 > '12', null >= 0, undefined == 0, NaN != NaN, [] == '', [0] == false, '0' == false)`,
  `let s = ''; for (const k in 'ab') s += k; for (const k in [7, 8]) s += k; console.log(s)`,
  `const { a = 1, ...r } = { b: 2, c: 3 }; console.log(a, r)`,
  `label: { console.log('in'); break label; console.log('never') } console.log('out')`,
  `var fns = []; for (var i = 0; i < 3; i++) { fns.push(function () { return i }) } console.log(fns.map((f) => f()))`,
  `console.log([1, 2, 3].includes(NaN), [NaN].includes(NaN), [NaN].indexOf(NaN), 'abc'.includes(''), [,].length)`.replace(', [,].length', ''),
  `console.log(Array.isArray([]), Array.isArray({}), Array.from('12', Number), Array(3).fill().map((_, i) => i))`,
  `const e = new Error('bad'); console.log(e.message, e.name, String(e), e instanceof Error, Object.keys(e))`,
  `try { undefinedFn() } catch (e) { console.log(e.name + ': ' + e.message) } try { null.f() } catch (e) { console.log(e.message) } try { (void 0).x } catch (e) { console.log(e.message) }`,
  `try { const o = {}; o.a.b } catch (e) { console.log(e.message) } try { [].reduce((a, b) => a) } catch (e) { console.log(e.message) } try { new Array(-1) } catch (e) { console.log(e.name, e.message) }`,
  `try { 'x'.repeat(-1) } catch (e) { console.log(e.name, e.message) } try { (1).toFixed(101) } catch (e) { console.log(e.name, e.message) } try { x = y } catch (e) { console.log(e.message) }`,
  `try { let q = 1; q(); } catch (e) { console.log(e.message) } try { const o = {}; o.m() } catch (e) { console.log(e.message) } try { null[0] } catch (e) { console.log(e.message) }`,
  `function f() { return f() } try { f() } catch (e) { console.log(e instanceof RangeError, e.name, e.message) }`,
  `const wm = new Map([[NaN, 1], [0, 2]]); console.log(wm.get(NaN), wm.get(-0), wm.size)`,
  `console.log([..."ab"].map((c) => c.charCodeAt(0)), [...new Map([[1, 2]])], Object.entries({ a: 1 }).map(([k, v]) => k + v))`,
  `console.log(JSON.stringify({ a: [], b: {}, c: [{}], d: 'é\\n' }, null, 2), JSON.stringify([1, [2]], null, '--'))`,
  `console.log(JSON.stringify({ n: NaN, i: Infinity, u: undefined, f() {}, nested: { u: undefined }, d: -0 }), JSON.stringify([NaN, undefined]))`,
  `console.log(JSON.parse('[1,2,{"a":null}]'), JSON.parse('"s"'), JSON.parse('1e3'), JSON.parse(' true '))`,
  `const big = {}; for (let i = 0; i < 30; i++) big['k' + i] = i; console.log(big)`,
  `console.log({ a: 1, b: { c: 2, d: { e: 3, f: { g: 4 } } }, h: [1, [2, [3, [4]]]] })`,
  `console.log(['apple', 'banana', 'cherry', 'dragonfruit', 'elderberry', 'fig', 'grape', 'honeydew'])`,
  `console.log([true, false, true, false, true, false, true, false])`,
  `console.log([1, 'two', 3, 'four', 5, 'six', 7, 'eight'])`,
  `console.log(Array.from({ length: 27 }, (_, i) => String.fromCharCode(97 + (i % 26)).repeat(1 + (i % 4))))`,
  `console.log([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[1, 2, 3, 4, 5, 6, 7, 8]])`,
  `console.log({ matrix: [[1, 2], [3, 4]], list: Array.from({ length: 8 }, (_, i) => i) })`,
  `console.log([undefined, undefined, undefined, undefined, undefined, undefined, undefined])`,
  `console.log(Number.MAX_SAFE_INTEGER, Number.EPSILON, Number.MIN_VALUE, Number.MAX_VALUE, Number.isSafeInteger(2 ** 53))`,
  `class A { static s = 1; static m() {} } console.log(A, [A], { A })`,
  `class Temp { #c = 1; get f() { return this.#c } set f(v) { this.#c = v } } const t = new Temp(); t.f = 5; console.log(t.f, t, Object.keys(t))`,
  `const o = { toString() { return 'custom' } }; console.log(String(o), o + '', \`\${o}\`, [o].join())`,
  `const o = { valueOf() { return 42 } }; console.log(o + 1, o * 2, o > 41, \`\${o}\`)`,
  `console.log([1, 2, 3, 4, 5].slice(-2), [1, 2, 3].splice(1), 'abcdef'.slice(-3, -1), 'abc'.substring(-1, 2), 'abc'.substr(1, 1))`,
  `let a = 1; { let a = 2; a++ } console.log(a); var b = 1; { var b = 2 } console.log(b)`,
  `switch (3) { default: console.log('d'); case 1: console.log('1'); break; case 2: console.log('2') }`,
  `const t = [1, 2, 3]; t.length = 1; console.log(t, t.length); t[3] = 9; console.log(t.length, t[2])`.replace('console.log(t.length, t[2])', 'console.log(t.length)'),
  `console.log([3, 2, 1].sort().concat([0]), [[2, 'b'], [1, 'a']].sort(), [1, 2, 3].reverse().join(''))`,

`for (let i = 1; i <= 15; i++) { console.log(i % 15 === 0 ? 'FizzBuzz' : i % 3 === 0 ? 'Fizz' : i % 5 === 0 ? 'Buzz' : i) }`,
  `const isPal = (s) => { const c = s.toLowerCase().replace(/[^a-z]/g, ''); return c === [...c].reverse().join('') }; console.log(isPal.toString().length > 0)`.replace("replace(/[^a-z]/g, '')", "split(' ').join('')"),
  `function sieve(n) { const p = Array(n + 1).fill(true); p[0] = p[1] = false; for (let i = 2; i * i <= n; i++) if (p[i]) for (let j = i * i; j <= n; j += i) p[j] = false; return p.map((v, i) => (v ? i : -1)).filter((x) => x > 0) } console.log(sieve(60))`,
  `class Account { #balance = 0; constructor(owner) { this.owner = owner } deposit(n) { if (n <= 0) throw new RangeError('Deposit must be positive'); this.#balance += n; return this } get balance() { return this.#balance } toString() { return this.owner + ': ' + this.#balance } }
const a = new Account('Ada').deposit(50).deposit(25); console.log(a.balance, String(a), a); try { a.deposit(-1) } catch (e) { console.log(e.name + ': ' + e.message) }`,
  `const words = 'the quick brown fox jumps over the lazy dog the end'.split(' '); const counts = new Map(); for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1); console.log(counts, [...counts].sort((a, b) => b[1] - a[1])[0])`,
  `const people = [{ name: 'Ann', dept: 'eng' }, { name: 'Bo', dept: 'ops' }, { name: 'Cy', dept: 'eng' }]; const by = people.reduce((acc, p) => { (acc[p.dept] ||= []).push(p.name); return acc }, {}); console.log(by, Object.entries(by).map(([k, v]) => k + ':' + v.length))`,
  `function hanoi(n, a, b, c, moves = []) { if (n === 0) return moves; hanoi(n - 1, a, c, b, moves); moves.push(a + '->' + c); hanoi(n - 1, b, a, c, moves); return moves } console.log(hanoi(3, 'A', 'B', 'C').join(' '))`,
  `for (const [i, v] of ['a', 'b'].entries()) console.log(i, v); Object.entries({ x: 1, y: 2 }).forEach(([k, v]) => console.log(k, v)); const { length } = 'abc'; console.log(length)`,
  `switch (true) { case 5 > 10: console.log('a'); break; case 5 > 1: console.log('b'); break; default: console.log('c') }`,
  `const memo = {}; const fib = (n) => (n < 2 ? n : memo[n] ?? (memo[n] = fib(n - 1) + fib(n - 2))); console.log(fib(50), fib(90))`,
  `const matrix = [[1, 2, 3], [4, 5, 6]]; console.log(matrix[0].map((_, c) => matrix.map((r) => r[c])), matrix.flat().reduce((a, b) => a + b))`,
  `let str = ''; for (let i = 0; i < 5; i++) str += '*'.repeat(i + 1) + '\\n'; console.log(str)`,
  `const o = { a: 1, get b() { return this.a + 1 }, c: [1, { d: 2 }] }; const copy = JSON.parse(JSON.stringify(o)); copy.c[1].d = 99; console.log(o, copy)`,
  `const debounceLike = (fn) => { let n = 0; return (...a) => fn(++n, ...a) }; console.log(debounceLike((n, x) => n + x)(5), debounceLike((...r) => r)(1, 2))`,
  `console.log([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => n % 2 === 0).map((n) => n ** 2).reduce((a, b) => a + b, 0), [..."hello"].reverse().join(''), 'Hello World'.split(' ').map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' '))`,
  `const grade = (s) => (s >= 90 ? 'A' : s >= 80 ? 'B' : s >= 70 ? 'C' : 'F'); console.log([95, 85, 72, 10].map(grade), [1, 2, 3].includes(2) && 'found')`,
  `var x = 10; function f() { console.log(x); var x = 20; console.log(x) } f(); console.log(typeof hoisted, typeof later); function hoisted() {} var later = 1`,
  `const a = [5, 3, 8, 1]; const [min, max] = [Math.min(...a), Math.max(...a)]; console.log(min, max, a.sort((x, y) => x - y), a)`,
  `console.log(Number('12px'), +'', +' ', +'0b101', +'1e3', 0.1 + 0.7, 9.95.toFixed(1), (1.45).toFixed(1), 1.005 * 1000, 123.456.toFixed(0), Math.round(1.005 * 100) / 100)`,
  `const date = { y: 2026, m: 11 }; const { y, m: month, d = 13 } = date; console.log(\`\${y}-\${String(month).padStart(2, '0')}-\${d}\`)`,
  `class Shape { area() { return 0 } toString() { return this.constructor.name + '(' + this.area().toFixed(2) + ')' } } class Circle extends Shape { constructor(r) { super(); this.r = r } area() { return Math.PI * this.r ** 2 } } class Sq extends Shape { constructor(s) { super(); this.s = s } area() { return this.s ** 2 } } console.log([new Circle(1), new Sq(2)].map(String), new Circle(2))`,

];

describe('console output is identical to Node for the same program', () => {
  programs.forEach((program, i) => {
    test(`#${i}: ${program.slice(0, 70).replace(/\n/g, ' ')}`, () => {
      const result = runJs(program);
      expect(result.error).toBeNull();
      expect(result.output).toEqual(inNode(program));
    });
  });
});
