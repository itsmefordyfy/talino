import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { Notice } from '@/components/ui/notice';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SettingsGroup } from '@/components/ui/settings-group';
import { Spacing } from '@/constants/theme';
import { useCoachIdentity } from '@/features/coach';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { successFeedback, tapFeedback } from '@/lib/haptics';
import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';

import { aiErrorKey, requestReview, type AiErrorKey } from '../api/ai-client';
import type { DocTarget } from '../api/document-repo';
import { applySuggestion, type Review, type Suggestion } from '../lib/ai';
import { checkAts, type AtsSeverity } from '../lib/ats';
import { lineList, LIMITS, type ResumeContent } from '../lib/document';
import type { PendingNotes } from '../lib/pending-notes';
import { SECTION_HEADINGS } from '../lib/render';
import type { ResumeStyle } from '../lib/templates';
import { builderStrings } from '../builder-strings';
import { openPaywall } from '@/features/store';

export type AssistantPanelProps = {
  documentId: string;
  content: ResumeContent;
  style: ResumeStyle;
  target: DocTarget | null;
  onContent: (content: ResumeContent) => void;
  allAccess: boolean;
  notes: PendingNotes | null;
  /** Saves the résumé before it is sent for review, so what Tali reads is what is on the phone. */
  flush: () => Promise<void>;
};

const SEVERITY_ICON: Record<AtsSeverity, IconName> = { high: 'error', medium: 'warning', low: 'info' };

