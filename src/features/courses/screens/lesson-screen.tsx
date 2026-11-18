import { router, Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CoachLine } from '@/components/coach-line';
import { Tali } from '@/components/brand/tali';
import { TaliSays } from '@/components/tali-says';
import { ThemedText } from '@/components/themed-text';
import { ActivitySlot, useGame } from '@/features/adventure';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { EmptyState } from '@/components/ui/empty-state';
import { Notice } from '@/components/ui/notice';
import { Screen, type ScreenHandle } from '@/components/ui/screen';
import { LoadingState, NotFoundState } from '@/components/ui/state-view';
import { Spacing } from '@/constants/theme';
import { useStudyClock } from '@/features/goal-activity';
import { useLearnerLevel } from '@/features/onboarding/hooks/use-learner-level';
import { onboardingStrings } from '@/features/onboarding/strings';
import { openPaywall, useAccess } from '@/features/store';
import { levelLessonLine, levelQuizLine } from '@/features/companion/lib/level-lines';
import { beforeQuizLine, courseFinishedLine, exerciseIntroLine, lessonIntroLine, quizMissedLine, quizRetakePassedLine } from '@/features/companion/lib/messages';
import { selectLearnerName, selectSpeechRate, speechRateChanged } from '@/features/settings/settings-slice';
import { useSplitView } from '@/hooks/use-split-view';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { recordLessonVisit } from '../api/lesson-visits';
import { useLessonListen } from '../audio/use-lesson-listen';
import { lessonOutline, lessonScript } from '../lib/plain-text';
import { blockUnit, lessonSegments, segmentIndexOf } from '../lib/speech-segments';
import { useFollowAlong } from '../hooks/use-follow-along';
import { successFeedback } from '@/lib/haptics';
import { reportError } from '@/lib/monitoring';

import { findLesson } from '../content';
import { courseHasLanguage, localizedFound } from '../lib/localization';
import { useLearning, useSaveQuiz, useSetTaskDone } from '../hooks/use-learning';
import { quizPassed } from '../lib/progress';
import { courseStrings } from '../strings';
import { CourseOutline } from '../components/course-outline';
import { LessonBlocks } from '../components/lesson-blocks';
import { ListenSection } from '../components/listen-section';
import { ListenDock } from '../components/listen-player';
import { ListenFollowProvider, SpeakFrame, SpokenText, type ListenFollowValue } from '../components/listen-follow';
import { InlineText } from '../components/inline-text';
import { LevelNote } from '../components/level-note';
import { KeyTermsProvider } from '../components/key-terms-context';
import { LessonIntro } from '../components/lesson-intro';
import { LessonStageBar } from '../components/lesson-stage-bar';
import { QuizView } from '../components/quiz-view';
import type { QuizQuestion } from '../content/types';
import { inAudience } from '../content/levels';
import { levelStrings } from '../level-strings';
import { adaptLesson, levelsInAudience } from '../lib/adaptation';
import { lessonKeyTerms } from '../lib/key-terms';
import { splitLesson } from '../lib/lesson-structure';

/** A new key for each quiz attempt, so a retake starts a fresh quiz. */
let attempts = 0;
const nextAttempt = () => (attempts += 1);

/**
 * Where the learner is. `practice` is reached only after a passed quiz (`afterQuiz`), or from a finished
 * lesson's Practice button, so an exercise is never shown before the concept has been taught and checked.
 */
type Mode =
  | { kind: 'read' }
  | { kind: 'quiz'; attempt: number }
  | { kind: 'practice'; afterQuiz: { correct: number; total: number; completedNow: boolean } | null }
  | { kind: 'result'; correct: number; total: number; missed: QuizQuestion[] };


/**
 * A lesson, with its course's outline beside it on a wide window (an iPad in landscape or a large portrait window, `useSplitView`),
 * so the learner sees where they are in the course and can move to another lesson without going back. On a phone, and on a narrow
 * iPad window, it is the lesson alone, as before.
 */
export function LessonScreen({ lessonId }: { lessonId: string }) {
  const split = useSplitView();
  const found = findLesson(lessonId);
  if (!split || !found) return <LessonContent lessonId={lessonId} />;
  return (
    <View style={styles.split}>
      <CourseOutline courseId={found.course.id} currentLessonId={lessonId} />
      <View style={styles.flex}>
        <LessonContent lessonId={lessonId} />
      </View>
    </View>
  );
}

/**
 * A day's lesson, in four stages: learn (introduction, explanations, visuals, code, key takeaways; with
 * read-aloud), quiz (every answer explained), practice (the activities and the laptop task) and the result.
 * The stages can only be entered in that order.
 */
