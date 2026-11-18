import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Radius, SidePaneWidth, Spacing, type ThemeColor } from '@/constants/theme';
import { openPaywall, useAccess } from '@/features/store';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import { getCourse } from '../content';
import { useLearning } from '../hooks/use-learning';
import { useLocalizedCourse } from '../hooks/use-localized-course';
import { outlineRowInert, outlineRowState, type OutlineRowState } from '../lib/outline-state';
import { courseStrings } from '../strings';
import { outlineStrings } from '../outline-strings';

export type CourseOutlineProps = {
  courseId: string;
  /** The lesson on screen: its row is highlighted. */
  currentLessonId: string;
};

const ROW_ICON: Record<OutlineRowState, { icon: IconName; color: ThemeColor }> = {
  done: { icon: 'check_circle', color: 'statusOk' },
  current: { icon: 'play_circle', color: 'primaryText' },
  next: { icon: 'radio_button_unchecked', color: 'primaryText' },
  locked: { icon: 'lock', color: 'textTertiary' },
};

/**
 * The course's lessons as a list beside the lesson on a wide window (an iPad in landscape): where the learner is, what is done and
 * what is next, and a tap opens that lesson in place of this one (replace, so the back stack doesn't grow with every lesson read).
 * A lesson still locked behind an earlier one does nothing; a course the learner doesn't own opens the paywall, as everywhere else.
 */
export function CourseOutline({ courseId, currentLessonId }: CourseOutlineProps) {
  const theme = useTheme();
  const text = useLocalized(outlineStrings);
  const course = useLocalizedCourse(getCourse(courseId));
  const courseText = useLocalized(courseStrings);
  const learning = useLearning();
  const access = useAccess();
  const insets = useSafeAreaInsets();
  if (!course) return null;
  const progress = learning.progressFor(course.id);
  const owned = access.owns(course.id);

  const open = (lessonId: string, inert: boolean) => {
    if (inert) return;
    tapFeedback();
    if (access.known && !access.canOpenLesson(course.id, lessonId)) void openPaywall('courses');
    else router.replace({ pathname: '/lesson/[id]', params: { id: lessonId } });
  };

  return (
    <View style={[styles.pane, { width: SidePaneWidth, borderColor: theme.border, backgroundColor: theme.background }]}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={[styles.content, { paddingLeft: insets.left + Spacing.three, paddingBottom: insets.bottom + Spacing.five }]}>
        <View style={styles.heading}>
          <Pressable accessibilityRole="button" accessibilityLabel={`${text.backToCourse}: ${course.title}`} onPress={() => router.navigate({ pathname: '/course/[id]', params: { id: course.id } })} hitSlop={8}>
            <ThemedText type="secondarySemiBold" themeColor="primaryText" numberOfLines={2}>
              {course.title}
            </ThemedText>
          </Pressable>
          {progress && (
            <>
              <ProgressBar fraction={progress.fraction} done={progress.complete} accessibilityLabel={courseText.lessonsDone(progress.lessonsDone, progress.lessonsTotal)} />
              <ThemedText type="caption" themeColor="textSecondary" tabular>
                {text.progress(progress.lessonsDone, progress.lessonsTotal)}
              </ThemedText>
            </>
          )}
        </View>
        <View accessibilityRole="list" style={styles.list}>
          {course.lessons.map((lesson) => {
            const lessonState = progress?.lessonState(lesson.id) ?? 'locked';
            const selected = lesson.id === currentLessonId;
            const state = outlineRowState(lessonState, selected);
            const inert = outlineRowInert(lessonState, selected, owned);
            const locked = state === 'locked';
            const shown = ROW_ICON[state];
            return (
              <Pressable
                key={lesson.id}
                accessibilityRole="button"
                accessibilityLabel={text.lessonRow(lesson.day, lesson.title, state, lesson.minutes)}
                accessibilityState={{ selected, disabled: inert && !selected }}
                onPress={() => open(lesson.id, inert)}
                style={({ pressed }) => [styles.row, { backgroundColor: selected ? theme.primarySoft : 'transparent' }, pressed && !selected && { backgroundColor: theme.backgroundSelected }]}>
                <Icon name={shown.icon} size={22} color={shown.color} />
                <View style={styles.rowText}>
                  <ThemedText type="secondarySemiBold" themeColor={locked ? 'textTertiary' : selected ? 'primaryText' : 'text'} numberOfLines={2}>
                    {lesson.title}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="textSecondary" tabular>
                    {`${courseText.day(lesson.day)} · ${text.minutes(lesson.minutes)}`}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pane: {
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  content: {
    paddingTop: Spacing.three,
    paddingRight: Spacing.two,
    gap: Spacing.three,
  },
  heading: {
    gap: Spacing.one,
    paddingRight: Spacing.one,
  },
  list: {
    gap: Spacing.half,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    minHeight: 48,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
});
