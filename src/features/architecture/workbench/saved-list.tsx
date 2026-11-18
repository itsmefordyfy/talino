import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Notice } from '@/components/ui/notice';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { Radius, Spacing } from '@/constants/theme';
import { useArtifacts, useDeleteArtifact, type Artifact, type ArtifactKind } from '@/features/architecture';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { activeLocale } from '@/lib/i18n';

import { projectShortName } from './projects';
import { architectureToolStrings } from './strings';

export type SavedListProps = {
  kind: ArtifactKind;
  heading: string;
  /** Said when nothing is saved yet. */
  emptyText: string;
  /** The id of the one open in the tool, marked "Open now". */
  activeId: string;
  onOpen: (artifact: Artifact) => void;
  /** After a delete, so the tool can start fresh if the open one went. */
  onDeleted: (id: string) => void;
};

const formatUpdated = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(activeLocale(), { month: 'short', day: 'numeric', year: 'numeric' });
};

/** What the learner saved, newest first, to open or delete (delete asks first). Loading, error and empty are each shown. */
export function SavedList({ kind, heading, emptyText, activeId, onOpen, onDeleted }: SavedListProps) {
  const t = useLocalized(architectureToolStrings).common;
  const theme = useTheme();
  const query = useArtifacts(kind);
  const remove = useDeleteArtifact();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const confirmDelete = async (artifact: Artifact) => {
    setFailed(false);
    try {
      await remove.mutateAsync(artifact.id);
      setConfirmingId(null);
      onDeleted(artifact.id);
    } catch {
      setFailed(true);
    }
  };

  let body;
  if (query.isPending) {
    body = (
      <View style={styles.list} accessibilityLabel={t.savedLoading} accessibilityState={{ busy: true }}>
        <SkeletonBlock height={64} />
        <SkeletonBlock height={64} />
      </View>
    );
  } else if (query.isError) {
    body = (
      <View style={styles.list}>
        <Notice tone="danger" message={t.savedLoadError} />
        <Button size="small" variant="secondary" icon="refresh" title={t.retry} onPress={() => void query.refetch()} />
      </View>
    );
  } else if (query.data.length === 0) {
    body = (
      <ThemedText type="secondary" themeColor="textSecondary">
        {emptyText}
      </ThemedText>
    );
  } else {
    body = (
      <View style={styles.list}>
        {query.data.map((artifact) => {
          const project = projectShortName(artifact.projectId);
          const details = [formatUpdated(artifact.updatedAt) && t.updated(formatUpdated(artifact.updatedAt)), project && t.attachedTo(project), artifact.id === activeId && t.editing].filter(Boolean).join(' · ');
          return (
            <View key={artifact.id} style={[styles.row, { backgroundColor: theme.backgroundElement, borderColor: artifact.id === activeId ? theme.primary : theme.border }]}>
              <ThemedText type="bodySemiBold" numberOfLines={2}>
                {artifact.title}
              </ThemedText>
              {details ? (
                <ThemedText type="secondary" themeColor="textSecondary">
                  {details}
                </ThemedText>
              ) : null}
              {confirmingId === artifact.id ? (
                <View style={styles.confirm} accessibilityLiveRegion="polite">
                  <ThemedText type="secondary">{t.deleteAsk(artifact.title)}</ThemedText>
                  <View style={styles.actions}>
                    <Button size="small" variant="danger" icon="delete" title={t.deleteYes} loading={remove.isPending} onPress={() => void confirmDelete(artifact)} />
                    <Button size="small" variant="outline" title={t.deleteKeep} onPress={() => setConfirmingId(null)} />
                  </View>
                  {failed ? <Notice tone="danger" message={t.deleteFailed} /> : null}
                </View>
              ) : (
                <View style={styles.actions}>
                  <Button size="small" variant="secondary" icon="folder_open" title={t.open} accessibilityLabel={t.openLabel(artifact.title)} onPress={() => onOpen(artifact)} />
                  <Button
                    size="small"
                    variant="ghost"
                    icon="delete"
                    title={t.delete}
                    accessibilityLabel={t.deleteLabel(artifact.title)}
                    onPress={() => {
                      setFailed(false);
                      setConfirmingId(artifact.id);
                    }}
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ThemedText type="cardTitle" accessibilityRole="header">
        {heading}
      </ThemedText>
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.two },
  list: { gap: Spacing.two },
  row: { gap: Spacing.one, padding: Spacing.three, borderRadius: Radius.medium, borderCurve: 'continuous', borderWidth: StyleSheet.hairlineWidth },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, alignItems: 'center' },
  confirm: { gap: Spacing.two },
});
