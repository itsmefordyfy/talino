import { router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { OfflineNotice } from '@/components/offline-notice';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen, type ScreenHandle } from '@/components/ui/screen';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { ErrorState, NotFoundState } from '@/components/ui/state-view';
import { Spacing } from '@/constants/theme';
import { Composer } from '@/features/coach';
import { COMPANIONS } from '@/features/companion/lib/companions';
import { useIsOnline } from '@/hooks/use-is-online';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import { AnswerBubble, InterviewerBubble, InterviewerThinking } from '../components/message-bubbles';
import { useInterviewSession } from '../hooks/use-interview';
import { interviewProgress } from '../lib/options';
import { answersGiven, MAX_ANSWERS } from '../lib/turn';
import { interviewStrings } from '../strings';

/**
 * The interview itself: a conversation with the interviewer, one question at a time. Every message is saved as it happens, so
 * leaving (or the app closing) never loses it, and an unanswered answer can be sent again. Pause keeps your place; End asks for
 * the evaluation of what you have answered so far.
 */
export function InterviewChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const strings = useLocalized(interviewStrings);
  const online = useIsOnline();
  const session = useInterviewSession(id);
  const screen = useRef<ScreenHandle>(null);

  if (session.failed) {
    return (
      <Screen>
        <ErrorState onRetry={() => void session.refetch()} />
      </Screen>
    );
  }
  if (session.loading) {
    return (
      <Screen>
        <View style={styles.stack}>
          <SkeletonBlock height={64} />
          <SkeletonBlock height={110} />
        </View>
      </Screen>
    );
  }
  const detail = session.detail;
  if (!detail) return <NotFoundState icon="forum" title={strings.notFoundTitle} message={strings.notFoundBody} />;

  const companion = detail.setup.companion;
  const name = COMPANIONS[companion].name;
  const answers = answersGiven(detail.messages);
  const finished = detail.interview.status === 'finished' || detail.closed;
  const paused = detail.interview.status === 'paused';
  const full = answers >= MAX_ANSWERS;
  // The last thing said was the learner's own: the interviewer never replied (an error, or the app closed mid-request).
  const stuck = session.awaitingInterviewer && !session.pending && !finished;
  const progress = interviewProgress(detail.asked, detail.planned, finished);
  const progressLabel = finished ? strings.interviewOver : detail.asked >= detail.planned ? strings.wrappingUp : strings.questionOf(detail.asked, detail.planned);

  const toReport = () => router.replace({ pathname: '/interview/report/[id]', params: { id } });
  const pause = async () => {
    tapFeedback();
    await session.pause();
    router.back();
  };
  const end = () =>
    Alert.alert(strings.endConfirmTitle, strings.endConfirmBody, [
      { text: strings.keepGoing, style: 'cancel' },
      {
        text: strings.endConfirm,
        onPress: async () => {
          await session.finish();
          toReport();
        },
      },
    ]);

  const composing = !finished && !paused;
  const footer = composing ? (
    <View style={styles.footer}>
      {!online && <OfflineNotice feature={strings.title} meanwhile={strings.offline} />}
      <Composer placeholder={strings.placeholder} sendLabel={strings.send} disabled={!online || session.pending || stuck || full} onSend={(text) => void session.send(text)} />
    </View>
  ) : undefined;

  return (
    <Screen ref={screen} footer={footer} onContentSizeChange={(_width, height) => screen.current?.scrollTo(height, true)}>
      <View style={styles.header}>
        <Tali size={48} mood="explaining" companion={companion} />
        <View style={styles.title}>
          <ThemedText type="cardTitle" numberOfLines={1}>
            {detail.interview.title}
          </ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary" numberOfLines={1}>
            {name} · {strings.types[detail.setup.type].label}
          </ThemedText>
        </View>
      </View>

      {/* Their own row, each button a full target with a gap between them: beside the title on a phone they ran together ("PauseEnd interview"). */}
      {composing && (
        <View style={styles.actions}>
          <Button title={strings.pause} icon="pause" variant="secondary" size="small" onPress={() => void pause()} style={styles.action} />
          <Button title={strings.endInterview} icon="stop_circle" variant="outline" size="small" onPress={end} style={styles.action} />
        </View>
      )}

      <View style={styles.progress}>
        <ProgressBar fraction={progress} done={finished} accessibilityLabel={progressLabel} />
        <ThemedText type="caption" themeColor="textSecondary">
          {progressLabel}
        </ThemedText>
      </View>

      {detail.messages.map((message) => (message.role === 'assistant' ? <InterviewerBubble key={message.id} companion={companion} text={message.text} mood={message.kind === 'closing' ? 'proud' : message.kind === 'follow_up' ? 'curious' : 'explaining'} /> : <AnswerBubble key={message.id} text={message.text} />))}
      {session.pending && <InterviewerThinking companion={companion} label={strings.thinking(name)} />}

      {(session.error || stuck) && (
        <View style={styles.error}>
          <Notice tone={session.error?.code === 'network' ? 'info' : 'warning'} message={strings.chatErrors[session.error?.code ?? 'unknown'] ?? strings.chatErrors.unknown} />
          {session.error?.code !== 'conversation_full' && <Button title={strings.retry} variant="secondary" size="small" onPress={() => void session.retry()} disabled={!online || session.pending} />}
          {session.error?.code === 'conversation_full' && <Button title={strings.endInterview} variant="secondary" size="small" onPress={end} />}
        </View>
      )}

      {full && composing && <Notice tone="info" message={strings.tooManyAnswers} />}

      {paused && (
        <Card style={styles.card}>
          <ThemedText type="cardTitle">{strings.paused_title}</ThemedText>
          <ThemedText type="body" themeColor="textSecondary">
            {strings.pausedBody}
          </ThemedText>
          <Button title={strings.resume} icon="play_arrow" onPress={() => void session.resume()} />
        </Card>
      )}

      {finished && (
        <Card style={styles.card}>
          <ThemedText type="cardTitle">{strings.interviewOver}</ThemedText>
          <Button title={strings.seeEvaluation} icon="insights" onPress={toReport} />
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  action: {
    flex: 1,
  },
  progress: {
    gap: Spacing.one,
  },
  footer: {
    gap: Spacing.one,
  },
  error: {
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  card: {
    gap: Spacing.three,
  },
});
