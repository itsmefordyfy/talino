import { QUADRANTS, type MatrixPlacements, type MatrixTaskSpec, type Quadrant } from '../types';

/** The two questions that place a task: does it need attention soon, and does it matter to a goal you care about? */
export function quadrantFor(urgent: boolean, important: boolean): Quadrant {
  if (urgent) return important ? 'do' : 'delegate';
  return important ? 'plan' : 'drop';
}

export const DEFAULT_PASS_RATIO = 0.75;

export type MatrixResult = {
  /** Every task is placed and at least `passRatio` of them are in an acceptable box. */
  correct: boolean;
  /** The share of all tasks (placed or not) that sit in an acceptable box, 0 to 1. */
  ratio: number;
  right: string[];
  wrong: { id: string; got: Quadrant; expected: Quadrant }[];
  /** Tasks the learner has not placed yet; they count as wrong, so a half-sorted board never passes. */
  unplaced: string[];
};

/** Scores a sorting exercise. A box the task spec lists in `alsoAcceptable` counts as right, because reasonable people place some tasks differently. */
export function scoreMatrix(tasks: readonly MatrixTaskSpec[], placements: MatrixPlacements, passRatio = DEFAULT_PASS_RATIO): MatrixResult {
  const right: string[] = [];
  const wrong: MatrixResult['wrong'] = [];
  const unplaced: string[] = [];
  for (const task of tasks) {
    const got = placements[task.id];
    if (!got) unplaced.push(task.id);
    else if (got === task.expected || task.alsoAcceptable?.includes(got)) right.push(task.id);
    else wrong.push({ id: task.id, got, expected: task.expected });
  }
  const ratio = tasks.length === 0 ? 0 : right.length / tasks.length;
  return { correct: unplaced.length === 0 && ratio >= passRatio, ratio, right, wrong, unplaced };
}

/** A new set of placements with one task moved to a box (or taken off the board with `null`). */
export function moveTask(placements: MatrixPlacements, taskId: string, to: Quadrant | null): MatrixPlacements {
  const next: MatrixPlacements = { ...placements };
  if (to === null) delete next[taskId];
  else next[taskId] = to;
  return next;
}

export type MatrixGroups<T extends { id: string }> = Record<Quadrant, T[]> & { unplaced: T[] };

/** The tasks of each box, in their given order, plus the ones not placed yet. */
export function groupByQuadrant<T extends { id: string }>(tasks: readonly T[], placements: MatrixPlacements): MatrixGroups<T> {
  const groups = { do: [], plan: [], delegate: [], drop: [], unplaced: [] } as MatrixGroups<T>;
  for (const task of tasks) {
    const placed = placements[task.id];
    if (placed && (QUADRANTS as readonly string[]).includes(placed)) groups[placed].push(task);
    else groups.unplaced.push(task);
  }
  return groups;
}
