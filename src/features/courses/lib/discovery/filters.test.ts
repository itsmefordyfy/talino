import { describe, expect, test } from '@jest/globals';

import { catalogFacts } from '../catalog-facts';
import { fullCatalogFacts, ids } from './discovery.test-helpers';
import { facetCounts, facetValues } from './query';
import {
  EMPTY_FILTERS,
  isAiTool,
  type ProgressStatus,
  activeFilterCount,
  activeFilterList,
  applyFilters,
  clearDimension,
  hasActiveFilters,
  removeFilter,
  toggleFilterValue,
  type CatalogFilters,
} from './filters';

const facts = fullCatalogFacts();

describe('applyFilters', () => {
  test('no filters keep everything, as a new array in the same order', () => {
    const all = applyFilters(facts, EMPTY_FILTERS);
    expect(all).toEqual(facts);
    expect(all).not.toBe(facts);
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
  });

  test('values of one dimension are alternatives (OR)', () => {
    const both = applyFilters(facts, { ...EMPTY_FILTERS, levels: ['beginner', 'advanced'] });
    expect(both.length).toBeGreaterThan(0);
    expect(both.every((fact) => fact.learningLevel === 'beginner' || fact.learningLevel === 'advanced')).toBe(true);
    const beginner = applyFilters(facts, { ...EMPTY_FILTERS, levels: ['beginner'] }).length;
    const advanced = applyFilters(facts, { ...EMPTY_FILTERS, levels: ['advanced'] }).length;
    expect(both.length).toBe(beginner + advanced);
  });

  test('dimensions all have to hold (AND)', () => {
    const filters: CatalogFilters = { ...EMPTY_FILTERS, levels: ['beginner'], categories: ['vibe-coding'], technologies: ['html-css', 'react'], durations: ['3-5h', 'over-5h', '1-3h', 'under-1h'] };
    const results = applyFilters(facts, filters);
    for (const fact of results) {
      expect(fact.level).toBe('beginner');
      expect(fact.category).toBe('vibe-coding');
      expect(fact.technologies.some((technology) => technology === 'html-css' || technology === 'react')).toBe(true);
    }
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThan(applyFilters(facts, { ...EMPTY_FILTERS, levels: ['beginner'] }).length);
  });

  test('types and goals match any of a course\'s several values', () => {
    const paths = applyFilters(facts, { ...EMPTY_FILTERS, types: ['learning-path'] });
    expect(paths.length).toBeGreaterThan(0);
    expect(paths.every((fact) => fact.types.includes('learning-path'))).toBe(true);
    const goal = applyFilters(facts, { ...EMPTY_FILTERS, goals: ['get-job'] });
    expect(goal.every((fact) => fact.goals.includes('get-job'))).toBe(true);
  });

  test('a combination with no course gives an empty list', () => {
    expect(applyFilters(facts, { ...EMPTY_FILTERS, categories: ['careers'], technologies: ['expo'] })).toEqual([]);
  });
});

describe('toggle, remove, reset', () => {
  test('toggling adds, then removes, and never mutates', () => {
    const one = toggleFilterValue(EMPTY_FILTERS, 'levels', 'beginner');
    expect(one.levels).toEqual(['beginner']);
    expect(EMPTY_FILTERS.levels).toEqual([]);
    const two = toggleFilterValue(one, 'levels', 'advanced');
    expect(two.levels).toEqual(['beginner', 'advanced']);
    expect(toggleFilterValue(two, 'levels', 'beginner').levels).toEqual(['advanced']);
    expect(activeFilterCount(two)).toBe(2);
  });

  test('removing one filter leaves the others; removing an unchosen value changes nothing', () => {
    const chosen = toggleFilterValue(toggleFilterValue(EMPTY_FILTERS, 'levels', 'beginner'), 'categories', 'vibe-coding');
    const removed = removeFilter(chosen, 'levels', 'beginner');
    expect(removed).toEqual({ ...EMPTY_FILTERS, categories: ['vibe-coding'] });
    expect(removeFilter(removed, 'levels', 'advanced')).toBe(removed);
    expect(clearDimension(chosen, 'categories')).toEqual({ ...EMPTY_FILTERS, levels: ['beginner'] });
  });

  test('resetting all is EMPTY_FILTERS and restores every course', () => {
    const chosen = toggleFilterValue(EMPTY_FILTERS, 'types', 'masterclass');
    expect(hasActiveFilters(chosen)).toBe(true);
    expect(applyFilters(facts, EMPTY_FILTERS)).toHaveLength(facts.length);
  });
});

