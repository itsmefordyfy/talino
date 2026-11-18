import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect, type ChipOption } from '@/components/ui/chip-select';
import { Notice } from '@/components/ui/notice';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { MAX_ARTIFACT_TITLE, useSaveArtifact, type ArtifactKind } from '@/features/architecture';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import { ARCHITECTURE_PROJECT_IDS } from './projects';
import { architectureToolStrings } from './strings';

export type SavePanelProps = {
  kind: ArtifactKind;
  /** Made once on the phone when the tool opens, so saving twice updates the same row. */
  id: string;
  /** What is saved: the diagram's Mermaid text or the matrix's JSON. */
  content: string;
  title: string;
  onTitleChange: (title: string) => void;
  projectId: string | null;
  onProjectChange: (projectId: string | null) => void;
  /** This id is already saved, so the button says "Save changes". */
  alreadySaved: boolean;
  /** Words for the limit message ("diagrams"). */
  kindName: string;
  heading: string;
  /** After a successful save, so the tool can treat what was saved as its starting point. */
  onSaved?: () => void;
};

/** Title, optional project and the Save button, with a clear message when the save is refused or fails. */
export function SavePanel({ kind, id, content, title, onTitleChange, projectId, onProjectChange, alreadySaved, kindName, heading, onSaved }: SavePanelProps) {
  const t = useLocalized(architectureToolStrings).common;
  const save = useSaveArtifact();
  const [message, setMessage] = useState<{ tone: 'success' | 'warning' | 'danger'; text: string } | null>(null);

  // A message belongs to the text it was about: once the work changes, it goes.
  const [seen, setSeen] = useState(content);
  if (seen !== content) {
    setSeen(content);
    setMessage(null);
  }

  const options: ChipOption<string>[] = [{ value: 'none', label: t.projectNone }, ...ARCHITECTURE_PROJECT_IDS.map((value, index) => ({ value, label: t.projects[index]!.label }))];

  const onSave = async () => {
    tapFeedback();
    setMessage(null);
    try {
      const result = await save.mutateAsync({ id, kind, title, content, projectId });
      if (result.ok) {
        setMessage({ tone: 'success', text: t.saved });
        onSaved?.();
      } else setMessage({ tone: 'warning', text: result.reason === 'limit' ? t.saveRefused.limit(kindName) : t.saveRefused[result.reason] });
    } catch {
      setMessage({ tone: 'danger', text: t.saveFailed });
    }
  };

  return (
    <View style={styles.root}>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {heading}
      </ThemedText>
      <TextField label={t.saveTitleLabel} hint={t.saveTitleHint} value={title} onChangeText={onTitleChange} maxLength={MAX_ARTIFACT_TITLE} returnKeyType="done" />
      <View style={styles.project}>
        <ThemedText type="secondarySemiBold" themeColor="textSecondary">
          {t.projectLabel}
        </ThemedText>
        <ChipSelect options={options} value={projectId ?? 'none'} onChange={(value) => onProjectChange(value === 'none' ? null : value)} wrap />
      </View>
      <Button title={alreadySaved ? t.saveChanges : t.save} icon="save" loading={save.isPending} onPress={() => void onSave()} />
      {message ? <Notice tone={message.tone} message={message.text} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three },
  project: { gap: Spacing.one },
});
