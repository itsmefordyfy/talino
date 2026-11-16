import type { Language } from '@/lib/i18n';

import { AI_TOOLS } from '../content/ai-dev/tools';
import type { AiTool, AiToolId } from '../content/types';

export function findTool(id: AiToolId): AiTool | undefined {
  return AI_TOOLS.find((tool) => tool.id === id);
}

/**
 * A `toolComparison` block as table data: one row per tool, in the order asked, with the oldest check date for the caption.
 * Three narrow columns so it fits a phone without sideways scrolling; plans, limits and docs are in the AI tools guide.
 */
export function comparisonTable(ids: readonly AiToolId[], language: Language = 'en'): { headers: string[]; rows: string[][]; checked: string | null } {
  const tools = ids.map(findTool).filter((tool): tool is AiTool => !!tool);
  const checked = tools.map((tool) => tool.checked).sort()[0] ?? null;
  return {
    headers: language === 'fil' ? ['Tool', 'Ano ito', 'Pinakaangkop para sa'] : ['Tool', 'What it is', 'Best for'],
    rows: tools.map((tool) => [tool.name, tool.kind, tool.bestFor.slice(0, 2).join('; ')]),
    checked,
  };
}
