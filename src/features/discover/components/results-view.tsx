import { router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { Spacing } from '@/constants/theme';
import { catalogFacts, categoryText, CourseCard, hasActiveFilters, learningLevelLabel, searchSuggestions, starterSuggestions } from '@/features/courses';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { exploreAllChanged, filtersReset, queryChanged, selectDiscoverFilters } from '../discover-slice';
import { useCatalogDiscovery } from '../hooks/use-catalog-discovery';
import { useCourseOffers } from '../hooks/use-course-offers';
import { useDiscoverTab } from '../hooks/use-discover-tab';
import { buildRows, type ListItem } from '../lib/tabs';
import { discoverStrings } from '../strings';
import { tabStrings } from '../tab-strings';
import { browseStrings } from '../browse-strings';
import { ActiveFilters } from './active-filters';
import { SearchSuggestions } from './search-suggestions';
import { DiscoverToolbar } from './discover-toolbar';

/** How many rows the list draws before the first scroll: the rest are drawn as the learner scrolls. */
const FIRST_SCREEN = 6;

export type ResultsViewProps = {
  /** Columns of cards (1 on a phone, 2 on a wide window). */
  columns: number;
  /** Padding to give the list so it lines up with the screen's content. */
  paddingLeft: number;
  paddingRight: number;
  paddingBottom: number;
};

/**
 * What the tabs, the search and the filters give: the whole catalog on All (and for any search, whichever tab), or one
 * category's courses grouped by difficulty, beginner first. Shows how many matched, the chosen filters as removable chips and
 * a helpful empty state.
 */
export function ResultsView({ columns, paddingLeft, paddingRight, paddingBottom }: ResultsViewProps) {
  const strings = useLocalized(discoverStrings);
  const browse = useLocalized(browseStrings);
  const tabText = useLocalized(tabStrings);
  const language = useLanguage();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectDiscoverFilters);
  const discovery = useCatalogDiscovery();
  const { personalized } = useDiscoverTab();
  const { offerFor } = useCourseOffers();
  const searching = discovery.text.trim() !== '';
  const category = discovery.inCategory && discovery.tab && discovery.tab !== 'all' && discovery.tab !== 'for-you' ? discovery.tab : null;
  const items = buildRows(discovery.results, columns, category !== null);
  // Courses of every category are mixed here (All, or a search), so each card names its own.
  const mixed = category === null;

  const heading = category ? categoryText(category, language) : searching ? { label: tabText.searchingAll, description: '' } : { label: tabText.allTitle, description: tabText.allNote };
  const filtered = hasActiveFilters(filters);
  // Suggestions come from the whole published catalog, whatever the tab and filters, so they can lead somewhere new.
  const suggestions = searching ? searchSuggestions(catalogFacts(), discovery.text) : [];

  const header = (
    <View style={styles.header}>
      <DiscoverToolbar />
      {!personalized && !searching && !filtered && category === null && discovery.tab === 'all' && (
        <Card onPress={() => router.push('/learning-profile')} accessibilityLabel={`${strings.personalizeTitle}. ${strings.personalizeBody}`}>
          <View style={styles.personalize}>
            <View style={styles.flex}>
              <ThemedText type="cardTitle">{strings.personalizeTitle}</ThemedText>
              <ThemedText type="secondary" themeColor="textSecondary">
                {strings.personalizeBody}
              </ThemedText>
            </View>
            <Icon name="chevron_right" size={20} color="textTertiary" />
          </View>
        </Card>
      )}
      {suggestions.length > 0 && discovery.total > 0 && <SearchSuggestions suggestions={suggestions} />}
      <View style={styles.heading}>
        <ThemedText type="section" accessibilityRole="header">
          {heading.label}
        </ThemedText>
        {heading.description !== '' && (
          <ThemedText type="secondary" themeColor="textSecondary">
            {heading.description}
          </ThemedText>
        )}
      </View>
      <View style={styles.countRow}>
        <ThemedText type="bodySemiBold" accessibilityLiveRegion="polite" accessibilityLabel={strings.resultCountA11y(discovery.total, discovery.catalogSize)} tabular style={styles.count}>
          {strings.resultCount(discovery.total, discovery.catalogSize)}
        </ThemedText>
        {filtered && <Button title={strings.resetFilters} variant="ghost" size="small" onPress={() => dispatch(filtersReset())} />}
      </View>
      <ActiveFilters filters={filters} />
    </View>
  );

  // A category with no course at all (before filters and search): explain, instead of the "no match" message.
  const categoryEmpty = category !== null && discovery.catalogSize === 0;
  const empty = discovery.isPending ? (
    <View style={styles.skeletons}>
      {[0, 1, 2].map((key) => (
        <SkeletonBlock key={key} height={200} />
      ))}
    </View>
  ) : categoryEmpty ? (
    <View style={styles.empty}>
      <ThemedText type="cardTitle" style={styles.emptyText}>
        {tabText.emptyCategoryTitle(heading.label)}
      </ThemedText>
      <ThemedText type="secondary" themeColor="textSecondary" style={styles.emptyText}>
        {tabText.emptyCategoryBody}
      </ThemedText>
      <View style={styles.emptyActions}>
        <Button title={tabText.showAllCourses} variant="secondary" onPress={() => dispatch(exploreAllChanged(true))} />
      </View>
    </View>
  ) : (
    <View style={styles.empty}>
      <ThemedText type="secondary" themeColor="textSecondary" style={styles.emptyText}>
        {strings.emptyBody(discovery.text)}
      </ThemedText>
      <View style={styles.emptyActions}>
        {filtered && <Button title={strings.resetFilters} variant="secondary" onPress={() => dispatch(filtersReset())} />}
        {searching && <Button title={strings.clearSearchButton} variant={filtered ? 'outline' : 'secondary'} onPress={() => dispatch(queryChanged(''))} />}
      </View>
      {/* Nothing matched: what the words come close to in the catalog, else the tools most courses teach and the Beginner level. */}
      <SearchSuggestions suggestions={suggestions.length > 0 ? suggestions : starterSuggestions(catalogFacts())} title={browse.tryTitle} />
    </View>
  );

  return (
    <FlatList<ListItem>
      // A new column count needs a new list.
      key={columns}
      data={discovery.isPending ? [] : items}
      keyExtractor={(item) => item.key}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      initialNumToRender={FIRST_SCREEN}
      maxToRenderPerBatch={FIRST_SCREEN}
      windowSize={7}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={[styles.content, { paddingLeft, paddingRight, paddingBottom }]}
      renderItem={({ item }) => {
        if (item.type === 'header') {
          return (
            <ThemedText type="cardTitle" themeColor="textSecondary" accessibilityRole="header" style={styles.level}>
              {tabText.levelSection(learningLevelLabel(item.level), item.count)}
            </ThemedText>
          );
        }
        return (
          <View style={styles.columns}>
            {item.cells.map((cell, index) => {
              // The empty cell keeps a last, lone card the width of the others.
              if (!cell) return <View key={`filler-${index}`} style={styles.cell} />;
              const offer = offerFor(cell.id);
              return (
                <View key={cell.id} style={styles.cell}>
                  <CourseCard variant="discovery" course={cell.course} facts={cell} showCategory={mixed} progress={offer.progress} owned={offer.owned} />
                </View>
              );
            })}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.three,
    paddingTop: Spacing.three,
  },
  header: {
    gap: Spacing.three,
    paddingBottom: Spacing.one,
  },
  flex: {
    flex: 1,
  },
  personalize: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  heading: {
    gap: Spacing.one,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  count: {
    flexShrink: 1,
  },
  level: {
    paddingTop: Spacing.two,
  },
  columns: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  cell: {
    flex: 1,
  },
  skeletons: {
    gap: Spacing.three,
  },
  empty: {
    gap: Spacing.three,
    paddingTop: Spacing.three,
  },
  emptyText: {
    textAlign: 'center',
  },
  emptyActions: {
    gap: Spacing.two,
  },
});
