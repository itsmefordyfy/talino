import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { OfflineNotice } from '@/components/offline-notice';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { TextField } from '@/components/ui/text-field';
import { TypingDots } from '@/components/ui/typing-dots';
import { Spacing } from '@/constants/theme';
import { HistoryList } from '@/features/practice/components/history-list';
import { CollapsibleCard, LabChecklist, LabExample, LabTips, LabTools, LabVerify } from '@/features/practice/components/lab-guide-cards';
import { LabOutputCard } from '@/features/practice/components/lab-output-card';
import { PastSession } from '@/features/practice/components/past-session';
import { usePromptLab } from '@/features/practice/hooks/use-prompt-lab';
import { checkLabPrompts, MIN_LAB_PROMPT_WORDS, MIN_REAL_EDIT_WORDS, wordsChanged } from '@/features/practice/lib/lab-input';
import type { LabOutput } from '@/features/practice/lib/lab-run';
import { publicLab } from '@/features/practice/lib/public';
import { MAX_LAB_PROMPT_CHARS, wordCount } from '@/features/practice/lib/sanitize';
import { practiceStrings, type PracticeText } from '@/features/practice/strings';
import type { LabTask } from '@/features/practice/types';
import { useIsOnline } from '@/hooks/use-is-online';
import { useLocalized } from '@/hooks/use-strings';
import { useTwoUp } from '@/hooks/use-two-up';
import { copyText } from '@/lib/clipboard';
import { tapFeedback } from '@/lib/haptics';

import type { ActivitySession } from '../hooks/use-activity-session';
import { useActivityDraft } from '../lib/draft';
import type { PromptLabActivity } from '../types';
import { ActivityFrame } from './activity-frame';
import { confirm, PracticeLoadFailed, PracticeProblemNotice, PracticeSkeleton } from './practice-states';

export type LabViewProps = { activity: PromptLabActivity; lab: LabTask; session: ActivitySession; courseId?: string; lessonId?: string };

type Copied = 'single' | 'A' | 'B' | null;

/** Why Run is not available yet, in words ("Change the starter prompt to run it"), or null when the prompts can be run. */
function hintFor(lab: LabTask, prompts: readonly string[], text: PracticeText): string | null {
  const checked = checkLabPrompts(lab, prompts);
  if (checked.ok) return null;
  if (checked.reason === 'lab_same_prompts') return text.lab.needDifferent;
  const edited = wordsChanged(prompts[checked.index] ?? '', lab.starterPrompt) >= MIN_REAL_EDIT_WORDS;
  return edited ? text.lab.needWords(MIN_LAB_PROMPT_WORDS) : text.lab.needEdit;
}

/**
 * The Prompt Playground, AI Experiment Lab and Model Comparison of the Generative AI course, as one activity: the situation, the material, the
 * checklist a strong prompt meets, an editor that starts from the lab's weak prompt, a live run (always badged as a real model's reply, with the
 * numbers measured on it), tips, an illustration of a strong prompt (badged as one), the things to verify, and a review of the prompt by an AI that
 * is labelled as one. Completing needs a run and a review, not a high score. The lab is the catalog's, by id, and only its public side reaches here.
 */
