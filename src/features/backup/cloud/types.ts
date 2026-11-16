import type { BackupErrorCode } from '../lib/run-state';
import type { CloudAvailability } from '../lib/status';

/**
 * Where automatic backups go beyond the phone. iPhone: the app's own iCloud container (files iCloud Drive
 * syncs; modules/icloud-backup). Android: nowhere the app can reach: the system's Auto Backup carries the
 * `backups/` folder on its own schedule, so the Android provider is a no-op that says `unavailable`.
 */
export type CloudStatus = CloudAvailability;

export class CloudError extends Error {
  constructor(readonly code: BackupErrorCode) {
    super(code);
  }
}

/** A backup stored in the cloud. */
export type CloudBackupEntry = { name: string; modified: string; size: number };

/** `uploaded`: iCloud has it. `uploading`: still going. `full`: no iCloud storage left. `failed`: iCloud reported an error. */
export type UploadConfirmation = 'uploaded' | 'uploading' | 'full' | 'failed';

export type CloudProvider = {
  /** True where a cloud copy exists at all (iPhone with iCloud in the build). */
  readonly hasCloud: boolean;
  status(): Promise<CloudStatus>;
  /** Hands a file to the cloud; for iCloud that only queues it (see `confirmUpload`). */
  upload(fileUri: string, name: string): Promise<void>;
  /** Whether a handed-over file really reached the cloud. */
  confirmUpload(name: string): Promise<UploadConfirmation>;
  list(): Promise<CloudBackupEntry[]>;
  download(entry: CloudBackupEntry, destinationUri: string): Promise<void>;
  remove(entry: CloudBackupEntry): Promise<void>;
  /** Calls `onChange` when a backup may have arrived (iCloud's live query), so a fresh install's restore starts right then. Returns a stop function. */
  watch?(onChange: () => void): () => void;
};
