import { recursionStrings } from './recursion-stack-strings';

type Text = typeof recursionStrings.en;

export type RecursionFn = 'factorial' | 'fibonacci' | 'sum' | 'countdown';
export const RECURSION_FNS: readonly RecursionFn[] = ['factorial', 'fibonacci', 'sum', 'countdown'];

/** The inputs that keep a trace small enough to follow. */
export const INPUT_RANGE: Record<RecursionFn, { min: number; max: number; start: number }> = {
  factorial: { min: 1, max: 6, start: 4 },
  fibonacci: { min: 1, max: 6, start: 5 },
  sum: { min: 3, max: 5, start: 4 },
  countdown: { min: 1, max: 6, start: 3 },
};

const LIST_POOL = [4, 2, 7, 1, 5] as const;
/** The list the sum function works on: its first `length` values. */
export const listFor = (length: number): number[] => LIST_POOL.slice(0, Math.min(LIST_POOL.length, Math.max(0, length)));

export type RecursionSpec = { fn: RecursionFn; n: number; memo: boolean };

/** The function's source, one string per line (shown as code, so it is not translated). */
export function codeFor(fn: RecursionFn, memo: boolean): string[] {
  switch (fn) {
    case 'factorial':
      return ['function factorial(n) {', '  if (n <= 1) return 1;', '  return n * factorial(n - 1);', '}'];
    case 'fibonacci':
      return memo
        ? ['function fib(n, memo = {}) {', '  if (n < 2) return n;', '  if (memo[n] !== undefined) return memo[n];', '  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);', '  return memo[n];', '}']
        : ['function fib(n) {', '  if (n < 2) return n;', '  return fib(n - 1) + fib(n - 2);', '}'];
    case 'sum':
      return ['function sum(list) {', '  if (list.length === 0) return 0;', '  return list[0] + sum(list.slice(1));', '}'];
    case 'countdown':
      return ['function countdown(n) {', '  if (n === 0) { print("Liftoff!"); return; }', '  print(n);', '  countdown(n - 1);', '}'];
  }
}

export type Frame = {
  id: number;
  /** The call as written, e.g. `fib(3)`. */
  label: string;
  /** What it is waiting to add up, e.g. `3 × factorial(2)`; null before it calls anything. */
  wait: string | null;
  /** 1-based line of the code this frame is on. */
  line: number;
  /** True while the frame is handing back its value. */
  returning: boolean;
  /** The value being returned (null: returns nothing). */
  value: number | null;
  /** Answered straight from the memo. */
  hit: boolean;
};

export type RecursionStep = {
  /** Bottom of the stack first; the last frame is the call that is running. */
  stack: Frame[];
  /** Calls made so far. */
  calls: number;
  /** The most frames the stack has held so far. */
  deepest: number;
  /** 1-based line of the running call; null when no call is running. */
  line: number | null;
  /** What the function has printed so far (countdown). */
  output: string[];
  /** Fibonacci with memoization: the saved answers, in the order they were saved. */
  memo: [number, number][];
  /** The final answer, on the last step only. */
  result: string | null;
  done: boolean;
  caption: string;
};

const labelOf = (fn: RecursionFn, n: number) => (fn === 'factorial' ? `factorial(${n})` : fn === 'fibonacci' ? `fib(${n})` : fn === 'sum' ? `sum(${JSON.stringify(listFor(n)).replace(/,/g, ', ')})` : `countdown(${n})`);
const labelOfList = (values: readonly number[]) => `sum([${values.join(', ')}])`;

/** The value the function gives for this input (the last step's `result`, worked out directly). */
export function expectedResult(fn: RecursionFn, n: number): string {
  if (fn === 'factorial') return String(Array.from({ length: n }, (_, index) => index + 1).reduce((product, value) => product * value, 1));
  if (fn === 'fibonacci') {
    let a = 0;
    let b = 1;
    for (let index = 0; index < n; index += 1) [a, b] = [b, a + b];
    return String(a);
  }
  if (fn === 'sum') return String(listFor(n).reduce((total, value) => total + value, 0));
  return [...Array.from({ length: n }, (_, index) => String(n - index)), 'Liftoff!'].join(', ');
}

