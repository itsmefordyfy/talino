import { afterCheck, autoRestoreDue as isDue, initialAutoRestore, type AutoRestoreState, type CheckOutcome } from '../lib/auto-restore';
import { CloudError } from '../cloud/types';
import type { BackupContext } from './context';
import { findNewestValidBackup } from './find-backup';
import { hasOwnLearningData } from './local-rows';
import { restoreWithSafety, type RestoreOutcome } from './restore-flow';

/**
 * Decides once, on this install's first launch, whether to look for a backup: only an install with no progress
 * of its own does (an existing learner who updates to this version never has a backup merged in behind their
 * back). True while a look is still due.
 */
export async function startAutoRestore(ctx: BackupContext): Promise<boolean> {
  const state = ctx.autoRestore.get();
  if (!state) {
    const fresh = !(await hasOwnLearningData(ctx.db));
    ctx.autoRestore.set(initialAutoRestore(fresh, ctx.now().toISOString()));
    return fresh;
  }
  return isDue(state);
}

export type AutoRestoreResult = { outcome: CheckOutcome; restored: RestoreOutcome | null; due: boolean };

let running: Promise<AutoRestoreResult> | null = null;

/**
 * One look for a backup and, if a good one is there, a merge of it in (the same `restoreWithSafety` as every
 * restore, so the same rules: nothing newer is overwritten, nothing deleted comes back, nothing doubles).
 * It never asks anything and never blocks. The state is recorded only after the restore is applied.
 */
export function checkForBackup(ctx: BackupContext): Promise<AutoRestoreResult> {
  running ??= look(ctx).finally(() => {
    running = null;
  });
  return running;
}

async function look(ctx: BackupContext): Promise<AutoRestoreResult> {
  const state = ctx.autoRestore.get();
  if (!state || state.status !== 'pending') return { outcome: 'none_found', restored: null, due: false };
  let outcome: CheckOutcome;
  let restored: RestoreOutcome | null = null;
  try {
    if (await hasOwnLearningData(ctx.db)) {
      outcome = 'has_data';
    } else {
      const found = await findNewestValidBackup(ctx);
      if (found.kind === 'found') {
        restored = await restoreWithSafety(ctx, found.backup, 'merge', 'auto');
        outcome = 'restored';
      } else if (found.kind === 'none') outcome = 'none_found';
      else outcome = found.kind;
    }
  } catch (error) {
    // Offline and timeouts are expected on a phone just set up; the look is simply repeated.
    outcome = error instanceof CloudError && error.code === 'signed_out' ? 'needs_account' : 'failed';
  }
  const next: AutoRestoreState = afterCheck(state, outcome, ctx.now().toISOString());
  ctx.autoRestore.set(next);
  return { outcome, restored, due: next.status === 'pending' };
}
