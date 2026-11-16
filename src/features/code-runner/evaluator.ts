/**
 * Expression evaluation, functions, classes and destructuring. Statements live in `Interpreter`,
 * which extends this. Every runtime failure becomes a JavaScript-style error with a line number.
 */
import type { AnyNode, ClassBody, Expression, Function as FunctionNode } from 'acorn';

import { UNSUPPORTED_GLOBALS } from './builtins';
import { Runtime } from './runtime';
import { Scope, type BindingKind, type FnContext } from './scope';
import { Accessor, JsFunction, JsObject, isObject, type FieldDef } from './values';

export type Completion = { type: 'break' | 'continue'; label: string | null } | { type: 'return'; value: unknown };

/** What an optional chain (`a?.b`) hands back, up the chain, once it meets null or undefined. */
export const CHAIN_SHORT = Symbol('chain-short');
const UNINIT = Symbol('uninitialized-this');

type Mode = BindingKind | 'param' | 'assign';
type Node = AnyNode;

const UNSUPPORTED_NODES: Record<string, string> = {
  WithStatement: 'The with statement',
  AwaitExpression: 'async/await',
  YieldExpression: 'Generators (yield)',
  TaggedTemplateExpression: 'Tagged templates',
  ImportExpression: 'import()',
  ImportDeclaration: 'Importing and exporting',
  ExportNamedDeclaration: 'Importing and exporting',
  ExportDefaultDeclaration: 'Importing and exporting',
  ExportAllDeclaration: 'Importing and exporting',
};

export abstract class Evaluator extends Runtime {
  source = '';
  globalScope = new Scope(null, { thisValue: undefined, func: null, args: [], newTarget: null, homeObject: null });
  lastValue: unknown = undefined;

  abstract runBody(statements: readonly Node[], scope: Scope): Completion | undefined;
  abstract hoist(statements: readonly Node[], scope: Scope, functionLevel: boolean): void;

  functionSource(fn: JsFunction): string | null {
    return fn.sourceRange ? this.source.slice(fn.sourceRange[0], fn.sourceRange[1]) : null;
  }

  mark(node: Node) {
    const loc = node.loc;
    if (loc) {
      this.line = loc.start.line;
      this.col = loc.start.column + 1;
    }
  }

  text(node: Node): string {
    const raw = this.source.slice(node.start, node.end).replace(/\s+/g, ' ');
    return raw.length > 60 ? `${raw.slice(0, 57)}...` : raw;
  }

  // ---- variables --------------------------------------------------------------------------

  lookupVar(name: string, scope: Scope): unknown {
    const binding = scope.find(name);
    if (binding) {
      if (!binding.init) this.throwError('ReferenceError', `Cannot access '${name}' before initialization`);
      return binding.value;
    }
    if (name === 'arguments') {
      for (let s: Scope | null = scope; s; s = s.parent) if (s.fn?.func) return this.newArray(s.fn.args.slice());
    }
    if (UNSUPPORTED_GLOBALS.has(name)) this.unsupported(name);
    return this.throwError('ReferenceError', `${name} is not defined`);
  }

  assignVar(name: string, value: unknown, scope: Scope) {
    const binding = scope.find(name);
    if (!binding) {
      if (UNSUPPORTED_GLOBALS.has(name)) this.unsupported(name);
      if (this.strict) this.throwError('ReferenceError', `${name} is not defined`);
      this.globalScope.declare(name, 'var', value);
      return;
    }
    if (!binding.init) this.throwError('ReferenceError', `Cannot access '${name}' before initialization`);
    if (binding.kind === 'const') this.throwError('TypeError', 'Assignment to constant variable.');
    binding.value = value;
  }

  initBinding(name: string, kind: BindingKind, value: unknown, scope: Scope) {
    const binding = scope.vars.get(name);
    if (binding) {
      binding.value = value;
      binding.init = true;
    } else scope.declare(name, kind, value);
  }

