import { describe, expect, test } from '@jest/globals';

import { applyQueueOp, applyStackOp, CAPACITY, type LinearOp, type LinearOutcome } from './stack-queue';

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
