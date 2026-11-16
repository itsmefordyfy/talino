import { Directory, File, Paths } from 'expo-file-system';

import type { FileStore, Folder, StoredFile } from './context';

function folderOf(folder: Folder): Directory {
  const directory = new Directory(Paths.document, folder);
  if (!directory.exists) directory.create({ intermediates: true, idempotent: true });
  return directory;
}

function describe(file: File): StoredFile {
  return { name: file.name, uri: file.uri, size: file.size, modified: file.modificationTime ?? 0 };
}

/**
 * The app's files, under the Documents folder (`files/` on Android, the app's Documents on iPhone). Only
 * `backups/` is carried by Android's Auto Backup (plugins/with-android-backup.js); `manual-backups/` holds
 * the learner's own files and stays on the phone until they export them.
 */
export const expoFileStore: FileStore = {
  async write(folder, name, text) {
    const file = new File(folderOf(folder), name);
    file.create({ overwrite: true, intermediates: true });
    await file.write(text);
    return describe(file);
  },
  async list(folder) {
    const directory = new Directory(Paths.document, folder);
    if (!directory.exists) return [];
    return directory
      .list()
      .filter((entry): entry is File => entry instanceof File)
      .map(describe);
  },
  async read(file) {
    return new File(file.uri).text();
  },
  async remove(file) {
    const target = new File(file.uri);
    if (target.exists) target.delete();
  },
  cacheUri(name) {
    const directory = new Directory(Paths.cache, 'talino-backup');
    if (!directory.exists) directory.create({ intermediates: true, idempotent: true });
    return new File(directory, name).uri;
  },
  sizeOf(uri) {
    try {
      const file = new File(uri);
      return file.exists ? file.size : null;
    } catch {
      return null;
    }
  },
};
