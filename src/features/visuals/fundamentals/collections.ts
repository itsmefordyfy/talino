import { fundamentalsStrings } from './strings';

export const MAX_ITEMS = 10;

/** How a typed value is stored and shown: numbers and true/false as they are, anything else as quoted text. */
export const displayValue = (raw: string): string => {
  const text = raw.trim();
  return /^-?\d+(\.\d+)?$/.test(text) || text === 'true' || text === 'false' ? text : `"${text}"`;
};

export type ArrayOp = { kind: 'push'; value: string } | { kind: 'insert'; index: number; value: string } | { kind: 'removeAt'; index: number } | { kind: 'pop' } | { kind: 'swap'; i: number; j: number } | { kind: 'reverse' } | { kind: 'read'; index: number };

export type ArrayOutcome = { items: string[]; caption: string; ok: boolean; /** The indexes to highlight in the picture. */ marked: number[] };

/** One array operation on a copy of the items; indexes start at 0, and a bad index changes nothing and says why. */
export function applyArrayOp(items: readonly string[], op: ArrayOp, t = fundamentalsStrings.en.collections): ArrayOutcome {
  const next = [...items];
  const fail = (caption: string): ArrayOutcome => ({ items: next, caption, ok: false, marked: [] });
  const full = () => next.length >= MAX_ITEMS;
  switch (op.kind) {
    case 'push':
      if (op.value.trim() === '') return fail(t.needValue);
      if (full()) return fail(t.full(MAX_ITEMS));
      next.push(displayValue(op.value));
      return { items: next, caption: t.pushed(next.at(-1) ?? '', next.length - 1, next.length), ok: true, marked: [next.length - 1] };
    case 'insert': {
      if (op.value.trim() === '') return fail(t.needValue);
      if (full()) return fail(t.full(MAX_ITEMS));
      if (op.index < 0 || op.index > next.length) return fail(t.badIndex(op.index, next.length));
      const moved = next.length - op.index;
      next.splice(op.index, 0, displayValue(op.value));
      return { items: next, caption: t.inserted(displayValue(op.value), op.index, moved), ok: true, marked: [op.index] };
    }
    case 'removeAt': {
      if (op.index < 0 || op.index >= next.length) return fail(t.badIndex(op.index, next.length));
      const [gone] = next.splice(op.index, 1);
      return { items: next, caption: t.removed(gone ?? '', op.index, next.length - op.index), ok: true, marked: [] };
    }
    case 'pop': {
      if (next.length === 0) return fail(t.emptyArray);
      const gone = next.pop();
      return { items: next, caption: t.popped(gone ?? '', next.length), ok: true, marked: [] };
    }
    case 'swap': {
      if (op.i < 0 || op.i >= next.length) return fail(t.badIndex(op.i, next.length));
      if (op.j < 0 || op.j >= next.length) return fail(t.badIndex(op.j, next.length));
      const a = next[op.i] ?? '';
      next[op.i] = next[op.j] ?? '';
      next[op.j] = a;
      return { items: next, caption: t.swapped(op.i, op.j), ok: true, marked: [op.i, op.j] };
    }
    case 'reverse':
      next.reverse();
      return { items: next, caption: t.reversed, ok: true, marked: next.map((_, index) => index) };
    case 'read': {
      const value = next[op.index];
      return value === undefined ? { items: next, caption: t.readMissing(op.index, next.length), ok: false, marked: [] } : { items: next, caption: t.read(op.index, value), ok: true, marked: [op.index] };
    }
  }
}

export type Property = { key: string; value: string };
export type ObjectOp = { kind: 'set'; key: string; value: string } | { kind: 'delete'; key: string } | { kind: 'read'; key: string };
export type ObjectOutcome = { properties: Property[]; caption: string; ok: boolean; marked: string | null };

export const isKey = (key: string) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(key);

/** Adds, changes, deletes or reads a property by its key. A key is a name, not a position. */
export function applyObjectOp(properties: readonly Property[], op: ObjectOp, t = fundamentalsStrings.en.collections): ObjectOutcome {
  const next = properties.map((property) => ({ ...property }));
  const fail = (caption: string): ObjectOutcome => ({ properties: next, caption, ok: false, marked: null });
  const key = op.key.trim();
  if (!isKey(key)) return fail(t.badKey);
  const at = next.findIndex((property) => property.key === key);
  switch (op.kind) {
    case 'set': {
      if (op.value.trim() === '') return fail(t.needValue);
      const value = displayValue(op.value);
      if (at === -1) {
        if (next.length >= MAX_ITEMS) return fail(t.full(MAX_ITEMS));
        next.push({ key, value });
        return { properties: next, caption: t.propAdded(key, value), ok: true, marked: key };
      }
      const before = next[at]?.value ?? '';
      next[at] = { key, value };
      return { properties: next, caption: t.propChanged(key, before, value), ok: true, marked: key };
    }
    case 'delete':
      if (at === -1) return fail(t.noKey(key));
      next.splice(at, 1);
      return { properties: next, caption: t.propDeleted(key), ok: true, marked: null };
    case 'read':
      return at === -1 ? { properties: next, caption: t.noKey(key), ok: false, marked: null } : { properties: next, caption: t.propRead(key, next[at]?.value ?? ''), ok: true, marked: key };
  }
}