export function LabView({ activity, lab, session, courseId, lessonId }: LabViewProps) {
  const text = useLocalized(practiceStrings);
  const online = useIsOnline();
  const wide = useTwoUp();
  const pub = publicLab(lab);
  const flow = usePromptLab({ lab, courseId, lessonId, onComplete: session.complete });
  const comparingPrompts = lab.compare === 'prompts';
  // Kept while the app is open: leaving the lesson and coming back, or a failed request, never empties the editor.
  const [first, setFirst] = useActivityDraft(activity.id, comparingPrompts ? 'promptA' : 'prompt', lab.starterPrompt);
  const [second, setSecond] = useActivityDraft(activity.id, 'promptB', lab.starterPrompt);
  const [copied, setCopied] = useState<Copied>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  if (flow.loading) return <ActivityFrame session={session} howTo={text.lab.howTo}><PracticeSkeleton /></ActivityFrame>;
  if (flow.failed) return <ActivityFrame session={session} howTo={text.lab.howTo}><PracticeLoadFailed text={text} onRetry={flow.refetch} /></ActivityFrame>;

  const prompts = comparingPrompts ? [first, second] : [first];
  const hint = hintFor(lab, prompts, text);
  const running = flow.pending === 'run';
  const reviewing = flow.pending === 'review';
  const busy = flow.pending !== null;
  const outOfRuns = flow.runsLeft === 0;
  const canRun = online && !busy && !outOfRuns && hint === null;
  const hasRun = flow.runsDone > 0;
  const experiment = text.lab.experiments[lab.experiment] ?? lab.experiment;
  const json = lab.output.format === 'json';

  const flash = (which: Exclude<Copied, null>) => {
    setCopied(which);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1800);
  };
  const copy = async (value: string, which: Exclude<Copied, null>) => {
    const done = await copyText(value);
    if (done) flash(which);
    else setCopied(null);
  };
  const run = () => {
    tapFeedback();
    void flow.run(prompts);
  };
  const review = () => {
    tapFeedback();
    void flow.review();
  };
  const reset = () => {
    setFirst(lab.starterPrompt);
    setSecond(lab.starterPrompt);
  };
  const another = () => {
    tapFeedback();
    flow.show(null);
  };
  const edit = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    if (flow.problem) flow.clearProblem();
  };

  const situation = (
    <Card style={styles.stack}>
      <View style={styles.badges}>
        <ThemedText type="caption" themeColor="primaryText" style={styles.eyebrow}>
          {text.lab.eyebrow}
        </ThemedText>
        <Badge label={experiment} color="primary" background="primarySoft" />
        <Badge label={text.ui.difficulty[lab.difficulty] ?? lab.difficulty} color="textSecondary" background="backgroundSelected" />
      </View>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {pub.title}
      </ThemedText>
      <ThemedText type="body">{pub.situation}</ThemedText>
      <View style={styles.block}>
        <ThemedText type="secondarySemiBold" themeColor="textSecondary">
          {text.lab.goal}
        </ThemedText>
        <ThemedText type="body">{pub.goal}</ThemedText>
      </View>
    </Card>
  );

  const history = (
    <HistoryList
      items={flow.history}
      text={text}
      openId={openIdOf(flow)}
      onOpen={(id) => flow.show(id)}
      onRemove={(id) => confirm(text.ui.historyDeleteTitle, text.ui.historyDeleteBody, text.ui.historyRemove, text.ui.keepGoing, () => void flow.remove(id).then(() => flow.show(null)))}
    />
  );

  // ── The review is on show: the try's runs, the review, and a way to go again.
  if (flow.shownId && flow.shown?.result?.kind === 'prompt-lab') {
    return (
      <ActivityFrame session={session} howTo={text.lab.howTo}>
        {situation}
        <PastSession key={flow.shownId} sessionId={flow.shownId} text={text} wide={wide} />
        <View style={styles.stack}>
          <Button title={text.lab.nextTry} icon="replay" onPress={another} />
          <ThemedText type="caption" themeColor="textSecondary">
            {text.lab.nextTryHint}
          </ThemedText>
        </View>
        {history}
      </ActivityFrame>
    );
  }

  // The latest run's replies: as it just came back (with its numbers), or read back from the saved messages of an earlier visit.
  const latest = flow.saved[flow.saved.length - 1];
  const replies: { title: string; output: string; live?: LabOutput }[] = flow.live
    ? flow.live.outputs.map((output, index) => ({ title: titleOf(lab, index, text), output: output.output, live: output }))
    : (latest?.outputs ?? []).map((output, index) => ({ title: titleOf(lab, index, text), output }));

  const editors = comparingPrompts ? (
    <View style={[styles.stack, wide && styles.row]}>
      <Editor label={text.lab.promptA} value={first} onChange={edit(setFirst)} disabled={busy} text={text} copied={copied === 'A'} onCopy={() => void copy(first, 'A')} style={wide ? styles.fill : undefined} />
      <Editor label={text.lab.promptB} value={second} onChange={edit(setSecond)} disabled={busy} text={text} copied={copied === 'B'} onCopy={() => void copy(second, 'B')} style={wide ? styles.fill : undefined} />
    </View>
  ) : (
    <Editor label={text.lab.promptLabel} value={first} onChange={edit(setFirst)} disabled={busy} text={text} copied={copied === 'single'} onCopy={() => void copy(first, 'single')} />
  );

  return (
    <ActivityFrame session={session} howTo={text.lab.howTo}>
      {situation}
      {pub.material ? (
        <CollapsibleCard title={text.lab.materialTitle} openLabel={text.lab.showMaterial} closeLabel={text.lab.hideMaterial} defaultOpen>
          <ThemedText type="body" selectable>
            {pub.material}
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {text.lab.materialNote}
          </ThemedText>
        </CollapsibleCard>
      ) : null}
      <LabTools lab={pub} text={text} />
      <LabChecklist lab={pub} text={text} />

      <View style={styles.stack}>
        {editors}
        <Button title={text.lab.resetPrompt} variant="ghost" size="small" disabled={busy} onPress={reset} style={styles.left} />
        {hint && !busy ? <Notice tone="info" message={hint} /> : null}
        {outOfRuns ? <Notice tone="info" message={text.lab.runsUsed(lab.maxRuns)} /> : null}
        {running && (
          <Card style={styles.stack}>
            <TypingDots label={text.lab.running} />
            <ThemedText type="cardTitle">{text.lab.running}</ThemedText>
            <ThemedText type="secondary" themeColor="textSecondary">
              {text.lab.runningBody}
            </ThemedText>
          </Card>
        )}
        {flow.problem && !busy && <PracticeProblemNotice problem={flow.problem} text={text} onRetry={flow.failedStep === 'review' ? review : run} disabled={flow.failedStep === 'review' ? !online : !canRun} />}
        {!online && <OfflineNotice feature={text.lab.offlineFeature} meanwhile={text.ui.offlineMeanwhile} />}
        <Button title={comparingPrompts || lab.compare === 'models' ? text.lab.runCompare : hasRun ? text.lab.runAgain : text.lab.run} icon="play_arrow" loading={running} disabled={!canRun} onPress={run} />
        <ThemedText type="caption" themeColor="textSecondary" tabular accessibilityLiveRegion="polite">
          {text.lab.runCounter(flow.runsDone, lab.maxRuns)}
        </ThemedText>
      </View>

      {replies.length > 0 && (
        <View style={styles.stack}>
          <ThemedText type="section" accessibilityRole="header">
            {text.lab.latestRun}
          </ThemedText>
          <View style={[styles.stack, wide && replies.length > 1 && styles.row]}>
            {replies.map((reply) => (
              <View key={reply.title} style={wide && replies.length > 1 ? styles.fill : undefined}>
                <LabOutputCard title={reply.title} output={reply.output} live={reply.live} text={text} json={json} />
              </View>
            ))}
          </View>
          {lab.compare === 'models' && <Notice tone="info" message={text.lab.modelCompareNote} />}
        </View>
      )}

      {hasRun && <LabTips lab={pub} text={text} />}
      <LabExample lab={pub} text={text} />
      {hasRun && <LabVerify lab={pub} text={text} />}

      {hasRun && (
        <View style={styles.stack}>
          {reviewing && (
            <Card style={styles.stack}>
              <TypingDots label={text.lab.reviewing} />
              <ThemedText type="cardTitle">{text.lab.reviewing}</ThemedText>
              <ThemedText type="secondary" themeColor="textSecondary">
                {text.lab.reviewingBody}
              </ThemedText>
            </Card>
          )}
          <Button title={text.lab.review} icon="rate_review" loading={reviewing} disabled={busy || !online || flow.saved.length === 0} onPress={review} />
          <ThemedText type="caption" themeColor="textSecondary">
            {text.lab.reviewHint}
          </ThemedText>
        </View>
      )}

      {history}
      {flow.shownId && flow.shown && flow.shown.result?.kind !== 'prompt-lab' ? <PastSession key={flow.shownId} sessionId={flow.shownId} text={text} wide={wide} /> : null}
    </ActivityFrame>
  );
}

