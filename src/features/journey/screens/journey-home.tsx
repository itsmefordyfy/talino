import { router, useIsFocused } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { ContentWidthProvider } from '@/components/content-width';
import { SettingsButton } from '@/components/settings-button';
import { TabHeader } from '@/components/tab-header';
import { Screen, useScreenPadding, type ScreenHandle } from '@/components/ui/screen';
import { TabSkeleton } from '@/components/tab-skeleton';
import { ErrorState } from '@/components/ui/state-view';
import { COMPANIONS } from '@/features/companion/lib/companions';
import { useLearning } from '@/features/courses';
import { selectCompanion, selectLearnerName } from '@/features/settings/settings-slice';
import { Spacing } from '@/constants/theme';
import { useSplitView } from '@/hooks/use-split-view';
import { useViewportSettling } from '@/hooks/use-viewport-settling';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { dayPart, formatFriendlyDate } from '@/lib/greeting';
import { useAppSelector } from '@/store/hooks';
import { todayStrings } from '@/features/today/strings';

import { readSavedPosition, savePosition } from '../api/position-store';
import { JourneyHeader } from '../components/journey-header';
import { JourneyMap } from '../components/journey-map';
import { useJourney } from '../hooks/use-journey';
import { useMilestoneActions } from '../hooks/use-milestone-actions';
import { currentLine } from '../lib/tali-lines';
import { placeToOpen, signatureOf } from '../lib/position';
import { createTileWindow } from '../lib/tiles';
import { journeyStrings } from '../strings';

/** How far above the current node the map scrolls to, so the header's edge and Tali's card show with it. */
const LEAD = 24;

/** The width of the summary column beside the map on a wide window (an iPad in landscape). */
const SUMMARY_PANE_WIDTH = 380;

/**
 * Home: the learning journey. The learner's place on the road, what they have finished, what comes next and where it leads, with one
 * obvious button to carry on. Opens where they left off (or at their new current step if they have moved on since).
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
  const name = useAppSelector(selectLearnerName);
  const coachName = COMPANIONS[useAppSelector(selectCompanion)].name;
  const focused = useIsFocused();
  const split = useSplitView();
  const settling = useViewportSettling();
  const padding = useScreenPadding('tab');
  const theme = useTheme();
  const { height: viewport } = useWindowDimensions();
  const [tileWindow] = useState(() => createTileWindow());
  const screen = useRef<ScreenHandle>(null);
  const scrollY = useRef(0);
  const [opened, setOpened] = useState<ReadonlySet<string>>(new Set());
  const [mapTop, setMapTop] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);
  const lastSignature = useRef<string | null>(null);

  const { state } = journey;
  const signature = signatureOf(state);
  const ready = !journey.isPending && mapTop !== null && (currentY !== null || state.complete);

  // Put the learner where they were: the exact spot if nothing has moved on, else their (new) current step.
  useEffect(() => {
    if (!ready) return;
    const target = currentY === null ? null : mapTop + currentY - LEAD;
    if (lastSignature.current === null) {
      const place = placeToOpen(readSavedPosition(), signature, target);
      if (place !== null) screen.current?.scrollTo(place, false);
    } else if (lastSignature.current !== signature && target !== null) {
      screen.current?.scrollTo(target, true);
    }
    lastSignature.current = signature;
  }, [ready, signature, mapTop, currentY]);

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
  if (journey.isPending || settling) return <TabSkeleton variant="home" />;

  const current = state.current;
  const continueLabel = state.complete ? text.sheet.openPortfolio : current?.started ? text.sheet.continue : text.sheet.start;
  const onContinue = () => {
    if (!current) router.push('/portfolio');
    else if (!actions.go(current)) actions.open(current);
  };
  const remember = () => {
    savePosition({ y: scrollY.current, signature });
  };

  const summary = (
    <JourneyHeader
      state={state}
      coachName={coachName}
      streak={learning.streak.current}
      continueLabel={continueLabel}
      onContinue={onContinue}
      onAsk={() => actions.askTali(current)}
      onCustomize={actions.customize}
    />
  );
  const map = (
    <View onLayout={(event) => setMapTop(event.nativeEvent.layout.y)}>
      <JourneyMap
        definition={journey.definition}
        state={state}
        opened={opened}
        onToggleStage={(id) =>
          setOpened((previous) => {
            const next = new Set(previous);
            if (!next.delete(id)) next.add(id);
            return next;
          })
        }
        onOpenMilestone={actions.open}
        guide={currentLine(state, text.tali, name.split(' ')[0] ?? '')}
        coachName={coachName}
        onAskTali={() => actions.askTali(current)}
        onCurrentY={setCurrentY}
        active={focused}
        signalKey={signature}
        tileWindow={tileWindow}
      />
    </View>
  );
  const scrolling = {
    ref: screen,
    onScrollOffset: (y: number) => {
      scrollY.current = y;
      // Tells the neural layer where the screen is; it re-renders only when a tile boundary is crossed.
      tileWindow.scroll(y - (mapTop ?? 0), viewport);
    },
    onScrollEndDrag: remember,
    onMomentumScrollEnd: remember,
  };

  // A wide window (an iPad in landscape): the greeting and the learner's summary stay in a column of their own and the map scrolls beside it,
  // instead of one narrow column in the middle with the window's sides empty.
  if (split) {
    return (
      <View style={styles.split}>
        <ScrollView
          style={[styles.summaryPane, { width: SUMMARY_PANE_WIDTH + padding.paddingLeft, borderColor: theme.border }]}
          contentContainerStyle={[styles.summaryContent, { paddingTop: padding.paddingTop, paddingBottom: padding.paddingBottom, paddingLeft: padding.paddingLeft }]}>
          {header}
          {summary}
        </ScrollView>
        <View style={styles.flex}>
          <Screen variant="tab" {...scrolling}>
            {map}
          </Screen>
        </View>
      </View>
    );
  }

  return (
    <Screen variant="tab" {...scrolling}>
      {header}
      {summary}
      {map}
    </Screen>
  );
}

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
});
