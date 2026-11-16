import { parseBackup, type Backup, type ParseFailure } from '../lib/format';
import type { BackupContext, StoredFile } from './context';
import { hasOwnLearningData } from './local-rows';
import { previewRestore, restoreFromBackup, type RestoreHooks, type RestoreMode, type RestoreResult } from './restore';
import { listLocalSnapshots, writeSafetySnapshot } from './snapshots';

export type RestoreSource = 'manual' | 'auto' | 'undo';

export type RestoreOutcome = RestoreResult & {
  /** The safety copy written before the restore (null: nothing was at risk, or it was an automatic restore or an undo). */
  safetyFile: StoredFile | null;
};

/**
 * A restore with its safety net. A manual restore first writes a safety snapshot of the current data (when the
 * phone has any and the restore would change something) so "Undo last restore" can put it back; if the restore
 * fails, the transaction rolled everything back and the safety copy is removed again. Settings go to the store,
 * and the data is announced as changed (reminders and the next backup follow). The caller refreshes its queries.
 * An automatic restore (a fresh phone) has nothing to protect and writes no safety copy.
 */
export async function restoreWithSafety(ctx: BackupContext, backup: Backup, mode: RestoreMode, source: RestoreSource, hooks?: RestoreHooks): Promise<RestoreOutcome> {
  const usedInstall = await hasOwnLearningData(ctx.db);
  let safetyFile: StoredFile | null = null;
  if (source === 'manual' && usedInstall) {
    const preview = await previewRestore(ctx.db, backup, { mode });
    if (!preview.nothingToRestore) safetyFile = await writeSafetySnapshot(ctx);
  }
  let result: RestoreResult;
  try {
    result = await restoreFromBackup(ctx.db, backup, { mode, settings: { local: ctx.getSettings(), usedInstall }, hooks });
  } catch (error) {
    if (safetyFile) await ctx.fs.remove(safetyFile).catch(() => undefined);
    throw error;
  }
  if (result.settings) ctx.applySettings(result.settings);
  ctx.runState.update({ lastRestoreAt: ctx.now().toISOString() });
  ctx.notifyChanged();
  return { ...result, safetyFile };
}

export type UndoResult = { ok: true } | { ok: false; reason: 'nothing_to_undo' | ParseFailure };

/** The newest safety copy, if there is one (the button "Undo last restore" shows only then). */
export async function latestSafetySnapshot(ctx: BackupContext): Promise<StoredFile | null> {
  return (await listLocalSnapshots(ctx)).safety[0] ?? null;
}

/**
 * Puts the data back as it was before the last manual restore: the safety copy is restored in replace mode and then
 * removed (undoing twice would just redo, so it is used once).
 */
export async function undoLastRestore(ctx: BackupContext): Promise<UndoResult> {
  const file = await latestSafetySnapshot(ctx);
  if (!file) return { ok: false, reason: 'nothing_to_undo' };
  const parsed = await parseBackup(await ctx.fs.read(file), ctx.hash, ctx.schemaVersion);
  if (!parsed.ok) return { ok: false, reason: parsed.reason };
  await restoreWithSafety(ctx, parsed.backup, 'replace', 'undo');
  await ctx.fs.remove(file);
  return { ok: true };
}
