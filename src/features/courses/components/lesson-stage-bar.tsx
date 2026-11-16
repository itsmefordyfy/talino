import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import { LESSON_STAGES, type LessonStage } from '../lib/lesson-structure';
import { courseStrings } from '../strings';

export type LessonStageBarProps = { stage: LessonStage };

/** Where the learner is in the lesson: Learn, Quiz, Practice, Done. It only shows the order; nothing here can be pressed. */
export function LessonStageBar({ stage }: LessonStageBarProps) {
  const theme = useTheme();
  const strings = useLocalized(courseStrings);
  const at = LESSON_STAGES.indexOf(stage);
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={strings.stageLabel(at + 1, LESSON_STAGES.length, strings.stages[stage])}
      accessibilityValue={{ min: 1, max: LESSON_STAGES.length, now: at + 1 }}
      style={styles.row}>
      {LESSON_STAGES.map((entry, index) => (
        <View key={entry} style={styles.item}>
          <View style={[styles.bar, { backgroundColor: index <= at ? theme.primary : theme.border }]} />
          <ThemedText type="caption" themeColor={index === at ? 'primaryText' : 'textSecondary'} numberOfLines={1}>
            {strings.stages[entry]}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  item: {
    flex: 1,
    gap: Spacing.one,
  },
  bar: {
    height: 6,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
  },
});
