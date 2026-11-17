import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Radius, Space, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import type { CourseModel } from '../hooks/use-course-model';
import type { PathNode } from '../lib/course-path';
import { journeyStrings } from '../strings';

export type CourseBarProps = {
  model: CourseModel;
  /** Opens the My Learning sheet: the course's name is the way to switch. */
  onSwitch: () => void;
  /** Moves Home to another course on the journey (the next one). */
  onShowCourse: (node: PathNode) => void;
  onUnlock: () => void;
};

/**
 * The top of Home's course view, kept small (owner, 2026-11-17): which course the learner is on (its name is the switch), how far along they
 * are (the Roadmap of every course is Home's other tab). Everything else about the course is one tap away in Course details; its lessons follow right under
 * it, the one to do next highlighted with Continue. A finished course says so and offers the next one; a Pro course the
 * learner doesn't own says so with its one button.
 */
export function CourseBar({ model, onSwitch, onShowCourse, onUnlock }: CourseBarProps) {
  const text = useLocalized(journeyStrings);
  const { course, timeline, next } = model;
  return (
    <View style={styles.card}>
      <LinearGradient colors={[Space.deep, Space.mid]} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={text.home.switchLabel(course.title)}
        onPress={() => {
          tapFeedback();
          onSwitch();
        }}
        style={({ pressed }) => [styles.title, pressed && styles.pressed]}>
        <ThemedText type="section" accessibilityRole="header" numberOfLines={2} style={styles.titleText}>
          {course.title}
        </ThemedText>
        <Icon name="unfold_more" size={22} tint={Space.inkSoft} />
      </Pressable>
      <ProgressBar thick onGradient done={timeline.fraction >= 1} fraction={timeline.fraction} accessibilityLabel={text.course.progressLabel(timeline.percent)} />
      <View style={styles.meta}>
        <ThemedText type="secondary" style={styles.figure} tabular>
          {text.home.barLine(timeline.lessonsDone, timeline.lessonsTotal, timeline.percent)}
        </ThemedText>
      </View>
      {timeline.lock === 'pro' && (
        <>
          <ThemedText type="secondarySemiBold" style={styles.note}>
            {text.course.lockedPro}
          </ThemedText>
          <Button title={text.course.unlock} icon="workspace_premium" material="solid" onPress={onUnlock} />
        </>
      )}
      {!timeline.lock && timeline.complete && (
        <>
          <ThemedText type="secondarySemiBold" style={styles.note}>
            {next ? text.course.nextUp(next.title) : text.course.journeyDone}
          </ThemedText>
          {next && (
            <Button
              title={text.course.continue}
              icon="arrow_forward"
              material="solid"
              onPress={() => {
                tapFeedback();
                onShowCourse(next);
              }}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    overflow: 'hidden',
    borderRadius: Radius.card,
    borderCurve: 'continuous',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 44,
  },
  titleText: {
    color: Space.ink,
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  figure: {
    color: Space.inkSoft,
    flex: 1,
  },
  note: {
    color: Space.ink,
  },
});
