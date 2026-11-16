import { describe, expect, test } from '@jest/globals';

import { RECOMMEND_QUESTIONS, recommendQuestions } from './recommend';

describe('recommendQuestions', () => {
  test('English is the original set', () => {
    expect(recommendQuestions()).toBe(RECOMMEND_QUESTIONS);
  });

  test('Tagalog keeps every question id and each choice keeps its course', () => {
    const fil = recommendQuestions('fil');
    expect(fil.map((question) => question.id)).toEqual(RECOMMEND_QUESTIONS.map((question) => question.id));
    fil.forEach((question, index) => {
      const original = RECOMMEND_QUESTIONS[index];
      expect(question.prompt).not.toBe(original.prompt);
      expect(question.choices.map((choice) => choice.course)).toEqual(original.choices.map((choice) => choice.course));
      question.choices.forEach((choice, choiceIndex) => expect(choice.label).not.toBe(original.choices[choiceIndex].label));
    });
  });
});
