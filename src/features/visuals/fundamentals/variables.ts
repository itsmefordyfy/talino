import { fundamentalsStrings } from './strings';

export type DataType = 'integer' | 'decimal' | 'text' | 'boolean';
export type TypeChoice = DataType | 'auto';
export type Value = { type: DataType; display: string };
export type ParseFailure = 'notInteger' | 'notDecimal' | 'notBoolean' | 'tooBig';
export type Variable = { name: string; value: Value };

/**
 * Turns what the learner typed into a value of a type. With `auto` the type is read from the text (whole number,
 * number with a point, true/false, anything else is text). With a chosen type the text must fit it, or it fails
 * the way a strictly typed language would refuse it.
 */
export function parseValue(raw: string, choice: TypeChoice): { ok: true; value: Value } | { ok: false; reason: ParseFailure } {
  const text = raw.trim();
  const type: DataType = choice === 'auto' ? (/^-?\d+$/.test(text) ? 'integer' : /^-?\d+\.\d+$/.test(text) ? 'decimal' : /^(true|false)$/.test(text) ? 'boolean' : 'text') : choice;
  switch (type) {
    case 'integer': {
      if (!/^-?\d+$/.test(text)) return { ok: false, reason: 'notInteger' };
      return Number.isSafeInteger(Number(text)) ? { ok: true, value: { type, display: String(Number(text)) } } : { ok: false, reason: 'tooBig' };
    }
    case 'decimal': {
      if (!/^-?(\d+\.?\d*|\.\d+)$/.test(text)) return { ok: false, reason: 'notDecimal' };
      const number = Number(text);
      return { ok: true, value: { type, display: Number.isInteger(number) ? `${number}.0` : String(number) } };
    }
    case 'boolean':
      return text === 'true' || text === 'false' ? { ok: true, value: { type, display: text } } : { ok: false, reason: 'notBoolean' };
    case 'text':
      return { ok: true, value: { type, display: `"${raw}"` } };
  }
}

export type AssignOutcome = { variables: Variable[]; caption: string; changed: 'declared' | 'reassigned' };

/** Stores a value under a name: a new name is declared, an existing one is reassigned (its type may change: simplified, dynamic typing). */
export function assign(variables: readonly Variable[], name: string, value: Value, t = fundamentalsStrings.en.variables): AssignOutcome {
  const existing = variables.find((variable) => variable.name === name);
  if (!existing) return { variables: [...variables, { name, value }], caption: t.declared(name, value.display, t.typeNames[value.type]), changed: 'declared' };
  const next = variables.map((variable) => (variable.name === name ? { name, value } : variable));
  const caption = existing.value.type === value.type ? t.reassigned(name, existing.value.display, value.display) : t.reassignedNewType(name, existing.value.display, t.typeNames[existing.value.type], value.display, t.typeNames[value.type]);
  return { variables: next, caption, changed: 'reassigned' };
}
