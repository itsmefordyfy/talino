import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { activeFilterCount } from '@/features/courses';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterGroups } from '../components/filter-groups';
import { filtersReset, selectDiscoverFilters } from '../discover-slice';
import { useCatalogDiscovery } from '../hooks/use-catalog-discovery';
import { discoverStrings } from '../strings';

/**
 * The filters, in a sheet. Choices apply as they are made (the Courses tab behind already shows the new results), and the
 * footer always says how many courses they give: Reset, and "Show N courses" which closes the sheet.
 */
export function FiltersScreen() {
  const strings = useLocalized(discoverStrings);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const filters = useAppSelector(selectDiscoverFilters);
  const { total } = useCatalogDiscovery();
  const count = activeFilterCount(filters);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <FilterGroups />
      </ScrollView>
      <View style={[styles.footer, { borderColor: theme.border, backgroundColor: theme.background, paddingBottom: Math.max(insets.bottom, Spacing.three) }]}>
        <Button title={strings.reset} variant="outline" disabled={count === 0} onPress={() => dispatch(filtersReset())} style={styles.reset} />
        <Button title={total === 0 ? strings.showNoCourses : strings.showCourses(total)} disabled={total === 0} onPress={() => router.back()} style={styles.show} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    paddingBottom: Spacing.four,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  reset: {
    flexGrow: 0,
  },
  show: {
    flex: 1,
  },
});
