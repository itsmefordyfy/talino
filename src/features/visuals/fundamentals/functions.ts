import { fundamentalsStrings } from './strings';

export type ParamKind = 'number' | 'text';
export type Param = { name: string; kind: ParamKind; initial: string };
type Env = Record<string, string | number | boolean>;

type BodyLine = { code: string; /** The local variable this line creates, if any. */ sets?: string; run: (env: Env) => string | number | boolean };

export type FunctionPreset = { id: 'add' | 'greet' | 'area' | 'isEven'; name: string; params: readonly Param[]; body: readonly BodyLine[]; returns: string };

const num = (env: Env, key: string) => Number(env[key]);

/** Four tiny functions, each with a body the visual runs line by line (a fixed table of steps, never evaluated code). */
export const FUNCTION_PRESETS: readonly FunctionPreset[] = [
  { id: 'add', name: 'add', params: [{ name: 'a', kind: 'number', initial: '3' }, { name: 'b', kind: 'number', initial: '4' }], body: [{ code: 'total = a + b', sets: 'total', run: (env) => num(env, 'a') + num(env, 'b') }], returns: 'total' },
  { id: 'greet', name: 'greet', params: [{ name: 'name', kind: 'text', initial: 'Ana' }, { name: 'mark', kind: 'text', initial: '!' }], body: [{ code: 'message = "Hello, " + name + mark', sets: 'message', run: (env) => `Hello, ${String(env.name)}${String(env.mark)}` }], returns: 'message' },
  { id: 'area', name: 'area', params: [{ name: 'width', kind: 'number', initial: '5' }, { name: 'height', kind: 'number', initial: '2' }], body: [{ code: 'result = width * height', sets: 'result', run: (env) => num(env, 'width') * num(env, 'height') }], returns: 'result' },
  { id: 'isEven', name: 'is_even', params: [{ name: 'n', kind: 'number', initial: '7' }], body: [{ code: 'remainder = n % 2', sets: 'remainder', run: (env) => num(env, 'n') % 2 }, { code: 'answer = remainder == 0', sets: 'answer', run: (env) => num(env, 'remainder') === 0 }], returns: 'answer' },
];

export const formatValue = (value: string | number | boolean, kind: ParamKind | 'any' = 'any') => (typeof value === 'string' ? (kind === 'number' ? value : `"${value}"`) : typeof value === 'boolean' ? (value ? 'True' : 'False') : String(value));

/** The function as source lines: the header, its body, and the return. */
export function functionSource(preset: FunctionPreset): string[] {
  return [`def ${preset.name}(${preset.params.map((param) => param.name).join(', ')}):`, ...preset.body.map((line) => `    ${line.code}`), `    return ${preset.returns}`];
}

export const callText = (preset: FunctionPreset, args: readonly string[]) => `${preset.name}(${preset.params.map((param, index) => (param.kind === 'text' ? `"${args[index] ?? ''}"` : (args[index] ?? '').trim())).join(', ')})`;

export type FunctionStep = {
  phase: 'defined' | 'call' | 'bind' | 'run' | 'return';
  /** The values passed in (what is on the input side of the machine). */
  inputs: readonly string[];
  /** Parameters bound to those values, once the call has happened. */
  bound: readonly { name: string; value: string }[];
  /** Local variables the body has made so far; they vanish after the return. */
  locals: readonly { name: string; value: string }[];
  /** 1-based line of `functionSource` running now. */
  line: number | null;
  output: string | null;
  caption: string;
};

export type FunctionBuild = { ok: true; steps: FunctionStep[]; returned: string | number | boolean } | { ok: false; param: string; caption: string };

/** Binds the arguments, runs the body one line at a time and returns the value. A number parameter must be a number. */
export function buildFunctionSteps(preset: FunctionPreset, rawArgs: readonly string[], t = fundamentalsStrings.en.functions): FunctionBuild {
  const env: Env = {};
  const bound: { name: string; value: string }[] = [];
  for (const [index, param] of preset.params.entries()) {
    const raw = rawArgs[index] ?? '';
    if (param.kind === 'number' && (raw.trim() === '' || Number.isNaN(Number(raw)))) return { ok: false, param: param.name, caption: t.badNumber(param.name) };
    env[param.name] = param.kind === 'number' ? Number(raw) : raw;
    bound.push({ name: param.name, value: formatValue(env[param.name] as string | number, param.kind) });
  }
  const inputs = preset.params.map((param, index) => formatValue(env[param.name] as string | number, param.kind) || String(index));
  const call = callText(preset, rawArgs);
  const steps: FunctionStep[] = [
    { phase: 'defined', inputs: [], bound: [], locals: [], line: 1, output: null, caption: t.defined(preset.name) },
    { phase: 'call', inputs, bound: [], locals: [], line: null, output: null, caption: t.call(call) },
    { phase: 'bind', inputs, bound, locals: [], line: 1, output: null, caption: t.bind(bound.map((item) => `${item.name} = ${item.value}`).join(', ')) },
  ];
  const locals: { name: string; value: string }[] = [];
  preset.body.forEach((line, index) => {
    const value = line.run(env);
    if (line.sets) {
      env[line.sets] = value;
      locals.push({ name: line.sets, value: formatValue(value) });
    }
    steps.push({ phase: 'run', inputs, bound, locals: [...locals], line: index + 2, output: null, caption: t.run(line.code, line.sets ?? '', formatValue(value)) });
  });
  const returned = env[preset.returns] as string | number | boolean;
  steps.push({ phase: 'return', inputs, bound, locals: [...locals], line: preset.body.length + 2, output: formatValue(returned), caption: t.returned(preset.returns, formatValue(returned), call) });
  return { ok: true, steps, returned };
}
