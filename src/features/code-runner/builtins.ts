/** The only names a program can see before it declares its own. Everything is an interpreter value. */
import { installArray } from './builtins-array';
import { installJson } from './builtins-json';
import { installString } from './builtins-string';
import { formatLog } from './format';
import type { Runtime } from './runtime';
import { Accessor, JsArray, JsFunction, JsMap, JsObject, JsSet } from './values';

/** Names real JavaScript has that the playground does not: using one stops the program with a friendly note. */
export const UNSUPPORTED_GLOBALS: ReadonlySet<string> = new Set([
  'Promise', 'setTimeout', 'setInterval', 'setImmediate', 'clearTimeout', 'clearInterval', 'queueMicrotask',
  'require', 'module', 'exports', 'process', 'window', 'globalThis', 'global', 'self', 'document', 'navigator',
  'fetch', 'XMLHttpRequest', 'WebSocket', 'localStorage', 'sessionStorage', 'alert', 'prompt', 'confirm',
  'eval', 'Function', 'Proxy', 'Reflect', 'Symbol', 'RegExp', 'Date', 'BigInt', 'WeakMap', 'WeakSet', 'WeakRef',
  'Intl', 'ArrayBuffer', 'Uint8Array', 'Int32Array', 'Float64Array', 'structuredClone', 'Buffer', 'TextEncoder', 'TextDecoder', 'URL',
  'async', 'await', 'EvalError', 'URIError', 'AggregateError', 'encodeURIComponent', 'decodeURIComponent',
]);

export function installBuiltins(rt: Runtime): Map<string, unknown> {
  const globals = new Map<string, unknown>();
  installObject(rt, globals);
  installFunction(rt);
  installErrors(rt, globals);
  installArray(rt, globals);
  installString(rt, globals);
  installCollections(rt, globals);
  installMath(rt, globals);
  installJson(rt, globals);
  installConsole(rt, globals);
  return globals;
}

