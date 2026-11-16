import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

/**
 * UI labels stay short in Tagalog (owner, 2026-11-14): "short, natural, familiar Filipino-friendly labels", keeping the English
 * word where it is shorter or what people already say (Home, Search, Progress, Try again, Next). A label is a short English
 * string that isn't a sentence (20 characters or fewer, no . ? ! :). Its Tagalog may be at most 4 characters or 35% longer, and
 * never more than 22 characters, so buttons, tabs and headers don't wrap on a small phone. Sentences, explanations, lessons and
 * Tali's lines are not labels and stay natural and complete; a label that truly needs more room is listed in EXCEPTIONS with
 * the reason.
 */
const SRC = path.join(__dirname, '..');
const MAX_EN = 20;
const MAX_ABSOLUTE = 22;

/** `file#table.path` → why a longer Tagalog label is the right call. */
const EXCEPTIONS: Record<string, string> = {
  // Spoken by a screen reader for an icon-only button (skip_next); it is never drawn, so it can't wrap. "Pangungusap" is the natural word for a sentence.
  'features/courses/strings.ts#courseStrings.listenNextSentence': 'icon button, read aloud only',
};

function stringsFiles(dir: string, found: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'app') stringsFiles(full, found);
    } else if (/\.ts$/.test(entry.name) && !/\.test\./.test(entry.name) && fs.readFileSync(full, 'utf8').includes('defineStrings(')) found.push(full);
  }
  return found;
}

type Pair = { where: string; en: string; fil: string };

function pairs(en: unknown, fil: unknown, where: string, out: Pair[]): void {
  if (typeof en === 'string' && typeof fil === 'string') out.push({ where, en, fil });
  else if (Array.isArray(en) && Array.isArray(fil)) en.forEach((item, index) => pairs(item, fil[index], `${where}[${index}]`, out));
  else if (en && fil && typeof en === 'object' && typeof fil === 'object') for (const key of Object.keys(en)) pairs((en as Record<string, unknown>)[key], (fil as Record<string, unknown>)[key], `${where}.${key}`, out);
}

const all: Pair[] = [];
for (const file of stringsFiles(SRC)) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const loaded = require(file) as Record<string, unknown>;
  for (const [name, value] of Object.entries(loaded)) {
    if (value && typeof value === 'object' && 'en' in value && 'fil' in value) pairs((value as { en: unknown }).en, (value as { fil: unknown }).fil, `${path.relative(SRC, file)}#${name}`, all);
  }
}

const isLabel = (text: string) => text.trim().length > 0 && text.length <= MAX_EN && !/[.?!:]/.test(text);
const labels = all.filter((pair) => isLabel(pair.en));
const tooLong = (pair: Pair) => pair.fil.length > Math.max(pair.en.length + 4, Math.ceil(pair.en.length * 1.35)) || pair.fil.length > MAX_ABSOLUTE;

describe('UI labels in Tagalog', () => {
  test('there are labels to check', () => {
    expect(labels.length).toBeGreaterThan(400);
  });

  test('every short label stays short (see the rule at the top of this file)', () => {
    const problems = labels.filter((pair) => tooLong(pair) && !EXCEPTIONS[pair.where]).map((pair) => `${pair.where}: "${pair.en}" (${pair.en.length}) → "${pair.fil}" (${pair.fil.length})`);
    expect(problems).toEqual([]);
  });

  test('every exception still needs to be one', () => {
    const stale = Object.keys(EXCEPTIONS).filter((where) => !labels.some((pair) => pair.where === where && tooLong(pair)));
    expect(stale).toEqual([]);
  });
});
