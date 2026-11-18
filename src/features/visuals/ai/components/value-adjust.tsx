import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconButton } from '@/components/ui/icon-button';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { fundamentalsStrings } from '../../fundamentals/strings';

export type ValueAdjustProps = {
  label: string;
  /** The whole-number position of the setting (a count of steps), so a decimal setting never shows a rounding error. */
  step: number;
  min: number;
  max: number;
  /** What the learner reads for this position ("0.7", "All"). */
  display: string;
  onChange: (step: number) => void;
};

/** Minus and plus around a value that is shown as text: like NumberAdjust, but for settings that are not plain whole numbers (0.7, "All"). */
export function ValueAdjust({ label, step, min, max, display, onChange }: ValueAdjustProps) {
  const t = useLocalized(fundamentalsStrings).common;
  const clamp = (value: number) => Math.min(max, Math.max(min, value));
  return (
    <View
      style={styles.adjust}
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min, max, now: step, text: display }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => onChange(clamp(step + (event.nativeEvent.actionName === 'increment' ? 1 : -1)))}>
      <ThemedText type="caption" themeColor="textSecondary">
        {label}
      </ThemedText>
      <View style={styles.row}>
        <IconButton icon="remove" accessibilityLabel={t.decrease(label)} disabled={step <= min} onPress={() => onChange(clamp(step - 1))} />
        <ThemedText type="statSmall" tabular style={styles.value}>
          {display}
        </ThemedText>
        <IconButton icon="add" accessibilityLabel={t.increase(label)} disabled={step >= max} onPress={() => onChange(clamp(step + 1))} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  adjust: { gap: Spacing.one },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  value: { minWidth: 48, textAlign: 'center' },
});
