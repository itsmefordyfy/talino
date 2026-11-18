import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { ErrorState, LoadingState } from '@/components/ui/state-view';
import { Radius, Spacing } from '@/constants/theme';
import { getCourse, localizedCourse, recentVisits, useLearning, useLessonVisits, useOpenLesson } from '@/features/courses';
import { homeCourseChosen, selectHomeCourse } from '@/features/settings/settings-slice';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';
import { closeScreen } from '@/lib/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { useJourney } from '../hooks/use-journey';
import { myLearning, resolveActiveCourse, type LearningEntry, type LearningGroup } from '../lib/active-course';
import { journeyStrings } from '../strings';

const GROUPS: readonly LearningGroup[] = ['in-progress', 'ready', 'completed'];

/**
 * "My Learning" (owner's brief, 2026-11-16): the courses the learner can put on Home without leaving it. Picking one only changes which
 * course Home shows: it never touches a lesson, a score or a certificate, so every course keeps exactly the progress it has.
 */
export function CourseSwitcherScreen() {
  const text = useLocalized(journeyStrings);
  const theme = useTheme();
  const journey = useJourney();
  const dispatch = useAppDispatch();
  const choice = useAppSelector(selectHomeCourse);
  const visits = useLessonVisits();
  const learning = useLearning();
  const language = useLanguage();
  const openLesson = useOpenLesson();

  if (journey.isError) return <ErrorState message={text.empty.body} onRetry={journey.refetch} />;
  if (journey.isPending) return <LoadingState />;

  const active = resolveActiveCourse(journey.path, choice);
  const opened = Object.fromEntries(Object.entries(visits).map(([courseId, visit]) => [courseId, visit.at]));
  const entries = myLearning(journey.path, active?.key ?? null, opened);
  // The lessons the learner opened last and hasn't finished, newest first (a finished one points at what follows it; a finished course is left out).
  const leftOff = recentVisits(visits)
    .flatMap(({ courseId }) => {
      const original = getCourse(courseId);
      const progress = learning.progressFor(courseId);
      const lessonId = visits[courseId]?.lessonId;
      if (!original || !progress || !lessonId || progress.complete) return [];
      const course = localizedCourse(original, language);
      const visited = course.lessons.find((lesson) => lesson.id === lessonId);
      const finished = progress.lessonState(lessonId) === 'done';
      const target = finished ? progress.nextLesson : visited;
      if (!target) return [];
      const lesson = course.lessons.find((entry) => entry.id === target.id) ?? target;
      const detail = finished ? text.home.leftOffNext(course.title, lesson.day) : text.home.leftOffContinue(course.title, lesson.day);
      return [{ courseId, lessonId: lesson.id, title: lesson.title, detail }];
    })
    .slice(0, 3);
  const stages = journey.state.stages;
  const choose = (entry: LearningEntry) => {
    tapFeedback();
    // The already-showing course is not "picked" again: that would stamp a newer time over lessons the learner may do elsewhere.
    if (!entry.active && entry.node.courseId) dispatch(homeCourseChosen(entry.node.courseId));
    closeScreen();
  };
  const detailOf = ({ node, group }: LearningEntry) => (group === 'completed' ? text.home.rowDone(node.lessonsTotal) : group === 'ready' ? text.home.rowReady(node.lessonsTotal) : text.home.rowProgress(node.lessonsDone, node.lessonsTotal, node.percent));

  const current = entries.find((entry) => entry.active) ?? null;
  const others = entries.filter((entry) => !entry.active);
  const levelOf = (entry: LearningEntry) => stages[entry.node.stageIndex]?.def.title ?? '';

  return (
    <Screen>
      <View style={styles.head}>
        <ThemedText type="title" accessibilityRole="header">
          {text.home.pickerTitle}
        </ThemedText>
        <ThemedText type="secondary" themeColor="textSecondary">
          {text.home.pickerBody}
        </ThemedText>
      </View>
      {leftOff.length > 0 && (
        <Section title={text.home.leftOffTitle}>
          <Card padded={false}>
            {leftOff.map((entry) => (
              <ListRow
                key={entry.courseId}
                title={entry.title}
                titleLines={2}
                subtitle={entry.detail}
                icon="play_circle"
                iconColor="primary"
                accessibilityLabel={text.home.leftOffLabel(entry.title, entry.detail)}
                onPress={() => {
                  tapFeedback();
                  openLesson(entry.lessonId);
                }}
              />
            ))}
          </Card>
        </Section>
      )}
      {current && (
        <Section title={text.home.showingOnHome}>
          <Card onPress={() => choose(current)} accessibilityLabel={text.home.activeLabel(current.node.title, levelOf(current), detailOf(current))} style={[styles.active, { borderColor: theme.primary }]}>
            <View style={styles.activeTop}>
              <View style={[styles.activeIcon, { backgroundColor: theme.primary }]}>
                <Icon name={current.group === 'completed' ? 'check' : current.node.icon} size={24} tint={theme.onPrimary} />
              </View>
              <View style={styles.flex}>
                <ThemedText type="section" numberOfLines={2}>
                  {current.node.title}
                </ThemedText>
                <ThemedText type="secondary" themeColor="textSecondary" numberOfLines={1}>
                  {levelOf(current)}
                </ThemedText>
              </View>
            </View>
            <ProgressBar thick fraction={current.node.fraction} done={current.group === 'completed'} accessibilityLabel={text.home.rowProgress(current.node.lessonsDone, current.node.lessonsTotal, current.node.percent)} />
            <ThemedText type="secondarySemiBold" themeColor="primaryText" tabular>
              {detailOf(current)}
            </ThemedText>
          </Card>
        </Section>
      )}
      {entries.length === 0 && (
        <ThemedText type="secondary" themeColor="textSecondary">
          {text.home.pickerEmpty}
        </ThemedText>
      )}
      {GROUPS.map((group) => {
        const rows = others.filter((entry) => entry.group === group);
        if (rows.length === 0) return null;
        return (
          <Section key={group} title={text.home.groups[group]}>
            <Card padded={false}>
              {rows.map((entry) => {
                const level = levelOf(entry);
                const detail = detailOf(entry);
                return (
                  <ListRow
                    key={entry.node.key}
                    title={entry.node.title}
                    titleLines={2}
                    subtitle={`${level} · ${detail}`}
                    icon={group === 'completed' ? 'check' : entry.node.icon}
                    iconColor={group === 'completed' ? 'statusOk' : 'primary'}
                    accessibilityLabel={text.home.rowLabel(entry.node.title, level, detail, false)}
                    detail={group === 'in-progress' ? <ProgressBar fraction={entry.node.fraction} accessibilityLabel={text.home.rowProgress(entry.node.lessonsDone, entry.node.lessonsTotal, entry.node.percent)} /> : undefined}
                    onPress={() => choose(entry)}
                  />
                );
              })}
            </Card>
          </Section>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { gap: Spacing.two },
  flex: { flex: 1 },
  active: { gap: Spacing.three, borderWidth: 2 },
  activeTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  activeIcon: { width: 48, height: 48, borderRadius: Radius.pill, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center' },
});
