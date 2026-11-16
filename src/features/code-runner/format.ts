/**
 * console.log formatting that follows Node's `util.inspect` closely for the cases learners meet:
 * `[ 1, 2, 3 ]`, `{ a: 1 }`, nested objects broken over lines at 72 columns, numeric arrays laid
 * out in columns, `Map(1) { 'a' => 1 }`, class names, and `[Circular *1]`.
 */
import type { Runtime } from './runtime';
import { Accessor, JsArray, JsFunction, JsMap, JsObject, JsSet } from './values';

type Ctx = {
  rt: Runtime;
  depth: number;
  breakLength: number;
  compact: number;
  indentationLvl: number;
  currentDepth: number;
  seen: JsObject[];
  circular: Map<JsObject, number>;
};

const MAX_ITEMS = 100;
const IDENT = /^[a-zA-Z_][a-zA-Z_0-9]*$/;

export function formatInspect(rt: Runtime, value: unknown): string {
  const ctx: Ctx = { rt, depth: 2, breakLength: 80, compact: 3, indentationLvl: 0, currentDepth: 0, seen: [], circular: new Map() };
  return formatValue(ctx, value, 0);
}

/** `console.log(...args)`: strings raw, the rest inspected, with the %s %d %i %f %j %o %O %% codes. */
export function formatLog(rt: Runtime, args: unknown[]): string {
  const first = args[0];
  let rest = args;
  let out = '';
  if (typeof first === 'string' && first.includes('%') && args.length > 1) {
    let index = 1;
    out = first.replace(/%([sdifjoOc%])/g, (match, code: string) => {
      if (code === '%') return '%';
      if (index >= args.length) return match;
      const arg = args[index++];
      switch (code) {
        case 's': return typeof arg === 'string' ? arg : arg instanceof JsObject ? formatInspect(rt, arg) : String(arg);
        case 'd': return typeof arg === 'object' && arg !== null ? 'NaN' : String(Number(arg));
        case 'i': return typeof arg === 'object' && arg !== null ? 'NaN' : String(Math.trunc(Number(arg)));
        case 'f': return String(parseFloat(String(arg)));
        case 'j': return arg instanceof JsObject ? formatInspect(rt, arg) : JSON.stringify(arg) ?? 'undefined';
        case 'c': return '';
        default: return formatInspect(rt, arg);
      }
    });
    rest = args.slice(index);
    return [out, ...rest.map((v) => (typeof v === 'string' ? v : formatInspect(rt, v)))].join(' ');
  }
  return rest.map((v) => (typeof v === 'string' ? v : formatInspect(rt, v))).join(' ');
}

export function quote(text: string): string {
  let q = "'";
  if (text.includes("'")) {
    if (!text.includes('"')) q = '"';
    else if (!text.includes('`') && !text.includes('${')) q = '`';
  }
  let out = '';
  for (const ch of text) {
    if (ch === q || ch === '\\') out += '\\' + ch;
    else if (ch === '\n') out += '\\n';
    else if (ch === '\t') out += '\\t';
    else if (ch === '\r') out += '\\r';
    else if (ch === '\b') out += '\\b';
    else if (ch === '\f') out += '\\f';
    else if (ch < ' ' || ch === '\x7f') out += '\\x' + ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
    else out += ch;
  }
  return q + out + q;
}

function formatPrimitive(value: unknown): string {
  if (typeof value === 'string') return quote(value);
  if (typeof value === 'number') return Object.is(value, -0) ? '-0' : String(value);
  return String(value);
}

function formatValue(ctx: Ctx, value: unknown, recurseTimes: number): string {
  if (!(value instanceof JsObject)) return formatPrimitive(value);
  if (ctx.seen.includes(value)) {
    let index = ctx.circular.get(value);
    if (index === undefined) {
      index = ctx.circular.size + 1;
      ctx.circular.set(value, index);
    }
    return `[Circular *${index}]`;
  }
  return formatRaw(ctx, value, recurseTimes);
}

function constructorName(rt: Runtime, obj: JsObject): string | null {
  for (let o: JsObject | null = obj; o; o = o.proto) {
    const ctor = o.props.get('constructor');
    if (ctor instanceof JsFunction && ctor.name) return ctor.name;
  }
  return null;
}

