import { useDeferredValue } from 'react';

import { catalogFacts, runDiscovery, type CourseFacts, type DiscoveryResult } from '@/features/courses';
import { recommendCourses } from '@/features/courses/lib/recommendations';
import { useAppSelector } from '@/store/hooks';

import { selectDiscoverFilters, selectDiscoverQuery, selectDiscoverSort, type DiscoverTab } from '../discover-slice';
import { memoByKey, progressStatusOf, signalsKey } from '../lib/learner';
import { scopeFacts } from '../lib/tabs';
import { useDiscoverTab } from './use-discover-tab';
import { useLearnerSignals } from './use-learner-signals';

const rankCache = memoByKey<ReadonlyMap<string, number>>();

export type CatalogDiscovery = DiscoveryResult & {
  /** The courses the tab covers (the whole catalog for For you, All and any search; one category's courses on a category tab). */
  facts: readonly CourseFacts[];
  /** The tab in effect (null until the learner's profile is read). */
  tab: DiscoverTab | null;
  /** The results are one category's courses (a category tab with no search). */
  inCategory: boolean;
  /** The search text the results were computed for (it trails the typing by a frame so typing never waits for a search). */
  text: string;
  isPending: boolean;
};

/**
 * The catalog, searched, filtered and sorted by what the learner chose on Discover. The "Recommended" sort is real:
 * it is the recommendation engine's ranking of every course for this learner's answers and progress. Nothing here hides a
 * course: with no search text and no filters the result is the entire catalog.
 */
export function useCatalogDiscovery(): CatalogDiscovery {
  const everything = catalogFacts();
  const typed = useAppSelector(selectDiscoverQuery);
  const filters = useAppSelector(selectDiscoverFilters);
  const sort = useAppSelector(selectDiscoverSort);
  const learner = useLearnerSignals();
  const { tab } = useDiscoverTab();
  // Typing updates the box at once; the search follows when React has a spare moment, so the keyboard never waits for it.
  const text = useDeferredValue(typed);
  const recommendedRank = rankCache(signalsKey(learner.signals), () => new Map(recommendCourses(learner.signals, everything, { scope: 'everything' }).map((entry, index) => [entry.facts.id, index])));
  // Filters combine with the tab; a search covers the whole catalog whatever the tab.
  const facts = scopeFacts(everything, tab, text);
  // The Progress filter reads the learner's real progress; nothing else here depends on it.
  const result = runDiscovery(facts, { text, filters, sort }, { recommendedRank, progressOf: progressStatusOf(learner.signals) });
  return { ...result, facts, tab, inCategory: facts !== everything, text, isPending: learner.isPending };
}
