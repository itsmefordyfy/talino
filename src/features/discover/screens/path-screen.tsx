import { router, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { LoadingState, NotFoundState, ErrorState } from '@/components/ui/state-view';
import { Radius, Spacing } from '@/constants/theme';
import { catalogFacts, formatDuration, goalLabel, learningLevelLabel, pathText } from '@/features/courses';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import { AiPathCard } from '../components/ai-path-card';
import { PathSteps } from '../components/path-steps';
import { usePathPlan } from '../hooks/use-path-plan';
import { browseStrings } from '../browse-strings';
import { pathAssumes, pathSummaries } from '../lib/browse';
import { discoverStrings } from '../strings';

/** The AI-Assisted Development path is the one with the placement check and the tools guide. */
const AI_PATH_ID = 'ai-assisted-developer';

/**
 * One learning path: what it is, what it takes for granted, its courses in order with where the learner stands on each, and
 * one button for the next course. A path is advice, never a lock: every course opens whatever its prerequisites say.
 */
export function PathScreen({ pathId }: { pathId: string }) {
  const strings = useLocalized(discoverStrings);
  const browse = useLocalized(browseStrings);
  const language = useLanguage();
  const theme = useTheme();
  const { plan, exists, isPending, isError, refetch } = usePathPlan(pathId);

  if (!exists) return <NotFoundState icon="route" title={strings.pathNotFound} />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (isPending) return <LoadingState />;
  if (!plan) return <NotFoundState icon="route" title={strings.pathMissing} />;

  const { path, steps, nextStep, done, total } = plan;
  const text = pathText(path, language);
  const assumes = pathAssumes(path, catalogFacts());
  const unpublished = path.courseIds.length - steps.length;
  // Level range and time come from the path's real courses, never typed.
  const summary = pathSummaries([path], catalogFacts(), new Set())[0];
  const levels = summary ? browse.pathLevels(learningLevelLabel(summary.fromLevel), learningLevelLabel(summary.toLevel)) : null;
  const footer = nextStep ? (
    <Button
      title={nextStep.state === 'current' ? strings.pathContinue : strings.pathStart}
      icon="play_arrow"
      onPress={() => router.push({ pathname: '/course/[id]', params: { id: nextStep.facts.id } })}
    />
  ) : null;

  return (
    <Screen footer={footer}>
      <Stack.Screen options={{ title: text.title }} />
      <Card>
        <View style={styles.hero}>
          <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
            <Icon name={path.icon as never} size={28} color="primary" />
          </View>
          <View style={styles.flex}>
            <ThemedText type="title">{text.title}</ThemedText>
          </View>
        </View>
        <ThemedText type="body" style={styles.description}>
          {text.description}
        </ThemedText>
        {summary && levels && (
          <View style={styles.facts}>
            <Fact icon="stairs" label={`${browse.pathLevel}: ${levels}`} />
            <Fact icon="school" label={strings.pathCourses(summary.count)} />
            <Fact icon="schedule" label={`${browse.pathDuration}: ${formatDuration(summary.minutes)}`} />
          </View>
        )}
        <View style={styles.progress}>
          <ProgressBar fraction={total === 0 ? 0 : done / total} done={done === total} accessibilityLabel={`${strings.pathOverall}: ${strings.pathProgress(done, total)}`} />
          <ThemedText type="caption" themeColor="textSecondary" tabular>
            {done === total ? strings.pathFinished : strings.pathProgress(done, total)}
          </ThemedText>
        </View>
      </Card>

      <Section title={browse.pathFor}>
        <ThemedText type="body">{path.audience}</ThemedText>
      </Section>

      <Section title={browse.pathObjectives}>
        <Card>
          <View style={styles.objectives}>
            {path.objectives.map((line) => (
              <View key={line} style={styles.objective}>
                <Icon name="flag" size={18} color="primaryText" />
                <ThemedText type="body" style={styles.flex}>
                  {line}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>
      </Section>

      <Section title={browse.pathOutcome}>
        <View style={[styles.outcome, { backgroundColor: theme.primarySoft }]}>
          <Icon name="workspace_premium" size={22} color="primary" />
          <ThemedText type="bodySemiBold" themeColor="primaryText" style={styles.flex}>
            {path.outcome}
          </ThemedText>
        </View>
      </Section>

      {path.id === AI_PATH_ID && <AiPathCard />}

      {assumes.length > 0 && (
        <Section title={strings.pathBeforeTitle}>
          <ThemedText type="secondary" themeColor="textSecondary">
            {strings.pathBeforeBody}
          </ThemedText>
          {assumes.map((fact) => (
            <ListRow key={fact.id} title={fact.course.title} titleLines={2} icon="lightbulb" onPress={() => router.push({ pathname: '/course/[id]', params: { id: fact.id } })} />
          ))}
        </Section>
      )}

      <Section title={strings.pathStepsTitle}>
        <Card>
          <PathSteps steps={steps} numbered details />
        </Card>
        {unpublished > 0 && (
          <ThemedText type="caption" themeColor="textSecondary">
            {strings.pathMissing}
          </ThemedText>
        )}
      </Section>

      <Section title={browse.pathGoals}>
        <ThemedText type="secondary" themeColor="textSecondary">
          {path.goals.map((goal) => goalLabel(goal, language)).join(' · ')}
        </ThemedText>
      </Section>
    </Screen>
  );
}

/** A small fact about the path (its levels, courses, time). */
function Fact({ icon, label }: { icon: 'stairs' | 'school' | 'schedule'; label: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.fact, { backgroundColor: theme.backgroundSelected }]}>
      <Icon name={icon} size={16} color="textSecondary" />
      <ThemedText type="caption" themeColor="textSecondary" tabular>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  facts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  fact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
  objectives: {
    gap: Spacing.three,
  },
  objective: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  outcome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
  },
  flex: {
    flex: 1,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    marginTop: Spacing.three,
  },
  progress: {
    gap: Spacing.one,
    marginTop: Spacing.three,
  },
});
