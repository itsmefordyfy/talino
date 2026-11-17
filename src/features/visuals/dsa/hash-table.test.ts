import { describe, expect, test } from '@jest/globals';

import { cleanKey, deleteSteps, emptyTable, hashKey, insertSteps, lookupSteps, MAX_CHAIN_KEYS, tableFromKeys, TABLE_SIZE, type HashMode, type Table } from './hash-table';

const last = <T>(items: readonly T[]) => items[items.length - 1]!;
const START = ['cat', 'dog', 'map', 'pen'];

const chainKeys = (table: Table) => table.chains.map((chain) => [...chain]);
const slotKeys = (table: Table) => table.slots.map((slot) => (slot.kind === 'full' ? slot.key : slot.kind === 'deleted' ? '#' : null));

describe('hashKey and cleanKey', () => {
  test('sums the character codes and takes them mod 7', () => {
    expect(hashKey('sun')).toEqual({ key: 'sun', codes: [115, 117, 110], sum: 342, index: 6 });
    expect(hashKey('cat').index).toBe(4);
    expect(hashKey('dog').index).toBe(6);
    expect(hashKey('a').index).toBe(97 % TABLE_SIZE);
  });
  test('keys are lowercase letters and digits, at most 8', () => {
    expect(cleanKey(' Hello, World! ')).toBe('hellowor');
    expect(cleanKey('???')).toBe('');
    expect(cleanKey('abc123')).toBe('abc123');
  });
});

describe('separate chaining', () => {
  const table = tableFromKeys('chaining', START);
  test('the start table has one key per bucket where they do not collide', () => {
    expect(chainKeys(table)[4]).toEqual(['cat']);
    expect(chainKeys(table)[6]).toEqual(['dog']);
    expect(table.keys).toEqual(START);
  });
  test('inserting into an empty bucket is a single probe and no collision', () => {
    const empty = insertSteps(emptyTable('chaining'), 'cat');
    expect(last(empty).probes).toBe(1);
    expect(last(empty).collisions).toBe(0);
    expect(last(empty).placed).toEqual({ index: 4, pos: 0 });
    expect(chainKeys(last(empty).table)[4]).toEqual(['cat']);
  });
  test('a colliding key joins the end of the chain after comparing with each key in it', () => {
    const steps = insertSteps(table, 'sun');
    const final = last(steps);
    expect(chainKeys(final.table)[6]).toEqual(['dog', 'sun']);
    expect(final.collisions).toBe(1);
    expect(final.compares).toBe(1);
    expect(final.probes).toBe(1);
    expect(steps.some((step) => step.collision === 6)).toBe(true);
    expect(final.table.keys).toEqual([...START, 'sun']);
  });
  test('the hash step names the arithmetic', () => {
    expect(insertSteps(table, 'sun')[0]?.caption).toContain('s=115 + u=117 + n=110 = 342');
    expect(insertSteps(table, 'sun')[0]?.caption).toContain('342 mod 7 = 6');
  });
  test('a duplicate key changes nothing', () => {
    const final = last(insertSteps(table, 'dog'));
    expect(final.table.keys).toEqual(START);
    expect(final.found).toEqual({ index: 6, pos: 0 });
    expect(chainKeys(final.table)).toEqual(chainKeys(table));
  });
  test('lookup finds a chained key and counts the comparisons', () => {
    const withSun = tableFromKeys('chaining', [...START, 'sun']);
    const hit = last(lookupSteps(withSun, 'sun'));
    expect(hit.found).toEqual({ index: 6, pos: 1 });
    expect(hit.compares).toBe(2);
    expect(hit.probes).toBe(1);
    const miss = last(lookupSteps(withSun, 'tea'));
    expect(miss.found).toBeNull();
    expect(miss.compares).toBe(2);
    expect(last(lookupSteps(table, 'zzz')).compares).toBe(0);
  });
  test('delete removes only that key from its chain', () => {
    const withSun = tableFromKeys('chaining', [...START, 'sun']);
    const final = last(deleteSteps(withSun, 'dog'));
    expect(chainKeys(final.table)[6]).toEqual(['sun']);
    expect(final.table.keys).toEqual(['cat', 'map', 'pen', 'sun']);
    expect(final.removed).toEqual({ index: 6, pos: 0 });
  });
  test('deleting a missing key changes nothing and says so', () => {
    const steps = deleteSteps(table, 'zzz');
    expect(last(steps).table.keys).toEqual(START);
    expect(last(steps).caption).toContain('nothing to delete');
  });
  test('the table is capped and an empty key is refused', () => {
    let full = emptyTable('chaining');
    for (let index = 0; index < MAX_CHAIN_KEYS; index += 1) full = last(insertSteps(full, `k${index}`)).table;
    expect(full.keys).toHaveLength(MAX_CHAIN_KEYS);
    expect(insertSteps(full, 'extra')[0]?.refused).toBe(true);
    expect(last(insertSteps(full, 'k0')).refused).toBe(false);
    expect(insertSteps(table, '  ')[0]?.refused).toBe(true);
    expect(lookupSteps(table, '')[0]?.refused).toBe(true);
    expect(deleteSteps(table, '')[0]?.refused).toBe(true);
  });
});

