import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';
import type { MaterialSymbolName } from '@/components/ui/material-symbols';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Spacing } from '@/constants/theme';
import { COURSE_TONES, courseStrings, localizedCourse, useOpenLesson, type CourseFacts, type CourseProgress } from '@/features/courses';
import { useLanguage, useLocalized } from '@/hooks/use-strings';

import { learningStrings } from '../learning-strings';

export type ContinueRowProps = {
  facts: CourseFacts;
  progress: CourseProgress;
};

/** Another course the learner has started: its progress and a Continue button to its next lesson (the course page when there is none left). */
export function ContinueRow({ facts, progress }: ContinueRowProps) {
  const strings = useLocalized(learningStrings);
  const courseText = useLocalized(courseStrings);
  const language = useLanguage();
  const course = localizedCourse(facts.course, language);
  const done = courseText.lessonsDone(progress.lessonsDone, progress.lessonsTotal);
  const openLesson = useOpenLesson();
  const open = () => router.push({ pathname: '/course/[id]', params: { id: facts.id } });
  const next = progress.nextLesson;
  return (
    <Card onPress={open} accessibilityLabel={`${course.title}. ${done}`}>
      <View style={styles.row}>
        <IconTile icon={course.icon as MaterialSymbolName} tone={COURSE_TONES[course.kind]} />
        <View style={styles.text}>
          <ThemedText type="cardTitle" numberOfLines={2}>
            {course.title}
          </ThemedText>
          <ProgressBar fraction={progress.fraction} done={progress.complete} accessibilityLabel={done} />
          <ThemedText type="caption" themeColor="textSecondary" tabular>
            {done}
          </ThemedText>
        </View>
        <Button title={strings.continueCourse} accessibilityLabel={strings.continueCourseA11y(course.title)} icon="play_arrow" size="small" onPress={() => (next ? openLesson(next.id) : open())} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  text: {
    flex: 1,
    gap: Spacing.one,
  },
});
