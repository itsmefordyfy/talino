import { describe, expect, test } from '@jest/globals';

import { CATEGORY_IDS } from '../../content/types';
import { fullCatalogFacts, ids } from './discovery.test-helpers';
import { EMPTY_FILTERS, FILTER_DIMENSIONS, hasActiveFilters, toggleFilterValue, type CatalogFilters, type FilterDimension } from './filters';
import { FEATURED_TECHNOLOGIES, facetCounts, facetValues, popularTechnologies, runDiscovery, type DiscoveryQuery } from './query';
import { searchCatalog } from './search';
import { SORT_OPTIONS } from './sort';

const facts = fullCatalogFacts();
const query = (overrides: Partial<DiscoveryQuery> = {}): DiscoveryQuery => ({ text: '', filters: EMPTY_FILTERS, sort: 'recommended', ...overrides });

describe('runDiscovery', () => {
  test('nothing typed and nothing chosen: the whole catalog in catalog order', () => {
    const result = runDiscovery(facts, query());
    expect(ids(result.results)).toEqual(ids(facts));
    expect(result.total).toBe(facts.length);
    expect(result.matched.size).toBe(0);
  });

  test('acceptance: "claude code" with no filter ranks the Claude Code course first', () => {
    const result = runDiscovery(facts, query({ text: 'claude code' }));
    expect(result.results[0].id).toBe('ai-dev-claude-code');
    expect(result.matched.get('ai-dev-claude-code')?.[0]).toBe('title');
  });

  test('acceptance: "React Native" finds the mobile course that lists it, at its learning level (Intermediate)', () => {
    const result = runDiscovery(facts, query({ text: 'React Native', filters: toggleFilterValue(EMPTY_FILTERS, 'levels', 'intermediate') }));
    expect(ids(result.results)).toContain('build-mobile-app-ai');
    expect(result.total).toBeGreaterThan(0);
    for (const fact of result.results) {
      expect(fact.learningLevel).toBe('intermediate');
      expect(fact.technologies).toContain('react-native');
    }
    const unfiltered = runDiscovery(facts, query({ text: 'React Native' }));
    expect(ids(unfiltered.results)).toContain('build-mobile-app-ai');
    const expectedOrder = ids(unfiltered.results).filter((id) => result.results.some((fact) => fact.id === id));
    expect(ids(result.results)).toEqual(expectedOrder);
  });

  test('filters combine with search and shrink the results', () => {
    let filters = toggleFilterValue(EMPTY_FILTERS, 'categories', 'ai-workflows');
    const workflows = runDiscovery(facts, query({ text: 'claude code', filters }));
    expect(workflows.total).toBeGreaterThan(0);
    expect(workflows.results.every((fact) => fact.category === 'ai-workflows')).toBe(true);
    filters = toggleFilterValue(filters, 'levels', 'advanced');
    const narrower = runDiscovery(facts, query({ text: 'claude code', filters }));
    expect(narrower.total).toBeLessThanOrEqual(workflows.total);
    expect(narrower.results.every((fact) => fact.category === 'ai-workflows' && fact.learningLevel === 'advanced')).toBe(true);
  });

  test('filters alone (no text) respect the sort', () => {
    const filters = toggleFilterValue(EMPTY_FILTERS, 'levels', 'intermediate');
    const shortest = runDiscovery(facts, query({ filters, sort: 'shortest' })).results;
    for (let i = 1; i < shortest.length; i += 1) expect(shortest[i - 1].minutes).toBeLessThanOrEqual(shortest[i].minutes);
  });

  test('every sort key works on a filtered, searched set; only recommended keeps relevance', () => {
    const filters = toggleFilterValue(EMPTY_FILTERS, 'levels', 'intermediate');
    const relevance = ids(runDiscovery(facts, query({ text: 'claude code', filters })).results);
    expect(relevance.length).toBeGreaterThan(0);
    for (const option of SORT_OPTIONS) {
      const result = runDiscovery(facts, query({ text: 'claude code', filters, sort: option.key }), { recommendedRank: new Map() });
      expect(ids(result.results).sort()).toEqual([...relevance].sort());
      expect(result.total).toBe(relevance.length);
    }
    const longest = runDiscovery(facts, query({ text: 'claude code', filters, sort: 'longest' })).results;
    for (let i = 1; i < longest.length; i += 1) expect(longest[i - 1].minutes).toBeGreaterThanOrEqual(longest[i].minutes);
  });

  test('with text and recommended, relevance leads and the rank only breaks ties', () => {
    // "beginner" scores many courses equally, so the rank decides among those and never lifts a worse match.
    const scores = new Map(searchCatalog(facts, 'beginner').map((item) => [item.facts.id, item.score]));
    const plain = runDiscovery(facts, query({ text: 'beginner' }));
    const reversed = new Map([...plain.results].reverse().map((fact, index) => [fact.id, index]));
    const ranked = runDiscovery(facts, query({ text: 'beginner' }), { recommendedRank: reversed });
    expect(ids(ranked.results).sort()).toEqual(ids(plain.results).sort());
    for (let i = 1; i < ranked.results.length; i += 1) {
      const a = ranked.results[i - 1].id;
      const b = ranked.results[i].id;
      expect(scores.get(a) ?? 0).toBeGreaterThanOrEqual(scores.get(b) ?? 0);
      if (scores.get(a) === scores.get(b)) expect(reversed.get(a) ?? 0).toBeLessThan(reversed.get(b) ?? 0);
    }
    expect(ids(ranked.results)).not.toEqual(ids(plain.results));
    // A clear winner stays first whatever the rank says.
    const named = runDiscovery(facts, query({ text: 'claude code' }), { recommendedRank: new Map(facts.map((fact, index) => [fact.id, facts.length - index])) });
    expect(named.results[0].id).toBe('ai-dev-claude-code');
  });

  test('explicit sorts override relevance, ties in catalog order', () => {
    const shortest = runDiscovery(facts, query({ text: 'beginner', sort: 'shortest' })).results;
    for (let i = 1; i < shortest.length; i += 1) expect(shortest[i - 1].minutes).toBeLessThanOrEqual(shortest[i].minutes);
    const tied = shortest.filter((fact) => fact.minutes === shortest[0].minutes);
    const catalogIndex = (id: string) => facts.findIndex((fact) => fact.id === id);
    for (let i = 1; i < tied.length; i += 1) expect(catalogIndex(tied[i - 1].id)).toBeLessThan(catalogIndex(tied[i].id));
  });

  test('no match: empty results and total 0; whitespace is the same as no text', () => {
    expect(runDiscovery(facts, query({ text: 'qwertyzxcv' }))).toMatchObject({ results: [], total: 0 });
    expect(ids(runDiscovery(facts, query({ text: '   ' })).results)).toEqual(ids(facts));
  });

  test('removing a filter restores the courses it hid', () => {
    const one = toggleFilterValue(EMPTY_FILTERS, 'levels', 'beginner');
    const narrow = runDiscovery(facts, query({ text: 'claude code', filters: one })).total;
    const wide = runDiscovery(facts, query({ text: 'claude code', filters: toggleFilterValue(one, 'levels', 'beginner') })).total;
    expect(wide).toBeGreaterThanOrEqual(narrow);
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
  });
});

