import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Section } from '@/components/ui/section';
import { Spacing } from '@/constants/theme';
import { localizedCourse, pathText, useOpenLesson, type CourseProgress, type PathPlan } from '@/features/courses';
import { discoverStrings } from '@/features/discover';
import { useLanguage, useLocalized } from '@/hooks/use-strings';

import { pathAction } from '../lib/own-learning';
import { learningStrings } from '../learning-strings';

export type PathCardProps = {
  plan: PathPlan;
  progressFor: (courseId: string) => CourseProgress | null;
};

/** The learning path the learner is on: how far along, the next course, and one button to carry on or start it. The whole card opens the path. */
export function PathCard({ plan, progressFor }: PathCardProps) {
  const strings = useLocalized(discoverStrings);
  const picks = useLocalized(learningStrings);
  const language = useLanguage();
  const pathTitle = pathText(plan.path, language).title;
  const action = pathAction(plan);
  const nextTitle = plan.nextStep ? localizedCourse(plan.nextStep.facts.course, language).title : null;
  const openPath = () => router.push({ pathname: '/path/[id]', params: { id: plan.path.id } });
  const openLesson = useOpenLesson();
  const go = () => {
    if (!action) return;
    const lesson = action.kind === 'continue' ? progressFor(action.courseId)?.nextLesson : null;
    if (lesson) openLesson(lesson.id);
    else router.push({ pathname: '/course/[id]', params: { id: action.courseId } });
  };
  const progress = strings.pathProgress(plan.done, plan.total);
  return (
    <Section title={strings.pathTitle} actionLabel={strings.pathOpen} onAction={openPath}>
      <Card onPress={openPath} accessibilityLabel={[pathTitle, progress, nextTitle ? strings.pathNext(nextTitle) : strings.pathFinished].join('. ')}>
        <ThemedText type="cardTitle" numberOfLines={2}>
          {pathTitle}
        </ThemedText>
        <View style={styles.progress}>
          <ProgressBar fraction={plan.total === 0 ? 0 : plan.done / plan.total} done={plan.done === plan.total} accessibilityLabel={progress} />
          <ThemedText type="caption" themeColor="textSecondary" tabular>
            {progress}
          </ThemedText>
        </View>
        {nextTitle ? (
          <View style={styles.next}>
            <ThemedText type="secondarySemiBold" numberOfLines={2} style={styles.nextText}>
              {strings.pathNext(nextTitle)}
            </ThemedText>
            {action && <Button title={action.kind === 'continue' ? picks.continueCourse : picks.startCourse} accessibilityLabel={(action.kind === 'continue' ? picks.continueCourseA11y : picks.startCourseA11y)(nextTitle)} icon="play_arrow" size="small" onPress={go} />}
          </View>
        ) : (
          <ThemedText type="secondary" themeColor="textSecondary">
            {strings.pathFinished}
          </ThemedText>
        )}
      </Card>
    </Section>
  );
}

const styles = StyleSheet.create({
  progress: {
    gap: Spacing.one,
    marginVertical: Spacing.three,
  },
  next: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  nextText: {
    flex: 1,
  },
});
