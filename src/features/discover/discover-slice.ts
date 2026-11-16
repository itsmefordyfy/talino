import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { courseMeta } from '@/features/courses/content/catalog/meta';
import { CATEGORY_IDS, type CategoryId } from '@/features/courses/content/types';
import {
  EMPTY_FILTERS,
  clearDimension,
  hasActiveFilters,
  removeFilter,
  toggleFilterValue,
  type CatalogFilters,
  type FilterDimension,
  type FilterValue,
} from '@/features/courses/lib/discovery/filters';
import { settingsReset } from '@/features/settings/settings-slice';
import { DEFAULT_SORT, SORT_OPTIONS, type SortKey } from '@/features/courses/lib/discovery/sort';

/**
 * What the learner has typed, chosen and explored on the Discover tab.
 *
 * `query`, `filters`, `sort` and `exploreAll` live in memory only: they keep a search and its filters across opening a
 * course and coming back, but a fresh launch starts from the personalised home. `exploredTechnologies` is the one
 * persisted part (a count per technology of the courses the learner opened), the real curiosity signal the
 * recommendations read. Nothing here ever hides a course: it only narrows what the learner asked to narrow.
 */
/** The tabs under the search box: the personalised home, the whole catalog, or one category. */
export type DiscoverTab = 'for-you' | 'all' | CategoryId;

export type DiscoverState = {
  query: string;
  filters: CatalogFilters;
  sort: SortKey;
  /**
   * The tab the learner chose, kept while they open a course and come back. `null` means they have not chosen one: it shows
   * as For you for a learner with a profile and as All for one without (`resolveTab`).
   */
  tab: DiscoverTab | null;
  /** How many times the learner opened a course of each technology. */
  exploredTechnologies: Record<string, number>;
};

export const initialDiscoverState: DiscoverState = {
  query: '',
  filters: EMPTY_FILTERS,
  sort: DEFAULT_SORT,
  tab: null,
  exploredTechnologies: {},
};

export function isDiscoverTab(value: unknown): value is DiscoverTab {
  return value === 'for-you' || value === 'all' || (typeof value === 'string' && (CATEGORY_IDS as readonly string[]).includes(value));
}

/** The tab in effect: the learner's choice, else For you when they have a profile and All when they have none. */
export function resolveTab(tab: DiscoverTab | null, personalized: boolean): DiscoverTab {
  return tab ?? (personalized ? 'for-you' : 'all');
}

/** The longest search text kept (a pasted essay is not a search). */
export const QUERY_MAX = 80;
/** A count never grows past this: it is a signal of interest, not a tally to keep. */
export const EXPLORED_MAX = 20;

export function cleanExplored(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const clean: Record<string, number> = {};
  for (const [id, count] of Object.entries(value)) {
    const n = Math.round(Number(count));
    if (id && id.length <= 60 && Number.isFinite(n) && n > 0) clean[id] = Math.min(EXPLORED_MAX, n);
  }
  return clean;
}

/** Saved state on load: only the explored counts come back (checked); everything transient starts empty. */
export function hydrateDiscoverState(saved: unknown): DiscoverState {
  return { ...initialDiscoverState, exploredTechnologies: cleanExplored(saved) };
}

