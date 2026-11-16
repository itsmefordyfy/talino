import type { SQLiteDatabase } from 'expo-sqlite';

import type { SettingsState } from '@/features/settings/settings-slice';

import type { CloudProvider } from '../cloud/types';
import type { HashFn, Platform } from '../lib/format';
import type { AutoRestoreState } from '../lib/auto-restore';
import type { RunState } from '../lib/run-state';

/** A small synchronous key-value store (expo-sqlite's `kv-store` in the app, a Map in tests). */
export type KeyValue = {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
};

/** Where the app's own backup files live, under its Documents folder. `backups` is the one Android's Auto Backup carries. */
export type Folder = 'backups' | 'manual-backups';

export type StoredFile = { name: string; uri: string; size: number; /** Milliseconds since 1970. */ modified: number };

export type FileStore = {
  /** Writes `text` as `folder/name` (replacing a file of that name) and returns it. */
  write(folder: Folder, name: string, text: string): Promise<StoredFile>;
  list(folder: Folder): Promise<StoredFile[]>;
  read(file: { uri: string }): Promise<string>;
  /** Deletes a file; one that is already gone is not an error. */
  remove(file: { uri: string }): Promise<void>;
  /** A path in the cache folder for a download or an import (the folder exists; the file doesn't). */
  cacheUri(name: string): string;
  /** The size of a file without reading it, or null when it can't be read. */
  sizeOf(uri: string): number | null;
};

export type RunStateSnapshot = { state: RunState; running: boolean };

export type RunStateStore = {
  get(): RunStateSnapshot;
  update(patch: Partial<RunState>): void;
  setRunning(running: boolean): void;
  subscribe(listener: () => void): () => void;
  reset(): void;
};

export type AutoRestoreStore = {
  get(): AutoRestoreState | null;
  set(state: AutoRestoreState): void;
  reset(): void;
};

/** Everything the backup work needs from the outside, so it runs against fakes in tests and the real app alike. */
export type BackupContext = {
  db: SQLiteDatabase;
  fs: FileStore;
  provider: CloudProvider;
  hash: HashFn;
  runState: RunStateStore;
  autoRestore: AutoRestoreStore;
  platform: Platform;
  appVersion: string;
  schemaVersion: number;
  /** This install's random id (no personal data), stamped into every backup it makes. */
  profileId: string;
  now(): Date;
  getSettings(): SettingsState;
  /** Puts restored settings into the store. */
  applySettings(settings: Partial<SettingsState>): void;
  /** Says the data changed (a restore wrote rows): reminders and the next backup follow. */
  notifyChanged(): void;
  wait(ms: number): Promise<void>;
};
