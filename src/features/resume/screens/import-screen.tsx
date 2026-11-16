import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { TaliSays } from '@/components/tali-says';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { FormActions } from '@/components/ui/form-actions';
import { FormSection } from '@/components/ui/form-section';
import { Notice } from '@/components/ui/notice';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { ErrorState, LoadingState } from '@/components/ui/state-view';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useCoachIdentity } from '@/features/coach';
import { learnerNameChanged, selectLearnerName } from '@/features/settings/settings-slice';
import { openPaywall, useAccess } from '@/features/store';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { successFeedback } from '@/lib/haptics';
import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';
import { closeScreen } from '@/lib/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { aiErrorKey, requestImport, type AiErrorKey, type ImportSource } from '../api/ai-client';
import { pickResumeFile } from '../api/pick-file';
import { builderStrings } from '../builder-strings';
import { ENTRY_SECTIONS, type ResumeContent } from '../lib/document';
import type { Merge } from '../lib/master';
import { previewImport, useApplyImport } from '../hooks/use-documents';
import { useResumeSources } from '../hooks/use-resume';
import { resumeStrings } from '../strings';

type Picked = { name: string; size: number; source: Extract<ImportSource, { kind: 'file' }> };

const MIN_PASTE = 80;

/** Upload a PDF or Word résumé (or paste its text); Tali reads it, the learner checks what she found, and it joins the career profile. */
export function ImportScreen() {
  const s = useLocalized(builderStrings);
  const r = useLocalized(resumeStrings);
  const access = useAccess();
  const sources = useResumeSources();
  if (sources.isPending) return <LoadingState />;
  if (sources.isError) return <ErrorState message={r.loadError} onRetry={sources.refetch} />;
  if (!access.allAccess) {
    return (
      <Screen>
        <Stack.Screen options={{ title: s.import.title }} />
        <EmptyState icon="lock" title={s.import.lockedTitle} message={s.import.lockedBody} action={<Button title={s.assistant.seeAllAccess} onPress={() => void openPaywall('resume')} />} />
      </Screen>
    );
  }
  return <Importer sources={sources} />;
}

