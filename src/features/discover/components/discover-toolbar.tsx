import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { activeFilterCount, sortOptions } from '@/features/courses';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useSplitView } from '@/hooks/use-split-view';
import { Spacing, SideFiltersMinWidth } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';

import { selectDiscoverFilters, selectDiscoverSort } from '../discover-slice';
import { discoverStrings } from '../strings';
import { ToolbarButton } from './toolbar-button';

/**
 * Filters (with how many are chosen) and Sort (with the current one), above the results (never on For you). A phone opens the
 * filters in a sheet; a roomy window shows them in a column beside the results, so there only Sort is here.
 */
export function DiscoverToolbar() {
  const strings = useLocalized(discoverStrings);
  const language = useLanguage();
  // The filters sit in a side column only when the window is roomy (an iPad Air or Pro); an iPad mini upright keeps the sheet.
  const sidePanel = useSplitView(SideFiltersMinWidth);
  const filters = useAppSelector(selectDiscoverFilters);
  const sort = useAppSelector(selectDiscoverSort);
  const filterCount = activeFilterCount(filters);
  const sortLabel = sortOptions(language).find((option) => option.key === sort)?.label ?? '';
  return (
    <View style={styles.toolbar}>
      {!sidePanel && (
        <ToolbarButton
          icon="tune"
          label={strings.filters}
          count={filterCount}
          accessibilityLabel={filterCount > 0 ? strings.filtersCount(filterCount) : strings.filters}
          onPress={() => router.push('/discover-filters')}
        />
      )}
      <ToolbarButton icon="swap_vert" label={strings.sortLabel(sortLabel)} accessibilityLabel={strings.sortA11y(sortLabel)} onPress={() => router.push('/discover-sort')} shrink />
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