  thisValue(scope: Scope): unknown {
    const ctx = scope.fnContext();
    if (!ctx) return undefined;
    if (ctx.thisValue === UNINIT) {
      this.throwError('ReferenceError', "Must call super constructor in derived class before accessing 'this' or returning from derived constructor");
    }
    return ctx.thisValue;
  }

  // ---- functions --------------------------------------------------------------------------

  makeFunction(node: FunctionNode, scope: Scope, name: string, method = false, home: JsObject | null = null): JsFunction {
    if (node.async) this.unsupported('Async functions (async/await)');
    if (node.generator) this.unsupported('Generators (function*)');
    let arity = 0;
    for (const p of node.params) {
      if (p.type === 'AssignmentPattern' || p.type === 'RestElement') break;
      arity++;
    }
    const fn = new JsFunction(this.realm.function, name, arity);
    fn.node = node;
    fn.scope = scope;
    fn.isArrow = node.type === 'ArrowFunctionExpression';
    fn.isMethod = method;
    fn.homeObject = home;
    fn.sourceRange = [node.start, node.end];
    if (!fn.isArrow && !method) {
      const proto = this.newObject();
      proto.hidden('constructor', fn);
      fn.hidden('prototype', proto);
    }
    return fn;
  }

  callFunction(fn: unknown, thisValue: unknown, args: unknown[], calleeText?: string): unknown {
    if (!(fn instanceof JsFunction)) return this.throwError('TypeError', `${calleeText ?? this.inspect(fn)} is not a function`);
    this.tick();
    if (fn.isClass) return this.throwError('TypeError', `Class constructor ${fn.name} cannot be invoked without 'new'`);
    if (fn.native) return fn.native(thisValue, args);
    const ctx: FnContext | null = fn.isArrow ? null : { thisValue, func: fn, args, newTarget: null, homeObject: fn.homeObject };
    return this.callUser(fn, ctx, args);
  }

  callUser(fn: JsFunction, ctx: FnContext | null, args: unknown[]): unknown {
    const node = fn.node;
    if (!node) return undefined;
    if (this.depth >= this.maxDepth) this.throwError('RangeError', 'Maximum call stack size exceeded');
    this.depth++;
    try {
      const scope = new Scope(fn.scope, ctx);
      for (let i = 0; i < node.params.length; i++) {
        const p = node.params[i];
        if (p.type === 'RestElement') this.bindPattern(p.argument, this.newArray(args.slice(i)), scope, 'param');
        else this.bindPattern(p, args[i], scope, 'param');
      }
      if (node.body.type !== 'BlockStatement') return this.evalExpr(node.body, scope);
      this.hoist(node.body.body, scope, true);
      const done = this.runBody(node.body.body, scope);
      return done && done.type === 'return' ? done.value : undefined;
    } finally {
      this.depth--;
    }
  }

  construct(fn: unknown, args: unknown[], newTarget?: JsFunction, calleeText?: string): unknown {
    if (!(fn instanceof JsFunction) || (!fn.isClass && (fn.isArrow || fn.isMethod || (!fn.node && !fn.nativeCtor)))) {
      return this.throwError('TypeError', `${calleeText ?? this.inspect(fn)} is not a constructor`);
    }
    this.tick();
    const target = newTarget ?? fn;
    if (fn.nativeCtor) return fn.nativeCtor(args, target);
    const protoValue = target.props.get('prototype');
    const proto = protoValue instanceof JsObject ? protoValue : this.realm.object;
    if (fn.isClass && fn.parentClass) {
      const ctx: FnContext = { thisValue: UNINIT, func: fn, args, newTarget: target, homeObject: fn.homeObject };
      if (fn.node) {
        const result = this.callUser(fn, ctx, args);
        if (isObject(result)) return result;
      } else {
        const instance = this.construct(fn.parentClass, args, target);
        ctx.thisValue = instance;
        if (isObject(instance)) this.initFields(fn, instance);
      }
      if (ctx.thisValue === UNINIT) {
        this.throwError('ReferenceError', "Must call super constructor in derived class before accessing 'this' or returning from derived constructor");
      }
      return ctx.thisValue;
    }
    const instance = new JsObject(proto);
    if (fn.isClass) this.initFields(fn, instance);
    const ctx: FnContext = { thisValue: instance, func: fn, args, newTarget: target, homeObject: fn.homeObject };
    const result = this.callUser(fn, ctx, args);
    return isObject(result) ? result : instance;
  }

