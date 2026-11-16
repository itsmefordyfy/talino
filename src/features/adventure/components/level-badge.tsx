import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import { adventureStrings } from '../strings';

export type LevelBadgeProps = { level: number; size?: number };

/** The learner's level in a round badge: the number, with the word "Level" for screen readers. */
export function LevelBadge({ level, size = 48 }: LevelBadgeProps) {
  const strings = useLocalized(adventureStrings);
  const theme = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={strings.level(level)}
      style={[styles.badge, { width: size, height: size, borderRadius: size / 2, backgroundColor: theme.primary, borderColor: theme.primarySoft, borderWidth: Spacing.half + 1 }]}>
      <ThemedText type="statSmall" tabular style={{ color: theme.onPrimary }}>
        {level}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
