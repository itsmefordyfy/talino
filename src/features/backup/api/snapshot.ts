import type { SQLiteDatabase } from 'expo-sqlite';

import type { SettingsState } from '@/features/settings/settings-slice';

import { buildBackup, hasAnyData, serializeBackup, type Backup, type HashFn, type Platform } from '../lib/format';
import { settingsForBackup } from '../lib/settings';
import { readLocalTables, readLocalTombstones } from './local-rows';

export type SnapshotContext = {
  settings: SettingsState;
  profileId: string;
  appVersion: string;
  platform: Platform;
  schemaVersion: number;
  hash: HashFn;
  label?: string;
  now?: Date;
};

export type Snapshot = { backup: Backup; text: string; hasData: boolean };

/**
 * A snapshot of the learner's data as a backup file: the backed-up tables (never Tali's chats or the app
 * state, see `EXCLUDED_TABLES`), the tombstones, the whitelisted settings, and the checksum. Read-only.
 * The tables are read one after another, not in one transaction: each row is complete by itself, and a
 * restore merges by row, so a write landing between two reads can at worst leave the newest row for the
 * next snapshot.
 */
export async function createSnapshot(db: SQLiteDatabase, context: SnapshotContext): Promise<Snapshot> {
  const tables = await readLocalTables(db);
  const tombstones = await readLocalTombstones(db);
  const backup = await buildBackup(
    {
      appVersion: context.appVersion,
      schemaVersion: context.schemaVersion,
      createdAt: (context.now ?? new Date()).toISOString(),
      platform: context.platform,
      profileId: context.profileId,
      label: context.label,
      settings: settingsForBackup(context.settings),
      tables,
      tombstones,
    },
    context.hash,
  );
  return { backup, text: serializeBackup(backup), hasData: hasAnyData(tables) };
}