/** The AI tab: the free résumé check, then everything Tali does (review, tailor), every change one the learner accepts or skips. */
export function AssistantPanel({ documentId, content, style, target, onContent, allAccess, notes, flush }: AssistantPanelProps) {
  const s = useLocalized(builderStrings);
  const language = useLanguage();
  const identity = useCoachIdentity();
  const [review, setReview] = useState<Review | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState<AiErrorKey | null>(null);
  const [stale, setStale] = useState(false);
  const [applied, setApplied] = useState(0);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [addedSkills, setAddedSkills] = useState<string[]>([]);

  const report = checkAts(content, style, target?.keywords ?? []);
  const empty = content.summary === '' && content.skills.length === 0 && content.experience.length + content.projects.length + content.education.length === 0;

  const runReview = async () => {
    if (reviewing) return;
    setReviewing(true);
    setError(null);
    setStale(false);
    try {
      await flush();
      const job = target?.jobDescription && target.jobDescription.length >= 40 ? { title: target.jobTitle, description: target.jobDescription } : null;
      setReview(await requestReview(identity, { requestId: newId(), content, job, language }));
      setSkipped([]);
      setApplied(0);
      successFeedback();
    } catch (caught) {
      const key = aiErrorKey(caught);
      if (key === 'unknown') reportError(caught, 'career', { action: 'review-resume' });
      setError(key);
    } finally {
      setReviewing(false);
    }
  };

  const accept = (suggestion: Suggestion) => {
    const next = applySuggestion(content, suggestion);
    if (!next) {
      // The text under the suggestion changed (the learner edited it, or took another suggestion for it).
      setStale(true);
      setSkipped((current) => [...current, suggestion.key]);
      return;
    }
    tapFeedback();
    onContent(next);
    setApplied((count) => count + 1);
    setSkipped((current) => [...current, suggestion.key]);
  };

  const addSkill = (skill: string) => {
    tapFeedback();
    onContent({ ...content, skills: lineList([...content.skills, skill], LIMITS.skills, 60) });
    setAddedSkills((current) => [...current, skill]);
  };

  const open = review?.suggestions.filter((suggestion) => !skipped.includes(suggestion.key)) ?? [];
  const openSkills = (notes?.suggestedSkills ?? []).filter((item) => !addedSkills.includes(item.skill) && !content.skills.some((own) => own.toLowerCase() === item.skill.toLowerCase()));

  return (
    <View style={styles.root}>
      <Card style={styles.card}>
        <View style={styles.scoreRow}>
          <ThemedText type="section">{s.assistant.checkTitle}</ThemedText>
          <ThemedText type="stat" tabular>{`${report.score}`}</ThemedText>
        </View>
        <ProgressBar fraction={report.score / 100} accessibilityLabel={s.assistant.score(report.score)} done={report.score >= 85} />
        <ThemedText type="secondary" themeColor="textSecondary">
          {report.issues.length === 0 ? s.assistant.checkClean : s.assistant.checkSome(report.issues.length)}
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          {`${s.assistant.pages(report.pages)}  ·  ${s.assistant.checkNote}`}
        </ThemedText>
        {report.issues.map((issue, index) => (
          <View key={`${issue.id}-${index}`} style={styles.issue}>
            <Icon name={SEVERITY_ICON[issue.severity]} size={18} color={issue.severity === 'high' ? 'danger' : issue.severity === 'medium' ? 'statusWarn' : 'textSecondary'} />
            <ThemedText type="secondary" style={styles.flex}>
              {s.ats[issue.id](issue.detail ?? '')}
            </ThemedText>
          </View>
        ))}
        {report.keywords && (
          <View style={styles.keywords}>
            <ThemedText type="secondarySemiBold">{s.assistant.keywords}</ThemedText>
            {report.keywords.found.length > 0 && <ThemedText type="secondary" themeColor="statusOk">{`✓ ${report.keywords.found.join(', ')}`}</ThemedText>}
            {report.keywords.missing.length > 0 && <ThemedText type="secondary" themeColor="textSecondary">{`✗ ${report.keywords.missing.join(', ')}`}</ThemedText>}
          </View>
        )}
      </Card>

      {notes && (notes.questions.length > 0 || openSkills.length > 0 || notes.gaps.length > 0) && (
        <Card style={styles.card}>
          <ThemedText type="section">{s.assistant.fromTali}</ThemedText>
          {notes.questions.length > 0 && <NoteList title={s.assistant.questionsTitle} hint={s.assistant.questionsHint} lines={notes.questions} />}
          {notes.gaps.length > 0 && <NoteList title={s.assistant.gapsTitle} hint={s.assistant.gapsHint} lines={notes.gaps} />}
          {openSkills.length > 0 && (
            <View style={styles.list}>
              <ThemedText type="secondarySemiBold">{s.assistant.skillsTitle}</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">
                {s.assistant.skillsHint}
              </ThemedText>
              {openSkills.map((item) => (
                <View key={item.skill} style={styles.suggestion}>
                  <View style={styles.flex}>
                    <ThemedText type="bodySemiBold">{item.skill}</ThemedText>
                    <ThemedText type="caption" themeColor="textSecondary">
                      {s.assistant.because(item.evidence)}
                    </ThemedText>
                  </View>
                  <Button title={s.assistant.add} size="small" variant="secondary" onPress={() => addSkill(item.skill)} />
                </View>
              ))}
            </View>
          )}
        </Card>
      )}

      {allAccess ? (
        <SettingsGroup title={s.assistant.taliTitle}>
          <ListRow title={s.assistant.tailorRow} subtitle={s.assistant.tailorBody} titleLines={2} icon="work" onPress={() => router.push({ pathname: '/resume/tailor', params: { docId: documentId } })} />
        </SettingsGroup>
      ) : (
        <Card style={styles.card}>
          <View style={styles.lockRow}>
            <Icon name="lock" size={20} color="primary" />
            <ThemedText type="bodySemiBold" style={styles.flex}>
              {s.assistant.lockedTitle}
            </ThemedText>
          </View>
          <ThemedText type="secondary" themeColor="textSecondary">
            {s.assistant.lockedBody}
          </ThemedText>
          <Button title={s.assistant.seeAllAccess} onPress={() => void openPaywall('resume')} />
        </Card>
      )}

      {allAccess && (
        <View style={styles.list}>
          <Button title={reviewing ? s.assistant.reviewing : review ? s.assistant.reviewAgain : s.assistant.review} icon="auto_awesome" loading={reviewing} disabled={reviewing || empty} onPress={() => void runReview()} />
          {empty && (
            <ThemedText type="caption" themeColor="textSecondary">
              {s.assistant.reviewNeedsContent}
            </ThemedText>
          )}
          {error && <Notice tone={error === 'offline' ? 'info' : 'warning'} message={s.errors[error]} />}
          {stale && <Notice tone="info" message={s.assistant.stale} />}
        </View>
      )}

      {review && (
        <View style={styles.list}>
          <Card style={styles.card}>
            <ThemedText type="section">{s.assistant.verdictTitle}</ThemedText>
            <ThemedText type="body" selectable>
              {review.verdict}
            </ThemedText>
            {review.weak.map((weak) => (
              <View key={weak.section} style={styles.issue}>
                <Icon name="lightbulb" size={18} color="primary" />
                <ThemedText type="secondary" style={styles.flex}>{`${SECTION_HEADINGS[weak.section]}: ${weak.advice}`}</ThemedText>
              </View>
            ))}
            {review.questions.length > 0 && <NoteList title={s.assistant.questionsTitle} hint={s.assistant.questionsHint} lines={review.questions} />}
          </Card>
          {applied > 0 && <Notice tone="success" message={s.assistant.applied(applied)} />}
          {open.length > 0 ? (
            <ThemedText type="secondarySemiBold" themeColor="textSecondary">
              {s.assistant.suggestions(open.length)}
            </ThemedText>
          ) : (
            <ThemedText type="secondary" themeColor="textSecondary">
              {review.suggestions.length === 0 ? s.assistant.noSuggestions : s.assistant.allReviewed}
            </ThemedText>
          )}
          {open.map((suggestion) => (
            <SuggestionCard key={suggestion.key} suggestion={suggestion} content={content} onAccept={() => accept(suggestion)} onSkip={() => setSkipped((current) => [...current, suggestion.key])} />
          ))}
        </View>
      )}
    </View>
  );
}

