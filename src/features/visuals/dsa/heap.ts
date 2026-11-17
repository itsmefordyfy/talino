import { heapStrings } from './heap-strings';
import { seededRandom } from './sorting';

type Text = typeof heapStrings.en;

export type HeapKind = 'min' | 'max';
export type HeapOp = 'idle' | 'insert' | 'extract' | 'build' | 'sort';
/** Four full levels: the picture stays readable on a phone. */
export const MAX_HEAP = 15;
export const START_VALUES = [4, 9, 7, 15, 12, 20, 11];

export type HeapStep = {
  /** The whole backing array. Values at index `size` and beyond have left the heap (the sorted tail, or the value being extracted). */
  values: number[];
  /** The heap is values[0 .. size - 1]. */
  size: number;
  /** What the values past `size` are: nothing, the value being extracted, or the sorted tail of a heap sort. */
  tail: 'none' | 'removed' | 'sorted';
  /** The two indexes being compared (child first when there is a parent). */
  compare: [number, number] | null;
  /** The two indexes just swapped. */
  swapped: [number, number] | null;
  /** The node being worked on. */
  focus: number | null;
  comparisons: number;
  swaps: number;
  op: HeapOp;
  caption: string;
};

export type HeapRun = { steps: HeapStep[]; /** The heap after the operation (a heap sort leaves the heap as it was). */ result: number[]; comparisons: number; swaps: number };

export const parentOf = (index: number) => Math.floor((index - 1) / 2);
export const leftOf = (index: number) => 2 * index + 1;
export const rightOf = (index: number) => 2 * index + 2;
/** True when `a` belongs above `b` in this kind of heap (strictly: equal values never swap). */
export const better = (a: number, b: number, kind: HeapKind) => (kind === 'min' ? a < b : a > b);
/** The tree level of an index (the root is level 0). */
export const levelOf = (index: number) => Math.floor(Math.log2(index + 1));

/** True when every parent is at least as good as its children, over the first `size` values. */
export function isHeap(values: readonly number[], kind: HeapKind, size = values.length): boolean {
  for (let i = 1; i < size; i += 1) if (better(values[i] ?? 0, values[parentOf(i)] ?? 0, kind)) return false;
  return true;
}

/** The same values arranged as a heap, without recording steps (used to switch kind). */
export function heapifyValues(values: readonly number[], kind: HeapKind): number[] {
  const a = [...values];
  for (let start = Math.floor(a.length / 2) - 1; start >= 0; start -= 1) {
    let i = start;
    for (;;) {
      let c = leftOf(i);
      if (c >= a.length) break;
      if (rightOf(i) < a.length && better(a[rightOf(i)] ?? 0, a[c] ?? 0, kind)) c = rightOf(i);
      if (!better(a[c] ?? 0, a[i] ?? 0, kind)) break;
      [a[i], a[c]] = [a[c] ?? 0, a[i] ?? 0];
      i = c;
    }
  }
  return a;
}

/** `count` distinct values from 1 to 60 in a repeatable shuffled order. */
export function randomValues(count: number, seed: number): number[] {
  const random = seededRandom(seed);
  const seen = new Set<number>();
  while (seen.size < count) seen.add(1 + Math.floor(random() * 60));
  return [...seen];
}

/** The picture of a heap when nothing is happening. */
export function idleStep(values: readonly number[], caption: string): HeapStep {
  return { values: [...values], size: values.length, tail: 'none', compare: null, swapped: null, focus: null, comparisons: 0, swaps: 0, op: 'idle', caption };
}

/** One operation's recorder: the array, its counters and a `snap` that records the picture after each move. */
function recorder(initial: readonly number[], kind: HeapKind, op: HeapOp, t: Text) {
  const a = [...initial];
  let size = a.length;
  let tail: HeapStep['tail'] = 'none';
  let comparisons = 0;
  let swaps = 0;
  const steps: HeapStep[] = [];
  const at = (index: number) => a[index] ?? 0;
  const snap = (caption: string, extra: Partial<Pick<HeapStep, 'compare' | 'swapped' | 'focus'>> = {}) => {
    steps.push({ values: [...a], size, tail, compare: extra.compare ?? null, swapped: extra.swapped ?? null, focus: extra.focus ?? null, comparisons, swaps, op, caption });
  };
  const swap = (i: number, j: number) => {
    [a[i], a[j]] = [at(j), at(i)];
    swaps += 1;
  };

  /** Move the value at `start` up while it beats its parent. */
  const siftUp = (start: number) => {
    let i = start;
    while (i > 0) {
      const p = parentOf(i);
      comparisons += 1;
      const up = better(at(i), at(p), kind);
      snap(t.siftUpCompare(at(i), at(p), kind, up), { compare: [i, p] });
      if (!up) return;
      swap(i, p);
      snap(t.swapped(at(p), at(i)), { swapped: [p, i] });
      i = p;
    }
    if (start > 0) snap(t.reachedRoot(at(0)), { focus: 0 });
  };

  /** Move the value at `start` down while a child beats it, only looking inside the heap (indexes below `size`). */
  const siftDown = (start: number) => {
    let i = start;
    for (;;) {
      const l = leftOf(i);
      const r = rightOf(i);
      if (l >= size) {
        snap(t.reachedLeaf(at(i)), { focus: i });
        return;
      }
      let c = l;
      if (r < size) {
        comparisons += 1;
        if (better(at(r), at(l), kind)) c = r;
        snap(t.pickChild(at(l), at(r), kind), { compare: [l, r] });
      }
      comparisons += 1;
      const down = better(at(c), at(i), kind);
      snap(t.siftDownCompare(at(i), at(c), kind, down), { compare: [i, c] });
      if (!down) return;
      swap(i, c);
      snap(t.swapped(at(i), at(c)), { swapped: [i, c] });
      i = c;
    }
  };

  const build = () => {
    for (let i = Math.floor(size / 2) - 1; i >= 0; i -= 1) {
      snap(t.buildNode(at(i), i), { focus: i });
      siftDown(i);
    }
  };

  return {
    a,
    steps,
    snap,
    swap,
    siftUp,
    siftDown,
    build,
    at,
    counts: () => ({ comparisons, swaps }),
    setSize: (next: number) => {
      size = next;
    },
    setTail: (next: HeapStep['tail']) => {
      tail = next;
    },
  };
}