function LessonContent({ lessonId }: { lessonId: string }) {
  const strings = useLocalized(courseStrings);
  const language = useLanguage();
  const found = localizedFound(findLesson(lessonId), language);
  const notTranslated = language !== 'en' && !courseHasLanguage(found?.course.id ?? '', language);
  const learning = useLearning();
  // Which activities are solved, for the practice footer's count.
  const game = useGame();
  // The level lessons adapt to (null = onboarding skipped: the shared lesson only). "Show everything" is for this view only, never saved.
  const learner = useLearnerLevel();
  const levelWords = useLocalized(levelStrings);
  const levelLabels = useLocalized(onboardingStrings).experience;
  const [showAll, setShowAll] = useState(false);
  const access = useAccess();
  // Time in an open lesson (reading, listening, the quiz, the practice) counts toward today's goal and its Lock Screen card.
  const canOpen = !!found && access.canOpenLesson(found.course.id, found.lesson.id);
  useStudyClock(canOpen);
  // Opening a lesson bookmarks it ("where you left off" in My Learning), so a course counts as started from its first lesson, not its first quiz.
  const courseId = found?.course.id;
  useEffect(() => {
    if (canOpen && courseId) recordLessonVisit(courseId, lessonId);
  }, [canOpen, courseId, lessonId]);
  const saveQuiz = useSaveQuiz();
  const setTask = useSetTaskDone();
  const name = useAppSelector(selectLearnerName);
  const dispatch = useAppDispatch();
  const rate = useAppSelector(selectSpeechRate);
  // Listening is the app's one listener (`audio/listen-controller`): it keeps going when this screen closes, and the player bar at the
  // top of every screen controls it. This is only this lesson's view of it.
  // The language the lesson is really shown in (an untranslated course stays English): Listen's own words ("Key takeaways.") follow it.
  const spokenLanguage = notTranslated ? 'en' : language;
  const outline = found ? lessonOutline(found.lesson, spokenLanguage) : [];
  // The lesson cut into the sentences Listen says: the screen lights up the one being spoken, and a tap on a sentence jumps to it.
  const segments = found ? lessonSegments(found.lesson, spokenLanguage) : [];
  const listen = useLessonListen({
    lessonId: found?.lesson.id ?? '',
    lessonTitle: found?.lesson.title ?? '',
    courseTitle: found?.course.title ?? '',
    outline,
    script: found ? lessonScript(found.lesson, spokenLanguage) : '',
    language: spokenLanguage,
    segments,
    rate,
  });
  const [mode, setMode] = useState<Mode>({ kind: 'read' });
  const screen = useRef<ScreenHandle>(null);
  // Keeps what is being read in view (and lets the learner scroll away without being pulled back).
  const follow = useFollowAlong(screen, found?.lesson.id ?? '');
  // Where the full player is in the lesson: once it has scrolled out of sight, a slim copy of its controls sits at the foot.
  const [titleTop, setTitleTop] = useState(0);
  const [playerEnd, setPlayerEnd] = useState(0);
  const [pastPlayer, setPastPlayer] = useState(false);

  if (!found) return <NotFoundState icon="menu_book" title={strings.notFound} />;
  if (learning.isPending || learner.isPending) return <LoadingState />;
  const { course, lesson } = found;
  const followValue: ListenFollowValue = {
    lessonId: lesson.id,
    index: segmentIndexOf(segments),
    // Blocks written for other levels and activities aren't spoken; every other block is a unit named by its place in the lesson's body.
    unitOfBlock: (block) => {
      const at = lesson.body.indexOf(block);
      return at < 0 || block.audience || block.type === 'activity' ? null : blockUnit(at);
    },
    jump: (segment) => {
      follow.resume();
      listen.jumpTo(segment);
    },
    register: follow.register,
  };
  const progress = learning.progressFor(course.id);
  const state = progress?.lessonState(lesson.id) ?? 'locked';
  const row = learning.lessonRow(lesson.id);
  // The course's first lesson opens for everyone; every other lesson needs the course (Talino Pro).
  const owned = access.canOpenLesson(course.id, lesson.id);
  const nextLesson = course.lessons.find((entry) => entry.day === lesson.day + 1) ?? null;

  // What THIS learner is shown, asked and given to practise: the shared lesson plus the pieces for their level (or everything).
  const adapted = adaptLesson(lesson, learner.level, showAll);
  const { learn } = splitLesson(adapted.body);
  const { activities } = adapted;
  const audienceLabel = (block: { audience?: Parameters<typeof inAudience>[0] }) =>
    showAll && block.audience && !inAudience(block.audience, learner.level) ? levelWords.forAudience(levelsInAudience(block.audience).map((level) => levelLabels[level].label)) : null;
  const takeawayCount = learn.reduce((count, block) => count + (block.type === 'takeaways' ? block.items.length : 0), 0);

  const goTo = (next: Mode) => {
    // The reading is over once the learner moves on to the quiz or the practice: the voice stops with it.
    if (next.kind !== 'read') listen.stop();
    setMode(next);
    screen.current?.scrollToTop();
  };

  const finishQuiz = async (correct: number, total: number, missed: QuizQuestion[]) => {
    let completedNow = false;
    try {
      const result = await saveQuiz.mutateAsync({ lessonId: lesson.id, courseId: course.id, correct, total });
      if (result.passed) successFeedback();
      completedNow = result.completedNow;
    } catch (error) {
      reportError(error, 'courses', { step: 'save_quiz' });
    }
    // A pass opens the practice (the lesson is already saved as done, so leaving early loses nothing); a miss shows what to review.
    if (quizPassed(correct, total)) goTo({ kind: 'practice', afterQuiz: { correct, total, completedNow } });
    else goTo({ kind: 'result', correct, total, missed });
  };

  const header = <Stack.Screen options={{ title: strings.day(lesson.day) }} />;
  const taskCard = (
    <Card>
      <View style={styles.taskHeader}>
        <Icon name="laptop_mac" size={22} color="primaryText" />
        <View style={styles.flex}>
          <ThemedText type="cardTitle">{strings.taskTitle}</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {strings.taskMinutes(lesson.task.minutes)}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="bodySemiBold" style={styles.taskTitle}>
        {lesson.task.title}
      </ThemedText>
      <View style={styles.steps}>
        {adapted.taskSteps.map((step, index) => (
          <View key={index} style={styles.step}>
            <ThemedText type="body" themeColor="primaryText" style={styles.stepNumber}>{`${index + 1}.`}</ThemedText>
            <ThemedText type="body" style={styles.flex}>
              {step}
            </ThemedText>
          </View>
        ))}
      </View>
      <ListRow title={strings.taskDone} checked={row?.task_done === 1} icon={row?.task_done === 1 ? 'check_box' : 'check_box_outline_blank'} onPress={() => setTask.mutate({ lessonId: lesson.id, courseId: course.id, done: row?.task_done !== 1 })} showChevron={false} />
    </Card>
  );

  if (!owned || state === 'locked') {
    return (
      <Screen contentStyle={styles.fill}>
        {header}
        {/* Tali (or Tala, whoever the learner chose), a plain reason and the next step: the paywall for a course they don't have. */}
        <EmptyState
          illustration={<Tali size={150} mood={!owned ? 'confident' : 'encouraging'} tight />}
          title={!owned ? strings.notOwnedTitle : strings.lockedTitle}
          message={!owned ? strings.notOwnedBody : strings.lockedLesson}
          action={
            <View style={styles.emptyActions}>
              {!owned && <Button title={strings.unlock} icon="lock_open" onPress={() => void openPaywall('courses')} />}
              <Button title={strings.backToCourse} variant="secondary" onPress={() => router.replace({ pathname: '/course/[id]', params: { id: course.id } })} />
            </View>
          }
        />
      </Screen>
    );
  }

  if (mode.kind === 'quiz') {
    return (
      <Screen ref={screen}>
        {header}
        <LessonStageBar stage="quiz" />
        <Button title={strings.backToLesson} icon="arrow_back" size="small" variant="ghost" onPress={() => goTo({ kind: 'read' })} />
        <QuizView key={mode.attempt} lessonId={lesson.id} questions={adapted.quiz} onFinish={finishQuiz} />
      </Screen>
    );
  }

  if (mode.kind === 'practice') {
    const { afterQuiz } = mode;
    const solvedCount = activities.filter((activity) => game.activityRows.some((row) => row.activity_id === activity.id && row.solved === 1)).length;
    const onContinue = () => {
      if (!afterQuiz) return goTo({ kind: 'read' });
      // A lesson finished for the first time gets its own summary (XP from the quiz and the practice, achievements, what comes next).
      if (afterQuiz.completedNow) router.replace({ pathname: '/mission-complete', params: { lessonId: lesson.id } });
      else goTo({ kind: 'result', correct: afterQuiz.correct, total: afterQuiz.total, missed: [] });
    };
    return (
      <Screen
        ref={screen}
        contentStyle={styles.practiceContent}
        footer={
          <View style={styles.footer}>
            {activities.length > 0 && (
              <ThemedText type="caption" themeColor="textSecondary" style={styles.center} accessibilityLiveRegion="polite">
                {strings.activitiesProgress(solvedCount, activities.length)}
              </ThemedText>
            )}
            {/* One row, not two stacked buttons: stacked they took a sixth of the screen and hid the last answer. */}
            <View style={styles.footerRow}>
              {afterQuiz && <Button title={strings.reviewLesson} variant="secondary" onPress={() => goTo({ kind: 'read' })} style={styles.footerButton} />}
              <Button title={afterQuiz ? strings.continue : strings.backToLesson} icon={afterQuiz ? 'arrow_forward' : 'arrow_back'} onPress={onContinue} style={styles.footerButton} />
            </View>
          </View>
        }>
        {header}
        <LessonStageBar stage="practice" />
        <ThemedText type="title" accessibilityRole="header">
          {strings.practiceTitle}
        </ThemedText>
        <CoachLine {...exerciseIntroLine({ lessonId: lesson.id, activities: activities.length, concept: activities[0]?.conceptLabel ?? activities[0]?.concept ?? null, score: afterQuiz ? { correct: afterQuiz.correct, total: afterQuiz.total } : null, language })} />
        {activities.length > 0 && (
          <ThemedText type="section" accessibilityRole="header">
            {strings.activitiesTitle}
          </ThemedText>
        )}
        {activities.map((activity) => (
          <View key={activity.id} style={styles.activity}>
            <ActivitySlot activity={activity} lessonId={lesson.id} courseId={course.id} />
            <Button title={strings.askTali} icon="forum" size="small" variant="ghost" onPress={() => router.push({ pathname: '/tali', params: { focus: `activity:${lesson.id}:${activity.id}` } })} />
          </View>
        ))}
        {taskCard}
      </Screen>
    );
  }

  if (mode.kind === 'result') {
    const passed = quizPassed(mode.correct, mode.total);
    const courseDone = learning.progressFor(course.id)?.complete;
    return (
      <Screen
        ref={screen}
        footer={
          <View style={styles.footer}>
            {passed && nextLesson ? (
              <Button title={strings.nextLesson} icon="arrow_forward" onPress={() => router.replace({ pathname: '/lesson/[id]', params: { id: nextLesson.id } })} />
            ) : passed && courseDone ? (
              <Button title={strings.certificateTitle} icon="workspace_premium" onPress={() => router.replace({ pathname: '/certificate/[courseId]', params: { courseId: course.id } })} />
            ) : !passed ? (
              <>
                <Button title={strings.reviewLesson} icon="menu_book" onPress={() => goTo({ kind: 'read' })} />
                <Button title={strings.retakeQuiz} icon="refresh" variant="secondary" onPress={() => goTo({ kind: 'quiz', attempt: nextAttempt() })} />
              </>
            ) : null}
            <Button title={strings.backToCourse} variant="secondary" onPress={() => router.back()} />
          </View>
        }>
        {header}
        {/* A missed quiz is still the quiz stage: "Done" lights up only for a finished lesson. */}
        <LessonStageBar stage={passed ? 'complete' : 'quiz'} />
        <View style={styles.result}>
          <TaliSays
            size="large"
            layout="stacked"
            {...(passed ? (courseDone ? courseFinishedLine({ courseTitle: course.title, language }) : quizRetakePassedLine({ correct: mode.correct, total: mode.total, language })) : quizMissedLine({ name, correct: mode.correct, total: mode.total, language }))}
          />
          <ThemedText type="title" style={styles.center} accessibilityRole="header">
            {passed ? strings.passedTitle : strings.failedTitle}
          </ThemedText>
          <ThemedText type="statSmall" tabular style={styles.center}>
            {strings.score(mode.correct, mode.total)}
          </ThemedText>
          {!passed && (
            <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
              {strings.passRule}
            </ThemedText>
          )}
        </View>
        {mode.missed.length > 0 && (
          <View style={styles.missed}>
            <ThemedText type="section" accessibilityRole="header">
              {strings.missedTitle}
            </ThemedText>
            {mode.missed.map((question) => (
              <Card key={question.id}>
                <View style={styles.missedBody}>
                  <InlineText type="bodySemiBold" text={question.prompt} />
                  <InlineText type="secondary" themeColor="primaryText" text={strings.missedAnswer(question.choices[question.answer])} />
                  <InlineText type="body" text={question.explanation} />
                  <Button title={strings.askTali} icon="forum" size="small" variant="ghost" onPress={() => router.push({ pathname: '/tali', params: { focus: `quiz:${lesson.id}:${question.id}` } })} />
                </View>
              </Card>
            ))}
          </View>
        )}
      </Screen>
    );
  }

  const showDock = listen.state !== 'idle' && pastPlayer;
  return (
    <ListenFollowProvider value={followValue}>
      <KeyTermsProvider terms={lessonKeyTerms(lesson)}>
        <Screen
          ref={screen}
          onScrollOffset={(y) => {
            setPastPlayer(y > titleTop + playerEnd - 80);
            follow.recheck();
          }}
          onScrollBeginDrag={follow.suspend}
          footer={
            <View style={styles.footer}>
              {/* The learner scrolled away from what is being read: one tap brings the reading, and the following, back. */}
              {listen.state !== 'idle' && follow.away && <Button title={strings.listenFollow} icon="my_location" size="small" variant="secondary" onPress={follow.resume} />}
              {showDock && <ListenDock listen={listen} outline={outline} segments={segments} rate={rate} onRate={(next) => dispatch(speechRateChanged(next))} />}
              <Button title={state === 'done' ? strings.retakeQuiz : strings.takeQuiz} icon="quiz" onPress={() => goTo({ kind: 'quiz', attempt: nextAttempt() })} />
              {/* A finished lesson's exercises stay reachable without retaking the quiz; an unfinished one reaches them only through the quiz. */}
              {state === 'done' && <Button title={strings.practiceButton} icon="edit_note" variant="secondary" onPress={() => goTo({ kind: 'practice', afterQuiz: null })} />}
            </View>
          }>
          {header}
          <LessonStageBar stage="learn" />
          <View style={styles.titleBlock} onLayout={(event) => setTitleTop(event.nativeEvent.layout.y)}>
            {/* The player is the first thing on the lesson, above the course line and the title (owner, 2026-11-15). */}
            <View onLayout={(event) => setPlayerEnd(event.nativeEvent.layout.y + event.nativeEvent.layout.height)}>
              <ListenSection lesson={lesson} courseTitle={course.title} listen={listen} outline={outline} segments={segments} rate={rate} onRate={(next) => dispatch(speechRateChanged(next))} />
            </View>
            <ThemedText type="caption" themeColor="primaryText" style={styles.eyebrow}>
              {`${course.title} · ${strings.minutes(lesson.minutes)}`}
            </ThemedText>
            <SpeakFrame unit="title" marker="none">
              <SpokenText unit="title" type="title" accessibilityRole="header" text={lesson.title} />
            </SpeakFrame>
          </View>
          {notTranslated && <Notice tone="info" message={strings.lessonNotInTagalog} />}
          {state === 'done' && <Notice tone="success" message={strings.alreadyDone} />}
          {adapted.summary.hasLevelContent && <LevelNote level={learner.level} showAll={showAll} onToggleAll={() => setShowAll((all) => !all)} hiddenCount={adapted.summary.hiddenCount} />}
          <CoachLine divider="below" {...levelLessonLine(lessonIntroLine({ name, lesson, courseLessons: course.lessons.length, done: state === 'done', courseTitle: course.title, language }), { level: learner.level, lesson, done: state === 'done', language })} />
          <LessonIntro lesson={lesson} />
          <LessonBlocks blocks={learn} audienceLabel={audienceLabel} />
          <CoachLine divider="above" {...levelQuizLine(beforeQuizLine({ lessonId: lesson.id, takeaways: takeawayCount, questions: adapted.quiz.length, retake: state === 'done', language }), { level: learner.level, questions: adapted.quiz.length, retake: state === 'done', language })} />
        </Screen>
      </KeyTermsProvider>
    </ListenFollowProvider>
  );
}

const styles = StyleSheet.create({
  split: {
    flex: 1,
    flexDirection: 'row',
  },
  fill: {
    flexGrow: 1,
  },
  emptyActions: {
    alignSelf: 'stretch',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  titleBlock: {
    gap: Spacing.two,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  taskTitle: {
    marginTop: Spacing.three,
  },
  steps: {
    gap: Spacing.two,
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  step: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  stepNumber: {
    minWidth: 20,
  },
  flex: {
    flex: 1,
  },
  result: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.five,
  },
  center: {
    textAlign: 'center',
  },
  footer: {
    gap: Spacing.two,
  },
  // Room under the last card, so it can be scrolled well clear of the pinned footer.
  practiceContent: {
    paddingBottom: Spacing.six,
  },
  footerRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  footerButton: {
    flex: 1,
  },
  practiceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  missed: {
    gap: Spacing.three,
  },
  missedBody: {
    gap: Spacing.two,
  },
  activity: {
    gap: Spacing.one,
    alignItems: 'stretch',
  },
});
