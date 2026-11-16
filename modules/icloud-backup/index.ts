import { requireOptionalNativeModule } from 'expo';

export type ICloudStatus = 'available' | 'signed_out' | 'unavailable';
export type ICloudBackupFile = { name: string; modified: number; size: number };
export type ICloudUploadStatus = 'uploaded' | 'uploading' | 'full' | 'error' | 'none' | 'unavailable';

type ICloudBackupNativeModule = {
  statusAsync(): Promise<ICloudStatus>;
  uploadAsync(sourcePath: string, name: string): Promise<string>;
  uploadStatusAsync(name: string): Promise<ICloudUploadStatus>;
  listAsync(): Promise<ICloudBackupFile[]>;
  downloadAsync(name: string, destinationPath: string, timeoutSeconds: number): Promise<string>;
  deleteAsync(name: string): Promise<void>;
  /** A live metadata query that sends `onBackupsChanged` whenever a backup appears or changes in iCloud. */
  startWatching(): void;
  stopWatching(): void;
  addListener(event: 'onBackupsChanged', listener: () => void): { remove(): void };
};

// iOS only; missing on Android, the web, and builds made before it was added.
export const iCloudBackup = requireOptionalNativeModule<ICloudBackupNativeModule>('ICloudBackup');
