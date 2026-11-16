import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { sortOptions } from '@/features/courses';
import { useLanguage } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { selectDiscoverSort, sortChanged } from '../discover-slice';

/**
 * How the courses are ordered, each choice with its one-line description (the words come from the discovery engine, so they
 * can't drift). There is no "Most popular": Talino has no enrollment data to rank by.
 */
export function SortScreen() {
  const theme = useTheme();
  const language = useLanguage();
  const dispatch = useAppDispatch();
  const sort = useAppSelector(selectDiscoverSort);
  return (
    <Screen>
      <View style={styles.list}>
        {sortOptions(language).map((option) => {
          const selected = option.key === sort;
          return (
            <Pressable
              key={option.key}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${option.label}. ${option.description}`}
              onPress={() => {
                tapFeedback();
                dispatch(sortChanged(option.key));
                router.back();
              }}
              style={({ pressed }) => [styles.row, { backgroundColor: selected ? theme.primarySoft : theme.backgroundElement, borderColor: selected ? theme.primary : theme.border }, pressed && styles.pressed]}>
              <View style={styles.text}>
                <ThemedText type="cardTitle" themeColor={selected ? 'primaryText' : 'text'}>
                  {option.label}
                </ThemedText>
                <ThemedText type="secondary" themeColor="textSecondary">
                  {option.description}
                </ThemedText>
              </View>
              {selected && <Icon name="check" size={20} color="primary" />}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: MinTouchSize,
    padding: Spacing.three,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  pressed: {
    opacity: 0.8,
  },
});