function installObject(rt: Runtime, globals: Map<string, unknown>) {
  const proto = rt.realm.object;
  proto.hidden('hasOwnProperty', rt.native('hasOwnProperty', 1, (t, a) => ownProperty(rt, t, a[0])));
  proto.hidden('toString', rt.native('toString', 0, (t) => (t === undefined ? '[object Undefined]' : t === null ? '[object Null]' : '[object Object]')));
  proto.hidden('valueOf', rt.native('valueOf', 0, (t) => t));
  proto.hidden('isPrototypeOf', rt.native('isPrototypeOf', 1, (t, a) => {
    for (let o = a[0] instanceof JsObject ? a[0].proto : null; o; o = o.proto) if (o === t) return true;
    return false;
  }));

  const toObject = (value: unknown, what = 'Cannot convert undefined or null to object'): unknown => {
    if (value === null || value === undefined) return rt.throwError('TypeError', what);
    return value;
  };
  const ctor = rt.nativeClass('Object', 1, proto, (_t, a) => (a[0] === null || a[0] === undefined ? rt.newObject() : a[0]), (a) => (a[0] instanceof JsObject ? a[0] : rt.newObject()));
  const def = (name: string, arity: number, fn: (args: unknown[]) => unknown) => ctor.hidden(name, rt.native(name, arity, (_t, args) => fn(args)));

  def('keys', 1, (a) => rt.newArray(rt.ownKeys(toObject(a[0]))));
  def('values', 1, (a) => rt.newArray(rt.ownKeys(toObject(a[0])).map((k) => rt.getMember(a[0], k))));
  def('entries', 1, (a) => rt.newArray(rt.ownKeys(toObject(a[0])).map((k) => rt.newArray([k, rt.getMember(a[0], k)]))));
  def('getOwnPropertyNames', 1, (a) => rt.newArray([...rt.ownKeys(toObject(a[0]), true), ...(a[0] instanceof JsArray ? ['length'] : [])]));
  def('assign', 2, (a) => {
    const target = toObject(a[0]);
    for (const source of a.slice(1)) {
      if (source === null || source === undefined) continue;
      for (const key of rt.ownKeys(source)) rt.setMember(target, key, rt.getMember(source, key));
    }
    return target;
  });
  def('freeze', 1, (a) => {
    if (a[0] instanceof JsObject) a[0].frozen = true;
    return a[0];
  });
  def('isFrozen', 1, (a) => !(a[0] instanceof JsObject) || a[0].frozen);
  def('fromEntries', 1, (a) => {
    const out = rt.newObject();
    for (const entry of rt.iterate(a[0])) out.props.set(rt.toKey(rt.getMember(entry, 0)), rt.getMember(entry, 1));
    return out;
  });
  def('create', 2, (a) => {
    if (a[0] !== null && !(a[0] instanceof JsObject)) return rt.throwError('TypeError', `Object prototype may only be an Object or null: ${rt.toStr(a[0])}`);
    return new JsObject(a[0]);
  });
  def('getPrototypeOf', 1, (a) => {
    toObject(a[0]);
    if (a[0] instanceof JsObject) return a[0].proto;
    return typeof a[0] === 'string' ? rt.realm.string : typeof a[0] === 'number' ? rt.realm.number : rt.realm.boolean;
  });
  def('setPrototypeOf', 2, (a) => {
    const [target, next] = a;
    if (!(target instanceof JsObject)) return target;
    if (next !== null && !(next instanceof JsObject)) return rt.throwError('TypeError', 'Object prototype may only be an Object or null');
    for (let o = next as JsObject | null; o; o = o.proto) if (o === target) return rt.throwError('TypeError', 'Cyclic __proto__ value');
    target.proto = next;
    return target;
  });
  def('hasOwn', 2, (a) => ownProperty(rt, a[0], a[1]));
  def('is', 2, (a) => Object.is(a[0], a[1]));
  def('defineProperty', 3, (a) => {
    const [target, key, desc] = a;
    if (!(target instanceof JsObject)) return rt.throwError('TypeError', 'Object.defineProperty called on non-object');
    if (!(desc instanceof JsObject)) return rt.throwError('TypeError', 'Property description must be an object');
    const k = rt.toKey(key);
    const getter = rt.getMember(desc, 'get');
    const setter = rt.getMember(desc, 'set');
    if (getter instanceof JsFunction || setter instanceof JsFunction) {
      target.props.set(k, new Accessor(getter instanceof JsFunction ? getter : null, setter instanceof JsFunction ? setter : null));
    } else if (target instanceof JsArray && /^\d+$/.test(k)) rt.setMember(target, k, rt.getMember(desc, 'value'));
    else target.props.set(k, rt.getMember(desc, 'value'));
    if (rt.toBool(rt.getMember(desc, 'enumerable'))) target.nonEnum?.delete(k);
    else (target.nonEnum ??= new Set()).add(k);
    return target;
  });
  globals.set('Object', ctor);
}

function ownProperty(rt: Runtime, target: unknown, key: unknown): boolean {
  if (target === null || target === undefined) return rt.throwError('TypeError', 'Cannot convert undefined or null to object');
  const k = rt.toKey(key);
  if (typeof target === 'string') return k === 'length' || (/^\d+$/.test(k) && +k < target.length);
  if (target instanceof JsArray) return k === 'length' || (/^\d+$/.test(k) && +k < target.items.length) || target.props.has(k);
  return target instanceof JsObject && target.props.has(k) && !k.startsWith('#');
}

function installFunction(rt: Runtime) {
  const proto = rt.realm.function;
  const fn = (t: unknown, what: string): JsFunction => (t instanceof JsFunction ? t : (rt.throwError('TypeError', `Function.prototype.${what} called on a value that is not a function`)));
  proto.hidden('call', rt.native('call', 1, (t, a) => rt.callFunction(fn(t, 'call'), a[0], a.slice(1))));
  proto.hidden('apply', rt.native('apply', 2, (t, a) => rt.callFunction(fn(t, 'apply'), a[0], a[1] === undefined || a[1] === null ? [] : rt.iterate(a[1]))));
  proto.hidden('bind', rt.native('bind', 1, (t, a) => {
    const target = fn(t, 'bind');
    const bound = rt.native(`bound ${target.name}`, Math.max(0, target.arity - Math.max(0, a.length - 1)), (_t, rest) => rt.callFunction(target, a[0], [...a.slice(1), ...rest]));
    bound.nativeCtor = (rest) => rt.construct(target, [...a.slice(1), ...rest]);
    return bound;
  }));
  proto.hidden('toString', rt.native('toString', 0, (t) => {
    const f = fn(t, 'toString');
    return rt.functionSource(f) ?? `function ${f.name}() { [native code] }`;
  }));
  // `fn.constructor` exists in JavaScript and is the way to reach the real Function; here it just refuses.
  proto.hidden('constructor', rt.native('Function', 1, () => rt.unsupported('Function')));
}