describe('activeFilterList', () => {
  test('one chip per chosen value with readable labels, in dimension order', () => {
    let filters = EMPTY_FILTERS;
    filters = toggleFilterValue(filters, 'durations', 'under-1h');
    filters = toggleFilterValue(filters, 'types', 'learning-path');
    filters = toggleFilterValue(filters, 'types', 'free');
    filters = toggleFilterValue(filters, 'levels', 'intermediate');
    filters = toggleFilterValue(filters, 'categories', 'advanced-ai-engineering');
    filters = toggleFilterValue(filters, 'technologies', 'react-native');
    filters = toggleFilterValue(filters, 'goals', 'get-job');
    expect(activeFilterList(filters).map((chip) => `${chip.dimension}:${chip.value}=${chip.label}`)).toEqual([
      'categories:advanced-ai-engineering=Advanced AI Software Engineering',
      'levels:intermediate=Intermediate',
      'types:learning-path=Learning Path',
      'types:free=Free',
      'technologies:react-native=React Native',
      'goals:get-job=Get a developer job',
      'durations:under-1h=Under 1 hour',
    ]);
  });

  test('every course type and duration has the owner\'s label', () => {
    const labels = activeFilterList({ ...EMPTY_FILTERS, types: ['free', 'career', 'learning-path', 'masterclass', 'mini'], durations: ['under-1h', '1-3h', '3-5h', 'over-5h'] }).map((chip) => chip.label);
    expect(labels).toEqual(['Free', 'Career Course', 'Learning Path', 'Masterclass', 'Mini-Course', 'Under 1 hour', '1–3 hours', '3–5 hours', 'More than 5 hours']);
  });

  test('an unknown technology id shows as written', () => {
    expect(activeFilterList({ ...EMPTY_FILTERS, technologies: ['zig'] })[0].label).toBe('zig');
    expect(ids(applyFilters(facts, { ...EMPTY_FILTERS, technologies: ['zig'] }))).toEqual([]);
  });
});

describe('the Discover filters added for the four levels, access, AI tools and progress', () => {
  const realFacts = catalogFacts();

  test('Level offers exactly the four learning levels, and each one finds courses', () => {
    expect(facetValues(realFacts, 'levels')).toEqual(['beginner', 'intermediate', 'advanced', 'expert']);
    for (const level of ['beginner', 'intermediate', 'advanced', 'expert'] as const) {
      const found = applyFilters(realFacts, { ...EMPTY_FILTERS, levels: [level] });
      expect(found.length).toBeGreaterThan(0);
      expect(found.every((fact) => fact.learningLevel === level)).toBe(true);
    }
  });

  test('Access: Free is the free starter only; Pro is everything else', () => {
    const free = applyFilters(realFacts, { ...EMPTY_FILTERS, access: ['free'] });
    expect(free.map((fact) => fact.id)).toEqual(['starter']);
    const pro = applyFilters(realFacts, { ...EMPTY_FILTERS, access: ['pro'] });
    expect(free.length + pro.length).toBe(realFacts.length);
    expect(facetValues(realFacts, 'types')).not.toContain('free');
  });

  test('AI tools lists only AI tools; Technology lists only the rest, and each narrows by its own', () => {
    const tools = facetValues(realFacts, 'tools') as string[];
    expect(tools).toEqual(expect.arrayContaining(['claude', 'chatgpt', 'gemini', 'cursor', 'claude-code', 'vibe-tools']));
    expect(tools.every(isAiTool)).toBe(true);
    expect((facetValues(realFacts, 'technologies') as string[]).some(isAiTool)).toBe(false);
    const cursor = applyFilters(realFacts, { ...EMPTY_FILTERS, tools: ['cursor'] });
    expect(cursor.length).toBeGreaterThan(0);
    expect(cursor.every((fact) => fact.technologies.includes('cursor'))).toBe(true);
  });

  test('Progress reads the learner’s own progress; without it every course is not started', () => {
    const progressOf = (id: string): ProgressStatus => (id === 'starter' ? 'completed' : id === 'ai-dev-intro' ? 'in-progress' : 'not-started');
    expect(applyFilters(realFacts, { ...EMPTY_FILTERS, progress: ['completed'] }, { progressOf }).map((fact) => fact.id)).toEqual(['starter']);
    expect(applyFilters(realFacts, { ...EMPTY_FILTERS, progress: ['in-progress', 'completed'] }, { progressOf }).map((fact) => fact.id).sort()).toEqual(['ai-dev-intro', 'starter']);
    expect(applyFilters(realFacts, { ...EMPTY_FILTERS, progress: ['not-started'] }, { progressOf }).length).toBe(realFacts.length - 2);
    expect(applyFilters(realFacts, { ...EMPTY_FILTERS, progress: ['completed'] })).toEqual([]);
    const counts = facetCounts(realFacts, { text: '', filters: EMPTY_FILTERS }, 'progress', { progressOf });
    expect(counts.get('completed')).toBe(1);
    expect(counts.get('in-progress')).toBe(1);
  });

  test('a filter object from before a dimension existed still works', () => {
    const old = { categories: [], levels: ['beginner'], types: [], technologies: [], goals: [], durations: [] } as unknown as CatalogFilters;
    expect(applyFilters(realFacts, old).every((fact) => fact.learningLevel === 'beginner')).toBe(true);
    expect(activeFilterCount(old)).toBe(1);
  });

  test('chips name the new values plainly', () => {
    const chips = activeFilterList({ ...EMPTY_FILTERS, levels: ['expert'], access: ['pro'], progress: ['not-started'], tools: ['claude-code'] });
    expect(chips.map((chip) => chip.label)).toEqual(['Expert', 'Claude Code', 'Pro', 'Not started']);
  });
});
