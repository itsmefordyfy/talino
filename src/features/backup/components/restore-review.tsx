import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import type { RestorePreview } from '../api/restore';
import { TABLE_NAMES } from '../lib/schema';
import { formatWhen } from '../lib/when';
import { backupStrings } from '../strings';

export type RestoreReviewProps = {
  preview: RestorePreview;
  name: string;
  busy: boolean;
  onMerge: () => void;
  onReplace: () => void;
  onCancel: () => void;
};

/**
 * What a restore would do, read before anything is written (a dry run of the real merge): what the backup holds,
 * how many items it would add, move forward, keep as they are here, or remove because they were deleted elsewhere.
 * Merge is the safe default; Replace asks again and names what would be lost.
 */
export function RestoreReview({ preview, name, busy, onMerge, onReplace, onCancel }: RestoreReviewProps) {
  const strings = useLocalized(backupStrings);
  const text = strings.review;
  const lines = [
    preview.newRows > 0 && text.newRows(preview.newRows),
    preview.updatedRows > 0 && text.updatedRows(preview.updatedRows),
    preview.removedRows > 0 && text.removedRows(preview.removedRows),
    preview.keptLocal > 0 && text.keptLocal(preview.keptLocal),
    preview.unchanged > 0 && text.unchanged(preview.unchanged),
  ].filter((line): line is string => line !== false);
  const touched = TABLE_NAMES.filter((table) => (preview.byTable[table]?.newRows ?? 0) + (preview.byTable[table]?.updatedRows ?? 0) + (preview.byTable[table]?.removedRows ?? 0) > 0);
  const holds = [
    [strings.storage.lessons, preview.counts.lessons],
    [strings.storage.activities, preview.counts.activities],
    [strings.storage.projects, preview.counts.projects],
    [strings.storage.career, preview.counts.applications + preview.counts.income + preview.counts.goals + preview.counts.resumeItems],
    [strings.storage.badges, preview.counts.badges],
  ] as const;

  return (
    <Card accessibilityLabel={text.title} style={styles.card}>
      <ThemedText type="section" accessibilityRole="header">
        {text.title}
      </ThemedText>
      <View style={styles.block}>
        <ThemedText type="bodySemiBold">{preview.label ?? name}</ThemedText>
        <ThemedText type="secondary" themeColor="textSecondary">
          {text.from(formatWhen(preview.createdAt))}
        </ThemedText>
        <ThemedText type="secondary" themeColor="textSecondary">
          {text.source(preview.appVersion || '1', text.platforms[preview.platform])}
        </ThemedText>
        <ThemedText type="secondary" themeColor="textSecondary">
          {preview.sameProfile ? text.samePhone : text.otherPhone}
        </ThemedText>
      </View>
      <View style={styles.block}>
        <ThemedText type="secondarySemiBold">{text.holds}</ThemedText>
        {holds.map(([label, value]) => (
          <View key={label} style={styles.line}>
            <ThemedText type="secondary" themeColor="textSecondary">
              {label}
            </ThemedText>
            <ThemedText type="secondarySemiBold" tabular>
              {value}
            </ThemedText>
          </View>
        ))}
      </View>
      {preview.nothingToRestore ? (
        <Notice tone="info" message={text.nothing} />
      ) : (
        <View style={styles.block}>
          {lines.map((line) => (
            <ThemedText key={line} type="body">
              {line}
            </ThemedText>
          ))}
          {touched.length > 0 && (
            <ThemedText type="caption" themeColor="textSecondary">
              {touched.map((table) => text.tables[table]).join(' · ')}
            </ThemedText>
          )}
        </View>
      )}
      <ThemedText type="caption" themeColor="textSecondary">
        {text.mergeNote} {text.tali}
      </ThemedText>
      <View style={styles.actions}>
        <Button title={text.merge} onPress={onMerge} loading={busy} disabled={preview.nothingToRestore} />
        <Button title={text.replace} variant="danger" onPress={onReplace} disabled={busy} />
        <Button title={text.cancel} variant="ghost" onPress={onCancel} disabled={busy} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three },
  block: { gap: Spacing.one },
  line: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.three },
  actions: { gap: Spacing.two },
});
