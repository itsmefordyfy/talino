import type { Runtime } from './runtime';
import { JsArray, JsFunction, JsMap, JsObject, JsSet } from './values';

const sameValueZero = (a: unknown, b: unknown) => a === b || (a !== a && b !== b);

export function installArray(rt: Runtime, globals: Map<string, unknown>) {
  const proto = rt.realm.array;
  const def = (name: string, arity: number, fn: (self: JsArray, args: unknown[]) => unknown) => {
    proto.hidden(name, rt.native(name, arity, (thisValue, args) => {
      if (!(thisValue instanceof JsArray)) return rt.throwError('TypeError', `Array.prototype.${name} called on a value that is not an array`);
      rt.charge(thisValue.items.length);
      return fn(thisValue, args);
    }));
  };
  const callback = (value: unknown): JsFunction => {
    if (value instanceof JsFunction) return value;
    return rt.throwError('TypeError', `${rt.inspect(value)} is not a function`);
  };
  const mutable = (self: JsArray, what: string) => {
    if (self.frozen) rt.throwError('TypeError', `Cannot ${what}, object is not extensible`);
  };
  const relIndex = (value: unknown, length: number, fallback: number) => {
    if (value === undefined) return fallback;
    const n = rt.toInt(value);
    return n < 0 ? Math.max(0, length + n) : Math.min(n, length);
  };
  const sortWith = (items: unknown[], compare: unknown): unknown[] => {
    const defined: unknown[] = items.filter((v) => v !== undefined);
    const holes = items.length - defined.length;
    if (compare !== undefined) {
      const fn = callback(compare);
      defined.sort((a, b) => {
        const r = rt.toNum(rt.callFunction(fn, undefined, [a, b]));
        return Number.isNaN(r) ? 0 : r;
      });
    } else {
      const keyed = defined.map((v) => ({ v, k: rt.toStr(v) }));
      keyed.sort((a, b) => (a.k < b.k ? -1 : a.k > b.k ? 1 : 0));
      keyed.forEach((e, i) => (defined[i] = e.v));
    }
    for (let i = 0; i < holes; i++) defined.push(undefined);
    return defined;
  };
  const flatten = (items: unknown[], depth: number, out: unknown[]) => {
    for (const item of items) {
      if (item instanceof JsArray && depth > 0) flatten(item.items, depth - 1, out);
      else out.push(item);
      rt.checkArray(out.length);
    }
    return out;
  };
  const join = (self: JsArray, sep: string, seen: JsArray[]): string => {
    if (seen.includes(self)) return '';
    seen.push(self);
    const parts = self.items.map((v) => (v === null || v === undefined ? '' : v instanceof JsArray ? join(v, ',', seen) : rt.toStr(v)));
    seen.pop();
    const total = parts.reduce((n, p) => n + p.length + sep.length, 0);
    rt.checkString(total);
    return parts.join(sep);
  };

  def('push', 1, (self, args) => {
    mutable(self, `add property ${self.items.length}`);
    rt.checkArray(self.items.length + args.length);
    for (const a of args) self.items.push(a);
    return self.items.length;
  });
  def('pop', 0, (self) => (mutable(self, 'delete property'), self.items.pop()));
  def('shift', 0, (self) => (mutable(self, 'delete property'), self.items.shift()));
  def('unshift', 1, (self, args) => {
    mutable(self, 'add property');
    rt.checkArray(self.items.length + args.length);
    self.items.unshift(...args);
    return self.items.length;
  });
  def('slice', 2, (self, args) => {
    const n = self.items.length;
    return rt.newArray(self.items.slice(relIndex(args[0], n, 0), relIndex(args[1], n, n)));
  });
  def('splice', 2, (self, args) => {
    mutable(self, 'splice');
    const n = self.items.length;
    const start = relIndex(args[0], n, 0);
    const count = args.length === 0 ? 0 : args.length === 1 ? n - start : Math.min(Math.max(rt.toInt(args[1]), 0), n - start);
    const added = args.slice(2);
    rt.checkArray(n - count + added.length);
    return rt.newArray(self.items.splice(start, count, ...added));
  });
  def('indexOf', 1, (self, args) => {
    const from = relIndex(args[1], self.items.length, 0);
    for (let i = from; i < self.items.length; i++) if (self.items[i] === args[0]) return i;
    return -1;
  });
  def('lastIndexOf', 1, (self, args) => {
    for (let i = self.items.length - 1; i >= 0; i--) if (self.items[i] === args[0]) return i;
    return -1;
  });
  def('includes', 1, (self, args) => {
    const from = relIndex(args[1], self.items.length, 0);
    for (let i = from; i < self.items.length; i++) if (sameValueZero(self.items[i], args[0])) return true;
    return false;
  });
  def('join', 1, (self, args) => join(self, args[0] === undefined ? ',' : rt.toStr(args[0]), []));
  def('toString', 0, (self) => join(self, ',', []));
  def('concat', 1, (self, args) => {
    const out = self.items.slice();
    for (const a of args) {
      if (a instanceof JsArray) out.push(...a.items);
      else out.push(a);
      rt.checkArray(out.length);
    }
    return rt.newArray(out);
  });
  def('reverse', 0, (self) => (mutable(self, 'assign to read only property'), self.items.reverse(), self));
  def('toReversed', 0, (self) => rt.newArray(self.items.slice().reverse()));
  def('sort', 1, (self, args) => {
    mutable(self, 'assign to read only property');
    self.items = sortWith(self.items, args[0]);
    return self;
  });
  def('toSorted', 1, (self, args) => rt.newArray(sortWith(self.items.slice(), args[0])));
  def('at', 1, (self, args) => {
    const i = rt.toInt(args[0]);
    return self.items[i < 0 ? self.items.length + i : i];
  });
  def('fill', 1, (self, args) => {
    mutable(self, 'assign to read only property');
    const n = self.items.length;
    for (let i = relIndex(args[1], n, 0), end = relIndex(args[2], n, n); i < end; i++) self.items[i] = args[0];
    return self;
  });
  def('flat', 0, (self, args) => rt.newArray(flatten(self.items, args[0] === undefined ? 1 : rt.toNum(args[0]), [])));
  def('keys', 0, (self) => rt.newArray(self.items.map((_, i) => i)));
  def('values', 0, (self) => rt.newArray(self.items.slice()));
  def('entries', 0, (self) => rt.newArray(self.items.map((v, i) => rt.newArray([i, v]))));

  const each = (name: string, body: (self: JsArray, fn: JsFunction, thisArg: unknown) => unknown) =>
    def(name, 1, (self, args) => body(self, callback(args[0]), args[1]));
  const call = (fn: JsFunction, thisArg: unknown, self: JsArray, i: number) => rt.callFunction(fn, thisArg, [self.items[i], i, self]);

  each('forEach', (self, fn, t) => {
    for (let i = 0, n = self.items.length; i < n && i < self.items.length; i++) call(fn, t, self, i);
    return undefined;
  });
  each('map', (self, fn, t) => {
    const out: unknown[] = [];
    for (let i = 0, n = self.items.length; i < n; i++) out.push(i < self.items.length ? call(fn, t, self, i) : undefined);
    return rt.newArray(out);
  });
  each('filter', (self, fn, t) => {
    const out: unknown[] = [];
    for (let i = 0, n = self.items.length; i < n && i < self.items.length; i++) {
      const v = self.items[i];
      if (rt.toBool(call(fn, t, self, i))) out.push(v);
    }
    return rt.newArray(out);
  });
  each('flatMap', (self, fn, t) => {
    const out: unknown[] = [];
    for (let i = 0, n = self.items.length; i < n && i < self.items.length; i++) {
      const r = call(fn, t, self, i);
      if (r instanceof JsArray) out.push(...r.items);
      else out.push(r);
      rt.checkArray(out.length);
    }
    return rt.newArray(out);
  });
  each('find', (self, fn, t) => {
    for (let i = 0; i < self.items.length; i++) {
      const v = self.items[i];
      if (rt.toBool(call(fn, t, self, i))) return v;
    }
    return undefined;
  });
  each('findIndex', (self, fn, t) => {
    for (let i = 0; i < self.items.length; i++) if (rt.toBool(call(fn, t, self, i))) return i;
    return -1;
  });
  each('findLast', (self, fn, t) => {
    for (let i = self.items.length - 1; i >= 0; i--) {
      const v = self.items[i];
      if (rt.toBool(call(fn, t, self, i))) return v;
    }
    return undefined;
  });
  each('findLastIndex', (self, fn, t) => {
    for (let i = self.items.length - 1; i >= 0; i--) if (rt.toBool(call(fn, t, self, i))) return i;
    return -1;
  });
  each('some', (self, fn, t) => {
    for (let i = 0; i < self.items.length; i++) if (rt.toBool(call(fn, t, self, i))) return true;
    return false;
  });
  each('every', (self, fn, t) => {
    for (let i = 0; i < self.items.length; i++) if (!rt.toBool(call(fn, t, self, i))) return false;
    return true;
  });
  const reducer = (name: string, right: boolean) =>
    def(name, 1, (self, args) => {
      const fn = callback(args[0]);
      const n = self.items.length;
      let i = right ? n - 1 : 0;
      const step = right ? -1 : 1;
      let acc: unknown;
      if (args.length >= 2) acc = args[1];
      else {
        if (n === 0) return rt.throwError('TypeError', 'Reduce of empty array with no initial value');
        acc = self.items[i];
        i += step;
      }
      for (; i >= 0 && i < self.items.length; i += step) acc = rt.callFunction(fn, undefined, [acc, self.items[i], i, self]);
      return acc;
    });
  reducer('reduce', false);
  reducer('reduceRight', true);

  const ctor = rt.nativeClass(
    'Array',
    1,
    proto,
    (_t, args) => makeArray(args, proto),
    (args, newTarget) => makeArray(args, newTarget.props.get('prototype') as JsObject),
  );
  function makeArray(args: unknown[], p: JsObject): JsArray {
    if (args.length === 1 && typeof args[0] === 'number') {
      rt.checkArray(args[0]);
      return new JsArray(p, new Array<unknown>(args[0]).fill(undefined));
    }
    return new JsArray(p, args.slice());
  }
  ctor.hidden('isArray', rt.native('isArray', 1, (_t, args) => args[0] instanceof JsArray));
  ctor.hidden('of', rt.native('of', 0, (_t, args) => rt.newArray(args.slice())));
  ctor.hidden('from', rt.native('from', 1, (_t, args) => {
    const source = args[0];
    let items: unknown[];
    if (source instanceof JsArray || typeof source === 'string' || source instanceof JsSet || source instanceof JsMap) items = rt.iterate(source);
    else if (source instanceof JsObject) {
      const length = Math.max(0, rt.toInt(rt.getMember(source, 'length')));
      rt.checkArray(length);
      items = Array.from({ length }, (_, i) => rt.getMember(source, i));
    } else if (source === null || source === undefined) return rt.throwError('TypeError', `${source} is not iterable`);
    else items = [];
    if (args[1] !== undefined) {
      const fn = callback(args[1]);
      items = items.map((v, i) => rt.callFunction(fn, undefined, [v, i]));
    }
    return rt.newArray(items);
  }));
  globals.set('Array', ctor);
}
