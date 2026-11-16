import Storage from 'expo-sqlite/kv-store';

import { BACKUP_KEYS } from './keys';
import { EMPTY_RUN_STATE, parseRunState, type RunState } from '../lib/run-state';
import { parseAutoRestore, type AutoRestoreState } from '../lib/auto-restore';
import type { AutoRestoreStore, KeyValue, RunStateSnapshot, RunStateStore } from './context';

export const expoKeyValue: KeyValue = {
  get: (key) => {
    try {
      return Storage.getItemSync(key);
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      Storage.setItemSync(key, value);
    } catch {
      // Remembering how the last backup went is best effort.
    }
  },
  remove: (key) => {
    try {
      Storage.removeItemSync(key);
    } catch {
      // Same.
    }
  },
};

/**
 * The automatic backup's memory, kept in the key-value store and read through a cached snapshot (the screen
 * subscribes with `useSyncExternalStore`, which needs a value that only changes when the state does).
 */
export function createRunStateStore(kv: KeyValue): RunStateStore {
  const listeners = new Set<() => void>();
  let snapshot: RunStateSnapshot = { state: parseRunState(kv.get(BACKUP_KEYS.runState)), running: false };
  const emit = () => {
    for (const listener of listeners) listener();
  };
  return {
    get: () => snapshot,
    update(patch) {
      const state: RunState = { ...snapshot.state, ...patch };
      kv.set(BACKUP_KEYS.runState, JSON.stringify(state));
      snapshot = { ...snapshot, state };
      emit();
    },
    setRunning(running) {
      if (snapshot.running === running) return;
      snapshot = { ...snapshot, running };
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    reset() {
      kv.remove(BACKUP_KEYS.runState);
      snapshot = { state: EMPTY_RUN_STATE, running: snapshot.running };
      emit();
    },
  };
}

export function createAutoRestoreStore(kv: KeyValue): AutoRestoreStore {
  return {
    get: () => parseAutoRestore(kv.get(BACKUP_KEYS.autoRestore)),
    set: (state: AutoRestoreState) => kv.set(BACKUP_KEYS.autoRestore, JSON.stringify(state)),
    reset: () => kv.remove(BACKUP_KEYS.autoRestore),
  };
}
