import { describe, expect, test } from '@jest/globals';

import { EMPTY_FILTERS } from '@/features/courses/lib/discovery/filters';

import {
  browsedBy,
  categorySelected,
  cleanExplored,
  discoverSlice,
  discoveryReset,
  dimensionCleared,
  EXPLORED_MAX,
  exploreAllChanged,
  filterRemoved,
  filtersReset,
  filterToggled,
  hydrateDiscoverState,
  initialDiscoverState,
  isBrowsing,
  queryChanged,
  QUERY_MAX,
  recordCourseOpened,
  tabChanged,
  sortChanged,
  technologiesExplored,
} from './discover-slice';

const reduce = discoverSlice.reducer;

describe('discover slice', () => {
  test('starts on the personalised home: nothing typed, chosen or explored', () => {
    expect(initialDiscoverState).toEqual({ query: '', filters: EMPTY_FILTERS, sort: 'recommended', tab: null, exploredTechnologies: {} });
    expect(isBrowsing(initialDiscoverState)).toBe(false);
  });

  test('typing sets the query (capped); typing makes the results view show', () => {
    const typed = reduce(initialDiscoverState, queryChanged('react'));
    expect(typed.query).toBe('react');
    expect(isBrowsing(typed)).toBe(true);
    expect(reduce(initialDiscoverState, queryChanged('x'.repeat(500))).query).toHaveLength(QUERY_MAX);
    expect(isBrowsing(reduce(typed, queryChanged('   ')))).toBe(false);
  });

  test('toggling a filter value adds then removes it, never touching other dimensions', () => {
    let state = reduce(initialDiscoverState, filterToggled({ dimension: 'levels', value: 'beginner' }));
    state = reduce(state, filterToggled({ dimension: 'technologies', value: 'react' }));
    expect(state.filters.levels).toEqual(['beginner']);
    expect(state.filters.technologies).toEqual(['react']);
    expect(isBrowsing(state)).toBe(true);
    state = reduce(state, filterToggled({ dimension: 'levels', value: 'beginner' }));
    expect(state.filters.levels).toEqual([]);
    expect(state.filters.technologies).toEqual(['react']);
  });

  test('removing a chip, clearing a dimension and resetting filters', () => {
    let state = reduce(initialDiscoverState, filterToggled({ dimension: 'levels', value: 'beginner' }));
    state = reduce(state, filterToggled({ dimension: 'levels', value: 'advanced' }));
    state = reduce(state, filterToggled({ dimension: 'types', value: 'mini' }));
    state = reduce(state, filterRemoved({ dimension: 'levels', value: 'beginner' }));
    expect(state.filters.levels).toEqual(['advanced']);
    state = reduce(state, dimensionCleared('levels'));
    expect(state.filters.levels).toEqual([]);
    expect(state.filters.types).toEqual(['mini']);
    state = reduce(reduce(state, queryChanged('git')), filtersReset());
    expect(state.filters).toEqual(EMPTY_FILTERS);
    expect(state.query).toBe('git');
  });

  test('a category tab is the tab state: choosing it ends the search, keeps the filters, and an unknown one is ignored', () => {
    let state = reduce(initialDiscoverState, queryChanged('abc'));
    state = reduce(state, filterToggled({ dimension: 'levels', value: 'beginner' }));
    state = reduce(state, tabChanged('vibe-coding'));
    expect(state.tab).toBe('vibe-coding');
    expect(state.query).toBe('');
    expect(state.filters.levels).toEqual(['beginner']);
    expect(state.filters.categories).toEqual([]);
    expect(reduce(state, categorySelected('careers')).tab).toBe('careers');
    expect(reduce(initialDiscoverState, tabChanged('nope' as never))).toEqual(initialDiscoverState);
    expect(reduce(initialDiscoverState, categorySelected('nope' as never))).toEqual(initialDiscoverState);
  });

  test('Reset filters clears the filters and keeps the tab and the search', () => {
    let state = reduce(initialDiscoverState, tabChanged('careers'));
    state = reduce(state, filterToggled({ dimension: 'levels', value: 'beginner' }));
    state = reduce(state, queryChanged('git'));
    state = reduce(state, filtersReset());
    expect(state.filters).toEqual(EMPTY_FILTERS);
    expect(state.tab).toBe('careers');
    expect(state.query).toBe('git');
  });

  test('sort accepts only the known sorts', () => {
    expect(reduce(initialDiscoverState, sortChanged('newest')).sort).toBe('newest');
    expect(reduce(initialDiscoverState, sortChanged('nope' as never)).sort).toBe('recommended');
  });

  test('"Explore all" is the All tab, and a clean slate keeps the sort and forgets the tab', () => {
    let state = reduce(initialDiscoverState, sortChanged('shortest'));
    state = reduce(state, exploreAllChanged(true));
    expect(state.tab).toBe('all');
    expect(isBrowsing(state)).toBe(true);
    expect(reduce(state, exploreAllChanged(false)).tab).toBe('for-you');
    state = reduce(reduce(state, queryChanged('x')), discoveryReset());
    expect(state.query).toBe('');
    expect(state.tab).toBeNull();
    expect(state.filters).toEqual(EMPTY_FILTERS);
    expect(state.sort).toBe('shortest');
  });

  test('opening a course counts each of its technologies once, capped', () => {
    let state = reduce(initialDiscoverState, technologiesExplored(['react', 'react', 'javascript']));
    expect(state.exploredTechnologies).toEqual({ react: 1, javascript: 1 });
    for (let index = 0; index < 40; index += 1) state = reduce(state, technologiesExplored(['react']));
    expect(state.exploredTechnologies.react).toBe(EXPLORED_MAX);
    expect(state.exploredTechnologies.javascript).toBe(1);
  });

  test('recordCourseOpened reads the technologies from the catalog; an unknown course changes nothing', () => {
    const action = recordCourseOpened('build-mobile-app-ai');
    expect(action.type).toBe(technologiesExplored.type);
    expect(action.payload).toContain('react-native');
    expect(reduce(initialDiscoverState, recordCourseOpened('no-such-course')).exploredTechnologies).toEqual({});
  });

  test('hydrate keeps only valid explored counts and resets everything transient', () => {
    expect(hydrateDiscoverState({ react: 3, bad: -1, worse: 'x', big: 999, '': 4 }).exploredTechnologies).toEqual({ react: 3, big: EXPLORED_MAX });
    expect(hydrateDiscoverState(null)).toEqual(initialDiscoverState);
    expect(hydrateDiscoverState([1, 2]).exploredTechnologies).toEqual({});
    expect(cleanExplored({ a: 2.4 })).toEqual({ a: 2 });
  });

  test('browse by a level or tool: a clean All list with only that filter, and no search', () => {
    let state = reduce(initialDiscoverState, queryChanged('react'));
    state = reduce(state, filterToggled({ dimension: 'durations', value: 'under-1h' }));
    state = reduce(state, browsedBy({ dimension: 'levels', value: 'expert' }));
    expect(state.filters).toEqual({ ...EMPTY_FILTERS, levels: ['expert'] });
    expect(state.query).toBe('');
    expect(state.tab).toBe('all');
    expect(isBrowsing(state)).toBe(true);
  });

  test('"popular" is no longer a sort the slice accepts', () => {
    expect(reduce(initialDiscoverState, sortChanged('popular' as never)).sort).toBe(initialDiscoverState.sort);
  });
});

