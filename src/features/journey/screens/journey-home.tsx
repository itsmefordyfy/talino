import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { ContentWidthProvider } from '@/components/content-width';
import { SettingsButton } from '@/components/settings-button';
import { TabHeader } from '@/components/tab-header';
import { TabSkeleton } from '@/components/tab-skeleton';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen, useScreenPadding, type ScreenHandle } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ErrorState } from '@/components/ui/state-view';
import { Spacing } from '@/constants/theme';
import { useWorld, WorldMap, worldThemeFor } from '@/features/adventure';
import { COMPANIONS } from '@/features/companion/lib/companions';
import { useLearning } from '@/features/courses';
import { homeCourseChosen, selectCompanion, selectHomeCourse, selectLearnerName } from '@/features/settings/settings-slice';
import { openPaywall } from '@/features/store';
import { todayStrings } from '@/features/today/strings';
import { useSplitView } from '@/hooks/use-split-view';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTabWarmup } from '@/hooks/use-tab-warmup';
import { useViewportSettling } from '@/hooks/use-viewport-settling';
import { dayPart, formatFriendlyDate } from '@/lib/greeting';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { CourseBar } from '../components/course-bar';
import { CourseCertificatePromo } from '../components/course-certificate-promo';
import { JourneyHeader } from '../components/journey-header';
import { JourneyMap } from '../components/journey-map';
import { useCourseActions } from '../hooks/use-course-actions';
import { useCourseModel } from '../hooks/use-course-model';
import { useJourney } from '../hooks/use-journey';
import { useMilestoneActions } from '../hooks/use-milestone-actions';
import { resolveActiveCourse } from '../lib/active-course';
import { signatureOf } from '../lib/position';
import { courseLine } from '../lib/tali-lines';
import { createTileWindow } from '../lib/tiles';
import { journeyStrings } from '../strings';

/** How far above the current node the map scrolls to, so the header's edge and Tali's card show with it. */
const LEAD = 24;

/** How long after Home is up the Roadmap is built in the background. */
const ROADMAP_BUILD_DELAY_MS = 1200;

/** The width of the summary column beside the map on a wide window (an iPad in landscape). */
const SUMMARY_PANE_WIDTH = 380;

type HomeView = 'course' | 'all';

/**
 * Home: the learner's central place (owner's brief, 2026-11-16). By default it shows the lessons of the ACTIVE course, kept to what they are
 * working on (owner, 2026-11-17): a small bar with the course and how far along they are (its name switches course), then ALL its lessons as
 * chapters in the same map the course page draws, the current lesson highlighted with Continue. The alternative view, All courses, is the journey: the
 * levels with every course as a node. Both read the same real lessons, so
 * what one shows the other agrees with, and nothing about switching or viewing changes any progress. Opening a course from the map is
 * instant: its lessons simply replace the map, with no transition.
 */
export function JourneyHome() {
  // Measured, so beside an iPad's sidebar the split follows the width left for Home rather than the window's.
  return (
    <ContentWidthProvider>
      <JourneyHomeContent />
    </ContentWidthProvider>
  );
}

