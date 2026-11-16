import { Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { FormActions } from '@/components/ui/form-actions';
import { FormSection } from '@/components/ui/form-section';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { ErrorState, LoadingState, NotFoundState } from '@/components/ui/state-view';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useLocalized, useStrings } from '@/hooks/use-strings';
import { successFeedback } from '@/lib/haptics';
import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';
import { closeScreen } from '@/lib/navigation';

import { pickScreenshots } from '../api/pick-image';
import { ScreenshotStrip } from '../components/screenshot-strip';
import { TaliProjectHelp } from '../components/tali-project-help';
import { useDeleteProject, useProject, useSaveProject } from '../hooks/use-projects';
import { MAX_PROJECT_IMAGES, parseTech, techText, type PortfolioProject } from '../lib/projects';
import { projectStrings } from '../project-strings';

export type ProjectScreenProps = {
  /** Editing this project; a new one when absent. */
  id?: string;
};

/** Add or edit one of the learner's own portfolio projects: details, links and screenshots. */
export function ProjectScreen({ id }: ProjectScreenProps) {
  if (!id) return <ProjectForm initial={null} />;
  return <EditProject id={id} />;
}

function EditProject({ id }: { id: string }) {
  const strings = useLocalized(projectStrings);
  const project = useProject(id);
  // Kept once loaded, so deleting it doesn't flash "gone" while the screen closes.
  const [loaded, setLoaded] = useState<PortfolioProject | null>(null);
  if (project.data && loaded?.id !== project.data.id) setLoaded(project.data);
  const row = project.data ?? loaded;
  if (row) return <ProjectForm key={row.id} initial={row} />;
  if (project.isPending) return <LoadingState />;
  if (project.isError) return <ErrorState message={strings.loadError} onRetry={() => void project.refetch()} />;
  return <NotFoundState icon="folder_open" title={strings.notFound} message={strings.notFoundBody} />;
}

