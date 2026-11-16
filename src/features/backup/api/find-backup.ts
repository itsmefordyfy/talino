import { isBackupFileName } from '../lib/files';
import { parseBackup, type Backup, type ParseFailure } from '../lib/format';
import type { BackupContext } from './context';
import { listLocalSnapshots } from './snapshots';

/** How many of the newest backups a look reads before it decides there is nothing it can use. */
const LOOK_AT = 3;

export type FoundBackup =
  | { kind: 'found'; backup: Backup; name: string }
  | { kind: 'none' }
  | { kind: 'unreadable' }
  | { kind: 'needs_newer_app' }
  | { kind: 'needs_account' };

const classify = (reasons: ParseFailure[]): FoundBackup => (reasons.includes('needs_newer_app') || reasons.includes('unsupported_version') ? { kind: 'needs_newer_app' } : reasons.length > 0 ? { kind: 'unreadable' } : { kind: 'none' });

/**
 * The newest backup this phone can restore, read and checked (parsed, checksum verified): iPhone looks in iCloud
 * (downloading the newest few until one is good), Android in the `backups/` folder the system restored. A damaged
 * file is skipped for the next older one; if every one is unusable the answer says why (damaged, or made by a
 * newer Talino), so the learner can be told. A throw is a failed look (offline, timed out): the caller retries.
 */
export async function findNewestValidBackup(ctx: BackupContext): Promise<FoundBackup> {
  const reasons: ParseFailure[] = [];
  if (ctx.platform === 'ios') {
    const status = await ctx.provider.status();
    if (status === 'signed_out') return { kind: 'needs_account' };
    if (status !== 'available') return { kind: 'none' };
    const entries = (await ctx.provider.list()).filter((entry) => isBackupFileName(entry.name)).sort((a, b) => b.modified.localeCompare(a.modified));
    for (const entry of entries.slice(0, LOOK_AT)) {
      const destination = ctx.fs.cacheUri(`restore-${entry.name}`);
      try {
        await ctx.provider.download(entry, destination);
        const parsed = await parseBackup(await ctx.fs.read({ uri: destination }), ctx.hash, ctx.schemaVersion);
        if (parsed.ok) return { kind: 'found', backup: parsed.backup, name: entry.name };
        reasons.push(parsed.reason);
      } finally {
        // A download that failed throws out of here: that is a failed look (offline, timed out), not an unreadable backup.
        await ctx.fs.remove({ uri: destination }).catch(() => undefined);
      }
    }
    return classify(reasons);
  }

  const { automatic } = await listLocalSnapshots(ctx);
  for (const file of automatic.slice(0, LOOK_AT)) {
    const parsed = await parseBackup(await ctx.fs.read(file).catch(() => ''), ctx.hash, ctx.schemaVersion);
    if (parsed.ok) return { kind: 'found', backup: parsed.backup, name: file.name };
    reasons.push(parsed.reason);
  }
  return classify(reasons);
}
