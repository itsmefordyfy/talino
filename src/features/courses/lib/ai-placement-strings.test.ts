import { describe, expect, test } from '@jest/globals';

import { PLACEMENT_QUESTIONS, placementQuestions, placementTierLabel, placeInPath } from './ai-placement';

describe('placement in Tagalog', () => {
  const fil = placementQuestions('fil');

  test('every question keeps its id, tier and answer, with the same number of choices', () => {
    expect(fil).toHaveLength(PLACEMENT_QUESTIONS.length);
    fil.forEach((question, index) => {
      const original = PLACEMENT_QUESTIONS[index];
      expect(question.id).toBe(original.id);
      expect(question.tier).toBe(original.tier);
      expect(question.answer).toBe(original.answer);
      expect(question.choices).toHaveLength(original.choices.length);
      expect(question.prompt).not.toBe(original.prompt);
      expect(question.explanation).not.toBe(original.explanation);
    });
  });

  test('English is the original set and tier names exist in both languages', () => {
    expect(placementQuestions('en')).toBe(PLACEMENT_QUESTIONS);
    for (const tier of [1, 2, 3, 4] as const) {
      expect(placementTierLabel(tier, 'en').length).toBeGreaterThan(0);
      expect(placementTierLabel(tier, 'fil').length).toBeGreaterThan(0);
    }
  });

  test('the result names the tiers in the chosen language', () => {
    expect(placeInPath([], PLACEMENT_QUESTIONS, 'fil').tiers[0].label).toBe(placementTierLabel(1, 'fil'));
    expect(placeInPath([]).tiers[0].label).toBe('Foundations');
  });
});
