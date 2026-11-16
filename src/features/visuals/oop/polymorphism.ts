import { oopStrings } from './strings';

type Text = typeof oopStrings.en.polymorphism;

export type ParamSpec = { name: string; min: number; max: number; initial: number };
export type KindSpec = { id: string; params: readonly ParamSpec[]; run: (params: readonly number[]) => { formula: string; result: string; value: number | null } };
export type Family = { id: 'shapes' | 'animals'; base: string; method: string; kinds: readonly KindSpec[] };

const round = (value: number) => Number(value.toFixed(2));

export const FAMILIES: readonly Family[] = [
  {
    id: 'shapes',
    base: 'Shape',
    method: 'area()',
    kinds: [
      { id: 'Circle', params: [{ name: 'r', min: 1, max: 20, initial: 3 }], run: ([r = 0]) => ({ formula: `π × ${r}²`, result: String(round(Math.PI * r * r)), value: round(Math.PI * r * r) }) },
      { id: 'Rectangle', params: [{ name: 'w', min: 1, max: 20, initial: 4 }, { name: 'h', min: 1, max: 20, initial: 5 }], run: ([w = 0, h = 0]) => ({ formula: `${w} × ${h}`, result: String(w * h), value: w * h }) },
      { id: 'Triangle', params: [{ name: 'b', min: 1, max: 20, initial: 6 }, { name: 'h', min: 1, max: 20, initial: 4 }], run: ([b = 0, h = 0]) => ({ formula: `½ × ${b} × ${h}`, result: String(round((b * h) / 2)), value: round((b * h) / 2) }) },
    ],
  },
  {
    id: 'animals',
    base: 'Animal',
    method: 'speak()',
    kinds: [
      { id: 'Dog', params: [], run: () => ({ formula: 'return "Woof"', result: '"Woof"', value: null }) },
      { id: 'Cat', params: [], run: () => ({ formula: 'return "Meow"', result: '"Meow"', value: null }) },
      { id: 'Duck', params: [], run: () => ({ formula: 'return "Quack"', result: '"Quack"', value: null }) },
      { id: 'Cow', params: [], run: () => ({ formula: 'return "Moo"', result: '"Moo"', value: null }) },
    ],
  },
];

export const MAX_ITEMS = 6;
export type Item = { key: number; kind: string; params: number[] };

export const defaultItems = (family: Family): Item[] => family.kinds.slice(0, 3).map((kind, index) => ({ key: index + 1, kind: kind.id, params: kind.params.map((param) => param.initial) }));

export type PolymorphismStep = {
  /** The item whose method is being called now (an index into the list), null at the start and the end. */
  index: number | null;
  /** The results so far, one per item called. */
  results: { kind: string; result: string }[];
  /** Sum of the numeric results (areas), when the family has numbers. */
  total: number | null;
  caption: string;
};

/** One call, `item.method()`, made on each object in the list: each class answers in its own way. */
export function buildPolymorphismSteps(family: Family, items: readonly Item[], t: Text = oopStrings.en.polymorphism): PolymorphismStep[] {
  const steps: PolymorphismStep[] = [{ index: null, results: [], total: null, caption: items.length === 0 ? t.empty : t.start(family.method, items.length) }];
  if (items.length === 0) return steps;
  const results: { kind: string; result: string }[] = [];
  let total: number | null = family.kinds.some((kind) => kind.run(kind.params.map((param) => param.initial)).value !== null) ? 0 : null;
  items.forEach((item, index) => {
    const kind = family.kinds.find((candidate) => candidate.id === item.kind);
    if (!kind) return;
    const run = kind.run(item.params);
    results.push({ kind: kind.id, result: run.result });
    if (total !== null && run.value !== null) total = round(total + run.value);
    steps.push({ index, results: [...results], total, caption: t.call(index, kind.id, family.method, run.formula, run.result) });
  });
  const kinds = new Set(items.map((item) => item.kind));
  steps.push({ index: null, results: [...results], total, caption: t.done(family.method, items.length, kinds.size, total) });
  return steps;
}
