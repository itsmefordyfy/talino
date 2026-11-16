import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipSelect } from '@/components/ui/chip-select';
import { FormSection } from '@/components/ui/form-section';
import { Notice } from '@/components/ui/notice';
import { Toggle } from '@/components/ui/toggle';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useCoachIdentity } from '@/features/coach';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';

import { aiErrorKey, requestImproved, type AiErrorKey } from '../api/ai-client';
import type { Improved } from '../lib/ai';
import { textLines, type DocEntry, type EntrySection } from '../lib/document';
import { builderStrings } from '../builder-strings';
import { draftStrings } from '../draft-strings';
import { IMPROVE_STYLES, type ImproveStyle } from '../lib/ai-prompts';

export type EntryEditorProps = {
  section: EntrySection;
  entry: DocEntry;
  onChange: (entry: DocEntry) => void;
  /** AI help is on offer (All-Access). */
  canImprove: boolean;
  onUpgrade: () => void;
};

/** One job, project, degree or certificate, edited in place: every field is plain text the learner owns. */
export function EntryEditor({ section, entry, onChange, canImprove, onUpgrade }: EntryEditorProps) {
  const s = useLocalized(builderStrings);
  const language = useLanguage();
  const identity = useCoachIdentity();
  const [bullets, setBullets] = useState(entry.bullets.join('\n'));
  const [improving, setImproving] = useState(false);
  const [improved, setImproved] = useState<Improved | null>(null);
  const [how, setHow] = useState<ImproveStyle>('professional');
  const d = useLocalized(draftStrings);
  const [error, setError] = useState<AiErrorKey | null>(null);
  const set = (patch: Partial<DocEntry>) => onChange({ ...entry, ...patch });
  const labels = s.entry[section];
  const isCertificate = section === 'certifications';
  const hasBullets = !isCertificate;
  const rough = textLines(bullets).join('\n');

  const improve = async () => {
    if (improving || rough.length < 10) return;
    setImproving(true);
    setError(null);
    setImproved(null);
    try {
      setImproved(await requestImproved(identity, { requestId: newId(), section, title: entry.title, organization: entry.organization, text: rough, style: how, language }));
    } catch (caught) {
      const key = aiErrorKey(caught);
      if (key === 'unknown') reportError(caught, 'career', { action: 'improve-resume-entry' });
      setError(key);
    } finally {
      setImproving(false);
    }
  };

  const useImproved = () => {
    if (!improved) return;
    setBullets(improved.bullets.join('\n'));
    set({ bullets: improved.bullets });
    setImproved(null);
  };

  return (
    <View style={styles.root}>
      <FormSection title={labels.title}>
        <TextField label={labels.titleLabel} placeholder={labels.titlePlaceholder} value={entry.title} onChangeText={(title) => set({ title })} autoCapitalize="sentences" />
        <TextField label={labels.organizationLabel} value={entry.organization} onChangeText={(organization) => set({ organization })} autoCapitalize="words" />
        {!isCertificate && <TextField label={s.entry.locationLabel} value={entry.location} onChangeText={(location) => set({ location })} autoCapitalize="words" />}
        {isCertificate ? (
          <TextField label={s.entry.earnedLabel} placeholder={s.entry.datePlaceholder} value={entry.end} onChangeText={(end) => set({ end })} />
        ) : (
          <>
            <TextField label={s.entry.startLabel} placeholder={s.entry.datePlaceholder} value={entry.start} onChangeText={(start) => set({ start })} />
            {!entry.current && <TextField label={s.entry.endLabel} placeholder={s.entry.datePlaceholder} value={entry.end} onChangeText={(end) => set({ end })} />}
            <View style={styles.toggleRow}>
              <ThemedText type="body" style={styles.flex}>
                {s.entry.current}
              </ThemedText>
              <Toggle value={entry.current} onValueChange={(current) => set({ current })} accessibilityLabel={s.entry.current} />
            </View>
          </>
        )}
        {section !== 'education' && <TextField label={s.entry.linkLabel} placeholder="example.com" value={entry.link} onChangeText={(link) => set({ link })} keyboardType="url" autoCapitalize="none" autoCorrect={false} />}
      </FormSection>

      {hasBullets && (
        <FormSection title={s.entry.bulletsTitle} footer={s.entry.bulletsHint}>
          <TextField
            label={s.entry.bulletsLabel}
            placeholder={s.entry.bulletsPlaceholder}
            value={bullets}
            onChangeText={(text) => {
              setBullets(text);
              set({ bullets: textLines(text) });
            }}
            multiline
          />
          {canImprove && <ChipSelect label={d.stylesLabel} wrap options={IMPROVE_STYLES.map((value) => ({ value, label: d.styles[value] }))} value={how} onChange={setHow} />}
          {canImprove ? (
            <Button title={improving ? s.entry.improving : improved ? d.improveAgain : s.entry.improve} icon="auto_awesome" variant="secondary" loading={improving} disabled={improving || rough.length < 10} onPress={() => void improve()} />
          ) : (
            <Button title={s.entry.improveLocked} icon="lock" variant="secondary" onPress={onUpgrade} />
          )}
          {rough.length < 10 && canImprove && (
            <ThemedText type="caption" themeColor="textSecondary">
              {s.entry.improveNeedsText}
            </ThemedText>
          )}
          {error && <Notice tone={error === 'offline' ? 'info' : 'warning'} message={s.errors[error]} />}
        </FormSection>
      )}

      {improved && (
        <Card style={styles.card}>
          <ThemedText type="bodySemiBold">{s.entry.suggested}</ThemedText>
          {improved.bullets.map((line) => (
            <ThemedText key={line} type="body" selectable>{`•  ${line}`}</ThemedText>
          ))}
          {improved.reason !== '' && (
            <ThemedText type="secondary" themeColor="textSecondary">
              {improved.reason}
            </ThemedText>
          )}
          {improved.questions.length > 0 && (
            <View style={styles.questions}>
              <ThemedText type="secondarySemiBold">{s.entry.questions}</ThemedText>
              {improved.questions.map((question) => (
                <ThemedText key={question} type="secondary" themeColor="textSecondary">{`•  ${question}`}</ThemedText>
              ))}
            </View>
          )}
          <View style={styles.actions}>
            <Button title={s.entry.useThese} icon="check" size="small" onPress={useImproved} />
            <Button title={s.entry.keepMine} variant="secondary" size="small" onPress={() => setImproved(null)} />
          </View>
        </Card>
      )}
    </View>
  );
}

/** A blank entry with its own id, ready to be filled in. */
export function blankEntry(makeId: () => string): DocEntry {
  return { id: makeId(), title: '', organization: '', location: '', start: '', end: '', current: false, link: '', bullets: [] };
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.four,
  },
  flex: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  card: {
    gap: Spacing.two,
  },
  questions: {
    gap: Spacing.one,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
});
