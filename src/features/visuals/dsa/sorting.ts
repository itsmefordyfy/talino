import { dsaStrings } from './strings';

export type SortAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';
export const SORT_ALGORITHMS: readonly SortAlgorithm[] = ['bubble', 'selection', 'insertion', 'merge', 'quick'];

export type SortStep = {
  values: number[];
  /** Indexes being compared now. */
  compare: number[];
  /** Indexes just swapped, or just written (merge sort). */
  moved: number[];
  /** Indexes whose part of the array is in order (final positions, or a sorted run for insertion and merge sort). */
  sorted: number[];
  pivot: number | null;
  /** The part of the array being worked on (a merge, a quick sort partition); null when the whole array. */
  range: [number, number] | null;
  comparisons: number;
  /** Swaps (bubble, selection, insertion, quick) or writes of an element into place (merge). */
  moves: number;
  caption: string;
};

export type SortRun = { steps: SortStep[]; comparisons: number; moves: number; moveKind: 'swaps' | 'writes' };

type Text = typeof dsaStrings.en.sorting;

function recorder(initial: readonly number[]) {
  const a = [...initial];
  let comparisons = 0;
  let moves = 0;
  const sorted = new Set<number>();
  const steps: SortStep[] = [];
  const snap = (caption: string, extra: Partial<Pick<SortStep, 'compare' | 'moved' | 'pivot' | 'range'>> = {}) =>
    steps.push({ values: [...a], compare: extra.compare ?? [], moved: extra.moved ?? [], sorted: [...sorted].sort((x, y) => x - y), pivot: extra.pivot ?? null, range: extra.range ?? null, comparisons, moves, caption });
  return {
    a,
    sorted,
    steps,
    snap,
    compare: (i: number, j: number) => {
      comparisons += 1;
      return (a[i] ?? 0) - (a[j] ?? 0);
    },
    swap: (i: number, j: number) => {
      const x = a[i] ?? 0;
      a[i] = a[j] ?? 0;
      a[j] = x;
      moves += 1;
    },
    write: () => {
      moves += 1;
    },
    counts: () => ({ comparisons, moves }),
  };
}

function bubble(input: readonly number[], t: Text): SortRun {
  const r = recorder(input);
  const n = r.a.length;
  r.snap(t.start('bubble'));
  for (let pass = 0; pass < n - 1; pass += 1) {
    let swapped = false;
    for (let j = 0; j < n - 1 - pass; j += 1) {
      const bigger = r.compare(j, j + 1) > 0;
      r.snap(t.compare(r.a[j] ?? 0, r.a[j + 1] ?? 0, bigger), { compare: [j, j + 1] });
      if (bigger) {
        r.swap(j, j + 1);
        swapped = true;
        r.snap(t.swap(r.a[j] ?? 0, r.a[j + 1] ?? 0), { moved: [j, j + 1] });
      }
    }
    r.sorted.add(n - 1 - pass);
    if (!swapped) {
      for (let k = 0; k < n; k += 1) r.sorted.add(k);
      r.snap(t.bubbleEarly(pass + 1));
      break;
    }
    r.snap(t.bubblePass(pass + 1, r.a[n - 1 - pass] ?? 0));
  }
  return finish(r, 'swaps', t);
}

function selection(input: readonly number[], t: Text): SortRun {
  const r = recorder(input);
  const n = r.a.length;
  r.snap(t.start('selection'));
  for (let i = 0; i < n - 1; i += 1) {
    let min = i;
    for (let j = i + 1; j < n; j += 1) {
      const smaller = r.compare(j, min) < 0;
      r.snap(t.selectCompare(r.a[j] ?? 0, r.a[min] ?? 0, smaller), { compare: [j, min], pivot: min });
      if (smaller) min = j;
    }
    if (min !== i) {
      r.swap(i, min);
      r.sorted.add(i);
      r.snap(t.selectSwap(r.a[i] ?? 0, i), { moved: [i, min] });
    } else {
      r.sorted.add(i);
      r.snap(t.selectInPlace(r.a[i] ?? 0, i));
    }
  }
  return finish(r, 'swaps', t);
}

function insertion(input: readonly number[], t: Text): SortRun {
  const r = recorder(input);
  const n = r.a.length;
  r.sorted.add(0);
  r.snap(t.start('insertion'));
  for (let i = 1; i < n; i += 1) {
    let j = i;
    const key = r.a[i] ?? 0;
    while (j > 0) {
      const bigger = r.compare(j - 1, j) > 0;
      r.snap(t.insertCompare(r.a[j - 1] ?? 0, r.a[j] ?? 0, bigger), { compare: [j - 1, j] });
      if (!bigger) break;
      r.swap(j - 1, j);
      r.snap(t.swap(r.a[j - 1] ?? 0, r.a[j] ?? 0), { moved: [j - 1, j] });
      j -= 1;
    }
    for (let k = 0; k <= i; k += 1) r.sorted.add(k);
    r.snap(t.insertPlaced(key, j, i + 1));
  }
  return finish(r, 'swaps', t);
}

