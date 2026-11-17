import { hashTableStrings } from './hash-table-strings';

type Text = typeof hashTableStrings.en;

/** Buckets in the table (also the slots of open addressing). */
export const TABLE_SIZE = 7;
/** Chaining can hold more keys than buckets; this keeps the picture readable. */
export const MAX_CHAIN_KEYS = 12;
export const MAX_KEY_LENGTH = 8;

export type HashMode = 'chaining' | 'probing';
export type HashOperation = 'insert' | 'lookup' | 'delete';
export type Slot = { kind: 'empty' } | { kind: 'full'; key: string } | { kind: 'deleted' };

export type Table = {
  mode: HashMode;
  /** Separate chaining: the keys in each bucket, oldest first. */
  chains: string[][];
  /** Open addressing: what each slot holds. A deleted slot keeps a marker (tombstone) so probing can pass it. */
  slots: Slot[];
  /** Keys in the order they were inserted (used to rebuild the table in the other mode). */
  keys: string[];
};

export const maxKeys = (mode: HashMode): number => (mode === 'chaining' ? MAX_CHAIN_KEYS : TABLE_SIZE);

export const emptyTable = (mode: HashMode): Table => ({
  mode,
  chains: Array.from({ length: TABLE_SIZE }, () => []),
  slots: Array.from({ length: TABLE_SIZE }, () => ({ kind: 'empty' as const })),
  keys: [],
});

/** A key as the table accepts it: lowercase letters and digits, at most 8. */
export const cleanKey = (text: string): string => text.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, MAX_KEY_LENGTH);

export type HashResult = { key: string; codes: number[]; sum: number; index: number };

/** The hash: the sum of the characters' codes, mod the table size. */
export function hashKey(key: string): HashResult {
  const codes = [...key].map((char) => char.charCodeAt(0));
  const sum = codes.reduce((total, code) => total + code, 0);
  return { key, codes, sum, index: sum % TABLE_SIZE };
}

export type HashStep = {
  table: Table;
  /** The key being hashed and how its bucket was worked out (null before the hash step). */
  hash: HashResult | null;
  /** The bucket or slot being looked at. */
  focus: number | null;
  /** Chaining: the position in that bucket's chain being compared. */
  chainPos: number | null;
  /** A bucket or slot where a collision just happened. */
  collision: number | null;
  placed: { index: number; pos: number } | null;
  found: { index: number; pos: number } | null;
  removed: { index: number; pos: number } | null;
  /** Buckets or slots looked at so far in this operation. */
  probes: number;
  /** Keys compared with the target so far. */
  compares: number;
  /** Collisions met so far. */
  collisions: number;
  operation: HashOperation | null;
  refused: boolean;
  caption: string;
};

export const countOf = (table: Table): number => table.keys.length;

const copyTable = (table: Table): Table => ({ mode: table.mode, chains: table.chains.map((chain) => [...chain]), slots: table.slots.map((slot) => ({ ...slot })), keys: [...table.keys] });

type Progress = Pick<HashStep, 'probes' | 'compares' | 'collisions'>;

const mk = (table: Table, op: HashOperation | null, progress: Progress, extra: Partial<HashStep>, caption: string): HashStep => ({
  table: copyTable(table),
  hash: null,
  focus: null,
  chainPos: null,
  collision: null,
  placed: null,
  found: null,
  removed: null,
  ...progress,
  operation: op,
  refused: false,
  ...extra,
  caption,
});

/** The table as it is shown when nothing is happening. */
export const idleStep = (table: Table, caption: string): HashStep => mk(table, null, { probes: 0, compares: 0, collisions: 0 }, {}, caption);

const refuse = (table: Table, op: HashOperation, caption: string): HashStep[] => [mk(table, op, { probes: 0, compares: 0, collisions: 0 }, { refused: true }, caption)];

const hashCaption = (h: HashResult, t: Text) => t.hashed(h.key, [...h.key].map((char, position) => `${char}=${h.codes[position]}`), h.sum, TABLE_SIZE, h.index);

/** Insert a key: hash it, look in its bucket or slot, handle any collision, then store it (a key already stored is left alone). */
export function insertSteps(table: Table, rawKey: string, t: Text = hashTableStrings.en): HashStep[] {
  const key = cleanKey(rawKey);
  if (key === '') return refuse(table, 'insert', t.badKey);
  const present = table.keys.includes(key);
  if (!present && table.keys.length >= maxKeys(table.mode)) return refuse(table, 'insert', table.mode === 'chaining' ? t.tableFullChaining(key, MAX_CHAIN_KEYS) : t.tableFullProbing(key, TABLE_SIZE));
  const h = hashKey(key);
  return table.mode === 'chaining' ? insertChaining(table, key, h, t) : insertProbing(table, key, h, t);
}

