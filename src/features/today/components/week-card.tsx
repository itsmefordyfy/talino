import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { addDays, parseISODate, todayISO } from '@/lib/dates';

import { weekDots } from '../lib/focus';
import { weekFraction } from '../lib/dashboard';
import { todayStrings } from '../strings';
import { activeLocale } from '@/lib/i18n';

export type WeekCardProps = {
  /** Days with at least one finished lesson. */
  days: readonly string[];
  streak: number;
  best: number;
  doneToday: boolean;
  lessonsDone: number;
  /** The lessons-a-week target from the learner's plan. */
  target: number;
};

/**
 * The week at a glance: the streak, the last seven days and progress toward the weekly goal. A missed
 * day just leaves a gap; nothing is lost and nothing counts down.
 */
export function WeekCard({ days, streak, best, doneToday, lessonsDone, target }: WeekCardProps) {
  const strings = useLocalized(todayStrings);
  const theme = useTheme();
  const dots = weekDots(days, todayISO(), addDays);
  const fraction = weekFraction(lessonsDone, target);
  return (
    <Card>
      <View style={styles.top}>
        <View style={[styles.flame, { backgroundColor: theme.statusWarnSoft }]}>
          <Icon name="local_fire_department" size={22} tint={theme.statusWarn} filled />
        </View>
        <View style={styles.flex}>
          <ThemedText type="cardTitle" tabular>
            {streak > 0 ? strings.streak(streak) : strings.noStreak}
          </ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary">
            {doneToday ? strings.doneToday : best > streak ? strings.best(best) : strings.keepItGoing}
          </ThemedText>
        </View>
      </View>
      <View style={styles.dots} accessible accessibilityLabel={strings.daysAccessible(dots.filter((dot) => dot.done).length)}>
        {dots.map((dot) => (
          <View key={dot.day} style={styles.dotColumn}>
            <View style={[styles.dot, { backgroundColor: dot.done ? theme.success : theme.backgroundSelected }]}>{dot.done && <Icon name="check" size={14} tint={theme.text} />}</View>
            <ThemedText type="caption" themeColor="textSecondary">
              {parseISODate(dot.day).toLocaleDateString(activeLocale(), { weekday: 'narrow' })}
            </ThemedText>
          </View>
        ))}
      </View>
      <View style={styles.goal}>
        <View style={styles.goalRow}>
          <ThemedText type="secondarySemiBold">{strings.weekGoal}</ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary" tabular>
            {strings.weekProgress(lessonsDone, target)}
          </ThemedText>
        </View>
        <ProgressBar fraction={fraction} done={fraction >= 1} accessibilityLabel={strings.weekProgress(lessonsDone, target)} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  flame: {
    width: 44,
    height: 44,
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.three,
  },
  dotColumn: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goal: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