function prefixFor(rt: Runtime, obj: JsObject, fallback: string, size?: number): string {
  const name = constructorName(rt, obj);
  if (name === null) return `[${fallback}${size === undefined ? '' : `(${size})`}: null prototype] `;
  if (size !== undefined) return `${name}(${size}) `;
  return name === fallback ? '' : `${name} `;
}

function functionBase(fn: JsFunction): string {
  if (fn.isClass) {
    const parent = fn.parentClass?.name;
    return `[class ${fn.name || '(anonymous)'}${parent ? ` extends ${parent}` : ''}]`;
  }
  return fn.name ? `[Function: ${fn.name}]` : '[Function (anonymous)]';
}

function formatRaw(ctx: Ctx, value: JsObject, recurseTimes: number): string {
  const rt = ctx.rt;
  let keys = rt.ownKeys(value);
  let braces: [string, string] = ['{', '}'];
  let base = '';
  let isArrayLike = false;
  let formatter: (r: number) => string[] = () => [];
  const className = value.className;

  if (value instanceof JsArray) {
    keys = keys.filter((k) => !/^(0|[1-9]\d*)$/.test(k));
    isArrayLike = true;
    const prefix = prefixFor(rt, value, 'Array', value.items.length);
    braces = [prefix === 'Array(' + value.items.length + ') ' ? '[' : `${prefix}[`, ']'];
    if (value.items.length === 0 && keys.length === 0) return `${braces[0]}]`;
    formatter = (r) => {
      const out: string[] = [];
      const shown = Math.min(MAX_ITEMS, value.items.length);
      for (let i = 0; i < shown; i++) out.push(formatChild(ctx, value.items[i], r));
      if (value.items.length > shown) out.push(`... ${value.items.length - shown} more item${value.items.length - shown > 1 ? 's' : ''}`);
      return out;
    };
  } else if (value instanceof JsSet) {
    const prefix = prefixFor(rt, value, 'Set', value.set.size);
    braces = [`${prefix}{`, '}'];
    if (value.set.size === 0 && keys.length === 0) return `${prefix}{}`;
    formatter = (r) => {
      ctx.indentationLvl += 2;
      const out = Array.from(value.set).slice(0, MAX_ITEMS).map((v) => formatValue(ctx, v, r));
      ctx.indentationLvl -= 2;
      return out;
    };
  } else if (value instanceof JsMap) {
    const prefix = prefixFor(rt, value, 'Map', value.map.size);
    braces = [`${prefix}{`, '}'];
    if (value.map.size === 0 && keys.length === 0) return `${prefix}{}`;
    formatter = (r) => {
      ctx.indentationLvl += 2;
      const out = Array.from(value.map).slice(0, MAX_ITEMS).map(([k, v]) => `${formatValue(ctx, k, r)} => ${formatValue(ctx, v, r)}`);
      ctx.indentationLvl -= 2;
      return out;
    };
  } else if (value instanceof JsFunction) {
    base = functionBase(value);
    if (keys.length === 0) return base;
  } else if (className === 'Error') {
    const name = rt.toStr(rt.getMember(value, 'name'));
    const message = rt.toStr(rt.getMember(value, 'message'));
    const text = message ? `${name}: ${message}` : name;
    base = recurseTimes > 0 ? `[${text}]` : text;
    keys = keys.filter((k) => k !== 'name' && k !== 'message');
    if (keys.length === 0) return base;
  } else {
    const prefix = prefixFor(rt, value, 'Object');
    braces = [`${prefix}{`, '}'];
    if (keys.length === 0) return `${prefix}{}`;
  }

  if (recurseTimes > ctx.depth) {
    return `[${value instanceof JsArray ? 'Array' : (constructorName(rt, value) ?? 'Object')}]`;
  }
  recurseTimes += 1;
  ctx.seen.push(value);
  ctx.currentDepth = recurseTimes;
  const output = formatter(recurseTimes);
  for (const key of keys) output.push(formatProperty(ctx, value, key, recurseTimes));
  ctx.seen.pop();

  const index = ctx.circular.get(value);
  if (index !== undefined) {
    const ref = `<ref *${index}>`;
    if (base === '') braces[0] = `${ref} ${braces[0]}`;
    else base = `${ref} ${base}`;
  }
  return reduceToSingleString(ctx, output, base, braces, isArrayLike, recurseTimes, value);
}

