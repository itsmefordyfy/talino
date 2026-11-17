import type { Block, BlockKind, Decision, DecisionAction, FixedBlock, ScheduleRules, ScheduleScenario, ScheduleTask } from '../types';
import { findOverlaps, focusRuns, freeGaps } from './schedule';
import { clampMinutes, MINUTES_PER_DAY, snap, STEP } from './time';

/**
 * Pure helpers behind the day planner screens: where a task can go, moving and resizing blocks in quarter-hours, what conflicts and what is
 * left over, and the plain advice shown before any check. The scoring itself stays in `schedule.ts`; nothing here judges a plan.
 */

/** The shortest and longest a block may be made with the steppers. */
export const MIN_BLOCK = STEP;
export const MAX_BLOCK = 480;
/** What a new break or buffer lasts. */
export const EXTRA_BLOCK_MINUTES = 15;

type Gap = { start: number; minutes: number };
const end = (span: { start: number; minutes: number }) => span.start + span.minutes;
const ceilToStep = (minutes: number) => Math.ceil(minutes / STEP) * STEP;
const floorToStep = (minutes: number) => Math.floor(minutes / STEP) * STEP;

/** Open stretches of the day where nothing is planned. Unlike `freeGaps`, a buffer block counts as taken here: this is for finding room to put a block, not for the "free time" figure. */
export function openGaps(scenario: ScheduleScenario, blocks: readonly Block[]): Gap[] {
  const busy = [...scenario.fixed, ...blocks]
    .map((item) => ({ start: Math.max(item.start, scenario.windowStart), end: Math.min(end(item), scenario.windowEnd) }))
    .filter((span) => span.end > span.start)
    .sort((a, b) => a.start - b.start);
  const gaps: Gap[] = [];
  let cursor = scenario.windowStart;
  for (const span of busy) {
    if (span.start > cursor) gaps.push({ start: cursor, minutes: span.start - cursor });
    cursor = Math.max(cursor, span.end);
  }
  if (cursor < scenario.windowEnd) gaps.push({ start: cursor, minutes: scenario.windowEnd - cursor });
  return gaps;
}

/**
 * A sensible start for `minutes` of work: the first open stretch (on a quarter-hour) long enough. If nothing is long enough, the longest open stretch
 * is offered with the length it can hold, so a long task lands in the biggest gap and the rest is still to place. `null` when no quarter-hour is free.
 */
export function suggestSlot(scenario: ScheduleScenario, blocks: readonly Block[], minutes: number): { start: number; minutes: number; fits: boolean } | null {
  const wanted = Math.max(MIN_BLOCK, minutes);
  let best: { start: number; minutes: number } | null = null;
  for (const gap of openGaps(scenario, blocks)) {
    const start = ceilToStep(gap.start);
    const room = floorToStep(gap.start + gap.minutes - start);
    if (room < MIN_BLOCK) continue;
    if (room >= wanted) return { start, minutes: wanted, fits: true };
    if (!best || room > best.minutes) best = { start, minutes: room };
  }
  return best ? { ...best, fits: false } : null;
}

export const placedMinutes = (task: ScheduleTask, blocks: readonly Block[]): number => blocks.filter((block) => block.kind === 'task' && block.taskId === task.id).reduce((sum, block) => sum + block.minutes, 0);
export const remainingMinutes = (task: ScheduleTask, blocks: readonly Block[]): number => Math.max(0, task.minutes - placedMinutes(task, blocks));
/** The task's blocks in time order. */
export const blocksOfTask = (task: ScheduleTask, blocks: readonly Block[]): Block[] => blocks.filter((block) => block.kind === 'task' && block.taskId === task.id).sort((a, b) => a.start - b.start);

export type Placement = { blocks: Block[]; block: Block; /** False when the longest free stretch was shorter than what is left of the task. */ fits: boolean };

/** Puts what is left of a task (its estimate minus what is already placed) in the day. `null` when there is no free quarter-hour. */
export function placeTask(scenario: ScheduleScenario, task: ScheduleTask, blocks: readonly Block[], id: string): Placement | null {
  const left = remainingMinutes(task, blocks);
  if (left <= 0) return null;
  const slot = suggestSlot(scenario, blocks, left);
  if (!slot) return null;
  const block: Block = { id, kind: 'task', taskId: task.id, title: task.title, start: slot.start, minutes: Math.min(slot.minutes, MAX_BLOCK) };
  return { blocks: [...blocks, block], block, fits: slot.fits };
}

/** Adds a break or a buffer in the first free quarter-hour (or at the day's start when the day is full, where the conflict will show). */
export function addExtraBlock(scenario: ScheduleScenario, kind: Exclude<BlockKind, 'task'>, title: string, blocks: readonly Block[], id: string, minutes = EXTRA_BLOCK_MINUTES): { blocks: Block[]; block: Block } {
  const slot = suggestSlot(scenario, blocks, minutes);
  const block: Block = { id, kind, title, start: slot?.fits ? slot.start : scenario.windowStart, minutes };
  return { blocks: [...blocks, block], block };
}

