import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';
import type { IconName } from '@/components/ui/icon';
import { LevelTones, Spacing } from '@/constants/theme';
import { popularTechnologies, technologyLabel, type CourseFacts } from '@/features/courses/data';
import { isAiTool } from '@/features/courses/lib/discovery/filters';
import { useLocalized } from '@/hooks/use-strings';
import { useTwoUp } from '@/hooks/use-two-up';
import { useAppDispatch } from '@/store/hooks';

import { browseStrings } from '../browse-strings';
import { browsedBy } from '../discover-slice';
import { levelBrowse } from '../lib/browse';
import { SearchSuggestions } from './search-suggestions';


/** Cards in rows of `columns`, every card the same width (a short last row keeps empty cells). */
function Grid<T>({ items, columns, render, keyOf }: { items: readonly T[]; columns: number; render: (item: T) => ReactNode; keyOf: (item: T) => string }) {
  const rows: (T | null)[][] = [];
  for (let start = 0; start < items.length; start += columns) {
    const row: (T | null)[] = items.slice(start, start + columns);
    while (row.length < columns) row.push(null);
    rows.push(row);
  }
  return (
    <View style={styles.grid}>
      {rows.map((row, index) => (
        <View key={index} style={styles.row}>
          {row.map((item, cell) => (
            <View key={item ? keyOf(item) : `empty-${cell}`} style={styles.cell}>
              {item ? render(item) : null}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/** "Browse by level": the four learning levels, each a tile that opens every course of that level. */
export function LevelTiles({ facts }: { facts: readonly CourseFacts[] }) {
  const strings = useLocalized(browseStrings);
  const dispatch = useAppDispatch();
  const wide = useTwoUp();
  return (
    <Grid
      items={levelBrowse(facts)}
      columns={wide ? 4 : 2}
      keyOf={(entry) => entry.level}
      render={(entry) => (
        <Card onPress={() => dispatch(browsedBy({ dimension: 'levels', value: entry.level }))} accessibilityLabel={`${strings.levelTile(entry.label, entry.count)}. ${entry.description}`} style={styles.fill}>
          <View style={styles.tile}>
            <View style={styles.tileTop}>
              <IconTile icon={entry.icon as IconName} tone={LevelTones[entry.level]} size={36} />
              <ThemedText type="caption" themeColor="textSecondary" tabular>
                {entry.count}
              </ThemedText>
            </View>
            <ThemedText type="cardTitle" numberOfLines={1}>
              {entry.label}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" numberOfLines={3}>
              {entry.description}
            </ThemedText>
          </View>
        </Card>
      )}
    />
  );
}

/** "Learn an AI tool": the AI tools the catalog teaches, most-taught first; a tap lists every course on that tool. */
export function ToolChips({ facts, limit = 10 }: { facts: readonly CourseFacts[]; limit?: number }) {
  const dispatch = useAppDispatch();
  const counts = new Map<string, number>();
  for (const fact of facts) for (const id of new Set(fact.technologies)) counts.set(id, (counts.get(id) ?? 0) + 1);
  const tools = popularTechnologies(facts)
    .filter(isAiTool)
    .slice(0, limit)
    .map((id) => ({ kind: 'tool' as const, id, label: technologyLabel(id), count: counts.get(id) ?? 0 }));
  // The same chips as search suggestions, but a tap here opens a clean list for the tool.
  return <SearchSuggestions suggestions={tools} onChoose={(suggestion) => dispatch(browsedBy({ dimension: 'tools', value: suggestion.id }))} />;
}

const styles = StyleSheet.create({
  grid: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  cell: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  tile: {
    gap: Spacing.one,
  },
  tileTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.one,
  },
});
