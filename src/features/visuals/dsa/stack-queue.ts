import { dsaStrings } from './strings';

export const CAPACITY = 8;

export type LinearOutcome = {
  /** Stack: bottom first, so the last item is the top. Queue: front first, so the first item is the front. */
  items: number[];
  ok: boolean;
  /** The item added or looked at, to highlight. */
  marked: number | null;
  /** The value taken out, if any. */
  taken: number | null;
  caption: string;
};

export type LinearOp = { kind: 'add'; value: number } | { kind: 'remove' } | { kind: 'peek' };

/** Stack: last in, first out. Push and pop both work at the top. */
export function applyStackOp(items: readonly number[], op: LinearOp, t: typeof dsaStrings.en.stack = dsaStrings.en.stack): LinearOutcome {
  const next = [...items];
  const refused = (caption: string): LinearOutcome => ({ items: next, ok: false, marked: null, taken: null, caption });
  switch (op.kind) {
    case 'add':
      if (next.length >= CAPACITY) return refused(t.overflow(CAPACITY));
      next.push(op.value);
      return { items: next, ok: true, marked: next.length - 1, taken: null, caption: t.push(op.value, next.length) };
    case 'remove': {
      const top = next.pop();
      return top === undefined ? refused(t.underflow) : { items: next, ok: true, marked: null, taken: top, caption: t.pop(top, next.length, next.at(-1) ?? null) };
    }
    case 'peek': {
      const top = next.at(-1);
      return top === undefined ? refused(t.peekEmpty) : { items: next, ok: true, marked: next.length - 1, taken: null, caption: t.peek(top) };
    }
  }
}

/** Queue: first in, first out. Enqueue at the rear, dequeue from the front. */
export function applyQueueOp(items: readonly number[], op: LinearOp, t: typeof dsaStrings.en.queue = dsaStrings.en.queue): LinearOutcome {
  const next = [...items];
  const refused = (caption: string): LinearOutcome => ({ items: next, ok: false, marked: null, taken: null, caption });
  switch (op.kind) {
    case 'add':
      if (next.length >= CAPACITY) return refused(t.overflow(CAPACITY));
      next.push(op.value);
      return { items: next, ok: true, marked: next.length - 1, taken: null, caption: t.enqueue(op.value, next.length) };
    case 'remove': {
      const front = next.shift();
      return front === undefined ? refused(t.underflow) : { items: next, ok: true, marked: null, taken: front, caption: t.dequeue(front, next.length, next[0] ?? null) };
    }
    case 'peek': {
      const front = next[0];
      return front === undefined ? refused(t.peekEmpty) : { items: next, ok: true, marked: 0, taken: null, caption: t.peek(front) };
    }
  }
}
