import { describe, expect, test } from '@jest/globals';

import { LAB_CLASSIFY, LAB_MARKERS, LAB_SUMMARY } from '../lab-test-support';
import type { LabField } from '../types';
import { checkLabOutput, keyChecksFor, parseJsonObject, readLabCheck } from './lab-check';

const FIELDS: LabField[] = [
  { name: 'category', type: 'string', required: true, oneOf: ['billing', 'shipping', 'other'] },
  { name: 'urgent', type: 'boolean', required: true },
  { name: 'score', type: 'number' },
  { name: 'tags', type: 'string[]', oneOf: ['late', 'parcel', 'refund'] },
];

describe('parseJsonObject', () => {
  test('reads a plain object and one wrapped in a Markdown fence', () => {
    expect(parseJsonObject('{"a":1}')).toEqual({ a: 1 });
    expect(parseJsonObject('```json\n{"a":1}\n```')).toEqual({ a: 1 });
    expect(parseJsonObject('  ```\n{"a":1}\n```  ')).toEqual({ a: 1 });
  });
  test('an array, a number, prose or nothing is not an object', () => {
    expect(parseJsonObject('[1,2]')).toBeNull();
    expect(parseJsonObject('42')).toBeNull();
    expect(parseJsonObject('Here is the answer: {"a":1}')).toBeNull();
    expect(parseJsonObject('')).toBeNull();
    expect(parseJsonObject('null')).toBeNull();
  });
});

describe('checkLabOutput', () => {
  test('a complete, well-typed answer passes every field', () => {
    const result = checkLabOutput('{"category":"Shipping","urgent":true,"score":3,"tags":["late","parcel"]}', FIELDS);
    expect(result.parsed).toBe(true);
    expect(result.fields.map((field) => field.ok)).toEqual([true, true, true, true]);
    expect(result).toMatchObject({ passed: 4, total: 4 });
  });

  test('a missing required field fails with a note that names it; a missing optional one is fine', () => {
    const result = checkLabOutput('{"category":"billing"}', FIELDS);
    const urgent = result.fields.find((field) => field.name === 'urgent');
    expect(urgent).toMatchObject({ ok: false, status: 'missing' });
    expect(urgent?.note).toContain('urgent');
    expect(result.fields.find((field) => field.name === 'score')).toMatchObject({ ok: true, status: 'absent' });
    expect(result).toMatchObject({ passed: 3, total: 4 });
  });

  test('a wrong type fails', () => {
    const result = checkLabOutput('{"category":"billing","urgent":"yes","score":"3","tags":"late"}', FIELDS);
    expect(result.fields.filter((field) => field.status === 'wrong_type').map((field) => field.name)).toEqual(['urgent', 'score', 'tags']);
  });

  test('a value outside oneOf fails, ignoring case and spaces; a list needs every item to be allowed', () => {
    expect(checkLabOutput('{"category":" BILLING ","urgent":false}', FIELDS).fields[0].ok).toBe(true);
    expect(checkLabOutput('{"category":"complaint","urgent":false}', FIELDS).fields[0]).toMatchObject({ ok: false, status: 'not_allowed' });
    expect(checkLabOutput('{"category":"other","urgent":false,"tags":["late","gift"]}', FIELDS).fields[3]).toMatchObject({ ok: false, status: 'not_allowed' });
  });

  test('a number must be finite', () => {
    expect(checkLabOutput('{"category":"other","urgent":false,"score":null}', FIELDS).fields[2].ok).toBe(false);
  });

  test('text that is not a JSON object fails every required field and says why', () => {
    const result = checkLabOutput('Sure! The category is shipping.', FIELDS);
    expect(result.parsed).toBe(false);
    expect(result.parseNote).toMatch(/JSON/);
    expect(result.passed).toBe(0);
    expect(result.fields.every((field) => !field.ok)).toBe(true);
  });

  test('never reads a field the lab did not name, and never returns the key', () => {
    const result = checkLabOutput(JSON.stringify({ category: 'other', urgent: true, reason: LAB_MARKERS.keyValue }), LAB_CLASSIFY.output.format === 'json' ? LAB_CLASSIFY.output.fields : []);
    expect(JSON.stringify(result)).not.toContain(LAB_MARKERS.keyValue);
  });
});

describe('keyChecksFor', () => {
  const fields = LAB_CLASSIFY.output.format === 'json' ? LAB_CLASSIFY.output.fields : [];

  test('compares each key value with the answer: strings by words, lists as sets, booleans and numbers exactly', () => {
    const good = '{"category":" Shipping","urgent":true,"tags":["Parcel","late"],"reason":"' + LAB_MARKERS.keyValue + '"}';
    const [check] = keyChecksFor(LAB_CLASSIFY, [good]);
    expect(check.fields.map((field) => field.match)).toEqual([true, true, true, true]);
    expect(check).toMatchObject({ label: 'A', matched: 4, total: 4 });
    expect(fields.length).toBeGreaterThan(0);
  });

  test('a wrong or missing value does not match and shows what the answer said', () => {
    const [check] = keyChecksFor(LAB_CLASSIFY, ['{"category":"billing","tags":["late"]}']);
    const byName = Object.fromEntries(check.fields.map((field) => [field.name, field]));
    expect(byName.category).toMatchObject({ match: false, expected: 'shipping', actual: 'billing' });
    expect(byName.urgent).toMatchObject({ match: false, actual: null });
    expect(byName.tags).toMatchObject({ match: false });
    expect(check.matched).toBe(0);
  });

  test('one entry per output, labelled A and B', () => {
    const checks = keyChecksFor(LAB_CLASSIFY, ['{"category":"shipping"}', 'not json']);
    expect(checks.map((check) => check.label)).toEqual(['A', 'B']);
    expect(checks[1].fields.every((field) => !field.match)).toBe(true);
  });

  test('a lab with no key has nothing to reveal', () => {
    expect(keyChecksFor(LAB_SUMMARY, ['Some summary'])).toEqual([]);
  });

  test('a numeric answer written as a numeric string still matches a numeric key', () => {
    const lab = { ...LAB_CLASSIFY, key: { score: 3 } };
    expect(keyChecksFor(lab, ['{"score":"3"}'])[0].fields[0].match).toBe(true);
    expect(keyChecksFor(lab, ['{"score":4}'])[0].fields[0].match).toBe(false);
  });
});

describe('readLabCheck', () => {
  test('reads back what the route sends and refuses a damaged shape', () => {
    const sent = checkLabOutput('{"category":"other","urgent":true}', FIELDS);
    expect(readLabCheck(JSON.parse(JSON.stringify(sent)))).toEqual(sent);
    expect(readLabCheck({ parsed: true })).toBeNull();
    expect(readLabCheck(null)).toBeNull();
  });
});
