import { router, usePathname } from 'expo-router';
import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Tali } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { VoiceWave } from '@/components/ui/voice-wave';
import { MinTouchSize, Spacing } from '@/constants/theme';
import { selectSpeechRate } from '@/features/settings/settings-slice';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';
import { setTopCovered } from '@/lib/top-cover';
import { useAppSelector } from '@/store/hooks';

import { formatClock } from '../audio/lesson-audio';
import { getListenSnapshot, setListenRate, stopListening, subscribeListen, togglePlayPause } from '../audio/listen-controller';
import { sectionAt } from '../lib/plain-text';
import { sectionTitleOf } from '../lib/speech-segments';
import { courseStrings } from '../strings';

/**
 * The player at the top of every screen while a lesson is being read aloud (the audio carries on when the learner leaves the lesson).
 * It sits above the whole navigator and the navigator is laid out under it, so no screen's header is covered; a tap opens the lesson.
 * On the lesson that is playing, the lesson's own full player is on screen, so the bar steps aside there.
 */
export function ListenBarFrame({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeListen, getListenSnapshot);
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const rate = useAppSelector(selectSpeechRate);
  // The speed setting is followed from here, because this is mounted whichever screen is open.
  useEffect(() => setListenRate(rate), [rate]);

  const { session, state } = snapshot;
  const visible = !!session && state !== 'idle' && pathname !== `/lesson/${session.lessonId}`;
  // The tabs measure their own safe area and don't know the bar covers the status bar: tab screens subtract this from their top padding.
  useEffect(() => {
    setTopCovered(visible ? insets.top : 0);
    return () => setTopCovered(0);
  }, [visible, insets.top]);
  return (
    <View style={styles.root}>
      {visible && <ListenBar snapshot={snapshot} topInset={insets.top} />}
      {/* The bar covers the status bar, so everything under it starts with no top inset. */}
      <SafeAreaInsetsContext.Provider value={visible ? { ...insets, top: 0 } : insets}>
        <View style={styles.root}>{children}</View>
      </SafeAreaInsetsContext.Provider>
    </View>
  );
}

function ListenBar({ snapshot, topInset }: { snapshot: ReturnType<typeof getListenSnapshot>; topInset: number }) {
  const strings = useLocalized(courseStrings);
  const theme = useTheme();
  const { session, state, position, duration } = snapshot;
  if (!session) return null;
  // A coach's answer being read has no lesson behind it: the bar just shows it and stops it.
  const reply = session.kind === 'reply';
  // The phone's voice goes sentence by sentence (it has no lesson clock), so (unlike an answer) it can be paused and shows the sentence it is on.
  const phone = snapshot.mode === 'phone' && !reply && session.segments.length > 0;
  const loading = state === 'loading';
  const speaking = state === 'speaking';
  const playing = state === 'playing' || (phone && speaking);
  const sentence = snapshot.activeSegment;
  // A coach's answer is read in pieces, so a clock or bar for the piece playing would mislead: it shows its words instead.
  const progress = reply ? 0 : phone ? (sentence !== null ? Math.min(1, sentence / session.segments.length) : 0) : duration > 0 ? Math.min(1, position / duration) : 0;
  const section = phone ? sectionTitleOf(session.segments, sentence, session.lessonTitle) : (sectionAt(session.outline, progress)?.title ?? session.lessonTitle);
  const detail = loading
    ? strings.listenPreparing
    : phone && sentence !== null
      ? strings.listenSentenceProgress(sentence + 1, session.segments.length)
      : speaking || reply
        ? session.courseTitle
        : `${formatClock(position)} · -${formatClock(Math.max(0, duration - position))}`;
  const press = (action: () => void) => () => {
    tapFeedback();
    action();
  };
  return (
    <View style={[styles.bar, { backgroundColor: theme.primarySoft, paddingTop: topInset }]}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={reply ? session.lessonTitle : strings.listenOpenLesson(session.lessonTitle)}
          disabled={reply}
          onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: session.lessonId } })}
          style={styles.open}>
          <Tali size={32} tight mood={playing || speaking ? 'learning' : 'happy'} />
          <View style={styles.text}>
            <ThemedText type="secondarySemiBold" numberOfLines={1}>
              {section}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" tabular numberOfLines={1}>
              {detail}
            </ThemedText>
          </View>
        </Pressable>
        <VoiceWave active={playing || speaking} />
        {(!speaking || phone) && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={playing ? strings.listenPause : strings.listenPlay}
            disabled={loading}
            onPress={press(togglePlayPause)}
            hitSlop={4}
            style={[styles.play, { backgroundColor: theme.primary }, loading && styles.dim]}>
            <Icon name={playing ? 'pause' : 'play_arrow'} size={22} color="onPrimary" filled />
          </Pressable>
        )}
        <Pressable accessibilityRole="button" accessibilityLabel={strings.stopListening} onPress={press(stopListening)} hitSlop={6} style={styles.close}>
          <Icon name="close" size={20} color="textSecondary" />
        </Pressable>
      </View>
      <View style={[styles.track, { backgroundColor: theme.border }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={[styles.fill, { backgroundColor: theme.primary, width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  bar: {
    zIndex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.two,
    minHeight: MinTouchSize + 8,
  },
  open: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: MinTouchSize,
  },
  text: {
    flex: 1,
    gap: 1,
  },
  play: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: {
    width: MinTouchSize,
    height: MinTouchSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    height: 2,
  },
  fill: {
    height: 2,
  },
  dim: {
    opacity: 0.4,
  },
});