const mapBlock = (blocks: readonly Block[], id: string, change: (block: Block) => Block): Block[] => blocks.map((block) => (block.id === id ? change(block) : block));

/** Moves a block by whole quarter-hours; it can go outside the day (that is flagged, not forbidden) but never outside the clock. */
export const moveBlock = (blocks: readonly Block[], id: string, deltaMinutes: number): Block[] =>
  mapBlock(blocks, id, (block) => ({ ...block, start: clampMinutes(snap(block.start + deltaMinutes), 0, MINUTES_PER_DAY - block.minutes) }));

/** Changes a block's length by whole quarter-hours, between 15 minutes and 8 hours, from the same start. */
export const resizeBlock = (blocks: readonly Block[], id: string, deltaMinutes: number): Block[] =>
  mapBlock(blocks, id, (block) => ({ ...block, minutes: clampMinutes(snap(block.minutes + deltaMinutes), MIN_BLOCK, Math.min(MAX_BLOCK, MINUTES_PER_DAY - block.start)) }));

export const removeBlock = (blocks: readonly Block[], id: string): Block[] => blocks.filter((block) => block.id !== id);
export const removeTaskBlocks = (blocks: readonly Block[], taskId: string): Block[] => blocks.filter((block) => !(block.kind === 'task' && block.taskId === taskId));

/** Sets the decision about a task, or clears it (`null`). One decision per task. */
export function setDecision(decisions: readonly Decision[], taskId: string, action: DecisionAction | null): Decision[] {
  const rest = decisions.filter((decision) => decision.taskId !== taskId);
  return action === null ? rest : [...rest, { taskId, action }];
}
/** A task that is in the day has nothing to decide: its decision goes. */
export const dropDecisionsFor = (decisions: readonly Decision[], taskIds: readonly string[]): Decision[] => decisions.filter((decision) => !taskIds.includes(decision.taskId));

export type Conflicts = {
  /** Block id (learner's blocks and the fixed ones they hit) to the titles it shares time with. */
  overlaps: Map<string, string[]>;
  /** Learner blocks that start before the day or end after it. */
  outside: Set<string>;
};

/** Everything that clashes, live: overlaps between any two items except two fixed commitments (the learner cannot change those), and blocks outside the day. */
export function findConflicts(scenario: ScheduleScenario, blocks: readonly Block[]): Conflicts {
  const fixedIds = new Set(scenario.fixed.map((item) => item.id));
  const overlaps = new Map<string, string[]>();
  const note = (id: string, other: string) => overlaps.set(id, [...(overlaps.get(id) ?? []), other]);
  for (const [a, b] of findOverlaps<Block | FixedBlock>([...blocks, ...scenario.fixed])) {
    if (fixedIds.has(a.id) && fixedIds.has(b.id)) continue;
    note(a.id, b.title);
    note(b.id, a.title);
  }
  const outside = new Set(blocks.filter((block) => block.start < scenario.windowStart || end(block) > scenario.windowEnd).map((block) => block.id));
  return { overlaps, outside };
}

export type DaySummary = { /** Minutes of task blocks. */ work: number; /** Break blocks plus meals and rest already in the day. */ rest: number; /** Open or buffer time left, as the check counts it. */ free: number };

export function daySummary(scenario: ScheduleScenario, blocks: readonly Block[]): DaySummary {
  const work = blocks.filter((block) => block.kind === 'task').reduce((sum, block) => sum + block.minutes, 0);
  const breaks = blocks.filter((block) => block.kind === 'break').reduce((sum, block) => sum + block.minutes, 0);
  const fixedRest = scenario.fixed.filter((item) => item.kind === 'meal' || item.kind === 'rest').reduce((sum, item) => sum + item.minutes, 0);
  return { work, rest: breaks + fixedRest, free: freeGaps(scenario, blocks).reduce((sum, gap) => sum + gap.minutes, 0) };
}

export type DayAdvice =
  | { code: 'overlap'; level: 'problem'; params: { count: number } }
  | { code: 'outside'; level: 'problem'; params: { count: number } }
  | { code: 'longRun'; level: 'problem'; params: { minutes: number; limit: number } }
  | { code: 'overPacked'; level: 'problem'; params: { planned: number; limit: number } }
  | { code: 'noRest'; level: 'note'; params: { needed: number } }
  | { code: 'littleRest'; level: 'note'; params: { rest: number; needed: number } }
  | { code: 'littleFree'; level: 'note'; params: { free: number; needed: number } }
  | { code: 'clear'; level: 'ok'; params: { free: number } };

