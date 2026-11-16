/** Moves plain data between the host (test cases, JSON-safe results) and the interpreter's values. */
import type { Runtime } from './runtime';
import { JsArray, JsFunction, JsMap, JsObject, JsSet } from './values';

const MAX_DEPTH = 200;

/** Host data in: arrays and plain objects become interpreter arrays and objects (a deep copy). */
export function fromHost(rt: Runtime, value: unknown, depth = 0): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return value;
  if (depth > MAX_DEPTH) return rt.throwError('RangeError', 'Maximum call stack size exceeded');
  if (Array.isArray(value)) return rt.newArray(value.map((item) => fromHost(rt, item, depth + 1)));
  if (typeof value === 'object') {
    const obj = rt.newObject();
    for (const key of Object.keys(value)) obj.props.set(key, fromHost(rt, (value as Record<string, unknown>)[key], depth + 1));
    return obj;
  }
  return undefined;
}

/**
 * Interpreter data out: plain host data. Maps become arrays of [key, value], Sets arrays,
 * functions a `[Function: name]` string, cycles `[Circular]`. Never carries a prototype.
 */
export function toHost(rt: Runtime, value: unknown, depth = 0, seen: JsObject[] = []): unknown {
  if (!(value instanceof JsObject)) return value;
  if (value instanceof JsFunction) return value.isClass ? `[class ${value.name}]` : `[Function: ${value.name || '(anonymous)'}]`;
  if (seen.includes(value)) return '[Circular]';
  if (depth > MAX_DEPTH) return '[Too deep]';
  seen.push(value);
  let out: unknown;
  if (value instanceof JsArray) out = value.items.map((item) => toHost(rt, item, depth + 1, seen));
  else if (value instanceof JsSet) out = Array.from(value.set, (item) => toHost(rt, item, depth + 1, seen));
  else if (value instanceof JsMap) out = Array.from(value.map, ([k, v]) => [toHost(rt, k, depth + 1, seen), toHost(rt, v, depth + 1, seen)]);
  else if (value.className === 'Error') out = `${rt.toStr(rt.getMember(value, 'name'))}: ${rt.toStr(rt.getMember(value, 'message'))}`;
  else {
    const plain: Record<string, unknown> = {};
    for (const key of rt.ownKeys(value)) {
      const raw = rt.getMember(value, key);
      // defineProperty keeps a `__proto__` key an ordinary own property.
      Object.defineProperty(plain, key, { value: toHost(rt, raw, depth + 1, seen), enumerable: true, writable: true, configurable: true });
    }
    out = plain;
  }
  seen.pop();
  return out;
}

/** Deep equality for graded answers: order-insensitive objects, numbers within 1e-9 (relative). */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    if (a === b) return true;
    if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
    return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  }
  if (a === b) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const ra = a as Record<string, unknown>;
    const rb = b as Record<string, unknown>;
    const keys = new Set([...Object.keys(ra), ...Object.keys(rb)]);
    for (const key of keys) {
      if (!deepEqual(own(ra, key), own(rb, key))) return false;
    }
    return true;
  }
  return false;
}

const own = (obj: Record<string, unknown>, key: string): unknown => (Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined);
