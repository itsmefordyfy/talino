import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

export type FilterChipProps = {
  label: string;
  /** How many courses the choice would show (with the other filters kept). */
  count: number;
  selected: boolean;
  onPress: () => void;
  /** Said to screen readers: the label and its count, and why it is dimmed when it is. */
  accessibilityLabel: string;
};

/**
 * One option of a filter group. A choice that would lead to no courses is dimmed and cannot be pressed, but stays in the
 * list (the sheet explains why); one that is already chosen can always be pressed to undo it.
 */
export function FilterChip({ label, count, selected, onPress, accessibilityLabel }: FilterChipProps) {
  const theme = useTheme();
  const dimmed = count === 0 && !selected;
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled: dimmed }}
      accessibilityLabel={accessibilityLabel}
      disabled={dimmed}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: selected ? theme.primarySoft : theme.backgroundElement, borderColor: selected ? theme.primary : theme.border },
        dimmed && styles.dimmed,
        pressed && styles.pressed,
      ]}>
      {selected && <Icon name="check" size={14} color="primary" />}
      <ThemedText type="secondarySemiBold" themeColor={selected ? 'primaryText' : 'text'} numberOfLines={1} style={styles.label}>
        {label}
      </ThemedText>
      <ThemedText type="caption" themeColor={selected ? 'primaryText' : 'textSecondary'} tabular>
        {count}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
    minHeight: MinTouchSize,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: 1,
    maxWidth: '100%',
  },
  label: {
    flexShrink: 1,
  },
  dimmed: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
});