function installErrors(rt: Runtime, globals: Map<string, unknown>) {
  const base = rt.realm.error;
  base.hidden('name', 'Error');
  base.hidden('message', '');
  base.hidden('toString', rt.native('toString', 0, (t) => {
    const name = rt.toStr(rt.getMember(t, 'name'));
    const message = rt.toStr(rt.getMember(t, 'message'));
    return name === '' ? message : message === '' ? name : `${name}: ${message}`;
  }));
  const make = (name: string, proto: JsObject, parent: JsFunction | null) => {
    rt.realm.errors.set(name, proto);
    const create = (args: unknown[], p: JsObject) => {
      const error = new JsObject(p);
      error.className = 'Error';
      const message = args[0] === undefined ? undefined : rt.toStr(args[0]);
      if (message !== undefined) error.hidden('message', message);
      const options = args[1];
      if (options instanceof JsObject && options.props.has('cause')) error.hidden('cause', options.props.get('cause'));
      const label = rt.toStr(rt.getMember(error, 'name'));
      error.hidden('stack', `${message ? `${label}: ${message}` : label}\n    at <anonymous>`);
      return error;
    };
    const ctor = rt.nativeClass(name, 1, proto, (_t, args) => create(args, proto), (args, newTarget) => create(args, (newTarget.props.get('prototype') as JsObject) ?? proto));
    if (parent) ctor.proto = parent;
    globals.set(name, ctor);
    return ctor;
  };
  const errorCtor = make('Error', base, null);
  for (const name of ['TypeError', 'RangeError', 'ReferenceError', 'SyntaxError']) {
    const proto = new JsObject(base);
    proto.hidden('name', name);
    proto.hidden('message', '');
    make(name, proto, errorCtor);
  }
}

function installCollections(rt: Runtime, globals: Map<string, unknown>) {
  const needNew = (name: string) => () => rt.throwError('TypeError', `Constructor ${name} requires 'new'`);
  const self = <T>(t: unknown, cls: new (...a: never[]) => T, name: string): T => (t instanceof cls ? t : (rt.throwError('TypeError', `Method ${name} called on incompatible receiver ${rt.inspect(t)}`)));
  const cb = (v: unknown) => (v instanceof JsFunction ? v : rt.throwError('TypeError', `${rt.inspect(v)} is not a function`));

  const mapProto = rt.realm.map;
  const M = (t: unknown) => self(t, JsMap, 'Map.prototype');
  const md = (name: string, arity: number, fn: (m: JsMap, a: unknown[]) => unknown) => mapProto.hidden(name, rt.native(name, arity, (t, a) => fn(M(t), a)));
  md('get', 1, (m, a) => m.map.get(a[0]));
  md('set', 2, (m, a) => {
    if (!m.map.has(a[0])) rt.checkArray(m.map.size + 1);
    m.map.set(a[0], a[1]);
    return m;
  });
  md('has', 1, (m, a) => m.map.has(a[0]));
  md('delete', 1, (m, a) => m.map.delete(a[0]));
  md('clear', 0, (m) => void m.map.clear());
  md('keys', 0, (m) => rt.newArray(Array.from(m.map.keys())));
  md('values', 0, (m) => rt.newArray(Array.from(m.map.values())));
  md('entries', 0, (m) => rt.newArray(Array.from(m.map, ([k, v]) => rt.newArray([k, v]))));
  md('forEach', 1, (m, a) => {
    const fn = cb(a[0]);
    for (const [k, v] of Array.from(m.map)) rt.callFunction(fn, a[1], [v, k, m]);
    return undefined;
  });
  mapProto.hidden('size', new Accessor(rt.native('size', 0, (t) => M(t).map.size), null));
  const mapCtor = rt.nativeClass('Map', 0, mapProto, needNew('Map'), (args, nt) => {
    const m = new JsMap(nt.props.get('prototype') as JsObject);
    if (args[0] !== undefined && args[0] !== null) {
      for (const entry of rt.iterate(args[0])) {
        if (!(entry instanceof JsObject)) return rt.throwError('TypeError', `Iterator value ${rt.toStr(entry)} is not an entry object`);
        m.map.set(rt.getMember(entry, 0), rt.getMember(entry, 1));
      }
      rt.checkArray(m.map.size);
    }
    return m;
  });
  globals.set('Map', mapCtor);

  const setProto = rt.realm.set;
  const S = (t: unknown) => self(t, JsSet, 'Set.prototype');
  const sd = (name: string, arity: number, fn: (s: JsSet, a: unknown[]) => unknown) => setProto.hidden(name, rt.native(name, arity, (t, a) => fn(S(t), a)));
  sd('add', 1, (s, a) => {
    if (!s.set.has(a[0])) rt.checkArray(s.set.size + 1);
    s.set.add(a[0]);
    return s;
  });
  sd('has', 1, (s, a) => s.set.has(a[0]));
  sd('delete', 1, (s, a) => s.set.delete(a[0]));
  sd('clear', 0, (s) => void s.set.clear());
  sd('values', 0, (s) => rt.newArray(Array.from(s.set)));
  sd('keys', 0, (s) => rt.newArray(Array.from(s.set)));
  sd('entries', 0, (s) => rt.newArray(Array.from(s.set, (v) => rt.newArray([v, v]))));
  sd('forEach', 1, (s, a) => {
    const fn = cb(a[0]);
    for (const v of Array.from(s.set)) rt.callFunction(fn, a[1], [v, v, s]);
    return undefined;
  });
  setProto.hidden('size', new Accessor(rt.native('size', 0, (t) => S(t).set.size), null));
  const setCtor = rt.nativeClass('Set', 0, setProto, needNew('Set'), (args, nt) => {
    const s = new JsSet(nt.props.get('prototype') as JsObject);
    if (args[0] !== undefined && args[0] !== null) {
      for (const v of rt.iterate(args[0])) s.set.add(v);
      rt.checkArray(s.set.size);
    }
    return s;
  });
  globals.set('Set', setCtor);
}

