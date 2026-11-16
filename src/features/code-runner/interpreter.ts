/** Statements, scopes and the program entry point. Expressions are in `Evaluator`. */
import { parse, type AnyNode, type Program, type Statement } from 'acorn';

import { installBuiltins } from './builtins';
import { CHAIN_SHORT, Evaluator, type Completion } from './evaluator';
import { collectVarNames, patternNames } from './hoist';
import type { RunLimits } from './types';
import { Scope } from './scope';
import { defaultRunnerText, type RunnerText } from './strings';
import { FatalError, ThrowSignal } from './values';

type Node = AnyNode;
const BREAK: Completion = { type: 'break', label: null };
const CONTINUE: Completion = { type: 'continue', label: null };
const NONE = Symbol('none');

export class Interpreter extends Evaluator {
  private lexicalCache = new WeakMap<object, boolean>();

  constructor(source: string, limits?: RunLimits, text: RunnerText = defaultRunnerText) {
    super(limits, text);
    this.source = source;
    for (const [name, value] of installBuiltins(this)) this.globalScope.declare(name, 'var', value);
  }

  /** Parses `source`; a syntax error becomes a SyntaxError that ends the run, with its line. */
  static parseProgram(source: string, text: RunnerText = defaultRunnerText): Program {
    try {
      return parse(source, { ecmaVersion: 2022, sourceType: 'script', locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true });
    } catch (error) {
      if (error instanceof SyntaxError) {
        const loc = (error as SyntaxError & { loc?: { line: number; column: number } }).loc;
        const message = error.message.replace(/\s*\(\d+:\d+\)$/, '');
        if (/'import' and 'export' may appear only/.test(message)) {
          throw new FatalError('Unsupported', text.importExport, loc?.line ?? null, loc ? loc.column + 1 : null);
        }
        throw new FatalError('SyntaxError', message, loc?.line ?? null, loc ? loc.column + 1 : null);
      }
      if (error instanceof RangeError) throw new FatalError('SyntaxError', text.nestedTooDeep, null, null);
      throw error;
    }
  }

  programScope = new Scope(this.globalScope);

  /** Runs a whole program in `programScope`; top-level declarations stay there for later calls. */
  runProgram(program: Program) {
    const first = program.body[0];
    this.strict = first?.type === 'ExpressionStatement' && first.directive === 'use strict';
    this.hoist(program.body, this.programScope, true);
    this.runBody(program.body, this.programScope);
  }

  /** The value a top-level name holds (`undefined` when there is none). */
  topLevel(name: string): unknown {
    return this.programScope.vars.get(name)?.value;
  }

  // ---- declarations -----------------------------------------------------------------------

  hoist(statements: readonly Node[], scope: Scope, functionLevel: boolean) {
    if (functionLevel) {
      const names: string[] = [];
      collectVarNames(statements as readonly Statement[], names);
      for (const name of names) if (!scope.vars.has(name)) scope.declare(name, 'var', undefined);
    }
    for (const s of statements) {
      if (s.type === 'FunctionDeclaration' && s.id) scope.declare(s.id.name, 'var', this.makeFunction(s, scope, s.id.name));
      else if (s.type === 'ClassDeclaration' && s.id) scope.declare(s.id.name, 'let', undefined, false);
      else if (s.type === 'VariableDeclaration' && s.kind !== 'var') {
        const names: string[] = [];
        for (const d of s.declarations) patternNames(d.id, names);
        for (const name of names) scope.declare(name, s.kind === 'const' ? 'const' : 'let', undefined, false);
      }
    }
  }

  private hasLexical(statements: readonly Node[]): boolean {
    const cached = this.lexicalCache.get(statements);
    if (cached !== undefined) return cached;
    const result = statements.some((s) => s.type === 'FunctionDeclaration' || s.type === 'ClassDeclaration' || (s.type === 'VariableDeclaration' && s.kind !== 'var'));
    this.lexicalCache.set(statements, result);
    return result;
  }

  runBody(statements: readonly Node[], scope: Scope): Completion | undefined {
    for (const s of statements) {
      const done = this.exec(s, scope);
      if (done) return done;
    }
    return undefined;
  }

  private block(statements: readonly Node[], scope: Scope): Completion | undefined {
    if (!this.hasLexical(statements)) return this.runBody(statements, scope);
    const inner = new Scope(scope);
    this.hoist(statements, inner, false);
    return this.runBody(statements, inner);
  }

