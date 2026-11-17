import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { ChipSelect, type ChipOption } from '@/components/ui/chip-select';
import { EmptyState } from '@/components/ui/empty-state';
import type { IconName } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { Spacing, type Tone } from '@/constants/theme';
import { useLanguage, useLocalized } from '@/hooks/use-strings';

import { visualsFor } from '../registry';
import { visualsStrings } from '../strings';
import type { VisualCategory } from '../types';

const CATEGORY_ORDER: VisualCategory[] = ['fundamentals', 'oop', 'dsa', 'web', 'software-engineering', 'ai', 'productivity'];
const CATEGORY_ICON: Record<VisualCategory, IconName> = { fundamentals: 'data_object', oop: 'category', dsa: 'account_tree', web: 'public', 'software-engineering': 'merge_type', ai: 'smart_toy', productivity: 'schedule' };
const CATEGORY_TONE: Record<VisualCategory, Tone> = { fundamentals: 'indigo', oop: 'violet', dsa: 'indigo', web: 'mint', 'software-engineering': 'violet', ai: 'mint', productivity: 'indigo' };

type Filter = 'all' | VisualCategory;

/** Every interactive explainer, grouped by area. Each one opens full screen; lessons embed the same ones where they fit. */
export function ConceptLabScreen() {
  const strings = useLocalized(visualsStrings);
  const VISUALS = visualsFor(useLanguage());
  const [filter, setFilter] = useState<Filter>('all');
  const present = CATEGORY_ORDER.filter((category) => VISUALS.some((visual) => visual.category === category));
  const options: ChipOption<Filter>[] = [{ value: 'all', label: strings.all }, ...present.map((category) => ({ value: category, label: strings.categories[category] }))];
  const shown = VISUALS.filter((visual) => filter === 'all' || visual.category === filter).sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));

  return (
    <Screen>
      <ThemedText type="body" themeColor="textSecondary">
        {strings.intro}
      </ThemedText>
      {present.length > 0 && <ChipSelect options={options} value={filter} onChange={setFilter} />}
      {shown.length === 0 ? (
        <EmptyState icon="science" title={strings.empty} />
      ) : (
        <Card padded={false} style={styles.list}>
          {shown.map((visual) => (
            <ListRow
              key={visual.id}
              title={visual.title}
              subtitle={visual.summary}
              icon={CATEGORY_ICON[visual.category]}
              tone={CATEGORY_TONE[visual.category]}
              accessibilityLabel={strings.open(visual.title)}
              onPress={() => router.push({ pathname: '/concept-lab/[id]', params: { id: visual.id } })}
            />
          ))}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    marginBottom: Spacing.three,
  },
});
