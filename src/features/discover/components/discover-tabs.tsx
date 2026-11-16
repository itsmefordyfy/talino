import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { MinTouchSize, Spacing } from '@/constants/theme';
import { categoryLabel } from '@/features/courses';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import type { DiscoverTab } from '../discover-slice';
import { CATEGORY_TABS, type TabCounts } from '../lib/tabs';
import { tabStrings } from '../tab-strings';

export type DiscoverTabsProps = {
  /** The tab in effect, or null while none is shown as chosen (a search is covering every category). */
  selected: DiscoverTab | null;
  counts: TabCounts;
  onSelect: (tab: DiscoverTab) => void;
  /** Space the strip runs past its container on each side, so tabs scroll to the screen's edge. */
  bleed?: number;
};

type Entry = { id: DiscoverTab; label: string; fullLabel: string; count: number | null };

/**
 * The tabs under the search box: For you, All, then one per category in the catalog's order, each with its course count. A
 * scrolling strip (the category names are long), drawn as tabs: the chosen one is bold, brand-coloured and underlined, so it
 * never reads as a filter chip. The chosen tab scrolls into view; with Reduce Motion it jumps instead of gliding.
 */
export function DiscoverTabs({ selected, counts, onSelect, bleed = 0 }: DiscoverTabsProps) {
  const strings = useLocalized(tabStrings);
  const language = useLanguage();
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const scroll = useRef<ScrollViewInstance>(null);
  const viewport = useRef(0);
  const frames = useRef(new Map<string, { x: number; width: number }>());

  const entries: Entry[] = [
    { id: 'for-you', label: strings.forYou, fullLabel: strings.forYou, count: null },
    { id: 'all', label: strings.all, fullLabel: strings.all, count: counts.all },
    ...CATEGORY_TABS.map((category): Entry => ({ id: category, label: strings.short[category], fullLabel: categoryLabel(category, language), count: counts.byCategory[category] })),
  ];

  const reveal = (id: DiscoverTab, animated: boolean) => {
    const frame = frames.current.get(id);
    if (!frame || viewport.current === 0) return;
    scroll.current?.scrollTo({ x: Math.max(0, frame.x - (viewport.current - frame.width) / 2), animated });
  };
  useEffect(() => {
    if (selected) reveal(selected, !reduceMotion);
    // The frames are measured as the tabs lay out; a later choice reads them.
  }, [selected, reduceMotion]);

  return (
    <View style={[styles.wrap, { borderColor: theme.border }, bleed > 0 && { marginHorizontal: -bleed }]}>
      <ScrollView
        ref={scroll}
        horizontal
        accessibilityRole="tablist"
        accessibilityLabel={strings.tabsLabel}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onLayout={(event) => {
          viewport.current = event.nativeEvent.layout.width;
          if (selected) reveal(selected, false);
        }}
        contentContainerStyle={[styles.row, { paddingHorizontal: bleed }]}>
        {entries.map((entry) => {
          const on = entry.id === selected;
          return (
            <Pressable
              key={entry.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              accessibilityLabel={strings.tabA11y(entry.fullLabel, entry.count)}
              onLayout={(event) => {
                frames.current.set(entry.id, { x: event.nativeEvent.layout.x, width: event.nativeEvent.layout.width });
                if (on) reveal(entry.id, false);
              }}
              onPress={() => {
                if (on) return;
                tapFeedback();
                onSelect(entry.id);
              }}
              style={({ pressed }) => [styles.tab, pressed && styles.pressed]}>
              <View style={styles.label}>
                <ThemedText type="secondarySemiBold" themeColor={on ? 'primaryText' : 'textSecondary'} numberOfLines={1}>
                  {entry.label}
                </ThemedText>
                {entry.count !== null && (
                  <ThemedText type="caption" themeColor={on ? 'primaryText' : 'textTertiary'} tabular>
                    {entry.count}
                  </ThemedText>
                )}
              </View>
              {/* The underline is drawn for every tab (clear when unchosen), so choosing one never shifts the layout. */}
              <View style={[styles.indicator, { backgroundColor: on ? theme.primary : 'transparent' }]} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    gap: Spacing.three,
  },
  tab: {
    minHeight: MinTouchSize,
    paddingHorizontal: Spacing.one,
  },
  label: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
  },
  indicator: {
    height: 3,
    borderRadius: 2,
    marginBottom: -StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.7,
  },
});