  initFields(cls: JsFunction, instance: JsObject) {
    if (cls.fields.length === 0) return;
    const scope = new Scope(cls.scope, { thisValue: instance, func: cls, args: [], newTarget: null, homeObject: cls.homeObject });
    for (const field of cls.fields) {
      const value = field.value ? this.evalExpr(field.value, scope, field.key) : undefined;
      instance.props.set(field.key, value);
      if (field.key.startsWith('#')) (instance.nonEnum ??= new Set()).add(field.key);
    }
  }

  // ---- classes ----------------------------------------------------------------------------

  evalClass(node: Node & { id?: { name: string } | null; superClass?: Expression | null; body: ClassBody }, scope: Scope, hint: string): JsFunction {
    let parent: JsFunction | null = null;
    if (node.superClass) {
      const value = this.evalExpr(node.superClass, scope);
      if (!(value instanceof JsFunction) || value.isArrow || value.isMethod) {
        return this.throwError('TypeError', `Class extends value ${this.inspect(value)} is not a constructor or null`);
      }
      parent = value;
    }
    const name = node.id?.name ?? hint;
    const classScope = new Scope(scope);
    const parentProto = parent?.props.get('prototype');
    const proto = new JsObject(parentProto instanceof JsObject ? parentProto : this.realm.object);
    const cls = new JsFunction(parent ?? this.realm.function, name, 0);
    cls.isClass = true;
    cls.parentClass = parent;
    cls.scope = classScope;
    cls.homeObject = proto;
    cls.sourceRange = [node.start, node.end];
    cls.hidden('prototype', proto);
    proto.hidden('constructor', cls);
    if (node.id) classScope.declare(node.id.name, 'const', cls);

    const keyOf = (key: Node, computed: boolean): string => {
      if (computed) return this.toKey(this.evalExpr(key, classScope));
      if (key.type === 'Identifier') return key.name;
      if (key.type === 'PrivateIdentifier') return `#${key.name}`;
      if (key.type === 'Literal') return String(key.value);
      return this.toKey(this.evalExpr(key, classScope));
    };
    const statics: (() => void)[] = [];
    for (const member of node.body.body) {
      if (member.type === 'MethodDefinition') {
        if (member.kind === 'constructor') {
          cls.node = member.value;
          cls.arity = member.value.params.length;
          continue;
        }
        const key = keyOf(member.key, member.computed);
        const target = member.static ? cls : proto;
        const fn = this.makeFunction(member.value, classScope, key, true, target);
        if (member.kind === 'method') target.hidden(key, fn);
        else {
          const existing = target.props.get(key);
          const accessor = existing instanceof Accessor ? existing : new Accessor(null, null);
          if (member.kind === 'get') accessor.get = fn;
          else accessor.set = fn;
          target.hidden(key, accessor);
        }
      } else if (member.type === 'PropertyDefinition') {
        const field: FieldDef = { key: keyOf(member.key, member.computed), value: member.value ?? null };
        if (member.static) {
          statics.push(() => {
            const sScope = new Scope(classScope, { thisValue: cls, func: cls, args: [], newTarget: null, homeObject: cls });
            cls.props.set(field.key, field.value ? this.evalExpr(field.value, sScope, field.key) : undefined);
            if (field.key.startsWith('#')) (cls.nonEnum ??= new Set()).add(field.key);
          });
        } else cls.fields.push(field);
      } else {
        const block = member;
        statics.push(() => {
          const sScope = new Scope(classScope, { thisValue: cls, func: cls, args: [], newTarget: null, homeObject: cls });
          this.hoist(block.body, sScope, true);
          this.runBody(block.body, sScope);
        });
      }
    }
    for (const run of statics) run();
    return cls;
  }

  // ---- patterns ---------------------------------------------------------------------------

