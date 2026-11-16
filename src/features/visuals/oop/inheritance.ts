import { oopStrings } from './strings';

type Text = typeof oopStrings.en.inheritance;

export type ClassId = 'Animal' | 'Dog' | 'Cat' | 'Puppy';
export type MethodName = 'eat' | 'sleep' | 'speak' | 'fetch' | 'climb' | 'play';
export const CLASS_IDS: readonly ClassId[] = ['Animal', 'Dog', 'Cat', 'Puppy'];
export const METHOD_NAMES: readonly MethodName[] = ['eat', 'sleep', 'speak', 'fetch', 'climb', 'play'];

/** A method: what it gives back, and whether it first calls the parent's version (`super.method()`) and adds to its result. */
export type MethodDef = { out: string; callsSuper?: boolean };
export type ClassDef = { id: ClassId; parent: ClassId | null; methods: Partial<Record<MethodName, MethodDef>> };

export const CLASSES: readonly ClassDef[] = [
  { id: 'Animal', parent: null, methods: { eat: { out: 'eats' }, sleep: { out: 'sleeps' }, speak: { out: '...' } } },
  { id: 'Dog', parent: 'Animal', methods: { speak: { out: 'Woof' }, fetch: { out: 'fetches the ball' } } },
  { id: 'Cat', parent: 'Animal', methods: { speak: { out: 'Meow' }, climb: { out: 'climbs a tree' } } },
  { id: 'Puppy', parent: 'Dog', methods: { speak: { out: ' (squeaky)', callsSuper: true }, play: { out: 'plays with a toy' } } },
];

const byId = (id: ClassId) => CLASSES.find((entry) => entry.id === id)!;

/** The class and its ancestors, nearest first: the order in which a method is looked up. */
export function lookupChain(start: ClassId): ClassId[] {
  const chain: ClassId[] = [];
  let current: ClassId | null = start;
  while (current) {
    chain.push(current);
    current = byId(current).parent;
  }
  return chain;
}

/** Method resolution: the first class on the chain that defines the method provides it. Null when no class does. */
export function resolveMethod(start: ClassId, method: MethodName): { checked: { cls: ClassId; defines: boolean }[]; provider: ClassId | null } {
  const checked: { cls: ClassId; defines: boolean }[] = [];
  for (const cls of lookupChain(start)) {
    const defines = byId(cls).methods[method] !== undefined;
    checked.push({ cls, defines });
    if (defines) return { checked, provider: cls };
  }
  return { checked, provider: null };
}

/** What calling the method on an object of this class returns, following `super` calls up the chain. */
export function execute(start: ClassId, method: MethodName): { output: string; ran: ClassId[] } | null {
  const { provider } = resolveMethod(start, method);
  if (!provider) return null;
  const def = byId(provider).methods[method]!;
  if (!def.callsSuper) return { output: def.out, ran: [provider] };
  const parent = byId(provider).parent;
  const inherited = parent ? execute(parent, method) : null;
  return { output: `${inherited?.output ?? ''}${def.out}`, ran: [provider, ...(inherited?.ran ?? [])] };
}

export type InheritanceStep = {
  /** The class being asked "do you define this?" now. */
  checking: ClassId | null;
  /** The classes whose code is running (set once found). */
  running: ClassId[];
  output: string | null;
  failed: boolean;
  caption: string;
};

/** The call, the search up the class chain, then the run (including any super call). */
export function buildInheritanceSteps(start: ClassId, method: MethodName, t: Text = oopStrings.en.inheritance): InheritanceStep[] {
  const steps: InheritanceStep[] = [{ checking: null, running: [], output: null, failed: false, caption: t.call(start, method) }];
  const { checked, provider } = resolveMethod(start, method);
  checked.forEach(({ cls, defines }, index) => {
    steps.push({ checking: cls, running: defines ? [cls] : [], output: null, failed: false, caption: defines ? (index === 0 ? t.ownMethod(cls, method) : t.found(cls, method, start)) : t.notHere(cls, method, byId(cls).parent) });
  });
  if (!provider) {
    steps.push({ checking: null, running: [], output: null, failed: true, caption: t.missing(start, method) });
    return steps;
  }
  const result = execute(start, method)!;
  const def = byId(provider).methods[method]!;
  if (def.callsSuper) {
    const parent = byId(provider).parent!;
    const superResult = execute(parent, method)!;
    steps.push({ checking: null, running: [provider], output: null, failed: false, caption: t.callsSuper(provider, method, parent) });
    steps.push({ checking: null, running: superResult.ran, output: null, failed: false, caption: t.superRuns(superResult.ran[0] ?? parent, method, superResult.output) });
    steps.push({ checking: null, running: result.ran, output: result.output, failed: false, caption: t.addsToSuper(provider, superResult.output, def.out, result.output) });
  } else {
    steps.push({ checking: null, running: [provider], output: result.output, failed: false, caption: t.runs(provider, method, result.output, provider !== start) });
  }
  return steps;
}
