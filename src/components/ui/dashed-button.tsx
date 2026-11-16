import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Icon, type IconName } from './icon';

export type DashedButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  title: string;
  icon?: IconName;
  /** After the title, e.g. a Pro badge on a locked action. */
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Low-emphasis "add another" action drawn as a dashed outline, used at the end of lists and under photo rows (the same as CarMind's). */
export function DashedButton({ title, icon, trailing, style, accessibilityLabel, ...rest }: DashedButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      style={({ pressed }) => [styles.button, { borderColor: theme.border }, pressed && styles.pressed, style]}
      {...rest}>
      <Icon name={icon ?? 'add_circle'} size={18} color="primary" />
      <ThemedText type="secondarySemiBold" themeColor="primary">
        {title}
      </ThemedText>
      {trailing}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    minHeight: MinTouchSize + 4,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  pressed: {
    opacity: 0.7,
  },
});
