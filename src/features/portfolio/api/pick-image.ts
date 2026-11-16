import { IMAGE_QUALITY, IMAGE_WIDTH, MAX_IMAGE_CHARS } from '../lib/projects';

export type PickedImages =
  /** `skipped` counts pictures chosen that couldn't be read or stayed too big, so the screen can say so. */
  | { kind: 'images'; images: string[]; skipped: number }
  | { kind: 'cancelled' }
  | { kind: 'too_big' }
  | { kind: 'unavailable' }
  | { kind: 'failed' };

type Manipulator = typeof import('expo-image-manipulator');

/** One picture shrunk for the page: 1200 px wide JPEG, then narrower and harder if it is still over what the server keeps. Null when it can't be made small enough. */
async function shrink(Manipulator: Manipulator, asset: { uri: string; width: number }): Promise<string | null> {
  for (const [width, compress] of [[IMAGE_WIDTH, IMAGE_QUALITY], [900, 0.5], [640, 0.45]] as const) {
    const context = Manipulator.ImageManipulator.manipulate(asset.uri);
    // Never enlarge a small picture.
    if (asset.width > width) context.resize({ width });
    const rendered = await context.renderAsync();
    const saved = await rendered.saveAsync({ format: Manipulator.SaveFormat.JPEG, compress, base64: true });
    if (saved.base64 && saved.base64.length <= MAX_IMAGE_CHARS) return saved.base64;
  }
  return null;
}

/**
 * Opens the photo library for up to `limit` screenshots at once and shrinks each for the page. Nothing is copied anywhere
 * else; the result is the text the project row will hold. A build made before these modules were added reports `unavailable`
 * instead of crashing.
 */
export async function pickScreenshots(limit: number): Promise<PickedImages> {
  let Picker: typeof import('expo-image-picker');
  let Manipulator: Manipulator;
  try {
    [Picker, Manipulator] = await Promise.all([import('expo-image-picker'), import('expo-image-manipulator')]);
  } catch {
    return { kind: 'unavailable' };
  }
  try {
    const picked = await Picker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: limit > 1, selectionLimit: Math.max(1, limit), orderedSelection: true, quality: 1 });
    if (picked.canceled || picked.assets.length === 0) return { kind: 'cancelled' };
    const images: string[] = [];
    let skipped = 0;
    // One at a time: each is decoded in full, and several large photos at once can exhaust memory.
    for (const asset of picked.assets.slice(0, limit)) {
      try {
        const base64 = await shrink(Manipulator, asset);
        if (base64) images.push(base64);
        else skipped += 1;
      } catch {
        skipped += 1;
      }
    }
    if (images.length === 0) return { kind: skipped > 0 ? 'too_big' : 'failed' };
    return { kind: 'images', images, skipped };
  } catch {
    return { kind: 'failed' };
  }
}
