/**
 * The public portfolio (the business plan: "a public page on its own link with the learner's
 * projects, live apps, certificates and badges"). No account: publishing returns a secret edit token
 * that the phone keeps; updating or removing needs it (stored here only as a hash). The learner may
 * opt in to the talent list for employers, with the contact email they choose.
 *
 * POST { action: 'publish', slug?, editToken?, portfolio, talent, contactEmail }  → { slug, editToken? }
 * POST { action: 'remove', slug, editToken }                                        → { removed: true }
 * Stored in `talino_portfolios` (public page: /p/<slug>).
 */

import { cleanPortfolio } from '@/lib/server/portfolio';
import { randomId, sha256, table, TableUnavailableError } from '@/lib/server/table';

const portfolios = () => table('talino_portfolios');

const slugFrom = (name: string) =>
  `${name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24) || 'learner'}-${randomId(4)}`;

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
  try {
    const slug = typeof body.slug === 'string' && /^[a-z0-9-]{3,40}$/.test(body.slug) ? body.slug : null;
    const token = typeof body.editToken === 'string' && /^[a-z2-9]{32}$/.test(body.editToken) ? body.editToken : null;
    const existing = slug ? (await portfolios().select({ slug }, { limit: 1 }))[0] : undefined;
    if (existing && (!token || (await sha256(token)) !== existing.token_hash)) return Response.json({ error: 'forbidden' }, { status: 403 });

    if (body.action === 'remove') {
      if (!existing) return Response.json({ removed: true });
      await portfolios().remove({ slug: String(existing.slug) });
      return Response.json({ removed: true });
    }
    if (body.action !== 'publish') return Response.json({ error: 'bad_request' }, { status: 400 });

    const portfolio = cleanPortfolio(body.portfolio);
    if (portfolio.name.length < 2) return Response.json({ error: 'bad_request' }, { status: 400 });
    const contact = typeof body.contactEmail === 'string' ? body.contactEmail.trim().slice(0, 120) : '';
    const contactEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) ? contact : '';
    const talent = body.talent === true && contactEmail !== '';
    const now = new Date().toISOString();
    if (existing) {
      await portfolios().update({ slug: String(existing.slug) }, { data: portfolio, talent, contact_email: contactEmail || null, updated_at: now });
      return Response.json({ slug: existing.slug });
    }
    const newSlug = slugFrom(portfolio.name);
    const editToken = randomId(32);
    await portfolios().insert({ slug: newSlug, token_hash: await sha256(editToken), data: portfolio, talent, contact_email: contactEmail || null, created_at: now, updated_at: now });
    return Response.json({ slug: newSlug, editToken });
  } catch (error) {
    if (error instanceof TableUnavailableError) return Response.json({ error: 'unavailable' }, { status: 503 });
    throw error;
  }
}