function insertChaining(table: Table, key: string, h: HashResult, t: Text): HashStep[] {
  const work = copyTable(table);
  const chain = work.chains[h.index]!;
  const progress: Progress = { probes: 0, compares: 0, collisions: 0 };
  const steps: HashStep[] = [mk(work, 'insert', progress, { hash: h }, hashCaption(h, t))];
  progress.probes = 1;
  if (chain.length === 0) {
    steps.push(mk(work, 'insert', progress, { hash: h, focus: h.index }, t.chainVisit(h.index, chain)));
    chain.push(key);
    work.keys.push(key);
    steps.push(mk(work, 'insert', progress, { hash: h, focus: h.index, placed: { index: h.index, pos: 0 } }, t.chainPlaceEmpty(key, h.index)));
    return steps;
  }
  progress.collisions = 1;
  steps.push(mk(work, 'insert', progress, { hash: h, focus: h.index, collision: h.index }, t.chainCollision(h.index, key, chain)));
  for (let pos = 0; pos < chain.length; pos += 1) {
    progress.compares += 1;
    const equal = chain[pos] === key;
    steps.push(mk(work, 'insert', progress, { hash: h, focus: h.index, collision: h.index, chainPos: pos, ...(equal ? { found: { index: h.index, pos } } : {}) }, t.compare(chain[pos]!, key, equal)));
    if (equal) {
      steps.push(mk(work, 'insert', progress, { hash: h, focus: h.index, found: { index: h.index, pos } }, t.duplicate(key)));
      return steps;
    }
  }
  chain.push(key);
  work.keys.push(key);
  steps.push(mk(work, 'insert', progress, { hash: h, focus: h.index, collision: h.index, placed: { index: h.index, pos: chain.length - 1 } }, t.chainPlaceEnd(key, h.index, chain.length)));
  return steps;
}

function insertProbing(table: Table, key: string, h: HashResult, t: Text): HashStep[] {
  const work = copyTable(table);
  const progress: Progress = { probes: 0, compares: 0, collisions: 0 };
  const steps: HashStep[] = [mk(work, 'insert', progress, { hash: h }, hashCaption(h, t))];
  let firstDeleted: number | null = null;
  let emptyAt: number | null = null;
  for (let attempt = 0; attempt < TABLE_SIZE; attempt += 1) {
    const index = (h.index + attempt) % TABLE_SIZE;
    const slot = work.slots[index]!;
    progress.probes = attempt + 1;
    if (slot.kind === 'empty') {
      emptyAt = index;
      steps.push(mk(work, 'insert', progress, { hash: h, focus: index }, t.probeEmptyInsert(index, key, attempt === 0)));
      break;
    }
    if (slot.kind === 'deleted') {
      if (firstDeleted === null) firstDeleted = index;
      steps.push(mk(work, 'insert', progress, { hash: h, focus: index }, t.probeTomb(index)));
      continue;
    }
    progress.compares += 1;
    if (slot.key === key) {
      steps.push(mk(work, 'insert', progress, { hash: h, focus: index, found: { index, pos: 0 } }, t.duplicate(key)));
      return steps;
    }
    progress.collisions += 1;
    steps.push(mk(work, 'insert', progress, { hash: h, focus: index, collision: index }, t.probeFull(index, slot.key, hashKey(slot.key).index, (index + 1) % TABLE_SIZE)));
  }
  const target = firstDeleted ?? emptyAt;
  if (target === null) return [...steps, mk(work, 'insert', progress, { hash: h, refused: true }, t.tableFullProbing(key, TABLE_SIZE))];
  work.slots[target] = { kind: 'full', key };
  work.keys.push(key);
  steps.push(mk(work, 'insert', progress, { hash: h, focus: target, placed: { index: target, pos: 0 } }, firstDeleted !== null ? t.probePlaceTomb(key, target) : t.probePlace(key, target, progress.collisions)));
  return steps;
}

type Walk = { steps: HashStep[]; found: { index: number; pos: number } | null; progress: Progress };

