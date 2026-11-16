import { describe, expect, test } from '@jest/globals';

import { recommendCourse, RECOMMEND_QUESTIONS } from './recommend';

describe('recommendCourse', () => {
  test('the course most answers point to', () => {
    expect(recommendCourse(['builder', 'builder', 'developer', 'freelancer', 'builder'], null)).toBe('builder');
  });

  test('a tie goes to the goal from the welcome', () => {
    expect(recommendCourse(['developer', 'educator'], 'educator')).toBe('educator');
  });

  test('a tie with no matching goal follows the launch order', () => {
    expect(recommendCourse(['educator', 'freelancer'], 'builder')).toBe('freelancer');
  });

  test('no answers: the goal, else Developer', () => {
    expect(recommendCourse([], 'career-changer')).toBe('freelancer');
    expect(recommendCourse([], null)).toBe('developer');
  });

  test('every question offers each career course once', () => {
    for (const question of RECOMMEND_QUESTIONS) expect(new Set(question.choices.map((choice) => choice.course)).size).toBe(5);
  });
});
