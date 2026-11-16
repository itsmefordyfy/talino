import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { InputHeight, MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { IconButton } from './icon-button';

export type PickerRowProps = {
  label: string;
  /** The date or time as shown, or null for the placeholder. */
  text: string | null;
  placeholder: string;
  onPress: () => void;
  /** Lets the owner clear it; the label of that button. */
  clearLabel?: string;
  onClear?: () => void;
  error?: string | null;
  hint?: string;
  disabled?: boolean;
  /** No box of its own: a row inside a card that already draws one. */
  bare?: boolean;
  /** Smaller text and padding, label and value still on one line, for two rows side by side (a From and a To). */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * The row every date and time field uses, the same on iPhone and Android (owner's call,
 * 2026-10-17): the label, and the value on a mint capsule (or the placeholder), opening the
 * system picker. A clear button when the field allows it; the error or hint under it.
 */
export function PickerRow({ label, text, placeholder, onPress, clearLabel, onClear, error, hint, disabled, bare = false, compact = false, style }: PickerRowProps) {
  const theme = useTheme();
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.row, compact && styles.compactRow, bare ? styles.bare : { backgroundColor: theme.backgroundSelected, borderColor: error ? theme.danger : theme.border }, disabled && styles.disabled]}>
        <Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${text ?? placeholder}`} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.press, compact && styles.compactPress, pressed && styles.pressed]}>
          {/* The label wraps, and the value drops under it, when large text leaves no room side by side. */}
          <ThemedText type={compact ? 'caption' : 'secondarySemiBold'} themeColor="textSecondary" style={styles.label}>
            {label}
          </ThemedText>
          {/* Always a background (transparent while empty): an Android view that gains one later keeps square corners. */}
          <View style={[styles.value, compact && styles.compactValue, { backgroundColor: text ? (bare ? theme.backgroundSelected : theme.backgroundElement) : 'transparent' }]}>
            <ThemedText type={compact ? 'secondarySemiBold' : 'bodySemiBold'} themeColor="primaryText" tabular>
              {text ?? placeholder}
            </ThemedText>
          </View>
        </Pressable>
        {text && clearLabel && onClear && <IconButton icon="close" accessibilityLabel={clearLabel} background="backgroundSelected" color="textSecondary" iconSize={16} onPress={onClear} />}
      </View>
      {error ? (
        <ThemedText type="caption" themeColor="danger">
          {error}
        </ThemedText>
      ) : (
        hint && (
          <ThemedText type="caption" themeColor="textSecondary">
            {hint}
          </ThemedText>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: InputHeight,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.input,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  bare: {
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  press: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    // A wrapping row packs its line at the top by default: centre it, so the label and the capsule sit in the box's middle.
    alignContent: 'center',
    gap: Spacing.two,
    minHeight: MinTouchSize,
    paddingVertical: Spacing.one,
  },
  label: {
    maxWidth: '100%',
  },
  // Two side by side (From and To): label and date still on one line, in less room.
  compactRow: {
    paddingHorizontal: Spacing.two,
  },
  compactPress: {
    gap: Spacing.one,
  },
  compactValue: {
    paddingHorizontal: Spacing.two,
    flexShrink: 0,
  },
  value: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
});
