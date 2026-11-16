import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import { Icon, type IconName } from './icon';

export type OptionCardProps = {
  title: string;
  detail?: string;
  /** A leading icon in a soft tile. */
  icon?: IconName;
  selected: boolean;
  /** Pick-one (radio) or pick-many (checkbox): sets the screen-reader role and the mark on the right. */
  mode: 'single' | 'multiple';
  onPress: () => void;
  disabled?: boolean;
};

/**
 * A large selection card for choosing between a few options (onboarding, preferences). Selected: a
 * violet border, a Soft Lavender fill and a check, so the choice never rests on color alone. At least
 * 56 pt tall; the whole card is the target.
 */
export function OptionCard({ title, detail, icon, selected, mode, onPress, disabled = false }: OptionCardProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole={mode === 'single' ? 'radio' : 'checkbox'}
      accessibilityState={{ selected, checked: selected, disabled }}
      accessibilityLabel={detail ? `${title}. ${detail}` : title}
      disabled={disabled}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: selected ? theme.primarySoft : theme.backgroundElement, borderColor: selected ? theme.primary : theme.border, borderWidth: selected ? 2 : 1 },
        pressed && styles.pressed,
      ]}>
      {icon && (
        <View style={[styles.tile, { backgroundColor: selected ? theme.primary : theme.backgroundSelected }]}>
          <Icon name={icon} size={22} tint={selected ? theme.onPrimary : theme.textSecondary} />
        </View>
      )}
      <View style={styles.text}>
        <ThemedText type="cardTitle">{title}</ThemedText>
        {detail ? (
          <ThemedText type="secondary" themeColor="textSecondary">
            {detail}
          </ThemedText>
        ) : null}
      </View>
      <View style={[styles.mark, mode === 'single' ? styles.round : styles.square, { borderColor: selected ? theme.primary : theme.textTertiary, backgroundColor: selected ? theme.primary : 'transparent' }]}>
        {selected && <Icon name="check" size={16} tint={theme.onPrimary} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: MinTouchSize + Spacing.three,
    paddingVertical: Spacing.three - 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  tile: {
    width: 40,
    height: 40,
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
  mark: {
    width: 24,
    height: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  round: {
    borderRadius: 12,
  },
  square: {
    borderRadius: 7,
  },
});
