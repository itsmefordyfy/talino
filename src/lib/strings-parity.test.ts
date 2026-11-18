import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

import { textProblems } from '@/features/courses/lib/localization-parity';

/**
 * Every `defineStrings` table must say the same things in English and Tagalog: same keys, same list lengths, functions
 * that take the same arguments and return text, and no leftover English or stiff wording in the Tagalog. This is the
 * net under the translation work, so a key added to English later can't silently leave Tagalog behind.
 */
const SRC = path.join(__dirname, '..');

function stringsFiles(dir: string, found: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'app') stringsFiles(full, found);
    } else if (/\.ts$/.test(entry.name) && !/\.test\./.test(entry.name) && fs.readFileSync(full, 'utf8').includes('defineStrings(')) found.push(full);
  }
  return found;
}

type Table = { en: unknown; fil: unknown };
const isTable = (value: unknown): value is Table => typeof value === 'object' && value !== null && 'en' in value && 'fil' in value;

const tables: { name: string; table: Table }[] = [];
for (const file of stringsFiles(SRC)) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const loaded = require(file) as Record<string, unknown>;
  for (const [name, value] of Object.entries(loaded)) if (isTable(value)) tables.push({ name: `${path.relative(SRC, file)}#${name}`, table: value });
}

/**
 * Tables whose Tagalog is a copy of the English on purpose (owner, 2026-11-15: "do not work on Filipino text from now on"). They keep the
 * same shape, so the app still runs in Tagalog, but are not read as Tagalog until someone translates them and removes the entry.
 */
const ENGLISH_ONLY = new Set(['features/architecture/strings.ts#architectureStrings', 'features/visuals/architecture/strings.ts#architectureVisualStrings', 'features/architecture/adr/strings.ts#adrStrings', 'features/architecture/assistant/strings.ts#assistantStrings', 'features/portfolio/tali-strings.ts#taliStrings', 'features/resume/create-strings.ts#createStrings', 'features/me/me-extra-strings.ts#meExtraStrings', 'features/resume/photo-strings.ts#photoStrings', 'features/resume/draft-strings.ts#draftStrings', 'features/interview/strings.ts#interviewStrings', 'features/practice/strings.ts#practiceStrings', 'features/journey/strings.ts#journeyStrings', 'features/discover/browse-strings.ts#browseStrings', 'features/certificates/journey-strings.ts#journeyCertificateStrings', 'features/onboarding/finish-strings.ts#onboardingFinishStrings', 'features/onboarding/course-strings.ts#onboardingCourseStrings', 'features/courses/outline-strings.ts#outlineStrings', 'features/feedback/strings.ts#feedbackStrings', 'features/settings/about-strings.ts#aboutStrings', 'components/photo-cropper-strings.ts#photoCropperStrings', 'features/store/paywall-strings.ts#paywallStrings', 'features/whats-new/strings.ts#whatsNewStrings', 'features/demo/strings.ts#demoStrings', 'features/onboarding/notification-strings.ts#onboardingNotificationStrings', 'features/visuals/dsa/array-ops-strings.ts#arrayOpsStrings', 'features/visuals/dsa/graph-paths-strings.ts#graphPathsStrings', 'features/visuals/dsa/hash-table-strings.ts#hashTableStrings', 'features/visuals/dsa/heap-strings.ts#heapStrings', 'features/visuals/dsa/recursion-stack-strings.ts#recursionStrings', 'features/visuals/dsa/sort-extra-strings.ts#sortExtraStrings', 'features/visuals/dsa/stack-queue-strings.ts#stackQueueStrings', 'features/visuals/dsa/trie-strings.ts#trieStrings', 'features/visuals/dsa/union-find-strings.ts#unionFindStrings', 'features/productivity/strings.ts#productivityStrings', 'features/activities/workflow-strings.ts#workflowStrings', 'features/courses/demo-strings.ts#demoStrings', 'features/visuals/productivity/strings.ts#productivityVisualStrings', 'features/visuals/ai/context-window-strings.ts#contextWindowStrings', 'features/visuals/ai/prompt-anatomy-strings.ts#promptAnatomyStrings', 'features/visuals/ai/image-prompt-strings.ts#imagePromptStrings', 'features/visuals/ai/agent-loop-strings.ts#agentLoopStrings', 'features/visuals/ai/llm-attention-strings.ts#llmAttentionStrings', 'features/visuals/ai/llm-sampling-strings.ts#llmSamplingStrings', 'features/visuals/ai/llm-transformer-strings.ts#llmTransformerStrings', 'features/architecture/workbench/strings.ts#architectureToolStrings']);

