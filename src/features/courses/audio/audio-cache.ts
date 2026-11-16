import { Directory, File, Paths } from 'expo-file-system';

import { audioFileName, lessonAudioUrl, lessonPeaksUrl, parsePeaks } from './lesson-audio';
import { parseTiming, timingUrl, type ListenTiming } from './listen-timing';

/**
 * Recordings kept on the phone after the first listen, in the cache folder (not Documents): they are
 * 1 to 2 MB each, about 290 MB for every lesson, so they stay out of iCloud and device backups. The system
 * may clear the cache when the phone is short of space; that only means downloading a lesson again.
 */
const FOLDER = 'lesson-audio';

/** `EXPO_PUBLIC_AUDIO_ORIGIN`: where the recordings are hosted (a public address, never a secret). Unset: the phone's voice is used. */
export const AUDIO_ORIGIN = process.env.EXPO_PUBLIC_AUDIO_ORIGIN;

function folder(): Directory {
  const directory = new Directory(Paths.cache, FOLDER);
  if (!directory.exists) directory.create({ intermediates: true, idempotent: true });
  return directory;
}

/** The saved recording of a lesson, or null when there is none (an empty file from a failed run counts as none). */
export function savedLessonAudio(lessonId: string, voice?: string): File | null {
  try {
    const file = new File(folder(), audioFileName(lessonId, voice));
    return file.exists && file.size > 0 ? file : null;
  } catch {
    return null;
  }
}

/** Downloads a lesson's recording and keeps it; resolves to the file. Rejects when there is no host, no connection or no such recording. */
export async function downloadLessonAudio(lessonId: string, voice?: string): Promise<File> {
  const url = lessonAudioUrl(AUDIO_ORIGIN, lessonId, { development: __DEV__, voice });
  if (!url) throw new Error('no_audio_host');
  // The download completes in a temporary place and is moved into position only when it succeeds, so a lost connection leaves nothing half-saved.
  return File.downloadFileAsync(url, new File(folder(), audioFileName(lessonId, voice)), { idempotent: true });
}

/** How much space the saved recordings take, in bytes. */
export function savedAudioBytes(): number {
  try {
    return folder()
      .list()
      .reduce((total, entry) => total + (entry instanceof File ? entry.size : 0), 0);
  } catch {
    return 0;
  }
}

/** Deletes every saved recording (they download again when needed). */
export function clearSavedAudio(): void {
  try {
    const directory = new Directory(Paths.cache, FOLDER);
    if (directory.exists) directory.delete();
  } catch {
    // Nothing to clean up.
  }
}

/**
 * The waveform the Listen player draws for a lesson: from the phone if saved, else fetched (a few hundred
 * bytes) and saved. It is only decoration, so any failure means "no waveform" and the player draws plain bars.
 */
export async function loadLessonPeaks(lessonId: string, voice?: string): Promise<number[] | null> {
  try {
    const file = new File(folder(), `${audioFileName(lessonId, voice)}.peaks-v2.json`);
    if (file.exists) return parsePeaks(JSON.parse(await file.text()));
    const url = lessonPeaksUrl(AUDIO_ORIGIN, lessonId, { development: __DEV__, voice });
    if (!url) return null;
    const response = await fetch(url);
    if (!response.ok) return null;
    const text = await response.text();
    const peaks = parsePeaks(JSON.parse(text));
    if (peaks) {
      file.create({ overwrite: true, intermediates: true });
      await file.write(text);
    }
    return peaks;
  } catch {
    return null;
  }
}

/**
 * When each sentence of a recording starts and ends (`listen-timing.ts`): from the phone if saved, else fetched (a few kilobytes) and saved.
 * Without it the recording still plays, only without highlighting or jumping to a sentence, so any failure means null.
 */
export async function loadLessonTiming(lessonId: string, voice?: string): Promise<ListenTiming | null> {
  try {
    const file = new File(folder(), `${audioFileName(lessonId, voice)}.timing-v1.json`);
    if (file.exists) return parseTiming(JSON.parse(await file.text()));
    const url = timingUrl(AUDIO_ORIGIN, lessonId, { development: __DEV__, voice });
    if (!url) return null;
    const response = await fetch(url);
    if (!response.ok) return null;
    const text = await response.text();
    const timing = parseTiming(JSON.parse(text));
    if (timing) {
      file.create({ overwrite: true, intermediates: true });
      await file.write(text);
    }
    return timing;
  } catch {
    return null;
  }
}

/**
 * Drops a lesson's saved recording and everything saved beside it, so the next Listen downloads it again. Used when the saved recording
 * is older than its timing (a recording made again on the server): its length no longer matches.
 */
export function forgetLessonAudio(lessonId: string, voice?: string): void {
  try {
    const name = audioFileName(lessonId, voice);
    for (const entry of folder().list()) if (entry instanceof File && entry.name.startsWith(name)) entry.delete();
  } catch {
    // Nothing to clean up.
  }
}
