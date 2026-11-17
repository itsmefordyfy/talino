import { describe, expect, test } from '@jest/globals';

import { DEFAULT_RULES, type Block, type ScheduleScenario, type ScheduleTask } from '../types';
import { addExtraBlock, dayAdvice, dayBarSegments, daySummary, dropDecisionsFor, findConflicts, moveBlock, openGaps, placeTask, placedMinutes, remainingMinutes, removeBlock, removeTaskBlocks, resizeBlock, setDecision, suggestSlot, timelineRows } from './day-plan';

const H = (hours: number, minutes = 0) => hours * 60 + minutes;

const REPORT: ScheduleTask = { id: 'report', title: 'Report', minutes: 120, priority: 'high' };
const MAIL: ScheduleTask = { id: 'mail', title: 'Mail', minutes: 30, priority: 'low' };
const DAY: ScheduleScenario = {
  dayLabel: '',
  windowStart: H(8),
  windowEnd: H(16),
  fixed: [
    { id: 'standup', title: 'Stand-up', start: H(9), minutes: 15, kind: 'meeting' },
    { id: 'lunch', title: 'Lunch', start: H(12), minutes: 60, kind: 'meal' },
  ],
  tasks: [REPORT, MAIL],
};
const task = (id: string, taskId: string, start: number, minutes: number): Block => ({ id, kind: 'task', taskId, title: taskId, start, minutes });

describe('finding room', () => {
  test('open gaps are the stretches between commitments and blocks, buffers included as taken', () => {
    const buffer: Block = { id: 'buf', kind: 'buffer', title: 'Buffer', start: H(13), minutes: 30 };
    expect(openGaps(DAY, [buffer])).toEqual([
      { start: H(8), minutes: 60 },
      { start: H(9, 15), minutes: 165 },
      { start: H(13, 30), minutes: 150 },
    ]);
  });

  test('suggests the first stretch long enough, on a quarter-hour', () => {
    expect(suggestSlot(DAY, [], 60)).toEqual({ start: H(8), minutes: 60, fits: true });
    // 120 minutes does not fit before the 9:00 stand-up, so it goes after it.
    expect(suggestSlot(DAY, [], 120)).toEqual({ start: H(9, 15), minutes: 120, fits: true });
  });

  test('when nothing is long enough it offers the longest stretch with the length it holds', () => {
    const blocks = [task('a', 'x', H(9, 15), 165), task('b', 'x', H(13), 30)];
    expect(suggestSlot(DAY, blocks, 200)).toEqual({ start: H(13, 30), minutes: 150, fits: false });
  });

  test('a full day has no suggestion', () => {
    const full = [task('a', 'x', H(8), 60), task('b', 'x', H(9, 15), 165), task('c', 'x', H(13), 180)];
    expect(suggestSlot(DAY, full, 15)).toBeNull();
  });

  test('stretches are offered from the next quarter-hour', () => {
    const odd: ScheduleScenario = { ...DAY, fixed: [{ id: 'f', title: 'Call', start: H(8), minutes: 20, kind: 'meeting' }] };
    expect(suggestSlot(odd, [], 30)?.start).toBe(H(8, 30));
  });
});

describe('placing, moving and resizing', () => {
  test('placeTask puts what is left of the task in the day and reports a partial fit', () => {
    const first = placeTask(DAY, REPORT, [], 'p1')!;
    expect(first.block).toMatchObject({ id: 'p1', kind: 'task', taskId: 'report', start: H(9, 15), minutes: 120, title: 'Report' });
    expect(first.fits).toBe(true);
    expect(placedMinutes(REPORT, first.blocks)).toBe(120);
    expect(placeTask(DAY, REPORT, first.blocks, 'p2')).toBeNull();
    const half = placeTask(DAY, REPORT, [task('a', 'report', H(8), 60)], 'p3')!;
    expect(half.block.minutes).toBe(60);
    expect(remainingMinutes(REPORT, half.blocks)).toBe(0);
  });

  test('a task that is longer than any gap is placed in the longest one, not on top of something', () => {
    const long: ScheduleTask = { id: 'long', title: 'Long', minutes: 300, priority: 'medium' };
    const placement = placeTask(DAY, long, [], 'p')!;
    expect(placement.fits).toBe(false);
    expect(placement.block.minutes).toBe(180);
    expect(placement.block.start).toBe(H(13));
    expect(findConflicts(DAY, placement.blocks).overlaps.size).toBe(0);
  });

  test('extra blocks land in free time, or at the start of a full day where the clash shows', () => {
    expect(addExtraBlock(DAY, 'break', 'Break', [], 'e').block).toMatchObject({ kind: 'break', start: H(8), minutes: 15 });
    const full = [task('a', 'x', H(8), 60), task('b', 'x', H(9, 15), 165), task('c', 'x', H(13), 180)];
    expect(addExtraBlock(DAY, 'buffer', 'Buffer', full, 'e').block.start).toBe(H(8));
  });

  test('blocks move and resize in quarter-hours and stay inside the clock', () => {
    const blocks = [task('a', 'x', H(8), 60)];
    expect(moveBlock(blocks, 'a', 15)[0]!.start).toBe(H(8, 15));
    expect(moveBlock(blocks, 'a', -15)[0]!.start).toBe(H(7, 45));
    expect(moveBlock([task('a', 'x', 0, 60)], 'a', -15)[0]!.start).toBe(0);
    expect(moveBlock([task('a', 'x', H(23), 60)], 'a', 15)[0]!.start).toBe(H(23));
    expect(resizeBlock(blocks, 'a', 15)[0]!.minutes).toBe(75);
    expect(resizeBlock([task('a', 'x', H(8), 15)], 'a', -15)[0]!.minutes).toBe(15);
    expect(resizeBlock([task('a', 'x', H(8), 480)], 'a', 15)[0]!.minutes).toBe(480);
    expect(moveBlock([task('a', 'x', H(8, 10), 60)], 'a', 15)[0]!.start % 15).toBe(0);
  });

  test('removing a block or a task leaves the rest', () => {
    const blocks = [task('a', 'report', H(8), 60), task('b', 'mail', H(10), 30)];
    expect(removeBlock(blocks, 'a').map((block) => block.id)).toEqual(['b']);
    expect(removeTaskBlocks(blocks, 'report').map((block) => block.id)).toEqual(['b']);
  });

  test('one decision per task, cleared when the task is placed', () => {
    const one = setDecision([], 'mail', 'defer');
    expect(setDecision(one, 'mail', 'decline')).toEqual([{ taskId: 'mail', action: 'decline' }]);
    expect(setDecision(one, 'mail', null)).toEqual([]);
    expect(dropDecisionsFor(one, ['mail'])).toEqual([]);
    expect(dropDecisionsFor(one, ['other'])).toEqual(one);
  });
});

