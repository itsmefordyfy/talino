import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import type { CareerStrings } from '../strings';
import { STAGES, type Stage } from '../types';

export type PipelineGridProps = {
  counts: Record<Stage, number>;
  strings: CareerStrings;
  onSelect: (stage: Stage) => void;
};

/** The pipeline at a glance: one tile per stage with its count; a tap lists that stage. */
export function PipelineGrid({ counts, strings, onSelect }: PipelineGridProps) {
  const theme = useTheme();
  return (
    <View style={styles.grid}>
      {STAGES.map((stage) => {
        const label = strings.stageLabel(stage, 'any');
        return (
          <Pressable
            key={stage}
            accessibilityRole="button"
            accessibilityLabel={strings.stageA11y(label, counts[stage])}
            onPress={() => {
              tapFeedback();
              onSelect(stage);
            }}
            style={({ pressed }) => [styles.tile, { backgroundColor: pressed ? theme.backgroundSelected : theme.backgroundElement, boxShadow: theme.shadowCard }]}>
            <ThemedText type="statSmall" themeColor={counts[stage] > 0 ? 'text' : 'textTertiary'} tabular>
              {String(counts[stage])}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
              {label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tile: {
    flexBasis: '30%',
    flexGrow: 1,
    minHeight: MinTouchSize + Spacing.four,
    padding: Spacing.three,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    gap: Spacing.half,
  },
});
