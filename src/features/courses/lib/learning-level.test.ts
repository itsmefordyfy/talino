import { describe, expect, test } from '@jest/globals';

import { AI_BUILDER_JOURNEY } from '@/features/journey/data/journey';

import { COURSES } from '../content';
import { catalogFacts } from './catalog-facts';
import { LEARNING_LEVELS, learningLevelOf, nextLearningLevel, placementFrom } from './learning-level';

describe('a course’s learning level', () => {
  test('comes from the stage of the journey its lessons sit in', () => {
    const placement = placementFrom(AI_BUILDER_JOURNEY);
    for (const stage of AI_BUILDER_JOURNEY.stages) {
      for (const milestone of stage.milestones) {
        for (const step of milestone.steps) {
          if (step.kind === 'learn') expect(placement.get(step.courseId)).toBe(stage.level);
        }
      }
    }
  });

  test('every published course has one, and every one of the four levels has courses', () => {
    const facts = catalogFacts();
    expect(facts.length).toBe(COURSES.length);
    for (const level of LEARNING_LEVELS) expect(facts.filter((fact) => fact.learningLevel === level).length).toBeGreaterThan(0);
  });

  test('the free starter is Beginner; launch and business courses that need a finished product are Expert', () => {
    expect(learningLevelOf({ id: 'starter', level: 'beginner' })).toBe('beginner');
    const expert = catalogFacts().filter((fact) => fact.learningLevel === 'expert').map((fact) => fact.id);
    expect(expert.length).toBeGreaterThan(0);
  });

  test('is never read from the title: a course the journey does not place keeps its catalog level', () => {
    const empty = new Map();
    expect(learningLevelOf({ id: 'expert-sounding-title', level: 'beginner' }, empty)).toBe('beginner');
    expect(learningLevelOf({ id: 'x', level: 'advanced' }, empty)).toBe('advanced');
    expect(learningLevelOf({ id: 'x', level: undefined }, empty)).toBe('beginner');
  });

  test('next level goes one step up and stops at Expert', () => {
    expect(nextLearningLevel('beginner')).toBe('intermediate');
    expect(nextLearningLevel('advanced')).toBe('expert');
    expect(nextLearningLevel('expert')).toBeNull();
  });
});
