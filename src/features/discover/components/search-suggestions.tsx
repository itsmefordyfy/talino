import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import type { SearchSuggestion } from '@/features/courses';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { browseStrings } from '../browse-strings';
import { categorySelected, filterToggled, queryChanged, selectDiscoverFilters } from '../discover-slice';

export type SearchSuggestionsProps = {
  suggestions: readonly SearchSuggestion[];
  /** A heading above the chips ("Try one of these"); none by default. */
  title?: string;
  /** Overrides what a tap does (Discover home's tool chips open a clean list for the tool). */
  onChoose?: (suggestion: SearchSuggestion) => void;
};

const ICONS: Record<SearchSuggestion['kind'], IconName> = { tool: 'smart_toy', technology: 'code', category: 'category', level: 'stairs', topic: 'search', course: 'school' };

/**
 * Suggestions from the real catalog under the search box. A tool, technology or level becomes a filter (and the typed words
 * clear, so the list is that filter's courses), a category opens its tab, a topic becomes the search, a course opens.
 */
export function SearchSuggestions({ suggestions, title, onChoose }: SearchSuggestionsProps) {
  const strings = useLocalized(browseStrings);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectDiscoverFilters);
  if (suggestions.length === 0) return null;

  const choose = (suggestion: SearchSuggestion) => {
    tapFeedback();
    if (onChoose) {
      onChoose(suggestion);
      return;
    }
    switch (suggestion.kind) {
      case 'course':
        router.push({ pathname: '/course/[id]', params: { id: suggestion.id } });
        return;
      case 'category':
        dispatch(categorySelected(suggestion.id));
        return;
      case 'topic':
        dispatch(queryChanged(suggestion.label));
        return;
      default: {
        const dimension = suggestion.kind === 'tool' ? 'tools' : suggestion.kind === 'level' ? 'levels' : 'technologies';
        // Adding, never toggling off: the learner asked for this one.
        if (!(filters[dimension] ?? []).includes(suggestion.id as never)) dispatch(filterToggled({ dimension, value: suggestion.id }));
        dispatch(queryChanged(''));
      }
    }
  };

  return (
    <View style={styles.block} accessibilityLabel={title ?? strings.suggestionsLabel}>
      {title && (
        <ThemedText type="secondarySemiBold" themeColor="textSecondary">
          {title}
        </ThemedText>
      )}
      <View style={styles.wrap}>
        {suggestions.map((suggestion) => (
          <Pressable
            key={`${suggestion.kind}:${suggestion.id}`}
            accessibilityRole="button"
            accessibilityLabel={strings.suggestionA11y(strings.suggestionKinds[suggestion.kind], suggestion.label, suggestion.kind === 'course' ? null : suggestion.count)}
            onPress={() => choose(suggestion)}
            style={({ pressed }) => [styles.chip, { backgroundColor: theme.backgroundElement, borderColor: theme.border }, pressed && styles.pressed]}>
            <Icon name={ICONS[suggestion.kind]} size={16} color="primary" />
            <ThemedText type="secondarySemiBold" numberOfLines={1} style={styles.label}>
              {suggestion.label}
            </ThemedText>
            {suggestion.kind !== 'course' && (
              <ThemedText type="caption" themeColor="textTertiary" tabular>
                {suggestion.count}
              </ThemedText>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: Spacing.two,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    minHeight: MinTouchSize,
    maxWidth: '100%',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  label: {
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
