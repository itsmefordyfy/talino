import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { draftStrings } from '../draft-strings';
import { useDraftErrorText, useTaliDraft } from '../hooks/use-tali-draft';
import type { ResumeContent } from '../lib/document';
import { DraftLine } from './draft-line';

export type ResumeTextHelpProps = {
  content: ResumeContent;
  onChange: (content: ResumeContent) => void;
};

/**
 * In the résumé editor: Tali (or Tala) drafts the headline and the summary from what is in this résumé, in résumé style (no
 * pronouns). Each piece is applied only when the learner taps Use, so what they wrote is never replaced without a choice.
 */
export function ResumeTextHelp({ content, onChange }: ResumeTextHelpProps) {
  const d = useLocalized(draftStrings);
  const errorText = useDraftErrorText();
  const tali = useTaliDraft();
  const [used, setUsed] = useState<string[]>([]);
  const working = tali.state.status === 'working';
  const hasFacts = content.skills.length > 0 || content.experience.length + content.projects.length + content.education.length > 0;

  const ask = () => {
    setUsed([]);
    void tali.run({ target: 'resume', resume: content, headline: content.headline, about: content.summary, projects: [], want: { headline: true, about: true, projectIds: [] } });
  };
  const take = (key: string, patch: Partial<ResumeContent>) => {
    onChange({ ...content, ...patch });
    setUsed((current) => [...current, key]);
  };
  const draft = tali.state.status === 'done' ? tali.state.draft : null;

  return (
    <Card style={styles.card}>
      <ThemedText type="cardTitle">{d.summaryTitle}</ThemedText>
      <ThemedText type="secondary" themeColor="textSecondary">
        {hasFacts ? d.summaryBody : d.summaryNeedFacts}
      </ThemedText>
      <Button title={working ? d.summaryWorking : draft || tali.state.status === 'failed' ? d.improveAgain : d.summaryButton} icon="auto_awesome" variant={tali.state.status === 'idle' ? 'primary' : 'secondary'} loading={working} disabled={working || !hasFacts} onPress={ask} />
      {tali.state.status === 'failed' && <Notice tone={tali.state.error === 'offline' ? 'info' : 'warning'} message={errorText(tali.state.error)} />}
      {draft && (
        <View style={styles.draft}>
          {draft.headline !== '' && <DraftLine label={d.summaryHeadline} text={draft.headline} used={used.includes('headline')} useLabel={d.use} usedLabel={d.used} onUse={() => take('headline', { headline: draft.headline })} />}
          {draft.headlineOptions.map((option) => (
            <DraftLine key={option} label={d.headlineAlt} text={option} used={used.includes(`option:${option}`)} useLabel={d.use} usedLabel={d.used} onUse={() => take(`option:${option}`, { headline: option })} />
          ))}
          {draft.about !== '' && <DraftLine label={d.summarySummary} text={draft.about} used={used.includes('summary')} useLabel={d.use} usedLabel={d.used} onUse={() => take('summary', { summary: draft.about })} />}
          {draft.questions.length > 0 && (
            <View style={styles.questions}>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.caps}>
                {d.asks}
              </ThemedText>
              {draft.questions.map((question) => (
                <ThemedText key={question} type="secondary">{`• ${question}`}</ThemedText>
              ))}
            </View>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  draft: { gap: Spacing.three, marginTop: Spacing.one },
  questions: { gap: Spacing.half },
  caps: { textTransform: 'uppercase', letterSpacing: 0.8 },
});
