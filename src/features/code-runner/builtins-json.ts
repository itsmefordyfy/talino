import { fromHost } from './convert';
import type { Runtime } from './runtime';
import { JsArray, JsFunction, JsMap, JsObject, JsSet } from './values';

export function installJson(rt: Runtime, globals: Map<string, unknown>) {
  const json = rt.newObject();

  json.hidden('stringify', rt.native('stringify', 3, (_t, args) => {
    const replacer = args[1];
    const space = args[2];
    const gap = typeof space === 'number' ? ' '.repeat(Math.min(10, Math.max(0, Math.trunc(space)))) : typeof space === 'string' ? space.slice(0, 10) : '';
    const allow = replacer instanceof JsArray ? new Set(replacer.items.map((v) => rt.toStr(v))) : null;
    const replacerFn = replacer instanceof JsFunction ? replacer : null;
    const stack: JsObject[] = [];

    const ser = (holder: unknown, key: string, input: unknown, indent: string): string | undefined => {
      let value = input;
      if (value instanceof JsObject) {
        const toJson = rt.getMember(value, 'toJSON');
        if (toJson instanceof JsFunction) value = rt.callFunction(toJson, value, [key]);
      }
      if (replacerFn) value = rt.callFunction(replacerFn, holder, [key, value]);
      if (value === null) return 'null';
      if (typeof value === 'string') return JSON.stringify(value);
      if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'null';
      if (typeof value === 'boolean') return String(value);
      if (!(value instanceof JsObject) || value instanceof JsFunction) return undefined;
      if (stack.includes(value)) return rt.throwError('TypeError', 'Converting circular structure to JSON');
      rt.tick();
      stack.push(value);
      const inner = indent + gap;
      let out: string;
      if (value instanceof JsArray) {
        const parts = value.items.map((item, i) => ser(value, String(i), item, inner) ?? 'null');
        out = parts.length === 0 ? '[]' : gap ? `[\n${inner}${parts.join(`,\n${inner}`)}\n${indent}]` : `[${parts.join(',')}]`;
      } else {
        const parts: string[] = [];
        const keys = value instanceof JsMap || value instanceof JsSet ? [] : rt.ownKeys(value);
        for (const k of keys) {
          if (allow && !allow.has(k)) continue;
          const text = ser(value, k, rt.getMember(value, k), inner);
          if (text !== undefined) parts.push(`${JSON.stringify(k)}:${gap ? ' ' : ''}${text}`);
        }
        out = parts.length === 0 ? '{}' : gap ? `{\n${inner}${parts.join(`,\n${inner}`)}\n${indent}}` : `{${parts.join(',')}}`;
      }
      stack.pop();
      rt.checkString(out.length);
      return out;
    };
    const holder = rt.newObject();
    return ser(holder, '', args[0], '');
  }));

  json.hidden('parse', rt.native('parse', 2, (_t, args) => {
    const source = rt.toStr(args[0]);
    let parsed: unknown;
    try {
      parsed = JSON.parse(source);
    } catch (error) {
      return rt.throwError('SyntaxError', error instanceof Error ? error.message : 'Unexpected token in JSON');
    }
    return fromHost(rt, parsed);
  }));
  globals.set('JSON', json);
}
