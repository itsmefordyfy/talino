import { describe, expect, test } from '@jest/globals';

import { applyDequeOp, applyQueueOp, applyStackOp, CAPACITY, currentFrame, operationCount, recordOutcome, resetHistory, startHistory, undoLast, type DequeOp, type LinearHistory, type LinearOp, type LinearOutcome } from './stack-queue';

function run(apply: (items: readonly number[], op: LinearOp) => LinearOutcome, ops: LinearOp[]) {
  let items: number[] = [];
  const taken: number[] = [];
  for (const op of ops) {
    const outcome = apply(items, op);
    items = outcome.items;
    if (outcome.taken !== null) taken.push(outcome.taken);
  }
  return { items, taken };
}
const add = (value: number): LinearOp => ({ kind: 'add', value });
const remove: LinearOp = { kind: 'remove' };

describe('stack', () => {
  test('last in, first out', () => {
    const { items, taken } = run(applyStackOp, [add(1), add(2), add(3), remove, remove]);
    expect(taken).toEqual([3, 2]);
    expect(items).toEqual([1]);
  });
  test('pop and peek on an empty stack are refused', () => {
    expect(applyStackOp([], remove).ok).toBe(false);
    expect(applyStackOp([], { kind: 'peek' }).ok).toBe(false);
  });
  test('peek shows the top without removing it', () => {
    const outcome = applyStackOp([1, 2], { kind: 'peek' });
    expect(outcome.items).toEqual([1, 2]);
    expect(outcome.marked).toBe(1);
    expect(outcome.caption).toContain('2');
  });
  test('overflow is refused and does not change the stack', () => {
    const full = Array.from({ length: CAPACITY }, (_, index) => index);
    const outcome = applyStackOp(full, add(99));
    expect(outcome.ok).toBe(false);
    expect(outcome.items).toEqual(full);
  });
});

describe('queue', () => {
  test('first in, first out', () => {
    const { items, taken } = run(applyQueueOp, [add(1), add(2), add(3), remove, remove]);
    expect(taken).toEqual([1, 2]);
    expect(items).toEqual([3]);
  });
  test('dequeue and peek on an empty queue are refused; peek looks at the front', () => {
    expect(applyQueueOp([], remove).ok).toBe(false);
    expect(applyQueueOp([], { kind: 'peek' }).ok).toBe(false);
    const outcome = applyQueueOp([4, 5], { kind: 'peek' });
    expect(outcome.marked).toBe(0);
    expect(outcome.items).toEqual([4, 5]);
  });
  test('does not mutate its input', () => {
    const input = [1, 2];
    applyQueueOp(input, remove);
    applyStackOp(input, remove);
    expect(input).toEqual([1, 2]);
  });
});

describe('same inputs, opposite orders', () => {
  test('a stack gives back the reverse of a queue', () => {
    const pushes = [add(1), add(2), add(3), remove, remove, remove];
    expect(run(applyStackOp, pushes).taken).toEqual([3, 2, 1]);
    expect(run(applyQueueOp, pushes).taken).toEqual([1, 2, 3]);
  });
});

