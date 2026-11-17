import type { LabField, LabTask } from '../types';
import { cleanText } from './sanitize';

/**
 * The local, deterministic check of a structured (JSON) lab answer. It is code, never a model: it parses what the model said and tests it against
 * the lab's `fields` (required, type, `oneOf`), and, after the learner's review, compares it with the lab's `key`. The field check tells the
 * learner which fields failed while they work; the key's values are only ever returned by `keyChecksFor`, which the route calls for the review.
 */

export type FieldStatus = 'ok' | 'absent' | 'missing' | 'wrong_type' | 'not_allowed';

export type FieldCheck = { name: string; ok: boolean; status: FieldStatus; note: string };

export type LabCheckResult = {
  /** The reply was a JSON object (a Markdown fence around it is tolerated). */
  parsed: boolean;
  /** Why it was not, in a sentence, when `parsed` is false. */
  parseNote?: string;
  fields: FieldCheck[];
  passed: number;
  total: number;
};

/** A reply that wraps its JSON in a ```json fence is still JSON; anything else around it is not. */
export function parseJsonObject(text: string): Record<string, unknown> | null {
  const unfenced = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
  try {
    const value: unknown = JSON.parse(unfenced);
    return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Lowercase, spaces collapsed: a label matches however the model cased or padded it. */
const loose = (value: string): string => value.toLowerCase().replace(/\s+/g, ' ').trim();

const typeOk = (field: LabField, value: unknown): boolean => {
  switch (field.type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && Number.isFinite(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'string[]':
      return Array.isArray(value) && value.every((item) => typeof item === 'string');
  }
};

const TYPE_WORDS: Record<LabField['type'], string> = { string: 'text', number: 'a number', boolean: 'true or false', 'string[]': 'a list of text' };

function allowed(field: LabField, value: unknown): boolean {
  if (!field.oneOf || field.oneOf.length === 0) return true;
  const options = field.oneOf.map(loose);
  if (typeof value === 'string') return options.includes(loose(value));
  if (Array.isArray(value)) return value.every((item) => typeof item === 'string' && options.includes(loose(item)));
  return true;
}

/**
 * Whether the model's reply has the fields the lab asks for. A field counts as required only when the lab says `required: true`; an optional field
 * that is absent passes, one that is present must still have the right type and an allowed value.
 */
export function checkLabOutput(text: string, fields: readonly LabField[]): LabCheckResult {
  const value = parseJsonObject(text);
  if (!value) {
    const note = 'The reply is not a JSON object, so no field could be read.';
    return { parsed: false, parseNote: note, fields: fields.map((field) => ({ name: field.name, ok: false, status: 'missing', note: `Missing: "${field.name}" could not be read.` })), passed: 0, total: fields.length };
  }
  const checks = fields.map((field): FieldCheck => {
    const present = field.name in value && value[field.name] !== undefined;
    if (!present) {
      return field.required === true
        ? { name: field.name, ok: false, status: 'missing', note: `Missing: the answer has no "${field.name}" field.` }
        : { name: field.name, ok: true, status: 'absent', note: `Optional: "${field.name}" was left out.` };
    }
    const found = value[field.name];
    if (!typeOk(field, found)) return { name: field.name, ok: false, status: 'wrong_type', note: `"${field.name}" should be ${TYPE_WORDS[field.type]}.` };
    if (!allowed(field, found)) return { name: field.name, ok: false, status: 'not_allowed', note: `"${field.name}" has a value outside the allowed list.` };
    return { name: field.name, ok: true, status: 'ok', note: `"${field.name}" is fine.` };
  });
  return { parsed: true, fields: checks, passed: checks.filter((check) => check.ok).length, total: checks.length };
}

const STATUSES: readonly string[] = ['ok', 'absent', 'missing', 'wrong_type', 'not_allowed'];

/** A field check as the phone reads it back from the route: shape only. */
export function readLabCheck(value: unknown): LabCheckResult | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const { parsed, parseNote, fields, passed, total } = value as Record<string, unknown>;
  if (typeof parsed !== 'boolean' || !Array.isArray(fields) || typeof passed !== 'number' || typeof total !== 'number') return null;
  const list: FieldCheck[] = [];
  for (const item of fields) {
    if (typeof item !== 'object' || item === null) return null;
    const entry = item as Record<string, unknown>;
    if (typeof entry.name !== 'string' || typeof entry.ok !== 'boolean' || typeof entry.status !== 'string' || !STATUSES.includes(entry.status)) return null;
    list.push({ name: cleanText(entry.name, 80), ok: entry.ok, status: entry.status as FieldStatus, note: cleanText(entry.note, 200) });
  }
  return { parsed, ...(typeof parseNote === 'string' ? { parseNote: cleanText(parseNote, 200) } : {}), fields: list, passed, total };
}

// ── The key (revealed only in the review)

export type KeyValue = string | number | boolean | string[];

export type KeyFieldCheck = { name: string; match: boolean; /** The lab's value, shown as "what the material says". */ expected: string; /** What the answer said, or null when it had nothing there. */ actual: string | null };

export type KeyCheck = { /** Which output: A, or A and B for a comparison. */ label: 'A' | 'B'; fields: KeyFieldCheck[]; matched: number; total: number };

const show = (value: unknown, max = 200): string => cleanText(typeof value === 'string' ? value : JSON.stringify(value), max);

function sameValue(expected: KeyValue, actual: unknown): boolean {
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual) || !actual.every((item) => typeof item === 'string')) return false;
    const want = new Set(expected.map(loose));
    const got = new Set((actual as string[]).map(loose));
    return want.size === got.size && [...want].every((item) => got.has(item));
  }
  if (typeof expected === 'string') return typeof actual === 'string' && loose(actual) === loose(expected);
  if (typeof expected === 'number') {
    if (typeof actual === 'number') return actual === expected;
    return typeof actual === 'string' && /^-?\d+(\.\d+)?$/.test(actual.trim()) && Number(actual) === expected;
  }
  return actual === expected;
}

