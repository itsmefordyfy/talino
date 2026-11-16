import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { cloudProvider } from './cloud-provider.ios';
import { CloudError } from './types';

type Listener = () => void;
const mockNative = {
  statusAsync: jest.fn<() => Promise<string>>(),
  uploadAsync: jest.fn<(path: string, name: string) => Promise<string>>(),
  uploadStatusAsync: jest.fn<(name: string) => Promise<string>>(),
  listAsync: jest.fn<() => Promise<{ name: string; modified: number; size: number }[]>>(),
  downloadAsync: jest.fn<(name: string, path: string, seconds: number) => Promise<string>>(),
  deleteAsync: jest.fn<(name: string) => Promise<void>>(),
  startWatching: jest.fn(),
  stopWatching: jest.fn(),
  addListener: jest.fn<(event: string, listener: Listener) => { remove: () => void }>(),
};

jest.mock('../../../../modules/icloud-backup', () => ({
  // Read on each use: the imports run before the constants above are set.
  get iCloudBackup() {
    return mockNative;
  },
}));

beforeEach(() => {
  for (const fn of Object.values(mockNative)) fn.mockReset();
});

describe('the iCloud provider', () => {
  test('wraps the native module: status, upload with a plain path, confirmation, listing in ISO dates', async () => {
    mockNative.statusAsync.mockResolvedValue('signed_out');
    expect(await cloudProvider.status()).toBe('signed_out');
    mockNative.statusAsync.mockRejectedValue(new Error('boom'));
    expect(await cloudProvider.status()).toBe('unavailable');

    mockNative.uploadAsync.mockResolvedValue('queued');
    await cloudProvider.upload('file:///var/My%20Docs/backups/a.talino-backup', 'a.talino-backup');
    expect(mockNative.uploadAsync).toHaveBeenCalledWith('/var/My Docs/backups/a.talino-backup', 'a.talino-backup');

    mockNative.uploadStatusAsync.mockResolvedValue('uploaded');
    expect(await cloudProvider.confirmUpload('a')).toBe('uploaded');
    mockNative.uploadStatusAsync.mockResolvedValue('uploading');
    expect(await cloudProvider.confirmUpload('a')).toBe('uploading');
    mockNative.uploadStatusAsync.mockResolvedValue('none');
    expect(await cloudProvider.confirmUpload('a')).toBe('failed');
    mockNative.uploadStatusAsync.mockRejectedValue(new Error('x'));
    expect(await cloudProvider.confirmUpload('a')).toBe('failed');

    mockNative.listAsync.mockResolvedValue([{ name: 'a.talino-backup', modified: Date.UTC(2026, 10, 13), size: 10 }]);
    expect(await cloudProvider.list()).toEqual([{ name: 'a.talino-backup', modified: '2026-11-13T00:00:00.000Z', size: 10 }]);
  });

  test('the native module’s reasons become the app’s codes', async () => {
    mockNative.uploadAsync.mockRejectedValue({ code: 'ERR_FULL' });
    await expect(cloudProvider.upload('file:///x', 'x')).rejects.toMatchObject({ code: 'full' });
    mockNative.uploadAsync.mockRejectedValue({ code: 'signed_out' });
    await expect(cloudProvider.upload('file:///x', 'x')).rejects.toBeInstanceOf(CloudError);
    mockNative.uploadAsync.mockRejectedValue(new Error('mystery'));
    await expect(cloudProvider.upload('file:///x', 'x')).rejects.toMatchObject({ code: 'failed' });
    mockNative.downloadAsync.mockRejectedValue({ code: 'ERR_TIMEOUT' });
    await expect(cloudProvider.download({ name: 'a', modified: '', size: 1 }, 'file:///d')).rejects.toMatchObject({ code: 'timeout' });
  });

  test('watching starts the live query and stops it with the subscription', () => {
    const remove = jest.fn();
    let listener: Listener = () => undefined;
    mockNative.addListener.mockImplementation((_event, callback) => {
      listener = callback;
      return { remove };
    });
    const onChange = jest.fn();
    const stop = cloudProvider.watch?.(onChange);
    expect(mockNative.startWatching).toHaveBeenCalled();
    listener();
    expect(onChange).toHaveBeenCalledTimes(1);
    stop?.();
    expect(remove).toHaveBeenCalled();
    expect(mockNative.stopWatching).toHaveBeenCalled();
  });
});
