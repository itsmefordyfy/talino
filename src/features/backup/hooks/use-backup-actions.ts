import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert } from 'react-native';

import { invalidateLocalQueries } from '@/db/invalidate';
import { reportError } from '@/lib/monitoring';

import { runAutoBackup } from '../api/auto-backup';
import { createBackupContext, currentPlatform } from '../api/default-context';
import { findNewestValidBackup } from '../api/find-backup';
import { exportBackupFile, pickBackupFile } from '../api/import-export';
import { createManualBackup, deleteManualBackup, readBackupFile, type ManualBackupEntry } from '../api/manual-backups';
import { previewRestore, type RestoreMode, type RestorePreview } from '../api/restore';
import { restoreWithSafety, undoLastRestore } from '../api/restore-flow';
import type { Backup, ParseFailure } from '../lib/format';
import { backupStrings, type BackupStrings } from '../strings';
import { useLocalized } from '@/hooks/use-strings';
import { formatWhen } from '../lib/when';
import { formatBytes } from '../lib/files';
import { backupQueryKeys } from './query-keys';

export type Notice = { tone: 'success' | 'info' | 'warning' | 'danger'; title?: string; message: string };
export type Review = { backup: Backup; preview: RestorePreview; name: string };
export type Busy = null | 'backup' | 'create' | 'delete' | 'import' | 'check' | 'restore' | 'undo' | 'export';

