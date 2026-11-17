import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { Spacing } from '@/constants/theme';

import { findLab } from '../catalog';
import { usePracticeSession } from '../hooks/use-practice';
import type { LabReview } from '../lib/lab-review';
import type { PracticeReport } from '../lib/report';
import type { ReviewResult } from '../lib/review';
import type { PracticeText } from '../strings';
import { DebriefView } from './debrief-view';
import { ReviewView } from './review-view';
import { LabReviewView } from './lab-review-view';
import { LabTranscript } from './lab-transcript';
import { Transcript } from './transcript';
import type { PartnerBubbleProps } from './partner-bubble';

export type PastSessionProps = {
  sessionId: string;
  text: PracticeText;
  /** The partner's name, for a role-play. */
  partnerName?: string;
  speaking?: boolean;
  wide?: boolean;
  speechFor?: (message: { id: string; text: string }) => PartnerBubbleProps['speech'];
};

/** One saved try, read again: the conversation and its feedback (a role-play), the learner's message and the coach's review (a message task), or the runs and the review of a prompt lab. */
export function PastSession({ sessionId, text, partnerName = '', speaking = false, wide = false, speechFor }: PastSessionProps) {
  const detail = usePracticeSession(sessionId);
  if (detail.isPending) return <SkeletonBlock height={120} />;
  if (detail.isError || !detail.data) return <Notice tone="warning" message={text.ui.historyLoadFailed} />;
  const { session, messages, result } = detail.data;
  if (session.kind === 'prompt-lab') {
    const lab = findLab(session.item_id);
    const labReview = result?.kind === 'prompt-lab' ? (result as LabReview) : null;
    if (!lab) return <Notice tone="warning" message={text.ui.unknownItem} />;
    return (
      <View style={styles.stack}>
        <LabTranscript lab={lab} messages={messages} text={text} />
        {labReview ? <LabReviewView review={labReview} text={text} comparing={lab.compare !== undefined} /> : null}
      </View>
    );
  }
  if (session.kind === 'message-review') {
    const review = result?.kind === 'message-review' ? (result as ReviewResult) : null;
    return review ? (
      <ReviewView review={review} original={session.final_text ?? ''} text={text} wide={wide} />
    ) : (
      <Card style={styles.card}>
        <ThemedText type="cardTitle">{text.ui.yourMessage}</ThemedText>
        <ThemedText type="body" selectable>
          {session.final_text ?? ''}
        </ThemedText>
      </Card>
    );
  }
  const report = result?.kind === 'roleplay' ? (result as PracticeReport) : null;
  return (
    <View style={styles.stack}>
      <Transcript messages={messages} partnerName={partnerName} speechFor={speechFor} />
      {report ? <DebriefView report={report} text={text} speaking={speaking} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  card: { gap: Spacing.two },
});
