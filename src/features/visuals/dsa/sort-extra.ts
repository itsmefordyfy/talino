import { seededRandom } from './sorting';
import { sortExtraStrings } from './sort-extra-strings';

type Text = typeof sortExtraStrings.en;

export type ExtraAlgorithm = 'heap' | 'counting';
export const EXTRA_ALGORITHMS: readonly ExtraAlgorithm[] = ['heap', 'counting'];
export const MIN_ITEMS = 6;
export const MAX_ITEMS = 12;
export const MAX_VALUE = 9;

export type ExtraPhase = 'start' | 'build' | 'extract' | 'count' | 'prefix' | 'place' | 'done';

export type ExtraStep = {
  /** The list. Heap sort rearranges it in place; counting sort leaves it as it was. */
  values: number[];
  /** Heap sort: the heap is values[0 .. heapSize - 1]. Null for counting sort. */
  heapSize: number | null;
  /** Heap sort: values from this position on are sorted and final. Equal to the list length when none are yet. */
  sortedFrom: number;
  compare: number[];
  moved: number[];
  /** Counting sort: the counts array (one slot per value 0 .. max), then running totals, then next free spots. Null for heap sort. */
  counts: number[] | null;
  countFocus: number | null;
  /** Counting sort: the input position being read. */
  readIndex: number | null;
  /** Counting sort: the output list as it is written (null is empty). */
  output: (number | null)[] | null;
  outputFocus: number | null;
  /** Counting sort: which input position each output value came from (for checking stability). */
  origin: (number | null)[] | null;
  phase: ExtraPhase;
  comparisons: number;
  /** Swaps for heap sort, writes into the counts or output arrays for counting sort. */
  moves: number;
  caption: string;
};

export type ExtraRun = { steps: ExtraStep[]; comparisons: number; moves: number; moveKind: 'swaps' | 'writes'; result: number[] };

const blank = { compare: [] as number[], moved: [] as number[], counts: null, countFocus: null, readIndex: null, output: null, outputFocus: null, origin: null };

function heapSort(input: readonly number[], t: Text): ExtraRun {
  const a = [...input];
  const n = a.length;
  const at = (i: number) => a[i] ?? 0;
  let heapSize = n;
  let sortedFrom = n;
  let comparisons = 0;
  let moves = 0;
  let phase: ExtraPhase = 'start';
  const steps: ExtraStep[] = [];
  const snap = (caption: string, extra: Partial<Pick<ExtraStep, 'compare' | 'moved'>> = {}) =>
    steps.push({ ...blank, values: [...a], heapSize, sortedFrom, compare: extra.compare ?? [], moved: extra.moved ?? [], phase, comparisons, moves, caption });
  const swap = (i: number, j: number) => {
    [a[i], a[j]] = [at(j), at(i)];
    moves += 1;
  };
  const siftDown = (start: number) => {
    let i = start;
    for (;;) {
      const l = 2 * i + 1;
      const r = l + 1;
      if (l >= heapSize) {
        snap(t.hLeaf(at(i)));
        return;
      }
      let c = l;
      if (r < heapSize) {
        comparisons += 1;
        if (at(r) > at(l)) c = r;
        snap(t.hPickChild(at(l), at(r), at(c)), { compare: [l, r] });
      }
      comparisons += 1;
      const down = at(c) > at(i);
      snap(t.hCompare(at(i), at(c), down), { compare: [i, c] });
      if (!down) return;
      swap(i, c);
      snap(t.hSwap(at(i), at(c)), { moved: [i, c] });
      i = c;
    }
  };

  snap(t.hStart(n));
  phase = 'build';
  for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) {
    snap(t.hBuild(at(i), i));
    siftDown(i);
  }
  phase = 'extract';
  if (n > 1) snap(t.hHeapReady);
  for (let end = n - 1; end >= 1; end -= 1) {
    const biggest = at(0);
    swap(0, end);
    heapSize = end;
    sortedFrom = end;
    snap(t.hMove(biggest, end), { moved: [0, end] });
    if (end > 1) siftDown(0);
  }
  heapSize = 0;
  sortedFrom = 0;
  phase = 'done';
  snap(t.hDone(comparisons, moves));
  return { steps, comparisons, moves, moveKind: 'swaps', result: [...a] };
}

function countingSort(input: readonly number[], t: Text): ExtraRun {
  const n = input.length;
  const k = Math.max(0, ...input) + 1;
  const counts: number[] = Array.from({ length: k }, () => 0);
  const output: (number | null)[] = Array.from({ length: n }, () => null);
  const origin: (number | null)[] = Array.from({ length: n }, () => null);
  let moves = 0;
  let phase: ExtraPhase = 'start';
  const steps: ExtraStep[] = [];
  const snap = (caption: string, extra: Partial<Pick<ExtraStep, 'countFocus' | 'readIndex' | 'outputFocus' | 'moved'>> = {}) =>
    steps.push({ values: [...input], heapSize: null, sortedFrom: n, compare: [], moved: extra.moved ?? [], counts: [...counts], countFocus: extra.countFocus ?? null, readIndex: extra.readIndex ?? null, output: [...output], outputFocus: extra.outputFocus ?? null, origin: [...origin], phase, comparisons: 0, moves, caption });

  snap(t.cStart(n, k));
  phase = 'count';
  input.forEach((value, index) => {
    counts[value] = (counts[value] ?? 0) + 1;
    moves += 1;
    snap(t.cCount(value, index, counts[value] ?? 0), { countFocus: value, readIndex: index });
  });
  snap(t.cCountDone);
  phase = 'prefix';
  for (let v = 1; v < k; v += 1) {
    counts[v] = (counts[v] ?? 0) + (counts[v - 1] ?? 0);
    moves += 1;
    snap(t.cPrefix(v, counts[v] ?? 0), { countFocus: v });
  }
  snap(t.cPrefixDone);
  phase = 'place';
  // From the right, so equal values keep the order they had (stable).
  for (let index = n - 1; index >= 0; index -= 1) {
    const value = input[index] ?? 0;
    counts[value] = (counts[value] ?? 0) - 1;
    const spot = counts[value] ?? 0;
    output[spot] = value;
    origin[spot] = index;
    moves += 1;
    snap(t.cPlace(value, index, spot), { countFocus: value, readIndex: index, outputFocus: spot, moved: [spot] });
  }
  phase = 'done';
  snap(t.cDone(moves));
  return { steps, comparisons: 0, moves, moveKind: 'writes', result: output.map((value) => value ?? 0) };
}

/** Heap sort (ascending, a max-heap) or counting sort on small whole numbers 0 to 9, as a list of pictures. */
export function buildExtraSteps(algorithm: ExtraAlgorithm, input: readonly number[], t: Text = sortExtraStrings.en): ExtraRun {
  return algorithm === 'heap' ? heapSort(input, t) : countingSort(input, t);
}

/** Random digits 0 to 9, repeatable by seed. */
export function makeExtraInput(size: number, seed: number): number[] {
  const random = seededRandom(seed);
  return Array.from({ length: size }, () => Math.floor(random() * (MAX_VALUE + 1)));
}

/** "5, 2, 9" into numbers; 6 to 12 whole numbers from 0 to 9, or null when it does not fit. */
export function parseExtraValues(text: string): number[] | null {
  const parts = text.split(/[\s,;]+/).filter((part) => part !== '');
  if (parts.length < MIN_ITEMS || parts.length > MAX_ITEMS) return null;
  const numbers = parts.map((part) => (/^\d$/.test(part) ? Number(part) : NaN));
  return numbers.some((value) => Number.isNaN(value)) ? null : numbers;
}
