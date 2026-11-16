import { BACKUP_EXTENSION } from './format';

/** The automatic snapshots the phone keeps (the folder Android's Auto Backup carries) and what iCloud keeps. */
export const KEEP_LOCAL_AUTO = 3;
export const KEEP_CLOUD = 3;
/** Before a manual restore a snapshot of the current data is written, so it can be undone; the last few stay. */
export const KEEP_SAFETY = 3;

export const AUTO_PREFIX = 'talino-auto-';
export const SAFETY_PREFIX = 'before-restore-';

const pad = (value: number, length = 2) => String(value).padStart(length, '0');

/** `yyyyMMddHHmmss` in UTC: fixed width, so names sort by time. */
function utcStamp(date: Date): string {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`;
}

export const autoBackupName = (date: Date) => `${AUTO_PREFIX}${utcStamp(date)}.${BACKUP_EXTENSION}`;
export const safetyBackupName = (date: Date) => `${SAFETY_PREFIX}${utcStamp(date)}.${BACKUP_EXTENSION}`;

/**
 * `talino-2026-11-13-1405.talino-backup` in the learner's local time (it is what the history shows), with
 * `-2`, `-3` when a name is already taken (two backups in one minute).
 */
export function manualBackupName(date: Date, existing: readonly string[]): string {
  const base = `talino-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;
  let name = `${base}.${BACKUP_EXTENSION}`;
  for (let n = 2; existing.includes(name); n += 1) name = `${base}-${n}.${BACKUP_EXTENSION}`;
  return name;
}

export const isBackupFileName = (name: string) => name.toLowerCase().endsWith(`.${BACKUP_EXTENSION}`);

/** The names to delete so only the newest `keep` remain (newest by name: the automatic names sort by time). */
export function namesToPrune(names: readonly string[], keep: number): string[] {
  return [...names].sort().reverse().slice(keep);
}

/** The same by modified time, for what a provider lists (newest first is not guaranteed). */
export function entriesToPrune<T extends { name: string; modified: string }>(entries: readonly T[], keep: number): T[] {
  return [...entries].sort((a, b) => (a.modified === b.modified ? b.name.localeCompare(a.name) : b.modified.localeCompare(a.modified))).slice(keep);
}

/** `file:///var/x/y.json` → `/var/x/y.json` (the native iCloud module takes a path), undoing the URI's escaping. */
export function uriToPath(uri: string): string {
  const path = uri.startsWith('file://') ? uri.slice('file://'.length) : uri;
  try {
    return decodeURI(path);
  } catch {
    return path;
  }
}

/** 1.2 MB, 340 KB, 12 B. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${Math.max(0, Math.round(bytes))} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