function Importer({ sources }: { sources: ReturnType<typeof useResumeSources> }) {
  const s = useLocalized(builderStrings);
  const language = useLanguage();
  const identity = useCoachIdentity();
  const dispatch = useAppDispatch();
  const learnerName = useAppSelector(selectLearnerName);
  const apply = useApplyImport();
  const [file, setFile] = useState<Picked | null>(null);
  const [pasted, setPasted] = useState('');
  const [pasting, setPasting] = useState(false);
  const [phase, setPhase] = useState<'pick' | 'reading' | 'review' | 'saved'>('pick');
  const [error, setError] = useState<AiErrorKey | null>(null);
  const [fileNote, setFileNote] = useState<string | null>(null);
  const [found, setFound] = useState<{ content: ResumeContent; merge: Merge } | null>(null);
  // One id for this attempt: a retry after a failure is the same request, which the server counts once.
  const [requestId, setRequestId] = useState(newId);

  const choose = async () => {
    setFileNote(null);
    setError(null);
    const picked = await pickResumeFile();
    if (picked.kind === 'file') setFile({ name: picked.name, size: picked.size, source: picked.source });
    else if (picked.kind === 'too_large') setFileNote(s.errors.file_too_large);
    else if (picked.kind === 'unreadable') setFileNote(s.errors.unreadable_file);
    else if (picked.kind === 'unavailable') setFileNote(s.import.pickerUnavailable);
  };

  const read = async () => {
    const source: ImportSource | null = pasting ? (pasted.trim().length >= MIN_PASTE ? { kind: 'text', text: pasted.trim() } : null) : (file?.source ?? null);
    if (!source || phase === 'reading') return;
    setPhase('reading');
    setError(null);
    try {
      const content = await requestImport(identity, { requestId, source, language });
      setFound({ content, merge: previewImport(sources, content) });
      setPhase('review');
      successFeedback();
    } catch (caught) {
      const key = aiErrorKey(caught);
      if (key === 'unknown') reportError(caught, 'career', { action: 'import-resume' });
      setError(key);
      setPhase('pick');
      // A document that couldn't be read is a different attempt next time.
      if (key === 'unreadable_file') setRequestId(newId());
    }
  };

  const save = () => {
    if (!found || apply.isPending) return;
    const { merge } = found;
    apply.mutate(
      { items: merge.items, profile: merge.profile },
      {
        onSuccess: () => {
          if (learnerName.trim() === '' && merge.name.trim() !== '') dispatch(learnerNameChanged(merge.name));
          successFeedback();
          setPhase('saved');
        },
        onError: (caught) => reportError(caught, 'career', { action: 'apply-resume-import' }),
      },
    );
  };

  if (phase === 'reading') {
    return (
      <Screen>
        <Stack.Screen options={{ title: s.import.title }} />
        <TaliSays mood="coding" text={s.import.reading} size="large" layout="stacked" />
        <ProgressBar fraction={0.4} accessibilityLabel={s.import.reading} />
        <ThemedText type="caption" themeColor="textSecondary" style={styles.center}>
          {s.import.privacy}
        </ThemedText>
      </Screen>
    );
  }

  if (phase === 'saved' && found) {
    return (
      <Screen
        footer={
          <FormActions>
            <Button title={s.import.createNow} icon="auto_awesome" onPress={() => router.replace('/resume/create')} />
            <Button title={s.import.done} variant="secondary" onPress={closeScreen} />
          </FormActions>
        }>
        <Stack.Screen options={{ title: s.import.title }} />
        <TaliSays mood="celebrating" text={s.import.saved} size="large" layout="stacked" />
        <Summary merge={found.merge} />
      </Screen>
    );
  }

  if (phase === 'review' && found) {
    const nothingNew = found.merge.items.length === 0 && Object.keys(found.merge.profile).length === 0;
    return (
      <Screen
        footer={
          <FormActions>
            <Button title={apply.isPending ? s.import.saving : s.import.add} icon="check" loading={apply.isPending} disabled={apply.isPending || nothingNew} onPress={save} />
            <Button title={s.import.another} variant="secondary" disabled={apply.isPending} onPress={() => setPhase('pick')} />
          </FormActions>
        }>
        <Stack.Screen options={{ title: s.import.reviewTitle }} />
        <TaliSays mood="explaining" text={s.import.found} />
        {apply.isError && <Notice tone="warning" message={s.import.saveFailed} />}
        <Card style={styles.card}>
          {found.content.name !== '' && <ThemedText type="section">{found.content.name}</ThemedText>}
          {found.content.headline !== '' && <ThemedText type="body">{found.content.headline}</ThemedText>}
          <Summary merge={found.merge} />
        </Card>
        {nothingNew ? <Notice tone="info" message={s.import.nothingNew} /> : <ThemedText type="caption" themeColor="textSecondary">{s.import.reviewNote}</ThemedText>}
        <FoundList content={found.content} />
      </Screen>
    );
  }

  const ready = pasting ? pasted.trim().length >= MIN_PASTE : file !== null;
  return (
    <Screen footer={<Button title={s.import.read} icon="auto_awesome" disabled={!ready} onPress={() => void read()} />} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: s.import.title }} />
      <TaliSays mood="curious" text={s.import.say} />
      {error && <Notice tone={error === 'offline' ? 'info' : 'warning'} message={s.errors[error]} />}
      {fileNote && <Notice tone="warning" message={fileNote} />}
      {pasting ? (
        <FormSection title={s.import.pasteTitle}>
          <TextField label={s.import.pasteLabel} placeholder={s.import.pastePlaceholder} value={pasted} onChangeText={setPasted} multiline />
          <Button title={s.import.useFile} variant="secondary" onPress={() => setPasting(false)} />
        </FormSection>
      ) : (
        <FormSection title={s.import.fileTitle} footer={s.import.fileFooter}>
          {file ? (
            <Card style={styles.card}>
              <ThemedText type="bodySemiBold" numberOfLines={2}>
                {file.name}
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">
                {s.import.size(Math.max(1, Math.round(file.size / 1024)))}
              </ThemedText>
            </Card>
          ) : null}
          <Button title={file ? s.import.chooseAnother : s.import.choose} icon="upload_file" variant={file ? 'secondary' : 'primary'} onPress={() => void choose()} />
          <Button title={s.import.pasteInstead} variant="ghost" onPress={() => setPasting(true)} />
        </FormSection>
      )}
      <ThemedText type="caption" themeColor="textSecondary">
        {s.import.privacy}
      </ThemedText>
    </Screen>
  );
}

function Summary({ merge }: { merge: Merge }) {
  const s = useLocalized(builderStrings);
  const lines = (
    [
      ['experience', merge.counts.experience],
      ['education', merge.counts.education],
      ['projects', merge.counts.projects],
      ['certifications', merge.counts.certifications],
      ['skills', merge.counts.skills],
      ['achievements', merge.counts.achievements],
    ] as const
  ).filter(([, count]) => count > 0);
  return (
    <View style={styles.summary}>
      {lines.length === 0 ? (
        <ThemedText type="secondary" themeColor="textSecondary">
          {s.import.nothingAdded}
        </ThemedText>
      ) : (
        lines.map(([key, count]) => (
          <ThemedText key={key} type="body">{`+ ${s.import.counts[key](count)}`}</ThemedText>
        ))
      )}
    </View>
  );
}

/** What Tali read, so the learner can tell at a glance whether it is their résumé. */
function FoundList({ content }: { content: ResumeContent }) {
  const s = useLocalized(builderStrings);
  return (
    <View style={styles.summary}>
      {ENTRY_SECTIONS.filter((section) => content[section].length > 0).map((section) => (
        <Card key={section} style={styles.card}>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.upper}>
            {s.import.sections[section]}
          </ThemedText>
          {content[section].slice(0, 5).map((entry) => (
            <ThemedText key={entry.id} type="body" numberOfLines={2}>
              {[entry.title, entry.organization].filter(Boolean).join(' · ')}
            </ThemedText>
          ))}
        </Card>
      ))}
      {content.skills.length > 0 && (
        <Card style={styles.card}>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.upper}>
            {s.import.sections.skills}
          </ThemedText>
          <ThemedText type="body">{content.skills.slice(0, 20).join(', ')}</ThemedText>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.one,
  },
  center: {
    textAlign: 'center',
  },
  summary: {
    gap: Spacing.two,
  },
  upper: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
