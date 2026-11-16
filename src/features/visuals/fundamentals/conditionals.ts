import { fundamentalsStrings } from './strings';

export type Comparison = '>=' | '<';
export type Branch = { threshold: number; comparison: Comparison; result: string };
export type ConditionalProgram = { id: 'grade' | 'ticket' | 'weather'; variable: string; min: number; max: number; start: number; samples: readonly number[]; branches: readonly Branch[]; otherwise: string; assigns: string };

/** Three small if / else-if / else programs, each a chain tried from the top. */
export const CONDITIONAL_PROGRAMS: readonly ConditionalProgram[] = [
  { id: 'grade', variable: 'score', assigns: 'grade', min: 0, max: 100, start: 82, samples: [95, 82, 64, 30], branches: [{ threshold: 90, comparison: '>=', result: '"A"' }, { threshold: 75, comparison: '>=', result: '"B"' }, { threshold: 60, comparison: '>=', result: '"C"' }], otherwise: '"F"' },
  { id: 'ticket', variable: 'age', assigns: 'price', min: 0, max: 100, start: 12, samples: [3, 12, 30, 70], branches: [{ threshold: 5, comparison: '<', result: '0' }, { threshold: 18, comparison: '<', result: '5' }, { threshold: 60, comparison: '<', result: '10' }], otherwise: '7' },
  { id: 'weather', variable: 'temp', assigns: 'feel', min: -10, max: 45, start: 24, samples: [35, 24, 12, 0], branches: [{ threshold: 30, comparison: '>=', result: '"hot"' }, { threshold: 20, comparison: '>=', result: '"warm"' }, { threshold: 10, comparison: '>=', result: '"cool"' }], otherwise: '"cold"' },
];

export const conditionText = (program: ConditionalProgram, branch: Branch) => `${program.variable} ${branch.comparison} ${branch.threshold}`;
export const passes = (branch: Branch, value: number) => (branch.comparison === '>=' ? value >= branch.threshold : value < branch.threshold);

/** The program as source lines (Python-style), so the learner can read what the flowchart means. */
export function conditionalSource(program: ConditionalProgram): string[] {
  const lines: string[] = [];
  program.branches.forEach((branch, index) => {
    lines.push(`${index === 0 ? 'if' : 'elif'} ${conditionText(program, branch)}:`, `    ${program.assigns} = ${branch.result}`);
  });
  lines.push('else:', `    ${program.assigns} = ${program.otherwise}`);
  return lines;
}

export type ConditionalStep = {
  /** How each branch looks now: not yet tried, tried and false, tried and true. */
  tried: readonly ('pending' | 'false' | 'true')[];
  /** The branch that ran (its index, or `branches.length` for else), once known. */
  taken: number | null;
  /** 1-based source lines being run. */
  lines: readonly number[];
  caption: string;
};

/** Every state of one run: read the value, try each condition from the top until one is true, run it, skip the rest. */
export function buildConditionalSteps(program: ConditionalProgram, value: number, t = fundamentalsStrings.en.conditionals): ConditionalStep[] {
  const count = program.branches.length;
  const pending = (): ('pending' | 'false' | 'true')[] => program.branches.map(() => 'pending');
  const steps: ConditionalStep[] = [{ tried: pending(), taken: null, lines: [], caption: t.start(program.variable, value) }];
  const tried = pending();
  for (let index = 0; index < count; index += 1) {
    const branch = program.branches[index];
    if (!branch) continue;
    const ok = passes(branch, value);
    tried[index] = ok ? 'true' : 'false';
    steps.push({ tried: [...tried], taken: null, lines: [index * 2 + 1], caption: t.check(conditionText(program, branch), value, ok) });
    if (ok) {
      steps.push({ tried: [...tried], taken: index, lines: [index * 2 + 2], caption: t.run(`${program.assigns} = ${branch.result}`, count - index - 1) });
      return steps;
    }
  }
  steps.push({ tried: [...tried], taken: count, lines: [count * 2 + 1, count * 2 + 2], caption: t.runElse(`${program.assigns} = ${program.otherwise}`) });
  return steps;
}

/** The branch that runs for a value, as an index (`branches.length` is else). */
export function takenBranch(program: ConditionalProgram, value: number): number {
  const index = program.branches.findIndex((branch) => passes(branch, value));
  return index === -1 ? program.branches.length : index;
}
