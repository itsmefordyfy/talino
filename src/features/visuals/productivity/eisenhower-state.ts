import { MAX_TITLE, MAX_TOOL_TASKS, moveTask, type MatrixToolState, type Quadrant } from '@/features/productivity';

/** The free matrix's changes as pure functions of the saved state, so the screen and the tests share one rule set. Each returns a new state (the same one when nothing changes). */

/** Adds a task with the given id. A blank title, or a full board, changes nothing; a long title is cut at `MAX_TITLE`. */
export function addMatrixTask(state: MatrixToolState, id: string, title: string): MatrixToolState {
  const clean = title.trim().slice(0, MAX_TITLE).trim();
  if (!clean || state.tasks.length >= MAX_TOOL_TASKS || state.tasks.some((task) => task.id === id)) return state;
  return { ...state, tasks: [...state.tasks, { id, title: clean }] };
}

/** Takes a task off the list and forgets where it was placed. */
export function removeMatrixTask(state: MatrixToolState, id: string): MatrixToolState {
  if (!state.tasks.some((task) => task.id === id)) return state;
  const placements = { ...state.placements };
  delete placements[id];
  return { tasks: state.tasks.filter((task) => task.id !== id), placements };
}

/** Moves a task to a box, or back to "not sorted yet" with `null`. A task that is not on the board is ignored. */
export function placeMatrixTask(state: MatrixToolState, id: string, to: Quadrant | null): MatrixToolState {
  if (!state.tasks.some((task) => task.id === id)) return state;
  return { ...state, placements: moveTask(state.placements, id, to) };
}

export const isMatrixFull = (state: MatrixToolState): boolean => state.tasks.length >= MAX_TOOL_TASKS;
