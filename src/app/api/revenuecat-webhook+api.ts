/**
 * RevenueCat's webhook (Project settings → Integrations → Webhooks, Authorization header set to
 * REVENUECAT_WEBHOOK_AUTH). On a referred learner's first purchase, the referrer is granted the
 * reward mini-course (REFERRAL_REWARD_ENTITLEMENT, default `mini_ai_engineering`) for life, once.
 */

import { grantEntitlement } from '@/lib/server/grants';
import { table, TableUnavailableError } from '@/lib/server/table';

const PURCHASES = new Set(['INITIAL_PURCHASE', 'NON_RENEWING_PURCHASE']);

export async function POST(request: Request): Promise<Response> {
  const expected = process.env.REVENUECAT_WEBHOOK_AUTH?.trim();
  if (!expected || request.headers.get('authorization') !== expected) return Response.json({ error: 'forbidden' }, { status: 403 });
  let body: { event?: { type?: string; app_user_id?: string; environment?: string } };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
  const event = body.event;
  if (!event?.type || !PURCHASES.has(event.type) || typeof event.app_user_id !== 'string') return Response.json({ ok: true, ignored: true });
  try {
    const redemptions = table('talino_referral_redemptions');
    const [redemption] = await redemptions.select({ referee_app_user_id: event.app_user_id, rewarded: false }, { limit: 1 });
    if (!redemption) return Response.json({ ok: true, ignored: true });
    const reward = process.env.REFERRAL_REWARD_ENTITLEMENT?.trim() || 'mini_ai_engineering';
    const result = await grantEntitlement(String(redemption.referrer_app_user_id), reward, 'lifetime');
    // A failed grant is answered with an error so RevenueCat retries the webhook later.
    if (result !== 'granted') return Response.json({ error: 'grant_failed' }, { status: 503 });
    await redemptions.update({ referee_app_user_id: event.app_user_id }, { rewarded: true, rewarded_at: new Date().toISOString() });
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof TableUnavailableError) return Response.json({ error: 'unavailable' }, { status: 503 });
    throw error;
  }
}
