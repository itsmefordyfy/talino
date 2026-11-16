import { dsaStrings } from './strings';

type Text = typeof dsaStrings.en.searching;

/** A sorted list the learner can search: every third number starting at 2, so some targets are present and some are not. */
export const makeSearchArray = (size: number): number[] => Array.from({ length: size }, (_, index) => index * 3 + 2);

export type LinearStep = { index: number | null; checked: number; found: number | null; done: boolean; caption: string };
export type BinaryStep = { low: number; high: number; mid: number | null; checked: number; found: number | null; done: boolean; caption: string };

/** Linear search: look at each value from the left until it is the target or the list ends. */
export function linearSearchSteps(values: readonly number[], target: number, t: Text = dsaStrings.en.searching): LinearStep[] {
  const steps: LinearStep[] = [{ index: null, checked: 0, found: null, done: false, caption: t.linearStart(target) }];
  for (let i = 0; i < values.length; i += 1) {
    const value = values[i] ?? 0;
    if (value === target) {
      steps.push({ index: i, checked: i + 1, found: i, done: true, caption: t.linearFound(value, i, i + 1) });
      return steps;
    }
    steps.push({ index: i, checked: i + 1, found: null, done: false, caption: t.linearMiss(value, i, target) });
  }
  steps.push({ index: null, checked: values.length, found: null, done: true, caption: t.linearNotFound(target, values.length) });
  return steps;
}

/** Binary search on a sorted list: look at the middle and discard the half that cannot hold the target. */
export function binarySearchSteps(values: readonly number[], target: number, t: Text = dsaStrings.en.searching): BinaryStep[] {
  let low = 0;
  let high = values.length - 1;
  let checked = 0;
  const steps: BinaryStep[] = [{ low, high, mid: null, checked, found: null, done: values.length === 0, caption: t.binaryStart(target, values.length) }];
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const value = values[mid] ?? 0;
    checked += 1;
    if (value === target) {
      steps.push({ low, high, mid, checked, found: mid, done: true, caption: t.binaryFound(value, mid, checked) });
      return steps;
    }
    const goRight = value < target;
    steps.push({ low, high, mid, checked, found: null, done: false, caption: t.binaryMiss(value, mid, target, goRight, goRight ? mid + 1 - low : high - mid + 1) });
    if (goRight) low = mid + 1;
    else high = mid - 1;
  }
  steps.push({ low, high, mid: null, checked, found: null, done: true, caption: t.binaryNotFound(target, checked) });
  return steps;
}

export type SearchPair = { linear: LinearStep; binary: BinaryStep };

/** Both searches side by side, one step each at a time; the shorter one waits on its last step. */
export function buildSearchPairs(values: readonly number[], target: number, t: Text = dsaStrings.en.searching): SearchPair[] {
  const linear = linearSearchSteps(values, target, t);
  const binary = binarySearchSteps(values, target, t);
  const count = Math.max(linear.length, binary.length);
  return Array.from({ length: count }, (_, index) => ({ linear: linear[Math.min(index, linear.length - 1)]!, binary: binary[Math.min(index, binary.length - 1)]! }));
}
