import { describe, expect, test } from '@jest/globals';

import { LEARNING_PATHS } from '@/features/courses/content/catalog/paths';
import { catalogFacts } from '@/features/courses/lib/catalog-facts';

import { levelBrowse, pathSummaries, shortCourses } from './browse';
import { progressStatusOf } from './learner';

const facts = catalogFacts();

describe('learning path summaries', () => {
  const summaries = pathSummaries(LEARNING_PATHS, facts, new Set(['starter']));

  test('every path says who it is for, three objectives and an outcome', () => {
    for (const { path } of summaries) {
      expect(path.audience.length).toBeGreaterThan(10);
      expect(path.objectives).toHaveLength(3);
      expect(path.outcome.length).toBeGreaterThan(10);
    }
  });

  test('the level range and duration come from the real courses on the path', () => {
    for (const summary of summaries) {
      const courses = facts.filter((fact) => summary.path.courseIds.includes(fact.id));
      expect(summary.minutes).toBe(courses.reduce((sum, fact) => sum + fact.minutes, 0));
      const order = ['beginner', 'intermediate', 'advanced', 'expert'];
      const indexes = courses.map((fact) => order.indexOf(fact.learningLevel));
      expect(summary.fromLevel).toBe(order[Math.min(...indexes)]);
      expect(summary.toLevel).toBe(order[Math.max(...indexes)]);
    }
  });

  test('progress counts only finished courses on the path', () => {
    const master = summaries.find((summary) => summary.path.id === 'master-ai');
    expect(master?.done).toBe(1);
  });
});

describe('browse by level', () => {
  test('four levels with their real course counts and descriptions', () => {
    const levels = levelBrowse(facts);
    expect(levels.map((entry) => entry.level)).toEqual(['beginner', 'intermediate', 'advanced', 'expert']);
    expect(levels.reduce((sum, entry) => sum + entry.count, 0)).toBe(facts.length);
    for (const entry of levels) expect(entry.description.length).toBeGreaterThan(10);
  });
});

describe('short courses', () => {
  test('mini-courses and courses under 90 minutes, shortest first, published only', () => {
    const short = shortCourses(facts);
    expect(short.length).toBeGreaterThan(0);
    for (const fact of short) expect(fact.kind === 'mini' || fact.minutes < 90).toBe(true);
    for (let i = 1; i < short.length; i += 1) expect(short[i - 1].minutes).toBeLessThanOrEqual(short[i].minutes);
    expect(short.every((fact) => fact.availability === 'available')).toBe(true);
  });
});

describe('progress status for the Progress filter', () => {
  test('completed, in progress or not started, from the learner’s real progress', () => {
    const status = progressStatusOf({ completed: new Set(['starter']), started: new Map([['ai-dev-intro', { fraction: 0.3 }]]) });
    expect(status('starter')).toBe('completed');
    expect(status('ai-dev-intro')).toBe('in-progress');
    expect(status('build-website-ai')).toBe('not-started');
  });
});
