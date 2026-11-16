import { requireOptionalNativeModule } from 'expo';

type NetworkModule = typeof import('expo-network');
export type NetworkState = Awaited<ReturnType<NetworkModule['getNetworkStateAsync']>>;

/**
 * `expo-network`, or null in a development build made before it was installed: importing it there
 * throws at launch, so it's loaded only when its native module exists. Without it the app assumes
 * it's online, and a request made offline fails and says so instead.
 */
const Network: NetworkModule | null =
  process.env.EXPO_OS === 'web' || requireOptionalNativeModule('ExpoNetwork')
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports -- loaded conditionally, see above
      (require('expo-network') as NetworkModule)
    : null;

/** Online unless the phone says otherwise; an unknown reachability (null) isn't treated as offline. */
export function isOnline(state: Partial<NetworkState>): boolean {
  return state.isConnected !== false && state.isInternetReachable !== false;
}

export async function getIsOnlineAsync(): Promise<boolean> {
  if (!Network) return true;
  try {
    return isOnline(await Network.getNetworkStateAsync());
  } catch {
    return true;
  }
}

/** Calls `listener` whenever connectivity changes. Returns an unsubscribe. */
export function addOnlineListener(listener: (online: boolean) => void): () => void {
  if (!Network) return () => {};
  const subscription = Network.addNetworkStateListener((state) => listener(isOnline(state)));
  return () => subscription.remove();
}
