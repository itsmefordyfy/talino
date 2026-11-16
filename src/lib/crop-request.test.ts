import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { finishCrop, peekCropRequest, requestCrop, type CropRequest } from './crop-request';

const request: CropRequest = { uri: 'file:///photo.jpg', aspect: 1, shape: 'circle' };
const cropped = { uri: 'file:///cropped.jpg', width: 900 };

beforeEach(() => finishCrop({ kind: 'cancelled' }));

describe('crop requests', () => {
  test('opens the screen, which can read the request', () => {
    const open = jest.fn();
    void requestCrop(request, open);
    expect(open).toHaveBeenCalledTimes(1);
    expect(peekCropRequest()).toEqual(request);
  });

  test('resolves with the cropped photo, once', async () => {
    const result = requestCrop(request, () => {});
    finishCrop({ kind: 'cropped', photo: cropped });
    await expect(result).resolves.toEqual({ kind: 'cropped', photo: cropped });
    expect(peekCropRequest()).toBeNull();
    // A second answer (the screen closing after Done) changes nothing.
    expect(() => finishCrop({ kind: 'cancelled' })).not.toThrow();
  });

  test('resolves cancelled when cancelled', async () => {
    const result = requestCrop(request, () => {});
    finishCrop({ kind: 'cancelled' });
    await expect(result).resolves.toEqual({ kind: 'cancelled' });
  });

  test('resolves failed when the photo could not be read', async () => {
    const result = requestCrop(request, () => {});
    finishCrop({ kind: 'failed' });
    await expect(result).resolves.toEqual({ kind: 'failed' });
  });

  test('only the first answer counts', async () => {
    const result = requestCrop(request, () => {});
    finishCrop({ kind: 'cropped', photo: cropped });
    finishCrop({ kind: 'cancelled' });
    await expect(result).resolves.toEqual({ kind: 'cropped', photo: cropped });
  });

  test('a newer request cancels one left waiting', async () => {
    const first = requestCrop(request, () => {});
    const second = requestCrop({ ...request, uri: 'file:///other.jpg' }, () => {});
    await expect(first).resolves.toEqual({ kind: 'cancelled' });
    finishCrop({ kind: 'cropped', photo: cropped });
    await expect(second).resolves.toEqual({ kind: 'cropped', photo: cropped });
  });

  test('fails when the screen cannot be opened', async () => {
    const result = requestCrop(request, () => {
      throw new Error('no router');
    });
    await expect(result).resolves.toEqual({ kind: 'failed' });
    expect(peekCropRequest()).toBeNull();
  });

  test('has no request when nothing was asked', () => {
    expect(peekCropRequest()).toBeNull();
  });
});
