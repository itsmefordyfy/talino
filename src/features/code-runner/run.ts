import { deepEqual, fromHost, toHost } from './convert';
import { Interpreter } from './interpreter';
import { defaultRunnerText, type RunnerText } from './strings';
import type { CodeTests, RunError, RunLimits, RunResult, TestReport } from './types';
import { FatalError, JsFunction, JsObject, ThrowSignal } from './values';

const MAX_SOURCE_CHARS = 100_000;

/** Human-readable list of what the playground understands, for its help text. */
export const SUPPORTED_JS: readonly string[] = [
  'let, const and var; numbers, strings, booleans, null and undefined; template literals',
  'All arithmetic, comparison, logical and bitwise operators, ??, ?., ternary, ++ and --, compound assignment',
  'if / else, switch, for, while, do...while, for...of, for...in, break, continue and labels',
  'Functions: declarations, expressions, arrows, closures, recursion, default and rest parameters',
  'Destructuring of arrays and objects, and spread in calls, arrays and objects',
  'Classes: constructor, methods, getters and setters, static members, fields, extends and super',
  'try / catch / finally, throw, and Error, TypeError, RangeError, ReferenceError, SyntaxError',
  'Arrays: push, pop, shift, unshift, slice, splice, indexOf, includes, join, map, filter, reduce, forEach, find, findIndex, some, every, sort, reverse, concat, flat, fill, at, Array.isArray, Array.from',
  'Strings: length, indexing, toUpperCase, toLowerCase, trim, split, slice, substring, includes, startsWith, endsWith, indexOf, replace, replaceAll (plain text), repeat, padStart, padEnd, charAt, at',
  'Math, Number, parseInt, parseFloat, isNaN, String(), Boolean(), JSON.stringify and JSON.parse',
  'Object.keys, Object.values, Object.entries, Object.assign, Object.freeze, Object.fromEntries, Map and Set',
  'console.log, console.error, console.warn and console.info',
  "Not supported yet: async/await, Promise, timers, import/export, require, eval, generators, regular expressions, Date, Symbol, and browser or Node objects (window, process, fetch)",
];

type Loaded = { interpreter: Interpreter | null; error: RunError | null };

/** Parses and runs a program; the interpreter (when it got that far) is kept so callers can call into it. */
function load(source: string, limits?: RunLimits, text: RunnerText = defaultRunnerText): Loaded {
  let interpreter: Interpreter | null = null;
  try {
    if (typeof source !== 'string') return { interpreter, error: { name: 'TypeError', message: text.codeMustBeText, line: null, column: null } };
    if (source.length > MAX_SOURCE_CHARS) return { interpreter, error: { name: 'Error', message: text.programTooLong, line: null, column: null } };
    const program = Interpreter.parseProgram(source, text);
    interpreter = new Interpreter(source, limits, text);
    interpreter.runProgram(program);
    return { interpreter, error: null };
  } catch (error) {
    return { interpreter, error: describeError(interpreter, error, text) };
  }
}

function describeError(interpreter: Interpreter | null, error: unknown, text: RunnerText = defaultRunnerText): RunError {
  if (error instanceof FatalError) return { name: error.name, message: error.message, line: error.line, column: error.column };
  if (error instanceof ThrowSignal && interpreter) {
    const value = error.value;
    try {
      if (value instanceof JsObject && value.className === 'Error') {
        return { name: interpreter.toStr(interpreter.getMember(value, 'name')), message: interpreter.toStr(interpreter.getMember(value, 'message')), line: error.line, column: error.column };
      }
      return { name: 'Uncaught', message: typeof value === 'string' ? value : interpreter.inspect(value), line: error.line, column: error.column };
    } catch {
      return { name: 'Error', message: text.threwError, line: error.line, column: error.column };
    }
  }
  if (error instanceof RangeError) {
    return { name: 'RangeError', message: 'Maximum call stack size exceeded', line: interpreter?.line ?? null, column: interpreter?.col ?? null };
  }
  const detail = error instanceof Error ? error.message : String(error);
  return { name: 'InternalError', message: text.cannotRun(detail), line: interpreter?.line ?? null, column: interpreter?.col ?? null };
}

function safeReturned(interpreter: Interpreter | null): unknown {
  if (!interpreter) return undefined;
  try {
    return toHost(interpreter, interpreter.lastValue);
  } catch {
    return undefined;
  }
}

