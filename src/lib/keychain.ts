import { requireOptionalNativeModule } from 'expo';
import type * as SecureStoreModule from 'expo-secure-store';

/**
 * A few small values kept in the iPhone's Keychain, which iOS keeps when the app is deleted, so
 * they come back after a reinstall (the app's own storage doesn't). Used for the Family sharing
 * login and this phone's id (lib/device-id), so reinstalling never hands out a fresh daily AI chat
 * allowance. Android's keystore is cleared with the app, so there they last as long as the install. Kept on this device only (never
 * moved to a new phone by a device backup). A build without the native module (Expo Go, an older
 * dev client) simply has no Keychain copy.
 */
const SecureStore: typeof SecureStoreModule | null =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  requireOptionalNativeModule('ExpoSecureStore') ? (require('expo-secure-store') as typeof SecureStoreModule) : null;

const OPTIONS = SecureStore ? { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY } : undefined;

export function readKeychain(key: string): string | null {
  try {
    return SecureStore?.getItem(key, OPTIONS) ?? null;
  } catch {
    return null;
  }
}

export function writeKeychain(key: string, value: string): void {
  try {
    SecureStore?.setItem(key, value, OPTIONS);
  } catch {
    // Best effort: the app's own storage still has it for this install.
  }
}
