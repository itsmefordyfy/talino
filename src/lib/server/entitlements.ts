/**
 * Server-only: what a learner has bought, asked of RevenueCat (never the app's word alone on a
 * deployed server). Used for Tali's fair use (any purchase), the course roles and certificates (a
 * course's own entitlement or All-Access). Adapted from Pawfetti's / Bubblie's `lib/server/pro`.
 * Never import this from app code: it reads REVENUECAT_SECRET_KEY.
 *
 *   REVENUECAT_SECRET_KEY  RevenueCat secret API key. A V2 key needs "Customer information: Read
 *                          only" and REVENUECAT_PROJECT_ID; a legacy V1 key works without it.
 *   REVENUECAT_PROJECT_ID  the RevenueCat project id ("proj…" or the 8 characters after it).
 *
 * Without a secret key the development server believes the app; production logs it and believes the
 * app too (RevenueCat unreachable must not lock paying learners out), as the other apps do. Only a
 * clear answer from RevenueCat overrides the app.
 */

const TTL_MS = 2 * 60_000;
const MAX_CACHED = 5000;
const APP_USER_ID = /^[\w$:.@-]{1,128}$/;

type Fetch = (url: string, init: { headers: Record<string, string>; signal?: AbortSignal }) => Promise<{ ok: boolean; status?: number; json(): Promise<unknown> }>;

const cache = new Map<string, { ids: string[]; until: number }>();

export function revenueCatProjectId(value: string | undefined): string | null {
  const id = value?.trim();
  if (!id) return null;
  return id.startsWith('proj') ? id : `proj${id}`;
}

function logUnknown(reason: string): null {
  console.error(JSON.stringify({ event: 'entitlement_check_unknown', reason }));
  return null;
}

type V1Entitlement = { expires_date?: string | null; grace_period_expires_date?: string | null };

function v1Active(entitlement: V1Entitlement, now: number): boolean {
  if (entitlement.expires_date === null || entitlement.expires_date === undefined) return true;
  const expires = Date.parse(entitlement.expires_date);
  const grace = entitlement.grace_period_expires_date ? Date.parse(entitlement.grace_period_expires_date) : NaN;
  return (Number.isFinite(expires) && expires > now) || (Number.isFinite(grace) && grace > now);
}

/**
 * Active entitlement identifiers for this customer, or null when RevenueCat couldn't answer. V2's
 * active entitlements are keyed by RevenueCat's internal ids ("entl…"); map them to lookup keys with
 * REVENUECAT_ENTITLEMENT_KEYS ("entlabc=course_developer,entldef=all_access"), else they are returned as is.
 */
export async function fetchActiveEntitlements(appUserId: string, secretKey: string, fetchImpl: Fetch, now: number, projectId: string | null): Promise<string[] | null> {
  try {
    if (projectId) {
      const response = await fetchImpl(`https://api.revenuecat.com/v2/projects/${encodeURIComponent(projectId)}/customers/${encodeURIComponent(appUserId)}/active_entitlements`, {
        headers: { authorization: `Bearer ${secretKey}`, accept: 'application/json' },
        signal: AbortSignal.timeout(6000),
      });
      if (!response.ok) {
        if (response.status === 404 && ((await response.json().catch(() => null)) as { type?: string } | null)?.type === 'resource_missing') return [];
        return logUnknown(`v2_status_${response.status ?? 'unknown'}`);
      }
      const data = (await response.json()) as { items?: { entitlement_id?: string; expires_at?: number | null }[] } | null;
      if (!data || !Array.isArray(data.items)) return logUnknown('v2_no_items');
      const names = entitlementKeyMap();
      return data.items
        .filter((item) => typeof item.entitlement_id === 'string' && (item.expires_at === null || item.expires_at === undefined || item.expires_at > now))
        .map((item) => names.get(item.entitlement_id as string) ?? (item.entitlement_id as string));
    }
    const response = await fetchImpl(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}`, {
      headers: { authorization: `Bearer ${secretKey}`, accept: 'application/json' },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return logUnknown(`status_${response.status ?? 'unknown'}`);
    const data = (await response.json()) as { subscriber?: { entitlements?: Record<string, V1Entitlement> } } | null;
    if (!data?.subscriber) return logUnknown('no_subscriber');
    return Object.entries(data.subscriber.entitlements ?? {})
      .filter(([, entitlement]) => v1Active(entitlement, now))
      .map(([id]) => id);
  } catch {
    return logUnknown('unreachable');
  }
}

function entitlementKeyMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const pair of (process.env.REVENUECAT_ENTITLEMENT_KEYS ?? '').split(',')) {
    const [id, key] = pair.split('=').map((part) => part.trim());
    if (id && key) map.set(id, key);
  }
  return map;
}

/**
 * The learner's active entitlements as the server sees them: RevenueCat's answer when it gives one,
 * else what the app said (`claimed`), checked for shape. Never throws.
 */
export async function verifiedEntitlements(appUserId: unknown, claimed: unknown, fetchImpl: Fetch = fetch): Promise<string[]> {
  const fromApp = Array.isArray(claimed) ? claimed.filter((id): id is string => typeof id === 'string' && /^[a-z0-9_]{2,64}$/.test(id)).slice(0, 40) : [];
  const secretKey = process.env.REVENUECAT_SECRET_KEY;
  if (!secretKey) {
    if (process.env.NODE_ENV === 'production') logUnknown('no_secret_key');
    return fromApp;
  }
  if (typeof appUserId !== 'string' || !APP_USER_ID.test(appUserId)) return [];
  const now = Date.now();
  const cached = cache.get(appUserId);
  if (cached && cached.until > now) return cached.ids;
  const ids = await fetchActiveEntitlements(appUserId, secretKey, fetchImpl, now, revenueCatProjectId(process.env.REVENUECAT_PROJECT_ID));
  if (ids === null) return fromApp;
  if (cache.size >= MAX_CACHED) cache.clear();
  cache.set(appUserId, { ids, until: now + TTL_MS });
  return ids;
}

/** Tests only. */
export function resetEntitlementCache(): void {
  cache.clear();
}
