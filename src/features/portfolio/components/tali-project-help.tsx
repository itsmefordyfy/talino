import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { Spacing } from '@/constants/theme';
import { DraftLine, useDraftErrorText, useTaliDraft } from '@/features/resume';
import { useLocalized } from '@/hooks/use-strings';

import { parseTech } from '../lib/projects';
import { taliStrings } from '../tali-strings';

export type TaliProjectHelpProps = {
  id: string;
  title: string;
  role: string;
  tech: string;
  /** The learner's own rough words: the story, else the summary. */
  notes: string;
  onSummary: (value: string) => void;
  onStory: (value: string) => void;
};

/** In the project editor: Tali (or Tala) writes the summary and the story from the learner's own words; each is applied only when they tap Use. */
export function TaliProjectHelp({ id, title, role, tech, notes, onSummary, onStory }: TaliProjectHelpProps) {
  const t = useLocalized(taliStrings);
  const errorText = useDraftErrorText();
  const tali = useTaliDraft();
  const [used, setUsed] = useState<string[]>([]);
  const working = tali.state.status === 'working';
  const ready = title.trim() !== '';
  const enough = notes.trim().length >= 10;

  const ask = () => {
    setUsed([]);
    void tali.run({ headline: '', about: '', projects: [{ id, title: title.trim(), role: role.trim(), tech: parseTech(tech), notes: notes.trim() }], want: { headline: false, about: false, projectIds: [id] } });
  };
  const mine = tali.state.status === 'done' ? tali.state.draft.projects.find((project) => project.id === id) : undefined;
  const take = (key: string, apply: () => void) => {
    apply();
    setUsed((current) => [...current, key]);
  };

  return (
    <Card style={styles.card}>
      <ThemedText type="cardTitle">{t.projectTitle}</ThemedText>
      <ThemedText type="secondary" themeColor="textSecondary">
        {!ready ? t.projectNeedTitle : enough ? t.projectBody : t.projectNeedNotes}
      </ThemedText>
      <Button title={working ? t.working : tali.state.status === 'done' || tali.state.status === 'failed' ? t.again : t.button} icon="auto_awesome" variant={tali.state.status === 'idle' ? 'primary' : 'secondary'} loading={working} disabled={working || !ready || !enough} onPress={ask} />
      {tali.state.status === 'failed' && <Notice tone={tali.state.error === 'offline' ? 'info' : 'warning'} message={errorText(tali.state.error)} />}
      {tali.state.status === 'done' && (
        <View style={styles.draft}>
          {mine?.summary ? <DraftLine label={t.summary} text={mine.summary} used={used.includes('summary')} useLabel={t.use} usedLabel={t.used} onUse={() => take('summary', () => onSummary(mine.summary))} /> : null}
          {mine?.description ? <DraftLine label={t.story} text={mine.description} used={used.includes('story')} useLabel={t.use} usedLabel={t.used} onUse={() => take('story', () => onStory(mine.description))} /> : null}
          {tali.state.draft.questions.length > 0 && (
            <View style={styles.questions}>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.caps}>
                {t.asks}
              </ThemedText>
              {tali.state.draft.questions.map((question) => (
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