/** Every step of one run: each call and each return puts the stack in a new state. */
export function buildTrace(spec: RecursionSpec, t: Text = recursionStrings.en): RecursionStep[] {
  const range = INPUT_RANGE[spec.fn];
  const n = Math.min(range.max, Math.max(range.min, Math.floor(spec.n)));
  const memoOn = spec.fn === 'fibonacci' && spec.memo;
  const steps: RecursionStep[] = [];
  const stack: Frame[] = [];
  const memo = new Map<number, number>();
  const output: string[] = [];
  let calls = 0;
  let deepest = 0;

  const snap = (caption: string, extra: Partial<RecursionStep> = {}) =>
    steps.push({ stack: stack.map((frame) => ({ ...frame })), calls, deepest, line: stack.length > 0 ? stack[stack.length - 1]!.line : null, output: [...output], memo: [...memo.entries()], result: null, done: false, ...extra, caption });

  const enter = (label: string, line: number, caption: string, hit = false): Frame => {
    calls += 1;
    const frame: Frame = { id: calls, label, wait: null, line, returning: false, value: null, hit };
    stack.push(frame);
    deepest = Math.max(deepest, stack.length);
    snap(caption);
    return frame;
  };

  /** The top frame hands its value back (still drawn, marked returning) and is then removed. */
  const leave = (frame: Frame, value: number | null, line: number, caption: string) => {
    frame.returning = true;
    frame.value = value;
    frame.line = line;
    snap(caption);
    stack.pop();
  };

  const factorial = (k: number): number => {
    if (k <= 1) {
      const frame = enter(`factorial(${k})`, 2, t.factBase(k));
      leave(frame, 1, 2, t.returnLine(frame.label, 1));
      return 1;
    }
    const frame = enter(`factorial(${k})`, 2, t.factCall(k));
    frame.wait = `${k} × factorial(${k - 1})`;
    frame.line = 3;
    const child = factorial(k - 1);
    frame.wait = `${k} × ${child}`;
    const value = k * child;
    leave(frame, value, 3, t.factReturn(k, child, value));
    return value;
  };

  const fib = (k: number): number => {
    const label = `fib(${k})`;
    if (k < 2) {
      const frame = enter(label, 2, t.fibBase(k));
      leave(frame, k, 2, t.returnLine(label, k));
      return k;
    }
    const saved = memoOn ? memo.get(k) : undefined;
    if (saved !== undefined) {
      const frame = enter(label, 3, t.fibHit(k, saved), true);
      leave(frame, saved, 3, t.returnLine(label, saved));
      return saved;
    }
    const frame = enter(label, memoOn ? 3 : 2, memoOn ? t.fibCallMemo(k) : t.fibCall(k));
    frame.line = memoOn ? 4 : 3;
    frame.wait = `fib(${k - 1}) + fib(${k - 2})`;
    const a = fib(k - 1);
    frame.wait = `${a} + fib(${k - 2})`;
    const b = fib(k - 2);
    frame.wait = `${a} + ${b}`;
    const value = a + b;
    if (memoOn) memo.set(k, value);
    leave(frame, value, memoOn ? 5 : 3, memoOn ? t.fibReturnMemo(k, a, b, value) : t.fibReturn(k, a, b, value));
    return value;
  };

  const sum = (values: readonly number[]): number => {
    const label = labelOfList(values);
    if (values.length === 0) {
      const frame = enter(label, 2, t.sumBase(values));
      leave(frame, 0, 2, t.returnLine(label, 0));
      return 0;
    }
    const frame = enter(label, 2, t.sumCall(values));
    frame.line = 3;
    frame.wait = `${values[0]} + ${labelOfList(values.slice(1))}`;
    const child = sum(values.slice(1));
    frame.wait = `${values[0]} + ${child}`;
    const value = values[0]! + child;
    leave(frame, value, 3, t.sumReturn(values, child, value));
    return value;
  };

  const countdown = (k: number): void => {
    if (k === 0) {
      output.push('Liftoff!');
      const frame = enter('countdown(0)', 2, t.countBase);
      leave(frame, null, 2, t.countReturnBase);
      return;
    }
    output.push(String(k));
    const frame = enter(`countdown(${k})`, 3, t.countCall(k));
    frame.line = 4;
    frame.wait = `countdown(${k - 1})`;
    countdown(k - 1);
    leave(frame, null, 4, t.countReturn(k));
  };

  steps.push({ stack: [], calls: 0, deepest: 0, line: null, output: [], memo: [], result: null, done: false, caption: t.start(labelOf(spec.fn, n)) });
  if (spec.fn === 'factorial') {
    const value = factorial(n);
    snap(t.doneValue(labelOf('factorial', n), String(value), calls, deepest), { result: String(value), done: true });
  } else if (spec.fn === 'fibonacci') {
    const value = fib(n);
    snap(t.doneValue(labelOf('fibonacci', n), String(value), calls, deepest), { result: String(value), done: true });
  } else if (spec.fn === 'sum') {
    const value = sum(listFor(n));
    snap(t.doneValue(labelOf('sum', n), String(value), calls, deepest), { result: String(value), done: true });
  } else {
    countdown(n);
    snap(t.doneCountdown(output, calls, deepest), { result: output.join(', '), done: true });
  }
  return steps;
}

/** How many calls a run makes in all (what memoization saves is the difference between the two). */
export function callCount(spec: RecursionSpec): number {
  const steps = buildTrace(spec);
  return steps[steps.length - 1]!.calls;
}
