import { AI_TOOLS } from '@/features/courses/content/ai-dev/tools';

/**
 * Whether a message is about AI coding products. The model's memory of those is often out of date (it told a learner that Codex had been
 * discontinued), so when one is mentioned the server gives it Talino's own checked facts instead of letting it guess.
 */
export const mentionsAiTools = (text: string): boolean =>
  /\b(chat ?gpt|openai|claude|anthropic|cursor|codex|copilot|gemini|windsurf|mcp|ai (coding )?(tool|assistant|editor|agent)s?|coding (agent|assistant)s?|vibe[- ]?cod\w*)\b/i.test(text);

const list = (items: readonly string[]) => items.join('; ');

/** Talino's checked facts about the AI tools its AI-development path teaches (`content/ai-dev/tools.ts`, one file for the app and the lessons), as prompt text. */
export function toolFactsPrompt(): string {
  const checked = AI_TOOLS.map((tool) => tool.checked).sort().at(-1) ?? '';
  const lines = AI_TOOLS.map((tool) => `- ${tool.name} (${tool.maker}): ${tool.kind}. Best for: ${list(tool.bestFor)}. Strengths: ${list(tool.strengths)}. Limits: ${list(tool.limits)}. How it gets context: ${tool.context} What it can do on its own: ${tool.agent} Where it plugs in: ${tool.integrations} Plans: ${tool.plans}`);
  return `Talino's checked facts about AI coding tools (checked ${checked} against the official documentation). They are newer than your own memory: when they differ from what you remember, trust them, and never say a listed tool was discontinued, replaced or renamed unless it says so here. Say these details can change and point to the official page. For a tool that is not listed, say you are not sure of its current state instead of describing it from memory:\n${lines.join('\n')}`;
}
