import Constants from 'expo-constants';
import type { SQLiteDatabase } from 'expo-sqlite';

import { SCHEMA_VERSION } from '@/db/migrations';
import { settingsRestored } from '@/features/settings/settings-slice';
import { notifyDataChanged } from '@/lib/data-changed';
import { newId } from '@/lib/id';
import { store } from '@/store';

import { cloudProvider } from '../cloud/cloud-provider';
import type { Platform } from '../lib/format';
import type { BackupContext, KeyValue } from './context';
import { expoFileStore } from './file-store';
import { sha256Hex } from './hash';
import { BACKUP_KEYS } from './keys';
import { createAutoRestoreStore, createRunStateStore, expoKeyValue } from './run-state';

export const runStateStore = createRunStateStore(expoKeyValue);
export const autoRestoreStore = createAutoRestoreStore(expoKeyValue);

/** This install's random id, made once (no personal data), so a backup can say whether it came from this same install. */
export function readProfileId(kv: KeyValue = expoKeyValue): string {
  const saved = kv.get(BACKUP_KEYS.profileId);
  if (saved) return saved;
  const made = newId();
  kv.set(BACKUP_KEYS.profileId, made);
  return made;
}

export function currentPlatform(): Platform {
  const os = process.env.EXPO_OS;
  return os === 'ios' || os === 'android' ? os : 'web';
}

/** The real thing: the open database, the app's files, iCloud, the store. */
export function createBackupContext(db: SQLiteDatabase): BackupContext {
  return {
    db,
    fs: expoFileStore,
    provider: cloudProvider,
    hash: sha256Hex,
    runState: runStateStore,
    autoRestore: autoRestoreStore,
    platform: currentPlatform(),
    appVersion: Constants.expoConfig?.version ?? '',
    schemaVersion: SCHEMA_VERSION,
    profileId: readProfileId(),
    now: () => new Date(),
    getSettings: () => store.getState().settings,
    applySettings: (settings) => {
      store.dispatch(settingsRestored(settings));
    },
    notifyChanged: notifyDataChanged,
    wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  };
}