/**
 * Plain advice shown while the learner builds, before any check: conflicts, a stretch of work longer than the day allows, too much planned, too
 * little rest or free time. Says nothing for a day with nothing in it. It repeats what the rules say; it is not a score.
 */
export function dayAdvice(scenario: ScheduleScenario, blocks: readonly Block[], rules: ScheduleRules): DayAdvice[] {
  if (blocks.length === 0) return [];
  const advice: DayAdvice[] = [];
  const { overlaps, outside } = findConflicts(scenario, blocks);
  const clashes = new Set<string>();
  for (const [a, b] of findOverlaps<Block | FixedBlock>([...blocks, ...scenario.fixed])) {
    const bothFixed = scenario.fixed.some((item) => item.id === a.id) && scenario.fixed.some((item) => item.id === b.id);
    if (!bothFixed) clashes.add([a.id, b.id].sort().join('|'));
  }
  if (overlaps.size > 0) advice.push({ code: 'overlap', level: 'problem', params: { count: clashes.size } });
  if (outside.size > 0) advice.push({ code: 'outside', level: 'problem', params: { count: outside.size } });
  const longest = focusRuns(scenario, blocks, rules.minBreakMinutes).reduce((max, run) => Math.max(max, run.minutes), 0);
  if (longest > rules.maxFocusRun) advice.push({ code: 'longRun', level: 'problem', params: { minutes: longest, limit: rules.maxFocusRun } });
  const { work, rest, free } = daySummary(scenario, blocks);
  if (work > rules.maxPlannedMinutes) advice.push({ code: 'overPacked', level: 'problem', params: { planned: work, limit: rules.maxPlannedMinutes } });
  if (rest === 0) advice.push({ code: 'noRest', level: 'note', params: { needed: rules.minBreakTotal } });
  else if (rest < rules.minBreakTotal) advice.push({ code: 'littleRest', level: 'note', params: { rest, needed: rules.minBreakTotal } });
  if (free < rules.minSlack) advice.push({ code: 'littleFree', level: 'note', params: { free, needed: rules.minSlack } });
  if (advice.length === 0) advice.push({ code: 'clear', level: 'ok', params: { free } });
  return advice;
}

export type TimelineRow =
  | { type: 'fixed'; start: number; minutes: number; item: FixedBlock }
  | { type: 'block'; start: number; minutes: number; item: Block }
  | { type: 'gap'; start: number; minutes: number };

const ROW_ORDER = { fixed: 0, block: 1, gap: 2 } as const;

/** The day as one list in time order: the fixed commitments, the learner's blocks, and the open stretches between them (at least a quarter-hour). */
export function timelineRows(scenario: ScheduleScenario, blocks: readonly Block[]): TimelineRow[] {
  const rows: TimelineRow[] = [
    ...scenario.fixed.map((item): TimelineRow => ({ type: 'fixed', start: item.start, minutes: item.minutes, item })),
    ...blocks.map((item): TimelineRow => ({ type: 'block', start: item.start, minutes: item.minutes, item })),
    ...openGaps(scenario, blocks)
      .filter((gap) => gap.minutes >= MIN_BLOCK)
      .map((gap): TimelineRow => ({ type: 'gap', start: gap.start, minutes: gap.minutes })),
  ];
  return rows.sort((a, b) => a.start - b.start || ROW_ORDER[a.type] - ROW_ORDER[b.type]);
}

export type BarSegment = { left: number; width: number; tone: 'task' | 'fixed' | 'rest' | 'buffer' };

/** The day drawn as one thin bar: where work, commitments, rest and buffers sit, as shares (0 to 100) of the day's hours. Overlaps overlay each other. */
export function dayBarSegments(scenario: ScheduleScenario, blocks: readonly Block[]): BarSegment[] {
  const span = scenario.windowEnd - scenario.windowStart;
  if (span <= 0) return [];
  const items: { start: number; minutes: number; tone: BarSegment['tone'] }[] = [
    ...scenario.fixed.map((item) => ({ start: item.start, minutes: item.minutes, tone: (item.kind === 'meal' || item.kind === 'rest' ? 'rest' : 'fixed') as BarSegment['tone'] })),
    ...blocks.map((item) => ({ start: item.start, minutes: item.minutes, tone: (item.kind === 'task' ? 'task' : item.kind === 'break' ? 'rest' : 'buffer') as BarSegment['tone'] })),
  ];
  const segments: BarSegment[] = [];
  for (const item of items) {
    const from = Math.max(item.start, scenario.windowStart);
    const to = Math.min(end(item), scenario.windowEnd);
    if (to > from) segments.push({ left: ((from - scenario.windowStart) / span) * 100, width: ((to - from) / span) * 100, tone: item.tone });
  }
  return segments;
}
