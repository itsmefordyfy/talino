import { iCloudBackup } from '@/modules/icloud-backup';

import type { BackupErrorCode } from '../lib/run-state';
import { uriToPath } from '../lib/files';
import { CloudError, type CloudProvider, type CloudStatus } from './types';

const DOWNLOAD_TIMEOUT_SECONDS = 120;

/** The native module's reason (signed_out, unavailable, full, timeout, failed) as the app's code. */
function rethrow(error: unknown): never {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String((error as { code: unknown }).code) : '';
  const known: BackupErrorCode[] = ['signed_out', 'unavailable', 'full', 'timeout', 'failed'];
  throw new CloudError(known.find((candidate) => code.toLowerCase().endsWith(candidate)) ?? 'failed');
}

/**
 * iCloud (modules/icloud-backup): backups are files in the app's iCloud container, uploaded and downloaded by
 * iCloud Drive itself. No sign-in in the app: the phone's Apple Account is used, and the learner turns iCloud
 * Drive on for Talino in Settings if it is off. `null` module (a build made before it was added) = unavailable.
 */
export const cloudProvider: CloudProvider = {
  hasCloud: iCloudBackup !== null,
  async status(): Promise<CloudStatus> {
    if (!iCloudBackup) return 'unavailable';
    try {
      return await iCloudBackup.statusAsync();
    } catch {
      return 'unavailable';
    }
  },
  async upload(fileUri, name) {
    if (!iCloudBackup) throw new CloudError('unavailable');
    await iCloudBackup.uploadAsync(uriToPath(fileUri), name).catch(rethrow);
  },
  async confirmUpload(name) {
    if (!iCloudBackup) return 'failed';
    const status = await iCloudBackup.uploadStatusAsync(name).catch(() => 'error' as const);
    return status === 'uploaded' || status === 'uploading' || status === 'full' ? status : 'failed';
  },
  async list() {
    if (!iCloudBackup) throw new CloudError('unavailable');
    const files = await iCloudBackup.listAsync().catch(rethrow);
    return files.map((file) => ({ name: file.name, modified: new Date(file.modified).toISOString(), size: file.size }));
  },
  async download(entry, destinationUri) {
    if (!iCloudBackup) throw new CloudError('unavailable');
    await iCloudBackup.downloadAsync(entry.name, uriToPath(destinationUri), DOWNLOAD_TIMEOUT_SECONDS).catch(rethrow);
  },
  async remove(entry) {
    await iCloudBackup?.deleteAsync(entry.name).catch(() => undefined);
  },
  watch(onChange) {
    const module = iCloudBackup;
    if (!module?.startWatching) return () => undefined;
    const subscription = module.addListener('onBackupsChanged', onChange);
    module.startWatching();
    return () => {
      subscription.remove();
      module.stopWatching();
    };
  },
};
