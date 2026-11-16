import Storage from 'expo-sqlite/kv-store';

import type { SavedPosition } from './listen-timing';

/**
 * Where the learner stopped listening to each lesson, so Listen carries on from there. Kept in the key-value store on this phone only
 * (not in the backup: it is a convenience, not progress), one entry per lesson and voice, with an index so "Delete all data" can remove them.
 */
const PREFIX = 'listen-position:';
const INDEX = 'listen-position-index';

const keyOf = (lessonId: string, voice: string) => `${PREFIX}${voice}:${lessonId}`;

function readIndex(): string[] {
  try {
    const value: unknown = JSON.parse(Storage.getItemSync(INDEX) ?? '[]');
    return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
  } catch {
    return [];
  }
}

/** The saved place for a lesson, or null (nothing saved, or the saved text is not a position). */
export function loadListenPosition(lessonId: string, voice: string): SavedPosition | null {
  try {
    const value: unknown = JSON.parse(Storage.getItemSync(keyOf(lessonId, voice)) ?? 'null');
    if (!value || typeof value !== 'object') return null;
    const { segment, time, hash } = value as Partial<SavedPosition>;
    if (typeof segment !== 'number' || typeof time !== 'number' || typeof hash !== 'string') return null;
    return { segment, time, hash };
  } catch {
    return null;
  }
}

export function saveListenPosition(lessonId: string, voice: string, position: SavedPosition): void {
  try {
    const key = keyOf(lessonId, voice);
    Storage.setItemSync(key, JSON.stringify(position));
    const index = readIndex();
    if (!index.includes(key)) Storage.setItemSync(INDEX, JSON.stringify([...index, key]));
  } catch {
    // Remembering the place is best effort; listening never depends on it.
  }
}

export function clearListenPosition(lessonId: string, voice: string): void {
  try {
    Storage.removeItemSync(keyOf(lessonId, voice));
  } catch {
    // Same.
  }
}

/** Forgets every saved place (Delete all data). */
export function clearAllListenPositions(): void {
  try {
    for (const key of readIndex()) Storage.removeItemSync(key);
    Storage.removeItemSync(INDEX);
  } catch {
    // Same.
  }
}
