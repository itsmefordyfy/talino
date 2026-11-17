import { ScrollView, StyleSheet, View } from 'react-native';

import { ContentWidthProvider } from '@/components/content-width';
import { SettingsButton } from '@/components/settings-button';
import { TabHeader } from '@/components/tab-header';
import { useScreenPadding } from '@/components/ui/screen';
import { TabSkeleton } from '@/components/tab-skeleton';
import { catalogFacts } from '@/features/courses';
import { MaxContentWidth, Spacing, WideContentMaxWidth, SideFiltersMinWidth } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useSplitView } from '@/hooks/use-split-view';
import { useTabWarmup } from '@/hooks/use-tab-warmup';
import { useViewportSettling } from '@/hooks/use-viewport-settling';
import { useTwoUp } from '@/hooks/use-two-up';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { DiscoverTabs } from '../components/discover-tabs';
import { FilterPanel } from '../components/filter-panel';
import { HomeView } from '../components/home-view';
import { ResultsView } from '../components/results-view';
import { SearchField } from '../components/search-field';
import { queryChanged, selectDiscoverQuery } from '../discover-slice';
import { useDiscoverTab, useIsBrowsing } from '../hooks/use-discover-tab';
import { tabCounts } from '../lib/tabs';
import { discoverStrings } from '../strings';

/**
 * Discover, the Courses tab. The search box and the category tabs (For you, All, one per category) stay pinned at the top; below
 * them is either the personalised home (the For you tab, nothing typed, no filter) or the results: the whole catalog (All, or any
 * search), or one category's courses by difficulty, narrowed by the filters. On a wide window the filters sit in a side column.
 */
export function DiscoverScreen() {
  // Measured, so beside an iPad's sidebar the filter column follows the width left for Discover rather than the window's.
  return (
    <ContentWidthProvider>
      <DiscoverContent />
    </ContentWidthProvider>
  );
}

function DiscoverContent() {
  const strings = useLocalized(discoverStrings);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const padding = useScreenPadding('tab');
  const wide = useTwoUp();
  // Filters beside the results need room for the filter column and two columns of cards: an iPad mini upright has neither.
  const roomy = useSplitView(SideFiltersMinWidth);
  const query = useAppSelector(selectDiscoverQuery);
  const browsing = useIsBrowsing();
  const { tab, setTab } = useDiscoverTab();
  // Sideways lists run to the screen's edge, inside the safe area.
  const bleed = Math.min(padding.paddingLeft, padding.paddingRight);
  const width = wide ? WideContentMaxWidth : MaxContentWidth;
  const sideFilters = roomy && browsing;
  const settling = useViewportSettling();
  const warming = useTabWarmup();

  // The saved tab is still being read, or the window just changed width (a fold): the tab's whole shape, not a bare header.
  if ((tab === null && query.trim() === '') || settling || warming) return <TabSkeleton variant="courses" />;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={[styles.pinned, { paddingTop: padding.paddingTop, paddingLeft: padding.paddingLeft, paddingRight: padding.paddingRight }]}>
        <View style={[styles.inner, { maxWidth: width }]}>
          <TabHeader title={strings.title} accessory={<SettingsButton />} />
          <SearchField value={query} onChangeText={(text) => dispatch(queryChanged(text))} placeholder={strings.searchPlaceholder} label={strings.searchLabel} clearLabel={strings.clearSearch} />
          {/* While a search is covering every category no tab is shown as chosen; clearing the search brings the chosen tab back. */}
          <DiscoverTabs selected={query.trim() !== '' ? null : tab} counts={tabCounts(catalogFacts())} onSelect={setTab} bleed={bleed} />
        </View>
      </View>
      <View style={[styles.body, { paddingLeft: padding.paddingLeft, paddingRight: padding.paddingRight }]}>
        <View style={[styles.inner, styles.bodyInner, { maxWidth: width }]}>
          {browsing ? (
            <View style={styles.split}>
              {sideFilters && <FilterPanel paddingBottom={padding.paddingBottom} />}
              <View style={styles.results}>
                <ResultsView columns={wide ? 2 : 1} paddingLeft={sideFilters ? Spacing.three : 0} paddingRight={0} paddingBottom={padding.paddingBottom} />
              </View>
            </View>
          ) : (
            // No Filters or Sort here: they narrow a list, and For you is picks, not a list (owner, 2026-11-17: remove what is redundant).
            <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingTop: Spacing.three, paddingBottom: padding.paddingBottom }}>
              <HomeView />
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  pinned: {
    alignItems: 'center',
  },
  body: {
    flex: 1,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    gap: Spacing.three,
  },
  bodyInner: {
    flex: 1,
  },
  split: {
    flex: 1,
    flexDirection: 'row',
  },
  results: {
    flex: 1,
  },
});