/**
 * The lab's key against each output, by code. Only the review calls this: before it, the learner is told which fields failed, never which
 * values were right. A lab without a key has nothing to reveal.
 */
export function keyChecksFor(lab: Pick<LabTask, 'key'>, outputs: readonly string[]): KeyCheck[] {
  const key = lab.key;
  if (!key || Object.keys(key).length === 0) return [];
  return outputs.slice(0, 2).map((output, index) => {
    const value = parseJsonObject(output);
    const fields = Object.entries(key).map(([name, expected]): KeyFieldCheck => {
      const actual = value && name in value ? value[name] : undefined;
      return { name, match: value !== null && sameValue(expected, actual), expected: show(expected), actual: actual === undefined ? null : show(actual) };
    });
    return { label: index === 0 ? 'A' : 'B', fields, matched: fields.filter((field) => field.match).length, total: fields.length };
  });
}

/** A key check as the phone reads it back (shape only). */
export function readKeyChecks(value: unknown): KeyCheck[] {
  if (!Array.isArray(value)) return [];
  const list: KeyCheck[] = [];
  for (const item of value.slice(0, 2)) {
    if (typeof item !== 'object' || item === null) continue;
    const entry = item as Record<string, unknown>;
    if ((entry.label !== 'A' && entry.label !== 'B') || !Array.isArray(entry.fields)) continue;
    const fields: KeyFieldCheck[] = [];
    for (const field of entry.fields.slice(0, 20)) {
      if (typeof field !== 'object' || field === null) continue;
      const f = field as Record<string, unknown>;
      if (typeof f.name !== 'string' || typeof f.match !== 'boolean' || typeof f.expected !== 'string') continue;
      fields.push({ name: cleanText(f.name, 80), match: f.match, expected: cleanText(f.expected, 200), actual: typeof f.actual === 'string' ? cleanText(f.actual, 200) : null });
    }
    list.push({ label: entry.label, fields, matched: fields.filter((field) => field.match).length, total: fields.length });
  }
  return list;
}
