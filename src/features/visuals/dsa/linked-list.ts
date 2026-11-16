import { dsaStrings } from './strings';

type Text = typeof dsaStrings.en.linkedList;
export const MAX_NODES = 8;

export type ListStep = {
  /** The nodes reachable from head, in order. */
  values: number[];
  /** The node a traversal pointer (`current`) is on. */
  pointer: number | null;
  /** A node that exists but is not linked in yet, and the index of the node its `next` points to (null = null). */
  floating: { value: number; next: number | null } | null;
  /** Index of the node just linked in. */
  fresh: number | null;
  /** Index of a node about to be unlinked. */
  doomed: number | null;
  found: number | null;
  /** True when the operation was refused and nothing changed. */
  refused: boolean;
  caption: string;
};

const base = (values: readonly number[], extra: Partial<ListStep>, caption: string): ListStep => ({ values: [...values], pointer: null, floating: null, fresh: null, doomed: null, found: null, refused: false, ...extra, caption });
const refuse = (values: readonly number[], caption: string): ListStep[] => [base(values, { refused: true }, caption)];

/** The list as it is shown when nothing is happening. */
export const idleStep = (values: readonly number[], caption: string): ListStep => base(values, {}, caption);

/** Insert at the head: O(1), no walking. */
export function insertHeadSteps(values: readonly number[], value: number, t: Text = dsaStrings.en.linkedList): ListStep[] {
  if (values.length >= MAX_NODES) return refuse(values, t.full(MAX_NODES));
  return [
    base(values, {}, t.headStart(value)),
    base(values, { floating: { value, next: values.length > 0 ? 0 : null } }, t.headCreate(value, values.length > 0)),
    base([value, ...values], { fresh: 0 }, t.headLink(value)),
  ];
}

/** Insert at the tail: walk to the last node first (this list keeps no tail pointer), O(n). */
export function insertTailSteps(values: readonly number[], value: number, t: Text = dsaStrings.en.linkedList): ListStep[] {
  if (values.length >= MAX_NODES) return refuse(values, t.full(MAX_NODES));
  if (values.length === 0) return insertHeadSteps(values, value, t);
  const steps: ListStep[] = [base(values, { pointer: 0 }, t.tailStart(value))];
  for (let i = 1; i < values.length; i += 1) steps.push(base(values, { pointer: i }, t.walk(i, values[i] ?? 0, true)));
  steps.push(base(values, { pointer: values.length - 1, floating: { value, next: null } }, t.tailCreate(value)));
  steps.push(base([...values, value], { pointer: values.length - 1, fresh: values.length }, t.tailLink(value)));
  return steps;
}

/** Insert so the new node ends up at `index`: walk to the node before it, then relink two pointers. */
export function insertAtSteps(values: readonly number[], index: number, value: number, t: Text = dsaStrings.en.linkedList): ListStep[] {
  if (index < 0 || index > values.length) return refuse(values, t.badIndex(index, values.length));
  if (values.length >= MAX_NODES) return refuse(values, t.full(MAX_NODES));
  if (index === 0) return insertHeadSteps(values, value, t);
  const steps: ListStep[] = [base(values, { pointer: 0 }, t.atStart(value, index))];
  for (let i = 1; i < index; i += 1) steps.push(base(values, { pointer: i }, t.walk(i, values[i] ?? 0, true)));
  steps.push(base(values, { pointer: index - 1, floating: { value, next: index < values.length ? index : null } }, t.atCreate(value, index - 1, index < values.length)));
  steps.push(base([...values.slice(0, index), value, ...values.slice(index)], { pointer: index - 1, fresh: index }, t.atLink(value, index - 1)));
  return steps;
}

/** Delete the node at `index`: walk to the node before it and make its `next` skip the doomed node. */
export function deleteAtSteps(values: readonly number[], index: number, t: Text = dsaStrings.en.linkedList): ListStep[] {
  if (values.length === 0) return refuse(values, t.emptyList);
  if (index < 0 || index >= values.length) return refuse(values, t.badIndex(index, values.length));
  const doomedValue = values[index] ?? 0;
  const after = values.filter((_, position) => position !== index);
  if (index === 0) return [base(values, { doomed: 0 }, t.deleteHeadStart(doomedValue)), base(after, {}, t.deleteHeadDone(doomedValue))];
  const steps: ListStep[] = [base(values, { pointer: 0 }, t.deleteStart(doomedValue, index))];
  for (let i = 1; i < index; i += 1) steps.push(base(values, { pointer: i }, t.walk(i, values[i] ?? 0, true)));
  steps.push(base(values, { pointer: index - 1, doomed: index }, t.deleteFound(index - 1, doomedValue)));
  steps.push(base(after, { pointer: index - 1 }, t.deleteDone(doomedValue, index - 1)));
  return steps;
}

/** Search for a value from the head, one node at a time. */
export function searchSteps(values: readonly number[], value: number, t: Text = dsaStrings.en.linkedList): ListStep[] {
  if (values.length === 0) return refuse(values, t.emptyList);
  const steps: ListStep[] = [base(values, {}, t.searchStart(value))];
  for (let i = 0; i < values.length; i += 1) {
    if (values[i] === value) {
      steps.push(base(values, { pointer: i, found: i }, t.searchFound(value, i, i + 1)));
      return steps;
    }
    steps.push(base(values, { pointer: i }, t.searchMiss(values[i] ?? 0, i, value)));
  }
  steps.push(base(values, {}, t.searchNone(value, values.length)));
  return steps;
}

/** Delete the first node holding a value (a search, then the same unlinking). */
export function deleteValueSteps(values: readonly number[], value: number, t: Text = dsaStrings.en.linkedList): ListStep[] {
  const index = values.indexOf(value);
  if (index === -1) return values.length === 0 ? refuse(values, t.emptyList) : [...searchSteps(values, value, t).slice(0, -1), base(values, { refused: true }, t.searchNone(value, values.length))];
  return deleteAtSteps(values, index, t);
}
