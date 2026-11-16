import { AUTO_PREFIX, KEEP_SAFETY, namesToPrune, safetyBackupName, SAFETY_PREFIX } from '../lib/files';
import type { StoredFile, BackupContext } from './context';
import { createSnapshot } from './snapshot';

/** The snapshot files in `backups/`: the automatic ones (newest first) and the safety copies written before a restore (newest first). */
export async function listLocalSnapshots(ctx: BackupContext): Promise<{ automatic: StoredFile[]; safety: StoredFile[] }> {
  const files = await ctx.fs.list('backups');
  const byNameDesc = (a: StoredFile, b: StoredFile) => b.name.localeCompare(a.name);
  return {
    automatic: files.filter((file) => file.name.startsWith(AUTO_PREFIX)).sort(byNameDesc),
    safety: files.filter((file) => file.name.startsWith(SAFETY_PREFIX)).sort(byNameDesc),
  };
}

/**
 * Before a restore changes anything, the data as it is now is written to `backups/before-restore-<time>.talino-backup`
 * (the last few stay), so the restore can be undone. Returns the file.
 */
export async function writeSafetySnapshot(ctx: BackupContext): Promise<StoredFile> {
  const now = ctx.now();
  const snapshot = await createSnapshot(ctx.db, { settings: ctx.getSettings(), profileId: ctx.profileId, appVersion: ctx.appVersion, platform: ctx.platform, schemaVersion: ctx.schemaVersion, hash: ctx.hash, label: 'Before a restore', now });
  const file = await ctx.fs.write('backups', safetyBackupName(now), snapshot.text);
  const { safety } = await listLocalSnapshots(ctx);
  const drop = new Set(namesToPrune(safety.map((item) => item.name), KEEP_SAFETY));
  for (const item of safety) if (drop.has(item.name)) await ctx.fs.remove(item);
  return file;
}

/** Delete all data also removes the snapshots on the phone (and the memory of the last run): they are the learner's data too. Files the learner made themselves (manual backups) and copies in iCloud stay. */
export async function clearLocalSnapshots(ctx: BackupContext): Promise<void> {
  const { automatic, safety } = await listLocalSnapshots(ctx);
  for (const file of [...automatic, ...safety]) await ctx.fs.remove(file).catch(() => undefined);
  ctx.runState.reset();
}