/** Runs a JavaScript program in the sandbox. Never throws. `text` is the language of the sandbox's own messages (English by default). */
export function runJs(source: string, limits?: RunLimits, text: RunnerText = defaultRunnerText): RunResult {
  const { interpreter, error } = load(source, limits, text);
  return {
    ok: error === null,
    output: interpreter ? interpreter.output.slice() : [],
    error,
    steps: interpreter?.steps ?? 0,
    returned: error ? undefined : safeReturned(interpreter),
  };
}

function emptyReport(total: number, error: RunError | null, output: string[]): TestReport {
  return { passed: 0, total, fraction: 0, results: [], error, output };
}

/**
 * Grades a solution. `function` tests define the code, then call the named function once per case
 * (each case has its own step budget, and a hidden case reports no expected or actual value);
 * `output` tests compare the console.log lines.
 */
export function runCodeTests(source: string, tests: CodeTests, limits?: RunLimits, text: RunnerText = defaultRunnerText): TestReport {
  try {
    const { interpreter, error } = load(source, limits, text);
    const output = interpreter ? interpreter.output : [];
    return tests.kind === 'output' ? gradeOutput(tests.expected, output, error, text) : gradeFunction(tests, interpreter, error, output, text);
  } catch (error) {
    return emptyReport(0, describeError(null, error, text), []);
  }
}

function gradeOutput(expected: string[], output: string[], error: RunError | null, text: RunnerText): TestReport {
  const lines = (list: string[]) => list.flatMap((entry) => entry.split('\n'));
  const want = expected;
  const got = lines(output).length === output.length ? output : lines(output);
  const total = Math.max(want.length, got.length);
  const results: TestReport['results'] = [];
  let passed = 0;
  for (let i = 0; i < total; i++) {
    const pass = i < want.length && i < got.length && want[i].trimEnd() === got[i].trimEnd();
    if (pass) passed++;
    results.push({ label: text.lineLabel(i + 1), pass, expected: i < want.length ? want[i] : undefined, actual: i < got.length ? got[i] : undefined, error: null, hidden: false });
  }
  return { passed, total, fraction: total === 0 ? (error ? 0 : 1) : passed / total, results, error, output };
}

function gradeFunction(tests: Extract<CodeTests, { kind: 'function' }>, interpreter: Interpreter | null, loadError: RunError | null, output: string[], text: RunnerText): TestReport {
  const total = tests.cases.length;
  const fail = (error: RunError): TestReport => ({
    passed: 0,
    total,
    fraction: 0,
    results: tests.cases.map((c, i) => ({ label: caseLabel(c, i, text), pass: false, expected: c.hidden ? undefined : c.expected, actual: undefined, error: error.message, hidden: Boolean(c.hidden) })),
    error,
    output,
  });
  if (loadError || !interpreter) return fail(loadError ?? { name: 'Error', message: text.couldNotRunCode, line: null, column: null });
  const fn = interpreter.topLevel(tests.fn);
  if (!(fn instanceof JsFunction)) {
    return fail({ name: 'Error', message: text.needsFunction(tests.fn), line: null, column: null });
  }
  const results: TestReport['results'] = [];
  let passed = 0;
  tests.cases.forEach((c, i) => {
    interpreter.steps = 0;
    interpreter.depth = 0;
    let actual: unknown;
    let error: string | null = null;
    try {
      const args = (c.args ?? []).map((a) => fromHost(interpreter, a));
      actual = toHost(interpreter, interpreter.callFunction(fn, undefined, args));
    } catch (e) {
      const d = describeError(interpreter, e, text);
      error = d.name === 'Error' || d.name === 'Unsupported' ? d.message : `${d.name}: ${d.message}`;
    }
    const pass = error === null && deepEqual(actual, c.expected);
    if (pass) passed++;
    results.push({ label: caseLabel(c, i, text), pass, expected: c.hidden ? undefined : c.expected, actual: c.hidden ? undefined : actual, error, hidden: Boolean(c.hidden) });
  });
  return { passed, total, fraction: total === 0 ? 1 : passed / total, results, error: null, output: interpreter.output };
}

function caseLabel(c: { label?: string; hidden?: boolean }, index: number, text: RunnerText): string {
  return c.label ?? (c.hidden ? text.hiddenTestLabel(index + 1) : text.testLabel(index + 1));
}
