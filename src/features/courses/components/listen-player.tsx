import { Pressable, StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/components/ui/icon';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import { formatClock, nextSpeed } from '../audio/lesson-audio';
import type { UseLessonListen } from '../audio/use-lesson-listen';
import type { OutlineSection } from '../lib/plain-text';
import { sectionAt } from '../lib/plain-text';
import { sectionTitleOf, type SpeechSegment } from '../lib/speech-segments';
import { courseStrings } from '../strings';
import { Waveform } from './waveform';

const SKIP = 15;
const SMALL = 36;

export type ListenPlayerProps = {
  listen: UseLessonListen;
  outline: readonly OutlineSection[];
  /** The lesson's sentences (the phone's voice has no clock, so its progress and section are the sentence it is on). */
  segments: readonly SpeechSegment[];
  /** The reading-speed setting, and how to change it. */
  rate: number;
  onRate: (rate: number) => void;
};

/** How far through the lesson, 0 to 1: by the clock for a recording, by the sentence for the voices that speak a sentence at a time. */
function progressOf(listen: UseLessonListen, segmentCount: number): number {
  if (listen.bySentence || listen.duration <= 0) return listen.activeSegment !== null && segmentCount > 0 ? Math.min(1, listen.activeSegment / segmentCount) : 0;
  return Math.min(1, listen.position / listen.duration);
}

/**
 * Listen, as a small player: Tali, the section playing and a speed chip on top; under them the waveform to tap or drag (the phone's
 * voice gets the same bar, by sentence); and a row of transport buttons: back 15 seconds, play and pause, forward 15 seconds (owner,
 * 2026-11-15: no previous/next sentence buttons; a tap on a sentence or the waveform moves around). It is the same for every voice: the
 * recording (Tali's or Tala's) and the phone's own; only the clock and the 15-second skips are the recording's, so the phone's voice
 * shows play and pause alone.
 */
export function ListenPlayer({ listen, outline, segments, rate, onRate }: ListenPlayerProps) {
  const segmentCount = segments.length;
  const strings = useLocalized(courseStrings);
  const theme = useTheme();
  const loading = listen.state === 'loading' || listen.buffering;
  const playing = listen.state === 'playing' || listen.state === 'speaking';
  // Before anything is played the player is already there, ready: Play starts the lesson (or carries on from where the learner stopped).
  const idle = listen.state === 'idle';
  const progress = progressOf(listen, segmentCount);
  const section = listen.bySentence ? sectionTitleOf(segments, listen.activeSegment, outline[0]?.title ?? '') : (sectionAt(outline, progress)?.title ?? outline[0]?.title ?? '');
  const marks = listen.bySentence ? [] : outline.slice(1).map((entry) => entry.at);
  const clock = !listen.bySentence && listen.duration > 0;
  const sentence = listen.activeSegment !== null ? listen.activeSegment + 1 : 0;
  const press = (action: () => void) => () => {
    tapFeedback();
    action();
  };

  return (
    <View>
      <Card tone="primarySoft" accessibilityLabel={strings.listenPlayer} style={styles.card}>
        <View style={styles.top}>
          <Tali size={52} tight mood={loading ? 'curious' : playing ? 'learning' : 'happy'} />
          <View style={styles.text}>
            <ThemedText type="secondarySemiBold" numberOfLines={1}>
              {loading ? strings.listenPreparing : section}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
              {strings.listenStatusLine(playing ? strings.listenNow : loading ? strings.listenPreparing : idle ? strings.listenReady : strings.listenPaused)}
            </ThemedText>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={strings.listenSpeed(rate)} onPress={press(() => onRate(nextSpeed(rate)))} hitSlop={8} style={({ pressed }) => [styles.speed, { borderColor: theme.border }, pressed && styles.pressedSoft]}>
            <ThemedText type="caption" themeColor="primaryText" tabular style={styles.speedText}>
              {`${rate.toFixed(1)}×`}
            </ThemedText>
          </Pressable>
          {!idle && (
            <Pressable accessibilityRole="button" accessibilityLabel={strings.stopListening} onPress={press(listen.toggle)} hitSlop={8} style={({ pressed }) => [styles.close, pressed && styles.pressedSoft]}>
              <Icon name="close" size={20} color="textSecondary" />
            </Pressable>
          )}
        </View>

        <Waveform
          peaks={listen.bySentence ? null : listen.peaks}
          progress={progress}
          marks={marks}
          height={32}
          onSeek={(fraction) => (listen.bySentence ? listen.jumpTo(Math.floor(fraction * segmentCount)) : listen.seekTo(fraction))}
          onAdjust={(direction) => (listen.bySentence ? listen.skipSentence(direction) : listen.skip(direction * SKIP))}
          accessibilityLabel={strings.listenProgress}
          accessibilityValue={clock ? strings.listenProgressValue(formatClock(listen.position), formatClock(listen.duration)) : strings.listenSentenceProgress(sentence, segmentCount)}
        />

        <View style={styles.bottom}>
          <ThemedText type="caption" themeColor="textSecondary" tabular style={styles.side}>
            {clock ? formatClock(listen.position) : sentence > 0 ? `${sentence}/${segmentCount}` : ''}
          </ThemedText>
          <View style={styles.transport}>
            {!listen.bySentence && <TransportButton icon="replay" label={strings.listenBack(SKIP)} badge={SKIP} disabled={loading || idle} onPress={press(() => listen.skip(-SKIP))} />}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={playing ? strings.listenPause : strings.listenPlay}
              disabled={loading}
              onPress={press(idle ? listen.toggle : listen.playPause)}
              style={({ pressed }) => [styles.play, { backgroundColor: theme.primary }, loading && styles.dim, pressed && styles.pressed]}>
              <Icon name={playing ? 'pause' : 'play_arrow'} size={26} color="onPrimary" filled />
            </Pressable>
            {!listen.bySentence && <TransportButton icon="replay" mirror label={strings.listenForward(SKIP)} badge={SKIP} disabled={loading || idle} onPress={press(() => listen.skip(SKIP))} />}
          </View>
          <ThemedText type="caption" themeColor="textSecondary" tabular style={[styles.side, styles.sideEnd]}>
            {clock ? `-${formatClock(listen.duration - listen.position)}` : ''}
          </ThemedText>
        </View>
        {listen.canJump && (
          <ThemedText type="caption" themeColor="textSecondary" style={styles.tip}>
            {strings.listenTapTip}
          </ThemedText>
        )}
      </Card>
    </View>
  );
}

type TransportButtonProps = {
  icon: IconName;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** A number drawn over the glyph (the seconds a skip moves). */
  badge?: number;
  mirror?: boolean;
};

function TransportButton({ icon, label, onPress, disabled, badge, mirror }: TransportButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [styles.skip, disabled && styles.dim, pressed && !disabled && styles.pressedSoft]}>
      <Icon name={icon} size={26} color="textSecondary" style={mirror ? styles.mirror : undefined} />
      {badge !== undefined && (
        <ThemedText type="caption" themeColor="textSecondary" style={styles.skipNumber}>
          {badge}
        </ThemedText>
      )}
    </Pressable>
  );
}

