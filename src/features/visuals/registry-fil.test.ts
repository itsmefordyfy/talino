import { describe, expect, test } from '@jest/globals';

import { findVisual, VISUALS, visualsFor } from './registry';

/**
 * Visuals added after the owner switched Tagalog off (2026-11-15: "do not work on Filipino text") whose `fil` text is still the English text, as a
 * placeholder; delete an id here when it is translated. The Data Structures and Algorithms visuals of 2026-11-16 and the Generative AI course's four visuals of 2026-11-17.
 */
const PENDING_TRANSLATION: ReadonlySet<string> = new Set(['array-operations', 'hash-table-collisions', 'recursion-call-stack', 'trie-autocomplete', 'heap-operations', 'graph-shortest-path', 'union-find', 'sort-extra', 'eisenhower-matrix', 'daily-schedule-builder', 'pomodoro-timer', 'ai-prompt-playground', 'ai-context-window', 'ai-prompt-anatomy', 'ai-image-prompt-builder', 'ai-agent-loop', 'llm-attention', 'llm-sampling', 'llm-transformer-flow', 'arch-diagram-workbench', 'arch-tradeoff-matrix', 'arch-adr-builder', 'arch-assistant']);

describe('visuals in Tagalog', () => {
  test('every visual exists in both languages with the same id, category and component', () => {
    const fil = visualsFor('fil');
    expect(fil.map((visual) => visual.id)).toEqual(VISUALS.map((visual) => visual.id));
    fil.forEach((visual, index) => {
      expect(visual.category).toBe(VISUALS[index].category);
      expect(visual.Component).toBe(VISUALS[index].Component);
    });
  });

  test('titles, summaries and descriptions are written in Tagalog, not copied from English', () => {
    const same = visualsFor('fil').filter((visual, index) => !PENDING_TRANSLATION.has(visual.id) && (visual.summary === VISUALS[index].summary || visual.description === VISUALS[index].description));
    expect(same.map((visual) => visual.id)).toEqual([]);
  });

  test('the two visuals the Tagalog starter course uses are found in Tagalog, and English is still the default', () => {
    for (const id of ['ai-model-input-output', 'ai-llm-workflow']) {
      expect(findVisual(id, 'fil')?.title).toBeTruthy();
      expect(findVisual(id, 'fil')?.summary).not.toBe(findVisual(id)?.summary);
    }
    expect(findVisual('loops')?.title).toBe(VISUALS.find((visual) => visual.id === 'loops')?.title);
  });
});
