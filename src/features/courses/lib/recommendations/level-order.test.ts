import { describe, expect, test } from '@jest/globals';

import { fitsLevel, LEVEL_MISFIT, learnerExperience, levelFit } from './score';
import { buildDiscoverySections } from './sections';
import { catalogIndex } from './catalog-index';
import { FACTS, idsOf, signalsFor } from './recommendations.test-helpers';

const levelOf = (id: string) => FACTS.find((fact) => fact.id === id)!.level;

describe('fitsLevel', () => {
  test('the basics are far from an expert, and advanced courses far from a beginner', () => {
    expect(fitsLevel('professional', 'beginner')).toBe(false);
    expect(fitsLevel('advanced', 'beginner')).toBe(false);
    expect(fitsLevel('professional', 'intermediate')).toBe(true);
    expect(fitsLevel('complete-beginner', 'advanced')).toBe(false);
    expect(fitsLevel('complete-beginner', 'intermediate')).toBe(false);
    expect(fitsLevel('beginner', 'intermediate')).toBe(true);
    for (const level of ['beginner', 'intermediate', 'advanced'] as const) expect(fitsLevel('intermediate', level)).toBe(true);
  });
  test('is the same line the score uses', () => {
    expect(levelFit('professional', 'beginner')).toBeLessThanOrEqual(LEVEL_MISFIT);
    expect(levelFit('intermediate', 'beginner')).toBeGreaterThan(LEVEL_MISFIT);
  });
});

describe('For you leads with courses at the learner’s own level', () => {
  const wide = { recommendedLimit: 100, exploreLimit: 100 };

  test.each([
    ['frontend', { goals: ['frontend' as const], interests: ['react' as const, 'html-css' as const] }],
    ['ai', { goals: ['ai' as const], interests: ['llm' as const, 'genai' as const] }],
    ['freelance', { goals: ['freelance' as const] }],
  ])('%s: an experienced developer meets no beginner course before one at their level', (_name, answers) => {
    const signals = signalsFor({ experience: 'professional', ...answers });
    const experience = learnerExperience(signals, catalogIndex(FACTS));
    const recommended = idsOf(buildDiscoverySections(signals, FACTS, wide).recommended ?? []);
    const fits = recommended.map((id) => fitsLevel(experience, levelOf(id)));
    expect(fits.length).toBeGreaterThan(0);
    // Every course at their level comes before every course far from it.
    expect(fits.lastIndexOf(true)).toBeLessThan(fits.indexOf(false) === -1 ? Infinity : fits.indexOf(false));
  });

  test('a complete beginner is not led with a course above their level', () => {
    const signals = signalsFor({ experience: 'complete-beginner', goals: ['ai'], interests: ['llm', 'genai'] });
    const recommended = idsOf(buildDiscoverySections(signals, FACTS, wide).recommended ?? []);
    const fits = recommended.map((id) => fitsLevel('complete-beginner', levelOf(id)));
    expect(fits.indexOf(true)).toBe(0);
    expect(fits.lastIndexOf(true)).toBeLessThan(fits.indexOf(false) === -1 ? Infinity : fits.indexOf(false));
  });

  test('nothing is dropped: the courses far from their level still follow, so a thin list is not left short', () => {
    const signals = signalsFor({ experience: 'professional', goals: ['frontend'], interests: ['react', 'html-css'] });
    const recommended = idsOf(buildDiscoverySections(signals, FACTS, wide).recommended ?? []);
    expect(recommended.some((id) => levelOf(id) === 'beginner')).toBe(true);
  });

  test('the same courses are recommended as before, only the order puts their level first (an intermediate learner is untouched)', () => {
    const signals = signalsFor({ experience: 'intermediate', goals: ['frontend'], interests: ['react'] });
    const ids = idsOf(buildDiscoverySections(signals, FACTS, wide).recommended ?? []);
    const fits = ids.map((id) => fitsLevel('intermediate', levelOf(id)));
    expect(fits.every(Boolean)).toBe(true);
  });

  test('exploring interests follows the same order', () => {
    const signals = signalsFor({ experience: 'professional', goals: ['ai'], interests: ['llm', 'genai', 'ai-apps'] });
    const explore = idsOf(buildDiscoverySections(signals, FACTS, wide).exploreInterests ?? []);
    const fits = explore.map((id) => fitsLevel('professional', levelOf(id)));
    if (fits.includes(false)) expect(fits.lastIndexOf(true)).toBeLessThan(fits.indexOf(false));
  });
});
