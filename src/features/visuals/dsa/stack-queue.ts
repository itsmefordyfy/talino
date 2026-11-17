import { dsaStrings } from './strings';
import { stackQueueStrings } from './stack-queue-strings';

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

export type DequeOp =
  | { kind: 'addFront'; value: number }
  | { kind: 'addBack'; value: number }
  | { kind: 'removeFront' }
  | { kind: 'removeBack' }
  | { kind: 'peekFront' }
  | { kind: 'peekBack' };

/** Deque: a double-ended queue. Add, remove and peek at either end. */
export function applyDequeOp(items: readonly number[], op: DequeOp, t: typeof stackQueueStrings.en.deque = stackQueueStrings.en.deque): LinearOutcome {
  const next = [...items];
  const refused = (caption: string): LinearOutcome => ({ items: next, ok: false, marked: null, taken: null, caption });
  switch (op.kind) {
    case 'addFront':
      if (next.length >= CAPACITY) return refused(t.overflow(CAPACITY));
      next.unshift(op.value);
      return { items: next, ok: true, marked: 0, taken: null, caption: t.addFront(op.value, next.length) };
    case 'addBack':
      if (next.length >= CAPACITY) return refused(t.overflow(CAPACITY));
      next.push(op.value);
      return { items: next, ok: true, marked: next.length - 1, taken: null, caption: t.addBack(op.value, next.length) };
    case 'removeFront': {
      const front = next.shift();
      return front === undefined ? refused(t.underflow) : { items: next, ok: true, marked: null, taken: front, caption: t.removeFront(front, next.length) };
    }
    case 'removeBack': {
      const back = next.pop();
      return back === undefined ? refused(t.underflow) : { items: next, ok: true, marked: null, taken: back, caption: t.removeBack(back, next.length) };
    }
    case 'peekFront':
      return next.length === 0 ? refused(t.peekEmpty) : { items: next, ok: true, marked: 0, taken: null, caption: t.peekFront(next[0] ?? 0) };
    case 'peekBack':
      return next.length === 0 ? refused(t.peekEmpty) : { items: next, ok: true, marked: next.length - 1, taken: null, caption: t.peekBack(next[next.length - 1] ?? 0) };
  }
}

/** The name of an operation, for the counter and the complexity note. */
export type OperationName = 'add' | 'remove' | 'peek' | DequeOp['kind'];

/** One recorded moment: the structure after an operation, the values taken out so far, and what the operation said. */
export type LinearFrame = {
  items: number[];
  /** Everything removed so far, in order. */
  taken: number[];
  marked: number | null;
  /** False when the operation was refused (an overflow or an underflow) and nothing changed. */
  ok: boolean;
  /** Null for the starting state: the screen shows its own introduction. */
  caption: string | null;
  /** The operation that made this frame; null for the starting state. */
  op: OperationName | null;
};

/** Every state since the start, oldest first. The first frame is always the starting state. */
export type LinearHistory = readonly LinearFrame[];

export const startHistory = (items: readonly number[]): LinearHistory => [{ items: [...items], taken: [], marked: null, ok: true, caption: null, op: null }];

export const currentFrame = (history: LinearHistory): LinearFrame => history[history.length - 1] ?? { items: [], taken: [], marked: null, ok: true, caption: null, op: null };

/** How many operations have been run (and not undone). A refused one counts: the attempt was made. */
export const operationCount = (history: LinearHistory): number => Math.max(0, history.length - 1);

/** Add the result of one operation as a new frame. */
export function recordOutcome(history: LinearHistory, outcome: LinearOutcome, op: OperationName): LinearHistory {
  const before = currentFrame(history);
  const taken = outcome.taken === null ? before.taken : [...before.taken, outcome.taken];
  return [...history, { items: [...outcome.items], taken, marked: outcome.marked, ok: outcome.ok, caption: outcome.caption, op }];
}

/** Undo the last operation; the starting state cannot be undone further. */
export const undoLast = (history: LinearHistory): LinearHistory => (history.length > 1 ? history.slice(0, -1) : history);

/** Back to the starting state. */
export const resetHistory = (history: LinearHistory): LinearHistory => history.slice(0, 1);
