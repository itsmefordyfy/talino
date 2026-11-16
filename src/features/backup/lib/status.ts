import type { BackupErrorCode, RunState } from './run-state';

export type CloudAvailability = 'available' | 'signed_out' | 'unavailable';

/**
 * What the Backup & Restore screen tells the learner about the automatic backup. Never a claim the OS has not made:
 * `synced` is only ever iCloud having confirmed an upload; on Android the most the app can honestly say is
 * `saved_on_phone` (Android backs the snapshot folder up on its own schedule, if the learner's Google backup is on,
 * and cannot tell the app whether it did).
 */
export type BackupStatus =
  | 'synced'
  | 'backing_up'
  | 'saved_on_phone'
  | 'unavailable'
  | 'disabled'
  | 'failed'
  | 'restore_completed'
  | 'none_yet';

/** Why, for `disabled` (the learner turned it off, or iCloud Drive is off or signed out), `failed`, and a `backing_up` that is waiting on iCloud. */
export type StatusReason = 'user_off' | BackupErrorCode;

export type StatusInput = {
  platform: 'ios' | 'android' | 'web';
  /** The learner's switch. */
  enabled: boolean;
  /** A backup run is going now. */
  running: boolean;
  /** iCloud's state on iPhone (null until asked, or elsewhere). */
  cloud: CloudAvailability | null;
  state: RunState;
};

export type StatusInfo = { status: BackupStatus; reason?: StatusReason };

const later = (a: string | null, b: string | null) => a !== null && (b === null || a > b);

export function deriveStatus({ platform, enabled, running, cloud, state }: StatusInput): StatusInfo {
  if (platform === 'web') return { status: 'unavailable' };
  if (!enabled) return { status: 'disabled', reason: 'user_off' };
  if (running) return { status: 'backing_up' };
  if (later(state.lastRestoreAt, state.lastSnapshotAt)) return { status: 'restore_completed' };
  const failed = state.lastError !== null && later(state.lastErrorAt, platform === 'ios' ? (state.lastConfirmedAt ?? state.lastSnapshotAt) : state.lastSnapshotAt);

  if (platform === 'android') {
    if (failed && state.lastError) return { status: 'failed', reason: state.lastError };
    return state.lastSnapshotAt ? { status: 'saved_on_phone' } : { status: 'none_yet' };
  }

  if (cloud === 'unavailable') return { status: 'unavailable' };
  if (cloud === 'signed_out') return { status: 'disabled', reason: 'signed_out' };
  if (failed && state.lastError) {
    // iCloud has the file and will upload it when it can: waiting, not failing.
    return state.lastError === 'queued' ? { status: 'backing_up', reason: 'queued' } : { status: 'failed', reason: state.lastError };
  }
  if (state.lastConfirmedAt) return { status: 'synced' };
  return state.lastSnapshotAt ? { status: 'backing_up', reason: 'queued' } : { status: 'none_yet' };
}

export type StatusKey =
  | 'synced'
  | 'backing_up'
  | 'backing_up_queued'
  | 'saved_on_phone'
  | 'unavailable_ios'
  | 'unavailable_other'
  | 'disabled_user_off'
  | 'disabled_signed_out'
  | 'failed_full'
  | 'failed_offline'
  | 'failed_timeout'
  | 'failed_unavailable'
  | 'failed_failed'
  | 'restore_completed'
  | 'none_yet';

/** Which words the screen uses for a status (strings.auto.statuses). */
export function statusKey(info: StatusInfo, platform: StatusInput['platform']): StatusKey {
  switch (info.status) {
    case 'unavailable':
      return platform === 'ios' ? 'unavailable_ios' : 'unavailable_other';
    case 'disabled':
      return info.reason === 'signed_out' ? 'disabled_signed_out' : 'disabled_user_off';
    case 'backing_up':
      return info.reason === 'queued' ? 'backing_up_queued' : 'backing_up';
    case 'failed':
      if (info.reason === 'signed_out') return 'disabled_signed_out';
      if (info.reason === 'full' || info.reason === 'offline' || info.reason === 'timeout' || info.reason === 'unavailable') return `failed_${info.reason}`;
      return 'failed_failed';
    default:
      return info.status;
  }
}
