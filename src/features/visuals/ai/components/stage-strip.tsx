import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type StageStripProps = {
  stages: readonly string[];
  /** Index of the active stage. */
  active: number;
  describe: (name: string, index: number, total: number) => string;
};

/** The stages of a process as numbered pills; the active one is filled and bold, finished ones are ticked in words (numbers, not color alone). */
export function StageStrip({ stages, active, describe }: StageStripProps) {
  const theme = useTheme();
  return (
    <View accessible accessibilityLabel={describe(stages[active] ?? '', active + 1, stages.length)} style={styles.row}>
      {stages.map((name, index) => {
        const on = index === active;
        return (
          <View key={name} style={[styles.pill, { backgroundColor: on ? theme.primary : theme.backgroundElement, borderColor: on ? theme.primary : theme.border }]}>
            <ThemedText type="caption" tabular style={{ color: on ? theme.onPrimary : theme.textSecondary }}>
              {index + 1}
            </ThemedText>
            <ThemedText type="secondarySemiBold" style={{ color: on ? theme.onPrimary : index < active ? theme.text : theme.textSecondary }}>
              {name}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one + 2 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one + 2, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one, borderRadius: Radius.pill, borderWidth: 1 },
});
