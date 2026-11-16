import type { Runtime } from './runtime';
import { JsFunction, JsObject } from './values';

export function installString(rt: Runtime, globals: Map<string, unknown>) {
  const proto = rt.realm.string;
  const text = (thisValue: unknown): string => {
    if (thisValue === null || thisValue === undefined) return rt.throwError('TypeError', 'String.prototype method called on null or undefined');
    return rt.toStr(thisValue);
  };
  const def = (name: string, arity: number, fn: (s: string, args: unknown[]) => unknown) =>
    proto.hidden(name, rt.native(name, arity, (thisValue, args) => {
      const s = text(thisValue);
      rt.charge(s.length);
      return fn(s, args);
    }));
  const rel = (value: unknown, length: number, fallback: number) => {
    if (value === undefined) return fallback;
    const n = rt.toInt(value);
    return n < 0 ? Math.max(0, length + n) : Math.min(n, length);
  };
  const noRegex = (value: unknown, method: string) => {
    if (value instanceof JsObject) rt.unsupported(`Regular expressions in ${method}()`);
  };
  const pad = (s: string, args: unknown[], atStart: boolean) => {
    const target = rt.toInt(args[0]);
    const filler = args[1] === undefined ? ' ' : rt.toStr(args[1]);
    rt.checkString(target);
    if (target <= s.length || filler === '') return s;
    return atStart ? s.padStart(target, filler) : s.padEnd(target, filler);
  };
  const replaceWith = (s: string, args: unknown[], all: boolean, method: string) => {
    noRegex(args[0], method);
    const pattern = rt.toStr(args[0]);
    const replacer = args[1];
    let result: string;
    if (replacer instanceof JsFunction) {
      let out = '';
      let from = 0;
      for (;;) {
        const at = s.indexOf(pattern, from);
        if (at === -1) break;
        out += s.slice(from, at) + rt.toStr(rt.callFunction(replacer, undefined, [pattern, at, s]));
        from = at + pattern.length;
        rt.checkString(out.length);
        if (!all) break;
        if (pattern === '') {
          if (at >= s.length) break;
          out += s[at];
          from = at + 1;
        }
      }
      result = out + s.slice(from);
    } else {
      const to = rt.toStr(replacer);
      result = all ? s.replaceAll(pattern, to) : s.replace(pattern, to);
    }
    rt.checkString(result.length);
    return result;
  };

  def('toString', 0, (s) => s);
  def('valueOf', 0, (s) => s);
  def('toUpperCase', 0, (s) => s.toUpperCase());
  def('toLowerCase', 0, (s) => s.toLowerCase());
  def('trim', 0, (s) => s.trim());
  def('trimStart', 0, (s) => s.trimStart());
  def('trimEnd', 0, (s) => s.trimEnd());
  def('charAt', 1, (s, a) => s.charAt(rt.toInt(a[0])));
  def('charCodeAt', 1, (s, a) => s.charCodeAt(rt.toInt(a[0])));
  def('codePointAt', 1, (s, a) => s.codePointAt(rt.toInt(a[0])));
  def('at', 1, (s, a) => {
    const i = rt.toInt(a[0]);
    return s[i < 0 ? s.length + i : i];
  });
  def('indexOf', 1, (s, a) => (noRegex(a[0], 'indexOf'), s.indexOf(rt.toStr(a[0]), rt.toInt(a[1]))));
  def('lastIndexOf', 1, (s, a) => s.lastIndexOf(rt.toStr(a[0])));
  def('includes', 1, (s, a) => (noRegex(a[0], 'includes'), s.includes(rt.toStr(a[0]), rt.toInt(a[1]))));
  def('startsWith', 1, (s, a) => s.startsWith(rt.toStr(a[0]), rt.toInt(a[1])));
  def('endsWith', 1, (s, a) => s.endsWith(rt.toStr(a[0]), a[1] === undefined ? undefined : rt.toInt(a[1])));
  def('slice', 2, (s, a) => s.slice(rel(a[0], s.length, 0), rel(a[1], s.length, s.length)));
  def('substring', 2, (s, a) => {
    const clamp = (v: unknown, d: number) => (v === undefined ? d : Math.min(Math.max(rt.toInt(v), 0), s.length));
    return s.substring(clamp(a[0], 0), clamp(a[1], s.length));
  });
  def('substr', 2, (s, a) => {
    const start = rel(a[0], s.length, 0);
    return s.substr(start, a[1] === undefined ? s.length : Math.max(0, rt.toInt(a[1])));
  });
  def('split', 2, (s, a) => {
    noRegex(a[0], 'split');
    const limit = a[1] === undefined ? undefined : rt.toInt(a[1]) >>> 0;
    if (a[0] === undefined) return rt.newArray(limit === 0 ? [] : [s]);
    const parts = s.split(rt.toStr(a[0]), limit);
    rt.checkArray(parts.length);
    return rt.newArray(parts);
  });
  def('replace', 2, (s, a) => replaceWith(s, a, false, 'replace'));
  def('replaceAll', 2, (s, a) => replaceWith(s, a, true, 'replaceAll'));
  def('repeat', 1, (s, a) => {
    const n = rt.toInt(a[0]);
    if (n < 0 || n === Infinity) return rt.throwError('RangeError', `Invalid count value: ${rt.toStr(a[0])}`);
    rt.checkString(s.length * n);
    return s.repeat(n);
  });
  def('padStart', 2, (s, a) => pad(s, a, true));
  def('padEnd', 2, (s, a) => pad(s, a, false));
  def('concat', 1, (s, a) => {
    const out = s + a.map((v) => rt.toStr(v)).join('');
    rt.checkString(out.length);
    return out;
  });
  def('localeCompare', 1, (s, a) => {
    const other = rt.toStr(a[0]);
    return s < other ? -1 : s > other ? 1 : 0;
  });
  def('normalize', 0, (s) => s.normalize());
  for (const name of ['match', 'matchAll', 'search']) def(name, 1, () => rt.unsupported(`Regular expressions (${name})`));

  const ctor = rt.nativeClass('String', 1, proto, (_t, args) => (args.length === 0 ? '' : rt.toStr(args[0])), (args) => (args.length === 0 ? '' : rt.toStr(args[0])));
  ctor.hidden('fromCharCode', rt.native('fromCharCode', 1, (_t, args) => String.fromCharCode(...args.map((v) => rt.toInt(v)))));
  globals.set('String', ctor);

  installNumber(rt, globals);
}

