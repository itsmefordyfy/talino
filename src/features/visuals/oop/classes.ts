import { oopStrings } from './strings';

type Text = typeof oopStrings.en.classes;

export type FieldKind = 'text' | 'number';
export type FieldSpec = { name: string; kind: FieldKind; initial: string };
export type FieldValues = Record<string, string | number>;
export type MethodSpec = { name: string; run: (values: FieldValues, t: Text) => { result: string; patch?: FieldValues } };
export type ClassSpec = { id: 'dog' | 'car'; name: string; fields: readonly FieldSpec[]; methods: readonly MethodSpec[] };

/** Two blueprints, each with fields (data) and methods (behaviour that works on one object's own data). */
export const CLASS_SPECS: readonly ClassSpec[] = [
  {
    id: 'dog',
    name: 'Dog',
    fields: [{ name: 'name', kind: 'text', initial: 'Rex' }, { name: 'age', kind: 'number', initial: '3' }],
    methods: [
      { name: 'speak()', run: (values) => ({ result: `${values.name} says Woof!` }) },
      { name: 'birthday()', run: (values, t) => ({ result: t.birthday(String(values.name), Number(values.age) + 1), patch: { age: Number(values.age) + 1 } }) },
    ],
  },
  {
    id: 'car',
    name: 'Car',
    fields: [{ name: 'make', kind: 'text', initial: 'Toyota' }, { name: 'speed', kind: 'number', initial: '0' }],
    methods: [
      { name: 'describe()', run: (values) => ({ result: `A ${values.make} going ${values.speed} km/h` }) },
      { name: 'accelerate()', run: (values, t) => ({ result: t.accelerate(String(values.make), Number(values.speed) + 10), patch: { speed: Number(values.speed) + 10 } }) },
    ],
  },
];

export const MAX_OBJECTS = 4;

export type ObjectInstance = { id: string; values: FieldValues };

/** The constructor call that made an object, as it would be written: `new Dog("Rex", 3)`. */
export const constructorCall = (spec: ClassSpec, values: FieldValues) => `new ${spec.name}(${spec.fields.map((field) => (field.kind === 'text' ? `"${values[field.name]}"` : String(values[field.name]))).join(', ')})`;

/** Builds an object from what was typed; a number field must hold a number, and a text field must not be empty. */
export function createInstance(spec: ClassSpec, raw: Record<string, string>, existing: readonly ObjectInstance[]): { ok: true; instance: ObjectInstance } | { ok: false; field: string; reason: 'empty' | 'notNumber' | 'full' } {
  if (existing.length >= MAX_OBJECTS) return { ok: false, field: '', reason: 'full' };
  const values: FieldValues = {};
  for (const field of spec.fields) {
    const text = (raw[field.name] ?? '').trim();
    if (text === '') return { ok: false, field: field.name, reason: 'empty' };
    if (field.kind === 'number') {
      if (Number.isNaN(Number(text))) return { ok: false, field: field.name, reason: 'notNumber' };
      values[field.name] = Number(text);
    } else values[field.name] = text;
  }
  const used = new Set(existing.map((instance) => instance.id));
  let n = 1;
  while (used.has(`${spec.name.toLowerCase()}${n}`)) n += 1;
  return { ok: true, instance: { id: `${spec.name.toLowerCase()}${n}`, values } };
}

/** Calls one method on one object. Only that object's own values can change; every other object keeps its own. */
export function callMethod(spec: ClassSpec, instances: readonly ObjectInstance[], id: string, method: string, t: Text = oopStrings.en.classes): { instances: ObjectInstance[]; result: string } {
  const target = instances.find((instance) => instance.id === id);
  const spec2 = spec.methods.find((candidate) => candidate.name === method);
  if (!target || !spec2) return { instances: [...instances], result: '' };
  const { result, patch } = spec2.run(target.values, t);
  return { instances: instances.map((instance) => (instance.id === id ? { ...instance, values: { ...instance.values, ...patch } } : instance)), result };
}
