import type { ArrangeActivity, MatchActivity } from '../types';
import { shuffledIndexes } from './text';

/** The lines of an arrange activity in their starting (shuffled) order. Deterministic per activity and never already solved. */
export function arrangeStart(activity: ArrangeActivity): string[] {
  const orders = [activity.solution, ...(activity.alternatives ?? [])];
  // Avoid starting on any accepted order. Equal lines make several index orders spell the same program, so compare by text.
  const base = activity.solution;
  const forbiddenIndexOrders: number[][] = [];
  const used = new Set<number>();
  for (const order of orders) {
    const indexes: number[] = [];
    used.clear();
    for (const line of order) {
      const at = base.findIndex((candidate, index) => candidate === line && !used.has(index));
      used.add(at);
      indexes.push(at);
    }
    forbiddenIndexOrders.push(indexes);
  }
  const seed = activity.id;
  for (let salt = 0; salt < 20; salt += 1) {
    const order = shuffledIndexes(base.length, salt === 0 ? seed : `${seed}#${salt}`, forbiddenIndexOrders);
    const lines = order.map((index) => base[index]);
    if (!orders.some((accepted) => accepted.every((line, index) => line === lines[index]))) return lines;
  }
  return [...base].reverse();
}

/** Moves the item at `from` to `to`, shifting the others. Out-of-range moves return the list unchanged. */
export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  const copy = [...items];
  if (from < 0 || from >= copy.length || to < 0 || to >= copy.length || from === to) return copy;
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}

/** Swaps two items. Out-of-range or equal indexes return the list unchanged. */
export function swapItems<T>(items: readonly T[], a: number, b: number): T[] {
  const copy = [...items];
  if (a < 0 || b < 0 || a >= copy.length || b >= copy.length || a === b) return copy;
  [copy[a], copy[b]] = [copy[b], copy[a]];
  return copy;
}

/** The order the match activity lists definitions in: indexes into `pairs`, shuffled, never the same as the terms' order. */
export function matchDefinitionOrder(activity: MatchActivity): number[] {
  return shuffledIndexes(activity.pairs.length, `${activity.id}:match`);
}