  bindPattern(pattern: Node, value: unknown, scope: Scope, mode: Mode) {
    switch (pattern.type) {
      case 'Identifier':
        if (mode === 'assign') this.assignVar(pattern.name, value, scope);
        else if (mode === 'param') scope.declare(pattern.name, 'var', value);
        else if (mode === 'var') {
          const binding = scope.find(pattern.name);
          if (binding) binding.value = value;
          else scope.declare(pattern.name, 'var', value);
        } else this.initBinding(pattern.name, mode, value, scope);
        return;
      case 'MemberExpression': {
        const base = this.evalExpr(pattern.object, scope);
        const key = this.memberKey(pattern, scope);
        this.setMember(base, key, value);
        return;
      }
      case 'AssignmentPattern': {
        const given = value === undefined ? this.evalExpr(pattern.right, scope, pattern.left.type === 'Identifier' ? pattern.left.name : '') : value;
        this.bindPattern(pattern.left, given, scope, mode);
        return;
      }
      case 'ArrayPattern': {
        const items = this.iterate(value, value === null || value === undefined ? `${value}` : undefined);
        pattern.elements.forEach((el, i) => {
          if (!el) return;
          if (el.type === 'RestElement') this.bindPattern(el.argument, this.newArray(items.slice(i)), scope, mode);
          else this.bindPattern(el, items[i], scope, mode);
        });
        return;
      }
      case 'ObjectPattern': {
        if (value === null || value === undefined) {
          const first = pattern.properties[0];
          const what = first && first.type === 'Property' && !first.computed && first.key.type === 'Identifier' ? ` property '${first.key.name}'` : '';
          this.throwError('TypeError', `Cannot destructure${what} of '${this.text(pattern)}' as it is ${value}.`);
        }
        const used: string[] = [];
        for (const prop of pattern.properties) {
          if (prop.type === 'RestElement') {
            const rest = this.newObject();
            for (const k of this.ownKeys(value)) if (!used.includes(k)) rest.props.set(k, this.getMember(value, k));
            this.bindPattern(prop.argument, rest, scope, mode);
            continue;
          }
          const key = prop.computed ? this.toKey(this.evalExpr(prop.key, scope)) : prop.key.type === 'Identifier' ? prop.key.name : String((prop.key as { value?: unknown }).value);
          used.push(key);
          this.bindPattern(prop.value, this.getMember(value, key), scope, mode);
        }
        return;
      }
      default:
        this.throwError('SyntaxError', 'Invalid destructuring target');
    }
  }

  // ---- expressions ------------------------------------------------------------------------

  memberKey(node: { computed: boolean; property: Node }, scope: Scope): unknown {
    if (node.computed) return this.evalExpr(node.property, scope);
    const p = node.property;
    return p.type === 'PrivateIdentifier' ? `#${p.name}` : p.type === 'Identifier' ? p.name : undefined;
  }

  evalArgs(nodes: readonly Node[], scope: Scope): unknown[] {
    const out: unknown[] = [];
    for (const arg of nodes) {
      if (arg.type === 'SpreadElement') out.push(...this.iterate(this.evalExpr((arg as unknown as { argument: Node }).argument, scope), this.text((arg as unknown as { argument: Node }).argument)));
      else out.push(this.evalExpr(arg, scope));
      this.checkArray(out.length);
    }
    return out;
  }

