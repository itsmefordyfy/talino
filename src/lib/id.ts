import { randomUUID } from 'expo-crypto';

/** Records get their UUID on the phone so they can be saved offline and synced later without collisions. */
export function newId(): string {
  return randomUUID();
}

/** Now, as an ISO timestamp, for `created_at` / `updated_at`. */
export function nowTimestamp(): string {
  return new Date().toISOString();
}
