/**
 * Everything the interpreter and the built-ins share: limits, errors, conversions, property access.
 * Nothing here evaluates syntax; `Interpreter` extends this and adds calls and construction.
 */
import { formatInspect } from './format';
import { Accessor, FatalError, JsArray, JsFunction, JsMap, JsObject, JsSet, ThrowSignal, createRealm, isObject, type NativeCtor, type NativeFn, type Realm } from './values';
import { defaultRunnerText, type RunnerText } from './strings';
import type { RunLimits } from './types';

export const MAX_ARRAY = 1_000_000;
export const MAX_STRING = 1_000_000;

const INDEX_KEY = /^(0|[1-9]\d{0,8})$/;
export const isIndexKey = (key: string) => INDEX_KEY.test(key);

export abstract class Runtime {
  readonly realm: Realm = createRealm();
  maxSteps: number;
  readonly maxOutput: number;
  readonly maxDepth: number;
  steps = 0;
  depth = 0;
  line: number | null = null;
  col: number | null = null;
  output: string[] = [];
  outputChars = 0;
  strict = false;
  random = mulberry32(0x7a11);

  /** The words for what the sandbox itself says (limits, unsupported syntax); JavaScript's own error texts stay English. */
  readonly msg: RunnerText;

  constructor(limits: RunLimits = {}, text: RunnerText = defaultRunnerText) {
    this.msg = text;
    this.maxSteps = limits.maxSteps ?? 300_000;
    this.maxOutput = limits.maxOutputChars ?? 20_000;
    this.maxDepth = limits.maxCallDepth ?? 200;
  }

  abstract callFunction(fn: unknown, thisValue: unknown, args: unknown[], calleeText?: string): unknown;
  abstract construct(fn: unknown, args: unknown[], newTarget?: JsFunction, calleeText?: string): unknown;
  abstract functionSource(fn: JsFunction): string | null;

  // ---- limits -----------------------------------------------------------------------------

  tick(n = 1) {
    this.steps += n;
    if (this.steps > this.maxSteps) throw this.fatal('Error', this.msg.ranTooLong);
  }

  /** Charges the work of a built-in that touches `n` items, so loops of big array calls still end. */
  charge(n: number) {
    if (n > 32) this.tick(Math.floor(n / 16));
  }

  fatal(name: string, message: string) {
    return new FatalError(name, message, this.line, this.col);
  }

  unsupported(what: string): never {
    throw this.fatal('Unsupported', this.msg.unsupported(what));
  }

  checkString(length: number) {
    if (length > MAX_STRING) this.throwError('RangeError', 'Invalid string length');
  }

  checkArray(length: number) {
    if (!(length >= 0) || length > MAX_ARRAY || !Number.isInteger(length)) this.throwError('RangeError', 'Invalid array length');
  }

  print(text: string) {
    if (this.outputChars + text.length > this.maxOutput) {
      this.output.push(text.slice(0, Math.max(0, this.maxOutput - this.outputChars)));
      this.outputChars = this.maxOutput;
      throw this.fatal('Error', this.msg.tooMuchOutput);
    }
    this.outputChars += text.length + 1;
    this.output.push(text);
  }

  // ---- making values ----------------------------------------------------------------------

  newObject(): JsObject {
    return new JsObject(this.realm.object);
  }

  newArray(items: unknown[] = []): JsArray {
    return new JsArray(this.realm.array, items);
  }

  newMap(): JsMap {
    return new JsMap(this.realm.map);
  }

  newSet(): JsSet {
    return new JsSet(this.realm.set);
  }

  native(name: string, arity: number, fn: NativeFn): JsFunction {
    const f = new JsFunction(this.realm.function, name, arity);
    f.native = fn;
    return f;
  }

  /** A built-in constructor `name` whose instances inherit from `proto` (also wired both ways). */
  nativeClass(name: string, arity: number, proto: JsObject, call: NativeFn, ctor: NativeCtor | null): JsFunction {
    const f = this.native(name, arity, call);
    f.nativeCtor = ctor;
    f.hidden('prototype', proto);
    proto.hidden('constructor', f);
    return f;
  }

  makeError(name: string, message: string): JsObject {
    const error = new JsObject(this.realm.errors.get(name) ?? this.realm.error);
    error.className = 'Error';
    error.hidden('message', message);
    error.hidden('stack', `${name}: ${message}\n    at <anonymous>`);
    return error;
  }

  throwError(name: string, message: string): never {
    throw new ThrowSignal(this.makeError(name, message), this.line, this.col);
  }

  // ---- conversions ------------------------------------------------------------------------

  typeOf(value: unknown): string {
    if (value === null) return 'object';
    if (value instanceof JsFunction) return 'function';
    return typeof value === 'object' ? 'object' : typeof value;
  }

