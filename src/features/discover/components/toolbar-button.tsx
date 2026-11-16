import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

export type ToolbarButtonProps = {
  icon: IconName;
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
  /** A count badge (the number of filters chosen); not drawn for 0. */
  count?: number;
  /** The control has a choice made (filters chosen): its fill and ink turn to the brand. */
  active?: boolean;
  /** Let the label shorten to a single line instead of pushing the other button out of the row. */
  shrink?: boolean;
};

/** A pill button under the search box: Filters (with how many are chosen) and Sort (with the current sort). Solid, since it sits in content. */
export function ToolbarButton({ icon, label, accessibilityLabel, onPress, count = 0, active = false, shrink = false }: ToolbarButtonProps) {
  const theme = useTheme();
  const on = active || count > 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={({ pressed }) => [styles.button, shrink && styles.shrink, { backgroundColor: on ? theme.primarySoft : theme.backgroundElement, borderColor: on ? theme.primary : theme.border }, pressed && styles.pressed]}>
      <Icon name={icon} size={18} color={on ? 'primary' : 'textSecondary'} />
      <ThemedText type="secondarySemiBold" themeColor={on ? 'primaryText' : 'text'} numberOfLines={1} style={styles.label}>
        {label}
      </ThemedText>
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: theme.primary }]}>
          <ThemedText type="caption" themeColor="onPrimary" tabular>
            {count}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: MinTouchSize,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  shrink: {
    flexShrink: 1,
  },
  label: {
    flexShrink: 1,
  },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: Spacing.one + 1,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
