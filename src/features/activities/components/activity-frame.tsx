import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { TaliSays } from '@/components/tali-says';
import { activityResultLine, hintLine } from '@/features/companion/lib/messages';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { Radius, Spacing } from '@/constants/theme';
import { useLanguage } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import type { ActivitySession } from '../hooks/use-activity-session';
import { clearActivityDraft } from '../lib/draft';
import { RichText } from './rich-text';

export type ActivityFrameProps = {
  session: ActivitySession;
  children: ReactNode;
  /**
   * `frame` (the default): a try's feedback is drawn under the workspace. `inline`: the view draws it where the learner just acted
   * (a matching card), and the frame only adds the closing one when the activity is solved.
   */
  feedback?: 'frame' | 'inline';
  /** Replaces the one-line "how it works" under the prompt (a view that knows more than its kind does). */
  howTo?: string;
};

/**
 * The shell every kind shares: the story line, title and prompt, then the kind's own workspace, then
 * hints and feedback. The newest message (a hint, a wrong answer, the solve) carries the mascot.
 */
export function ActivityFrame({ session, children, feedback = 'frame', howTo }: ActivityFrameProps) {
  const theme = useTheme();
  const language = useLanguage();
  const { activity, text, done } = session;
  const showHints = activity.kind !== 'tap-reveal' && !done && (session.shown.length > 0 || session.next !== null);
  // A solved activity starts clean next time: nothing half-finished is kept for it (every view keeps its picks with `useActivityDraft`).
  useEffect(() => {
    if (done) clearActivityDraft(activity.id);
  }, [done, activity.id]);
  const instruction =
    howTo ?? (activity.kind === 'predict-output' && !activity.choices ? text.howToTyped : activity.kind === 'fix-bug' && activity.typed ? text.howToFixTyped : text.howTo[activity.kind]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        {activity.story && (
          <ThemedText type="secondary" themeColor="textSecondary" style={styles.story}>
            {activity.story}
          </ThemedText>
        )}
        <View style={styles.kindRow}>
          <ThemedText type="caption" themeColor="primary" style={styles.kind}>
            {text.kinds[activity.kind]}
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {activity.conceptLabel ?? activity.concept}
          </ThemedText>
        </View>
        <ThemedText type="cardTitle" accessibilityRole="header">
          {activity.title}
        </ThemedText>
        <RichText type="body" text={activity.prompt} />
        {!done && (
          // What to do and how many answers are allowed, in one place for every kind.
          <View style={[styles.howTo, { backgroundColor: theme.primarySoft }]} accessible accessibilityLabel={`${text.howToLabel}: ${instruction}`}>
            <Icon name="touch_app" size={18} color="primary" />
            <ThemedText type="secondary" style={styles.howToText}>
              {instruction}
            </ThemedText>
          </View>
        )}
      </View>

      {session.solvedBefore && !done && <Notice tone="info" message={text.solvedBefore} />}

      {children}

      {showHints && (
        <View style={styles.hints} accessibilityLiveRegion="polite">
          {session.shown.length > 0 && (
            <TaliSays key={session.shown.length} size="small" live {...hintLine({ number: session.shown.length, total: session.hintTotal, language })}>
              <View style={styles.hintStack}>
                {session.shown.map((hint, index) => (
                  <View key={index} style={[styles.hint, { backgroundColor: theme.primarySoft }]}>
                    <ThemedText type="secondarySemiBold" themeColor="primary">
                      {text.hintCount(index + 1, session.hintTotal)}
                    </ThemedText>
                    <RichText type="secondary" text={hint} />
                  </View>
                ))}
              </View>
            </TaliSays>
          )}
          {session.offerHint && (
            <ThemedText type="secondary" themeColor="textSecondary">
              {text.hintOffer}
            </ThemedText>
          )}
          {session.next && (
            <Button
              title={text.hintNext(session.hintsUsed, session.hintTotal)}
              icon="lightbulb"
              size="small"
              variant={session.offerHint ? 'primary' : 'outline'}
              material="solid"
              onPress={session.revealHint}
              style={styles.hintButton}
            />
          )}
        </View>
      )}

      {session.result && (feedback === 'frame' || done) && <ActivityFeedback session={session} />}

      {done && (
        <View style={[styles.explanation, { backgroundColor: theme.statusOkSoft }]}>
          <View style={styles.completeRow}>
            <Icon name="check_circle" size={22} color="statusOk" filled />
            <ThemedText type="cardTitle" style={{ color: theme.statusOk }} accessibilityRole="header">
              {text.activityComplete}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" style={styles.completeTries}>
              {text.attempts(session.attempts)}
            </ThemedText>
          </View>
          <ThemedText type="secondarySemiBold" style={{ color: theme.statusOk }}>
            {text.whyItWorks}
          </ThemedText>
          <RichText type="body" text={activity.explanation} />
        </View>
      )}
    </View>
  );
}

export type ActivityFeedbackProps = { session: ActivitySession; /** Replaces the result's own sentence (a wrong try on one card, with its own words). */ message?: string };

/** The last try's feedback with the coach beside it: what happened and what to think about, never just a tick or a cross. */
export function ActivityFeedback({ session, message }: ActivityFeedbackProps) {
  const language = useLanguage();
  const { activity, result } = session;
  if (!result) return null;
  return (
    <View accessibilityLiveRegion="polite">
      <TaliSays key={`${session.attempts}-${result.correct}`} size="small" live {...activityResultLine({ activityId: activity.id, solved: result.correct, wrongTries: session.wrong, hintsUsed: session.hintsUsed, language })}>
        <Notice tone={result.correct ? 'success' : result.progress ? 'info' : 'warning'}>
          <ThemedText type="secondary">{message ?? result.feedback}</ThemedText>
        </Notice>
      </TaliSays>
    </View>
  );
}

export type CheckBarProps = {
  session: ActivitySession;
  onCheck: () => void;
  /** Check stays disabled until the learner has something to check. */
  canCheck: boolean;
  label?: string;
  /** Called when "Try again" is pressed, after the feedback is cleared: reset whatever the view should reset. */
  onRetry?: () => void;
};

/** The primary button under a workspace: Check, then Try again after a wrong answer, nothing once solved. */
export function CheckBar({ session, onCheck, canCheck, label, onRetry }: CheckBarProps) {
  const { text, result, done, checking } = session;
  if (done) return null;
  if (result && !result.correct && !result.progress && onRetry) {
    return (
      <Button
        title={text.tryAgain}
        icon="replay"
        variant="secondary"
        onPress={() => {
          session.dismiss();
          onRetry();
        }}
      />
    );
  }
  return <Button title={label ?? text.check} onPress={onCheck} disabled={!canCheck} loading={checking} />;
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three },
  header: { gap: Spacing.two },
  story: { fontStyle: 'italic' },
  kindRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flexWrap: 'wrap' },
  kind: { textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 },
  hints: { gap: Spacing.two },
  hintStack: { gap: Spacing.two },
  hint: { gap: Spacing.one, padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous' },
  hintButton: { alignSelf: 'flex-start' },
  mascotRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two },
  mascotBody: { flex: 1 },
  explanation: { gap: Spacing.two, padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous' },
  completeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  completeTries: { marginLeft: 'auto' },
  howTo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous' },
  howToText: { flex: 1 },
});
