import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import type { MaterialSymbolName } from '@/components/ui/material-symbols';
import { useWorld, WorldMap, worldThemeFor } from '@/features/adventure';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Notice } from '@/components/ui/notice';
import { Section } from '@/components/ui/section';
import { LoadingState, NotFoundState } from '@/components/ui/state-view';
import { HeroInk, Spacing } from '@/constants/theme';
import { openPaywall, useAccess } from '@/features/store';
import { CoachLine } from '@/components/coach-line';
import { courseIntroLine } from '@/features/companion/lib/messages';
import { browseStrings } from '@/features/discover/browse-strings';
import { recordCourseOpened } from '@/features/discover/discover-slice';
import { selectLearnerName } from '@/features/settings/settings-slice';
import { formatDate } from '@/lib/dates';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useTheme } from '@/hooks/use-theme';

import { getCourse } from '../content';
import { courseMeta } from '../content/catalog/meta';
import { factsFor, formatDuration, learningObjectives } from '../lib/catalog-facts';
import { categoryLabel } from '../content/catalog/catalog-text';
import { learningLevelLabel, technologyLabel } from '../lib/discovery/filters';
import { LEARNING_LEVEL_TEXT } from '../lib/learning-level';
import { PATH_NEXT_STEPS } from '../content/ai-dev/syllabus';
import { useBestFor } from '../hooks/use-best-for';
import { useLearning } from '../hooks/use-learning';
import { useOpenLesson } from '../hooks/use-open-lesson';
import { useCourseNotTranslated, useLocalizedCourse } from '../hooks/use-localized-course';
import { courseStrings } from '../strings';
import { CourseHero } from '../components/course-hero';
import { ProgressRing } from '../components/progress-ring';

