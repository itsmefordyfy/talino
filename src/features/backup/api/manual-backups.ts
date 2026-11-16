import { manualBackupName, isBackupFileName } from '../lib/files';
import { parseBackup, serializeBackup, type Backup, type BackupCounts, type ParseResult, type Platform } from '../lib/format';
import type { BackupContext, StoredFile } from './context';
import { createSnapshot } from './snapshot';

/** What the history shows of a file without restoring it. */
export type BackupHeader = { createdAt: string; appVersion: string; platform: Platform; label?: string; counts: BackupCounts; schemaVersion: number };

export type ManualBackupEntry = {
  file: StoredFile;
  /** Null: the file is damaged, from a newer Talino, or not a backup at all (shown with a Delete action). */
  header: BackupHeader | null;
  /** Why `header` is null. */
  problem: 'corrupted' | 'needs_newer_app' | 'not_a_backup' | null;
};

const headerOf = (backup: Backup): BackupHeader => ({ createdAt: backup.createdAt, appVersion: backup.appVersion, platform: backup.platform, ...(backup.label ? { label: backup.label } : {}), counts: backup.counts, schemaVersion: backup.schemaVersion });

/**
 * A backup file the learner asked for: written to `manual-backups/` (as many as they like), independent of the
 * automatic backup. Pro; the screen checks `useBackupAccess` before calling.
 */
export async function createManualBackup(ctx: BackupContext, label?: string): Promise<ManualBackupEntry> {
  const now = ctx.now();
  const snapshot = await createSnapshot(ctx.db, { settings: ctx.getSettings(), profileId: ctx.profileId, appVersion: ctx.appVersion, platform: ctx.platform, schemaVersion: ctx.schemaVersion, hash: ctx.hash, label: label?.trim() || undefined, now });
  const existing = (await ctx.fs.list('manual-backups')).map((file) => file.name);
  const file = await ctx.fs.write('manual-backups', manualBackupName(now, existing), serializeBackup(snapshot.backup));
  return { file, header: headerOf(snapshot.backup), problem: null };
}

const cache = new Map<string, ManualBackupEntry>();

/** The learner's backup files, newest first (by the date inside the file, else by when it was written). */
export async function listManualBackups(ctx: BackupContext): Promise<ManualBackupEntry[]> {
  const files = (await ctx.fs.list('manual-backups')).filter((file) => isBackupFileName(file.name));
  const entries: ManualBackupEntry[] = [];
  for (const file of files) {
    const key = `${file.uri}|${file.size}|${file.modified}`;
    let entry = cache.get(key);
    if (!entry) {
      const parsed = await parseBackup(await ctx.fs.read(file).catch(() => ''), ctx.hash, ctx.schemaVersion);
      entry = parsed.ok ? { file, header: headerOf(parsed.backup), problem: null } : { file, header: null, problem: parsed.reason === 'needs_newer_app' || parsed.reason === 'unsupported_version' ? 'needs_newer_app' : parsed.reason === 'not_a_backup' ? 'not_a_backup' : 'corrupted' };
      cache.set(key, entry);
    }
    entries.push(entry);
  }
  return entries.sort((a, b) => (b.header?.createdAt ?? new Date(b.file.modified).toISOString()).localeCompare(a.header?.createdAt ?? new Date(a.file.modified).toISOString()));
}

export async function deleteManualBackup(ctx: BackupContext, entry: ManualBackupEntry): Promise<void> {
  await ctx.fs.remove(entry.file);
  for (const key of [...cache.keys()]) if (key.startsWith(`${entry.file.uri}|`)) cache.delete(key);
}

/** Reads a backup file (a history entry, or one the learner picked) and checks it. Never throws. */
export async function readBackupFile(ctx: BackupContext, file: { uri: string }): Promise<ParseResult> {
  try {
    return await parseBackup(await ctx.fs.read(file), ctx.hash, ctx.schemaVersion);
  } catch {
    return { ok: false, reason: 'corrupted' };
  }
}
