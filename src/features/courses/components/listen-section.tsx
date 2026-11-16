import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import type { UseLessonListen } from '../audio/use-lesson-listen';
import type { Lesson } from '../content/types';
import type { OutlineSection } from '../lib/plain-text';
import type { SpeechSegment } from '../lib/speech-segments';
import { courseStrings } from '../strings';
import { ListenPlayer } from './listen-player';

export type ListenSectionProps = {
  lesson: Lesson;
  courseTitle: string;
  listen: UseLessonListen;
  outline: readonly OutlineSection[];
  /** The lesson's sentences, in the order they are said. */
  segments: readonly SpeechSegment[];
  rate: number;
  onRate: (rate: number) => void;
};

/**
 * At the very top of a lesson, above its title: the player, always (owner, 2026-11-15: "instead of the Listen button show a player by default, for all lessons"):
 * ready to play before anything has started, and the same one for the recorded voices, the live voice and the phone's own once it is going.
 * Beside it, Ask Tali and, for a lesson listened to before, From the start (Play carries on from where the learner stopped).
 */
export function ListenSection({ lesson, courseTitle, listen, outline, segments, rate, onRate }: ListenSectionProps) {
  const strings = useLocalized(courseStrings);
  return (
    <View style={styles.stack}>
      <ListenPlayer listen={listen} outline={outline} segments={segments} rate={rate} onRate={onRate} />
      {listen.phoneVoice && listen.fallback && (
        <ThemedText type="caption" themeColor="textSecondary">
          {listen.fallback === 'offline' ? strings.phoneVoiceOffline : strings.phoneVoiceMissing}
        </ThemedText>
      )}
      <View style={styles.actions}>
        <Button
          title={strings.askTali}
          icon="forum"
          size="small"
          variant="ghost"
          // `focus` is the coach's own link format (features/coach/lib/focus.ts): the server reads this lesson from the catalog.
          onPress={() => router.push({ pathname: '/tali', params: { focus: `lesson:${lesson.id}` } })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.three,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
});
