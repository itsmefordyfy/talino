import { StyleSheet, View, type ViewProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Icon } from './icon';

export type ProBadgeProps = ViewProps & {
  /** The word on the pill ("Pro"), from the caller's strings. */
  label: string;
};

/**
 * A lock and "Pro": marks a row that needs a purchase (ported from Pawfetti's PremiumBadge). Icon + label + color,
 * never color alone. The pill keeps its own size inside a plain wrapper that takes the parent's alignment, so it
 * sits centred in a row instead of stretching or riding the top edge.
 */
export function ProBadge({ label, style, ...rest }: ProBadgeProps) {
  const theme = useTheme();
  return (
    <View accessible accessibilityLabel={label} style={style} {...rest}>
      <View style={[styles.badge, { backgroundColor: theme.primarySoft }]}>
        <Icon name="lock" size={IconSize.small} color="primaryText" />
        <ThemedText type="caption" themeColor="primaryText" style={styles.label}>
          {label}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.half,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
  },
  label: {
    letterSpacing: 0.4,
  },
});