describe('linear probing', () => {
  const table = tableFromKeys('probing', START);
  test('a colliding key moves to the next free slot, wrapping past the last slot', () => {
    expect(slotKeys(table)).toEqual([null, 'pen', null, 'map', 'cat', null, 'dog']);
    const steps = insertSteps(table, 'sun');
    const final = last(steps);
    expect(slotKeys(final.table)[0]).toBe('sun');
    expect(final.placed).toEqual({ index: 0, pos: 0 });
    expect(final.probes).toBe(2);
    expect(final.collisions).toBe(1);
    expect(final.compares).toBe(1);
    expect(steps.some((step) => step.collision === 6)).toBe(true);
  });
  test('lookup follows the same run and counts probes', () => {
    const withSun = tableFromKeys('probing', [...START, 'sun']);
    const hit = last(lookupSteps(withSun, 'sun'));
    expect(hit.found).toEqual({ index: 0, pos: 0 });
    expect(hit.probes).toBe(2);
    expect(last(lookupSteps(withSun, 'zzz')).found).toBeNull();
  });
  test('delete leaves a tombstone so a later key in the run is still found', () => {
    const withSun = tableFromKeys('probing', [...START, 'sun']);
    const afterDelete = last(deleteSteps(withSun, 'dog')).table;
    expect(slotKeys(afterDelete)[6]).toBe('#');
    expect(last(lookupSteps(afterDelete, 'sun')).found).toEqual({ index: 0, pos: 0 });
    expect(afterDelete.keys).toEqual(['cat', 'map', 'pen', 'sun']);
  });
  test('an insert reuses the first tombstone once it has checked the run', () => {
    const withSun = tableFromKeys('probing', [...START, 'sun']);
    const afterDelete = last(deleteSteps(withSun, 'dog')).table;
    const reinserted = last(insertSteps(afterDelete, 'tea'));
    expect(reinserted.placed).toEqual({ index: 6, pos: 0 });
    expect(slotKeys(reinserted.table)[6]).toBe('tea');
    expect(last(insertSteps(afterDelete, 'sun')).table.keys).toEqual(afterDelete.keys);
  });
  test('a full table refuses new keys but still finds old ones', () => {
    let full = emptyTable('probing');
    for (const key of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) full = last(insertSteps(full, key)).table;
    expect(full.keys).toHaveLength(TABLE_SIZE);
    expect(insertSteps(full, 'zz')[0]?.refused).toBe(true);
    expect(last(lookupSteps(full, 'g')).found).not.toBeNull();
    expect(last(lookupSteps(full, 'zz')).found).toBeNull();
    expect(last(lookupSteps(full, 'zz')).probes).toBe(TABLE_SIZE);
  });
});

describe('modes', () => {
  test('both modes rebuild from the same keys, in the same order', () => {
    const modes: HashMode[] = ['chaining', 'probing'];
    for (const mode of modes) expect(tableFromKeys(mode, START).keys).toEqual(START);
  });
  test('the last step of an insert holds every key plus the new one', () => {
    for (const mode of ['chaining', 'probing'] as const) {
      expect(last(insertSteps(tableFromKeys(mode, START), 'ant')).table.keys).toEqual([...START, 'ant']);
    }
  });
  test('steps never change the table they were given', () => {
    const base = tableFromKeys('chaining', START);
    const before = JSON.stringify(base);
    insertSteps(base, 'sun');
    deleteSteps(base, 'cat');
    expect(JSON.stringify(base)).toBe(before);
  });
});
