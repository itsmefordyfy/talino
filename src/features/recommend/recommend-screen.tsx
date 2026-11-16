import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing } from '@/constants/theme';
import { CourseCard, getCourse, recommendCourse, recommendQuestions, useLearning, type CareerCourseId } from '@/features/courses';
import { selectGoal } from '@/features/settings/settings-slice';
import { useAccess } from '@/features/store';
import { tapFeedback } from '@/lib/haptics';
import { defineStrings } from '@/lib/i18n';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useAppSelector } from '@/store/hooks';

const strings = defineStrings({
  en: {
    intro: 'Five quick questions, then I’ll suggest the course that fits you.',
    question: (n: number, total: number) => `Question ${n} of ${total}`,
    resultTitle: 'Your next course',
    resultBody: 'Based on your answers. Every career course is there if you’d rather pick another.',
    seeCourse: 'See the course',
    browse: 'Browse all courses',
    again: 'Answer again',
  },
  fil: {
    intro: "Limang mabilisang tanong, tapos ire-recommend ko ang course na bagay sa'yo.",
    question: (n: number, total: number) => `Tanong ${n} sa ${total}`,
    resultTitle: 'Ang susunod mong course',
    resultBody: 'Base ito sa mga sagot mo. Nandiyan pa rin ang lahat ng career course kung gusto mong pumili ng iba.',
    seeCourse: 'Tingnan ang course',
    browse: 'Lahat ng course',
    again: 'Ulitin',
  },
});

/** "Pick your next course": the starter quiz that recommends a career course (the business plan's paywall moment). */
export function RecommendScreen() {
  const text = useLocalized(strings);
  const questions = recommendQuestions(useLanguage());
  const goal = useAppSelector(selectGoal);
  const learning = useLearning();
  const access = useAccess();
  const [answers, setAnswers] = useState<CareerCourseId[]>([]);
  const done = answers.length === questions.length;

  if (done) {
    const course = getCourse(recommendCourse(answers, goal));
    return (
      <Screen
        footer={
          <View style={styles.footer}>
            {course && <Button title={text.seeCourse} icon="arrow_forward" onPress={() => router.replace({ pathname: '/course/[id]', params: { id: course.id } })} />}
            <Button title={text.browse} variant="secondary" onPress={() => router.replace('/courses')} />
          </View>
        }>
        <View style={styles.hero}>
          <Tali size={184} mood="excited" tight />
          <ThemedText type="title" style={styles.center}>
            {text.resultTitle}
          </ThemedText>
          <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
            {text.resultBody}
          </ThemedText>
        </View>
        {course && <CourseCard course={course} progress={learning.progressFor(course.id)} owned={access.owns(course.id)} />}
        <Button title={text.again} variant="ghost" onPress={() => setAnswers([])} />
      </Screen>
    );
  }

  const question = questions[answers.length];
  return (
    <Screen>
      {answers.length === 0 && (
        <View style={styles.hero}>
          <Tali size={144} mood="curious" tight />
          <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
            {text.intro}
          </ThemedText>
        </View>
      )}
      <ThemedText type="caption" themeColor="textSecondary">
        {text.question(answers.length + 1, questions.length)}
      </ThemedText>
      <ProgressBar fraction={answers.length / questions.length} accessibilityLabel={text.question(answers.length + 1, questions.length)} />
      <ThemedText type="section" accessibilityRole="header">
        {question.prompt}
      </ThemedText>
      <View style={styles.options}>
        {question.choices.map((choice) => (
          <ListRow
            key={choice.label}
            title={choice.label}
            titleLines={2}
            showChevron
            onPress={() => {
              tapFeedback();
              setAnswers([...answers, choice.course]);
            }}
            style={styles.option}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  center: {
    textAlign: 'center',
  },
  options: {
    gap: Spacing.two,
  },
  option: {
    borderRadius: Radius.large,
  },
  footer: {
    gap: Spacing.two,
  },
});
