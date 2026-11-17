import { describe, expect, test } from '@jest/globals';

import type { Block, Decision, ScheduleScenario } from '../types';
import { allFixedBlocks, findOverlaps, focusRuns, freeGaps, scheduleProblems, scoreSchedule } from './schedule';

const H = (hours: number, minutes = 0) => hours * 60 + minutes;

/** A realistic Friday: a stand-up, lunch and a client call are fixed; one report is a must-do with a 5 PM deadline. */
const DAY: ScheduleScenario = {
  dayLabel: 'Friday',
  windowStart: H(8),
  windowEnd: H(18),
  fixed: [
    { id: 'standup', title: 'Stand-up', start: H(9), minutes: 15, kind: 'meeting' },
    { id: 'lunch', title: 'Lunch', start: H(12), minutes: 60, kind: 'meal' },
    { id: 'call', title: 'Client call', start: H(14), minutes: 30, kind: 'meeting' },
  ],
  tasks: [
    { id: 'report', title: 'Finish the client report', minutes: 120, priority: 'high', mustDo: true, deadline: H(17) },
    { id: 'invoices', title: 'Send two invoices', minutes: 30, priority: 'medium' },
    { id: 'study', title: 'Course lesson', minutes: 60, priority: 'medium', okActions: ['defer'] },
    { id: 'inbox', title: 'Clear the inbox', minutes: 45, priority: 'low', okActions: ['defer', 'automate'] },
    { id: 'desk', title: 'Reorganize desktop files', minutes: 60, priority: 'low', okActions: ['defer', 'decline'] },
  ],
  interruption: { id: 'boss', title: 'Urgent call from the manager', start: H(10, 45), minutes: 45, note: 'The manager needs you on a call right now.' },
};

const task = (id: string, taskId: string, start: number, minutes: number, title = taskId): Block => ({ id, kind: 'task', taskId, title, start, minutes });
const rest = (id: string, start: number, minutes: number): Block => ({ id, kind: 'break', title: 'Break', start, minutes });

/** A sound plan with no interruption considered: the report in two parts around a stand-up and breaks, lunch, a call, and one thing deferred. */
const GOOD: Block[] = [
  task('b1', 'report', H(8), 60),
  rest('b2', H(9, 15), 15),
  task('b3', 'report', H(9, 30), 60),
  rest('b4', H(10, 30), 15),
  task('b5', 'study', H(10, 45), 60),
  task('b6', 'invoices', H(13), 30),
  task('b7', 'inbox', H(14, 30), 45),
];
const DEFER_DESK: Decision[] = [{ taskId: 'desk', action: 'defer' }];
const NO_INTERRUPTION: ScheduleScenario = { ...DAY, interruption: undefined };

