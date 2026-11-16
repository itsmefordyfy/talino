import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';
import { localizedCourse, useOpenLesson, type Course, type Lesson } from '@/features/courses';
import { useLanguage, useLocalized } from '@/hooks/use-strings';

import { learningStrings } from '../learning-strings';

export type FirstLessonCardProps = {
  course: Course;
  lesson: Lesson;
};

/** For a learner with nothing started: one friendly card with Tali and the first lesson to begin, instead of an empty screen. */
export function FirstLessonCard({ course: englishCourse, lesson }: FirstLessonCardProps) {
  const strings = useLocalized(learningStrings);
  const language = useLanguage();
  const course = localizedCourse(englishCourse, language);
  const openLesson = useOpenLesson();
  const begin = () => openLesson(lesson.id);
  return (
    <Card accessibilityLabel={strings.firstLessonA11y(course.title)}>
      <View style={styles.row}>
        <Tali size={96} tight mood="excited" />
        <View style={styles.text}>
          <ThemedText type="cardTitle" accessibilityRole="header">
            {strings.firstLessonTitle}
          </ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary">
            {strings.firstLessonBody(course.title)}
          </ThemedText>
        </View>
      </View>
      <Button title={strings.firstLessonButton} icon="play_arrow" onPress={begin} style={styles.button} />
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
  button: {
    marginTop: Spacing.three,
  },
});
