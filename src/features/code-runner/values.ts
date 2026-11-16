/** The interpreter's own value model. Host objects never leak in: every object is one of these classes. */
import type { Function as FunctionNode } from 'acorn';

import type { Scope } from './scope';

export class JsObject {
  props = new Map<string, unknown>();
  nonEnum: Set<string> | null = null;
  frozen = false;
  className = 'Object';
  constructor(public proto: JsObject | null) {}

  /** Defines a property that for...in, Object.keys and printing skip (methods, `constructor`). */
  hidden(key: string, value: unknown) {
    this.props.set(key, value);
    (this.nonEnum ??= new Set()).add(key);
  }
}

export class Accessor {
  constructor(public get: JsFunction | null, public set: JsFunction | null) {}
}

export class JsArray extends JsObject {
  className = 'Array';
  constructor(proto: JsObject | null, public items: unknown[]) {
    super(proto);
  }
}

export class JsMap extends JsObject {
  className = 'Map';
  map = new Map<unknown, unknown>();
}

export class JsSet extends JsObject {
  className = 'Set';
  set = new Set<unknown>();
}

export type NativeFn = (thisValue: unknown, args: unknown[]) => unknown;
export type NativeCtor = (args: unknown[], newTarget: JsFunction) => unknown;

export type FieldDef = { key: string; value: import('acorn').Expression | null };

export class JsFunction extends JsObject {
  className = 'Function';
  native: NativeFn | null = null;
  nativeCtor: NativeCtor | null = null;
  node: FunctionNode | null = null;
  scope: Scope | null = null;
  isArrow = false;
  isMethod = false;
  isClass = false;
  /** The class this one extends (null for a base class). */
  parentClass: JsFunction | null = null;
  fields: FieldDef[] = [];
  homeObject: JsObject | null = null;
  /** Where the source text of a user function or class starts and ends (for toString). */
  sourceRange: [number, number] | null = null;
  constructor(proto: JsObject | null, public name: string, public arity: number) {
    super(proto);
  }
}

export function isObject(value: unknown): value is JsObject {
  return value instanceof JsObject;
}

export function isCallable(value: unknown): value is JsFunction {
  return value instanceof JsFunction;
}

/** What a thrown JavaScript value looks like to the host: caught by try/catch in the program. */
export class ThrowSignal {
  constructor(public value: unknown, public line: number | null, public column: number | null) {}
}

/** An error that ends the program and cannot be caught by it (limits, unsupported syntax). */
export class FatalError {
  constructor(public name: string, public message: string, public line: number | null, public column: number | null) {}
}

/** The prototypes every program shares. */
export type Realm = {
  object: JsObject;
  function: JsObject;
  array: JsObject;
  string: JsObject;
  number: JsObject;
  boolean: JsObject;
  map: JsObject;
  set: JsObject;
  error: JsObject;
  errors: Map<string, JsObject>;
};

export function createRealm(): Realm {
  const object = new JsObject(null);
  const make = () => new JsObject(object);
  return { object, function: make(), array: make(), string: make(), number: make(), boolean: make(), map: make(), set: make(), error: make(), errors: new Map() };
}