  toBool(value: unknown): boolean {
    if (isObject(value)) return true;
    return Boolean(value);
  }

  toPrimitive(value: unknown, hint: 'string' | 'number' | 'default'): unknown {
    if (!isObject(value)) return value;
    const order = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
    for (const name of order) {
      const method = this.getMember(value, name);
      if (method instanceof JsFunction) {
        const result = this.callFunction(method, value, []);
        if (!isObject(result)) return result;
      }
    }
    return this.throwError('TypeError', 'Cannot convert object to primitive value');
  }

  toStr(value: unknown): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (isObject(value)) return this.toStr(this.toPrimitive(value, 'string'));
    return String(value);
  }

  toNum(value: unknown): number {
    if (typeof value === 'number') return value;
    if (isObject(value)) return this.toNum(this.toPrimitive(value, 'number'));
    return Number(value);
  }

  toInt(value: unknown): number {
    const n = this.toNum(value);
    if (Number.isNaN(n)) return 0;
    return Math.trunc(n);
  }

  toKey(value: unknown): string {
    return typeof value === 'string' ? value : this.toStr(value);
  }

  strictEquals(a: unknown, b: unknown): boolean {
    return a === b;
  }

  looseEquals(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (a == null || b == null) return a == null && b == null;
    const ao = isObject(a);
    const bo = isObject(b);
    if (ao && bo) return false;
    if (ao) return this.looseEquals(this.toPrimitive(a, 'default'), b);
    if (bo) return this.looseEquals(a, this.toPrimitive(b, 'default'));
    if (typeof a === typeof b) return false;
    return this.toNum(a) === this.toNum(b);
  }

  compare(op: '<' | '>' | '<=' | '>=', a: unknown, b: unknown): boolean {
    const pa = this.toPrimitive(a, 'number');
    const pb = this.toPrimitive(b, 'number');
    if (typeof pa === 'string' && typeof pb === 'string') {
      if (op === '<') return pa < pb;
      if (op === '>') return pa > pb;
      if (op === '<=') return pa <= pb;
      return pa >= pb;
    }
    const x = this.toNum(pa);
    const y = this.toNum(pb);
    if (op === '<') return x < y;
    if (op === '>') return x > y;
    if (op === '<=') return x <= y;
    return x >= y;
  }

  add(a: unknown, b: unknown): unknown {
    const pa = this.toPrimitive(a, 'default');
    const pb = this.toPrimitive(b, 'default');
    if (typeof pa === 'string' || typeof pb === 'string') {
      const sa = this.toStr(pa);
      const sb = this.toStr(pb);
      this.checkString(sa.length + sb.length);
      return sa + sb;
    }
    return this.toNum(pa) + this.toNum(pb);
  }

  inspect(value: unknown): string {
    return formatInspect(this, value);
  }

  /** A short description for messages like "x is not iterable". */
  describe(value: unknown): string {
    if (value instanceof JsFunction) return value.name ? `function ${value.name}` : 'function';
    if (isObject(value)) return value instanceof JsArray ? 'array' : 'object';
    return typeof value === 'string' ? `"${value}"` : String(value);
  }

  // ---- properties -------------------------------------------------------------------------

  keyText(key: unknown): string {
    return typeof key === 'string' ? key : isObject(key) ? 'object' : String(key);
  }

  lookup(start: JsObject, key: string, receiver: unknown): unknown {
    for (let o: JsObject | null = start; o; o = o.proto) {
      if (o.props.has(key)) {
        const value = o.props.get(key);
        if (value instanceof Accessor) return value.get ? this.callFunction(value.get, receiver, []) : undefined;
        return value;
      }
    }
    return undefined;
  }

  hasPropertyChain(start: JsObject, key: string): boolean {
    for (let o: JsObject | null = start; o; o = o.proto) if (o.props.has(key)) return true;
    return false;
  }

  getMember(base: unknown, key: unknown, receiver: unknown = base): unknown {
    if (base === null || base === undefined) {
      this.throwError('TypeError', `Cannot read properties of ${base} (reading '${this.keyText(key)}')`);
    }
    if (typeof base === 'string') {
      if (typeof key === 'number') return Number.isInteger(key) && key >= 0 && key < base.length ? base[key] : undefined;
      const k = this.toKey(key);
      if (k === 'length') return base.length;
      if (isIndexKey(k)) return +k < base.length ? base[+k] : undefined;
      return this.lookup(this.realm.string, k, base);
    }
    if (typeof base === 'number') return this.lookup(this.realm.number, this.toKey(key), base);
    if (typeof base === 'boolean') return this.lookup(this.realm.boolean, this.toKey(key), base);
    if (base instanceof JsArray) {
      if (typeof key === 'number') {
        if (Number.isInteger(key) && key >= 0) return key < base.items.length ? base.items[key] : undefined;
      } else {
        const k = this.toKey(key);
        if (k === 'length') return base.items.length;
        if (isIndexKey(k)) return +k < base.items.length ? base.items[+k] : undefined;
        return this.lookup(base, k, receiver);
      }
    }
    if (base instanceof JsFunction) {
      const k = this.toKey(key);
      if (!base.props.has(k)) {
        if (k === 'name') return base.name;
        if (k === 'length') return base.arity;
      }
      return this.lookup(base, k, receiver);
    }
    if (base instanceof JsObject) return this.lookup(base, this.toKey(key), receiver);
    return undefined;
  }

  setMember(base: unknown, key: unknown, value: unknown): void {
    if (base === null || base === undefined) {
      this.throwError('TypeError', `Cannot set properties of ${base} (setting '${this.keyText(key)}')`);
    }
    if (!(base instanceof JsObject)) return;
    if (base instanceof JsArray) {
      const index = typeof key === 'number' ? key : null;
      if (index !== null && Number.isInteger(index) && index >= 0) return this.setIndex(base, index, value);
      const k = this.toKey(key);
      if (k === 'length') return this.setLength(base, this.toNum(value));
      if (isIndexKey(k)) return this.setIndex(base, +k, value);
    }
    const k = this.toKey(key);
    for (let o: JsObject | null = base; o; o = o.proto) {
      if (!o.props.has(k)) continue;
      const found = o.props.get(k);
      if (found instanceof Accessor) {
        if (found.set) this.callFunction(found.set, base, [value]);
        else if (this.strict) this.throwError('TypeError', `Cannot set property ${k} of #<${base.className}> which has only a getter`);
        return;
      }
      break;
    }
    if (base.frozen) {
      if (this.strict) this.throwError('TypeError', `Cannot assign to read only property '${k}' of object`);
      return;
    }
    base.props.set(k, value);
  }

  setIndex(array: JsArray, index: number, value: unknown) {
    if (array.frozen) {
      if (this.strict) this.throwError('TypeError', `Cannot assign to read only property '${index}' of object '[object Array]'`);
      return;
    }
    if (index >= array.items.length) {
      this.checkArray(index + 1);
      while (array.items.length < index) array.items.push(undefined);
    }
    array.items[index] = value;
  }

  setLength(array: JsArray, length: number) {
    this.checkArray(length);
    if (array.frozen) return;
    if (length < array.items.length) array.items.length = length;
    else while (array.items.length < length) array.items.push(undefined);
  }

  deleteMember(base: unknown, key: unknown): boolean {
    if (base === null || base === undefined) {
      this.throwError('TypeError', `Cannot convert undefined or null to object`);
    }
    if (!(base instanceof JsObject) || base.frozen) return !(base instanceof JsObject);
    const k = this.toKey(key);
    if (base instanceof JsArray && isIndexKey(k)) {
      if (+k < base.items.length) base.items[+k] = undefined;
      return true;
    }
    base.props.delete(k);
    base.nonEnum?.delete(k);
    return true;
  }

  hasProperty(base: unknown, key: unknown): boolean {
    if (!(base instanceof JsObject)) {
      return this.throwError('TypeError', `Cannot use 'in' operator to search for '${this.keyText(key)}' in ${this.toStr(base)}`);
    }
    const k = this.toKey(key);
    if (base instanceof JsArray && (k === 'length' || (isIndexKey(k) && +k < base.items.length))) return true;
    return this.hasPropertyChain(base, k);
  }

  /** Own enumerable string keys in JavaScript's order: integer-like keys first, then insertion order. */
  ownKeys(value: unknown, includeHidden = false): string[] {
    if (typeof value === 'string') return Array.from({ length: value.length }, (_, i) => String(i));
    if (!(value instanceof JsObject)) return [];
    const keys: string[] = [];
    if (value instanceof JsArray) for (let i = 0; i < value.items.length; i++) keys.push(String(i));
    const numeric: string[] = [];
    const named: string[] = [];
    for (const key of value.props.keys()) {
      if (key.startsWith('#')) continue;
      if (!includeHidden && value.nonEnum?.has(key)) continue;
      (isIndexKey(key) ? numeric : named).push(key);
    }
    numeric.sort((a, b) => +a - +b);
    return keys.concat(numeric, named);
  }

  /** The values a spread, `for...of`, destructuring or Array.from walks. */
  iterate(value: unknown, text?: string): unknown[] {
    if (value instanceof JsArray) {
      this.charge(value.items.length);
      return value.items.slice();
    }
    if (typeof value === 'string') return Array.from(value);
    if (value instanceof JsSet) return Array.from(value.set);
    if (value instanceof JsMap) return Array.from(value.map, ([k, v]) => this.newArray([k, v]));
    return this.throwError('TypeError', `${text ?? this.describe(value)} is not iterable`);
  }
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
