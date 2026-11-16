/**
 * A small, exact model of how arithmetic, text and comparison operators behave in JavaScript and in Python,
 * so the learner sees the real results (`'5' + 3`, `0.1 + 0.2`, `7 / 2` against `7 // 2`, `-7 % 3`).
 * Python error messages are paraphrased lightly; the rules are the languages' own. No code is ever evaluated.
 */

export type Language = 'javascript' | 'python';
export type Operator = '+' | '-' | '*' | '/' | '//' | '%' | '**' | '==' | '===' | '<';

export const OPERATORS: Record<Language, readonly Operator[]> = {
  javascript: ['+', '-', '*', '/', '%', '**', '==', '===', '<'],
  python: ['+', '-', '*', '/', '//', '%', '**', '==', '<'],
};

/** An operand: JavaScript numbers are all `float`; Python separates `int` (exact, unbounded) from `float`. */
export type Operand = { kind: 'int'; value: bigint } | { kind: 'float'; value: number } | { kind: 'str'; value: string } | { kind: 'bool'; value: boolean };

export type NoteKey = 'jsConcat' | 'jsCoerce' | 'jsLooseEquality' | 'floatRounding' | 'pyFloorDivision' | 'pyTrueDivision' | 'pyModSign' | 'jsRemainderSign' | 'pyNoMixing' | 'pyRepeat' | 'divideByZero' | 'jsNotAnOperator' | 'pyBoolIsInt' | 'intFloat';

export type Evaluation =
  | { ok: true; display: string; type: string; note: NoteKey | null }
  | { ok: false; reason: 'operand'; side: 'left' | 'right' }
  | { ok: false; reason: 'error'; error: string; note: NoteKey | null };

/** Reads what the learner typed: a number, true/false, or text in quotes. Null means "not a value". */
export function parseOperand(raw: string, language: Language): Operand | null {
  const text = raw.trim();
  if (/^[-+]?\d+$/.test(text)) return language === 'python' ? { kind: 'int', value: BigInt(text) } : { kind: 'float', value: Number(text) };
  if (/^[-+]?(\d+\.\d*|\.\d+)(e[-+]?\d+)?$/i.test(text)) return { kind: 'float', value: Number(text) };
  if (/^(true|false)$/i.test(text)) return { kind: 'bool', value: text.toLowerCase() === 'true' };
  const quoted = /^(['"])(.*)\1$/s.exec(text);
  if (quoted) return { kind: 'str', value: quoted[2] ?? '' };
  return null;
}

const toFloat = (operand: Operand): number => {
  switch (operand.kind) {
    case 'int':
      return Number(operand.value);
    case 'bool':
      return operand.value ? 1 : 0;
    case 'float':
      return operand.value;
    case 'str':
      return operand.value.trim() === '' ? 0 : Number(operand.value);
  }
};

/** Python's repr of a float: always shows a point, and switches to exponent form for very large or small values. */
export function pythonFloat(value: number): string {
  if (Number.isNaN(value)) return 'nan';
  if (!Number.isFinite(value)) return value < 0 ? '-inf' : 'inf';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1e16 || abs < 1e-4)) return value.toExponential().replace(/e([+-])(\d)$/, 'e$10$2');
  const text = String(value);
  return /[.e]/.test(text) ? text : `${text}.0`;
}

const shortBig = (value: bigint): string => {
  const text = value.toString();
  const digits = text.replace('-', '').length;
  return digits <= 40 ? text : `${text.slice(0, 12)}… (${digits} digits)`;
};

const quote = (text: string) => `'${text}'`;
const clip = (text: string) => (text.length > 60 ? `${text.slice(0, 60)}…` : text);

type Result = { value: Operand | 'complex'; note?: NoteKey } | { error: string; note?: NoteKey };

const jsType = (operand: Operand) => (operand.kind === 'str' ? 'string' : operand.kind === 'bool' ? 'boolean' : 'number');
const pyType = (operand: Operand) => (operand.kind === 'str' ? 'str' : operand.kind);

function jsString(operand: Operand): string {
  if (operand.kind === 'str') return operand.value;
  if (operand.kind === 'bool') return String(operand.value);
  return String(operand.kind === 'int' ? Number(operand.value) : operand.value);
}

const bool = (value: boolean, note?: NoteKey): Result => ({ value: { kind: 'bool', value }, note });
const flt = (value: number, note?: NoteKey): Result => ({ value: { kind: 'float', value }, note });
const int = (value: bigint, note?: NoteKey): Result => ({ value: { kind: 'int', value }, note });

function looseSame(a: Operand, b: Operand): boolean {
  if (a.kind === 'str' && b.kind === 'str') return a.value === b.value;
  if (a.kind === 'bool' && b.kind === 'bool') return a.value === b.value;
  return toFloat(a) === toFloat(b);
}

