import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { activeFilterList, type CatalogFilters } from '@/features/courses';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';
import { useAppDispatch } from '@/store/hooks';

import { filterRemoved } from '../discover-slice';
import { discoverStrings } from '../strings';

export type ActiveFiltersProps = { filters: CatalogFilters };

/** One removable chip per chosen filter, so what is narrowing the list is always in view and one tap from gone. */
export function ActiveFilters({ filters }: ActiveFiltersProps) {
  const strings = useLocalized(discoverStrings);
  const language = useLanguage();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const list = activeFilterList(filters, language);
  if (list.length === 0) return null;
  return (
    <View style={styles.wrap} accessibilityLabel={strings.activeFilters}>
      {list.map((filter) => (
        <Pressable
          key={`${filter.dimension}:${filter.value}`}
          accessibilityRole="button"
          accessibilityLabel={strings.removeFilter(filter.label)}
          onPress={() => {
            tapFeedback();
            dispatch(filterRemoved({ dimension: filter.dimension, value: filter.value }));
          }}
          style={({ pressed }) => [styles.chip, { backgroundColor: theme.primarySoft, borderColor: theme.primary }, pressed && styles.pressed]}>
          <ThemedText type="secondarySemiBold" themeColor="primaryText" numberOfLines={1} style={styles.label}>
            {filter.label}
          </ThemedText>
          <Icon name="close" size={14} color="primary" />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
    minHeight: MinTouchSize,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.two + Spacing.one,
    borderRadius: Radius.pill,
    borderWidth: 1,
    maxWidth: '100%',
  },
  label: {
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
