import { router } from 'expo-router';

import { requestCrop } from '@/lib/crop-request';

/** The longest base64 text one profile picture may be (a 480 px JPEG is about a tenth of this). */
export const MAX_PHOTO_CHARS = 120_000;

/** Side of the square picture, in pixels: sharp at the largest size it is drawn, small enough to sit in the row and the backup. */
export const PHOTO_SIZE = 480;

export type PickedPhoto =
  | { kind: 'photo'; base64: string }
  | { kind: 'cancelled' }
  | { kind: 'too_big' }
  | { kind: 'unavailable' }
  | { kind: 'failed' };

type Manipulator = typeof import('expo-image-manipulator');

/** The cropped square as a JPEG of `PHOTO_SIZE` px, then smaller and harder if it is still over the limit. Null when it can't be made small enough. */
async function shrink(Manipulator: Manipulator, asset: { uri: string; width: number }): Promise<string | null> {
  for (const [size, compress] of [[PHOTO_SIZE, 0.75], [360, 0.6], [240, 0.5]] as const) {
    const context = Manipulator.ImageManipulator.manipulate(asset.uri);
    // Never enlarge a small picture.
    if (asset.width > size) context.resize({ width: size });
    const rendered = await context.renderAsync();
    const saved = await rendered.saveAsync({ format: Manipulator.SaveFormat.JPEG, compress, base64: true });
    if (saved.base64 && saved.base64.length <= MAX_PHOTO_CHARS) return saved.base64;
  }
  return null;
}

/**
 * Opens the system photo library straight away, lets the learner move and zoom the photo in the app's own round crop screen,
 * and shrinks the result into the text the profile row holds. Nothing is copied anywhere else. Cancelling the library or the
 * crop returns `cancelled`. A build made before these modules were added reports `unavailable` instead of crashing.
 *
 * Never `allowsEditing` and never a `quality` below 1: on iOS `allowsEditing` swaps the system picker (instant, no permission)
 * for the legacy one, which takes seconds to open on a large library, and a lower quality makes it re-encode the full-size
 * photo before handing it back. The photo is taken as it is (`Current` also skips a HEIC transcode) and compressed once, by
 * `shrink`, after the crop (the same way Pawfetti picks a profile photo).
 */
export async function pickProfilePhoto(): Promise<PickedPhoto> {
  let Picker: typeof import('expo-image-picker');
  let Manipulator: Manipulator;
  try {
    [Picker, Manipulator] = await Promise.all([import('expo-image-picker'), import('expo-image-manipulator')]);
  } catch {
    return { kind: 'unavailable' };
  }
  try {
    const picked = await Picker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      preferredAssetRepresentationMode: Picker.UIImagePickerPreferredAssetRepresentationMode.Current,
    });
    const asset = picked.assets?.[0];
    if (picked.canceled || !asset) return { kind: 'cancelled' };
    const crop = await requestCrop({ uri: asset.uri, aspect: 1, shape: 'circle' }, () => router.push('/crop'));
    if (crop.kind !== 'cropped') return crop.kind === 'cancelled' ? { kind: 'cancelled' } : { kind: 'failed' };
    const base64 = await shrink(Manipulator, crop.photo);
    return base64 ? { kind: 'photo', base64 } : { kind: 'too_big' };
  } catch {
    return { kind: 'failed' };
  }
}