describe('scoreSchedule', () => {
  test('a sound plan passes with no blockers', () => {
    const result = scoreSchedule(NO_INTERRUPTION, { blocks: GOOD, decisions: DEFER_DESK, afterInterruption: true });
    expect(result.blockers).toEqual([]);
    expect(result.passed).toBe(true);
    expect(result.scores.interruptions).toBeUndefined();
    expect(result.overall).toBeGreaterThanOrEqual(90);
    expect(result.totals).toMatchObject({ planned: 120 + 60 + 30 + 45 });
  });

  test('overlapping blocks are a blocker', () => {
    const blocks = [...GOOD.filter((block) => block.id !== 'b6'), task('b6', 'invoices', H(12, 30), 30)];
    const result = scoreSchedule(NO_INTERRUPTION, { blocks, decisions: DEFER_DESK, afterInterruption: true });
    expect(result.passed).toBe(false);
    expect(result.blockers.map((finding) => finding.code)).toContain('overlap');
  });

  test('work outside the day is a blocker', () => {
    const blocks = [...GOOD, task('late', 'desk', H(17, 30), 60)];
    const result = scoreSchedule(NO_INTERRUPTION, { blocks, decisions: [], afterInterruption: true });
    expect(result.blockers.map((finding) => finding.code)).toContain('outsideWindow');
  });

  test('a must-do task left out is a blocker, even if the rest is perfect', () => {
    const blocks = GOOD.filter((block) => block.taskId !== 'report');
    const result = scoreSchedule(NO_INTERRUPTION, { blocks, decisions: DEFER_DESK, afterInterruption: true });
    expect(result.passed).toBe(false);
    expect(result.blockers.map((finding) => finding.code)).toContain('mustDoMissing');
  });

  test('deferring a must-do is named as such', () => {
    const blocks = GOOD.filter((block) => block.taskId !== 'report');
    const result = scoreSchedule(NO_INTERRUPTION, { blocks, decisions: [{ taskId: 'report', action: 'defer' }], afterInterruption: true });
    expect(result.blockers.map((finding) => finding.code)).toContain('mustDoDeferred');
  });

  test('a must-do that finishes after its deadline is a blocker', () => {
    const blocks = [...GOOD.filter((block) => block.taskId !== 'report'), task('r1', 'report', H(16), 120)];
    const result = scoreSchedule(NO_INTERRUPTION, { blocks, decisions: DEFER_DESK, afterInterruption: true });
    expect(result.blockers.map((finding) => finding.code)).toContain('mustDoLate');
  });

  test('a must-do given far too little time is a blocker', () => {
    const blocks = [...GOOD.filter((block) => block.taskId !== 'report'), task('r1', 'report', H(8), 30)];
    const result = scoreSchedule(NO_INTERRUPTION, { blocks, decisions: DEFER_DESK, afterInterruption: true });
    expect(result.blockers.map((finding) => finding.code)).toContain('tooShort');
  });

  test('a long stretch with no break is a blocker', () => {
    const blocks: Block[] = [task('r1', 'report', H(8), 60), task('r2', 'report', H(9, 15), 60), task('s1', 'study', H(10, 15), 60), task('i1', 'invoices', H(11, 15), 30), task('n1', 'inbox', H(13), 45)];
    const result = scoreSchedule(NO_INTERRUPTION, { blocks, decisions: DEFER_DESK, afterInterruption: true });
    expect(result.passed).toBe(false);
    expect(result.blockers.map((finding) => finding.code)).toContain('focusRunTooLong');
  });

  test('packing every free minute with tasks leaves no slack and does not pass', () => {
    const scenario: ScheduleScenario = { ...NO_INTERRUPTION, rules: { maxPlannedMinutes: 600, minSlack: 60 } };
    const blocks: Block[] = [
      task('r1', 'report', H(8), 60),
      rest('k1', H(9, 15), 15),
      task('r2', 'report', H(9, 30), 60),
      rest('k2', H(10, 30), 15),
      task('s1', 'study', H(10, 45), 60),
      task('i1', 'invoices', H(11, 45), 15),
      task('i2', 'invoices', H(13), 15),
      task('n1', 'inbox', H(13, 15), 45),
      rest('k3', H(14, 30), 15),
      task('d1', 'desk', H(14, 45), 60),
      task('d2', 'desk', H(15, 45), 90),
      task('d3', 'desk', H(17, 15), 45),
    ];
    const result = scoreSchedule(scenario, { blocks, decisions: [], afterInterruption: true });
    expect(result.findings.map((finding) => finding.code)).toContain('noSlack');
    expect(result.passed).toBe(false);
  });

  test('more task minutes than the day may hold is a blocker', () => {
    const scenario: ScheduleScenario = { ...NO_INTERRUPTION, rules: { maxPlannedMinutes: 200 } };
    const result = scoreSchedule(scenario, { blocks: GOOD, decisions: DEFER_DESK, afterInterruption: true });
    expect(result.blockers.map((finding) => finding.code)).toContain('overPacked');
  });

  test('a day with no rest at all is a blocker', () => {
    const scenario: ScheduleScenario = { ...NO_INTERRUPTION, fixed: NO_INTERRUPTION.fixed.filter((block) => block.kind !== 'meal') };
    const blocks = GOOD.filter((block) => block.kind !== 'break');
    const result = scoreSchedule(scenario, { blocks, decisions: DEFER_DESK, afterInterruption: true });
    expect(result.blockers.map((finding) => finding.code)).toContain('noBreak');
  });

  test('a task left out needs a decision, and a sensible one', () => {
    const missing = scoreSchedule(NO_INTERRUPTION, { blocks: GOOD, decisions: [], afterInterruption: true });
    expect(missing.findings.map((finding) => finding.code)).toContain('decisionMissing');
    expect(missing.scores.decisionMaking).toBe(0);
    const poor = scoreSchedule(NO_INTERRUPTION, { blocks: GOOD, decisions: [{ taskId: 'desk', action: 'delegate' }], afterInterruption: true });
    expect(poor.findings.map((finding) => finding.code)).toContain('decisionPoor');
    expect(poor.scores.decisionMaking).toBe(0);
  });

  test('when everything fits, decisions are not needed', () => {
    const blocks = [...GOOD, task('d1', 'desk', H(15, 15), 60)];
    const result = scoreSchedule(NO_INTERRUPTION, { blocks, decisions: [], afterInterruption: true });
    expect(result.scores.decisionMaking).toBe(100);
    expect(result.findings.map((finding) => finding.code)).toContain('allFit');
  });

  test('doing a low-priority task first while a high one waits costs prioritisation', () => {
    const blocks = [task('n1', 'inbox', H(8), 45), rest('k0', H(8, 45), 15), task('r1', 'report', H(9, 30), 60), rest('k1', H(10, 30), 15), task('r2', 'report', H(10, 45), 60), task('i1', 'invoices', H(13), 30)];
    const result = scoreSchedule(NO_INTERRUPTION, { blocks, decisions: [{ taskId: 'study', action: 'defer' }, { taskId: 'desk', action: 'defer' }], afterInterruption: true });
    expect(result.scores.prioritization).toBeLessThan(100);
    expect(result.findings.map((finding) => finding.code)).toContain('inversion');
  });

  test('an earlier deadline justifies doing a lower-priority task first', () => {
    const scenario: ScheduleScenario = {
      ...NO_INTERRUPTION,
      tasks: [
        { id: 'big', title: 'Big report', minutes: 60, priority: 'high', deadline: H(17) },
        { id: 'form', title: 'Hand in the form', minutes: 30, priority: 'medium', deadline: H(10) },
      ],
    };
    const result = scoreSchedule(scenario, { blocks: [task('f', 'form', H(8), 30), task('g', 'big', H(8, 45), 60)], decisions: [], afterInterruption: true });
    expect(result.scores.prioritization).toBe(100);
  });
});

