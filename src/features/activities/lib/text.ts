/** Small pure text helpers shared by the checkers, the validators and the views. */

export const BLANK = '___';

/** Output compared the way a learner would read it: line endings, trailing spaces and surrounding blank lines don't matter. */
export function normalizeOutput(text: string): string {
  return text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/^\n+|\n+$/g, '');
}

/** A line of code compared loosely: surrounding spaces ignored and runs of spaces collapsed. */
export function normalizeCode(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

export function isKebabCase(id: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id);
}

/** A value as a learner would write it: strings quoted, arrays and objects like JSON, the odd ones by name. */
export function formatValue(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number') return Number.isNaN(value) ? 'NaN' : Number.isFinite(value) ? String(value) : value > 0 ? 'Infinity' : '-Infinity';
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'function') return 'a function';
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

/** Splits code at its `___` blanks: n blanks give n + 1 text parts. */
export function splitBlanks(code: string): string[] {
  return code.split(BLANK);
}

export function countBlanks(code: string): number {
  return splitBlanks(code).length - 1;
}

/** `code` with the blanks replaced, in order, by `values`. Missing values stay blank. */
export function fillBlanks(code: string, values: readonly string[]): string {
  const parts = splitBlanks(code);
  return parts.map((part, index) => (index < parts.length - 1 ? part + (values[index] ?? BLANK) : part)).join('');
}

/** Replaces the 1-based `line` of `code`, keeping that line's indentation. */
export function replaceLine(code: string, line: number, replacement: string): string {
  const lines = code.split('\n');
  const original = lines[line - 1] ?? '';
  const indent = /^\s*/.exec(original)?.[0] ?? '';
  lines[line - 1] = indent + replacement.trim();
  return lines.join('\n');
}

/** A small deterministic string hash (FNV-1a), used to seed shuffles so a given activity always shuffles the same way. */
export function hashString(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** mulberry32: a tiny seeded random generator returning numbers in [0, 1). */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A seeded shuffle of the indexes 0..length-1 that is never the identity (for length >= 2) and never
 * one of `avoid`: a puzzle must not start already solved.
 */
export function shuffledIndexes(length: number, seed: string, avoid: readonly (readonly number[])[] = []): number[] {
  const identity = Array.from({ length }, (_, index) => index);
  if (length < 2) return identity;
  const forbidden = [identity, ...avoid].map((order) => order.join(','));
  const random = seededRandom(hashString(seed));
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const order = [...identity];
    for (let index = length - 1; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      [order[index], order[swap]] = [order[swap], order[index]];
    }
    if (!forbidden.includes(order.join(','))) return order;
  }
  // Astronomically unlikely: fall back to a rotation, which differs from the identity for length >= 2.
  return identity.map((_, index) => (index + 1) % length);
}

/** Inserts `text` over the selection of `value`; returns the new value and where the caret goes. */
export function insertAtSelection(value: string, selection: { start: number; end: number }, text: string): { value: string; cursor: number } {
  const start = Math.max(0, Math.min(selection.start, selection.end, value.length));
  const end = Math.max(0, Math.min(Math.max(selection.start, selection.end), value.length));
  return { value: value.slice(0, start) + text + value.slice(end), cursor: start + text.length };
}

/** `**bold**` and `` `code` `` pieces of a short sentence. Unmatched markers stay as plain text. */
export type InlinePart = { text: string; bold?: boolean; code?: boolean };
export function parseInlineText(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const pattern = /`([^`\n]+)`|\*\*([^*\n]+)\*\*/g;
  let last = 0;
  for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
    if (match.index > last) parts.push({ text: text.slice(last, match.index) });
    parts.push(match[1] !== undefined ? { text: match[1], code: true } : { text: match[2], bold: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

/** The words of a sentence without its `**bold**` and `` `code` `` markers: what a screen reader should say. */
export function stripInlineMarkup(text: string): string {
  return parseInlineText(text).map((part) => part.text).join('');
}
