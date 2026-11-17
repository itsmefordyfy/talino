import { describe, expect, test } from '@jest/globals';

import type { MatrixTaskSpec } from '../types';
import { groupByQuadrant, moveTask, quadrantFor, scoreMatrix } from './matrix';

const TASKS: MatrixTaskSpec[] = [
  { id: 'a', title: 'Client demo is tomorrow', expected: 'do', why: 'Due soon and it matters.' },
  { id: 'b', title: 'Start the certificate course', expected: 'plan', why: 'It matters, nothing forces today.' },
  { id: 'c', title: 'A coworker wants a favour now', expected: 'delegate', alsoAcceptable: ['drop'], why: 'Urgent for them, not for your goals.' },
  { id: 'd', title: 'Scroll the feed', expected: 'drop', why: 'Neither.' },
];

describe('quadrantFor', () => {
  test('maps the two questions to the four boxes', () => {
    expect(quadrantFor(true, true)).toBe('do');
    expect(quadrantFor(false, true)).toBe('plan');
    expect(quadrantFor(true, false)).toBe('delegate');
    expect(quadrantFor(false, false)).toBe('drop');
  });
});

describe('scoreMatrix', () => {
  test('all in the best box passes with a full ratio', () => {
    const result = scoreMatrix(TASKS, { a: 'do', b: 'plan', c: 'delegate', d: 'drop' });
    expect(result).toMatchObject({ correct: true, ratio: 1, wrong: [], unplaced: [] });
  });

  test('an acceptable alternative counts as right', () => {
    const result = scoreMatrix(TASKS, { a: 'do', b: 'plan', c: 'drop', d: 'drop' });
    expect(result.correct).toBe(true);
    expect(result.right).toContain('c');
  });

  test('a wrong box is listed with the expected one, and the ratio drops', () => {
    const result = scoreMatrix(TASKS, { a: 'plan', b: 'plan', c: 'delegate', d: 'drop' });
    expect(result.ratio).toBe(0.75);
    expect(result.correct).toBe(true);
    expect(result.wrong).toEqual([{ id: 'a', got: 'plan', expected: 'do' }]);
  });

  test('below the pass ratio is not correct', () => {
    const result = scoreMatrix(TASKS, { a: 'plan', b: 'do', c: 'delegate', d: 'drop' });
    expect(result.ratio).toBe(0.5);
    expect(result.correct).toBe(false);
  });

  test('a task left out is unplaced and counts as wrong, so a half-sorted board never passes', () => {
    const result = scoreMatrix(TASKS, { a: 'do', b: 'plan' });
    expect(result.unplaced).toEqual(['c', 'd']);
    expect(result.correct).toBe(false);
  });

  test('a custom pass ratio is honoured', () => {
    expect(scoreMatrix(TASKS, { a: 'plan', b: 'do', c: 'delegate', d: 'drop' }, 0.5).correct).toBe(true);
  });
});

describe('the board helpers', () => {
  test('moveTask places and clears without changing the original', () => {
    const start = { a: 'do' as const };
    const moved = moveTask(start, 'a', 'plan');
    expect(moved).toEqual({ a: 'plan' });
    expect(start).toEqual({ a: 'do' });
    expect(moveTask(moved, 'a', null)).toEqual({});
  });

  test('groupByQuadrant keeps the order of the tasks and lists the unplaced ones', () => {
    const groups = groupByQuadrant(TASKS, { a: 'do', d: 'drop', c: 'do' });
    expect(groups.do.map((task) => task.id)).toEqual(['a', 'c']);
    expect(groups.drop.map((task) => task.id)).toEqual(['d']);
    expect(groups.unplaced.map((task) => task.id)).toEqual(['b']);
  });
});
