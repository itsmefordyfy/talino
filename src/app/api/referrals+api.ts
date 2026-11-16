/**
 * Referrals (the business plan: "give a friend a discount on their first course, get a free
 * mini-course"). Each learner gets a code; a friend redeems it once (not their own). The reward is
 * granted by the RevenueCat webhook after the friend's first purchase (api/revenuecat-webhook). The
 * friend's discount needs store offer codes the owner creates; the app then sells from the
 * `referral` offering when RevenueCat has one.
 *
 * POST { action: 'code', appUserId }         → { code }
 * POST { action: 'redeem', code, appUserId } → { ok: true }
 */

import { randomId, table, TableUnavailableError } from '@/lib/server/table';

const APP_USER_ID = /^[\w$:.@-]{1,128}$/;

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
  const appUserId = typeof body.appUserId === 'string' && APP_USER_ID.test(body.appUserId) ? body.appUserId : null;
  if (!appUserId) return Response.json({ error: 'bad_request' }, { status: 400 });
  const referrals = table('talino_referrals');
  const redemptions = table('talino_referral_redemptions');
  try {
    if (body.action === 'code') {
      const [mine] = await referrals.select({ app_user_id: appUserId }, { limit: 1 });
      if (mine) return Response.json({ code: mine.code });
      const code = randomId(6).toUpperCase();
      await referrals.insert({ code, app_user_id: appUserId, created_at: new Date().toISOString() });
      return Response.json({ code });
    }
    if (body.action === 'redeem') {
      const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
      if (!/^[A-Z2-9]{6}$/.test(code)) return Response.json({ error: 'invalid_code' }, { status: 400 });
      const [owner] = await referrals.select({ code }, { limit: 1 });
      if (!owner) return Response.json({ error: 'invalid_code' }, { status: 404 });
      if (owner.app_user_id === appUserId) return Response.json({ error: 'own_code' }, { status: 409 });
      const [already] = await redemptions.select({ referee_app_user_id: appUserId }, { limit: 1 });
      if (already) return Response.json({ error: 'already_redeemed' }, { status: 409 });
      await redemptions.insert({ code, referee_app_user_id: appUserId, referrer_app_user_id: owner.app_user_id, rewarded: false, created_at: new Date().toISOString() });
      return Response.json({ ok: true });
    }
    return Response.json({ error: 'bad_request' }, { status: 400 });
  } catch (error) {
    if (error instanceof TableUnavailableError) return Response.json({ error: 'unavailable' }, { status: 503 });
    throw error;
  }
}