  evalExpr(node: Node, scope: Scope, hint = ''): unknown {
    this.mark(node);
    switch (node.type) {
      case 'Literal':
        if (node.regex) return this.unsupported('Regular expressions');
        if (node.bigint !== undefined) return this.unsupported('BigInt');
        return node.value;
      case 'Identifier': return this.lookupVar(node.name, scope);
      case 'TemplateLiteral': {
        let out = node.quasis[0].value.cooked ?? '';
        node.expressions.forEach((e, i) => {
          out += this.toStr(this.evalExpr(e, scope)) + (node.quasis[i + 1].value.cooked ?? '');
          this.checkString(out.length);
        });
        return out;
      }
      case 'ThisExpression': return this.thisValue(scope);
      case 'ArrayExpression': {
        const items: unknown[] = [];
        for (const el of node.elements) {
          if (!el) items.push(undefined);
          else if (el.type === 'SpreadElement') items.push(...this.iterate(this.evalExpr(el.argument, scope), this.text(el.argument)));
          else items.push(this.evalExpr(el, scope));
          this.checkArray(items.length);
        }
        return this.newArray(items);
      }
      case 'ObjectExpression': return this.evalObject(node, scope);
      case 'FunctionExpression': return this.makeFunction(node, scope, node.id?.name ?? hint);
      case 'ArrowFunctionExpression': return this.makeFunction(node, scope, hint);
      case 'ClassExpression': return this.evalClass(node, scope, hint);
      case 'UnaryExpression': return this.evalUnary(node, scope);
      case 'UpdateExpression': {
        const target = node.argument;
        const delta = node.operator === '++' ? 1 : -1;
        if (target.type === 'MemberExpression' && target.object.type !== 'Super') {
          const base = this.evalExpr(target.object, scope);
          const key = this.memberKey(target, scope);
          this.mark(target);
          const before = this.toNum(this.getMember(base, key));
          this.setMember(base, key, before + delta);
          return node.prefix ? before + delta : before;
        }
        const old = this.toNum(this.evalExpr(target, scope));
        this.assignTo(target, old + delta, scope);
        return node.prefix ? old + delta : old;
      }
      case 'BinaryExpression': {
        const left = this.evalExpr(node.left, scope);
        const right = this.evalExpr(node.right, scope);
        this.mark(node);
        return this.binary(node.operator, left, right);
      }
      case 'LogicalExpression': {
        const left = this.evalExpr(node.left, scope);
        if (node.operator === '&&') return this.toBool(left) ? this.evalExpr(node.right, scope) : left;
        if (node.operator === '||') return this.toBool(left) ? left : this.evalExpr(node.right, scope);
        return left === null || left === undefined ? this.evalExpr(node.right, scope) : left;
      }
      case 'ConditionalExpression': return this.evalExpr(this.toBool(this.evalExpr(node.test, scope)) ? node.consequent : node.alternate, scope);
      case 'AssignmentExpression': return this.evalAssign(node, scope);
      case 'SequenceExpression': {
        let last: unknown;
        for (const e of node.expressions) last = this.evalExpr(e, scope);
        return last;
      }
      case 'MemberExpression': {
        if (node.object.type === 'Super') {
          const home = scope.fnContext()?.homeObject;
          return this.getMember(home?.proto ?? undefined, this.memberKey(node, scope), this.thisValue(scope));
        }
        const base = this.evalExpr(node.object, scope);
        if (base === CHAIN_SHORT) return CHAIN_SHORT;
        if (node.optional && (base === null || base === undefined)) return CHAIN_SHORT;
        const key = this.memberKey(node, scope);
        this.mark(node);
        if (base === null || base === undefined) {
          this.throwError('TypeError', `Cannot read properties of ${base} (reading '${this.keyText(key)}')`);
        }
        return this.getMember(base, key);
      }
      case 'ChainExpression': {
        const value = this.evalExpr(node.expression, scope);
        return value === CHAIN_SHORT ? undefined : value;
      }
      case 'CallExpression': return this.evalCall(node, scope);
      case 'NewExpression': {
        const callee = this.evalExpr(node.callee, scope);
        const args = this.evalArgs(node.arguments, scope);
        this.mark(node);
        return this.construct(callee, args, undefined, this.text(node.callee));
      }
      case 'MetaProperty': return scope.fnContext()?.newTarget ?? undefined;
      default:
        return this.unsupported(UNSUPPORTED_NODES[node.type] ?? `The syntax "${node.type}"`);
    }
  }