describe('facetCounts', () => {
  const sampleFilters: CatalogFilters[] = [
    EMPTY_FILTERS,
    { ...EMPTY_FILTERS, levels: ['beginner'] },
    { ...EMPTY_FILTERS, categories: ['vibe-coding', 'ai-workflows'], levels: ['intermediate'] },
    { ...EMPTY_FILTERS, technologies: ['claude-code'], types: ['masterclass'] },
    { ...EMPTY_FILTERS, goals: ['get-job'], durations: ['3-5h'] },
  ];
  const texts = ['', 'react', 'prompt engin', 'beginner'];

  test('adding a value yields exactly that count, for every dimension, value, text and filter set', () => {
    for (const text of texts) {
      for (const filters of sampleFilters) {
        for (const dimension of FILTER_DIMENSIONS) {
          const counts = facetCounts(facts, { text, filters }, dimension);
          expect(counts.size).toBe(facetValues(facts, dimension).length);
          for (const [value, count] of counts) {
            const withValue = filters[dimension].includes(value as never) ? filters : toggleFilterValue(filters, dimension as FilterDimension, value as never);
            const total = runDiscovery(facts, { text, filters: withValue, sort: 'recommended' }).total;
            expect({ text, dimension, value, count }).toEqual({ text, dimension, value, count: total });
          }
        }
      }
    }
  });

  test('a value that leads nowhere is counted as 0', () => {
    const counts = facetCounts(facts, { text: '', filters: { ...EMPTY_FILTERS, categories: ['careers'] } }, 'technologies');
    expect(counts.get('expo')).toBe(0);
    const levels = facetCounts(facts, { text: 'sql injection', filters: EMPTY_FILTERS }, 'levels');
    expect([...levels.values()].reduce((a, b) => a + b, 0)).toBe(runDiscovery(facts, query({ text: 'sql injection' })).total);
  });

  test('with nothing chosen the level counts add up to the catalog', () => {
    const levels = facetCounts(facts, { text: '', filters: EMPTY_FILTERS }, 'levels');
    expect([...levels.values()].reduce((a, b) => a + b, 0)).toBe(facts.length);
    expect(facetValues(facts, 'categories')).toEqual([...CATEGORY_IDS]);
  });
});

describe('popularTechnologies', () => {
  test('lists every technology some course lists, named ones first in the owner\'s order, then by use', () => {
    const list = popularTechnologies(facts);
    const used = new Set(facts.flatMap((fact) => fact.technologies));
    expect(new Set(list)).toEqual(used);
    expect(list.length).toBe(used.size);
    const featured = FEATURED_TECHNOLOGIES.filter((id) => used.has(id));
    expect(list.slice(0, featured.length)).toEqual(featured);
    const counts = new Map<string, number>();
    for (const fact of facts) for (const id of new Set(fact.technologies)) counts.set(id, (counts.get(id) ?? 0) + 1);
    const rest = list.slice(featured.length);
    for (let i = 1; i < rest.length; i += 1) expect(counts.get(rest[i - 1]) ?? 0).toBeGreaterThanOrEqual(counts.get(rest[i]) ?? 0);
  });

  test('limit cuts the list; an empty catalog gives none', () => {
    expect(popularTechnologies(facts, 5)).toHaveLength(5);
    expect(popularTechnologies([])).toEqual([]);
  });
});