function NoteList({ title, hint, lines }: { title: string; hint: string; lines: string[] }) {
  return (
    <View style={styles.list}>
      <ThemedText type="secondarySemiBold">{title}</ThemedText>
      <ThemedText type="caption" themeColor="textSecondary">
        {hint}
      </ThemedText>
      {lines.map((line) => (
        <ThemedText key={line} type="secondary" selectable>{`•  ${line}`}</ThemedText>
      ))}
    </View>
  );
}

function SuggestionCard({ suggestion, content, onAccept, onSkip }: { suggestion: Suggestion; content: ResumeContent; onAccept: () => void; onSkip: () => void }) {
  const s = useLocalized(builderStrings);
  const where = describe(suggestion, content, s.assistant);
  return (
    <Card style={styles.card}>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.where}>
        {where}
      </ThemedText>
      {suggestion.kind === 'skill' ? (
        <>
          <ThemedText type="bodySemiBold">{s.assistant.addSkillSuggestion(suggestion.skill)}</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {s.assistant.because(suggestion.evidence)}
          </ThemedText>
        </>
      ) : (
        <>
          <ThemedText type="secondary" themeColor="textSecondary" style={styles.before}>
            {suggestion.kind === 'rewrite' ? suggestion.before : suggestion.before.join('\n')}
          </ThemedText>
          <ThemedText type="body" selectable>
            {suggestion.kind === 'rewrite' ? suggestion.after : suggestion.after.join('\n')}
          </ThemedText>
        </>
      )}
      <ThemedText type="secondary" themeColor="textSecondary">
        {suggestion.reason}
      </ThemedText>
      <View style={styles.actions}>
        <Button title={s.assistant.accept} icon="check" size="small" onPress={onAccept} />
        <Button title={s.assistant.skip} variant="secondary" size="small" onPress={onSkip} />
      </View>
    </Card>
  );
}

/** Where a suggestion applies, in words: "Experience · Developer · bullet 2". */
function describe(suggestion: Suggestion, content: ResumeContent, words: { skill: string; bullet: (n: number) => string; headline: string }): string {
  if (suggestion.kind === 'skill') return words.skill;
  if (suggestion.kind === 'bullets') return `${SECTION_HEADINGS[suggestion.section]} · ${content[suggestion.section].find((entry) => entry.id === suggestion.id)?.title ?? ''}`;
  const { target } = suggestion;
  if (target.section === 'summary') return SECTION_HEADINGS.summary;
  if (target.section === 'headline') return words.headline;
  if (target.section === 'achievements') return `${SECTION_HEADINGS.achievements} · ${words.bullet(target.index + 1)}`;
  const title = content[target.section].find((entry) => entry.id === target.id)?.title ?? '';
  return `${SECTION_HEADINGS[target.section]} · ${title} · ${words.bullet(target.index + 1)}`;
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.four,
  },
  flex: {
    flex: 1,
  },
  card: {
    gap: Spacing.two,
  },
  list: {
    gap: Spacing.two,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  issue: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  keywords: {
    gap: Spacing.half,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  where: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  before: {
    textDecorationLine: 'line-through',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
});
