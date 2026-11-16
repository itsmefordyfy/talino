import { requireOptionalNativeModule } from 'expo';

type EventSubscription = { remove(): void };

export type WatchLinkStatus = { supported: boolean; activated?: boolean; paired?: boolean; installed?: boolean; reachable?: boolean };

type TalinoWatchEvents = {
  /** The Watch sent a command (JSON in `json`) and waits for `reply(id, …)`; the native side answers "failed" itself after a few seconds. */
  onCommand: (event: { id: string; json: string }) => void;
};

type TalinoWatchNativeModule = {
  /** Hands the Watch the latest state: kept by the system for when the Watch next opens, and sent at once when it is reachable. */
  pushState(json: string): void;
  status(): WatchLinkStatus;
  reply(id: string, json: string): void;
  addListener<E extends keyof TalinoWatchEvents>(event: E, listener: TalinoWatchEvents[E]): EventSubscription;
};

// Optional: Android, web, Expo Go and iOS builds made before the Watch app was added don't have it.
export const native = requireOptionalNativeModule<TalinoWatchNativeModule>('TalinoWatch');
