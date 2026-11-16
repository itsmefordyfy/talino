import { fundamentalsStrings } from './strings';

export type Var = { name: string; value: string };
export type ScopeKind = 'global' | 'function' | 'block';
export type Scope = { kind: ScopeKind; label: string; vars: Var[] };
export type Frame = { name: string; scopes: Scope[] };

export type ScopeStep = {
  /** 1-based line of the source being run. */
  line: number;
  /** The call stack, bottom (global) first. */
  frames: Frame[];
  output: string[];
  error: string | null;
  /** The variable just read or written and the scope it lives in. */
  focus: { name: string; scope: string } | null;
  caption: string;
};

export type ScopeProgramId = 'function' | 'shadowing' | 'block';
export const SCOPE_PROGRAMS: readonly ScopeProgramId[] = ['function', 'shadowing', 'block'];

export const SCOPE_SOURCE: Record<ScopeProgramId, string[]> = {
  function: ['let g = 10;', 'function f(x) {', '  let y = x + g;', '  if (y > 12) {', '    let z = y * 2;', '    return z;', '  }', '  return y;', '}', 'let r = f(ARG);', 'console.log(r);'],
  shadowing: ['let n = 1;', 'function show() {', '  let n = 2;', '  {', '    let n = 3;', '    console.log(n);', '  }', '  console.log(n);', '}', 'show();', 'console.log(n);'],
  block: ['let total = 0;', 'if (true) {', '  let bonus = 5;', '  total = total + bonus;', '}', 'console.log(total);', 'console.log(bonus);'],
};

/** The scopes the running code can see, innermost first: its own, then the global scope (where the function was written), never the caller's. */
function scopeChain(frames: readonly Frame[]): Scope[] {
  const top = frames[frames.length - 1];
  const global = frames[0];
  if (!top || !global) return [];
  return [...[...top.scopes].reverse(), ...(top === global ? [] : [...global.scopes].reverse())];
}

/** Where a name is found by lexical scoping, and the scopes tried in order. */
export function lookup(frames: readonly Frame[], name: string): { found: { scope: string; value: string } | null; tried: string[] } {
  const tried: string[] = [];
  for (const scope of scopeChain(frames)) {
    tried.push(scope.label);
    const hit = scope.vars.find((variable) => variable.name === name);
    if (hit) return { found: { scope: scope.label, value: hit.value }, tried };
  }
  return { found: null, tried };
}

export type VisibleScope = { label: string; vars: (Var & { shadowed: boolean })[] };

/** The scope chain, innermost first; a variable hidden by an inner one of the same name is marked shadowed. */
export function visibleScopes(frames: readonly Frame[]): VisibleScope[] {
  const seen = new Set<string>();
  return scopeChain(frames).map((scope) => {
    const vars = scope.vars.map((variable) => ({ ...variable, shadowed: seen.has(variable.name) }));
    scope.vars.forEach((variable) => seen.add(variable.name));
    return { label: scope.label, vars };
  });
}

const clone = (frames: readonly Frame[]): Frame[] => frames.map((frame) => ({ name: frame.name, scopes: frame.scopes.map((scope) => ({ ...scope, vars: scope.vars.map((variable) => ({ ...variable })) })) }));

/** The program run one line at a time. `arg` is the value passed to `f` in the function program. */
export function buildScopeSteps(program: ScopeProgramId, arg = 5, t = fundamentalsStrings.en.scope): ScopeStep[] {
  const frames: Frame[] = [{ name: 'global', scopes: [{ kind: 'global', label: t.globalScope, vars: [] }] }];
  const output: string[] = [];
  const steps: ScopeStep[] = [];
  const top = () => frames[frames.length - 1]!;
  const inner = () => top().scopes[top().scopes.length - 1]!;
  const push = (line: number, caption: string, extra: Partial<Pick<ScopeStep, 'focus' | 'error'>> = {}) => steps.push({ line, frames: clone(frames), output: [...output], error: extra.error ?? null, focus: extra.focus ?? null, caption });
  const declare = (line: number, name: string, value: string, caption?: string) => {
    inner().vars.push({ name, value });
    push(line, caption ?? t.declare(name, value, inner().label), { focus: { name, scope: inner().label } });
  };
  const read = (name: string) => lookup(frames, name);
  const callFrame = (line: number, name: string, params: Var[]) => {
    frames.push({ name, scopes: [{ kind: 'function', label: t.functionScope(name), vars: params }] });
    push(line, t.call(name, params.map((param) => `${param.name} = ${param.value}`).join(', ')));
  };
  const log = (line: number, name: string) => {
    const hit = read(name);
    if (!hit.found) {
      push(line, t.notDefined(name, hit.tried), { error: `ReferenceError: ${name} is not defined` });
      return;
    }
    output.push(hit.found.value);
    push(line, t.log(name, hit.found.value, hit.found.scope, hit.tried.length), { focus: { name, scope: hit.found.scope } });
  };

  if (program === 'function') {
    declare(1, 'g', '10');
    declare(2, 'f', 'function', t.defineFunction('f'));
    callFrame(10, 'f', [{ name: 'x', value: String(arg) }]);
    const x = read('x');
    const g = read('g');
    const y = arg + 10;
    push(3, t.readTwo('x', x.found?.scope ?? '', 'g', g.found?.scope ?? '', t.globalFallback), { focus: { name: 'g', scope: g.found?.scope ?? '' } });
    declare(3, 'y', String(y));
    const big = y > 12;
    push(4, t.condition(`y > 12 (y is ${y})`, big), { focus: { name: 'y', scope: inner().label } });
    let result = y;
    if (big) {
      top().scopes.push({ kind: 'block', label: t.blockScope, vars: [] });
      push(4, t.enterBlock);
      result = y * 2;
      declare(5, 'z', String(result));
      push(6, t.returnValue('z', String(result), t.blockGone), { focus: { name: 'z', scope: inner().label } });
    } else {
      push(8, t.returnValue('y', String(result), t.skippedBlock));
    }
    frames.pop();
    push(10, t.afterReturn('f', String(result)));
    declare(10, 'r', String(result));
    log(11, 'r');
  } else if (program === 'shadowing') {
    declare(1, 'n', '1');
    declare(2, 'show', 'function', t.defineFunction('show'));
    callFrame(10, 'show', []);
    declare(3, 'n', '2', t.declareShadow('n', '2', t.functionScope('show')));
    top().scopes.push({ kind: 'block', label: t.blockScope, vars: [] });
    push(4, t.enterBlock);
    declare(5, 'n', '3', t.declareShadow('n', '3', t.blockScope));
    log(6, 'n');
    top().scopes.pop();
    push(7, t.exitBlock('n'));
    log(8, 'n');
    frames.pop();
    push(10, t.afterReturnNothing('show'));
    log(11, 'n');
  } else {
    declare(1, 'total', '0');
    push(2, t.condition('true', true));
    top().scopes.push({ kind: 'block', label: t.blockScope, vars: [] });
    push(2, t.enterBlock);
    declare(3, 'bonus', '5');
    const total = read('total');
    frames[0]!.scopes[0]!.vars.find((variable) => variable.name === 'total')!.value = '5';
    push(4, t.assignOuter('total', '5', total.found?.scope ?? ''), { focus: { name: 'total', scope: total.found?.scope ?? '' } });
    top().scopes.pop();
    push(5, t.exitBlock('bonus'));
    log(6, 'total');
    log(7, 'bonus');
  }
  return steps;
}
