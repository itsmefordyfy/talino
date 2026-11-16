/**
 * The talent list for employers (the business plan's hiring-partner stream): learners who opted in
 * on their portfolio, with certificates and the contact email they chose. Protected by an employer
 * key (`/talent?key=…`), stored hashed in `talino_employers` (created by the owner in the SQL
 * Editor). Placement fees are arranged outside the app.
 */

import { htmlPage } from '@/lib/server/page';
import { escapeHtml, sha256, table, TableUnavailableError } from '@/lib/server/table';

export async function GET(request: Request): Promise<Response> {
  const key = new URL(request.url).searchParams.get('key') ?? '';
  const denied = () => new Response(htmlPage('Talent list · Talino', '<div class="card"><h2>Employer key needed</h2><p class="muted">Ask Talino for an employer key to see the talent list.</p></div>', { noindex: true }).body, { status: 403, headers: { 'content-type': 'text/html; charset=utf-8' } });
  if (key.length < 16) return denied();
  try {
    const [employer] = await table('talino_employers').select({ key_hash: await sha256(key), active: true }, { limit: 1 });
    if (!employer) return denied();
    const people = await table('talino_portfolios').select({ talent: true }, { limit: 500, order: 'updated_at.desc' });
    const rows = people
      .map((row) => {
        const data = row.data as { name?: string; headline?: string; certificates?: { title: string }[]; skills?: string[] };
        return `<tr><td><a href="/p/${escapeHtml(row.slug)}">${escapeHtml(data.name)}</a><br><span class="muted">${escapeHtml(data.headline)}</span></td><td>${(data.certificates ?? []).map((item) => escapeHtml(item.title)).join('<br>')}</td><td>${escapeHtml((data.skills ?? []).slice(0, 8).join(', '))}</td><td><a href="mailto:${escapeHtml(row.contact_email)}">Contact</a></td></tr>`;
      })
      .join('');
    const body = `<section class="hero"><div class="eyebrow">For ${escapeHtml(employer.name)}</div><h1>Talent list</h1><p>${people.length} learners who chose to be listed.</p></section>
<div class="card"><table><thead><tr><th>Learner</th><th>Certificates</th><th>Skills</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="4" class="muted">No one is listed yet.</td></tr>'}</tbody></table></div>`;
    const response = htmlPage('Talent list · Talino', body, { noindex: true });
    return new Response(response.body, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
  } catch (error) {
    if (error instanceof TableUnavailableError) return new Response('The talent list is unavailable right now.', { status: 503 });
    throw error;
  }
}