function installMath(rt: Runtime, globals: Map<string, unknown>) {
  const math = rt.newObject();
  const nums = (a: unknown[]) => a.map((v) => rt.toNum(v));
  for (const [name, value] of Object.entries({ PI: Math.PI, E: Math.E, LN2: Math.LN2, LN10: Math.LN10, LOG2E: Math.LOG2E, LOG10E: Math.LOG10E, SQRT2: Math.SQRT2, SQRT1_2: Math.SQRT1_2 })) math.hidden(name, value);
  const unary: Record<string, (x: number) => number> = {
    abs: Math.abs, ceil: Math.ceil, floor: Math.floor, round: Math.round, trunc: Math.trunc, sign: Math.sign, sqrt: Math.sqrt, cbrt: Math.cbrt,
    log: Math.log, log2: Math.log2, log10: Math.log10, exp: Math.exp, sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin,
    acos: Math.acos, atan: Math.atan, sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh, fround: Math.fround,
  };
  for (const [name, f] of Object.entries(unary)) math.hidden(name, rt.native(name, 1, (_t, a) => f(rt.toNum(a[0]))));
  math.hidden('pow', rt.native('pow', 2, (_t, a) => rt.toNum(a[0]) ** rt.toNum(a[1])));
  math.hidden('atan2', rt.native('atan2', 2, (_t, a) => Math.atan2(rt.toNum(a[0]), rt.toNum(a[1]))));
  math.hidden('max', rt.native('max', 2, (_t, a) => (rt.charge(a.length), Math.max(...nums(a)))));
  math.hidden('min', rt.native('min', 2, (_t, a) => (rt.charge(a.length), Math.min(...nums(a)))));
  math.hidden('hypot', rt.native('hypot', 2, (_t, a) => Math.hypot(...nums(a))));
  // Seeded, so a program prints the same thing every time it runs (tests can rely on it).
  math.hidden('random', rt.native('random', 0, () => rt.random()));
  globals.set('Math', math);
}

function installConsole(rt: Runtime, globals: Map<string, unknown>) {
  const console = rt.newObject();
  for (const name of ['log', 'info', 'debug', 'error', 'warn']) {
    console.hidden(name, rt.native(name, 0, (_t, args) => (rt.print(formatLog(rt, args)), undefined)));
  }
  globals.set('console', console);
}
