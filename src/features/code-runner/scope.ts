export type BindingKind = 'var' | 'let' | 'const';
export type Binding = { value: unknown; kind: BindingKind; init: boolean };

/** What `this`, `super`, `arguments` and `new.target` mean inside one non-arrow function call. */
export type FnContext = {
  thisValue: unknown;
  func: import('./values').JsFunction | null;
  args: unknown[];
  newTarget: import('./values').JsFunction | null;
  homeObject: import('./values').JsObject | null;
};

export class Scope {
  vars = new Map<string, Binding>();
  constructor(public parent: Scope | null, public fn: FnContext | null = null) {}

  find(name: string): Binding | null {
    for (let scope: Scope | null = this; scope; scope = scope.parent) {
      const found = scope.vars.get(name);
      if (found) return found;
    }
    return null;
  }

  declare(name: string, kind: BindingKind, value: unknown, init = true) {
    this.vars.set(name, { value, kind, init });
  }

  fnContext(): FnContext | null {
    for (let scope: Scope | null = this; scope; scope = scope.parent) if (scope.fn) return scope.fn;
    return null;
  }
}
