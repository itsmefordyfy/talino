import { requireOptionalNativeModule } from 'expo';
import Storage from 'expo-sqlite/kv-store';

import { newId } from './id';
import { readKeychain, writeKeychain } from './keychain';

const KEY = 'device-id';

/**
 * Android's id for this app on this phone (Android 8+: one per app signer and phone), which stays
 * the same when the app is reinstalled, as the Keychain copy does on iPhone. Null on iPhone and in
 * a build made before expo-application was added (2026-10-20).
 */
function androidId(): string | null {
  if (process.env.EXPO_OS !== 'android') return null;
  try {
    const id = requireOptionalNativeModule<{ androidId?: string | null }>('ExpoApplication')?.androidId;
    return id ? `a-${id}` : null;
  } catch {
    return null;
  }
}

/**
 * An id for this phone, made on first use and kept (random on iPhone, with a Keychain copy; Android's
 * own id on Android). It names no one: the server counts Ollie's weekly conversations by it, beside the
 * RevenueCat customer id (lib/server/ai-chat-quota), so a reinstall that keeps it keeps the count.
 */
let known: string | null = null;

export function deviceId(): string {
  if (known) return known;
  // Android's own id whenever the build has it (2026-10-22): it outlives a reinstall, where the random
  // id stored by installs from before 2026-10-20 doesn't.
  const android = androidId();
  try {
    const existing = Storage.getItemSync(KEY);
    if (android) {
      if (existing !== android) Storage.setItemSync(KEY, android);
      known = android;
      return android;
    }
    if (existing) {
      // Installs from before the Keychain copy (2026-10-18) put their id there too.
      if (readKeychain(KEY) !== existing) writeKeychain(KEY, existing);
      known = existing;
      return existing;
    }
    // A reinstall: the same iPhone keeps its id (the Keychain survives deleting the app), so the
    // server's count for today stays this phone's. Installs that already have an id keep it.
    const kept = readKeychain(KEY);
    const id = kept ?? newId();
    Storage.setItemSync(KEY, id);
    if (!kept) writeKeychain(KEY, id);
    known = id;
    return id;
  } catch {
    // The app's storage couldn't be read: still one id for this launch, never a new one per question.
    known = android ?? readKeychain(KEY) ?? newId();
    return known;
  }
}
