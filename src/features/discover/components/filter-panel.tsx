import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { activeFilterCount, hasActiveFilters } from '@/features/courses';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { filtersReset, selectDiscoverFilters } from '../discover-slice';
import { discoverStrings } from '../strings';
import { FilterGroups } from './filter-groups';

/** The wide layout's side column: the same filter groups as the phone's sheet, always in view beside the results. */
export function FilterPanel({ paddingBottom }: { paddingBottom: number }) {
  const strings = useLocalized(discoverStrings);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectDiscoverFilters);
  return (
    <ScrollView style={[styles.panel, { borderColor: theme.border }]} contentContainerStyle={[styles.content, { paddingBottom }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <ThemedText type="section" accessibilityRole="header" style={styles.title}>
          {strings.filtersTitle}
          {activeFilterCount(filters) > 0 ? ` (${activeFilterCount(filters)})` : ''}
        </ThemedText>
        {hasActiveFilters(filters) && <Button title={strings.reset} variant="ghost" size="small" onPress={() => dispatch(filtersReset())} />}
      </View>
      <FilterGroups />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: 320,
    flexGrow: 0,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  content: {
    gap: Spacing.three,
    paddingTop: Spacing.three,
    paddingRight: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  title: {
    flexShrink: 1,
  },
});
