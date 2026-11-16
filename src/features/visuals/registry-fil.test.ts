import { describe, expect, test } from '@jest/globals';

import { findVisual, VISUALS, visualsFor } from './registry';

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
    const same = visualsFor('fil').filter((visual, index) => visual.summary === VISUALS[index].summary || visual.description === VISUALS[index].description);
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
