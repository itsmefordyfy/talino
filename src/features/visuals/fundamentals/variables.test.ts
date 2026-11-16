import { describe, expect, test } from '@jest/globals';

import { assign, parseValue, type Variable } from './variables';

describe('parseValue', () => {
  test('auto detects the type from the text', () => {
    expect(parseValue('25', 'auto')).toEqual({ ok: true, value: { type: 'integer', display: '25' } });
    expect(parseValue('-3', 'auto')).toEqual({ ok: true, value: { type: 'integer', display: '-3' } });
    expect(parseValue('19.99', 'auto')).toEqual({ ok: true, value: { type: 'decimal', display: '19.99' } });
    expect(parseValue('true', 'auto')).toEqual({ ok: true, value: { type: 'boolean', display: 'true' } });
    expect(parseValue('Ana', 'auto')).toEqual({ ok: true, value: { type: 'text', display: '"Ana"' } });
    expect(parseValue('', 'auto')).toEqual({ ok: true, value: { type: 'text', display: '""' } });
    expect(parseValue('True', 'auto')).toEqual({ ok: true, value: { type: 'text', display: '"True"' } });
  });
  test('a chosen type refuses text that does not fit', () => {
    expect(parseValue('3.7', 'integer')).toEqual({ ok: false, reason: 'notInteger' });
    expect(parseValue('abc', 'decimal')).toEqual({ ok: false, reason: 'notDecimal' });
    expect(parseValue('yes', 'boolean')).toEqual({ ok: false, reason: 'notBoolean' });
    expect(parseValue('99999999999999999999', 'integer')).toEqual({ ok: false, reason: 'tooBig' });
  });
  test('a chosen type converts what fits', () => {
    expect(parseValue('3', 'decimal')).toEqual({ ok: true, value: { type: 'decimal', display: '3.0' } });
    expect(parseValue('007', 'integer')).toEqual({ ok: true, value: { type: 'integer', display: '7' } });
    expect(parseValue('42', 'text')).toEqual({ ok: true, value: { type: 'text', display: '"42"' } });
    expect(parseValue(' hi ', 'text')).toEqual({ ok: true, value: { type: 'text', display: '" hi "' } });
  });
});

describe('assign', () => {
  const age: Variable = { name: 'age', value: { type: 'integer', display: '25' } };
  test('a new name is declared at the end', () => {
    const result = assign([age], 'name', { type: 'text', display: '"Ana"' });
    expect(result.changed).toBe('declared');
    expect(result.variables.map((v) => v.name)).toEqual(['age', 'name']);
  });
  test('an existing name is reassigned in place, and a type change is called out', () => {
    const same = assign([age], 'age', { type: 'integer', display: '26' });
    expect(same.changed).toBe('reassigned');
    expect(same.variables).toEqual([{ name: 'age', value: { type: 'integer', display: '26' } }]);
    const other = assign([age], 'age', { type: 'text', display: '"old"' });
    expect(other.caption).toContain('integer');
    expect(other.caption).toContain('text');
  });
  test('does not mutate the input', () => {
    const input = [age];
    assign(input, 'age', { type: 'integer', display: '1' });
    expect(input[0]).toBe(age);
  });
});