function evaluateJs(a: Operand, op: Operator, b: Operand): Result {
  switch (op) {
    case '+': {
      if (a.kind === 'str' || b.kind === 'str') return { value: { kind: 'str', value: jsString(a) + jsString(b) }, note: 'jsConcat' };
      const sum = toFloat(a) + toFloat(b);
      return flt(sum, Number.isInteger(sum) ? undefined : 'floatRounding');
    }
    case '-':
    case '*':
    case '/':
    case '%':
    case '**': {
      const x = toFloat(a);
      const y = toFloat(b);
      const value = op === '-' ? x - y : op === '*' ? x * y : op === '/' ? x / y : op === '%' ? x % y : x ** y;
      if (op === '/' && y === 0) return flt(value, 'divideByZero');
      if (op === '%' && x < 0 && y > 0) return flt(value, 'jsRemainderSign');
      if (a.kind === 'str' || b.kind === 'str') return flt(value, 'jsCoerce');
      return flt(value, !Number.isInteger(value) && Number.isFinite(value) && op !== '/' ? 'floatRounding' : undefined);
    }
    case '==':
      return bool(a.kind === b.kind ? looseSame(a, b) : toFloat(a) === toFloat(b), a.kind !== b.kind ? 'jsLooseEquality' : undefined);
    case '===':
      return bool(a.kind === b.kind && looseSame(a, b));
    case '<':
      return bool(a.kind === 'str' && b.kind === 'str' ? a.value < b.value : toFloat(a) < toFloat(b));
    case '//':
      return { error: 'SyntaxError: `//` starts a comment in JavaScript, it is not an operator', note: 'jsNotAnOperator' };
  }
}

type IntLike = { kind: 'int'; value: bigint } | { kind: 'bool'; value: boolean };
const isIntLike = (operand: Operand): operand is IntLike => operand.kind === 'int' || operand.kind === 'bool';
const toBig = (operand: IntLike): bigint => (operand.kind === 'int' ? operand.value : operand.value ? 1n : 0n);
const isNumeric = (operand: Operand) => operand.kind !== 'str';

/** CPython's float floor division and modulo, which differ from `Math.floor(a / b)` and JavaScript's `%`. */
function floatFloorMod(x: number, y: number): { div: number; mod: number } {
  let mod = x % y;
  let div = (x - mod) / y;
  if (mod !== 0) {
    if (y < 0 !== mod < 0) {
      mod += y;
      div -= 1;
    }
  } else {
    mod = y < 0 ? -0 : 0;
  }
  let floored: number;
  if (div !== 0) {
    floored = Math.floor(div);
    if (div - floored > 0.5) floored += 1;
  } else {
    floored = x / y < 0 ? -0 : 0;
  }
  return { div: floored, mod };
}

