import { describe, expect, test } from '@jest/globals';

import { AI_TOOLS } from '../content/ai-dev/tools';
import type { AiToolId } from '../content/types';
import { comparisonTable } from './ai-tools';
import { isOfficialSource } from './path-rules';

const ALL: AiToolId[] = ['chatgpt', 'claude', 'claude-code', 'codex', 'cursor', 'copilot', 'gemini'];

describe('AI tools', () => {
  test('all seven tools the path compares are described once', () => {
    expect(AI_TOOLS.map((tool) => tool.id).sort()).toEqual([...ALL].sort());
  });

  test('each entry is checked, sourced from official docs, and names plans without price figures', () => {
    for (const tool of AI_TOOLS) {
      expect(tool.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(tool.sources.length).toBeGreaterThan(0);
      for (const source of tool.sources) expect(isOfficialSource(source.url)).toBe(true);
      expect(tool.plans).not.toMatch(/[$₱€£]\s?\d|\d+\s?(usd|php|dollars|pesos)/i);
      expect(tool.bestFor.length).toBeGreaterThanOrEqual(2);
      expect(tool.strengths.length).toBeGreaterThanOrEqual(2);
      expect(tool.limits.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('the comparison table keeps the order asked for and skips unknown ids', () => {
    const table = comparisonTable(['cursor', 'chatgpt']);
    expect(table.headers).toHaveLength(3);
    expect(table.rows.map((row) => row[0])).toEqual(['cursor', 'chatgpt'].map((id) => AI_TOOLS.find((tool) => tool.id === id)?.name));
    expect(table.rows.every((row) => row.length === table.headers.length)).toBe(true);
  });
});