function merge(input: readonly number[], t: Text): SortRun {
  const r = recorder(input);
  const n = r.a.length;
  r.snap(t.start('merge'));
  const mergeRange = (lo: number, mid: number, hi: number) => {
    const left = r.a.slice(lo, mid + 1);
    const right = r.a.slice(mid + 1, hi + 1);
    const out: number[] = [];
    let li = 0;
    let ri = 0;
    const arrange = () => {
      const view = [...out, ...left.slice(li), ...right.slice(ri)];
      view.forEach((value, index) => {
        r.a[lo + index] = value;
      });
    };
    r.snap(t.mergeStart(lo, mid, hi), { range: [lo, hi] });
    const place = (value: number, from: 'left' | 'right', compared: boolean) => {
      out.push(value);
      if (from === 'left') li += 1;
      else ri += 1;
      arrange();
      r.write();
      r.snap(t.mergePlace(value, from, compared), { moved: [lo + out.length - 1], range: [lo, hi] });
    };
    while (li < left.length && ri < right.length) {
      const l = left[li] ?? 0;
      const rr = right[ri] ?? 0;
      r.compare(lo + out.length, lo + out.length + (left.length - li)); // counts one comparison of the two run heads
      r.snap(t.mergeCompare(l, rr), { compare: [lo + out.length, lo + out.length + (left.length - li)], range: [lo, hi] });
      if (l <= rr) place(l, 'left', true);
      else place(rr, 'right', true);
    }
    while (li < left.length) place(left[li] ?? 0, 'left', false);
    while (ri < right.length) place(right[ri] ?? 0, 'right', false);
    for (let k = lo; k <= hi; k += 1) r.sorted.add(k);
    r.snap(t.mergeDone(lo, hi), { range: [lo, hi] });
  };
  const sort = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    mergeRange(lo, mid, hi);
  };
  sort(0, n - 1);
  return finish(r, 'writes', t);
}

function quick(input: readonly number[], t: Text): SortRun {
  const r = recorder(input);
  const n = r.a.length;
  r.snap(t.start('quick'));
  const sort = (lo: number, hi: number) => {
    if (lo > hi) return;
    if (lo === hi) {
      r.sorted.add(lo);
      r.snap(t.quickSingle(r.a[lo] ?? 0), { range: [lo, hi] });
      return;
    }
    const pivotValue = r.a[hi] ?? 0;
    r.snap(t.quickPivot(pivotValue, lo, hi), { pivot: hi, range: [lo, hi] });
    let i = lo;
    for (let j = lo; j < hi; j += 1) {
      const smaller = r.compare(j, hi) < 0;
      r.snap(t.quickCompare(r.a[j] ?? 0, pivotValue, smaller), { compare: [j, hi], pivot: hi, range: [lo, hi] });
      if (smaller) {
        if (i !== j) {
          r.swap(i, j);
          r.snap(t.swap(r.a[i] ?? 0, r.a[j] ?? 0), { moved: [i, j], pivot: hi, range: [lo, hi] });
        }
        i += 1;
      }
    }
    if (i !== hi) r.swap(i, hi);
    r.sorted.add(i);
    r.snap(t.quickPlaced(pivotValue, i), { moved: i === hi ? [] : [i, hi], pivot: i, range: [lo, hi] });
    sort(lo, i - 1);
    sort(i + 1, hi);
  };
  sort(0, n - 1);
  return finish(r, 'swaps', t);
}

function finish(r: ReturnType<typeof recorder>, moveKind: SortRun['moveKind'], t: Text): SortRun {
  const { comparisons, moves } = r.counts();
  for (let k = 0; k < r.a.length; k += 1) r.sorted.add(k);
  r.snap(t.done(comparisons, moves, moveKind));
  return { steps: r.steps, comparisons, moves, moveKind };
}

/** Every state of the chosen algorithm on a copy of the input, with running comparison and swap (or write) counts. */
export function buildSortSteps(algorithm: SortAlgorithm, input: readonly number[], t: Text = dsaStrings.en.sorting): SortRun {
  switch (algorithm) {
    case 'bubble':
      return bubble(input, t);
    case 'selection':
      return selection(input, t);
    case 'insertion':
      return insertion(input, t);
    case 'merge':
      return merge(input, t);
    case 'quick':
      return quick(input, t);
  }
}

export type InputPattern = 'random' | 'nearly' | 'sorted' | 'reversed' | 'custom';

/** A small seeded random generator (mulberry32), so "Shuffle again" is repeatable and testable. */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let x = Math.imul(state ^ (state >>> 15), 1 | state);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** The values 1..size arranged in a pattern. */
export function makeInput(pattern: Exclude<InputPattern, 'custom'>, size: number, seed: number): number[] {
  const sortedValues = Array.from({ length: size }, (_, index) => index + 1);
  if (pattern === 'sorted') return sortedValues;
  if (pattern === 'reversed') return [...sortedValues].reverse();
  const random = seededRandom(seed);
  if (pattern === 'nearly') {
    const out = [...sortedValues];
    for (let k = 0; k < Math.max(1, Math.floor(size / 5)); k += 1) {
      const i = Math.floor(random() * (size - 1));
      [out[i], out[i + 1]] = [out[i + 1] ?? 0, out[i] ?? 0];
    }
    return out;
  }
  const out = [...sortedValues];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j] ?? 0, out[i] ?? 0];
  }
  return out;
}

/** "5, 2, 9" into numbers; 2 to 16 whole numbers from 1 to 99, or null when it does not fit. */
export function parseCustom(text: string): number[] | null {
  const parts = text.split(/[\s,;]+/).filter((part) => part !== '');
  if (parts.length < 2 || parts.length > 16) return null;
  const numbers = parts.map((part) => (/^\d{1,2}$/.test(part) ? Number(part) : NaN));
  return numbers.some((value) => Number.isNaN(value) || value < 1) ? null : numbers;
}
