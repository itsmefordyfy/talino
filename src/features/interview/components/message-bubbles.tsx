import { StyleSheet, View } from 'react-native';

import { Tali, type TaliMood } from '@/components/brand/tali';
import { ThemedText } from '@/components/themed-text';
import { TypingDots } from '@/components/ui/typing-dots';
import { Radius, Spacing } from '@/constants/theme';
import type { CompanionId } from '@/features/companion/lib/companions';
import { useTheme } from '@/hooks/use-theme';

export { AnswerBubble, type AnswerBubbleProps } from '@/components/answer-bubble';

export type InterviewerBubbleProps = { companion: CompanionId; text: string; mood?: TaliMood };

/** The interviewer's message on the left, with the face of the coach chosen for this interview (not necessarily the one in Settings). Plain text: an interviewer talks, it doesn't format. */
export function InterviewerBubble({ companion, text, mood = 'explaining' }: InterviewerBubbleProps) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <Tali size={44} mood={mood} companion={companion} />
      <View style={[styles.interviewer, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <ThemedText type="body" selectable>
          {text}
        </ThemedText>
      </View>
    </View>
  );
}

export type InterviewerThinkingProps = { companion: CompanionId; label: string };

/** While the interviewer is answering: the face and three moving dots in the shape the reply will take. */
export function InterviewerThinking({ companion, label }: InterviewerThinkingProps) {
  const theme = useTheme();
  return (
    <View style={[styles.row, styles.centered]}>
      <Tali size={44} mood="thinking" companion={companion} />
      <View style={[styles.thinking, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <TypingDots label={label} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  centered: {
    alignItems: 'center',
  },
  interviewer: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.large,
    borderTopLeftRadius: Radius.small,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  thinking: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.large,
    borderTopLeftRadius: Radius.small,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
