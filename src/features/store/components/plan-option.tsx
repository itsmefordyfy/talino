import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type PlanOptionProps = Omit<PressableProps, 'style' | 'children'> & {
  title: string;
  /** "₱1,999 / year". */
  price: string;
  /** A second line under the title, e.g. what a week costs on the yearly plan. */
  detail?: string;
  /** Pills on the card's top edge: "Best value", "Save 81%". */
  tags?: string[];
  selected: boolean;
  style?: StyleProp<ViewStyle>;
};

/** One selectable plan on the paywall; a radio button for screen readers. */
export function PlanOption({ title, price, detail, tags = [], selected, style, ...rest }: PlanOptionProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={[title, price, detail, ...tags].filter(Boolean).join(', ')}
      style={({ pressed }) => [
        styles.option,
        { backgroundColor: selected ? theme.primarySoft : theme.backgroundElement, borderColor: selected ? theme.primary : theme.border },
        pressed && styles.pressed,
        style,
      ]}
      {...rest}>
      <Icon name={selected ? 'radio_button_checked' : 'radio_button_unchecked'} size={22} color={selected ? 'primary' : 'textTertiary'} />
      <View style={styles.text}>
        <ThemedText type="cardTitle">{title}</ThemedText>
        {detail && (
          <ThemedText type="secondary" themeColor="textSecondary">
            {detail}
          </ThemedText>
        )}
      </View>
      <ThemedText type="cardTitle" tabular>
        {price}
      </ThemedText>
      {tags.length > 0 && (
        <View style={styles.tags}>
          {tags.map((tag, index) => (
            <View key={tag} style={[styles.tag, { backgroundColor: index === 0 ? theme.primary : theme.backgroundSelected, borderColor: theme.primary }]}>
              <ThemedText type="caption" themeColor={index === 0 ? 'onPrimary' : 'text'} style={styles.tagText}>
                {tag}
              </ThemedText>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: MinTouchSize + 24,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
    borderWidth: 1.5,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  tags: {
    position: 'absolute',
    top: -Spacing.two - 2,
    right: Spacing.three,
    flexDirection: 'row',
    gap: Spacing.one,
  },
  tag: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.chip,
    // The "Save N%" pill is outlined in the primary colour (owner, 2026-11-15); the solid "Best value" one blends into its own border.
    borderWidth: 1.5,
    borderCurve: 'continuous',
  },
  tagText: {
    fontWeight: 700,
  },
});
