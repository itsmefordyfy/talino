import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipSelect } from '@/components/ui/chip-select';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useCoachIdentity } from '@/features/coach';
import { aiErrorKey, requestTemplateDraft, TEMPLATE_TONES, type AiErrorKey, type TemplateTone } from '@/features/resume';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';
import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';

import type { TemplateDefinition } from '../content';
import { fillTemplate, PRIVATE_PLACEHOLDERS, type TemplateValues } from '../lib/fill';
import { templateStrings } from '../strings';

export type TemplateAiDraft = { text: string; questions: string[] };

export type TemplateAiCardProps = {
  template: TemplateDefinition;
  values: TemplateValues;
  /** Tali's writing help is on offer (All-Access). */
  canWrite: boolean;
  onUpgrade: () => void;
  /** Tali's draft, or null when the learner goes back to the template. */
  onDraft: (draft: TemplateAiDraft | null) => void;
  hasDraft: boolean;
};

/**
 * Tali turning one template into a draft for the learner's situation. The learner says what this message is about (the job post, the
 * client's message) and picks a tone; the template goes out filled from their profile EXCEPT their name and links, which stay as tokens
 * (the résumé route never receives them) and are put back here, from the phone, once the draft returns.
 */
export function TemplateAiCard({ template, values, canWrite, onUpgrade, onDraft, hasDraft }: TemplateAiCardProps) {
  const strings = useLocalized(templateStrings);
  const language = useLanguage();
  const theme = useTheme();
  const identity = useCoachIdentity();
  const [details, setDetails] = useState('');
  const [tone, setTone] = useState<TemplateTone>('friendly');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AiErrorKey | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const ai = strings.ai;

  const write = async () => {
    if (busy) return;
    tapFeedback();
    setBusy(true);
    setError(null);
    try {
      const draft = fillTemplate(template.body, values, undefined, PRIVATE_PLACEHOLDERS).text;
      const result = await requestTemplateDraft(identity, { requestId: newId(), kind: template.kind, draft, details: details.trim(), tone, language });
      // The name and links go back in from the phone; any token the model made up becomes a visible blank.
      const text = fillTemplate(result.text, values).text;
      setQuestions(result.questions);
      onDraft({ text, questions: result.questions });
    } catch (caught) {
      const key = aiErrorKey(caught);
      if (key === 'unknown') reportError(caught, 'career', { action: 'template-draft', template: template.id });
      setError(key);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <View style={styles.header}>
        <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
          <Icon name="auto_awesome" size={20} color="primary" filled />
        </View>
        <View style={styles.headerText}>
          <ThemedText type="cardTitle">{ai.title}</ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary">
            {ai.body}
          </ThemedText>
        </View>
      </View>

      {canWrite ? (
        <View style={styles.form}>
          <TextField label={ai.notesLabel} placeholder={template.aiHint} value={details} onChangeText={setDetails} multiline maxLength={4000} autoCapitalize="sentences" />
          <ChipSelect<TemplateTone> label={ai.tone} options={TEMPLATE_TONES.map((value) => ({ value, label: ai.tones[value] }))} value={tone} onChange={setTone} />
          <Button title={busy ? ai.writing : hasDraft ? ai.again : ai.write} icon="auto_awesome" loading={busy} disabled={busy} onPress={() => void write()} />
          {hasDraft && (
            <Button
              title={ai.back}
              icon="undo"
              variant="secondary"
              onPress={() => {
                setQuestions([]);
                onDraft(null);
              }}
            />
          )}
          {error && <Notice tone={error === 'offline' ? 'info' : 'warning'} message={ai.errors[error]} />}
          {hasDraft && questions.length > 0 && (
            <View style={styles.questions}>
              <ThemedText type="secondarySemiBold">{ai.questions}</ThemedText>
              {questions.map((question) => (
                <ThemedText key={question} type="secondary" themeColor="textSecondary">{`•  ${question}`}</ThemedText>
              ))}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.form}>
          <Notice tone="info" message={ai.lockedNote} />
          <Button title={ai.locked} icon="lock" variant="secondary" onPress={onUpgrade} />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', gap: Spacing.three, alignItems: 'flex-start' },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1, gap: Spacing.one },
  form: { gap: Spacing.three, marginTop: Spacing.three },
  questions: { gap: Spacing.one },
});