function JourneyHomeContent() {
  const text = useLocalized(journeyStrings);
  const greetings = useLocalized(todayStrings);
  const journey = useJourney();
  const learning = useLearning();
  const actions = useMilestoneActions();
  const dispatch = useAppDispatch();
  const name = useAppSelector(selectLearnerName);
  const coachName = COMPANIONS[useAppSelector(selectCompanion)].name;
  const choice = useAppSelector(selectHomeCourse);
  const split = useSplitView();
  const settling = useViewportSettling();
  const warming = useTabWarmup();
  const padding = useScreenPadding('tab');
  const theme = useTheme();
  const { height: viewport } = useWindowDimensions();
  const [tileWindow] = useState(() => createTileWindow());
  const screen = useRef<ScreenHandle>(null);
  const [view, setView] = useState<HomeView>('course');
  const [opened, setOpened] = useState<ReadonlySet<string>>(new Set());
  const [mapTop, setMapTop] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);
  // The Roadmap is built once, in the background, shortly after Home is up (or at once if it is asked for first); from then on both views stay
  // mounted and switching only shows one and collapses the other, so it opens instantly and nothing is redrawn (owner, 2026-11-17).
  const [roadmapBuilt, setRoadmapBuilt] = useState(false);
  const lastSignature = useRef<string | null>(null);
  const toppedFor = useRef<string | null>(null);

  const { state, path } = journey;
  const signature = signatureOf(path);
  const active = resolveActiveCourse(path, choice);
  const model = useCourseModel(journey, learning, active);
  const language = useLanguage();
  // The active course as chapters of lessons (the same map the course page draws): every lesson is listed, none folded away.
  const { world, xp: worldXp } = useWorld(active?.courseId ?? '');
  const showAll = view === 'all';
  const mountRoadmap = showAll || roadmapBuilt;
  const ready = showAll && !journey.isPending && mapTop !== null && (currentY !== null || state.complete);

  /** Puts a course on Home: the pick is saved (with the time), and the course view is shown. Progress is never touched. */
  const show = (courseId: string) => {
    dispatch(homeCourseChosen(courseId));
    setView('course');
  };
  // A course picked elsewhere (Start on a course's page) is shown here too: a new pick always brings the course view.
  const pickedAt = choice?.at ?? null;
  const [seenPick, setSeenPick] = useState(pickedAt);
  if (seenPick !== pickedAt) {
    setSeenPick(pickedAt);
    if (pickedAt !== null && view !== 'course') setView('course');
  }
  const courseActions = useCourseActions(show);

  const changeView = (next: HomeView) => {
    if (next === view) return;
    // Both views open at the top (owner, 2026-11-17). Nothing is reset or measured again: the other view is already there.
    lastSignature.current = signature;
    screen.current?.scrollTo(0, false);
    setView(next);
  };

  // Roadmap: if progress moves on while it is open, it follows the learner's new current step.
  useEffect(() => {
    if (!ready) return;
    const target = currentY === null ? null : mapTop + currentY - LEAD;
    if (lastSignature.current !== null && lastSignature.current !== signature && target !== null) screen.current?.scrollTo(target, true);
    lastSignature.current = signature;
  }, [ready, signature, mapTop, currentY]);

  // Builds the Roadmap behind My course once Home is up and has had a moment to be used, so the first tap on it is instant too.
  const homeUp = !journey.isPending && !settling && !warming;
  useEffect(() => {
    if (roadmapBuilt || !homeUp) return;
    const timer = setTimeout(() => setRoadmapBuilt(true), ROADMAP_BUILD_DELAY_MS);
    return () => clearTimeout(timer);
  }, [roadmapBuilt, homeUp]);

  // My course: a course newly on screen (or coming back from the Roadmap) starts at the top (owner, 2026-11-17).
  const courseKey = !showAll && model ? model.node.key : null;
  useEffect(() => {
    if (courseKey === null) {
      toppedFor.current = null;
      return;
    }
    if (toppedFor.current !== courseKey) {
      toppedFor.current = courseKey;
      screen.current?.scrollTo(0, false);
    }
  }, [courseKey]);

  const now = new Date();
  const header = <TabHeader title={greetings.greetingName(greetings.greeting[dayPart(now)], name.split(' ')[0] ?? '')} subtitle={formatFriendlyDate(now)} accessory={<SettingsButton />} />;

  if (journey.isError) {
    return (
      <Screen variant="tab">
        {header}
        <ErrorState message={text.empty.body} onRetry={journey.refetch} />
      </Screen>
    );
  }
  if (journey.isPending || settling || warming) return <TabSkeleton variant="home" />;

  // The two Home tabs, always visible: the active course's lessons, or the Roadmap of every course.
  const tabs = (
    <SegmentedControl
      accessibilityLabel={text.home.tabsLabel}
      value={view}
      onChange={changeView}
      options={[
        { value: 'course', label: text.home.tabCourse },
        { value: 'all', label: text.home.tabRoadmap },
      ]}
    />
  );

  // My course.
  const courseCard = model ? (
    <CourseBar model={model} onSwitch={() => router.push('/journey/courses')} onShowCourse={courseActions.showCourse} onUnlock={() => void openPaywall('courses')} />
  ) : (
    <Card style={styles.empty}>
      <ThemedText type="section" accessibilityRole="header">
        {text.home.emptyTitle}
      </ThemedText>
      <ThemedText type="secondary" themeColor="textSecondary">
        {text.home.emptyBody}
      </ThemedText>
      <Button title={text.home.seeAll} variant="secondary" onPress={() => changeView('all')} />
    </Card>
  );
  const courseId = model?.node.courseId ?? null;
  const lessons =
    model && courseId && world ? (
      <View>
        <WorldMap
          showHeader={false}
          world={world}
          theme={worldThemeFor(model.course, language)}
          xp={worldXp}
          owned={model.owned}
          projectStatus={(projectId) => learning.projectRow(projectId)?.status}
          onOpenMission={courseActions.openLesson}
          onOpenProject={(projectId) => router.push({ pathname: '/project/[id]', params: { id: projectId } })}
        />
        {model.course.kind !== 'mini' && (
          <View style={styles.certificate}>
            <CourseCertificatePromo courseId={courseId} complete={learning.progressFor(courseId)?.complete === true} />
          </View>
        )}
        <View style={styles.footer}>
          <Button title={text.course.details} variant="ghost" onPress={() => router.push({ pathname: '/course/[id]', params: { id: courseId } })} />
        </View>
      </View>
    ) : null;

  // All courses.
  const summary = (
    <JourneyHeader
      state={state}
      coachName={coachName}
      streak={learning.streak.current}
      onAsk={() => actions.askTali(state.current)}
      onCustomize={actions.customize}
    />
  );
  const map = (
    <View onLayout={(event) => setMapTop(event.nativeEvent.layout.y)}>
      <JourneyMap
        definition={journey.definition}
        state={state}
        path={path}
        opened={opened}
        onToggleStage={(id) =>
          setOpened((previous) => {
            const next = new Set(previous);
            if (!next.delete(id)) next.add(id);
            return next;
          })
        }
        onOpenCourse={courseActions.showCourse}
        guide={courseLine(path, state, text.tali, name.split(' ')[0] ?? '')}
        coachName={coachName}
        onAskTali={() => actions.askTali(state.current)}
        onCurrentY={setCurrentY}
        tileWindow={tileWindow}
      />
    </View>
  );
  const scrolling = {
    ref: screen,
    onScrollOffset: (y: number) => {
      // Tells the neural layer where the screen is; it re-renders only when a tile boundary is crossed.
      if (showAll) tileWindow.scroll(y - (mapTop ?? 0), viewport);
    },
  };

  // A wide window (an iPad in landscape): the greeting and the summary (the course bar, or the journey's) stay in a
  // column of their own and the timeline or the map scrolls beside it, instead of one narrow column in the middle with the window's sides empty.
  if (split) {
    return (
      <View style={styles.split}>
        <ScrollView
          style={[styles.summaryPane, { width: SUMMARY_PANE_WIDTH + padding.paddingLeft, borderColor: theme.border }]}
          contentContainerStyle={[styles.summaryContent, { paddingTop: padding.paddingTop, paddingBottom: padding.paddingBottom, paddingLeft: padding.paddingLeft }]}>
          {header}
          {tabs}
          {showAll ? summary : courseCard}
        </ScrollView>
        <View style={styles.flex}>
          <Screen variant="tab" {...scrolling}>
            <View style={showAll ? styles.away : undefined}>{lessons}</View>
            {mountRoadmap && <View style={showAll ? undefined : styles.tucked} {...tucked(!showAll)}>{map}</View>}
          </Screen>
        </View>
      </View>
    );
  }

  return (
    <Screen variant="tab" {...scrolling}>
      {header}
      {tabs}
      <View style={showAll ? styles.away : undefined}>{courseCard}</View>
      <View style={showAll ? styles.away : undefined}>{lessons}</View>
      {mountRoadmap && (
        <>
          <View style={showAll ? undefined : styles.tucked} {...tucked(!showAll)}>
            {summary}
          </View>
          <View style={showAll ? undefined : styles.tucked} {...tucked(!showAll)}>
            {map}
          </View>
        </>
      )}
    </Screen>
  );
}

/** What a view that is built but not shown needs: it takes no part in touches or in what a screen reader reads. */
const tucked = (hidden: boolean) => (hidden ? ({ pointerEvents: 'none', accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' } as const) : {});

const styles = StyleSheet.create({
  split: {
    flex: 1,
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  summaryPane: {
    flexGrow: 0,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  summaryContent: {
    gap: Spacing.four,
    paddingRight: Spacing.three,
  },
  empty: {
    gap: Spacing.two,
  },
  certificate: {
    marginTop: Spacing.four,
  },
  // A view that isn't shown: My course is taken out of the layout (it was laid out before); the Roadmap stays laid out at full width, which
  // its map needs to draw, but squeezed to nothing (the negative margin cancels the gap the screen puts before it).
  away: {
    display: 'none',
  },
  tucked: {
    height: 0,
    overflow: 'hidden',
    marginTop: -Spacing.four,
  },
  footer: {
    marginTop: Spacing.two,
    alignItems: 'flex-start',
  },
});
