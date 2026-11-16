import { describe, expect, test } from '@jest/globals';
import { parse } from 'acorn';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

import { COURSES } from '../index';
import type { LessonBlock } from '../types';

/**
 * Every code block in the wider catalog must at least parse: JavaScript, TypeScript (and JSX/TSX), JSON, Python and shell
 * are syntax-checked with the real parsers, so a typo, a stray bracket or Python 2 syntax can't ship. A block that is meant to
 * be a fragment or pseudocode says so in its `label` ("fragment" or "pseudocode") or uses the language `text`.
 * Running the code, and whether it is the right code, is the writers' and reviewers' job (docs/content/WRITING_BRIEF.md).
 */
type CodeBlock = Extract<LessonBlock, { type: 'code' }>;

const JS = new Set(['javascript', 'js', 'jsx', 'mjs']);
const TS = new Set(['typescript', 'ts', 'tsx']);
const PY = new Set(['python', 'py']);
const SH = new Set(['bash', 'sh', 'shell', 'zsh']);

function problem(block: CodeBlock): string | null {
  const language = block.language.trim().toLowerCase();
  if (/fragment|pseudocode/i.test(block.label ?? '')) return null;
  if (JS.has(language)) {
    try {
      parse(block.code, { ecmaVersion: 'latest', sourceType: 'module', allowAwaitOutsideFunction: true, allowReturnOutsideFunction: true, allowHashBang: true });
      return null;
    } catch (error) {
      // JSX is not plain JavaScript: let the TypeScript parser judge it.
      if (language !== 'jsx') return (error as Error).message;
    }
  }
  if (TS.has(language) || language === 'jsx') {
    const output = ts.transpileModule(block.code, { reportDiagnostics: true, fileName: language === 'tsx' || language === 'jsx' ? 'block.tsx' : 'block.ts', compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022 } });
    const syntax = (output.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
    return syntax.length > 0 ? ts.flattenDiagnosticMessageText(syntax[0].messageText, '\n') : null;
  }
  if (language === 'json') {
    try {
      JSON.parse(block.code);
      return null;
    } catch (error) {
      return (error as Error).message;
    }
  }
  if (PY.has(language)) {
    const result = spawnSync('python3', ['-I', '-c', 'import ast,sys; ast.parse(sys.stdin.read())'], { input: block.code, encoding: 'utf8' });
    return result.status === 0 ? null : (result.stderr.trim().split('\n').slice(-2).join(' ') || 'does not parse as Python 3');
  }
  if (SH.has(language)) {
    const result = spawnSync('bash', ['-n'], { input: block.code, encoding: 'utf8' });
    return result.status === 0 ? null : result.stderr.trim();
  }
  return null;
}

describe('code blocks in the wider catalog', () => {
  const standard = COURSES.filter((course) => course.kind === 'standard');
  test('there are courses to check (or none yet)', () => {
    expect(Array.isArray(standard)).toBe(true);
  });

  for (const course of standard) {
    test(`${course.id}: every checked code block parses`, () => {
      const problems: string[] = [];
      for (const lesson of course.lessons) {
        lesson.body.forEach((block, index) => {
          if (block.type !== 'code') return;
          const found = problem(block);
          if (found) problems.push(`${lesson.id} block ${index} (${block.language}${block.label ? `, ${block.label}` : ''}): ${found}`);
        });
      }
      expect(problems).toEqual([]);
    });
  }
});
