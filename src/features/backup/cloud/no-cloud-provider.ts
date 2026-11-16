import { CloudError, type CloudProvider } from './types';

/**
 * Android and the web: no cloud the app can write to. Android's system Auto Backup carries the snapshot folder
 * by itself (plugins/with-android-backup.js); the app can't upload, list or confirm anything there, and says so.
 */
export const noCloudProvider: CloudProvider = {
  hasCloud: false,
  status: async () => 'unavailable',
  upload: async () => {
    throw new CloudError('unavailable');
  },
  confirmUpload: async () => 'failed',
  list: async () => [],
  download: async () => {
    throw new CloudError('unavailable');
  },
  remove: async () => undefined,
};
