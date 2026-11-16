import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { Toggle } from '@/components/ui/toggle';
import { ListRow } from '@/components/ui/list-row';
import { SettingsGroup } from '@/components/ui/settings-group';
import { Spacing } from '@/constants/theme';
import { openPaywall } from '@/features/store';
import { tapFeedback } from '@/lib/haptics';
import { autoBackupToggled, selectAutoBackup } from '@/features/settings/settings-slice';
import { useLocalized } from '@/hooks/use-strings';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { createBackupContext, currentPlatform } from '../api/default-context';
import { listManualBackups } from '../api/manual-backups';
import { latestSafetySnapshot } from '../api/restore-flow';
import { ManualBackupsSection } from '../components/manual-backups-section';
import { RestoreReview } from '../components/restore-review';
import { StatusMessage, StatusRow } from '../components/status-card';
import { useBackupActions } from '../hooks/use-backup-actions';
import { useBackupAccess } from '../hooks/use-backup-access';
import { readAutoRestoreState, useCloudAvailability, useRunState } from '../hooks/use-backup-state';
import { backupQueryKeys } from '../hooks/query-keys';
import { deriveStatus, statusKey } from '../lib/status';
import { formatWhen } from '../lib/when';
import { backupStrings } from '../strings';

/**
 * Settings → Backup & Restore, laid out as Pawfetti's (owner, 2026-11-16): the intro line, the iCloud group (switch and status), Back up now and
 * Restore backup, then the Backup file group (Export and Import, Pro). No "Stored on this phone" or "What's stored" sections (owner's call).
 */
export function BackupScreen() {
  const strings = useLocalized(backupStrings);
  const db = useSQLiteContext();
  const dispatch = useAppDispatch();
  const enabled = useAppSelector(selectAutoBackup);
  const access = useBackupAccess();
  const platform = currentPlatform();
  const ios = platform === 'ios';
  const run = useRunState();
  const cloud = useCloudAvailability();
  const actions = useBackupActions();
  // These read files, not the database: a data write shouldn't refetch them (the same mark the store's queries use).
  const manual = useQuery({ queryKey: backupQueryKeys.manual, queryFn: () => listManualBackups(createBackupContext(db)), meta: { server: true }, enabled: access.manual, staleTime: Infinity });
  const safety = useQuery({ queryKey: backupQueryKeys.safety, queryFn: () => latestSafetySnapshot(createBackupContext(db)), meta: { server: true }, staleTime: Infinity });
  const restoreState = readAutoRestoreState();

  const info = deriveStatus({ platform, enabled, running: run.running, cloud: ios ? cloud : null, state: run.state });
  const key = statusKey(info, platform);
  const status = strings.auto.statuses[key];
  const detail = ios
    ? run.state.lastConfirmedAt
      ? strings.auto.lastConfirmed(formatWhen(run.state.lastConfirmedAt))
      : undefined
    : run.state.lastSnapshotAt
      ? strings.auto.lastSnapshot(formatWhen(run.state.lastSnapshotAt))
      : undefined;
  const lookedWithoutLuck = restoreState && restoreState.status !== 'pending' && restoreState.status !== 'none' && restoreState.status !== 'restored' ? restoreState.status : null;
  const working = actions.busy !== null;

  return (
    <Screen>
      <ThemedText type="secondary" themeColor="textSecondary">
        {strings.storage.body}
      </ThemedText>

      <SettingsGroup title={ios ? strings.auto.titleIos : strings.auto.titleAndroid} footer={ios ? strings.auto.iosHelpBody : strings.auto.androidHelpBody}>
        <ListRow
          title={ios ? strings.auto.switchIos : strings.auto.switchAndroid}
          titleLines={2}
          icon={ios ? 'cloud' : 'smartphone'}
          trailing={<Toggle value={enabled} onValueChange={(on) => dispatch(autoBackupToggled(on))} accessibilityLabel={ios ? strings.auto.switchIos : strings.auto.switchAndroid} />}
        />
        <StatusRow statusKey={key} title={status.title} body={status.body} detail={detail} />
      </SettingsGroup>

      <StatusMessage statusKey={key} body={status.body} />

      {lookedWithoutLuck && <Notice tone={lookedWithoutLuck === 'unreadable' || lookedWithoutLuck === 'failed' ? 'danger' : 'warning'} message={strings.auto.restoreFound[lookedWithoutLuck]} />}

      {actions.notice && <Notice tone={actions.notice.tone} message={actions.notice.title ? `${actions.notice.title}. ${actions.notice.message}` : actions.notice.message} />}

      {actions.review && (
        <RestoreReview preview={actions.review.preview} name={actions.review.name} busy={actions.busy === 'restore'} onMerge={() => void actions.restore('merge')} onReplace={actions.confirmReplace} onCancel={actions.cancelReview} />
      )}

      <View style={styles.stack}>
        <Button
          title={actions.busy === 'backup' ? strings.auto.working : ios ? strings.auto.backUpNow : strings.auto.saveSnapshotNow}
          icon="backup"
          onPress={() => void actions.backUpNow()}
          loading={actions.busy === 'backup'}
          disabled={working && actions.busy !== 'backup'}
        />
        {(ios || platform === 'android') && (
          <Button
            title={actions.busy === 'check' ? strings.auto.checking : ios ? strings.auto.checkCloud : strings.auto.checkCloudAndroid}
            icon="settings_backup_restore"
            variant="secondary"
            onPress={() => void actions.checkForBackup()}
            loading={actions.busy === 'check'}
            disabled={working && actions.busy !== 'check'}
          />
        )}
      </View>

      <ManualBackupsSection
        unlocked={access.manual}
        entries={manual.data}
        loading={manual.isPending && access.manual}
        failed={manual.isError}
        busy={actions.busy}
        canUndo={!!safety.data}
        onUnlock={() => {
          tapFeedback();
          void openPaywall('backup');
        }}
        onRetry={() => void manual.refetch()}
        onCreate={() => void actions.createManual()}
        onImport={() => void actions.importFile()}
        onExport={(entry) => void actions.exportEntry(entry)}
        onRestore={(entry) => void actions.startRestore(entry)}
        onDelete={actions.confirmDelete}
        onUndo={actions.confirmUndo}
      />

    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two },
});
