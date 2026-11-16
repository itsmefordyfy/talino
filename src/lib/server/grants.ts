/**
 * Server-only: grants a course to a learner as a RevenueCat promotional entitlement (class seats,
 * referral rewards). Uses RevenueCat's V1 API, which needs a V1 secret key:
 * REVENUECAT_V1_SECRET_KEY (a legacy key with write access), separate from the V2 read key.
 * Durations are RevenueCat's: daily … six_month, yearly, lifetime.
 */

export const GRANT_DURATIONS = ['monthly', 'three_month', 'six_month', 'yearly', 'lifetime'] as const;
export type GrantDuration = (typeof GRANT_DURATIONS)[number];

export type GrantResult = 'granted' | 'not_configured' | 'failed';

export async function grantEntitlement(appUserId: string, entitlement: string, duration: GrantDuration, fetchImpl: typeof fetch = fetch): Promise<GrantResult> {
  const key = process.env.REVENUECAT_V1_SECRET_KEY?.trim();
  if (!key) {
    console.error(JSON.stringify({ event: 'grant_not_configured', entitlement }));
    return 'not_configured';
  }
  try {
    const response = await fetchImpl(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}/entitlements/${encodeURIComponent(entitlement)}/promotional`, {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ duration }),
      signal: AbortSignal.timeout(8000),
    });
    if (response.ok) return 'granted';
    console.error(JSON.stringify({ event: 'grant_failed', entitlement, status: response.status }));
    return 'failed';
  } catch {
    console.error(JSON.stringify({ event: 'grant_failed', entitlement, status: 'unreachable' }));
    return 'failed';
  }
}
