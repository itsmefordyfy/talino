/** A learner's public portfolio page (/p/<slug>). */

import { notFoundPage } from '@/lib/server/page';
import { cleanPortfolio, portfolioDocument } from '@/lib/server/portfolio';
import { table, TableUnavailableError } from '@/lib/server/table';

export async function GET(_request: Request, { slug }: Record<string, string>): Promise<Response> {
  if (!/^[a-z0-9-]{3,40}$/.test(slug ?? '')) return notFoundPage('This portfolio link isn’t valid.');
  try {
    const [row] = await table('talino_portfolios').select({ slug }, { limit: 1 });
    if (!row) return notFoundPage('This portfolio was removed or never existed.');
    // Read through the same cleaning as a publish: a page saved before projects had screenshots still has every field the page reads.
    const data = cleanPortfolio(row.data);
    const version = String(Date.parse(String(row.updated_at)) || 0);
    return new Response(portfolioDocument(data, slug, version), { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' } });
  } catch (error) {
    if (error instanceof TableUnavailableError) return new Response('Portfolios are unavailable right now.', { status: 503 });
    throw error;
  }
}
