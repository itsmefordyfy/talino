/**
 * What the last automatic backup did, remembered on the phone (the key-value store) so the Backup & Restore screen
 * can say it plainly: when a snapshot was last written, when iCloud last confirmed an upload (iPhone only),
 * and the last error. Pure parsing here; the reading and writing is in ../api/run-state.
 */
export type BackupErrorCode = 'offline' | 'full' | 'signed_out' | 'unavailable' | 'timeout' | 'queued' | 'failed';

const ERROR_CODES: readonly BackupErrorCode[] = ['offline', 'full', 'signed_out', 'unavailable', 'timeout', 'queued', 'failed'];

export type RunState = {
  /** The newest snapshot file written on this phone. */
  lastSnapshotAt: string | null;
  /** The newest upload iCloud confirmed (never set on Android: nothing there can confirm). */
  lastConfirmedAt: string | null;
  lastError: BackupErrorCode | null;
  lastErrorAt: string | null;
  /** The last restore (automatic or manual), until the next backup run. */
  lastRestoreAt: string | null;
};

export const EMPTY_RUN_STATE: RunState = { lastSnapshotAt: null, lastConfirmedAt: null, lastError: null, lastErrorAt: null, lastRestoreAt: null };

const text = (value: unknown): string | null => (typeof value === 'string' && value.length <= 40 ? value : null);

export function parseRunState(raw: string | null): RunState {
  if (!raw) return EMPTY_RUN_STATE;
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    const error = ERROR_CODES.find((code) => code === value.lastError) ?? null;
    return { lastSnapshotAt: text(value.lastSnapshotAt), lastConfirmedAt: text(value.lastConfirmedAt), lastError: error, lastErrorAt: error ? text(value.lastErrorAt) : null, lastRestoreAt: text(value.lastRestoreAt) };
  } catch {
    return EMPTY_RUN_STATE;
  }
}