  // ---- statements -------------------------------------------------------------------------

  /** How a loop reacts to a completion from its body: keep going, stop, or hand it up. */
  private control(done: Completion, labels: readonly string[]): 'next' | 'stop' | 'up' {
    if (done.type === 'return') return 'up';
    if (done.label !== null && !labels.includes(done.label)) return 'up';
    return done.type === 'break' ? 'stop' : 'next';
  }

  exec(node: Node, scope: Scope, labels: readonly string[] = []): Completion | undefined {
    this.mark(node);
    this.tick();
    switch (node.type) {
      case 'ExpressionStatement': {
        const value = this.evalExpr(node.expression, scope);
        if (this.depth === 0) this.lastValue = value === CHAIN_SHORT ? undefined : value;
        return undefined;
      }
      case 'VariableDeclaration': {
        for (const d of node.declarations) {
          if (node.kind === 'var' && !d.init) continue;
          const name = d.id.type === 'Identifier' ? d.id.name : '';
          const value = d.init ? this.evalExpr(d.init, scope, name) : undefined;
          this.bindPattern(d.id, value, scope, node.kind === 'var' ? 'var' : node.kind === 'const' ? 'const' : 'let');
        }
        return undefined;
      }
      case 'FunctionDeclaration':
      case 'EmptyStatement':
      case 'DebuggerStatement':
        return undefined;
      case 'ClassDeclaration': {
        const name = node.id?.name ?? '';
        this.initBinding(name, 'let', this.evalClass(node, scope, name), scope);
        return undefined;
      }
      case 'ReturnStatement': return { type: 'return', value: node.argument ? this.evalExpr(node.argument, scope) : undefined };
      case 'BreakStatement': return node.label ? { type: 'break', label: node.label.name } : BREAK;
      case 'ContinueStatement': return node.label ? { type: 'continue', label: node.label.name } : CONTINUE;
      case 'BlockStatement': return this.consumeLabel(this.block(node.body, scope), labels);
      case 'IfStatement': {
        if (this.toBool(this.evalExpr(node.test, scope))) return this.exec(node.consequent, scope);
        return node.alternate ? this.exec(node.alternate, scope) : undefined;
      }
      case 'ThrowStatement': {
        const value = this.evalExpr(node.argument, scope);
        this.mark(node);
        throw new ThrowSignal(value, this.line, this.col);
      }
      case 'TryStatement': return this.execTry(node, scope);
      case 'LabeledStatement': {
        const done = this.exec(node.body, scope, [...labels, node.label.name]);
        return this.consumeLabel(done, [node.label.name]);
      }
      case 'WhileStatement': return this.execWhile(node, scope, labels);
      case 'DoWhileStatement': return this.execDoWhile(node, scope, labels);
      case 'ForStatement': return this.execFor(node, scope, labels);
      case 'ForOfStatement': return this.execForEach(node, scope, labels, false);
      case 'ForInStatement': return this.execForEach(node, scope, labels, true);
      case 'SwitchStatement': return this.execSwitch(node, scope, labels);
      default:
        return this.unsupported(node.type === 'WithStatement' ? 'The with statement' : node.type.startsWith('Import') || node.type.startsWith('Export') ? 'Importing and exporting' : `The syntax "${node.type}"`);
    }
  }

  private consumeLabel(done: Completion | undefined, labels: readonly string[]) {
    if (done && done.type === 'break' && done.label !== null && labels.includes(done.label)) return undefined;
    return done;
  }

  private execWhile(node: Node & { test: Node; body: Node }, scope: Scope, labels: readonly string[]) {
    while (this.toBool(this.evalExpr(node.test, scope))) {
      this.tick();
      const done = this.exec(node.body, scope);
      if (!done) continue;
      const c = this.control(done, labels);
      if (c === 'stop') break;
      if (c === 'up') return done;
    }
    return undefined;
  }

  private execDoWhile(node: Node & { test: Node; body: Node }, scope: Scope, labels: readonly string[]) {
    do {
      this.tick();
      const done = this.exec(node.body, scope);
      if (!done) continue;
      const c = this.control(done, labels);
      if (c === 'stop') break;
      if (c === 'up') return done;
    } while (this.toBool(this.evalExpr(node.test, scope)));
    return undefined;
  }

