import { KIT_FORMATS, kitDownloadName, kitFileKey, type KitStyle, type KitTemplate } from '../content';
import { KIT_FILES } from '../files';

/**
 * Opens the share sheet for a look's file, so the learner can open it in Word, Pages or Google Docs, save it to Files or iCloud Drive,
 * or send it anywhere. The file is bundled, so this works offline; it is copied to the cache under its friendly name first, because a
 * bundled asset has a generated name. The native modules load here, not at import, so a build without them only fails the action.
 * Resolves false when sharing isn't available on this device.
 */
export async function shareKitFile(template: KitTemplate, style: KitStyle): Promise<boolean> {
  const [{ Asset }, { Directory, File, Paths }, Sharing] = await Promise.all([import('expo-asset'), import('expo-file-system'), import('expo-sharing')]);
  if (!(await Sharing.isAvailableAsync())) return false;
  const moduleId = KIT_FILES[kitFileKey(template, style)];
  if (moduleId === undefined) throw new Error(`no_kit_file:${kitFileKey(template, style)}`);
  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();
  const source = asset.localUri ?? asset.uri;
  const folder = new Directory(Paths.cache, 'career-kit');
  if (!folder.exists) folder.create({ intermediates: true, idempotent: true });
  const name = kitDownloadName(template, style);
  const target = new File(folder, name);
  if (target.exists) target.delete();
  new File(source).copy(target);
  const format = KIT_FORMATS[template.format];
  await Sharing.shareAsync(target.uri, { mimeType: format.mimeType, UTI: format.uti, dialogTitle: name });
  return true;
}