const MAX_SAFE = Number.MAX_SAFE_INTEGER;

function group(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function installNumber(rt: Runtime, globals: Map<string, unknown>) {
  const proto = rt.realm.number;
  const num = (thisValue: unknown): number => {
    if (typeof thisValue !== 'number') return rt.throwError('TypeError', 'Number.prototype method called on a value that is not a number');
    return thisValue;
  };
  const def = (name: string, arity: number, fn: (n: number, args: unknown[]) => unknown) =>
    proto.hidden(name, rt.native(name, arity, (thisValue, args) => fn(num(thisValue), args)));

  def('toFixed', 1, (n, a) => {
    const digits = rt.toInt(a[0]);
    if (digits < 0 || digits > 100) return rt.throwError('RangeError', 'toFixed() digits argument must be between 0 and 100');
    return Math.abs(n) >= 1e21 ? String(n) : n.toFixed(digits);
  });
  def('toPrecision', 1, (n, a) => {
    if (a[0] === undefined) return String(n);
    const p = rt.toInt(a[0]);
    if (p < 1 || p > 100) return rt.throwError('RangeError', 'toPrecision() argument must be between 1 and 100');
    return n.toPrecision(p);
  });
  def('toString', 1, (n, a) => {
    const radix = a[0] === undefined ? 10 : rt.toInt(a[0]);
    if (radix < 2 || radix > 36) return rt.throwError('RangeError', 'toString() radix must be between 2 and 36');
    return n.toString(radix);
  });
  def('valueOf', 0, (n) => n);
  // en-US grouping with up to three decimals, written by hand because Hermes' Intl may be missing.
  def('toLocaleString', 0, (n) => {
    if (!Number.isFinite(n)) return Number.isNaN(n) ? 'NaN' : n < 0 ? '-∞' : '∞';
    const [whole, frac] = Math.abs(n).toFixed(3).split('.');
    const trimmed = frac.replace(/0+$/, '');
    return `${n < 0 ? '-' : ''}${group(whole)}${trimmed ? `.${trimmed}` : ''}`;
  });

  const convert = (args: unknown[]) => (args.length === 0 ? 0 : rt.toNum(args[0]));
  const ctor = rt.nativeClass('Number', 1, proto, (_t, args) => convert(args), (args) => convert(args));
  const set = (name: string, value: unknown) => ctor.hidden(name, value);
  set('MAX_SAFE_INTEGER', MAX_SAFE);
  set('MIN_SAFE_INTEGER', -MAX_SAFE);
  set('MAX_VALUE', Number.MAX_VALUE);
  set('MIN_VALUE', Number.MIN_VALUE);
  set('EPSILON', Number.EPSILON);
  set('POSITIVE_INFINITY', Infinity);
  set('NEGATIVE_INFINITY', -Infinity);
  set('NaN', NaN);
  const fnOf = (name: string, f: (v: unknown) => unknown) => set(name, rt.native(name, 1, (_t, args) => f(args[0])));
  fnOf('isInteger', (v) => typeof v === 'number' && Number.isInteger(v));
  fnOf('isSafeInteger', (v) => typeof v === 'number' && Number.isSafeInteger(v));
  fnOf('isFinite', (v) => typeof v === 'number' && Number.isFinite(v));
  fnOf('isNaN', (v) => typeof v === 'number' && Number.isNaN(v));
  const parseFloatFn = rt.native('parseFloat', 1, (_t, args) => parseFloat(rt.toStr(args[0])));
  const parseIntFn = rt.native('parseInt', 2, (_t, args) => parseInt(rt.toStr(args[0]), args[1] === undefined ? undefined : rt.toInt(args[1])));
  set('parseFloat', parseFloatFn);
  set('parseInt', parseIntFn);
  globals.set('Number', ctor);
  globals.set('parseFloat', parseFloatFn);
  globals.set('parseInt', parseIntFn);
  globals.set('isNaN', rt.native('isNaN', 1, (_t, args) => Number.isNaN(rt.toNum(args[0]))));
  globals.set('isFinite', rt.native('isFinite', 1, (_t, args) => Number.isFinite(rt.toNum(args[0]))));
  globals.set('NaN', NaN);
  globals.set('Infinity', Infinity);
  globals.set('undefined', undefined);

  const bool = rt.realm.boolean;
  bool.hidden('toString', rt.native('toString', 0, (t) => String(t)));
  bool.hidden('valueOf', rt.native('valueOf', 0, (t) => t));
  globals.set('Boolean', rt.nativeClass('Boolean', 1, bool, (_t, args) => rt.toBool(args[0]), (args) => rt.toBool(args[0])));
}