  evalObject(node: Node & { properties: readonly Node[] }, scope: Scope): JsObject {
    const obj = this.newObject();
    for (const prop of node.properties) {
      if (prop.type === 'SpreadElement') {
        const source = this.evalExpr(prop.argument, scope);
        if (source === null || source === undefined) continue;
        for (const k of this.ownKeys(source)) obj.props.set(k, this.getMember(source, k));
        continue;
      }
      if (prop.type !== 'Property') continue;
      let key: string;
      if (prop.computed) key = this.toKey(this.evalExpr(prop.key, scope));
      else if (prop.key.type === 'Identifier') key = prop.key.name;
      else key = this.toKey((prop.key as { value?: unknown }).value);
      if (prop.kind === 'get' || prop.kind === 'set') {
        const fn = this.makeFunction(prop.value as FunctionNode, scope, key, true, obj);
        const existing = obj.props.get(key);
        const accessor = existing instanceof Accessor ? existing : new Accessor(null, null);
        if (prop.kind === 'get') accessor.get = fn;
        else accessor.set = fn;
        obj.props.set(key, accessor);
      } else if (prop.method) {
        obj.props.set(key, this.makeFunction(prop.value as FunctionNode, scope, key, true, obj));
      } else obj.props.set(key, this.evalExpr(prop.value, scope, key));
    }
    return obj;
  }

  evalUnary(node: Node & { operator: string; argument: Node }, scope: Scope): unknown {
    const op = node.operator;
    if (op === 'typeof') {
      const arg = node.argument;
      if (arg.type === 'Identifier') {
        const binding = scope.find(arg.name);
        if (!binding) return arg.name === 'arguments' && scope.fnContext()?.func ? 'object' : 'undefined';
      }
      return this.typeOf(this.evalExpr(arg, scope));
    }
    if (op === 'delete') {
      const arg = node.argument;
      if (arg.type !== 'MemberExpression') return true;
      const base = this.evalExpr(arg.object, scope);
      return this.deleteMember(base, this.memberKey(arg, scope));
    }
    const value = this.evalExpr(node.argument, scope);
    switch (op) {
      case '-': return -this.toNum(value);
      case '+': return this.toNum(value);
      case '!': return !this.toBool(value);
      case '~': return ~this.toNum(value);
      default: return undefined;
    }
  }

  binary(op: string, l: unknown, r: unknown): unknown {
    switch (op) {
      case '+': return this.add(l, r);
      case '-': return this.toNum(l) - this.toNum(r);
      case '*': return this.toNum(l) * this.toNum(r);
      case '/': return this.toNum(l) / this.toNum(r);
      case '%': return this.toNum(l) % this.toNum(r);
      case '**': return this.toNum(l) ** this.toNum(r);
      case '===': return l === r;
      case '!==': return l !== r;
      case '==': return this.looseEquals(l, r);
      case '!=': return !this.looseEquals(l, r);
      case '<': case '>': case '<=': case '>=': return this.compare(op, l, r);
      case '&': return this.toNum(l) & this.toNum(r);
      case '|': return this.toNum(l) | this.toNum(r);
      case '^': return this.toNum(l) ^ this.toNum(r);
      case '<<': return this.toNum(l) << this.toNum(r);
      case '>>': return this.toNum(l) >> this.toNum(r);
      case '>>>': return this.toNum(l) >>> this.toNum(r);
      case 'in': return this.hasProperty(r, l);
      case 'instanceof': {
        if (!(r instanceof JsFunction)) return this.throwError('TypeError', "Right-hand side of 'instanceof' is not callable");
        if (!(l instanceof JsObject)) return false;
        const proto = r.props.get('prototype');
        for (let o = l.proto; o; o = o.proto) if (o === proto) return true;
        return false;
      }
      default: return this.unsupported(`The operator ${op}`);
    }
  }

  assignTo(target: Node, value: unknown, scope: Scope) {
    if (target.type === 'Identifier') this.assignVar(target.name, value, scope);
    else if (target.type === 'MemberExpression') {
      if (target.object.type === 'Super') return this.setMember(this.thisValue(scope), this.memberKey(target, scope), value);
      const base = this.evalExpr(target.object, scope);
      const key = this.memberKey(target, scope);
      this.mark(target);
      this.setMember(base, key, value);
    } else this.bindPattern(target, value, scope, 'assign');
  }

