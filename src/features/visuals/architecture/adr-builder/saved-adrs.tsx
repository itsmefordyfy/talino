import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Notice } from '@/components/ui/notice';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { Spacing } from '@/constants/theme';
import { useArtifacts, useDeleteArtifact, type Artifact } from '@/features/architecture';
import { parseAdrContent } from '@/features/architecture/lib/adr';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import { Panel } from '../../fundamentals/parts';
import { adrStrings } from '../../../architecture/adr/strings';

export type SavedAdrsProps = {
  /** The record open in the form, so deleting it can tell the form it is gone. */
  currentId: string;
  onOpen: (artifact: Artifact) => void;
  onDeleted: (id: string) => void;
};

/** The learner's saved records (loading, error, empty and list states), each with Open and Delete; deleting asks first. */
export function SavedAdrs({ currentId, onOpen, onDeleted }: SavedAdrsProps) {
  const t = useLocalized(adrStrings);
  const records = useArtifacts('adr');
  const remove = useDeleteArtifact();
  const [asking, setAsking] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const confirmDelete = async (id: string) => {
    tapFeedback();
    try {
      await remove.mutateAsync(id);
      setAsking(null);
      setFailed(false);
      onDeleted(id);
    } catch {
      setFailed(true);
    }
  };

  return (
    <Panel label={t.savedTitle}>
      {records.isPending ? (
        <View accessibilityState={{ busy: true }} style={styles.list}>
          <SkeletonBlock height={44} />
          <SkeletonBlock height={44} />
        </View>
      ) : records.isError ? (
        <View style={styles.list}>
          <Notice tone="danger" message={t.savedLoadError} />
          <Button size="small" variant="secondary" title={t.savedRetry} onPress={() => void records.refetch()} />
        </View>
      ) : records.data.length === 0 ? (
        <ThemedText type="secondary" themeColor="textSecondary">
          {t.savedEmpty}
        </ThemedText>
      ) : (
        <View style={styles.list}>
          {records.data.map((record) => {
            const draft = parseAdrContent(record.content);
            const title = record.title || t.savedUntitled;
            const meta = t.savedMeta(draft ? t.status[draft.status] : '', draft?.date ?? '');
            return (
              <View key={record.id} style={styles.item}>
                <View style={styles.itemRow}>
                  <View style={styles.itemText}>
                    <ThemedText type="bodySemiBold" numberOfLines={2}>
                      {title}
                    </ThemedText>
                    <ThemedText type="secondary" themeColor="textSecondary">
                      {record.projectId && t.project[record.projectId] ? `${meta} · ${t.savedProject(t.project[record.projectId]!)}` : meta}
                      {record.id === currentId ? ` · ${t.editing}` : ''}
                    </ThemedText>
                  </View>
                  <View style={styles.itemButtons}>
                    <Button
                      size="small"
                      variant="secondary"
                      title={t.open}
                      accessibilityLabel={t.savedOpen(title)}
                      onPress={() => {
                        tapFeedback();
                        setAsking(null);
                        onOpen(record);
                      }}
                    />
                    <Button size="small" variant="danger" icon="delete" title={t.delete} accessibilityLabel={t.savedDelete(title)} onPress={() => setAsking(record.id)} />
                  </View>
                </View>
                {asking === record.id ? (
                  <Notice tone="warning">
                    <ThemedText type="secondary">{t.deleteAsk(title)}</ThemedText>
                    <View style={styles.itemButtons}>
                      <Button size="small" variant="danger" title={t.deleteYes} loading={remove.isPending} onPress={() => void confirmDelete(record.id)} />
                      <Button size="small" variant="outline" title={t.deleteKeep} onPress={() => setAsking(null)} />
                    </View>
                  </Notice>
                ) : null}
              </View>
            );
          })}
          {failed ? <Notice tone="danger" message={t.deleteFailed} /> : null}
        </View>
      )}
    </Panel>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.three },
  item: { gap: Spacing.two },
  itemRow: { gap: Spacing.two },
  itemText: { gap: 2 },
  itemButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
