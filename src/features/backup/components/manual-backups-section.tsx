import { useState } from 'react';

import { ActionSheet, type ActionSheetOption } from '@/components/ui/action-sheet';
import { ListRow } from '@/components/ui/list-row';
import { ProBadge } from '@/components/ui/pro-badge';
import { SettingsGroup } from '@/components/ui/settings-group';
import { ThemedText } from '@/components/themed-text';
import { useLocalized } from '@/hooks/use-strings';

import type { ManualBackupEntry } from '../api/manual-backups';
import { describeEntry, type Busy } from '../hooks/use-backup-actions';
import { formatWhen } from '../lib/when';
import { backupStrings } from '../strings';

export type ManualBackupsSectionProps = {
  /** Pro: the manual backup file is open. */
  unlocked: boolean;
  entries: ManualBackupEntry[] | undefined;
  loading: boolean;
  failed: boolean;
  busy: Busy;
  canUndo: boolean;
  /** Free: the way to the store. */
  onUnlock: () => void;
  onRetry: () => void;
  onCreate: () => void;
  onImport: () => void;
  onExport: (entry: ManualBackupEntry) => void;
  onRestore: (entry: ManualBackupEntry) => void;
  onDelete: (entry: ManualBackupEntry) => void;
  onUndo: () => void;
};

/**
 * Backup files (Pro), laid out as Pawfetti's file group: Create and Import as rows of one grouped card with the
 * footer under it, the files you made as a second group (a tap opens Export / Restore / Delete), and a Pro badge on
 * the row that opens the store for a learner who hasn't unlocked it.
 */
export function ManualBackupsSection({ unlocked, entries, loading, failed, busy, canUndo, onUnlock, onRetry, onCreate, onImport, onExport, onRestore, onDelete, onUndo }: ManualBackupsSectionProps) {
  const strings = useLocalized(backupStrings);
  const text = strings.manual;
  const working = busy !== null;
  // The entry the sheet is about stays set while the sheet fades out, so its card never empties mid-fade.
  const [picked, setPicked] = useState<ManualBackupEntry | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!unlocked) {
    // Both rows show for Free too (as Pawfetti's group does), each with the Pro badge and the way to the store.
    return (
      <SettingsGroup title={text.title} footer={text.lockedBody}>
        <ListRow icon="save" title={text.create} trailing={<ProBadge label={text.proBadge} />} showChevron={false} accessibilityLabel={`${text.create}, ${text.proBadge}`} onPress={onUnlock} />
        <ListRow icon="upload_file" title={text.import} trailing={<ProBadge label={text.proBadge} />} showChevron={false} accessibilityLabel={`${text.import}, ${text.proBadge}`} onPress={onUnlock} />
      </SettingsGroup>
    );
  }

  const newest = entries?.find((entry) => entry.header);
  const options: ActionSheetOption[] = picked
    ? [
        ...(picked.header ? [{ label: text.export, icon: 'ios_share' as const, onPress: () => onExport(picked) }, { label: text.restore, icon: 'restore' as const, onPress: () => onRestore(picked) }] : []),
        { label: strings.delete, icon: 'delete' as const, destructive: true, onPress: () => onDelete(picked) },
      ]
    : [];

  return (
    <>
      <SettingsGroup title={text.title} footer={text.proNote}>
        <ListRow
          icon="save"
          title={busy === 'create' ? text.creating : text.create}
          subtitle={newest?.header ? text.lastBackup(formatWhen(newest.header.createdAt)) : undefined}
          onPress={working ? undefined : onCreate}
        />
        <ListRow icon="upload_file" title={busy === 'import' ? text.importing : text.import} onPress={working ? undefined : onImport} />
        {canUndo && <ListRow icon="undo" title={text.undo} onPress={working ? undefined : onUndo} />}
      </SettingsGroup>

      <SettingsGroup title={text.history}>
        {loading ? (
          <ListRow icon="history" title="…" />
        ) : failed ? (
          <ListRow icon="error" title={strings.loadFailed} titleLines={2} subtitle={strings.retry} onPress={onRetry} />
        ) : !entries || entries.length === 0 ? (
          <ListRow icon="description" title={text.emptyHistory} titleLines={2} />
        ) : (
          entries.map((entry) => (
            <HistoryRow
              key={entry.file.uri}
              entry={entry}
              onPress={
                working
                  ? undefined
                  : () => {
                      setPicked(entry);
                      setSheetOpen(true);
                    }
              }
            />
          ))
        )}
      </SettingsGroup>

      <ActionSheet visible={sheetOpen} title={picked ? describeEntry(strings, picked).title : undefined} options={options} onClose={() => setSheetOpen(false)} />
    </>
  );
}

type HistoryRowProps = { entry: ManualBackupEntry; onPress: (() => void) | undefined };

function HistoryRow({ entry, onPress }: HistoryRowProps) {
  const strings = useLocalized(backupStrings);
  const text = strings.manual;
  const { title, subtitle } = describeEntry(strings, entry);
  const header = entry.header;
  const problem = entry.problem === 'needs_newer_app' ? text.newerBody : entry.problem === 'not_a_backup' ? text.notBackupBody : text.damagedBody;
  return (
    <ListRow
      icon={header ? 'description' : 'error'}
      title={header ? title : text.damaged}
      subtitle={header ? subtitle : problem}
      detail={
        header ? (
          <ThemedText type="caption" themeColor="textSecondary">
            {text.counts(header.counts.lessons, header.counts.activities)}
          </ThemedText>
        ) : undefined
      }
      onPress={onPress}
    />
  );
}
