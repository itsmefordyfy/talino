import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useAccess } from '@/features/store';
import { useLanguage, useLocalized } from '@/hooks/use-strings';

import { CourseCard } from '../components/course-card';
import { QuizView } from '../components/quiz-view';
import { getCourse } from '../content';
import { useLearning } from '../hooks/use-learning';
import { placementQuestions, placeInPath, type Placement } from '../lib/ai-placement';
import { courseStrings } from '../strings';

type Mode = { kind: 'intro' } | { kind: 'quiz'; attempt: number } | { kind: 'result'; placement: Placement };

/** "Where should I start?" in the AI-Assisted Development path: a short knowledge check, then the course to begin with. Nothing is saved. */
export function AiPlacementScreen() {
  const strings = useLocalized(courseStrings);
  const language = useLanguage();
  const questions = placementQuestions(language);
  const learning = useLearning();
  const access = useAccess();
  const [mode, setMode] = useState<Mode>({ kind: 'intro' });

  if (mode.kind === 'quiz') {
    return (
      <Screen>
        <QuizView key={mode.attempt} lessonId="ai-placement" questions={questions} onFinish={(_correct, _total, missed) => setMode({ kind: 'result', placement: placeInPath(missed.map((question) => question.id), questions, language) })} />
      </Screen>
    );
  }

  if (mode.kind === 'result') {
    const { placement } = mode;
    const course = getCourse(placement.startCourseId);
    return (
      <Screen
        footer={
          <View style={styles.footer}>
            {course && <Button title={strings.placementSeeCourse} icon="arrow_forward" onPress={() => router.replace({ pathname: '/course/[id]', params: { id: course.id } })} />}
            <Button title={strings.placementAgain} variant="secondary" onPress={() => setMode({ kind: 'quiz', attempt: Date.now() })} />
          </View>
        }>
        <View style={styles.hero}>
          <Tali size={176} mood={placement.allPassed ? 'proud' : 'explaining'} tight />
          <ThemedText type="title" style={styles.center} accessibilityRole="header">
            {strings.placementResultTitle}
          </ThemedText>
          <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
            {placement.allPassed ? strings.placementAllPassed : strings.placementResultBody(placement.tiers[placement.startTier - 1].label)}
          </ThemedText>
        </View>
        {course && <CourseCard course={course} progress={learning.progressFor(course.id)} owned={access.owns(course.id)} />}
        <Card>
          <View style={styles.tiers}>
            {placement.tiers.map((tier) => (
              <View key={tier.tier} style={styles.tier}>
                <View style={styles.tierRow}>
                  <ThemedText type="secondarySemiBold" style={styles.flex}>
                    {tier.label}
                  </ThemedText>
                  <ThemedText type="secondary" themeColor="textSecondary" tabular>
                    {strings.score(tier.correct, tier.total)}
                  </ThemedText>
                </View>
                <ProgressBar fraction={tier.correct / tier.total} done={tier.correct === tier.total} accessibilityLabel={`${tier.label}: ${strings.score(tier.correct, tier.total)}`} />
              </View>
            ))}
          </View>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen footer={<Button title={strings.placementStart} icon="quiz" onPress={() => setMode({ kind: 'quiz', attempt: Date.now() })} />}>
      <View style={styles.hero}>
        <Tali size={184} mood="curious" tight />
        <ThemedText type="title" style={styles.center} accessibilityRole="header">
          {strings.placementTitle}
        </ThemedText>
        <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
          {strings.placementIntro(questions.length)}
        </ThemedText>
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
  tiers: {
    gap: Spacing.three,
  },
  tier: {
    gap: Spacing.one,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  footer: {
    gap: Spacing.two,
  },
});