describe('conflicts and the summary', () => {
  test('an overlap with a commitment is flagged on both, and two commitments are never flagged', () => {
    const onStandup = [task('a', 'x', H(8, 30), 60)];
    const conflicts = findConflicts(DAY, onStandup);
    expect(conflicts.overlaps.get('a')).toEqual(['Stand-up']);
    expect(conflicts.overlaps.get('standup')).toEqual(['x']);
    const clashing: ScheduleScenario = { ...DAY, fixed: [...DAY.fixed, { id: 'dup', title: 'Other', start: H(9), minutes: 30, kind: 'meeting' }] };
    expect(findConflicts(clashing, []).overlaps.size).toBe(0);
  });

  test('a block that runs outside the day is flagged, and one that only touches a neighbour is not', () => {
    const conflicts = findConflicts(DAY, [task('early', 'x', H(7), 60), task('late', 'x', H(15, 30), 60), task('touch', 'x', H(9, 15), 30)]);
    expect([...conflicts.outside].sort()).toEqual(['early', 'late']);
    expect(conflicts.overlaps.has('touch')).toBe(false);
  });

  test('the summary counts work, rest (breaks and meals) and free time (buffers count as free)', () => {
    const blocks: Block[] = [task('a', 'x', H(9, 15), 120), { id: 'b', kind: 'break', title: 'Break', start: H(11, 15), minutes: 15 }, { id: 'u', kind: 'buffer', title: 'Buffer', start: H(14), minutes: 30 }];
    const summary = daySummary(DAY, blocks);
    expect(summary).toEqual({ work: 120, rest: 75, free: 8 * 60 - 15 - 120 - 15 - 60 });
  });
});

describe('advice before any check', () => {
  const rules = { ...DEFAULT_RULES };
  test('says nothing for an empty day', () => {
    expect(dayAdvice(DAY, [], rules)).toEqual([]);
  });

  test('an overpacked day with no rest is visibly overpacked', () => {
    const packed = [task('a', 'x', H(8), 60), task('b', 'x', H(9, 15), 165), task('c', 'x', H(13), 180)];
    const codes = dayAdvice(DAY, packed, { ...rules, maxPlannedMinutes: 300 }).map((item) => item.code);
    expect(codes).toContain('longRun');
    expect(codes).toContain('overPacked');
    expect(codes).toContain('littleFree');
  });

  test('clashes and blocks outside the day are named with counts', () => {
    const advice = dayAdvice(DAY, [task('a', 'x', H(8, 30), 60), task('b', 'x', H(15, 30), 60)], rules);
    expect(advice.find((item) => item.code === 'overlap')?.params).toEqual({ count: 1 });
    expect(advice.find((item) => item.code === 'outside')?.params).toEqual({ count: 1 });
  });

  test('a sound day gets one all-clear line', () => {
    const blocks: Block[] = [task('a', 'x', H(9, 15), 60), { id: 'b', kind: 'break', title: 'Break', start: H(10, 15), minutes: 15 }];
    // Lunch is 60 minutes of rest, more than the 30 the day needs.
    expect(dayAdvice(DAY, blocks, rules).map((item) => item.code)).toEqual(['clear']);
  });
});

describe('the timeline and the bar', () => {
  test('rows are in time order with the open stretches between', () => {
    const rows = timelineRows(DAY, [task('a', 'x', H(10), 60)]);
    expect(rows.map((row) => `${row.type}:${row.start}`)).toEqual([`gap:${H(8)}`, `fixed:${H(9)}`, `gap:${H(9, 15)}`, `block:${H(10)}`, `gap:${H(11)}`, `fixed:${H(12)}`, `gap:${H(13)}`]);
  });

  test('a clash still shows both items, in order', () => {
    const rows = timelineRows(DAY, [task('a', 'x', H(9), 30)]);
    expect(rows.filter((row) => row.type !== 'gap').map((row) => row.type)).toEqual(['fixed', 'block', 'fixed']);
  });

  test('the bar clips to the day and gives shares of its hours', () => {
    const segments = dayBarSegments(DAY, [task('a', 'x', H(8), 120), task('out', 'x', H(17), 60)]);
    expect(segments).toContainEqual({ left: 0, width: 25, tone: 'task' });
    expect(segments.some((segment) => segment.left + segment.width > 100)).toBe(false);
    expect(segments.filter((segment) => segment.tone === 'rest')[0]).toEqual({ left: 50, width: 12.5, tone: 'rest' });
  });
});
