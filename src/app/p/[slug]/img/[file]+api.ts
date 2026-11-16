/** One project screenshot of a public portfolio: /p/<slug>/img/<project>-<picture>.jpg */

import { cleanPortfolio, portfolioImage, portfolioPhoto } from '@/lib/server/portfolio';
import { table, TableUnavailableError } from '@/lib/server/table';

const missing = () => new Response('Not found', { status: 404 });

export async function GET(_request: Request, { slug, file }: Record<string, string>): Promise<Response> {
  const match = /^(\d{1,2})-(\d)\.jpg$/.exec(file ?? '');
  const wantsPhoto = file === 'photo.jpg';
  if ((!match && !wantsPhoto) || !/^[a-z0-9-]{3,40}$/.test(slug ?? '')) return missing();
  try {
    const [row] = await table('talino_portfolios').select({ slug }, { limit: 1 });
    if (!row) return missing();
    const data = cleanPortfolio(row.data);
    const bytes = wantsPhoto ? portfolioPhoto(data) : match ? portfolioImage(data, Number(match[1]), Number(match[2])) : null;
    if (!bytes) return missing();
    // The page asks with ?v=<time it was last published>, so a changed picture has a new address and the old one can be kept a long time.
    return new Response(bytes, { status: 200, headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=31536000, immutable' } });
  } catch (error) {
    if (error instanceof TableUnavailableError) return new Response('Unavailable', { status: 503 });
    throw error;
  }
}