/** The history list opens one try under it; an open try is the one on show. */
const openIdOf = (flow: { shownId: string | null }) => flow.shownId;

const titleOf = (lab: Pick<LabTask, 'compare'>, index: number, text: PracticeText): string => {
  if (lab.compare === 'models') return index === 0 ? text.lab.modelA : text.lab.modelB;
  if (lab.compare === 'prompts') return index === 0 ? text.lab.outputA : text.lab.outputB;
  return text.lab.outputTitle;
};

type EditorProps = { label: string; value: string; onChange: (value: string) => void; disabled: boolean; text: PracticeText; copied: boolean; onCopy: () => void; style?: StyleProp<ViewStyle> };

/** A multiline prompt box with its counter and a Copy button (the prompt is the learner's to take to any AI tool). */
function Editor({ label, value, onChange, disabled, text, copied, onCopy, style }: EditorProps) {
  return (
    <View style={[styles.stack, style]}>
      <TextField label={label} value={value} onChangeText={onChange} multiline maxLength={MAX_LAB_PROMPT_CHARS} editable={!disabled} autoCapitalize="sentences" />
      <View style={styles.counterRow}>
        <ThemedText type="caption" themeColor="textSecondary" tabular accessibilityLiveRegion="polite" style={styles.fill}>
          {text.lab.promptCounter(wordCount(value), value.length, MAX_LAB_PROMPT_CHARS)}
        </ThemedText>
        <Button title={copied ? text.lab.copied : text.lab.copyPrompt} icon={copied ? 'check' : 'content_copy'} variant="secondary" size="small" disabled={value.trim().length === 0} onPress={onCopy} accessibilityLabel={`${text.lab.copyPrompt}: ${label}`} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  block: { gap: Spacing.one },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  fill: { flex: 1 },
  left: { alignSelf: 'flex-start' },
  badges: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flexWrap: 'wrap' },
  eyebrow: { textTransform: 'uppercase', letterSpacing: 0.6 },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