describe('the interruption', () => {
  test('a plan that is not rebuilt after the interruption does not pass', () => {
    const result = scoreSchedule(DAY, { blocks: GOOD, decisions: DEFER_DESK, afterInterruption: false });
    expect(result.passed).toBe(false);
    expect(result.blockers.map((finding) => finding.code)).toContain('interruptionUnhandled');
    expect(result.scores.interruptions).toBe(0);
  });

  test('keeping a block on top of the interruption is a blocker', () => {
    const result = scoreSchedule(DAY, { blocks: GOOD, decisions: DEFER_DESK, afterInterruption: true });
    expect(result.blockers.map((finding) => finding.code)).toContain('interruptionOverlap');
    expect(result.scores.interruptions).toBe(0);
  });

  test('moving the study session out of the way and deferring it passes', () => {
    const blocks = GOOD.filter((block) => block.taskId !== 'study');
    const decisions: Decision[] = [...DEFER_DESK, { taskId: 'study', action: 'defer' }];
    const result = scoreSchedule(DAY, { blocks, decisions, afterInterruption: true });
    expect(result.blockers).toEqual([]);
    expect(result.scores.interruptions).toBe(100);
    expect(result.passed).toBe(true);
  });
});

describe('the helpers', () => {
  test('allFixedBlocks adds the interruption only after it has happened', () => {
    expect(allFixedBlocks(DAY, false)).toHaveLength(3);
    expect(allFixedBlocks(DAY, true)).toHaveLength(4);
    expect(allFixedBlocks(DAY, true)[3]).toMatchObject({ kind: 'interruption', start: H(10, 45) });
  });

  test('findOverlaps ignores items that only touch', () => {
    const pairs = findOverlaps([
      { id: 'a', title: 'A', start: 0, minutes: 30 },
      { id: 'b', title: 'B', start: 30, minutes: 30 },
      { id: 'c', title: 'C', start: 45, minutes: 30 },
    ]);
    expect(pairs.map(([x, y]) => `${x.id}${y.id}`)).toEqual(['bc']);
  });

  test('focusRuns joins work with short gaps and splits on a break', () => {
    const runs = focusRuns(NO_INTERRUPTION, GOOD, 10);
    expect(runs.every((run) => run.minutes <= 120)).toBe(true);
    expect(runs.some((run) => run.start === H(8))).toBe(true);
  });

  test('freeGaps lists the open time between commitments', () => {
    const gaps = freeGaps(NO_INTERRUPTION, GOOD, false);
    expect(gaps).toContainEqual({ start: H(11, 45), minutes: 15 });
    expect(gaps.every((gap) => gap.minutes > 0)).toBe(true);
  });

  test('scheduleProblems accepts the demo day and flags a broken scenario', () => {
    expect(scheduleProblems(DAY, { blocks: GOOD.filter((block) => block.taskId !== 'study'), decisions: [{ taskId: 'desk', action: 'defer' }, { taskId: 'study', action: 'defer' }] })).toEqual([]);
    const broken = scheduleProblems({ ...DAY, tasks: [...DAY.tasks, { id: 'report', title: 'Dupe', minutes: 10, priority: 'low' }] }, { blocks: [], decisions: [] });
    expect(broken.join(' ')).toMatch(/duplicate/i);
  });
});