describe('history: Back and Reset', () => {
  const push = (history: LinearHistory, value: number) => recordOutcome(history, applyStackOp(currentFrame(history).items, add(value)), 'add');
  const pop = (history: LinearHistory) => recordOutcome(history, applyStackOp(currentFrame(history).items, remove), 'remove');

  test('starts as one frame with no operations', () => {
    const history = startHistory([4, 9]);
    expect(operationCount(history)).toBe(0);
    expect(currentFrame(history)).toMatchObject({ items: [4, 9], taken: [], caption: null, op: null, ok: true });
  });

  test('every operation is recorded, and the counter counts them', () => {
    let history = startHistory([4, 9]);
    history = push(history, 7);
    history = pop(history);
    history = pop(history);
    expect(operationCount(history)).toBe(3);
    expect(currentFrame(history).items).toEqual([4]);
    expect(currentFrame(history).taken).toEqual([7, 9]);
    expect(currentFrame(history).op).toBe('remove');
  });

  test('Back restores exactly the previous state, including the taken list and the caption', () => {
    let history = startHistory([4, 9]);
    history = push(history, 7);
    const afterPush = currentFrame(history);
    history = pop(history);
    expect(currentFrame(history).taken).toEqual([7]);
    history = undoLast(history);
    expect(currentFrame(history)).toEqual(afterPush);
    expect(currentFrame(history).taken).toEqual([]);
    expect(operationCount(history)).toBe(1);
    history = undoLast(history);
    expect(currentFrame(history).items).toEqual([4, 9]);
    expect(operationCount(history)).toBe(0);
  });

  test('Back at the start does nothing, and a new operation after Back replaces the undone one', () => {
    const start = startHistory([1]);
    expect(undoLast(start)).toEqual(start);
    let history = push(start, 5);
    history = undoLast(history);
    history = push(history, 6);
    expect(currentFrame(history).items).toEqual([1, 6]);
    expect(operationCount(history)).toBe(1);
  });

  test('a refused operation is recorded without changing the items, and Back removes it', () => {
    let history = startHistory([]);
    history = pop(history);
    expect(currentFrame(history).ok).toBe(false);
    expect(currentFrame(history).items).toEqual([]);
    expect(operationCount(history)).toBe(1);
    history = undoLast(history);
    expect(operationCount(history)).toBe(0);
    expect(currentFrame(history).ok).toBe(true);
  });

  test('Reset returns the starting state from any depth and drops the rest', () => {
    let history = startHistory([4, 9]);
    for (let value = 1; value <= 5; value += 1) history = push(history, value);
    history = pop(history);
    const reset = resetHistory(history);
    expect(reset).toEqual(startHistory([4, 9]));
    expect(operationCount(reset)).toBe(0);
  });

  test('history never changes the history it is given', () => {
    const history = startHistory([4, 9]);
    const next = push(history, 7);
    undoLast(next);
    resetHistory(next);
    expect(operationCount(history)).toBe(0);
    expect(operationCount(next)).toBe(1);
  });

  test('undoing every operation of a random run walks back through each earlier state', () => {
    let history = startHistory([2, 3]);
    const seen = [currentFrame(history)];
    const ops: LinearOp[] = [add(1), add(2), remove, { kind: 'peek' }, remove, remove, remove, remove, add(9)];
    for (const op of ops) {
      history = recordOutcome(history, applyQueueOp(currentFrame(history).items, op), op.kind);
      seen.push(currentFrame(history));
    }
    for (let i = seen.length - 2; i >= 0; i -= 1) {
      history = undoLast(history);
      expect(currentFrame(history)).toEqual(seen[i]);
    }
  });
});

describe('deque', () => {
  const run = (ops: DequeOp[], start: number[] = []) => {
    let items = start;
    const taken: number[] = [];
    for (const op of ops) {
      const outcome = applyDequeOp(items, op);
      items = outcome.items;
      if (outcome.taken !== null) taken.push(outcome.taken);
    }
    return { items, taken };
  };

  test('adds and removes at both ends', () => {
    const { items, taken } = run([{ kind: 'addBack', value: 1 }, { kind: 'addBack', value: 2 }, { kind: 'addFront', value: 0 }, { kind: 'removeBack' }, { kind: 'removeFront' }]);
    expect(items).toEqual([1]);
    expect(taken).toEqual([2, 0]);
  });

  test('used at one end it behaves as a stack, at opposite ends as a queue', () => {
    const adds: DequeOp[] = [1, 2, 3].map((value) => ({ kind: 'addBack', value }));
    expect(run([...adds, { kind: 'removeBack' }, { kind: 'removeBack' }, { kind: 'removeBack' }]).taken).toEqual([3, 2, 1]);
    expect(run([...adds, { kind: 'removeFront' }, { kind: 'removeFront' }, { kind: 'removeFront' }]).taken).toEqual([1, 2, 3]);
  });

  test('peeks look at the right end without removing', () => {
    const front = applyDequeOp([4, 5, 6], { kind: 'peekFront' });
    const back = applyDequeOp([4, 5, 6], { kind: 'peekBack' });
    expect([front.marked, back.marked]).toEqual([0, 2]);
    expect(front.items).toEqual([4, 5, 6]);
    expect(front.caption).toContain('4');
    expect(back.caption).toContain('6');
  });

  test('refuses on empty and when full, and does not mutate its input', () => {
    for (const kind of ['removeFront', 'removeBack', 'peekFront', 'peekBack'] as const) expect(applyDequeOp([], { kind }).ok).toBe(false);
    const full = Array.from({ length: CAPACITY }, (_, index) => index);
    expect(applyDequeOp(full, { kind: 'addFront', value: 99 }).ok).toBe(false);
    expect(applyDequeOp(full, { kind: 'addBack', value: 99 }).items).toEqual(full);
    const input = [1, 2];
    applyDequeOp(input, { kind: 'removeFront' });
    applyDequeOp(input, { kind: 'addFront', value: 0 });
    expect(input).toEqual([1, 2]);
  });
});
