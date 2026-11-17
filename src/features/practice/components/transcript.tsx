import { StyleSheet, View } from 'react-native';

import { AnswerBubble } from '@/components/answer-bubble';
import { Spacing } from '@/constants/theme';

import type { PracticeMessageRow } from '../api/practice-repo';
import { PartnerBubble, type PartnerBubbleProps } from './partner-bubble';

export type TranscriptProps = {
  messages: readonly Pick<PracticeMessageRow, 'id' | 'role' | 'text'>[];
  partnerName: string;
  /** For a speaking scenario: builds the "Hear the reply" button of one partner line. */
  speechFor?: (message: { id: string; text: string }) => PartnerBubbleProps['speech'];
};

/** The conversation as it was said: the partner on the left, the learner on the right. Read-only; also used for past tries in the history. */
export function Transcript({ messages, partnerName, speechFor }: TranscriptProps) {
  return (
    <View style={styles.list}>
      {messages.map((message) => (message.role === 'assistant' ? <PartnerBubble key={message.id} name={partnerName} text={message.text} speech={speechFor?.(message)} /> : <AnswerBubble key={message.id} text={message.text} />))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.three },
});