  private execFor(node: Node & { init?: Node | null; test?: Node | null; update?: Node | null; body: Node }, scope: Scope, labels: readonly string[]) {
    const init = node.init;
    const perIteration = init?.type === 'VariableDeclaration' && init.kind === 'let';
    let iter = new Scope(scope);
    if (init) {
      if (init.type === 'VariableDeclaration') {
        this.hoist([init], iter, false);
        this.exec(init, iter);
      } else this.evalExpr(init, iter);
    }
    const copy = (from: Scope) => {
      const next = new Scope(scope);
      for (const [name, b] of from.vars) next.vars.set(name, { ...b });
      return next;
    };
    for (;;) {
      this.tick();
      if (node.test && !this.toBool(this.evalExpr(node.test, iter))) break;
      const done = this.exec(node.body, iter);
      if (done) {
        const c = this.control(done, labels);
        if (c === 'stop') break;
        if (c === 'up') return done;
      }
      // A fresh copy per turn gives each closure its own `let` variable, as in JavaScript.
      if (perIteration) iter = copy(iter);
      if (node.update) this.evalExpr(node.update, iter);
    }
    return undefined;
  }

  private execForEach(node: Node & { left: Node; right: Node; body: Node }, scope: Scope, labels: readonly string[], isIn: boolean) {
    const subject = this.evalExpr(node.right, scope);
    const items = isIn ? this.forInKeys(subject) : this.iterate(subject, this.text(node.right));
    const left = node.left;
    for (const item of items) {
      this.tick();
      const iter = new Scope(scope);
      if (left.type === 'VariableDeclaration') {
        const kind = left.kind === 'var' ? 'var' : left.kind === 'const' ? 'const' : 'let';
        this.hoist([left], iter, false);
        this.bindPattern(left.declarations[0].id, item, iter, kind);
      } else this.bindPattern(left, item, iter, 'assign');
      const done = this.exec(node.body, iter);
      if (!done) continue;
      const c = this.control(done, labels);
      if (c === 'stop') break;
      if (c === 'up') return done;
    }
    return undefined;
  }

  private execSwitch(node: Node & { discriminant: Node; cases: readonly { test?: Node | null; consequent: readonly Node[] }[] }, scope: Scope, labels: readonly string[]) {
    const value = this.evalExpr(node.discriminant, scope);
    const inner = new Scope(scope);
    this.hoist(node.cases.flatMap((c) => c.consequent), inner, false);
    let start = node.cases.findIndex((c) => c.test && this.evalExpr(c.test, inner) === value);
    if (start === -1) start = node.cases.findIndex((c) => !c.test);
    if (start === -1) return undefined;
    for (let i = start; i < node.cases.length; i++) {
      const done = this.runBody(node.cases[i].consequent, inner);
      if (!done) continue;
      if (done.type === 'break' && (done.label === null || labels.includes(done.label))) return undefined;
      return done;
    }
    return undefined;
  }

  /** Turns what the host threw into something a `catch` can see, or lets it through untouched. */
  private asThrow(error: unknown): ThrowSignal {
    if (error instanceof ThrowSignal) return error;
    // The host ran out of stack on deeply nested code: that is a JavaScript RangeError too.
    if (error instanceof RangeError) return new ThrowSignal(this.makeError('RangeError', 'Maximum call stack size exceeded'), this.line, this.col);
    throw error;
  }

  private execTry(node: Node & { block: Node; handler?: { param?: Node | null; body: Node } | null; finalizer?: Node | null }, scope: Scope) {
    let done: Completion | undefined;
    let pending: unknown = NONE;
    try {
      done = this.exec(node.block, scope);
    } catch (error) {
      if (node.handler) {
        const signal = this.asThrow(error);
        const handler = node.handler;
        try {
          const inner = new Scope(scope);
          if (handler.param) {
            this.bindPattern(handler.param, signal.value, inner, 'let');
          }
          done = this.exec(handler.body, inner);
        } catch (second) {
          pending = second;
        }
      } else pending = error;
    }
    if (node.finalizer) {
      if (pending instanceof FatalError) throw pending;
      const override = this.exec(node.finalizer, scope);
      if (override) return override;
    }
    if (pending !== NONE) throw pending;
    return done;
  }
}
