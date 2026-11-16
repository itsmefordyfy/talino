export type Complexity = 'constant' | 'logarithmic' | 'linear' | 'linearithmic' | 'quadratic';
export const COMPLEXITIES: readonly Complexity[] = ['constant', 'logarithmic', 'linear', 'linearithmic', 'quadratic'];
export const NOTATION: Record<Complexity, string> = { constant: 'O(1)', logarithmic: 'O(log n)', linear: 'O(n)', linearithmic: 'O(n log n)', quadratic: 'O(n²)' };

/** How many basic operations each growth rate stands for at input size n (log base 2; constants are ignored, as Big O does). */
export function operations(complexity: Complexity, n: number): number {
  switch (complexity) {
    case 'constant':
      return 1;
    case 'logarithmic':
      return Math.log2(Math.max(n, 1));
    case 'linear':
      return n;
    case 'linearithmic':
      return n * Math.log2(Math.max(n, 1));
    case 'quadratic':
      return n * n;
  }
}

export type YScale = 'linear' | 'log';

/** The height of a curve at n as a share (0 to 1) of `yMax`, on a plain or a log10 axis (where 1 operation sits on the bottom line). */
export function heightShare(complexity: Complexity, n: number, yMax: number, scale: YScale): number {
  const ops = operations(complexity, n);
  if (scale === 'log') return yMax <= 1 ? 0 : Math.min(1, Math.log10(Math.max(ops, 1)) / Math.log10(yMax));
  return yMax <= 0 ? 0 : Math.min(1, ops / yMax);
}

/** The largest value any of the shown curves reaches at `maxN`, so the chart fits them all. */
export const chartMax = (shown: readonly Complexity[], maxN: number) => Math.max(1, ...shown.map((complexity) => operations(complexity, maxN)));

/** The points of one curve for n = 1..maxN, as shares of the chart's width and height. */
export function curvePoints(complexity: Complexity, maxN: number, yMax: number, scale: YScale): { x: number; y: number }[] {
  return Array.from({ length: maxN }, (_, index) => ({ x: maxN === 1 ? 0 : index / (maxN - 1), y: heightShare(complexity, index + 1, yMax, scale) }));
}

/** A count for display: whole numbers as they are, others to one decimal. */
export const formatOps = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(1));
