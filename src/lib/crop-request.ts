/**
 * What passes between the screen that picked a photo and the crop screen (app/crop), without going through the URL: the
 * request goes one way, the cropped photo (or a cancel) comes back as the answer to a promise, so the caller just awaits
 * it. One crop at a time; a newer request cancels one left waiting.
 */
export type CropRequest = {
  uri: string;
  /** The frame's width ÷ height. */
  aspect: number;
  /** `circle`: the frame is drawn round (a profile picture); `square`: a plain rectangle. The saved photo is always a rectangle. */
  shape: 'circle' | 'square';
};

/** The cropped photo: a temporary file and its width in pixels. */
export type CroppedPhoto = { uri: string; width: number };

/** How a crop ended: the photo, a cancel (nothing changes), or a photo that couldn't be read or cut. */
export type CropResult = { kind: 'cropped'; photo: CroppedPhoto } | { kind: 'cancelled' } | { kind: 'failed' };

const CANCELLED: CropResult = { kind: 'cancelled' };

let pending: { request: CropRequest; resolve: (result: CropResult) => void } | null = null;

/** Asks for `request` to be cropped: calls `open` (which shows the crop screen) and resolves with how it ended. A screen that can't open counts as a failure. */
export function requestCrop(request: CropRequest, open: () => void): Promise<CropResult> {
  finishCrop(CANCELLED);
  return new Promise((resolve) => {
    pending = { request, resolve };
    try {
      open();
    } catch {
      finishCrop({ kind: 'failed' });
    }
  });
}

/** The request waiting for the crop screen, or null (the screen was opened with nothing asked, e.g. restored after a reload). */
export function peekCropRequest(): CropRequest | null {
  return pending?.request ?? null;
}

/** Answers the waiting request. Safe to call twice: only the first answer counts. */
export function finishCrop(result: CropResult): void {
  const waiting = pending;
  pending = null;
  waiting?.resolve(result);
}
