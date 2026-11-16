import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { MinTouchSize, Spacing, type ThemeColor } from '@/constants/theme';
import { courseStrings, formatDuration, getCourse, type PathStep, type PathStepState } from '@/features/courses';
import { useLocalized } from '@/hooks/use-strings';

import { discoverStrings } from '../strings';

const STATE_ICON: Record<PathStepState, { icon: IconName; color: ThemeColor }> = {
  done: { icon: 'check_circle', color: 'statusOk' },
  current: { icon: 'play_circle', color: 'primary' },
  next: { icon: 'arrow_circle_right', color: 'primary' },
  upcoming: { icon: 'radio_button_unchecked', color: 'textTertiary' },
};

export type PathStepsProps = {
  steps: readonly PathStep[];
  /** Show only this many steps (a summary on the home); all of them when absent. */
  limit?: number;
  /** Number the steps ("1", "2"…) beside the state icon. */
  numbered?: boolean;
  /** A line under each title with its difficulty, lessons and time. */
  details?: boolean;
};

/**
 * A path's courses in order, each with where the learner is (done, in progress, next, later). A course whose prerequisites are
 * not done says "Better after …" but opens like any other: a path is advice, never a lock.
 */
export function PathSteps({ steps, limit, numbered = false, details = false }: PathStepsProps) {
  const strings = useLocalized(discoverStrings);
  const courseText = useLocalized(courseStrings);
  const shown = limit ? steps.slice(0, limit) : steps;
  return (
    <View style={styles.list}>
      {shown.map((step, index) => {
        const mark = STATE_ICON[step.state];
        const better = step.state !== 'done' && step.missingPrerequisites.length > 0 ? strings.betterAfter(step.missingPrerequisites.map((id) => getCourse(id)?.title ?? id).join(', ')) : null;
        const stateLabel = strings.pathStateLabel[step.state];
        return (
          <Pressable
            key={step.facts.id}
            accessibilityRole="button"
            accessibilityLabel={[numbered ? `${index + 1}.` : null, step.facts.course.title, stateLabel, better].filter(Boolean).join('. ')}
            onPress={() => router.push({ pathname: '/course/[id]', params: { id: step.facts.id } })}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <Icon name={mark.icon} size={24} color={mark.color} />
            <View style={styles.text}>
              <ThemedText type={step.state === 'next' || step.state === 'current' ? 'bodySemiBold' : 'body'} themeColor={step.state === 'done' ? 'textSecondary' : 'text'} numberOfLines={2}>
                {numbered ? `${index + 1}. ` : ''}
                {step.facts.course.title}
              </ThemedText>
              {details && (
                <ThemedText type="caption" themeColor="textTertiary" tabular>
                  {[courseText.levels[step.facts.level], courseText.lessons(step.facts.lessonCount), formatDuration(step.facts.minutes)].join(' · ')}
                </ThemedText>
              )}
              {better && (
                <ThemedText type="caption" themeColor="statusWarn" numberOfLines={2}>
                  {better}
                </ThemedText>
              )}
            </View>
            <ThemedText type="caption" themeColor={step.state === 'next' || step.state === 'current' ? 'primaryText' : 'textTertiary'}>
              {stateLabel}
            </ThemedText>
          </Pressable>
        );
      })}
      {limit !== undefined && steps.length > limit && (
        <ThemedText type="caption" themeColor="textSecondary" style={styles.more}>
          {`+${steps.length - limit}`}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: MinTouchSize,
    paddingVertical: Spacing.one,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  more: {
    paddingLeft: 24 + Spacing.three,
  },
  pressed: {
    opacity: 0.7,
  },
});
