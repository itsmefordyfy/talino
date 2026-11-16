import { describe, expect, test } from '@jest/globals';

import { AI_TOOLS } from '@/features/courses/content/ai-dev/tools';

import { buildCoachPrompt, sanitizeContext } from './prompt';
import { mentionsAiTools, toolFactsPrompt } from './tool-facts';

describe('mentionsAiTools', () => {
  test('recognises the products and the topic', () => {
    for (const text of ['Compare Claude Code, Cursor and Codex', 'is chatgpt good for coding?', 'What is vibe coding?', 'which AI coding tool should I use', 'how do I set up an MCP server', 'Is GitHub Copilot free?']) expect(mentionsAiTools(text)).toBe(true);
  });

  test('stays quiet for questions that are not about AI tools, so the facts cost nothing there', () => {
    for (const text of ['How do I write a proposal on Upwork?', 'Why does my loop never end?', 'Help me with my resume summary', '']) expect(mentionsAiTools(text)).toBe(false);
  });
});

describe('the checked tool facts', () => {
  const facts = toolFactsPrompt();

  test('name every tool in the catalog with its own facts, from the one source the lessons use', () => {
    for (const tool of AI_TOOLS) {
      expect(facts).toContain(tool.name);
      expect(facts).toContain(tool.maker);
      expect(facts).toContain(tool.agent);
    }
    expect(facts).toContain('Codex (OpenAI): Coding agent');
  });

  test('tell the model to trust them over its memory and never say a listed tool was discontinued', () => {
    expect(facts).toMatch(/newer than your own memory/);
    expect(facts).toMatch(/never say a listed tool was discontinued/);
    expect(facts).toMatch(/not listed, say you are not sure/);
  });

  test('stay small enough to send only when asked about tools', () => {
    expect(facts.length).toBeLessThan(12000);
  });

  test('are in the prompt only when asked for, and Tala’s prompt keeps her name with them', () => {
    const context = sanitizeContext({ companion: 'tala' });
    expect(buildCoachPrompt('general', context)).not.toContain("Talino's checked facts");
    const withFacts = buildCoachPrompt('general', context, 'en', { aiTools: true });
    expect(withFacts).toContain("Talino's checked facts about AI coding tools");
    expect(withFacts).not.toMatch(/\bTali\b/);
  });
});

describe('the prompt on prices, “best”, endings and formatting the screen can’t draw', () => {
  const prompt = buildCoachPrompt('general', sanitizeContext({}));
  test('never states prices or discontinued products from memory', () => {
    expect(prompt).toMatch(/Never state a price, a plan limit, a version number or a model name as fact/);
    expect(prompt).toMatch(/never say a product was discontinued/);
    expect(prompt).toMatch(/say it depends on the task/);
  });
  test('does not end every reply with a question, and keeps plain questions short', () => {
    expect(prompt).toMatch(/do not end every reply with one/);
    expect(prompt).toMatch(/plain "what is X\?" question gets a short definition/);
  });
  test('asks only for what the renderer draws', () => {
    expect(prompt).toMatch(/Use only \*\* for emphasis/);
    expect(prompt).toMatch(/no block quotes, horizontal rules, Markdown links/);
  });
});