/** A course: where it leads, the skills meter, its lessons and projects, and the certificate. */
export function CourseScreen({ courseId }: { courseId: string }) {
  const strings = useLocalized(courseStrings);
  const browse = useLocalized(browseStrings);
  const openLesson = useOpenLesson();
  const language = useLanguage();
  const course = useLocalizedCourse(getCourse(courseId));
  const notTranslated = useCourseNotTranslated(course);
  const learning = useLearning();
  const { world, xp: worldXp } = useWorld(courseId);
  const access = useAccess();
  const name = useAppSelector(selectLearnerName);
  const owned = course ? access.owns(course.id) : false;
  const dispatch = useAppDispatch();
  // Opening a course counts its technologies as explored (the recommendations read it as real interest). Once per opening.
  const openedId = course?.id;
  useEffect(() => {
    if (openedId) dispatch(recordCourseOpened(openedId));
  }, [openedId, dispatch]);
  const bestFor = useBestFor(course?.level ?? 'beginner');

  if (!course) return <NotFoundState icon="school" title={strings.courseNotFound} />;
  if (learning.isPending) return <LoadingState />;
  const progress = learning.progressFor(course.id);
  const next = progress?.nextLesson ?? null;

  // Courses that lead into the AI-Assisted Development path point to the path courses that take them further.
  const facts = factsFor(course.id);
  const prerequisites = courseMeta(course)
    .prerequisites.map((id) => getCourse(id))
    .filter((entry) => entry !== undefined);
  const objectives = learningObjectives(course);
  const nextSteps = (PATH_NEXT_STEPS[course.id] ?? []).map(getCourse).filter((entry) => entry !== undefined);
  // The course's difficulty is its learning level (Beginner to Expert, from the journey placement), shown everywhere the same way.
  const level = facts ? learningLevelLabel(facts.learningLevel) : null;
  const accessLabel = course.kind === 'starter' ? browse.accessFree : owned ? browse.accessIncluded : browse.accessPro;
  const footer = !owned ? (
    <Button title={strings.unlock} icon="lock_open" onPress={() => void openPaywall('courses')} />
  ) : next ? (
    <Button title={progress?.started ? strings.continue : strings.start} icon="play_arrow" onPress={() => openLesson(next.id)} />
  ) : progress?.complete && course.kind !== 'mini' ? (
    <Button title={strings.certificateTitle} icon="workspace_premium" onPress={() => router.push({ pathname: '/certificate/[courseId]', params: { courseId: course.id } })} />
  ) : null;

  return (
    <Screen footer={footer}>
      <Stack.Screen options={{ title: course.title }} />
      <CourseHero icon={course.icon} course={course} eyebrow={level ? `${strings.kinds[course.kind]} · ${level}` : strings.kinds[course.kind]} title={course.title} subtitle={course.tagline}>
        {progress && (
          <View style={styles.heroRow}>
            <ProgressRing fraction={progress.fraction} tint={HeroInk.text} track={HeroInk.glass} accessibilityLabel={strings.lessonsDone(progress.lessonsDone, progress.lessonsTotal)} />
            <View style={styles.flex}>
              <ThemedText type="bodySemiBold" style={{ color: HeroInk.text }} tabular>
                {strings.lessonsDone(progress.lessonsDone, progress.lessonsTotal)}
              </ThemedText>
              <ThemedText type="secondary" style={{ color: HeroInk.muted }} tabular>
                {`${strings.projects(progress.projectsTotal)} · ${strings.projectsPassed(progress.projectsPassed)}`}
                {progress.quizAverage !== null ? ` · ${strings.quizAverage(Math.round(progress.quizAverage * 100))}` : ''}
              </ThemedText>
            </View>
          </View>
        )}
      </CourseHero>
      {notTranslated && <Notice tone="info" message={`${strings.notInTagalogTitle}. ${strings.notInTagalogBody}`} />}
      <CoachLine {...courseIntroLine({ name, course: { id: course.id, title: course.title, kind: course.kind, lessons: course.lessons.length }, lessonsDone: progress?.lessonsDone ?? 0, nextLessonTitle: next?.title ?? null, hasCertificate: course.kind !== 'mini', language })} />
      {course.sponsor && (
        <ThemedText type="caption" themeColor="textSecondary">
          {strings.sponsored(course.sponsor)}
        </ThemedText>
      )}
      <ThemedText type="body">{course.description}</ThemedText>

      {world && (
        <WorldMap
          world={world}
          theme={worldThemeFor(course, language)}
          xp={worldXp}
          owned={owned}
          projectStatus={(projectId) => learning.projectRow(projectId)?.status}
          onOpenMission={openLesson}
          onOpenProject={(projectId) => router.push({ pathname: '/project/[id]', params: { id: projectId } })}
        />
      )}

      {facts && (
        <Section title={strings.aboutTitle}>
          <View style={styles.pills}>
            <Fact label={browse.levelDetail(learningLevelLabel(facts.learningLevel))} />
            <Fact label={strings.estimatedTime(formatDuration(facts.minutes))} />
            <Fact label={strings.lessons(facts.lessonCount)} />
            <Fact label={categoryLabel(facts.category, language)} />
            <Fact label={accessLabel} tone="primary" />
          </View>
          <ThemedText type="caption" themeColor="textSecondary">
            {LEARNING_LEVEL_TEXT[facts.learningLevel].description}
          </ThemedText>
          {/* Advice, never a restriction: every course opens for every level. */}
          <View accessibilityLabel={`${bestFor.text}. ${bestFor.advice}`}>
            <ThemedText type="secondarySemiBold">{bestFor.text}</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              {bestFor.advice}
            </ThemedText>
          </View>
          {facts.technologies.length > 0 && (
            <View style={styles.pills} accessibilityLabel={strings.technologiesTitle}>
              {facts.technologies.map((id) => (
                <Fact key={id} label={technologyLabel(id)} tone="primary" />
              ))}
            </View>
          )}
        </Section>
      )}

      <Section title={course.objectives && course.objectives.length > 0 ? strings.courseObjectives : strings.finishLine}>
        <Card>
          <View style={styles.list}>
            {objectives.map((line, index) => (
              <View key={index} style={styles.line}>
                <Icon name="flag" size={18} color="primaryText" />
                <ThemedText type="body" style={styles.flex}>
                  {line}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>
      </Section>

      {course.projects.length > 0 && (
        <Section title={browse.buildTitle}>
          <ThemedText type="secondary" themeColor="textSecondary">
            {browse.buildBody}
          </ThemedText>
          {course.projects.map((project) => (
            <Card key={project.id} onPress={owned ? () => router.push({ pathname: '/project/[id]', params: { id: project.id } }) : undefined} accessibilityLabel={`${project.title}. ${project.summary}`}>
              <View style={styles.line}>
                <Icon name="construction" size={20} color="primaryText" />
                <View style={styles.flex}>
                  <ThemedText type="cardTitle">{project.title}</ThemedText>
                  <ThemedText type="secondary" themeColor="textSecondary">
                    {project.summary}
                  </ThemedText>
                </View>
              </View>
            </Card>
          ))}
        </Section>
      )}

      {prerequisites.length > 0 && (
        <Section title={strings.prerequisitesTitle}>
          <ThemedText type="secondary" themeColor="textSecondary">
            {strings.prerequisitesBody}
          </ThemedText>
          {prerequisites.map((entry) => {
            const done = !!learning.progressFor(entry.id)?.complete;
            return (
              <ListRow
                key={entry.id}
                title={entry.title}
                titleLines={2}
                subtitle={done ? strings.prerequisiteDone : strings.prerequisiteNotYet}
                icon={done ? 'check_circle' : 'radio_button_unchecked'}
                iconColor={done ? 'statusOk' : 'textTertiary'}
                iconBackground={done ? 'statusOkSoft' : 'backgroundSelected'}
                onPress={() => router.push({ pathname: '/course/[id]', params: { id: entry.id } })}
              />
            );
          })}
        </Section>
      )}

      {course.coachRole && (
        <Card onPress={() => router.push({ pathname: '/tali', params: { mode: course.coachRole?.id } })} accessibilityLabel={strings.coachRole(course.coachRole.label)}>
          <View style={styles.line}>
            <Icon name="forum" size={22} color="secondaryText" />
            <View style={styles.flex}>
              <ThemedText type="cardTitle">{strings.coachRole(course.coachRole.label)}</ThemedText>
              <ThemedText type="secondary" themeColor="textSecondary">
                {course.coachRole.description}
              </ThemedText>
            </View>
            <Icon name="chevron_right" size={20} color="textTertiary" />
          </View>
        </Card>
      )}

      {progress && (
        <Section title={strings.skills}>
          <Card>
            <View style={styles.list}>
              {progress.skills.map((skill) => (
                <View key={skill.id} style={styles.skill}>
                  <View style={styles.skillLabel}>
                    <ThemedText type="secondarySemiBold" style={styles.flex}>
                      {skill.label}
                    </ThemedText>
                    <ThemedText type="caption" themeColor="textSecondary" tabular>{`${Math.round(skill.fraction * 100)}%`}</ThemedText>
                  </View>
                  <ProgressBar fraction={skill.fraction} done={skill.fraction >= 1} accessibilityLabel={`${skill.label} ${Math.round(skill.fraction * 100)}%`} />
                </View>
              ))}
            </View>
          </Card>
        </Section>
      )}

      {nextSteps.length > 0 && (
        <Section title={strings.goFurtherTitle}>
          <ThemedText type="secondary" themeColor="textSecondary">
            {strings.goFurtherBody}
          </ThemedText>
          {nextSteps.map((next) => (
            <ListRow
              key={next.id}
              title={next.title}
              titleLines={2}
              subtitle={next.level ? strings.levels[next.level] : undefined}
              icon={next.icon as MaterialSymbolName}
              onPress={() => router.push({ pathname: '/course/[id]', params: { id: next.id } })}
            />
          ))}
        </Section>
      )}

      {course.kind === 'mini' ? (
        <ThemedText type="secondary" themeColor="textSecondary">
          {strings.badgeOnly}
        </ThemedText>
      ) : (
        <Section title={strings.certificateTitle}>
          <ListRow
            title={progress?.complete ? strings.certificateReady : strings.certificateLocked}
            titleLines={2}
            icon="workspace_premium"
            tone="amber"
            onPress={progress?.complete ? () => router.push({ pathname: '/certificate/[courseId]', params: { courseId: course.id } }) : undefined}
            style={styles.certificate}
          />
        </Section>
      )}
      <ThemedText type="caption" themeColor="textTertiary">
        {strings.contentReviewed(formatDate(course.updated))}
      </ThemedText>
    </Screen>
  );
}

/** A small pill for a fact about the course (its level, its time, a technology). */
function Fact({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'primary' }) {
  const theme = useTheme();
  return (
    <View style={[styles.pill, { backgroundColor: tone === 'primary' ? theme.primarySoft : theme.backgroundSelected }]}>
      <ThemedText type="secondarySemiBold" themeColor={tone === 'primary' ? 'primaryText' : 'textSecondary'}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  pill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: 999,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  list: {
    gap: Spacing.three,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  skill: {
    gap: Spacing.one,
  },
  skillLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certificate: {
    borderRadius: 20,
  },
});
