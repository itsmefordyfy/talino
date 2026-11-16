import { describe, expect, test } from '@jest/globals';

import { AI_DEV_SYLLABUS } from '../content/ai-dev/syllabus';
import { lessonStructureProblems } from './lesson-structure';
import { PLACEMENT_QUESTIONS, PLACEMENT_TIERS, placeInPath } from './ai-placement';

const ids = (tier: number) => PLACEMENT_QUESTIONS.filter((question) => question.tier === tier).map((question) => question.id);

describe('placeInPath', () => {
  test('a miss in the foundations starts at the introduction', () => {
    expect(placeInPath([ids(1)[0]]).startCourseId).toBe('ai-dev-intro');
  });

  test('the first tier with a miss decides, even when later tiers pass', () => {
    const placement = placeInPath([ids(3)[1]]);
    expect(placement.startTier).toBe(3);
    expect(placement.startCourseId).toBe('ai-dev-claude-code');
    expect(placement.tiers.map((tier) => `${tier.correct}/${tier.total}`)).toEqual(['2/2', '2/2', '1/2', '2/2']);
  });

  test('all right goes to the advanced course', () => {
    expect(placeInPath([])).toMatchObject({ startCourseId: 'ai-dev-advanced', allPassed: true });
  });

  test('all wrong starts at the beginning', () => {
    expect(placeInPath(PLACEMENT_QUESTIONS.map((question) => question.id)).startTier).toBe(1);
  });
});

describe('the questions', () => {
  test('two per tier, each tier pointing at a path course, every answer explained', () => {
    for (const tier of [1, 2, 3, 4]) expect(ids(tier)).toHaveLength(2);
    const pathIds = new Set(AI_DEV_SYLLABUS.map((course) => course.id));
    for (const { courseId } of Object.values(PLACEMENT_TIERS)) expect(pathIds.has(courseId)).toBe(true);
    for (const question of PLACEMENT_QUESTIONS) {
      expect(question.answer).toBeGreaterThanOrEqual(0);
      expect(question.answer).toBeLessThan(question.choices.length);
      expect(question.explanation.length).toBeGreaterThan(40);
    }
  });

  test('they meet the quiz rule a lesson quiz meets (explained answers)', () => {
    const asLesson = { id: 'x', day: 1, title: 't', summary: 's', minutes: 1, skills: ['s'], intro: { objectives: ['Place yourself in the path', 'See what each tier needs'], why: 'So you start where the path is useful to you, not where it repeats what you know.' }, body: [{ type: 'paragraph' as const, text: 'x '.repeat(300) }, { type: 'takeaways' as const, items: ['a', 'b'] }], quiz: PLACEMENT_QUESTIONS.slice(0, 5), task: { title: 't', steps: ['s'], minutes: 1 } };
    expect(lessonStructureProblems(asLesson)).toEqual([]);
  });
});