/** The shared search for lookup and delete: hash, then follow the chain or the probe run until the key or a dead end. */
function walk(table: Table, key: string, op: 'lookup' | 'delete', h: HashResult, t: Text): Walk {
  const progress: Progress = { probes: 0, compares: 0, collisions: 0 };
  const steps: HashStep[] = [mk(table, op, progress, { hash: h }, hashCaption(h, t))];
  if (table.mode === 'chaining') {
    const chain = table.chains[h.index]!;
    progress.probes = 1;
    steps.push(mk(table, op, progress, { hash: h, focus: h.index }, t.chainVisit(h.index, chain)));
    for (let pos = 0; pos < chain.length; pos += 1) {
      progress.compares += 1;
      const equal = chain[pos] === key;
      steps.push(mk(table, op, progress, { hash: h, focus: h.index, chainPos: pos, ...(equal ? { found: { index: h.index, pos } } : {}) }, t.compare(chain[pos]!, key, equal)));
      if (equal) {
        steps.push(mk(table, op, progress, { hash: h, focus: h.index, found: { index: h.index, pos } }, t.chainFound(key, h.index, progress.compares)));
        return { steps, found: { index: h.index, pos }, progress };
      }
    }
    steps.push(mk(table, op, progress, { hash: h, focus: h.index }, chain.length === 0 ? t.chainMissEmpty(key, h.index) : t.chainMissEnd(key, h.index, chain.length)));
    return { steps, found: null, progress };
  }
  for (let attempt = 0; attempt < TABLE_SIZE; attempt += 1) {
    const index = (h.index + attempt) % TABLE_SIZE;
    const slot = table.slots[index]!;
    progress.probes = attempt + 1;
    if (slot.kind === 'empty') {
      steps.push(mk(table, op, progress, { hash: h, focus: index }, t.probeMissEmpty(index, key)));
      return { steps, found: null, progress };
    }
    if (slot.kind === 'deleted') {
      steps.push(mk(table, op, progress, { hash: h, focus: index }, t.probeTomb(index)));
      continue;
    }
    progress.compares += 1;
    if (slot.key === key) {
      steps.push(mk(table, op, progress, { hash: h, focus: index, found: { index, pos: 0 } }, t.probeFound(key, index, progress.compares)));
      return { steps, found: { index, pos: 0 }, progress };
    }
    progress.collisions += 1;
    steps.push(mk(table, op, progress, { hash: h, focus: index, collision: index }, t.probeFull(index, slot.key, hashKey(slot.key).index, (index + 1) % TABLE_SIZE)));
  }
  steps.push(mk(table, op, progress, { hash: h }, t.probeMissAll(key, progress.probes)));
  return { steps, found: null, progress };
}

/** Look a key up: the same hash and the same walk an insert would take. */
export function lookupSteps(table: Table, rawKey: string, t: Text = hashTableStrings.en): HashStep[] {
  const key = cleanKey(rawKey);
  if (key === '') return refuse(table, 'lookup', t.badKey);
  return walk(table, key, 'lookup', hashKey(key), t).steps;
}

/** Delete a key: find it, then remove it (open addressing leaves a tombstone so later probes still pass this slot). */
export function deleteSteps(table: Table, rawKey: string, t: Text = hashTableStrings.en): HashStep[] {
  const key = cleanKey(rawKey);
  if (key === '') return refuse(table, 'delete', t.badKey);
  const h = hashKey(key);
  const { steps, found, progress } = walk(table, key, 'delete', h, t);
  if (!found) {
    const missing = steps[steps.length - 1]!;
    return [...steps, { ...missing, caption: t.deleteMissing(key) }];
  }
  const work = copyTable(table);
  work.keys = work.keys.filter((existing) => existing !== key);
  if (table.mode === 'chaining') work.chains[found.index] = work.chains[found.index]!.filter((existing) => existing !== key);
  else work.slots[found.index] = { kind: 'deleted' };
  steps.push(mk(work, 'delete', progress, { hash: h, focus: found.index, removed: found }, table.mode === 'chaining' ? t.chainRemoved(key, found.index) : t.probeRemoved(key, found.index)));
  return steps;
}

/** Build a table by inserting `keys` in order (keys that do not fit are left out). */
export function tableFromKeys(mode: HashMode, keys: readonly string[]): Table {
  let table = emptyTable(mode);
  for (const key of keys) {
    const steps = insertSteps(table, key);
    table = steps[steps.length - 1]!.table;
  }
  return table;
}
