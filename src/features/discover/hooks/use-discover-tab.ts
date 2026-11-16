import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { isBrowsing, resolveTab, selectDiscoverTab, tabChanged, type DiscoverTab } from '../discover-slice';
import { useLearnerSignals } from './use-learner-signals';

/**
 * The tab in effect. A learner who never chose one gets For you when they have a profile and All when they have none; until
 * their profile has been read that is not known, so `tab` is null (the screen shows its skeleton instead of flashing the wrong tab).
 */
export function useDiscoverTab(): { tab: DiscoverTab | null; chosen: DiscoverTab | null; personalized: boolean; setTab: (tab: DiscoverTab) => void } {
  const dispatch = useAppDispatch();
  const chosen = useAppSelector(selectDiscoverTab);
  const learner = useLearnerSignals();
  return {
    tab: chosen ?? (learner.isPending ? null : resolveTab(null, learner.personalized)),
    chosen,
    personalized: learner.personalized,
    setTab: (tab) => dispatch(tabChanged(tab)),
  };
}

/** Whether the results view shows instead of the personalised home (a search, a filter, or a tab other than For you). */
export function useIsBrowsing(): boolean {
  const state = useAppSelector((root) => root.discover);
  const { tab } = useDiscoverTab();
  // Until the profile is read (no tab yet) nothing is browsing: the screen shows a skeleton.
  return tab === null ? state.query.trim() !== '' : isBrowsing({ ...state, tab }, true);
}