function formatChild(ctx: Ctx, value: unknown, recurseTimes: number): string {
  ctx.indentationLvl += 2;
  const text = formatValue(ctx, value, recurseTimes);
  ctx.indentationLvl -= 2;
  return text;
}

function formatProperty(ctx: Ctx, obj: JsObject, key: string, recurseTimes: number): string {
  const raw = obj.props.get(key);
  let text: string;
  if (raw instanceof Accessor) text = raw.get ? (raw.set ? '[Getter/Setter]' : '[Getter]') : '[Setter]';
  else text = formatChild(ctx, raw, recurseTimes);
  const name = IDENT.test(key) ? key : quote(key);
  return `${name}: ${text}`;
}

function isBelowBreakLength(ctx: Ctx, output: string[], start: number, base: string): boolean {
  let total = output.length + start;
  if (total + output.length > ctx.breakLength) return false;
  for (const entry of output) {
    total += entry.length;
    if (total > ctx.breakLength) return false;
  }
  return base === '' || !base.includes('\n');
}

function reduceToSingleString(ctx: Ctx, output: string[], base: string, braces: [string, string], isArray: boolean, recurseTimes: number, value: JsObject): string {
  const entries = output.length;
  if (isArray && entries > 6) output = groupArrayElements(ctx, output, value as JsArray);
  if (ctx.currentDepth - recurseTimes < ctx.compact && entries === output.length) {
    const start = output.length + ctx.indentationLvl + braces[0].length + base.length + 10;
    if (isBelowBreakLength(ctx, output, start, base)) {
      const joined = output.join(', ');
      if (!joined.includes('\n')) return `${base ? `${base} ` : ''}${braces[0]} ${joined} ${braces[1]}`;
    }
  }
  const indentation = `\n${' '.repeat(ctx.indentationLvl)}`;
  return `${base ? `${base} ` : ''}${braces[0]}${indentation}  ${output.join(`,${indentation}  `)}${indentation}${braces[1]}`;
}

/** Node's column layout for arrays of more than six entries. */
function groupArrayElements(ctx: Ctx, output: string[], value: JsArray): string[] {
  let totalLength = 0;
  let maxLength = 0;
  let outputLength = output.length;
  if (value.items.length > MAX_ITEMS && output.length > MAX_ITEMS) outputLength--;
  const separatorSpace = 2;
  const dataLen: number[] = [];
  for (let i = 0; i < outputLength; i++) {
    const len = output[i].length;
    dataLen[i] = len;
    totalLength += len + separatorSpace;
    if (maxLength < len) maxLength = len;
  }
  const actualMax = maxLength + separatorSpace;
  if (actualMax * 3 + ctx.indentationLvl < ctx.breakLength && (totalLength / actualMax > 5 || maxLength <= 6)) {
    const approxCharHeights = 2.5;
    const averageBias = Math.sqrt(actualMax - totalLength / output.length);
    const biasedMax = Math.max(actualMax - 3 - averageBias, 1);
    const columns = Math.min(
      Math.round(Math.sqrt(approxCharHeights * biasedMax * outputLength) / biasedMax),
      Math.floor((ctx.breakLength - ctx.indentationLvl) / actualMax),
      ctx.compact * 4,
      15,
    );
    if (columns <= 1) return output;
    const tmp: string[] = [];
    const maxLineLength: number[] = [];
    for (let i = 0; i < columns; i++) {
      let lineLength = 0;
      for (let j = i; j < output.length; j += columns) if (dataLen[j] > lineLength) lineLength = dataLen[j];
      maxLineLength.push(lineLength + separatorSpace);
    }
    let padStart = true;
    for (let i = 0; i < output.length; i++) {
      if (typeof value.items[i] !== 'number') {
        padStart = false;
        break;
      }
    }
    for (let i = 0; i < outputLength; i += columns) {
      const max = Math.min(i + columns, outputLength);
      let line = '';
      let j = i;
      for (; j < max - 1; j++) {
        const cell = `${output[j]}, `;
        line += padStart ? cell.padStart(maxLineLength[j - i]) : cell.padEnd(maxLineLength[j - i]);
      }
      line += padStart ? output[j].padStart(maxLineLength[j - i] - separatorSpace) : output[j];
      tmp.push(line);
    }
    if (outputLength < output.length) tmp.push(output[outputLength]);
    return tmp;
  }
  return output;
}
