import { describe, expect, test } from '@jest/globals';

import { checkActivity, validateActivity } from '@/features/activities';
import type { PlanningActivity } from '@/features/activities/types';

import type { Block, MatrixTaskSpec, ScheduleScenario } from '../types';
import { checkPlanning, planningProblems } from './planning';

const H = (hours: number, minutes = 0) => hours * 60 + minutes;
const base = { id: 'prod-demo-1', title: 'A demo', prompt: 'Do it.', hints: ['Think about the deadline.', 'Which one could wait?'], explanation: 'Because.', concept: 'prioritization' };

const TASKS: MatrixTaskSpec[] = [
  { id: 'a', title: 'Client demo is tomorrow', expected: 'do', why: 'Due soon and it matters.' },
  { id: 'b', title: 'Start the certificate course', expected: 'plan', why: 'It matters, but nothing forces it today.' },
  { id: 'c', title: 'A coworker wants a favour now', expected: 'delegate', alsoAcceptable: ['drop'], why: 'Urgent for them, not for your goals.' },
  { id: 'd', title: 'Scroll the feed', expected: 'drop', why: 'Neither urgent nor important.' },
  { id: 'e', title: 'Pay the electricity bill (due today)', expected: 'do', why: 'A real deadline with a penalty.' },
];
const SORT: PlanningActivity = { ...base, kind: 'planning', challenge: { mode: 'prioritize', tasks: TASKS } };

const SCENARIO: ScheduleScenario = {
  dayLabel: 'Friday',
  windowStart: H(8),
  windowEnd: H(18),
  fixed: [
    { id: 'standup', title: 'Stand-up', start: H(9), minutes: 15, kind: 'meeting' },
    { id: 'lunch', title: 'Lunch', start: H(12), minutes: 60, kind: 'meal' },
  ],
  tasks: [
    { id: 'report', title: 'Finish the report', minutes: 120, priority: 'high', mustDo: true, deadline: H(17) },
    { id: 'invoices', title: 'Send invoices', minutes: 30, priority: 'medium' },
    { id: 'tidy', title: 'Tidy desktop files', minutes: 60, priority: 'low', okActions: ['defer', 'decline'] },
  ],
};
const SOLUTION: { blocks: Block[]; decisions: { taskId: string; action: 'defer' }[] } = {
  blocks: [
    { id: 'b1', kind: 'task', taskId: 'report', title: 'Report', start: H(8), minutes: 60 },
    { id: 'b2', kind: 'break', title: 'Break', start: H(9, 15), minutes: 15 },
    { id: 'b3', kind: 'task', taskId: 'report', title: 'Report', start: H(9, 30), minutes: 60 },
    { id: 'b4', kind: 'task', taskId: 'invoices', title: 'Invoices', start: H(13), minutes: 30 },
  ],
  decisions: [{ taskId: 'tidy', action: 'defer' }],
};
const PLAN: PlanningActivity = { ...base, id: 'prod-demo-2', kind: 'planning', challenge: { mode: 'schedule', scenario: SCENARIO, solution: SOLUTION } };

describe('validating a planning activity', () => {
  test('well-formed sorting and schedule activities have no problems', () => {
    expect(validateActivity(SORT)).toEqual([]);
    expect(validateActivity(PLAN)).toEqual([]);
  });

  test('a sorting exercise needs enough tasks, varied boxes and reasons', () => {
    expect(planningProblems({ mode: 'prioritize', tasks: TASKS.slice(0, 3) }).join(' ')).toMatch(/5 to 12/);
    expect(planningProblems({ mode: 'prioritize', tasks: TASKS.map((task) => ({ ...task, expected: 'do' as const, alsoAcceptable: undefined })) }).join(' ')).toMatch(/three of the four/);
    expect(planningProblems({ mode: 'prioritize', tasks: TASKS.map((task) => ({ ...task, why: ' ' })) }).join(' ')).toMatch(/reason/);
    expect(planningProblems({ mode: 'prioritize', tasks: TASKS, passRatio: 0.2 }).join(' ')).toMatch(/passRatio/);
  });

  test('a schedule whose own reference plan breaks its rules is refused', () => {
    const bad = planningProblems({ mode: 'schedule', scenario: SCENARIO, solution: { blocks: [], decisions: [] } });
    expect(bad.join(' ')).toMatch(/reference solution does not pass/);
  });
});

describe('checking a planning activity', () => {
  test('a well-sorted board is correct, and says so', async () => {
    const result = await checkActivity(SORT, { kind: 'planning', mode: 'prioritize', placements: { a: 'do', b: 'plan', c: 'delegate', d: 'drop', e: 'do' } });
    expect(result).toMatchObject({ correct: true, partial: 1 });
    expect(result.detail).toMatchObject({ kind: 'planning', mode: 'prioritize' });
  });

  test('a board with unsorted tasks is a step forward, not a wrong try', () => {
    const result = checkPlanning(SORT, { kind: 'planning', mode: 'prioritize', placements: { a: 'do' } });
    expect(result.correct).toBe(false);
    expect(result.progress).toBe(true);
    expect(result.feedback).toMatch(/4 tasks are still not placed/);
  });

  test('wrong boxes are explained with the task and the reason, not the answer key', () => {
    const result = checkPlanning(SORT, { kind: 'planning', mode: 'prioritize', placements: { a: 'plan', b: 'do', c: 'delegate', d: 'drop', e: 'plan' } });
    expect(result.correct).toBe(false);
    expect(result.feedback).toContain('Client demo is tomorrow');
    expect(result.feedback).toContain('Due soon and it matters.');
  });

  test('a sound day plan is correct', async () => {
    const result = await checkActivity(PLAN, { kind: 'planning', mode: 'schedule', blocks: SOLUTION.blocks, decisions: SOLUTION.decisions, afterInterruption: true });
    expect(result.correct).toBe(true);
    expect(result.detail).toMatchObject({ kind: 'planning', mode: 'schedule', schedule: { passed: true } });
  });

  test('a day with no rest is refused and the reason is in plain words', () => {
    const noRest: Block[] = [
      { id: 'x1', kind: 'task', taskId: 'report', title: 'Report', start: H(8), minutes: 60 },
      { id: 'x2', kind: 'task', taskId: 'report', title: 'Report', start: H(9, 15), minutes: 60 },
      { id: 'x3', kind: 'task', taskId: 'invoices', title: 'Invoices', start: H(10, 15), minutes: 30 },
      { id: 'x4', kind: 'task', taskId: 'tidy', title: 'Tidy', start: H(10, 45), minutes: 60 },
    ];
    const result = checkPlanning(PLAN, { kind: 'planning', mode: 'schedule', blocks: noRest, decisions: [], afterInterruption: true });
    expect(result.correct).toBe(false);
    expect(result.feedback).toMatch(/in a row is longer than/);
  });

  test('an answer for the other mode is a programming error, not a wrong try', () => {
    expect(() => checkPlanning(SORT, { kind: 'planning', mode: 'schedule', blocks: [], decisions: [], afterInterruption: true })).toThrow();
  });
});
