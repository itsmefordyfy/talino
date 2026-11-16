import Storage from 'expo-sqlite/kv-store';

import { parsePosition, type SavedPosition } from '../lib/position';

const KEY = 'journey:position:v1';

/** The map's last scroll position, kept on this phone only (never in a backup: it is where a finger stopped, not data). */
export function readSavedPosition(): SavedPosition | null {
  try {
    return parsePosition(Storage.getItemSync(KEY));
  } catch {
    return null;
  }
}

export function savePosition(position: SavedPosition): void {
  void Storage.setItemAsync(KEY, JSON.stringify(position)).catch(() => {});
}
