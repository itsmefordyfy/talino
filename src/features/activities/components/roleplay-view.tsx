import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type HostInstance } from 'react-native';

import { OfflineNotice } from '@/components/offline-notice';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useScreenReveal } from '@/components/ui/screen';
import { TypingDots } from '@/components/ui/typing-dots';
import { Spacing } from '@/constants/theme';
import { Composer } from '@/features/coach/components/composer';
import { DebriefView } from '@/features/practice/components/debrief-view';
import { HistoryList } from '@/features/practice/components/history-list';
import { PartnerThinking, type PartnerBubbleProps } from '@/features/practice/components/partner-bubble';
import { PastSession } from '@/features/practice/components/past-session';
import { ScenarioCard } from '@/features/practice/components/scenario-card';
import { Transcript } from '@/features/practice/components/transcript';
import { useReadAloud } from '@/features/practice/hooks/use-read-aloud';
import { useRoleplay } from '@/features/practice/hooks/use-roleplay';
import { canEnd, learnerTurns } from '@/features/practice/lib/session';
import { publicScenario } from '@/features/practice/lib/public';
import { MAX_LEARNER_CHARS } from '@/features/practice/lib/sanitize';
import type { PracticeReport } from '@/features/practice/lib/report';
import { practiceStrings } from '@/features/practice/strings';
import type { RoleplayScenario } from '@/features/practice/types';
import { useIsOnline } from '@/hooks/use-is-online';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import type { ActivitySession } from '../hooks/use-activity-session';
import type { RoleplayActivity } from '../types';
import { ActivityFrame } from './activity-frame';
import { confirm, PracticeLoadFailed, PracticeProblemNotice, PracticeSkeleton } from './practice-states';

export type RoleplayViewProps = {
  activity: RoleplayActivity;
  scenario: RoleplayScenario;
  session: ActivitySession;
  courseId?: string;
  lessonId?: string;
};

/**
 * A role-play inside a lesson: the scenario, a conversation with the simulated person, then the debrief. Free text in, a calm retry when the
 * server can't answer (the words are already saved), resumable, and completed (XP, journey) only when the debrief could judge the turns.
 */
