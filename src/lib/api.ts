import Constants from 'expo-constants';

/**
 * Where the app reaches its server routes (`src/app/api/*`, deployed with EAS Hosting). In
 * development the relative path goes to the Expo dev server; a release build needs the deployed
 * origin in EXPO_PUBLIC_API_ORIGIN (a public address, never a secret). A release without one sends
 * nothing and says the feature is resting.
 */
const API_ORIGIN = (process.env.EXPO_PUBLIC_API_ORIGIN ?? '').replace(/\/$/, '');

export const SERVER_CONFIGURED = __DEV__ || API_ORIGIN.startsWith('https://');

/** The dev server's own address ("http://192.168.1.5:8081"), so a page published from a development build can still be opened. */
const DEV_ORIGIN = __DEV__ && Constants.expoConfig?.hostUri ? `http://${Constants.expoConfig.hostUri}` : '';

/**
 * The public address of a server page (certificate, portfolio); null when this build knows no server. A development build has
 * no https address of its own, so it points at the Metro server that answered the publish (it reads the same database).
 */
export function publicUrl(path: string): string | null {
  if (API_ORIGIN.startsWith('https://')) return `${API_ORIGIN}${path}`;
  return DEV_ORIGIN ? `${DEV_ORIGIN}${path}` : null;
}

export type ApiFailure = 'unavailable' | 'network';

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly body: Record<string, unknown>;
  constructor(code: string, status = 0, body: Record<string, unknown> = {}) {
    super(code);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.body = body;
  }
}

/**
 * Posts JSON to a route and returns its JSON body. Throws `ApiError`: `unavailable` (no server in this
 * build), `network` (offline, unreachable), or the route's own `{ error }` code with its status.
 */
export async function postJson(path: string, body: Record<string, unknown>, options: { timeoutMs?: number } = {}): Promise<Record<string, unknown>> {
  if (!SERVER_CONFIGURED) throw new ApiError('unavailable');
  let response: Response;
  try {
    response = await fetch(`${API_ORIGIN}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(options.timeoutMs ?? 45_000),
    });
  } catch {
    throw new ApiError('network');
  }
  let record: Record<string, unknown> = {};
  try {
    const parsed: unknown = await response.json();
    if (typeof parsed === 'object' && parsed !== null) record = parsed as Record<string, unknown>;
  } catch {
    // An HTML error page or an empty body: handled by the status below.
  }
  if (!response.ok) {
    const code = typeof record.error === 'string' ? record.error : response.status === 404 ? 'unavailable' : 'unknown';
    throw new ApiError(code, response.status, record);
  }
  return record;
}
