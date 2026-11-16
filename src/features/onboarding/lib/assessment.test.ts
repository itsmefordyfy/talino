import { describe, expect, test } from '@jest/globals';

import { ASSESSMENT_BANK } from '../content/assessment-bank';
import { assessmentLength, effectiveExperience, estimateLevel, nextQuestion, type AnsweredQuestion } from './assessment';

/** Plays a whole check, answering as `rule` says. */
function play(experience: Parameters<typeof nextQuestion>[0], rule: (tier: number) => boolean): AnsweredQuestion[] {
  const answered: AnsweredQuestion[] = [];
  for (;;) {
    const question = nextQuestion(experience, answered);
    if (!question) return answered;
    answered.push({ id: question.id, tier: question.tier, correct: rule(question.tier) });
  }
}

describe('question bank', () => {
  test('is well formed', () => {
    const ids = new Set<string>();
    for (const question of ASSESSMENT_BANK) {
      expect(ids.has(question.id)).toBe(false);
      ids.add(question.id);
      expect(question.choices.length).toBeGreaterThanOrEqual(3);
      expect(question.answer).toBeGreaterThanOrEqual(0);
      expect(question.answer).toBeLessThan(question.choices.length);
      expect(question.explanation.length).toBeGreaterThan(20);
    }
  });

  test('has enough questions in every tier for the longest check', () => {
    for (const tier of [1, 2, 3, 4]) expect(ASSESSMENT_BANK.filter((question) => question.tier === tier).length).toBeGreaterThanOrEqual(5);
  });
});

describe('adaptive check', () => {
  test('a complete beginner is never asked the hard tiers, even answering everything right', () => {
    const answered = play('complete-beginner', () => true);
    expect(answered).toHaveLength(assessmentLength('complete-beginner'));
    expect(Math.max(...answered.map((entry) => entry.tier))).toBeLessThanOrEqual(2);
  });

  test('starts where the experience level says', () => {
    expect(nextQuestion('complete-beginner', [])?.tier).toBe(1);
    expect(nextQuestion('intermediate', [])?.tier).toBe(2);
    expect(nextQuestion('professional', [])?.tier).toBe(3);
  });

  test('gets easier after a miss and harder after a hit', () => {
    const miss = nextQuestion('advanced', [{ id: 'a3-json', tier: 3, correct: false }]);
    const hit = nextQuestion('advanced', [{ id: 'a3-json', tier: 3, correct: true }]);
    expect(miss?.tier).toBe(2);
    expect(hit?.tier).toBe(4);
  });

  test('never repeats a question and always finishes', () => {
    for (const experience of ['complete-beginner', 'beginner', 'intermediate', 'advanced', 'professional'] as const) {
      for (const rule of [() => true, () => false, (tier: number) => tier <= 2]) {
        const answered = play(experience, rule);
        expect(answered).toHaveLength(assessmentLength(experience));
        expect(new Set(answered.map((entry) => entry.id)).size).toBe(answered.length);
      }
    }
  });
});

describe('estimating the level', () => {
  test('a beginner who gets the easy ones right is "foundations", not failing', () => {
    expect(estimateLevel(play('complete-beginner', (tier) => tier === 1))).toBe('foundations');
  });
  test('missing everything is "new"', () => {
    expect(estimateLevel(play('beginner', () => false))).toBe('new');
  });
  test('getting hard ones right is "strong"', () => {
    expect(estimateLevel(play('professional', () => true))).toBe('strong');
  });
  test('tier two hits make "comfortable"', () => {
    expect(estimateLevel(play('intermediate', (tier) => tier <= 2))).toBe('comfortable');
  });
});

describe('effective experience', () => {
  test('is the declared level without a check', () => {
    expect(effectiveExperience('beginner', null)).toBe('beginner');
  });
  test('rises when the check shows more', () => {
    expect(effectiveExperience('complete-beginner', 'foundations')).toBe('beginner');
    expect(effectiveExperience('beginner', 'strong')).toBe('advanced');
  });
  test('never falls for beginners, and falls only one step for advanced and professional', () => {
    expect(effectiveExperience('complete-beginner', 'new')).toBe('complete-beginner');
    expect(effectiveExperience('intermediate', 'new')).toBe('intermediate');
    expect(effectiveExperience('professional', 'new')).toBe('advanced');
    expect(effectiveExperience('advanced', 'new')).toBe('intermediate');
  });
});
