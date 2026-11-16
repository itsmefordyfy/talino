import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { SettingsButton } from '@/components/settings-button';
import { TabHeader } from '@/components/tab-header';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';
import { ListRow } from '@/components/ui/list-row';
import type { MaterialSymbolName } from '@/components/ui/material-symbols';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { ErrorState } from '@/components/ui/state-view';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { Spacing } from '@/constants/theme';
import { useGame, XpCard } from '@/features/adventure';
import { catalogFacts, COURSE_TONES, COURSES, factsFor, findLesson, getCourse, LEARNING_PATHS, localizedCourse, localizedFound, localizedProject, planForPath, useLearning, useOpenLesson, type PathPlan } from '@/features/courses';
import { useLearnerSignals } from '@/features/discover';
import { LevelSuggestionCard, useLearningPlan } from '@/features/onboarding';
import { selectFocusCourseId, selectLearnerName } from '@/features/settings/settings-slice';
import { useAccess } from '@/features/store';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { todayISO } from '@/lib/dates';
import { dayPart, formatFriendlyDate } from '@/lib/greeting';
import { useAppSelector } from '@/store/hooks';

import { ContinueRow } from '../components/continue-row';
import { FirstLessonCard } from '../components/first-lesson-card';
import { PathCard } from '../components/path-card';
import { WeekCard } from '../components/week-card';
import { lessonsThisWeek, recentLessons } from '../lib/dashboard';
import { pickFocusCourse } from '../lib/focus';
import { firstLessonCourseId, otherStarted, pathInProgress } from '../lib/own-learning';
import { learningStrings } from '../learning-strings';
import { todayStrings } from '../strings';