const ARGUMENT_SETS: unknown[][] = [[2, 5, 3], ['Ana', 'Cruz', 'x'], [2, 'x', 3], ['x', 2, 3], [1, 1, 1]];

function callable(fn: (...args: never[]) => unknown, args: unknown[]): unknown {
  try {
    return fn(...(args as never[]));
  } catch {
    return undefined;
  }
}

function shapeProblems(en: unknown, fil: unknown, where: string, out: string[]): void {
  if (typeof en === 'function' && typeof fil === 'function') {
    const a = en as (...args: never[]) => unknown;
    const b = fil as (...args: never[]) => unknown;
    if (a.length !== b.length) out.push(`${where}: takes ${a.length} arguments in English, ${b.length} in Tagalog`);
    const worked = ARGUMENT_SETS.find((args) => callable(a, args) !== undefined);
    if (worked) {
      const english = callable(a, worked);
      const tagalog = callable(b, worked);
      if (typeof english !== typeof tagalog) out.push(`${where}: returns ${typeof english} in English, ${typeof tagalog} in Tagalog`);
      else if (typeof tagalog === 'string' && tagalog.trim() === '' && String(english).trim() !== '') out.push(`${where}: empty in Tagalog`);
    }
    return;
  }
  if (typeof en !== typeof fil || Array.isArray(en) !== Array.isArray(fil) || (en === null) !== (fil === null)) {
    out.push(`${where}: ${typeof en} in English, ${typeof fil} in Tagalog`);
    return;
  }
  if (Array.isArray(en) && Array.isArray(fil)) {
    if (en.length !== fil.length) out.push(`${where}: ${en.length} items in English, ${fil.length} in Tagalog`);
    en.forEach((item, index) => shapeProblems(item, fil[index], `${where}[${index}]`, out));
    return;
  }
  if (typeof en === 'object' && en !== null && typeof fil === 'object' && fil !== null) {
    const a = en as Record<string, unknown>;
    const b = fil as Record<string, unknown>;
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!(key in b)) out.push(`${where}.${key}: missing in Tagalog`);
      else if (!(key in a)) out.push(`${where}.${key}: only in Tagalog`);
      else shapeProblems(a[key], b[key], `${where}.${key}`, out);
    }
    return;
  }
  if (typeof en === 'string' && typeof fil === 'string' && en.trim() !== '' && fil.trim() === '') out.push(`${where}: empty in Tagalog`);
}

function leaves(value: unknown, where: string, out: { where: string; text: string }[]): void {
  if (typeof value === 'string') out.push({ where, text: value });
  else if (Array.isArray(value)) value.forEach((item, index) => leaves(item, `${where}[${index}]`, out));
  else if (typeof value === 'function') {
    const result = ARGUMENT_SETS.map((args) => callable(value as (...args: never[]) => unknown, args)).find((text) => typeof text === 'string');
    if (typeof result === 'string') out.push({ where: `${where}()`, text: result });
  } else if (typeof value === 'object' && value !== null) for (const [key, child] of Object.entries(value)) leaves(child, `${where}.${key}`, out);
}

describe('strings tables', () => {
  test('there are tables to check', () => {
    expect(tables.length).toBeGreaterThan(20);
  });

  test.each(tables.map(({ name, table }) => [name, table] as const))('%s has the same shape in English and Tagalog', (_name, table) => {
    const problems: string[] = [];
    shapeProblems(table.en, table.fil, 'table', problems);
    expect(problems).toEqual([]);
  });

  test.each(tables.map(({ name, table }) => [name, table] as const))('%s reads as natural Tagalog', (name, table) => {
    if (ENGLISH_ONLY.has(name)) return;
    const found: { where: string; text: string }[] = [];
    leaves(table.fil, 'table', found);
    expect(found.flatMap(({ where, text }) => textProblems(text, where))).toEqual([]);
  });
});