function ProjectForm({ initial }: { initial: PortfolioProject | null }) {
  const strings = useLocalized(projectStrings);
  const common = useStrings().common;
  const save = useSaveProject();
  const remove = useDeleteProject();
  // Made when the form opens: a second tap on Save updates this row instead of adding another.
  const [id] = useState(() => initial?.id ?? newId());
  const [title, setTitle] = useState(initial?.title ?? '');
  const [summary, setSummary] = useState(initial?.summary ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [role, setRole] = useState(initial?.role ?? '');
  const [tech, setTech] = useState(techText(initial?.tech ?? []));
  const [url, setUrl] = useState(initial?.url ?? '');
  const [repoUrl, setRepoUrl] = useState(initial?.repoUrl ?? '');
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [picking, setPicking] = useState(false);
  const [pickError, setPickError] = useState<string | null>(null);
  const [tried, setTried] = useState(false);
  const busy = save.isPending || remove.isPending;
  const titleError = tried && title.trim() === '' ? strings.titleRequired : null;

  const add = async () => {
    if (picking) return;
    setPicking(true);
    setPickError(null);
    try {
      const picked = await pickScreenshots(MAX_PROJECT_IMAGES - images.length);
      if (picked.kind === 'images') {
        // Added after what is there, in the order chosen; the cap is checked again against the latest list.
        setImages((current) => [...current, ...picked.images].slice(0, MAX_PROJECT_IMAGES));
        if (picked.skipped > 0) setPickError(strings.someSkipped(picked.skipped));
      } else if (picked.kind === 'too_big' || picked.kind === 'failed' || picked.kind === 'unavailable') setPickError(strings.shotErrors[picked.kind]);
    } finally {
      setPicking(false);
    }
  };

  const open = (index: number) =>
    Alert.alert(strings.shotOptions, undefined, [
      ...(index > 0 ? [{ text: strings.makeCover, onPress: () => setImages((current) => [current[index], ...current.filter((_, at) => at !== index)]) }] : []),
      { text: strings.removeShot, style: 'destructive' as const, onPress: () => setImages((current) => current.filter((_, at) => at !== index)) },
      { text: common.cancel, style: 'cancel' as const },
    ]);

  const submit = () => {
    setTried(true);
    if (title.trim() === '' || busy) return;
    save.mutate(
      { id, title, summary, description, role, tech: parseTech(tech), url, repoUrl, images },
      {
        onSuccess: () => {
          successFeedback();
          closeScreen();
        },
        onError: (error) => reportError(error, 'portfolio', { action: 'save-project' }),
      },
    );
  };

  const confirmDelete = () =>
    Alert.alert(strings.deleteConfirm, strings.deleteConfirmBody, [
      { text: common.cancel, style: 'cancel' },
      {
        text: common.delete,
        style: 'destructive',
        onPress: () =>
          remove.mutate(id, {
            onSuccess: closeScreen,
            onError: (error) => reportError(error, 'portfolio', { action: 'delete-project' }),
          }),
      },
    ]);

  const footer = (
    <FormActions>
      <Button title={save.isPending ? common.saving : common.save} loading={save.isPending} disabled={busy} onPress={submit} />
      {initial && <Button title={strings.delete} variant="danger" disabled={busy} onPress={confirmDelete} />}
    </FormActions>
  );

  return (
    <Screen footer={footer} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: initial ? strings.editTitle : strings.newTitle }} />
      {(save.isError || remove.isError) && <Notice tone="warning" message={strings.saveFailed} />}
      {pickError && <Notice tone="warning" message={pickError} />}
      <View style={styles.shots}>
        <ThemedText type="caption" themeColor="textSecondary" style={styles.shotsTitle} accessibilityRole="header">
          {strings.shotsGroup}
        </ThemedText>
        <ScreenshotStrip images={images} onAdd={() => void add()} onOpen={open} busy={picking} labels={{ add: strings.addShot, adding: strings.addingShots, cover: strings.cover, shot: strings.shotLabel }} />
        <ThemedText type="caption" themeColor="textSecondary" style={styles.shotsFooter}>
          {strings.shotsFooter}
        </ThemedText>
      </View>
      <TaliProjectHelp id={id} title={title} role={role} tech={tech} notes={description || summary} onSummary={setSummary} onStory={setDescription} />
      <FormSection title={strings.aboutGroup}>
        <TextField label={strings.titleLabel} placeholder={strings.titlePlaceholder} value={title} onChangeText={setTitle} error={titleError} autoCapitalize="words" maxLength={100} />
        <TextField label={strings.summaryLabel} placeholder={strings.summaryPlaceholder} hint={strings.summaryHint} value={summary} onChangeText={setSummary} autoCapitalize="sentences" maxLength={300} multiline />
        <TextField label={strings.descriptionLabel} placeholder={strings.descriptionPlaceholder} value={description} onChangeText={setDescription} autoCapitalize="sentences" maxLength={1500} multiline />
        <TextField label={strings.roleLabel} placeholder={strings.rolePlaceholder} value={role} onChangeText={setRole} autoCapitalize="sentences" maxLength={80} />
        <TextField label={strings.techLabel} placeholder={strings.techPlaceholder} hint={strings.techHint} value={tech} onChangeText={setTech} autoCapitalize="words" autoCorrect={false} />
      </FormSection>
      <FormSection title={strings.linksGroup} footer={strings.linksFooter}>
        <TextField label={strings.liveLabel} placeholder="example.com" value={url} onChangeText={setUrl} keyboardType="url" autoCapitalize="none" autoCorrect={false} />
        <TextField label={strings.repoLabel} placeholder="github.com/you/project" value={repoUrl} onChangeText={setRepoUrl} keyboardType="url" autoCapitalize="none" autoCorrect={false} />
      </FormSection>
    </Screen>
  );
}

const styles = StyleSheet.create({
  shots: {
    gap: Spacing.two,
  },
  shotsTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.three,
  },
  shotsFooter: {
    paddingHorizontal: Spacing.three,
  },
});
