import { describe, expect, test } from '@jest/globals';

import { applyArrayOp, applyObjectOp, displayValue, MAX_ITEMS } from './collections';

const base = ['"apple"', '"pear"', '"plum"'];

describe('arrays', () => {
  test('push adds at the end with the next index', () => {
    const result = applyArrayOp(base, { kind: 'push', value: 'fig' });
    expect(result.items).toEqual([...base, '"fig"']);
    expect(result.marked).toEqual([3]);
  });
  test('insert shifts later items to the right and does not mutate the input', () => {
    const result = applyArrayOp(base, { kind: 'insert', index: 1, value: '5' });
    expect(result.items).toEqual(['"apple"', '5', '"pear"', '"plum"']);
    expect(base).toHaveLength(3);
    expect(applyArrayOp(base, { kind: 'insert', index: 3, value: 'x' }).ok).toBe(true);
    expect(applyArrayOp(base, { kind: 'insert', index: 4, value: 'x' }).ok).toBe(false);
    expect(applyArrayOp(base, { kind: 'insert', index: -1, value: 'x' }).ok).toBe(false);
  });
  test('remove shifts later items left; a bad index changes nothing', () => {
    expect(applyArrayOp(base, { kind: 'removeAt', index: 0 }).items).toEqual(['"pear"', '"plum"']);
    const bad = applyArrayOp(base, { kind: 'removeAt', index: 3 });
    expect(bad.ok).toBe(false);
    expect(bad.items).toEqual(base);
  });
  test('pop, swap, reverse and read', () => {
    expect(applyArrayOp(base, { kind: 'pop' }).items).toEqual(['"apple"', '"pear"']);
    expect(applyArrayOp([], { kind: 'pop' }).ok).toBe(false);
    expect(applyArrayOp(base, { kind: 'swap', i: 0, j: 2 }).items).toEqual(['"plum"', '"pear"', '"apple"']);
    expect(applyArrayOp(base, { kind: 'swap', i: 0, j: 3 }).ok).toBe(false);
    expect(applyArrayOp(base, { kind: 'reverse' }).items).toEqual(['"plum"', '"pear"', '"apple"']);
    expect(applyArrayOp(base, { kind: 'read', index: 1 }).caption).toContain('"pear"');
    expect(applyArrayOp(base, { kind: 'read', index: 7 }).ok).toBe(false);
  });
  test('the length is capped and empty values are refused', () => {
    let items: string[] = [];
    for (let index = 0; index < MAX_ITEMS; index += 1) items = applyArrayOp(items, { kind: 'push', value: String(index) }).items;
    expect(items).toHaveLength(MAX_ITEMS);
    expect(applyArrayOp(items, { kind: 'push', value: '1' }).ok).toBe(false);
    expect(applyArrayOp([], { kind: 'push', value: '  ' }).ok).toBe(false);
  });
  test('values are shown as numbers, booleans or quoted text', () => {
    expect([displayValue('42'), displayValue('-1.5'), displayValue('true'), displayValue('hi')]).toEqual(['42', '-1.5', 'true', '"hi"']);
  });
});

describe('objects', () => {
  const person = [{ key: 'name', value: '"Ana"' }, { key: 'age', value: '25' }];
  test('set adds a new property or updates an existing one in place', () => {
    expect(applyObjectOp(person, { kind: 'set', key: 'city', value: 'Cebu' }).properties.at(-1)).toEqual({ key: 'city', value: '"Cebu"' });
    const updated = applyObjectOp(person, { kind: 'set', key: 'age', value: '26' });
    expect(updated.properties).toEqual([{ key: 'name', value: '"Ana"' }, { key: 'age', value: '26' }]);
    expect(person[1]?.value).toBe('25');
  });
  test('delete and read by key; missing keys are reported', () => {
    expect(applyObjectOp(person, { kind: 'delete', key: 'age' }).properties).toEqual([{ key: 'name', value: '"Ana"' }]);
    expect(applyObjectOp(person, { kind: 'delete', key: 'zip' }).ok).toBe(false);
    expect(applyObjectOp(person, { kind: 'read', key: 'name' }).caption).toContain('"Ana"');
    expect(applyObjectOp(person, { kind: 'read', key: 'zip' }).ok).toBe(false);
  });
  test('keys must be valid names', () => {
    expect(applyObjectOp(person, { kind: 'set', key: '1bad', value: 'x' }).ok).toBe(false);
    expect(applyObjectOp(person, { kind: 'set', key: 'has space', value: 'x' }).ok).toBe(false);
  });
});