function evaluatePython(a: Operand, op: Operator, b: Operand): Result {
  const unsupported = (): Result => ({ error: `TypeError: unsupported operand type(s) for ${op}: ${quote(pyType(a))} and ${quote(pyType(b))}`, note: 'pyNoMixing' });
  const intNote: NoteKey | undefined = a.kind === 'bool' || b.kind === 'bool' ? 'pyBoolIsInt' : undefined;
  switch (op) {
    case '+': {
      if (a.kind === 'str' && b.kind === 'str') return { value: { kind: 'str', value: a.value + b.value } };
      if (a.kind === 'str') return { error: `TypeError: can only concatenate str (not "${pyType(b)}") to str`, note: 'pyNoMixing' };
      if (b.kind === 'str') return unsupported();
      if (isIntLike(a) && isIntLike(b)) return int(toBig(a) + toBig(b), intNote);
      const sum = toFloat(a) + toFloat(b);
      return flt(sum, Number.isInteger(sum) ? 'intFloat' : 'floatRounding');
    }
    case '-':
      if (!isNumeric(a) || !isNumeric(b)) return unsupported();
      if (isIntLike(a) && isIntLike(b)) return int(toBig(a) - toBig(b), intNote);
      return flt(toFloat(a) - toFloat(b), 'floatRounding');
    case '*': {
      if (a.kind === 'str' || b.kind === 'str') {
        const text = a.kind === 'str' ? a : b;
        const count = a.kind === 'str' ? b : a;
        if (text.kind !== 'str' || count.kind === 'str' || !isIntLike(count)) return { error: `TypeError: can't multiply sequence by non-int of type '${pyType(count)}'`, note: 'pyNoMixing' };
        const times = Number(toBig(count));
        return { value: { kind: 'str', value: times > 0 ? text.value.repeat(Math.min(times, 200)) : '' }, note: 'pyRepeat' };
      }
      if (isIntLike(a) && isIntLike(b)) return int(toBig(a) * toBig(b), intNote);
      return flt(toFloat(a) * toFloat(b), 'floatRounding');
    }
    case '/':
      if (!isNumeric(a) || !isNumeric(b)) return unsupported();
      if (toFloat(b) === 0) return { error: 'ZeroDivisionError: division by zero', note: 'divideByZero' };
      return flt(toFloat(a) / toFloat(b), 'pyTrueDivision');
    case '//':
    case '%': {
      if (a.kind === 'str' && op === '%') return a.value.includes('%') ? { error: 'TypeError: `%` on text formats it in Python (not covered here)', note: 'pyNoMixing' } : { error: 'TypeError: not all arguments converted during string formatting', note: 'pyNoMixing' };
      if (!isNumeric(a) || !isNumeric(b)) return unsupported();
      if (toFloat(b) === 0) return { error: `ZeroDivisionError: ${op === '//' ? 'floor division' : 'modulo'} by zero`, note: 'divideByZero' };
      if (isIntLike(a) && isIntLike(b)) {
        const x = toBig(a);
        const y = toBig(b);
        const mod = ((x % y) + y) % y;
        return op === '%' ? int(mod, 'pyModSign') : int((x - mod) / y, 'pyFloorDivision');
      }
      const { div, mod } = floatFloorMod(toFloat(a), toFloat(b));
      return flt(op === '//' ? div : mod, op === '//' ? 'pyFloorDivision' : 'pyModSign');
    }
    case '**': {
      if (!isNumeric(a) || !isNumeric(b)) return unsupported();
      if (isIntLike(a) && isIntLike(b)) {
        const x = toBig(a);
        const y = toBig(b);
        if (y >= 0n) return y > 5000n ? { error: 'OverflowError: the exponent is too large for this demo' } : int(x ** y);
        if (x === 0n) return { error: 'ZeroDivisionError: zero cannot be raised to a negative power', note: 'divideByZero' };
        return flt(Number(x) ** Number(y), 'intFloat');
      }
      const result = toFloat(a) ** toFloat(b);
      return Number.isNaN(result) && toFloat(a) < 0 ? { value: 'complex' } : flt(result, 'floatRounding');
    }
    case '==': {
      const equal = isNumeric(a) && isNumeric(b) ? (isIntLike(a) && isIntLike(b) ? toBig(a) === toBig(b) : toFloat(a) === toFloat(b)) : a.kind === 'str' && b.kind === 'str' && a.value === b.value;
      return bool(equal, (a.kind === 'str') !== (b.kind === 'str') ? 'pyNoMixing' : undefined);
    }
    case '<':
      if (a.kind === 'str' && b.kind === 'str') return bool(a.value < b.value);
      if (!isNumeric(a) || !isNumeric(b)) return { error: `TypeError: '<' not supported between instances of ${quote(pyType(a))} and ${quote(pyType(b))}`, note: 'pyNoMixing' };
      return bool(toFloat(a) < toFloat(b));
    case '===':
      return { error: 'SyntaxError: Python has no `===`; use `==`' };
  }
}

function show(result: Operand | 'complex', language: Language): { display: string; type: string } {
  if (result === 'complex') return { display: 'a complex number (not covered here)', type: 'complex' };
  if (language === 'javascript') {
    if (result.kind === 'str') return { display: JSON.stringify(result.value), type: 'string' };
    return { display: jsString(result), type: jsType(result) };
  }
  switch (result.kind) {
    case 'str':
      return { display: quote(clip(result.value)), type: 'str' };
    case 'int':
      return { display: shortBig(result.value), type: 'int' };
    case 'float':
      return { display: pythonFloat(result.value), type: 'float' };
    case 'bool':
      return { display: result.value ? 'True' : 'False', type: 'bool' };
  }
}

/** What `left op right` gives, in the chosen language, or the error that language would raise. */
export function evaluate(left: string, op: Operator, right: string, language: Language): Evaluation {
  const a = parseOperand(left, language);
  if (!a) return { ok: false, reason: 'operand', side: 'left' };
  const b = parseOperand(right, language);
  if (!b) return { ok: false, reason: 'operand', side: 'right' };
  const result = language === 'javascript' ? evaluateJs(a, op, b) : evaluatePython(a, op, b);
  if ('error' in result) return { ok: false, reason: 'error', error: result.error, note: result.note ?? null };
  return { ok: true, ...show(result.value, language), note: result.note ?? null };
}

/** The operand's type name in the chosen language (`'5'` is a string, `5` a number or int, `2.0` a float). */
export function typeOfOperand(raw: string, language: Language): string | null {
  const operand = parseOperand(raw, language);
  return operand ? (language === 'javascript' ? jsType(operand) : pyType(operand)) : null;
}
