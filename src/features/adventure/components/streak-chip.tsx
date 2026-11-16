import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTones } from '@/hooks/use-tones';

import { adventureStrings } from '../strings';

export type StreakChipProps = { current: number; doneToday?: boolean };

/**
 * The streak as a small chip. It only ever celebrates: with no streak it says "Start any day"
 * (never "you lost it"), because a missed day is a rest day, not a failure.
 */
export function StreakChip({ current, doneToday = false }: StreakChipProps) {
  const strings = useLocalized(adventureStrings);
  const amber = useTones().amber;
  const active = current > 0;
  const label = active ? strings.streak(current) : strings.streakNone;
  return (
    <View accessible accessibilityLabel={doneToday ? `${label}, done today` : label} style={[styles.chip, { backgroundColor: amber.soft }]}>
      <Icon name="local_fire_department" size={18} tint={amber.ink} filled={active} />
      <ThemedText type="secondarySemiBold" tabular style={{ color: amber.ink }}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.one,
    minHeight: 32,
    paddingHorizontal: Spacing.two + Spacing.one,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
});
