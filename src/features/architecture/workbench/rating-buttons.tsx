import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

export type RatingButtonsProps = {
  /** The chosen value, or null when none is chosen yet. */
  value: number | null;
  /** The learner's choice; `null` when they tap the chosen value again to clear it. */
  onChange: (value: number | null) => void;
  /** What is being rated, for screen readers ("Score for REST on Caching"). */
  label: string;
  /** The label of one button ("4, Good, for REST on Caching"). */
  buttonLabel: (value: number) => string;
  /** What a screen reader hears as the current value ("4 of 5" or "Not scored yet"). */
  valueText: string;
  hint?: string;
  count?: number;
};

/**
 * A row of numbered 44 pt buttons (1 to 5): a segmented control with no dragging, so it works with a finger, a keyboard and a screen reader. Tapping the chosen
 * value again clears it, because "not scored yet" is an honest answer and a default of 3 would quietly count as one.
 */
export function RatingButtons({ value, onChange, label, buttonLabel, valueText, hint, count = 5 }: RatingButtonsProps) {
  const theme = useTheme();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} accessibilityValue={{ text: valueText }} accessibilityHint={hint} style={styles.row}>
      {Array.from({ length: count }, (_, index) => index + 1).map((rating) => {
        const selected = value === rating;
        return (
          <Pressable
            key={rating}
            accessibilityRole="radio"
            accessibilityLabel={buttonLabel(rating)}
            accessibilityState={{ selected, checked: selected }}
            onPress={() => {
              tapFeedback();
              onChange(selected ? null : rating);
            }}
            style={({ pressed }) => [styles.button, { backgroundColor: selected ? theme.primary : theme.backgroundSelected, borderColor: selected ? theme.primary : theme.border }, pressed && styles.pressed]}>
            <ThemedText type="bodySemiBold" tabular style={{ color: selected ? theme.onPrimary : theme.text }}>
              {rating}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  button: { width: MinTouchSize, height: MinTouchSize, borderRadius: Radius.pill, borderWidth: StyleSheet.hairlineWidth, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.7 },
});