export type ListenDockProps = {
  listen: UseLessonListen;
  outline: readonly OutlineSection[];
  segments: readonly SpeechSegment[];
  rate: number;
  onRate: (rate: number) => void;
};

/**
 * The player's essentials in one slim row (back 15 seconds, play and pause, forward 15 seconds, the speed), for the foot of the lesson while the full player
 * has scrolled out of sight, so the learner can pause or skip without scrolling back up.
 */
export function ListenDock({ listen, outline, segments, rate, onRate }: ListenDockProps) {
  const strings = useLocalized(courseStrings);
  const theme = useTheme();
  const loading = listen.state === 'loading' || listen.buffering;
  const playing = listen.state === 'playing' || listen.state === 'speaking';
  const section = listen.bySentence ? sectionTitleOf(segments, listen.activeSegment, outline[0]?.title ?? '') : (sectionAt(outline, progressOf(listen, segments.length))?.title ?? outline[0]?.title ?? '');
  const press = (action: () => void) => () => {
    tapFeedback();
    action();
  };
  return (
    <View accessibilityLabel={strings.listenDock} style={[styles.dock, { backgroundColor: theme.primarySoft }]}>
      {!listen.bySentence && <TransportButton icon="replay" label={strings.listenBack(SKIP)} badge={SKIP} disabled={loading} onPress={press(() => listen.skip(-SKIP))} />}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={playing ? strings.listenPause : strings.listenPlay}
        disabled={loading}
        onPress={press(listen.playPause)}
        style={({ pressed }) => [styles.dockPlay, { backgroundColor: theme.primary }, loading && styles.dim, pressed && styles.pressed]}>
        <Icon name={playing ? 'pause' : 'play_arrow'} size={24} color="onPrimary" filled />
      </Pressable>
      {!listen.bySentence && <TransportButton icon="replay" mirror label={strings.listenForward(SKIP)} badge={SKIP} disabled={loading} onPress={press(() => listen.skip(SKIP))} />}
      <ThemedText type="secondarySemiBold" numberOfLines={1} style={styles.dockTitle}>
        {loading ? strings.listenPreparing : section}
      </ThemedText>
      <Pressable accessibilityRole="button" accessibilityLabel={strings.listenSpeed(rate)} onPress={press(() => onRate(nextSpeed(rate)))} hitSlop={8} style={({ pressed }) => [styles.speed, { borderColor: theme.border }, pressed && styles.pressedSoft]}>
        <ThemedText type="caption" themeColor="primaryText" tabular style={styles.speedText}>
          {`${rate.toFixed(1)}×`}
        </ThemedText>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={strings.stopListening} onPress={press(listen.toggle)} hitSlop={8} style={({ pressed }) => [styles.close, pressed && styles.pressedSoft]}>
        <Icon name="close" size={20} color="textSecondary" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.one,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  text: {
    flex: 1,
    gap: 1,
  },
  play: {
    width: MinTouchSize,
    height: MinTouchSize,
    borderRadius: MinTouchSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: {
    width: SMALL,
    height: SMALL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transport: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
  side: {
    minWidth: 40,
  },
  sideEnd: {
    textAlign: 'right',
  },
  tip: {
    textAlign: 'center',
    marginTop: Spacing.half,
  },
  skip: {
    width: SMALL,
    height: SMALL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipNumber: {
    position: 'absolute',
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '700',
  },
  mirror: {
    transform: [{ scaleX: -1 }],
  },
  speed: {
    minWidth: 44,
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  speedText: {
    fontWeight: '700',
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  // Smaller buttons dip in size and fade a little while held, so a tap is seen as well as felt.
  pressedSoft: {
    opacity: 0.55,
    transform: [{ scale: 0.9 }],
  },
  dim: {
    opacity: 0.4,
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
  },
  dockPlay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockTitle: {
    flex: 1,
    marginLeft: Spacing.one,
  },
});