/** Today: the streak, the next lesson, what's waiting, and Tali. */
export function TodayTab() {
  const strings = useLocalized(todayStrings);
  const own = useLocalized(learningStrings);
  const openLesson = useOpenLesson();
  const language = useLanguage();
  const name = useAppSelector(selectLearnerName);
  const chosen = useAppSelector(selectFocusCourseId);
  const learning = useLearning();
  const access = useAccess();
  const { plan } = useLearningPlan();
  const game = useGame();
  // Only the learner's own progress is read here (what they started, the path they are on); finding new courses is the Courses tab's job.
  const { signals } = useLearnerSignals();
  const now = new Date();
  const header = <TabHeader title={strings.greetingName(strings.greeting[dayPart(now)], name.split(' ')[0] ?? '')} subtitle={formatFriendlyDate(now)} accessory={<SettingsButton />} />;

  if (learning.isError) {
    return (
      <Screen variant="tab">
        {header}
        <ErrorState onRetry={() => void learning.refetch()} />
      </Screen>
    );
  }
  if (learning.isPending) {
    return (
      <Screen variant="tab">
        {header}
        <SkeletonBlock height={170} />
        <SkeletonBlock height={140} />
      </Screen>
    );
  }

  const focusId = pickFocusCourse(learning.progress, chosen, access.owns);
  const course = localizedCourse(getCourse(focusId), language);
  const progress = learning.progressFor(focusId);
  const waiting = COURSES.flatMap((entry) =>
    access.owns(entry.id)
      ? entry.projects.filter((project) => learning.progressFor(entry.id)?.projectOpen(project.id) && learning.projectRow(project.id)?.status !== 'passed').map((project) => ({ course: entry, project }))
      : [],
  ).slice(0, 3);
  const target = plan?.schedule.lessonsPerWeek ?? 5;
  const weekDone = lessonsThisWeek(learning.data?.lessons ?? [], todayISO());
  const recent = recentLessons(learning.data?.lessons ?? [], 3)
    .map((row) => ({ row, lesson: localizedFound(findLesson(row.lesson_id), language)?.lesson ?? null }))
    .filter((entry): entry is { row: (typeof entry)['row']; lesson: NonNullable<(typeof entry)['lesson']> } => entry.lesson !== null);
  // Other courses already under way, listed with the one Today leads with so "continue" is one block, not two.
  const alsoStarted = otherStarted(signals.started, focusId)
    .map((id) => ({ facts: factsFor(id), progress: learning.progressFor(id) }))
    .filter((entry): entry is { facts: NonNullable<(typeof entry)['facts']>; progress: NonNullable<(typeof entry)['progress']> } => !!entry.facts && !!entry.progress);
  // The path they are already on (a road with a course started or finished), never one picked for them.
  const pathPlan = pathInProgress(LEARNING_PATHS.map((path) => planForPath(path, signals, catalogFacts())).filter((entry): entry is PathPlan => entry !== null));
  // Nothing started yet: one friendly first lesson instead of an empty screen.
  const brandNew = !learning.progress.some((entry) => entry.started);
  const firstCourse = getCourse(firstLessonCourseId({ chosen, planStartId: plan?.startCourse.id ?? null, owns: (id) => access.owns(id), complete: (id) => !!learning.progressFor(id)?.complete }));
  const firstLesson = firstCourse ? (learning.progressFor(firstCourse.id)?.nextLesson ?? firstCourse.lessons[0]) : undefined;

  return (
    <Screen variant="tab">
      {header}
      {/* The streak and the week come first, right under the greeting (owner, 2026-11-15). */}
      <WeekCard days={learning.data?.days ?? []} streak={learning.streak.current} best={learning.streak.best} doneToday={learning.streak.doneToday} lessonsDone={weekDone} target={target} />
      {brandNew && firstCourse && firstLesson && <FirstLessonCard course={firstCourse} lesson={firstLesson} />}
      {!brandNew && course && progress && (
        <Section title={strings.continueTitle}>
          <Card onPress={() => router.push({ pathname: '/course/[id]', params: { id: course.id } })} accessibilityLabel={course.title}>
            <View style={styles.row}>
              <IconTile icon={course.icon as MaterialSymbolName} tone={COURSE_TONES[course.kind]} />
              <View style={styles.flex}>
                <ThemedText type="cardTitle">{course.title}</ThemedText>
                <ThemedText type="secondary" themeColor="textSecondary" numberOfLines={2}>
                  {progress.nextLesson ? strings.nextUp(progress.nextLesson.day, progress.nextLesson.title) : strings.courseDone}
                </ThemedText>
              </View>
            </View>
            <View style={styles.progress}>
              <ProgressBar fraction={progress.fraction} done={progress.complete} accessibilityLabel={`${Math.round(progress.fraction * 100)}%`} />
            </View>
            {progress.nextLesson ? (
              <Button title={progress.started ? strings.resume : strings.start} icon="play_arrow" onPress={() => openLesson(progress.nextLesson!.id)} />
            ) : progress.complete && course.kind !== 'mini' ? (
              <Button title={strings.seeCertificate} icon="workspace_premium" variant="secondary" onPress={() => router.push({ pathname: '/certificate/[courseId]', params: { courseId: course.id } })} />
            ) : null}
          </Card>
          {alsoStarted.length > 0 && (
            <>
              <ThemedText type="secondarySemiBold" themeColor="textSecondary" accessibilityRole="header">
                {own.alsoInProgress}
              </ThemedText>
              {alsoStarted.map((entry) => (
                <ContinueRow key={entry.facts.id} facts={entry.facts} progress={entry.progress} />
              ))}
            </>
          )}
        </Section>
      )}

      {!game.isPending && <XpCard xp={game.xp} levelTitle={game.levelTitle} progress={game.progressToNext} onPress={() => router.push('/badges')} />}

      {pathPlan && <PathCard plan={pathPlan} progressFor={learning.progressFor} />}

      {/* About their own progress (it reads the courses they completed, with good quiz results, or a skill check): shown only with real evidence, and it can be dismissed. */}
      <LevelSuggestionCard />

      {progress && progress.started && progress.skills.length > 0 && (
        <Section title={strings.skillsTitle}>
          <Card>
            {progress.skills.slice(0, 5).map((skill) => (
              <View key={skill.id} style={styles.skill}>
                <View style={styles.skillRow}>
                  <ThemedText type="secondarySemiBold">{skill.label}</ThemedText>
                  <ThemedText type="caption" themeColor="textSecondary" tabular>
                    {`${Math.round(skill.fraction * 100)}%`}
                  </ThemedText>
                </View>
                <ProgressBar fraction={skill.fraction} done={skill.fraction >= 1} accessibilityLabel={`${skill.label}: ${Math.round(skill.fraction * 100)}%`} />
              </View>
            ))}
          </Card>
        </Section>
      )}

      {waiting.length > 0 && (
        <Section title={strings.projectsTitle}>
          <Card padded={false}>
            {waiting.map(({ course: entry, project }) => (
              <ListRow key={project.id} title={localizedProject(entry, project, language).title} subtitle={localizedCourse(entry, language).title} icon="rocket_launch" tone="teal" onPress={() => router.push({ pathname: '/project/[id]', params: { id: project.id } })} />
            ))}
          </Card>
        </Section>
      )}

      {recent.length > 0 && (
        <Section title={strings.recentTitle}>
          <Card padded={false}>
            {recent.map(({ row, lesson }) => (
              <ListRow key={row.lesson_id} title={lesson.title} subtitle={localizedCourse(getCourse(row.course_id), language)?.title} icon="check_circle" tone="mint" onPress={() => openLesson(row.lesson_id)} />
            ))}
          </Card>
        </Section>
      )}

      <Card onPress={() => router.push('/tali')} accessibilityLabel={strings.askTitle}>
        <View style={styles.row}>
          <Tali size={96} tight mood={learning.streak.doneToday ? 'encouraging' : 'explaining'} />
          <View style={styles.flex}>
            <ThemedText type="cardTitle">{strings.askTitle}</ThemedText>
            <ThemedText type="secondary" themeColor="textSecondary">
              {strings.askBody}
            </ThemedText>
          </View>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  skill: {
    gap: Spacing.one,
    marginBottom: Spacing.three,
  },
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  flex: {
    flex: 1,
    gap: Spacing.half,
  },
  progress: {
    marginVertical: Spacing.three,
  },
});
