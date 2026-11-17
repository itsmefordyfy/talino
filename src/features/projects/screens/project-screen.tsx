import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { OfflineNotice } from '@/components/offline-notice';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { LoadingState, NotFoundState } from '@/components/ui/state-view';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { coachErrorCode, requestReview, reviewFeedback, useCoachIdentity } from '@/features/coach';
import { adaptProject, inheritLevels, LevelNote, levelStrings, courseStrings, findProject, localizedProject, parseStepsDone, useLearning, useSaveReview, useSaveSubmissionDraft, useSetProjectSteps } from '@/features/courses';
import { onboardingStrings, useLearnerLevel } from '@/features/onboarding';
import { labResultsText, practiceStrings, practiceSummaryText, useLabSummaries, usePracticeSummaries } from '@/features/practice';
import { useAccess } from '@/features/store';
import { useIsOnline } from '@/hooks/use-is-online';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { successFeedback } from '@/lib/haptics';
import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';

import { PracticeSummaryCard } from '../components/practice-summary-card';
import { practiceRows } from '../lib/practice-summary';
import { isValidLink, parseSubmission, serializeSubmission } from '../lib/submission';

/** A course project: its steps, the learner's work, and Tali's review (which the certificate needs). */
export function ProjectScreen({ projectId }: { projectId: string }) {
  const strings = useLocalized(courseStrings);
  const levelWords = useLocalized(levelStrings);
  const levelLabels = useLocalized(onboardingStrings).experience;
  const learner = useLearnerLevel();
  const language = useLanguage();
  const practiceText = useLocalized(practiceStrings);
  const found = findProject(projectId);
  const learning = useLearning();
  const access = useAccess();
  const identity = useCoachIdentity();
  const setSteps = useSetProjectSteps();
  const saveDraft = useSaveSubmissionDraft();
  const saveReview = useSaveReview();
  const row = learning.projectRow(projectId);
  const stored = parseSubmission(row?.submission);
  const [link, setLink] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const online = useIsOnline();
  // The practice items the steps name (Soft Skills projects): what the learner has done shows here, and the same summary goes to the review.
  const practiceIds = found?.project.practiceItemIds ?? [];
  const practice = usePracticeSummaries(practiceIds);
  // The prompt labs among them (Generative AI projects) go to the review as their own labelled block.
  const labs = useLabSummaries(practiceIds);

  if (!found) return <NotFoundState icon="rocket_launch" title={strings.notFound} />;
  if (learning.isPending || learner.isPending) return <LoadingState />;
  const { course, project: englishProject } = found;
  const project = localizedProject(course, englishProject, language);
  // The steps and the review criteria for this learner's level: the shared ones plus the extras written for it. Tali reviews against exactly these.
  const adapted = adaptProject(inheritLevels(project, englishProject), learner.level);
  const owned = access.owns(course.id);
  const open = owned && !!learning.progressFor(course.id)?.projectOpen(project.id);
  const done = parseStepsDone(row?.steps_done);
  const linkValue = link ?? stored.link;
  const noteValue = note ?? stored.note;
  const passed = row?.status === 'passed';
  const isLink = project.submission.kind === 'url';

  const persistDraft = () => saveDraft.mutate({ projectId, courseId: course.id, submission: serializeSubmission({ link: linkValue, note: noteValue }) });

  const toggleStep = (stepId: string) => {
    const next = done.includes(stepId) ? done.filter((id) => id !== stepId) : [...done, stepId];
    setSteps.mutate({ projectId, courseId: course.id, steps: next });
  };

  const review = async () => {
    setProblem(null);
    if (isLink ? !linkValue.trim() : !noteValue.trim()) {
      setProblem(strings.submitEmpty);
      return;
    }
    if (isLink && !isValidLink(linkValue)) {
      setProblem(strings.submitInvalidUrl);
      return;
    }
    setReviewing(true);
    const submission = serializeSubmission({ link: linkValue, note: noteValue });
    try {
      const result = await requestReview(identity, { projectId, reviewId: newId(), link: isLink ? linkValue.trim() : '', submission: noteValue.trim(), language, level: learner.level, practice: practiceSummaryText(practice.data ?? []), labs: labResultsText(labs.data ?? []) });
      await saveReview.mutateAsync({ projectId, courseId: course.id, outcome: { status: result.review.verdict === 'pass' ? 'passed' : 'needs_work', feedback: reviewFeedback(result.review, language), token: result.token, submission } });
      if (result.review.verdict === 'pass') successFeedback();
    } catch (error) {
      persistDraft();
      const code = coachErrorCode(error);
      if (code === 'unknown') reportError(error, 'coach', { step: 'review' });
      setProblem(code === 'network' ? strings.reviewOffline : code === 'review_limit' ? strings.reviewLimit : strings.reviewFailed);
    } finally {
      setReviewing(false);
    }
  };

  return (
    <Screen footer={open && !passed ? <Button title={reviewing ? strings.reviewing : strings.requestReview} icon="rate_review" loading={reviewing} disabled={reviewing || !online} onPress={() => void review()} /> : undefined}>
      <Stack.Screen options={{ title: project.title }} />
      <View style={styles.titleBlock}>
        <ThemedText type="caption" themeColor="primaryText" style={styles.eyebrow}>
          {course.title}
        </ThemedText>
        <ThemedText type="title" accessibilityRole="header">
          {project.title}
        </ThemedText>
        <ThemedText type="body">{project.summary}</ThemedText>
        {owned && open && !passed && <Button title={strings.askTali} icon="forum" size="small" variant="ghost" onPress={() => router.push({ pathname: '/tali', params: { focus: `project:${project.id}` } })} />}
      </View>
      {adapted.summary.hasLevelContent && (
        <LevelNote level={learner.level} showAll={false} onToggleAll={() => undefined} hideToggle hiddenCount={0} message={learner.level ? levelWords.projectTailored(levelLabels[learner.level].label) : levelWords.projectShared} />
      )}
      {!owned && <Notice tone="info" message={strings.notOwned} />}
      {owned && open && !passed && !online && <OfflineNotice feature={strings.reviewsFeature} meanwhile={strings.reviewsMeanwhile} />}
      {owned && !open && <Notice tone="info" message={strings.projectLocked(project.unlockAfterDay)} />}
      {passed && (
        <View style={styles.reaction}>
          <Tali size={80} mood="proud" />
          <Notice tone="success" message={strings.statusPassed} style={styles.flex} />
        </View>
      )}
      {row?.status === 'needs_work' && (
        <View style={styles.reaction}>
          <Tali size={80} mood="thinking" />
          <Notice tone="warning" message={strings.statusNeedsWork} style={styles.flex} />
        </View>
      )}

      <Card>
        <View style={styles.line}>
          <Icon name="workspace_premium" size={20} color="secondaryText" />
          <View style={styles.flex}>
            <ThemedText type="secondarySemiBold">{strings.projectOutcome}</ThemedText>
            <ThemedText type="body">{project.outcome}</ThemedText>
          </View>
        </View>
      </Card>

      {owned && practiceIds.length > 0 && <PracticeSummaryCard rows={practiceRows(practiceIds, practice.data ?? [])} text={practiceText} nudge={open && !passed} />}

      <Section title={strings.projectSteps}>
        <Card padded={false}>
          {adapted.steps.map((step) => {
            const checked = done.includes(step.id);
            return (
              <ListRow
                key={step.id}
                title={step.text}
                titleLines={4}
                checked={checked}
                icon={checked ? 'check_box' : 'check_box_outline_blank'}
                iconColor={checked ? 'statusOk' : 'textSecondary'}
                iconBackground={checked ? 'statusOkSoft' : 'backgroundSelected'}
                onPress={open ? () => toggleStep(step.id) : undefined}
                showChevron={false}
                trailing={step.link ? <Button title={strings.openLink} size="small" variant="ghost" onPress={() => void Linking.openURL(step.link as string)} /> : undefined}
              />
            );
          })}
        </Card>
      </Section>

      {open && (
        <Section title={strings.projectSubmit}>
          <View style={styles.fields}>
            {isLink && (
              <TextField
                label={project.submission.label}
                value={linkValue}
                onChangeText={setLink}
                onBlur={persistDraft}
                placeholder={project.submission.placeholder}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                editable={!passed}
              />
            )}
            <TextField
              label={isLink ? strings.submitNote : project.submission.label}
              value={noteValue}
              onChangeText={setNote}
              onBlur={persistDraft}
              placeholder={isLink ? '' : project.submission.placeholder}
              multiline
              hint={project.submission.hint}
              editable={!passed}
            />
            {problem && <Notice tone="warning" message={problem} />}
          </View>
        </Section>
      )}

      {row?.feedback && (
        <Section title={strings.feedback}>
          <Card>
            <ThemedText type="body" selectable>
              {row.feedback}
            </ThemedText>
          </Card>
        </Section>
      )}

      <Section title={strings.rubricTitle}>
        <Card>
          <View style={styles.rubric}>
            {adapted.rubric.map((criterion, index) => (
              <View key={index} style={styles.line}>
                <Icon name="check_circle" size={18} color="textTertiary" />
                <ThemedText type="body" style={styles.flex}>
                  {criterion}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>
      </Section>
      {passed && <Button title={strings.backToCourse} variant="secondary" onPress={() => router.back()} />}
      {/* Development builds only: finishes a project without Tali (no Gemini key locally), to test certificates. Its certificate can't be verified (no signed review). */}
      {__DEV__ && open && !passed && (
        <Button
          title={strings.devPass}
          variant="ghost"
          size="small"
          onPress={() => saveReview.mutate({ projectId, courseId: course.id, outcome: { status: 'passed', feedback: 'Marked as passed in a development build.', token: null, submission: serializeSubmission({ link: linkValue, note: noteValue }) } })}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    gap: Spacing.two,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  fields: {
    gap: Spacing.three,
  },
  rubric: {
    gap: Spacing.two,
  },
});
