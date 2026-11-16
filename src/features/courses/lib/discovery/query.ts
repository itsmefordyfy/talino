import { CATEGORY_IDS, LEARNING_GOAL_IDS } from '../../content/types';
import { COURSE_ACCESS, COURSE_TYPES, DURATION_BUCKETS, type CourseFacts } from '../catalog-facts';
import { LEARNING_LEVELS } from '../learning-level';
import { type CatalogFilters, type FilterContext, type FilterDimension, type FilterValue, applyFilters, isAiTool, matchesFilters, PROGRESS_STATUSES, valuesOf } from './filters';
import { matchCatalog, searchCatalog } from './search';
import { type SortContext, type SortKey, rankOf, sortCourses } from './sort';

import { TECHNOLOGIES } from '../../content/catalog/technologies';

/** What a discovery query reads besides the catalog: the recommendation ranks (for sorting) and the learner's progress (for filtering). */
export type QueryContext = SortContext & FilterContext;

export type DiscoveryQuery = { text: string; filters: CatalogFilters; sort: SortKey };

export type DiscoveryResult = {
  results: CourseFacts[];
  /** How many courses matched (the length of `results`; nothing is paged here). */
  total: number;
  /** How many courses were searched, for "12 of 73 courses". */
  catalogSize: number;
  /** For a search: the fields each result matched (`title`, `technology`, `tag`...), strongest first. Empty without text. */
  matched: Map<string, string[]>;
};

const hasText = (text: string) => text.trim() !== '';

/**
 * Filter, then search, then sort. With search text and the `recommended` sort the order is search relevance (the
 * recommended rank only breaks ties between equally good matches); any other sort replaces relevance, with ties in
 * catalog order.
 */
export function runDiscovery(facts: readonly CourseFacts[], query: DiscoveryQuery, context: QueryContext = {}): DiscoveryResult {
  const filtered = applyFilters(facts, query.filters, context);
  const matched = new Map<string, string[]>();
  if (!hasText(query.text)) {
    const results = sortCourses(filtered, query.sort, context);
    return { results, total: results.length, catalogSize: facts.length, matched };
  }
  // Search the WHOLE catalog, then filter: whether a word needs typo tolerance must not depend on which filters are on, or "react" inside
  // one category could fuzzily match "reach" while the same word over everything does not. (facetCounts does the same, so counts agree.)
  const found = searchCatalog(facts, query.text).filter((item) => matchesFilters(item.facts, query.filters, context));
  for (const item of found) matched.set(item.facts.id, item.matched);
  let results: CourseFacts[];
  if (query.sort === 'recommended') {
    const position = new Map(facts.map((fact, index) => [fact.id, index]));
    results = [...found]
      .sort((a, b) => b.score - a.score || compareRank(context, a.facts.id, b.facts.id) || (position.get(a.facts.id) ?? 0) - (position.get(b.facts.id) ?? 0))
      .map((item) => item.facts);
  } else {
    const position = new Map(facts.map((fact, index) => [fact.id, index]));
    const inCatalogOrder = found.map((item) => item.facts).sort((a, b) => (position.get(a.id) ?? 0) - (position.get(b.id) ?? 0));
    results = sortCourses(inCatalogOrder, query.sort, context);
  }
  return { results, total: results.length, catalogSize: facts.length, matched };
}

function compareRank(context: SortContext, a: string, b: string): number {
  const ra = rankOf(context, a);
  const rb = rankOf(context, b);
  return ra === rb ? 0 : ra < rb ? -1 : 1;
}

/** Every value a dimension can take; technologies are the ones some course lists, most common first. */
export function facetValues<D extends FilterDimension>(facts: readonly CourseFacts[], dimension: D): FilterValue<D>[] {
  const values: readonly string[] =
    dimension === 'categories'
      ? CATEGORY_IDS
      : dimension === 'levels'
        ? LEARNING_LEVELS
        : dimension === 'types'
          ? // "Free" is the Access filter's job; the type list keeps what kind of course it is.
            COURSE_TYPES.filter((type) => type !== 'free')
          : dimension === 'access'
            ? COURSE_ACCESS
            : dimension === 'progress'
              ? PROGRESS_STATUSES
              : dimension === 'goals'
                ? LEARNING_GOAL_IDS
                : dimension === 'durations'
                  ? DURATION_BUCKETS
                  : dimension === 'tools'
                    ? popularTechnologies(facts).filter(isAiTool)
                    : popularTechnologies(facts).filter((id) => !isAiTool(id));
  return [...values] as FilterValue<D>[];
}

/**
 * How many results the query would have if each value were added to its dimension (so a value already chosen shows the
 * current total), given the search text and the OTHER dimensions' filters. Equal to `runDiscovery(toggleFilterValue(...)).total`
 * for a value that is not chosen yet; a count of 0 is an option that leads nowhere.
 */
export function facetCounts<D extends FilterDimension>(facts: readonly CourseFacts[], query: Pick<DiscoveryQuery, 'text' | 'filters'>, dimension: D, context: FilterContext = {}): Map<FilterValue<D>, number> {
  const others = { ...query.filters, [dimension]: [] } as CatalogFilters;
  const base = hasText(query.text) ? matchCatalog(facts, query.text).filter((fact) => matchesFilters(fact, others, context)) : applyFilters(facts, others, context);
  const chosen: readonly string[] = query.filters[dimension] ?? [];
  const inChosen = (fact: CourseFacts) => chosen.length > 0 && matchesFilters(fact, { ...others, [dimension]: chosen } as CatalogFilters, context);
  const counts = new Map<string, number>();
  const values = facetValues(facts, dimension) as string[];
  for (const value of values) counts.set(value, 0);
  let alreadyIn = 0;
  for (const fact of base) {
    if (inChosen(fact)) {
      alreadyIn += 1;
      continue;
    }
    for (const value of valuesOf(fact, dimension, context)) {
      const current = counts.get(value);
      if (current !== undefined) counts.set(value, current + 1);
    }
  }
  if (alreadyIn > 0) for (const value of values) counts.set(value, (counts.get(value) ?? 0) + alreadyIn);
  return counts as Map<FilterValue<D>, number>;
}

/** The technologies the owner names first in the filter, when some course lists them. */
export const FEATURED_TECHNOLOGIES: readonly string[] = ['claude-code', 'cursor', 'codex', 'chatgpt', 'claude', 'gemini', 'copilot', 'vibe-tools', 'mcp', 'openai', 'react', 'react-native', 'expo', 'supabase', 'postgresql', 'python'];

/**
 * Every technology at least one course lists, the featured ones first (in their order), then the rest by how many courses
 * list them (most first; ties in the vocabulary's order). `limit` cuts the list.
 */
export function popularTechnologies(facts: readonly CourseFacts[], limit = Number.POSITIVE_INFINITY): string[] {
  const counts = new Map<string, number>();
  for (const fact of facts) for (const id of new Set(fact.technologies)) counts.set(id, (counts.get(id) ?? 0) + 1);
  const vocabulary = new Map(TECHNOLOGIES.map((technology, index) => [technology.id, index]));
  const featured = FEATURED_TECHNOLOGIES.filter((id) => counts.has(id));
  const rest = [...counts.keys()]
    .filter((id) => !FEATURED_TECHNOLOGIES.includes(id))
    .sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0) || (vocabulary.get(a) ?? 1e9) - (vocabulary.get(b) ?? 1e9) || a.localeCompare(b));
  return [...featured, ...rest].slice(0, limit);
}
