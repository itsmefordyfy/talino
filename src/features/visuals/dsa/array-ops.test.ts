import { describe, expect, test } from '@jest/globals';

import { appendSteps, deleteAtSteps, idleStep, insertAtSteps, makeArray, MAX_LENGTH, searchSteps, traverseSteps, valuesOf } from './array-ops';

const last = <T>(items: readonly T[]) => items[items.length - 1]!;
const list = [4, 8, 15, 16];

describe('makeArray', () => {
  test('gives 4 to 10 distinct numbers, whatever size is asked', () => {
    expect(makeArray(4)).toHaveLength(4);
    expect(makeArray(10)).toHaveLength(10);
    expect(makeArray(1)).toHaveLength(4);
    expect(makeArray(99)).toHaveLength(10);
    expect(new Set(makeArray(10)).size).toBe(10);
  });
});

describe('insert at an index', () => {
  test('every valid index ends with the value there and the others in order', () => {
    for (let index = 0; index <= list.length; index += 1) {
      const expected = [...list];
      expected.splice(index, 0, 99);
      const steps = insertAtSteps(list, index, 99);
      expect(valuesOf(last(steps))).toEqual(expected);
      expect(last(steps).cells[index]).toBe(99);
      expect(last(steps).fresh).toBe(index);
    }
  });
  test('each shift is its own step, last element first, with one read and one write each', () => {
    const steps = insertAtSteps(list, 1, 99);
    const shifts = steps.filter((step) => step.reading !== null);
    expect(shifts.map((step) => [step.reading, step.writing])).toEqual([[3, 4], [2, 3], [1, 2]]);
    expect(shifts.map((step) => [step.reads, step.writes])).toEqual([[1, 1], [2, 2], [3, 3]]);
    expect(steps).toHaveLength(1 + 3 + 1);
  });
  test('counts: n - index shifts cost that many reads and writes plus one write for the new value', () => {
    const final = last(insertAtSteps(list, 0, 99));
    expect(final.reads).toBe(4);
    expect(final.writes).toBe(5);
    expect(final.complexity).toBe('On');
  });
  test('inserting at the end moves nothing and is O(1)', () => {
    const steps = insertAtSteps(list, list.length, 99);
    expect(steps).toHaveLength(2);
    expect(last(steps).reads).toBe(0);
    expect(last(steps).writes).toBe(1);
    expect(last(steps).complexity).toBe('O1');
  });
  test('inserting into an empty array works', () => {
    expect(valuesOf(last(insertAtSteps([], 0, 5)))).toEqual([5]);
  });
  test('a bad index or a full array is refused and nothing changes', () => {
    for (const index of [-1, 5, 1.5]) {
      const refused = insertAtSteps(list, index, 1);
      expect(refused).toHaveLength(1);
      expect(refused[0]?.refused).toBe(true);
      expect(valuesOf(refused[0]!)).toEqual(list);
    }
    const full = Array.from({ length: MAX_LENGTH }, (_, index) => index);
    expect(insertAtSteps(full, 2, 1)[0]?.refused).toBe(true);
    expect(appendSteps(full, 1)[0]?.refused).toBe(true);
  });
  test('the input array is never changed', () => {
    const copy = [...list];
    insertAtSteps(copy, 1, 7);
    deleteAtSteps(copy, 1);
    expect(copy).toEqual(list);
  });
});

describe('append', () => {
  test('puts the value after the last element with one write and no reads', () => {
    const steps = appendSteps(list, 99);
    expect(valuesOf(last(steps))).toEqual([...list, 99]);
    expect(last(steps).reads).toBe(0);
    expect(last(steps).writes).toBe(1);
    expect(last(steps).complexity).toBe('O1');
  });
});

describe('delete at an index', () => {
  test('every valid index removes exactly that element and closes the gap', () => {
    for (let index = 0; index < list.length; index += 1) {
      const expected = list.filter((_, position) => position !== index);
      const final = last(deleteAtSteps(list, index));
      expect(valuesOf(final)).toEqual(expected);
      expect(final.cells[list.length - 1]).toBeNull();
    }
  });
  test('shifts go first element first, one read and one write each', () => {
    const steps = deleteAtSteps(list, 0);
    expect(steps.filter((step) => step.reading !== null).map((step) => [step.reading, step.writing])).toEqual([[1, 0], [2, 1], [3, 2]]);
    expect(last(steps).reads).toBe(3);
    expect(last(steps).writes).toBe(3);
    expect(steps[0]?.doomed).toBe(0);
  });
  test('deleting the last element moves nothing and is O(1)', () => {
    const final = last(deleteAtSteps(list, 3));
    expect(final.reads).toBe(0);
    expect(final.writes).toBe(0);
    expect(final.complexity).toBe('O1');
  });
  test('an empty array or a bad index is refused', () => {
    expect(deleteAtSteps([], 0)[0]?.refused).toBe(true);
    expect(deleteAtSteps(list, 4)[0]?.refused).toBe(true);
    expect(deleteAtSteps(list, -1)[0]?.refused).toBe(true);
  });
});

describe('traverse', () => {
  test('reads every element once, in order', () => {
    const steps = traverseSteps(list);
    expect(steps.filter((step) => step.reading !== null).map((step) => step.reading)).toEqual([0, 1, 2, 3]);
    expect(last(steps).reads).toBe(4);
    expect(last(steps).writes).toBe(0);
    expect(valuesOf(last(steps))).toEqual(list);
    expect(traverseSteps([])[0]?.refused).toBe(true);
  });
});

describe('linear search', () => {
  test('stops at the first match and counts the reads', () => {
    const steps = searchSteps([4, 7, 7, 9], 7);
    expect(last(steps).found).toBe(1);
    expect(last(steps).reads).toBe(2);
    expect(steps).toHaveLength(3);
  });
  test('a missing value reads every cell and finds nothing', () => {
    const steps = searchSteps(list, 42);
    expect(last(steps).found).toBeNull();
    expect(last(steps).reads).toBe(list.length);
    expect(steps).toHaveLength(1 + list.length + 1);
    expect(searchSteps([], 1)[0]?.refused).toBe(true);
  });
  test('the array itself is unchanged', () => {
    expect(valuesOf(last(searchSteps(list, 15)))).toEqual(list);
  });
});

describe('idle step', () => {
  test('shows the array with zero counters and no complexity', () => {
    const step = idleStep(list, 'hi');
    expect(valuesOf(step)).toEqual(list);
    expect(step.reads + step.writes).toBe(0);
    expect(step.complexity).toBeNull();
    expect(step.cells).toHaveLength(MAX_LENGTH);
  });
});
