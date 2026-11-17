import { describe, expect, test } from '@jest/globals';

import { EMPTY_MATRIX, MAX_TITLE, MAX_TOOL_TASKS, parseMatrixState, type MatrixToolState } from '@/features/productivity';

import { addMatrixTask, isMatrixFull, placeMatrixTask, removeMatrixTask } from './eisenhower-state';

describe('the free matrix state', () => {
  test('adds a trimmed task and ignores a blank one', () => {
    const one = addMatrixTask(EMPTY_MATRIX, 'a', '  Send the invoice  ');
    expect(one.tasks).toEqual([{ id: 'a', title: 'Send the invoice' }]);
    expect(addMatrixTask(one, 'b', '   ')).toBe(one);
  });

  test('cuts a long title at the cap and never adds the same id twice', () => {
    const state = addMatrixTask(EMPTY_MATRIX, 'a', 'x'.repeat(MAX_TITLE + 40));
    expect(state.tasks[0].title).toHaveLength(MAX_TITLE);
    expect(addMatrixTask(state, 'a', 'again')).toBe(state);
  });

  test('stops at the task limit', () => {
    let state: MatrixToolState = EMPTY_MATRIX;
    for (let index = 0; index < MAX_TOOL_TASKS + 3; index += 1) state = addMatrixTask(state, `t${index}`, `Task ${index}`);
    expect(state.tasks).toHaveLength(MAX_TOOL_TASKS);
    expect(isMatrixFull(state)).toBe(true);
  });

  test('places, re-places and unplaces a task', () => {
    let state = addMatrixTask(EMPTY_MATRIX, 'a', 'Report');
    state = placeMatrixTask(state, 'a', 'do');
    expect(state.placements).toEqual({ a: 'do' });
    state = placeMatrixTask(state, 'a', 'plan');
    expect(state.placements).toEqual({ a: 'plan' });
    state = placeMatrixTask(state, 'a', null);
    expect(state.placements).toEqual({});
    expect(placeMatrixTask(state, 'ghost', 'do')).toBe(state);
  });

  test('removing a task forgets its box, and what is saved reads back the same', () => {
    let state = addMatrixTask(addMatrixTask(EMPTY_MATRIX, 'a', 'One'), 'b', 'Two');
    state = placeMatrixTask(placeMatrixTask(state, 'a', 'do'), 'b', 'drop');
    state = removeMatrixTask(state, 'a');
    expect(state).toEqual({ tasks: [{ id: 'b', title: 'Two' }], placements: { b: 'drop' } });
    expect(parseMatrixState(JSON.parse(JSON.stringify(state)))).toEqual(state);
    expect(removeMatrixTask(state, 'a')).toBe(state);
  });
});