/** The screen's actions and the state they share (what is running, the message to show, the restore under review). Each makes its own context when it runs. */
export function useBackupActions() {
  const strings = useLocalized(backupStrings);
  const db = useSQLiteContext();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState<Busy>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [review, setReview] = useState<Review | null>(null);

  const refreshLists = async () => {
    await queryClient.invalidateQueries({ queryKey: backupQueryKeys.all });
  };

  const problem = (reason: ParseFailure) => {
    const text = strings.problems[reason];
    setNotice({ tone: 'danger', title: text.title, message: text.body });
  };

  const guard = async (kind: Exclude<Busy, null>, task: () => Promise<void>, failure?: string) => {
    if (busy) return;
    setBusy(kind);
    setNotice(null);
    try {
      await task();
    } catch (error) {
      reportError(error, 'app', { step: `backup-${kind}` });
      setNotice({ tone: 'danger', message: failure ?? strings.auto.failedNow });
    } finally {
      setBusy(null);
    }
  };

  const openReview = async (backup: Backup, name: string) => {
    const preview = await previewRestore(db, backup, { profileId: createBackupContext(db).profileId });
    setReview({ backup, preview, name });
  };

  const restore = (mode: RestoreMode) =>
    guard(
      'restore',
      async () => {
        if (!review) return;
        const result = await restoreWithSafety(createBackupContext(db), review.backup, mode, 'manual');
        await invalidateLocalQueries(queryClient);
        await refreshLists();
        setReview(null);
        const { newRows, updatedRows } = result.summary;
        setNotice({ tone: 'success', message: mode === 'merge' && newRows + updatedRows === 0 ? strings.review.doneNothing : strings.review.done(newRows, updatedRows) });
      },
      strings.review.failed,
    );

  return {
    busy,
    notice,
    review,
    dismissNotice: () => setNotice(null),
    cancelReview: () => setReview(null),

    backUpNow: () =>
      guard('backup', async () => {
        const outcome = await runAutoBackup(createBackupContext(db), { force: true });
        const ios = currentPlatform() === 'ios';
        if (outcome === 'synced') setNotice({ tone: 'success', message: strings.auto.doneIos });
        else if (outcome === 'saved') setNotice({ tone: ios ? 'info' : 'success', message: ios ? strings.auto.statuses.disabled_signed_out.body : strings.auto.doneAndroid });
        else if (outcome === 'empty') setNotice({ tone: 'info', message: strings.auto.emptyNothing });
        else if (outcome === 'queued') setNotice({ tone: 'warning', message: strings.auto.queuedNow });
        else setNotice({ tone: 'danger', message: strings.auto.failedNow });
      }),

    createManual: (label?: string) =>
      guard(
        'create',
        async () => {
          const entry = await createManualBackup(createBackupContext(db), label);
          await refreshLists();
          setNotice({ tone: 'success', message: strings.manual.created(entry.file.name) });
          // "Export backup file" (as in Pawfetti): the file is made and the share sheet opens on it straight away; it stays listed under Your backup files.
          if (!(await exportBackupFile(entry.file))) setNotice({ tone: 'warning', message: strings.manual.shareUnavailable });
        },
        strings.manual.createFailed,
      ),

    startRestore: (entry: ManualBackupEntry) =>
      guard('restore', async () => {
        const parsed = await readBackupFile(createBackupContext(db), entry.file);
        if (!parsed.ok) return problem(parsed.reason);
        await openReview(parsed.backup, entry.file.name);
      }),

    importFile: () =>
      guard('import', async () => {
        const picked = await pickBackupFile(createBackupContext(db));
        if (picked.kind === 'cancelled') return;
        if (picked.kind === 'unavailable') return setNotice({ tone: 'danger', message: strings.manual.shareUnavailable });
        if (!picked.result.ok) return problem(picked.result.reason);
        await openReview(picked.result.backup, picked.name);
      }),

    checkForBackup: () =>
      guard('check', async () => {
        const found = await findNewestValidBackup(createBackupContext(db));
        if (found.kind === 'found') return openReview(found.backup, found.name);
        if (found.kind === 'none') return setNotice({ tone: 'info', message: strings.auto.nothingFound });
        if (found.kind === 'needs_account') return setNotice({ tone: 'warning', message: strings.auto.restoreFound.needs_account });
        if (found.kind === 'needs_newer_app') return setNotice({ tone: 'warning', message: strings.auto.restoreFound.needs_newer_app });
        setNotice({ tone: 'danger', message: strings.auto.restoreFound.unreadable });
      }),

    exportEntry: (entry: ManualBackupEntry) =>
      guard(
        'export',
        async () => {
          if (!(await exportBackupFile(entry.file))) setNotice({ tone: 'warning', message: strings.manual.shareUnavailable });
        },
        strings.manual.exportFailed,
      ),

    confirmDelete: (entry: ManualBackupEntry) =>
      Alert.alert(strings.manual.deleteTitle, strings.manual.deleteBody, [
        { text: strings.cancel, style: 'cancel' },
        {
          text: strings.delete,
          style: 'destructive',
          onPress: () => {
            void guard('delete', async () => {
              await deleteManualBackup(createBackupContext(db), entry);
              await refreshLists();
            });
          },
        },
      ]),

    restore,

    confirmReplace: () => {
      if (!review) return;
      Alert.alert(strings.review.replaceTitle, strings.review.replaceBody(review.preview.wouldReplace.lostRows), [
        { text: strings.review.cancel, style: 'cancel' },
        { text: strings.review.replaceConfirm, style: 'destructive', onPress: () => void restore('replace') },
      ]);
    },

    confirmUndo: () =>
      Alert.alert(strings.manual.undoTitle, strings.manual.undoBody, [
        { text: strings.cancel, style: 'cancel' },
        {
          text: strings.manual.undoConfirm,
          style: 'destructive',
          onPress: () => {
            void guard(
              'undo',
              async () => {
                const result = await undoLastRestore(createBackupContext(db));
                await invalidateLocalQueries(queryClient);
                await refreshLists();
                setNotice(result.ok ? { tone: 'success', message: strings.manual.undone } : { tone: 'danger', message: strings.manual.undoFailed });
              },
              strings.manual.undoFailed,
            );
          },
        },
      ]),
  };
}

/** For the history rows. */
export function describeEntry(strings: BackupStrings, entry: ManualBackupEntry) {
  const header = entry.header;
  return {
    title: header?.label ?? formatWhen(header?.createdAt ?? new Date(entry.file.modified).toISOString()),
    subtitle: header ? `${formatWhen(header.createdAt)} · ${strings.manual.detail(header.appVersion, formatBytes(entry.file.size))}` : formatBytes(entry.file.size),
  };
}
