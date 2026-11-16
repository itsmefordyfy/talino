import { toBase64 } from '@/lib/base64';

import type { ImportSource } from './ai-client';

/** The biggest file the server takes (the same 4 MB it checks); a bigger one is refused here before anything is read or sent. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export type PickedFile =
  | { kind: 'file'; name: string; size: number; source: Extract<ImportSource, { kind: 'file' }> }
  | { kind: 'too_large'; name: string }
  | { kind: 'unreadable'; name: string }
  | { kind: 'cancelled' }
  | { kind: 'unavailable' };

const PDF = 'application/pdf';
const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/**
 * The system file picker for a PDF or Word résumé, read into memory for the upload. The copy the picker made in the cache is
 * deleted straight after, so the file doesn't stay on the phone in a place the learner can't see.
 */
export async function pickResumeFile(): Promise<PickedFile> {
  let DocumentPicker: typeof import('expo-document-picker');
  let files: typeof import('expo-file-system');
  try {
    [DocumentPicker, files] = await Promise.all([import('expo-document-picker'), import('expo-file-system')]);
  } catch {
    return { kind: 'unavailable' };
  }
  const picked = await DocumentPicker.getDocumentAsync({ type: [PDF, DOCX], copyToCacheDirectory: true, multiple: false });
  if (picked.canceled || picked.assets.length === 0) return { kind: 'cancelled' };
  const asset = picked.assets[0];
  const file = new files.File(asset.uri);
  try {
    const size = file.exists ? file.size : (asset.size ?? 0);
    if (size > MAX_UPLOAD_BYTES) return { kind: 'too_large', name: asset.name };
    const bytes = await file.bytes();
    const lower = asset.name.toLowerCase();
    const mime = asset.mimeType ?? (lower.endsWith('.pdf') ? PDF : lower.endsWith('.docx') ? DOCX : 'application/octet-stream');
    return { kind: 'file', name: asset.name, size: bytes.length, source: { kind: 'file', name: asset.name, mime, data: toBase64(bytes) } };
  } catch {
    return { kind: 'unreadable', name: asset.name };
  } finally {
    try {
      if (file.exists) file.delete();
    } catch {
      // The cache is the system's to clear; a copy that can't be removed now goes with it later.
    }
  }
}