export const discoverSlice = createSlice({
  name: 'discover',
  initialState: initialDiscoverState,
  reducers: {
    queryChanged(state, action: PayloadAction<string>) {
      state.query = action.payload.slice(0, QUERY_MAX);
    },
    filterToggled(state, action: PayloadAction<{ dimension: FilterDimension; value: string }>) {
      state.filters = toggleFilterValue(state.filters, action.payload.dimension, action.payload.value as FilterValue<FilterDimension>);
    },
    filterRemoved(state, action: PayloadAction<{ dimension: FilterDimension; value: string }>) {
      state.filters = removeFilter(state.filters, action.payload.dimension, action.payload.value as FilterValue<FilterDimension>);
    },
    dimensionCleared(state, action: PayloadAction<FilterDimension>) {
      state.filters = clearDimension(state.filters, action.payload);
    },
    /** A tab was chosen. Typing in the search box shows the whole catalog, so choosing a tab ends the search; the filters stay and combine with the tab. */
    tabChanged(state, action: PayloadAction<DiscoverTab>) {
      if (!isDiscoverTab(action.payload)) return;
      state.tab = action.payload;
      state.query = '';
    },
    /** Opens one category's tab (Discover's "See all" links). */
    categorySelected(state, action: PayloadAction<CategoryId>) {
      if (!CATEGORY_IDS.includes(action.payload)) return;
      state.tab = action.payload;
      state.query = '';
    },
    /**
     * "Browse by" (a level tile, a tool chip): a clean All list narrowed to that one value. Other filters and the search are
     * cleared so the list is exactly what the tile promised.
     */
    browsedBy(state, action: PayloadAction<{ dimension: FilterDimension; value: string }>) {
      state.filters = toggleFilterValue(EMPTY_FILTERS, action.payload.dimension, action.payload.value as FilterValue<FilterDimension>);
      state.query = '';
      state.tab = 'all';
    },
    /** "Reset filters": clears the filters and keeps the tab and the search text, so the learner stays where they were. */
    filtersReset(state) {
      state.filters = EMPTY_FILTERS;
    },
    sortChanged(state, action: PayloadAction<SortKey>) {
      if (SORT_OPTIONS.some((option) => option.key === action.payload)) state.sort = action.payload;
    },
    /** "Explore all courses": the All tab (true), or back to For you (false). Kept for the buttons that already call it. */
    exploreAllChanged(state, action: PayloadAction<boolean>) {
      state.tab = action.payload ? 'all' : 'for-you';
    },
    /** A clean slate (a way in from Today): no search, no filters and no tab chosen. The sort stays. */
    discoveryReset(state) {
      state.query = '';
      state.filters = EMPTY_FILTERS;
      state.tab = null;
    },
    /** The learner opened a course: its technologies count as explored (the payload is built by `recordCourseOpened`). */
    technologiesExplored(state, action: PayloadAction<string[]>) {
      for (const id of new Set(action.payload)) {
        state.exploredTechnologies[id] = Math.min(EXPLORED_MAX, (state.exploredTechnologies[id] ?? 0) + 1);
      }
    },
    discoverReset() {
      return initialDiscoverState;
    },
  },
  // Delete all data (it resets the settings) also forgets what the learner explored.
  extraReducers: (builder) => {
    builder.addCase(settingsReset, () => initialDiscoverState);
  },
});

export const { queryChanged, browsedBy, filterToggled, filterRemoved, dimensionCleared, tabChanged, categorySelected, filtersReset, sortChanged, exploreAllChanged, discoveryReset, technologiesExplored, discoverReset } = discoverSlice.actions;

/** Counts the course's technologies as explored. Looks the technologies up in the catalog metadata, so a course with none changes nothing. */
export const recordCourseOpened = (courseId: string) => technologiesExplored(courseMeta({ id: courseId }).technologies);

type WithDiscover = { discover: DiscoverState };

export const selectDiscoverQuery = (state: WithDiscover) => state.discover.query;
export const selectDiscoverFilters = (state: WithDiscover) => state.discover.filters;
export const selectDiscoverSort = (state: WithDiscover) => state.discover.sort;
export const selectDiscoverTab = (state: WithDiscover) => state.discover.tab;
export const selectExploredTechnologies = (state: WithDiscover) => state.discover.exploredTechnologies;

/**
 * Whether the results view shows instead of the personalised home: a search, a filter, or any tab but For you. Before the
 * learner's profile is known (`personalized` unset) a tab they never chose counts as For you.
 */
export function isBrowsing(state: Pick<DiscoverState, 'query' | 'filters' | 'tab'>, personalized = true): boolean {
  return state.query.trim() !== '' || hasActiveFilters(state.filters) || resolveTab(state.tab, personalized) !== 'for-you';
}
