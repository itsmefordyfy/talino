import { describe, expect, test } from '@jest/globals';

import { deleteAtSteps, deleteValueSteps, insertAtSteps, insertHeadSteps, insertTailSteps, MAX_NODES, searchSteps } from './linked-list';

const last = <T>(items: readonly T[]) => items[items.length - 1]!;

describe('linked list operations', () => {
  const list = [3, 5, 8];
  test('insert at head makes the new node first without walking', () => {
    const steps = insertHeadSteps(list, 1);
    expect(last(steps).values).toEqual([1, 3, 5, 8]);
    expect(steps.every((step) => step.pointer === null)).toBe(true);
    expect(steps[1]?.floating).toEqual({ value: 1, next: 0 });
    expect(last(insertHeadSteps([], 9)).values).toEqual([9]);
    expect(insertHeadSteps([], 9)[1]?.floating?.next).toBeNull();
  });
  test('insert at tail walks to the last node first', () => {
    const steps = insertTailSteps(list, 9);
    expect(last(steps).values).toEqual([3, 5, 8, 9]);
    expect(steps.filter((step) => step.pointer !== null).map((step) => step.pointer)).toEqual([0, 1, 2, 2, 2]);
    expect(last(insertTailSteps([], 4)).values).toEqual([4]);
  });
  test('insert at an index lands at that index, for every valid index', () => {
    for (let index = 0; index <= list.length; index += 1) {
      const steps = insertAtSteps(list, index, 99);
      const expected = [...list];
      expected.splice(index, 0, 99);
      expect(last(steps).values).toEqual(expected);
      expect(last(steps).fresh).toBe(index);
    }
    expect(insertAtSteps(list, 4, 1)[0]?.refused).toBe(true);
    expect(insertAtSteps(list, -1, 1)[0]?.refused).toBe(true);
  });
  test('delete at an index removes exactly that node', () => {
    for (let index = 0; index < list.length; index += 1) {
      const expected = list.filter((_, position) => position !== index);
      expect(last(deleteAtSteps(list, index)).values).toEqual(expected);
    }
    expect(deleteAtSteps(list, 3)[0]?.refused).toBe(true);
    expect(deleteAtSteps([], 0)[0]?.refused).toBe(true);
    expect(deleteAtSteps(list, 1).some((step) => step.doomed === 1)).toBe(true);
  });
  test('delete by value removes the first match, and a missing value changes nothing', () => {
    expect(last(deleteValueSteps([1, 2, 1], 1)).values).toEqual([2, 1]);
    const miss = deleteValueSteps(list, 42);
    expect(last(miss).values).toEqual(list);
    expect(last(miss).refused).toBe(true);
  });
  test('search stops at the first match and reports its position', () => {
    const steps = searchSteps([4, 7, 7, 9], 7);
    expect(last(steps).found).toBe(1);
    expect(steps).toHaveLength(3);
    expect(last(searchSteps(list, 42)).found).toBeNull();
    expect(searchSteps(list, 42)).toHaveLength(1 + list.length + 1);
  });
  test('the list is capped and never mutated', () => {
    const full = Array.from({ length: MAX_NODES }, (_, index) => index);
    expect(insertHeadSteps(full, 1)[0]?.refused).toBe(true);
    expect(insertTailSteps(full, 1)[0]?.refused).toBe(true);
    const copy = [...list];
    insertAtSteps(list, 1, 4);
    deleteAtSteps(list, 1);
    expect(list).toEqual(copy);
  });
  test('every step keeps pointers inside the list', () => {
    for (const steps of [insertTailSteps(list, 1), insertAtSteps(list, 2, 1), deleteAtSteps(list, 2), searchSteps(list, 8)]) {
      for (const step of steps) {
        if (step.pointer !== null) expect(step.pointer).toBeLessThan(step.values.length);
      }
    }
  });
});
