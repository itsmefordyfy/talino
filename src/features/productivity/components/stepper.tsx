import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

export type StepperProps = {
  /** What is being changed ("Start time"). */
  label: string;
  /** The current value as the learner reads it ("9:30 AM"). */
  valueText: string;
  decrementLabel: string;
  incrementLabel: string;
  onDecrement: () => void;
  onIncrement: () => void;
  canDecrement?: boolean;
  canIncrement?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * A value changed with minus and plus buttons (the planner moves in 15-minute steps), so every plan can be built with taps, a keyboard or a screen
 * reader and no dragging. Screen readers hear one adjustable control (swipe up or down to step); sighted users get two 44 pt buttons.
 */
export function Stepper({ label, valueText, decrementLabel, incrementLabel, onDecrement, onIncrement, canDecrement = true, canIncrement = true, style }: StepperProps) {
  const theme = useTheme();
  const step = (direction: 'up' | 'down') => {
    if (direction === 'up' ? !canIncrement : !canDecrement) return;
    tapFeedback();
    if (direction === 'up') onIncrement();
    else onDecrement();
  };
  const button = (direction: 'up' | 'down', accessibilityLabel: string, enabled: boolean) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !enabled }}
      disabled={!enabled}
      onPress={() => step(direction)}
      style={({ pressed }) => [styles.button, { backgroundColor: theme.primarySoft }, !enabled && styles.disabled, pressed && styles.pressed]}>
      <Icon name={direction === 'up' ? 'add' : 'remove'} size={20} color="primary" />
    </Pressable>
  );
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: valueText }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => step(event.nativeEvent.actionName === 'increment' ? 'up' : 'down')}
      style={[styles.root, style]}>
      <ThemedText type="secondarySemiBold" themeColor="textSecondary">
        {label}
      </ThemedText>
      <View style={styles.row}>
        {button('down', decrementLabel, canDecrement)}
        <ThemedText type="bodySemiBold" tabular style={styles.value}>
          {valueText}
        </ThemedText>
        {button('up', incrementLabel, canIncrement)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.one },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  button: { width: MinTouchSize, height: MinTouchSize, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
  value: { minWidth: 76, textAlign: 'center', flexShrink: 1 },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.7 },
});
