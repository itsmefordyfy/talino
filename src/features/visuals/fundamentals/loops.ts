import { fundamentalsStrings } from './strings';

export type LoopKind = 'for' | 'while';
export type LoopInput = { kind: LoopKind; start: number; end: number; step: number };

/** The values `i` takes, Python's `range(start, end, step)` rule: the end is never included. */
export function loopValues({ start, end, step }: Pick<LoopInput, 'start' | 'end' | 'step'>): number[] {
  if (step === 0) return [];
  const values: number[] = [];
  for (let i = start; step > 0 ? i < end : i > end; i += step) values.push(i);
  return values;
}

/** How many times the body runs: the exact number of iterations. */
export const iterationCount = (input: Pick<LoopInput, 'start' | 'end' | 'step'>) => loopValues(input).length;

export type LoopStep = {
  /** The loop variable now, null before it exists. */
  i: number | null;
  /** The running sum the body builds (`total += i`). */
  total: number;
  /** Iterations of the body finished so far. */
  finished: number;
  /** The condition's answer at this step (while loops, and the for loop's "is there another value?"), null when none is being tested. */
  condition: boolean | null;
  /** 1-based source lines being run. */
  lines: readonly number[];
  caption: string;
};

export const conditionOf = ({ end, step }: Pick<LoopInput, 'end' | 'step'>) => (step > 0 ? `i < ${end}` : `i > ${end}`);

export function loopSource({ kind, start, end, step }: LoopInput): string[] {
  return kind === 'for' ? ['total = 0', `for i in range(${start}, ${end}, ${step}):`, '    total += i'] : ['total = 0', `i = ${start}`, `while ${conditionOf({ end, step })}:`, '    total += i', `    i += ${step}`];
}

/** Every state of the loop, from set-up to the final failed check. A step of 0 is refused (it would never move). */
export function buildLoopSteps(input: LoopInput, t = fundamentalsStrings.en.loops): LoopStep[] {
  const { kind, start, end, step } = input;
  if (step === 0) return [{ i: start, total: 0, finished: 0, condition: true, lines: [], caption: t.zeroStep }];
  const values = loopValues(input);
  const steps: LoopStep[] = [];
  let total = 0;
  steps.push({ i: null, total: 0, finished: 0, condition: null, lines: [1], caption: t.setTotal });
  if (kind === 'for') {
    values.forEach((value, index) => {
      steps.push({ i: value, total, finished: index, condition: null, lines: [2], caption: t.forNext(value, index + 1, values.length) });
      total += value;
      steps.push({ i: value, total, finished: index + 1, condition: null, lines: [3], caption: t.body(value, total) });
    });
    steps.push({ i: values.at(-1) ?? null, total, finished: values.length, condition: false, lines: [2], caption: values.length === 0 ? t.forEmpty(start, end, step) : t.forDone(values.length) });
    return steps;
  }
  const test = conditionOf(input);
  steps.push({ i: start, total, finished: 0, condition: null, lines: [2], caption: t.setI(start) });
  let i = start;
  let finished = 0;
  for (;;) {
    const ok = step > 0 ? i < end : i > end;
    steps.push({ i, total, finished, condition: ok, lines: [3], caption: ok ? t.whileTrue(test, i) : t.whileFalse(test, i, finished) });
    if (!ok) break;
    total += i;
    finished += 1;
    steps.push({ i, total, finished, condition: null, lines: [4], caption: t.body(i, total) });
    const before = i;
    i += step;
    steps.push({ i, total, finished, condition: null, lines: [5], caption: t.update(before, step, i) });
  }
  return steps;
}
