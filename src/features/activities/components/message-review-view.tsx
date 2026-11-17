import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { OfflineNotice } from '@/components/offline-notice';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { TextField } from '@/components/ui/text-field';
import { TypingDots } from '@/components/ui/typing-dots';
import { Spacing } from '@/constants/theme';
import { HistoryList } from '@/features/practice/components/history-list';
import { PastSession } from '@/features/practice/components/past-session';
import { ReviewView } from '@/features/practice/components/review-view';
import { useMessageReview } from '@/features/practice/hooks/use-message-review';
import { publicTask } from '@/features/practice/lib/public';
import { MAX_REVIEW_CHARS, wordCount } from '@/features/practice/lib/sanitize';
import type { ReviewResult } from '@/features/practice/lib/review';
import { practiceStrings } from '@/features/practice/strings';
import type { MessageTask } from '@/features/practice/types';
import { useTwoUp } from '@/hooks/use-two-up';
import { useIsOnline } from '@/hooks/use-is-online';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import type { ActivitySession } from '../hooks/use-activity-session';
import { useActivityDraft } from '../lib/draft';
import type { MessageReviewActivity } from '../types';
import { ActivityFrame } from './activity-frame';
import { confirm, PracticeLoadFailed, PracticeProblemNotice, PracticeSkeleton } from './practice-states';

export type MessageReviewViewProps = {
  activity: MessageReviewActivity;
  task: MessageTask;
  session: ActivitySession;
  courseId?: string;
  lessonId?: string;
};

/**
 * A message task inside a lesson: the situation and brief, a box with a live word count, the coach's review with the learner's own message
 * beside a suggested version, and a way to revise and ask again. The suggestion is a model, never the learner's work; completing needs a real
 * review, not a good score.
 */
export function MessageReviewView({ activity, task, session, courseId, lessonId }: MessageReviewViewProps) {
  const text = useLocalized(practiceStrings);
  const online = useIsOnline();
  const wide = useTwoUp();
  const flow = useMessageReview({ task, courseId, lessonId, onComplete: session.complete });
  const pub = publicTask(task);
  // Kept while the app is open: leaving the lesson and coming back, or a failed request, never empties the box.
  const [draft, setDraft] = useActivityDraft(activity.id, 'text', '');
  const [previous, setPrevious] = useState<string | undefined>(undefined);
  const [openId, setOpenId] = useState<string | null>(null);

  if (flow.loading) return <ActivityFrame session={session}><PracticeSkeleton /></ActivityFrame>;
  if (flow.failed) return <ActivityFrame session={session}><PracticeLoadFailed text={text} onRetry={flow.refetch} /></ActivityFrame>;

  const review = flow.shown?.result?.kind === 'message-review' ? (flow.shown.result as ReviewResult) : null;
  const words = wordCount(draft);
  const channel = text.ui.channels[task.channel] ?? task.channel;
  const showing = flow.shown !== null && review !== null;

  const submit = () => {
    tapFeedback();
    void flow.submit(draft, previous);
  };
  const revise = () => {
    tapFeedback();
    const original = flow.shown?.session.final_text ?? draft;
    setDraft(original);
    setPrevious(original);
    flow.show(null);
  };
  const another = () => {
    tapFeedback();
    setDraft('');
    setPrevious(undefined);
    flow.show(null);
  };

  const situation = (
    <Card style={styles.stack}>
      <ThemedText type="caption" themeColor="primaryText" style={styles.eyebrow}>
        {text.ui.situation}
      </ThemedText>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {pub.title}
      </ThemedText>
      <ThemedText type="body">{pub.situation}</ThemedText>
      <View style={styles.block}>
        <ThemedText type="secondarySemiBold" themeColor="textSecondary">
          {text.ui.yourTask}
        </ThemedText>
        <ThemedText type="body">{pub.brief}</ThemedText>
      </View>
      {pub.received ? (
        <Card tone="backgroundSelected" style={styles.stack} accessibilityLabel={`${text.ui.receivedMessage(channel)}: ${pub.received}`}>
          <ThemedText type="secondarySemiBold" themeColor="textSecondary">
            {text.ui.receivedMessage(channel)}
          </ThemedText>
          <ThemedText type="body" selectable>
            {pub.received}
          </ThemedText>
        </Card>
      ) : null}
    </Card>
  );

  const history = (
    <>
      <HistoryList
        items={flow.history}
        text={text}
        openId={openId}
        onOpen={setOpenId}
        onRemove={(id) => confirm(text.ui.historyDeleteTitle, text.ui.historyDeleteBody, text.ui.historyRemove, text.ui.keepGoing, () => void flow.remove(id).then(() => setOpenId((current) => (current === id ? null : current))))}
      />
      {openId && <PastSession key={openId} sessionId={openId} text={text} wide={wide} />}
    </>
  );

  // ── The review is on show.
  if (showing && flow.shown) {
    return (
      <ActivityFrame session={session}>
        {situation}
        <ReviewView review={review} original={flow.shown.session.final_text ?? ''} text={text} wide={wide} />
        <View style={styles.stack}>
          <Button title={text.ui.reviseAgain} icon="edit_note" onPress={revise} />
          <ThemedText type="caption" themeColor="textSecondary">
            {text.ui.reviseHint}
          </ThemedText>
          <Button title={text.ui.startAgain} variant="secondary" size="small" onPress={another} style={styles.left} />
        </View>
        {history}
      </ActivityFrame>
    );
  }

  // ── Writing.
  const reviewing = flow.pending;
  const ready = draft.trim().length > 0 && online && !reviewing;
  return (
    <ActivityFrame session={session}>
      {situation}
      <View style={styles.stack}>
        <TextField
          label={text.ui.writeLabel}
          value={draft}
          onChangeText={(value) => {
            setDraft(value);
            if (flow.problem) flow.clearProblem();
          }}
          placeholder={text.ui.writePlaceholder}
          multiline
          maxLength={MAX_REVIEW_CHARS}
          editable={!reviewing}
          autoCapitalize="sentences"
        />
        <ThemedText type="caption" themeColor="textSecondary" tabular accessibilityLiveRegion="polite" accessibilityLabel={text.ui.wordCounter(words, pub.targetWords.min, pub.targetWords.max)}>
          {text.ui.wordCounter(words, pub.targetWords.min, pub.targetWords.max)}
        </ThemedText>
        {previous && <Notice tone="info" message={text.ui.previousVersionNote} />}
        {reviewing && (
          <Card style={styles.stack}>
            <TypingDots label={text.ui.reviewing} />
            <ThemedText type="cardTitle">{text.ui.reviewing}</ThemedText>
            <ThemedText type="secondary" themeColor="textSecondary">
              {text.ui.reviewingBody}
            </ThemedText>
          </Card>
        )}
        {flow.problem && !reviewing && <PracticeProblemNotice problem={flow.problem} text={text} onRetry={submit} disabled={!ready} />}
        {!online && <OfflineNotice feature={text.ui.offlineFeature} meanwhile={text.ui.offlineMeanwhile} />}
        <Button title={previous ? text.ui.secondReview : text.ui.getFeedback} icon="rate_review" loading={reviewing} disabled={!ready} onPress={submit} />
      </View>
      {history}
    </ActivityFrame>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  block: { gap: Spacing.one },
  eyebrow: { textTransform: 'uppercase', letterSpacing: 0.6 },
  left: { alignSelf: 'flex-start' },
});
