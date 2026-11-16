/**
 * The background restore on a fresh install or a new phone: onboarding shows at once while Talino looks for
 * a backup (iCloud on iPhone, the snapshot Android's system restored on Android) and merges the newest valid
 * one in without asking. It keeps looking for a week (iCloud can take minutes, or hours offline), then stops;
 * Backup & Restore can still restore by hand. Pure rules here; the work is in ../api/auto-restore.
 */
export const AUTO_RESTORE_KEEP_LOOKING_MS = 7 * 24 * 60 * 60 * 1000;
/** Waits between looks in one session, from launch: soon, then while iCloud catches up. */
export const AUTO_RESTORE_DELAYS_MS = [0, 20_000, 60_000] as const;
/** After those, a look this often for as long as the app stays open (iPhone also looks the moment iCloud lists a backup). */
export const AUTO_RESTORE_REPEAT_MS = 120_000;

/**
 * `pending` until decided; then `restored`, `none` (looked for a week, or the phone already had its own
 * progress), `needs_account` (iCloud Drive off or signed out for the whole week), `unreadable` (the backups
 * there are damaged or not Talino's), `needs_newer_app` (made by a newer Talino) or `failed`.
 */
export type AutoRestoreStatus = 'pending' | 'restored' | 'none' | 'needs_account' | 'unreadable' | 'needs_newer_app' | 'failed';
export type AutoRestoreState = { status: AutoRestoreStatus; checks: number; updatedAt: string; /** The first look, which starts the week. */ firstAt: string | null };

export type CheckOutcome = 'restored' | 'none_found' | 'needs_account' | 'unreadable' | 'needs_newer_app' | 'failed' | 'has_data';

const STATUSES: readonly AutoRestoreStatus[] = ['pending', 'restored', 'none', 'needs_account', 'unreadable', 'needs_newer_app', 'failed'];

export function parseAutoRestore(raw: string | null): AutoRestoreState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<AutoRestoreState>;
    if (!value || !STATUSES.includes(value.status as AutoRestoreStatus) || typeof value.checks !== 'number') return null;
    return { status: value.status as AutoRestoreStatus, checks: value.checks, updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : '', firstAt: typeof value.firstAt === 'string' ? value.firstAt : null };
  } catch {
    return null;
  }
}

/** The first launch decides: only an install with no progress of its own looks for a backup. */
export function initialAutoRestore(fresh: boolean, now: string): AutoRestoreState {
  return { status: fresh ? 'pending' : 'none', checks: 0, updatedAt: now, firstAt: null };
}

/**
 * The state after one look. A restore, a backup that can't be read, one from a newer app, or progress of the
 * phone's own ends it. Anything else (nothing listed yet, no iCloud account, a failure) is looked at again
 * until the week is over: the learner may sign in to iCloud after setting the phone up, and right after a
 * reinstall iCloud can list the app's container as empty for a while.
 */
export function afterCheck(state: AutoRestoreState, outcome: CheckOutcome, now: string): AutoRestoreState {
  const checks = state.checks + 1;
  const firstAt = state.firstAt ?? now;
  const done = (status: AutoRestoreStatus): AutoRestoreState => ({ status, checks, updatedAt: now, firstAt });
  if (outcome === 'restored' || outcome === 'unreadable' || outcome === 'needs_newer_app') return done(outcome);
  if (outcome === 'has_data') return done('none');
  if (Date.parse(now) - Date.parse(firstAt) > AUTO_RESTORE_KEEP_LOOKING_MS) return done(outcome === 'none_found' ? 'none' : outcome);
  return done('pending');
}

/** Whether a look is still due: only while pending. */
export const autoRestoreDue = (state: AutoRestoreState | null): boolean => state?.status === 'pending';

/** Milliseconds to wait before look number `attempt` in this session (0 for the first). */
export function nextLookDelay(attempt: number): number {
  return AUTO_RESTORE_DELAYS_MS[attempt] ?? AUTO_RESTORE_REPEAT_MS;
}
