import { arrayOpsStrings } from './array-ops-strings';

type Text = typeof arrayOpsStrings.en;

/** How many cells the picture holds. */
export const MAX_LENGTH = 10;
export const MIN_START = 4;
const POOL = [14, 7, 22, 3, 18, 9, 30, 11, 5, 26] as const;

export type ArrayOperation = 'insert' | 'delete' | 'append' | 'traverse' | 'search';
export type Complexity = 'O1' | 'On';

export type ArrayStep = {
  /** Every cell of the array's memory, in order; `null` is spare room. Always MAX_LENGTH long. */
  cells: (number | null)[];
  /** The cell being read now. */
  reading: number | null;
  /** The cell being written now. */
  writing: number | null;
  found: number | null;
  /** The element about to be removed. */
  doomed: number | null;
  /** The cell just given the new value. */
  fresh: number | null;
  /** Reads and writes of elements so far in the running operation. */
  reads: number;
  writes: number;
  operation: ArrayOperation | null;
  /** How the cost of the operation grows (null before an operation, and when it was refused). */
  complexity: Complexity | null;
  /** True when the operation was refused and nothing changed. */
  refused: boolean;
  caption: string;
};

/** A starting array of `size` numbers (clamped to 4..10). */
export function makeArray(size: number): number[] {
  return POOL.slice(0, Math.min(MAX_LENGTH, Math.max(MIN_START, Math.floor(size))));
}

const pad = (values: readonly number[]): (number | null)[] => Array.from({ length: MAX_LENGTH }, (_, index) => values[index] ?? null);

/** The elements of a step's array, without the spare room. */
export const valuesOf = (step: Pick<ArrayStep, 'cells'>): number[] => step.cells.filter((cell): cell is number => cell !== null);

const mk = (cells: readonly (number | null)[], extra: Partial<ArrayStep>, caption: string): ArrayStep => ({
  cells: [...cells],
  reading: null,
  writing: null,
  found: null,
  doomed: null,
  fresh: null,
  reads: 0,
  writes: 0,
  operation: null,
  complexity: null,
  refused: false,
  ...extra,
  caption,
});

/** The array as it is shown when nothing is happening. */
export const idleStep = (values: readonly number[], caption: string): ArrayStep => mk(pad(values), {}, caption);

const refuse = (values: readonly number[], caption: string): ArrayStep[] => [mk(pad(values), { refused: true }, caption)];

/** Insert so the new value ends up at `index` (0 to length): every element from `index` on moves one cell right, last one first. */
export function insertAtSteps(values: readonly number[], index: number, value: number, t: Text = arrayOpsStrings.en): ArrayStep[] {
  if (!Number.isInteger(index) || index < 0 || index > values.length) return refuse(values, t.badIndex(index, 0, values.length));
  if (values.length >= MAX_LENGTH) return refuse(values, t.full(MAX_LENGTH));
  const shifts = values.length - index;
  const complexity: Complexity = shifts === 0 ? 'O1' : 'On';
  const cells = pad(values);
  const common = { operation: 'insert' as const, complexity };
  const steps: ArrayStep[] = [mk(cells, { ...common }, t.insertStart(value, index, shifts))];
  let reads = 0;
  let writes = 0;
  for (let from = values.length - 1; from >= index; from -= 1) {
    reads += 1;
    writes += 1;
    cells[from + 1] = cells[from] ?? null;
    steps.push(mk(cells, { ...common, reading: from, writing: from + 1, reads, writes }, t.shift(from, from + 1, cells[from] ?? 0)));
  }
  writes += 1;
  cells[index] = value;
  steps.push(mk(cells, { ...common, writing: index, fresh: index, reads, writes }, t.place(value, index, reads, writes)));
  return steps;
}

/** Append at the end: one write, nothing moves. */
export function appendSteps(values: readonly number[], value: number, t: Text = arrayOpsStrings.en): ArrayStep[] {
  if (values.length >= MAX_LENGTH) return refuse(values, t.full(MAX_LENGTH));
  const cells = pad(values);
  const common = { operation: 'append' as const, complexity: 'O1' as const };
  const start = mk(cells, { ...common }, t.appendStart(value, values.length));
  cells[values.length] = value;
  return [start, mk(cells, { ...common, writing: values.length, fresh: values.length, writes: 1 }, t.place(value, values.length, 0, 1))];
}

/** Delete the element at `index`: every element after it moves one cell left, first one first, then the array is one shorter. */
export function deleteAtSteps(values: readonly number[], index: number, t: Text = arrayOpsStrings.en): ArrayStep[] {
  if (values.length === 0) return refuse(values, t.emptyArray);
  if (!Number.isInteger(index) || index < 0 || index >= values.length) return refuse(values, t.badIndex(index, 0, values.length - 1));
  const doomedValue = values[index] ?? 0;
  const shifts = values.length - 1 - index;
  const complexity: Complexity = shifts === 0 ? 'O1' : 'On';
  const cells = pad(values);
  const common = { operation: 'delete' as const, complexity };
  const steps: ArrayStep[] = [mk(cells, { ...common, doomed: index }, t.deleteStart(doomedValue, index, shifts))];
  let reads = 0;
  let writes = 0;
  for (let from = index + 1; from < values.length; from += 1) {
    reads += 1;
    writes += 1;
    cells[from - 1] = cells[from] ?? null;
    steps.push(mk(cells, { ...common, reading: from, writing: from - 1, reads, writes }, t.shift(from, from - 1, cells[from] ?? 0)));
  }
  cells[values.length - 1] = null;
  steps.push(mk(cells, { ...common, reads, writes }, t.deleteDone(doomedValue, reads, writes)));
  return steps;
}

/** Visit every element once, in order. */
export function traverseSteps(values: readonly number[], t: Text = arrayOpsStrings.en): ArrayStep[] {
  if (values.length === 0) return refuse(values, t.emptyArray);
  const cells = pad(values);
  const common = { operation: 'traverse' as const, complexity: 'On' as const };
  const steps: ArrayStep[] = [mk(cells, { ...common }, t.traverseStart(values.length))];
  values.forEach((value, index) => steps.push(mk(cells, { ...common, reading: index, reads: index + 1 }, t.visit(index, value))));
  steps.push(mk(cells, { ...common, reads: values.length }, t.traverseDone(values.length)));
  return steps;
}

/** Linear search: read cells from index 0 until the value turns up or the array ends. */
export function searchSteps(values: readonly number[], target: number, t: Text = arrayOpsStrings.en): ArrayStep[] {
  if (values.length === 0) return refuse(values, t.emptyArray);
  const cells = pad(values);
  const common = { operation: 'search' as const, complexity: 'On' as const };
  const steps: ArrayStep[] = [mk(cells, { ...common }, t.searchStart(target))];
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index] ?? 0;
    if (value === target) {
      steps.push(mk(cells, { ...common, reading: index, found: index, reads: index + 1 }, t.searchFound(index, value, index + 1)));
      return steps;
    }
    steps.push(mk(cells, { ...common, reading: index, reads: index + 1 }, t.searchMiss(index, value, target)));
  }
  steps.push(mk(cells, { ...common, reads: values.length }, t.searchNone(target, values.length)));
  return steps;
}
