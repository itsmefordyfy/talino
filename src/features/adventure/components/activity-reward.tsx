import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTones } from '@/hooks/use-tones';

import { adventureStrings } from '../strings';

export type ActivityRewardProps = {
  /** XP the attempt paid (`recordAttempt`'s `xpEarned`). */
  xp: number;
  /** The activity had been solved before (a replay pays nothing). */
  alreadySolved?: boolean;
  /** Hints used on the way to the solve: a gentle note that they lower the reward. */
  hintsUsed?: number;
  /** Wrong tries before the solve: a gentle note that careful tries earn the most. */
  wrong?: number;
};

/**
 * The small inline "+8 XP" after solving an activity. It is quiet: a chip that fades in (not at all
 * with Reduce Motion), with one honest line when hints or many tries lowered the reward, or when
 * nothing is paid (a replay). It never shows for a wrong answer.
 */
export function ActivityReward({ xp, alreadySolved = false, hintsUsed = 0, wrong = 0 }: ActivityRewardProps) {
  const strings = useLocalized(adventureStrings);
  const reduceMotion = useReducedMotion();
  const mint = useTones().mint;
  const note = alreadySolved ? strings.rewardAlready : xp <= 0 ? strings.rewardNone : wrong >= 3 ? strings.rewardGuessing : hintsUsed > 0 ? strings.rewardHints : null;
  return (
    <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(180)} accessibilityLiveRegion="polite" style={styles.wrap}>
      {xp > 0 && (
        <View accessible accessibilityLabel={strings.rewardLabel(xp)} style={[styles.chip, { backgroundColor: mint.soft }]}>
          <Icon name="bolt" size={18} tint={mint.ink} filled />
          <ThemedText type="secondarySemiBold" tabular style={{ color: mint.ink }}>
            {strings.rewardXp(xp)}
          </ThemedText>
        </View>
      )}
      {note && (
        <ThemedText type="caption" themeColor="textSecondary">
          {note}
        </ThemedText>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    minHeight: 32,
    paddingHorizontal: Spacing.two + Spacing.one,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
});
