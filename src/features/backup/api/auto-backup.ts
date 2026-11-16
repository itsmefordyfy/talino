import { autoBackupName, AUTO_PREFIX, entriesToPrune, KEEP_CLOUD, KEEP_LOCAL_AUTO, namesToPrune } from '../lib/files';
import { CloudError, type CloudBackupEntry } from '../cloud/types';
import type { BackupErrorCode } from '../lib/run-state';
import type { BackupContext } from './context';
import { createSnapshot } from './snapshot';

/** How long a run waits for iCloud to confirm an upload before it calls it queued; checked this often. */
export const UPLOAD_CONFIRM_MS = 60_000;
export const UPLOAD_POLL_MS = 2_000;

export type RunOutcome = 'disabled' | 'empty' | 'saved' | 'synced' | 'queued' | 'failed';

/**
 * iCloud copies a handed-over file into its container and uploads it later, so handing it over is not a
 * backup yet: wait for the confirmation. `queued` after the wait means it is still going (offline, or slow),
 * which is shown as waiting, never as done.
 */
async function confirmUploaded(ctx: BackupContext, name: string): Promise<void> {
  const deadline = ctx.now().getTime() + UPLOAD_CONFIRM_MS;
  for (;;) {
    const status = await ctx.provider.confirmUpload(name);
    if (status === 'uploaded') return;
    if (status === 'full') throw new CloudError('full');
    if (status === 'failed') throw new CloudError('failed');
    if (ctx.now().getTime() >= deadline) throw new CloudError('queued');
    await ctx.wait(UPLOAD_POLL_MS);
  }
}

async function pruneLocal(ctx: BackupContext): Promise<void> {
  const files = await ctx.fs.list('backups');
  const autos = files.filter((file) => file.name.startsWith(AUTO_PREFIX));
  const drop = new Set(namesToPrune(autos.map((file) => file.name), KEEP_LOCAL_AUTO));
  for (const file of autos) if (drop.has(file.name)) await ctx.fs.remove(file);
}

async function pruneCloud(ctx: BackupContext): Promise<void> {
  // Only the newest few stay; one that can't be removed is no harm.
  const entries = await ctx.provider.list().catch(() => [] as CloudBackupEntry[]);
  for (const old of entriesToPrune(entries, KEEP_CLOUD)) await ctx.provider.remove(old);
}

const codeOf = (error: unknown): BackupErrorCode => (error instanceof CloudError ? error.code : 'failed');

let running: Promise<RunOutcome> | null = null;

/**
 * One automatic backup, start to finish; a second call while one runs waits for it. A snapshot of the learner's
 * data is written to `backups/` on the phone (the folder Android's Auto Backup carries; the newest few stay) and,
 * on iPhone, uploaded to iCloud and confirmed before anything says "backed up". An empty phone is never
 * backed up (it would only push real backups out of the newest few). `force` is the Back up now button: it runs with the switch off. A failure is remembered for the screen
 * and retried by the next change or launch; it never blocks learning.
 */
export function runAutoBackup(ctx: BackupContext, options: { force?: boolean } = {}): Promise<RunOutcome> {
  running ??= execute(ctx, options.force === true).finally(() => {
    running = null;
  });
  return running;
}

async function execute(ctx: BackupContext, force: boolean): Promise<RunOutcome> {
  // Back up now works with the switch off too: the learner asked for this one.
  if (!force && !ctx.getSettings().autoBackup) return 'disabled';
  ctx.runState.setRunning(true);
  try {
    const now = ctx.now();
    const snapshot = await createSnapshot(ctx.db, {
      settings: ctx.getSettings(),
      profileId: ctx.profileId,
      appVersion: ctx.appVersion,
      platform: ctx.platform,
      schemaVersion: ctx.schemaVersion,
      hash: ctx.hash,
      now,
    });
    if (!snapshot.hasData) return 'empty';
    const name = autoBackupName(now);
    const file = await ctx.fs.write('backups', name, snapshot.text);
    await pruneLocal(ctx);
    ctx.runState.update({ lastSnapshotAt: now.toISOString(), lastError: null, lastErrorAt: null });
    if (ctx.platform !== 'ios') return 'saved';

    // iPhone: the same file goes to iCloud. No iCloud (an older build, signed out): the snapshot stays on the phone.
    if ((await ctx.provider.status()) !== 'available') return 'saved';
    await ctx.provider.upload(file.uri, name);
    await confirmUploaded(ctx, name);
    ctx.runState.update({ lastConfirmedAt: ctx.now().toISOString(), lastError: null, lastErrorAt: null });
    await pruneCloud(ctx);
    return 'synced';
  } catch (error) {
    const code = codeOf(error);
    ctx.runState.update({ lastError: code, lastErrorAt: ctx.now().toISOString() });
    return code === 'queued' ? 'queued' : 'failed';
  } finally {
    ctx.runState.setRunning(false);
  }
}