const refusal = (values: readonly number[], caption: string, op: HeapOp): HeapRun => ({ steps: [{ ...idleStep(values, caption), op }], result: [...values], comparisons: 0, swaps: 0 });

/** Insert: add at the end, then sift up. O(log n). */
export function insertSteps(values: readonly number[], value: number, kind: HeapKind, t: Text = heapStrings.en): HeapRun {
  if (values.length >= MAX_HEAP) return refusal(values, t.full(MAX_HEAP), 'insert');
  const r = recorder(values, kind, 'insert', t);
  r.a.push(value);
  r.setSize(r.a.length);
  r.snap(t.insertStart(value, r.a.length - 1), { focus: r.a.length - 1 });
  r.siftUp(r.a.length - 1);
  const { comparisons, swaps } = r.counts();
  r.snap(t.insertDone(comparisons, swaps));
  return { steps: r.steps, result: [...r.a], comparisons, swaps };
}

/** Extract the root: swap the last value to the root, drop the old root, then sift down. O(log n). */
export function extractSteps(values: readonly number[], kind: HeapKind, t: Text = heapStrings.en): HeapRun {
  if (values.length === 0) return refusal(values, t.emptyRefused, 'extract');
  const r = recorder(values, kind, 'extract', t);
  const n = r.a.length;
  const rootValue = r.at(0);
  r.snap(t.extractStart(rootValue, kind), { focus: 0 });
  if (n === 1) {
    r.a.pop();
    r.setSize(0);
    r.snap(t.extractOnly(rootValue));
    return { steps: r.steps, result: [], comparisons: 0, swaps: 0 };
  }
  const last = r.at(n - 1);
  r.swap(0, n - 1);
  r.setSize(n - 1);
  r.setTail('removed');
  r.snap(t.extractMove(rootValue, last), { swapped: [0, n - 1] });
  r.siftDown(0);
  // Sifting only touches the first n - 1 slots, so the extracted value is still the last one.
  r.a.pop();
  r.setTail('none');
  const { comparisons, swaps } = r.counts();
  r.snap(t.extractDone(rootValue, comparisons, swaps));
  return { steps: r.steps, result: [...r.a], comparisons, swaps };
}

/** Build-heap (heapify): sift down every parent from the last one back to the root. O(n). */
export function buildSteps(input: readonly number[], kind: HeapKind, t: Text = heapStrings.en): HeapRun {
  const r = recorder(input, kind, 'build', t);
  r.snap(t.buildStart(input.length));
  r.build();
  const { comparisons, swaps } = r.counts();
  r.snap(t.buildDone(comparisons, swaps));
  return { steps: r.steps, result: [...r.a], comparisons, swaps };
}

/** Heap sort: build a heap, then swap the root to the end and shrink the heap, over and over. O(n log n). A max-heap sorts ascending, a min-heap descending. */
export function heapSortSteps(input: readonly number[], kind: HeapKind, t: Text = heapStrings.en): HeapRun {
  const r = recorder(input, kind, 'sort', t);
  r.snap(t.sortStart(input.length, kind));
  r.build();
  r.setTail('sorted');
  for (let end = r.a.length - 1; end >= 1; end -= 1) {
    const rootValue = r.at(0);
    r.swap(0, end);
    r.setSize(end);
    r.snap(t.sortMove(rootValue, end), { swapped: [0, end] });
    if (end > 1) r.siftDown(0);
  }
  r.setSize(0);
  const { comparisons, swaps } = r.counts();
  r.snap(t.sortDone(comparisons, swaps, kind));
  // Heap sort here is a demonstration on a copy: the stored heap stays as it was.
  return { steps: r.steps, result: [...input], comparisons, swaps };
}
