import * as ImagePicker from 'expo-image-picker';

/**
 * Picks up to `limit` photos from the library at once, for example screenshots of a bug. They stay in the picker's cache: they are only
 * needed until the mail is sent and are never kept with anything the learner saved. The photo library's own picker needs no permission.
 */
export async function pickPhotos(limit: number): Promise<string[]> {
  if (limit < 1) return [];
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.7,
    allowsMultipleSelection: true,
    selectionLimit: limit,
    orderedSelection: true,
  });
  if (result.canceled) return [];
  return result.assets.slice(0, limit).map((asset) => asset.uri);
}
