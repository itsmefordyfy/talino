import { MAX_BACKUP_BYTES, parseBackup, type ParseResult } from '../lib/format';
import type { BackupContext } from './context';

/**
 * Sharing and picking backup files. The native modules are loaded when the action runs, not when the screen opens,
 * so a build without them still shows the screen and only the action says it can't.
 */

/** Opens the share sheet for a backup file, so it can be saved to iCloud Drive, Google Drive, Files or sent anywhere. False when sharing isn't available. */
export async function exportBackupFile(file: { uri: string; name: string }): Promise<boolean> {
  const Sharing = await import('expo-sharing');
  if (!(await Sharing.isAvailableAsync())) return false;
  // The extension has no registered type, so the generic ones: the file is plain text (JSON) and keeps its name.
  await Sharing.shareAsync(file.uri, { mimeType: 'application/octet-stream', UTI: 'public.data', dialogTitle: file.name });
  return true;
}

export type PickedBackup = { kind: 'cancelled' } | { kind: 'unavailable' } | { kind: 'read'; result: ParseResult; name: string };

/**
 * The system file picker, for a `.talino-backup` file from iCloud Drive, Google Drive or storage. Any file type is
 * allowed (the extension has no registered type), so what comes back is checked like any other file: too big,
 * not a Talino backup, damaged, or from a newer app are reasons, never a crash. The cache copy is deleted after.
 */
export async function pickBackupFile(ctx: BackupContext): Promise<PickedBackup> {
  let DocumentPicker: typeof import('expo-document-picker');
  try {
    DocumentPicker = await import('expo-document-picker');
  } catch {
    return { kind: 'unavailable' };
  }
  const picked = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true, multiple: false });
  if (picked.canceled || picked.assets.length === 0) return { kind: 'cancelled' };
  const asset = picked.assets[0];
  try {
    const size = ctx.fs.sizeOf(asset.uri) ?? asset.size ?? 0;
    if (size > MAX_BACKUP_BYTES) return { kind: 'read', name: asset.name, result: { ok: false, reason: 'too_large' } };
    const text = await ctx.fs.read({ uri: asset.uri }).catch(() => null);
    if (text === null) return { kind: 'read', name: asset.name, result: { ok: false, reason: 'corrupted' } };
    return { kind: 'read', name: asset.name, result: await parseBackup(text, ctx.hash, ctx.schemaVersion) };
  } finally {
    await ctx.fs.remove({ uri: asset.uri }).catch(() => undefined);
  }
}