  evalAssign(node: Node & { operator: string; left: Node; right: Node }, scope: Scope): unknown {
    const { operator: op, left, right } = node;
    if (op === '=') {
      if (left.type === 'MemberExpression' && left.object.type !== 'Super') {
        const base = this.evalExpr(left.object, scope);
        const key = this.memberKey(left, scope);
        const value = this.evalExpr(right, scope);
        this.mark(left);
        this.setMember(base, key, value);
        return value;
      }
      const value = this.evalExpr(right, scope, left.type === 'Identifier' ? left.name : '');
      this.assignTo(left, value, scope);
      return value;
    }
    const logical = op === '||=' || op === '&&=' || op === '??=';
    let base: unknown;
    let key: unknown;
    let current: unknown;
    if (left.type === 'MemberExpression') {
      base = this.evalExpr(left.object, scope);
      key = this.memberKey(left, scope);
      this.mark(left);
      current = this.getMember(base, key);
    } else current = this.evalExpr(left, scope);
    let next: unknown;
    if (logical) {
      const skip = op === '||=' ? this.toBool(current) : op === '&&=' ? !this.toBool(current) : current !== null && current !== undefined;
      if (skip) return current;
      next = this.evalExpr(right, scope, left.type === 'Identifier' ? left.name : '');
    } else next = this.binary(op.slice(0, -1), current, this.evalExpr(right, scope));
    if (left.type === 'MemberExpression') this.setMember(base, key, next);
    else this.assignTo(left, next, scope);
    return next;
  }

  evalCall(node: Node & { callee: Node; arguments: readonly Node[]; optional: boolean }, scope: Scope): unknown {
    const callee = node.callee;
    let fn: unknown;
    let self: unknown;
    if (callee.type === 'Super') {
      const ctx = scope.fnContext();
      const cls = ctx?.func;
      if (!ctx || !cls || !cls.parentClass) return this.throwError('SyntaxError', "'super' keyword unexpected here");
      if (ctx.thisValue !== UNINIT) return this.throwError('ReferenceError', 'Super constructor may only be called once');
      const args = this.evalArgs(node.arguments, scope);
      this.mark(node);
      const instance = this.construct(cls.parentClass, args, ctx.newTarget ?? cls);
      ctx.thisValue = instance;
      if (isObject(instance)) this.initFields(cls, instance);
      return undefined;
    }
    if (callee.type === 'MemberExpression') {
      if (callee.object.type === 'Super') {
        self = this.thisValue(scope);
        fn = this.getMember(scope.fnContext()?.homeObject?.proto ?? undefined, this.memberKey(callee, scope), self);
      } else {
        self = this.evalExpr(callee.object, scope);
        if (self === CHAIN_SHORT) return CHAIN_SHORT;
        if (callee.optional && (self === null || self === undefined)) return CHAIN_SHORT;
        const key = this.memberKey(callee, scope);
        this.mark(callee);
        if (self === null || self === undefined) this.throwError('TypeError', `Cannot read properties of ${self} (reading '${this.keyText(key)}')`);
        fn = this.getMember(self, key);
      }
    } else {
      fn = this.evalExpr(callee, scope);
      if (fn === CHAIN_SHORT) return CHAIN_SHORT;
    }
    if (node.optional && (fn === null || fn === undefined)) return CHAIN_SHORT;
    const args = this.evalArgs(node.arguments, scope);
    this.mark(node);
    return this.callFunction(fn, self, args, this.text(callee));
  }

  /** Keys for `for...in`: own enumerable keys, then inherited ones, each name once. */
  forInKeys(value: unknown): string[] {
    if (value === null || value === undefined) return [];
    const seen = new Set<string>();
    const keys: string[] = [];
    for (let o: unknown = value; o; o = o instanceof JsObject ? o.proto : null) {
      for (const k of this.ownKeys(o)) {
        if (!seen.has(k)) {
          seen.add(k);
          keys.push(k);
        }
      }
      if (typeof o === 'string') break;
    }
    this.charge(keys.length);
    return keys;
  }
}
