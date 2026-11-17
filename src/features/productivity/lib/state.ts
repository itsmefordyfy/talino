import { QUADRANTS, type Block, type MatrixPlacements, type Priority, type Quadrant, type ScheduleTask } from '../types';
import { clampMinutes } from './time';

/**
 * What the free tools keep between visits (Eisenhower matrix, day planner). It is read back from the database, so it is treated as untrusted:
 * every field is checked and capped, and anything that does not fit the shape is dropped rather than crashing the lesson.
 */

export const MAX_TOOL_TASKS = 30;
export const MAX_TITLE = 80;

export type MatrixToolState = { tasks: { id: string; title: string }[]; placements: MatrixPlacements };
export const EMPTY_MATRIX: MatrixToolState = { tasks: [], placements: {} };

export type DayToolState = { windowStart: number; windowEnd: number; tasks: ScheduleTask[]; blocks: Block[] };
export const EMPTY_DAY: DayToolState = { windowStart: 8 * 60, windowEnd: 18 * 60, tasks: [], blocks: [] };

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown, max = MAX_TITLE): string | null => (typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null);
const id = (value: unknown): string | null => (typeof value === 'string' && /^[\w-]{1,60}$/.test(value) ? value : null);
const num = (value: unknown): number | null => (typeof value === 'number' && Number.isFinite(value) ? value : null);

export function parseMatrixState(raw: unknown): MatrixToolState {
  if (!isObject(raw) || !Array.isArray(raw.tasks)) return EMPTY_MATRIX;
  const tasks: MatrixToolState['tasks'] = [];
  const seen = new Set<string>();
  for (const item of raw.tasks) {
    if (!isObject(item)) continue;
    const taskId = id(item.id);
    const title = text(item.title);
    if (!taskId || !title || seen.has(taskId) || tasks.length >= MAX_TOOL_TASKS) continue;
    seen.add(taskId);
    tasks.push({ id: taskId, title });
  }
  const placements: MatrixPlacements = {};
  if (isObject(raw.placements)) {
    for (const [taskId, box] of Object.entries(raw.placements)) {
      if (seen.has(taskId) && typeof box === 'string' && (QUADRANTS as readonly string[]).includes(box)) placements[taskId] = box as Quadrant;
    }
  }
  return { tasks, placements };
}

const PRIORITIES: readonly string[] = ['high', 'medium', 'low'];
const BLOCK_KINDS: readonly string[] = ['task', 'break', 'buffer'];

export function parseDayState(raw: unknown): DayToolState {
  if (!isObject(raw)) return EMPTY_DAY;
  const start = num(raw.windowStart);
  const end = num(raw.windowEnd);
  const windowStart = start !== null ? clampMinutes(start, 0, 1200) : EMPTY_DAY.windowStart;
  const windowEnd = end !== null ? clampMinutes(end, windowStart + 60, 1440) : EMPTY_DAY.windowEnd;
  const tasks: ScheduleTask[] = [];
  const taskIds = new Set<string>();
  for (const item of Array.isArray(raw.tasks) ? raw.tasks : []) {
    if (!isObject(item)) continue;
    const taskId = id(item.id);
    const title = text(item.title);
    const minutes = num(item.minutes);
    if (!taskId || !title || minutes === null || taskIds.has(taskId) || tasks.length >= MAX_TOOL_TASKS) continue;
    taskIds.add(taskId);
    tasks.push({ id: taskId, title, minutes: clampMinutes(minutes, 5, 480), priority: (typeof item.priority === 'string' && PRIORITIES.includes(item.priority) ? item.priority : 'medium') as Priority });
  }
  const blocks: Block[] = [];
  const blockIds = new Set<string>();
  for (const item of Array.isArray(raw.blocks) ? raw.blocks : []) {
    if (!isObject(item)) continue;
    const blockId = id(item.id);
    const startAt = num(item.start);
    const minutes = num(item.minutes);
    const title = text(item.title) ?? '';
    if (!blockId || startAt === null || minutes === null || blockIds.has(blockId) || blocks.length >= MAX_TOOL_TASKS * 3) continue;
    const kind = typeof item.kind === 'string' && BLOCK_KINDS.includes(item.kind) ? (item.kind as Block['kind']) : null;
    if (!kind) continue;
    const taskId = id(item.taskId) ?? undefined;
    if (kind === 'task' && !(taskId && taskIds.has(taskId))) continue;
    blockIds.add(blockId);
    blocks.push({ id: blockId, kind, taskId: kind === 'task' ? taskId : undefined, title, start: clampMinutes(startAt), minutes: clampMinutes(minutes, 5, 480) });
  }
  return { windowStart, windowEnd, tasks, blocks };
}