export function RoleplayView({ activity, scenario, session, courseId, lessonId }: RoleplayViewProps) {
  const text = useLocalized(practiceStrings);
  const online = useIsOnline();
  const speech = useReadAloud();
  const reveal = useScreenReveal();
  const tail = useRef<HostInstance>(null);
  const flow = useRoleplay({ scenario, courseId, lessonId, onComplete: session.complete });
  const pub = publicScenario(scenario);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  // Bring the newest line into view as the conversation grows (not on the first paint, so opening the lesson does not jump).
  const lines = flow.messages.length;
  const seen = useRef(lines);
  useEffect(() => {
    if (lines !== seen.current) reveal?.(tail.current);
    seen.current = lines;
  }, [lines, flow.sending, reveal]);

  const speechFor = scenario.speaking
    ? (message: { id: string; text: string }): PartnerBubbleProps['speech'] => ({
        speaking: speech.speakingId === message.id,
        onPress: () => (speech.speakingId === message.id ? speech.stop() : speech.speak(message.id, message.text)),
        hearLabel: text.ui.hearReply,
        stopLabel: text.ui.stopReply,
      })
    : undefined;

  if (flow.loading) return <ActivityFrame session={session}><PracticeSkeleton /></ActivityFrame>;
  if (flow.failed) return <ActivityFrame session={session}><PracticeLoadFailed text={text} onRetry={flow.refetch} /></ActivityFrame>;

  const detail = flow.detail;
  const talking = detail !== null && detail.session.status === 'active';
  const finished = detail !== null && detail.session.status === 'finished';
  const report = finished && detail.result?.kind === 'roleplay' ? (detail.result as PracticeReport) : null;
  const name = scenario.partner.name;
  const speakingNote = scenario.speaking ? (
    <View style={styles.stack}>
      <Notice tone="info" message={text.speakingNote} />
      <ThemedText type="secondary" themeColor="textSecondary">
        {text.ui.speakingHint}
      </ThemedText>
    </View>
  ) : null;

  const history = (
    <>
      <HistoryList
        items={flow.history}
        text={text}
        openId={openId}
        onOpen={setOpenId}
        onRemove={(id) => confirm(text.ui.historyDeleteTitle, text.ui.historyDeleteBody, text.ui.historyRemove, text.ui.keepGoing, () => void flow.remove(id).then(() => setOpenId((current) => (current === id ? null : current))))}
      />
      {openId && <PastSession key={openId} sessionId={openId} text={text} partnerName={name} speaking={scenario.speaking} speechFor={speechFor} />}
    </>
  );

  // ── Not started: the scenario, how it works, Start, and the earlier tries.
  if (!talking && !finished) {
    return (
      <ActivityFrame session={session}>
        <ScenarioCard scenario={pub} text={text.ui} />
        {speakingNote}
        {flow.problem && <PracticeProblemNotice problem={flow.problem} text={text} />}
        {flow.scores.attempts > 0 && (
          <ThemedText type="secondary" themeColor="textSecondary">
            {[text.ui.triesCount(flow.scores.attempts), flow.scores.best !== null ? text.ui.bestScore(flow.scores.best) : null].filter(Boolean).join(' · ')}
          </ThemedText>
        )}
        <Button title={flow.starting ? text.ui.startingRoleplay : text.ui.startRoleplay} icon="forum" loading={flow.starting} onPress={() => { tapFeedback(); void flow.start(); }} />
        {history}
      </ActivityFrame>
    );
  }

  // ── Finished: the debrief, Try again, the conversation and the history.
  if (finished) {
    return (
      <ActivityFrame session={session}>
        <ScenarioCard scenario={pub} text={text.ui} compact />
        {report ? (
          <DebriefView report={report} text={text} speaking={scenario.speaking} />
        ) : (
          <Card style={styles.stack}>
            <Notice tone="warning" message={text.ui.historyLoadFailed} />
            <Button title={text.ui.gettingFeedback} variant="secondary" onPress={() => void flow.end()} loading={flow.finishing} />
          </Card>
        )}
        {flow.problem && <PracticeProblemNotice problem={flow.problem} text={text} onRetry={flow.retry} />}
        <View style={styles.stack}>
          <Button title={text.ui.tryAgain} icon="replay" onPress={() => { tapFeedback(); setOpenId(null); void flow.start(); }} loading={flow.starting} />
          <ThemedText type="caption" themeColor="textSecondary">
            {text.ui.tryAgainHint}
          </ThemedText>
        </View>
        <Button title={showTranscript ? text.ui.hideTranscript : text.ui.viewTranscript} icon={showTranscript ? 'expand_less' : 'forum'} size="small" variant="ghost" onPress={() => setShowTranscript((value) => !value)} style={styles.left} />
        {showTranscript && <Transcript messages={detail.messages} partnerName={name} speechFor={speechFor} />}
        {history}
      </ActivityFrame>
    );
  }

  // ── Talking.
  const turns = learnerTurns(flow.messages);
  const over = flow.phase === 'must-end';
  const endable = canEnd(scenario, flow.messages);
  const busy = flow.sending || flow.finishing;
  const askEnd = () => confirm(text.ui.endConfirmTitle, text.ui.endConfirmBody, text.ui.endConfirm, text.ui.keepGoing, () => void flow.end());
  const turnLabel = over ? text.ui.conversationOver : text.ui.turnOf(Math.min(turns + 1, scenario.maxTurns), scenario.maxTurns);
  const waiting = flow.problem?.code === 'practice_limit';

  return (
    <ActivityFrame session={session}>
      <ScenarioCard scenario={pub} text={text.ui} compact />
      <View style={styles.progress} accessible accessibilityLabel={turnLabel}>
        <View style={styles.progressHead}>
          <ThemedText type="secondarySemiBold" tabular>
            {turnLabel}
          </ThemedText>
          <Button title={text.ui.startOver} icon="restart_alt" size="small" variant="ghost" disabled={busy} onPress={() => confirm(text.ui.startOverConfirmTitle, text.ui.startOverConfirmBody, text.ui.startOver, text.ui.keepGoing, () => void flow.startOver())} />
        </View>
        <ProgressBar fraction={Math.min(1, turns / scenario.maxTurns)} accessibilityLabel={turnLabel} done={over} />
      </View>

      <Transcript messages={flow.detail?.messages ?? []} partnerName={name} speechFor={speechFor} />
      {flow.sending && <PartnerThinking name={name} label={text.ui.partnerThinking(name)} />}
      <View ref={tail} collapsable={false} />

      {flow.partnerEnded && <Notice tone="info" message={text.ui.partnerEnded(name)} />}
      {flow.finishing && (
        <Card style={styles.stack}>
          <TypingDots label={text.ui.writingFeedback} />
          <ThemedText type="cardTitle">{text.ui.writingFeedback}</ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary">
            {text.ui.writingFeedbackBody}
          </ThemedText>
        </Card>
      )}
      {flow.problem && !flow.finishing && <PracticeProblemNotice problem={flow.problem} text={text} onRetry={flow.retry} disabled={busy || !online} />}
      {flow.stuck && !flow.problem && !flow.sending && <PracticeProblemNotice problem={{ code: 'unknown', resetsAt: null }} text={text} onRetry={flow.retry} disabled={busy || !online} />}
      {!online && <OfflineNotice feature={text.ui.offlineFeature} meanwhile={text.ui.offlineMeanwhile} />}

      {over ? (
        !flow.finishing && !flow.problem && <Button title={text.ui.gettingFeedback} icon="insights" onPress={() => void flow.end()} />
      ) : (
        <View style={styles.stack}>
          <Composer placeholder={text.ui.composerPlaceholder} sendLabel={text.ui.composerSend} maxLength={MAX_LEARNER_CHARS} disabled={!online || busy || flow.stuck || waiting} onSend={(value) => void flow.send(value)} />
          {speakingNote}
          {endable ? (
            <Button title={text.ui.endAndFeedback} icon="stop_circle" variant="outline" disabled={busy || !online} onPress={askEnd} />
          ) : (
            <ThemedText type="caption" themeColor="textSecondary" accessibilityLiveRegion="polite">
              {text.ui.turnsToFeedback(Math.max(0, scenario.minTurns - turns))}
            </ThemedText>
          )}
        </View>
      )}
    </ActivityFrame>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  progress: { gap: Spacing.one },
  progressHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { alignSelf: 'flex-start' },
});
