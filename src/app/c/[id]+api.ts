/** The public certificate page (/c/<id>): who earned which course, when, and the reviewed projects. */

import { SIGNATURE_DATA_URI, SIGNER_NAME, SIGNER_TITLE } from '@/features/certificates/lib/signature';
import { htmlPage, notFoundPage } from '@/lib/server/page';
import { escapeHtml, table, TableUnavailableError } from '@/lib/server/table';

export async function GET(_request: Request, { id }: Record<string, string>): Promise<Response> {
  if (!/^[a-z2-9]{6,16}$/.test(id ?? '')) return notFoundPage('This certificate link isn’t valid.');
  try {
    const [row] = await table('talino_certificates').select({ id }, { limit: 1 });
    if (!row) return notFoundPage('No Talino certificate has this number.');
    const issued = new Date(String(row.issued_at)).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' });
    const projects = Array.isArray(row.projects) ? (row.projects as unknown[]) : [];
    const master = row.course_id === 'master';
    const body = `
<section class="hero">
  <div class="eyebrow">Certificate of completion</div>
  <h1>${escapeHtml(row.learner_name)}</h1>
  <p>${master ? 'completed every Talino career course and earned' : 'completed'} <strong>${escapeHtml(row.course_title)}</strong></p>
</section>
<div class="card">
  <p class="ok">✓ Verified by Talino</p>
  <p class="muted">Issued ${escapeHtml(issued)} · Certificate number ${escapeHtml(row.id)}</p>
  ${
    projects.length > 0
      ? `<h2>${master ? 'Courses completed' : 'Projects reviewed'}</h2><ul>${projects.map((project) => `<li>${escapeHtml(project)}</li>`).join('')}</ul>`
      : ''
  }
  <div class="signed"><img src="${SIGNATURE_DATA_URI}" alt="Signature of ${SIGNER_NAME}"><div class="who">${SIGNER_NAME}</div><div class="role">${SIGNER_TITLE}</div></div>
  <p class="muted">${master ? '' : 'Every lesson and quiz was completed, and each project was reviewed against its rubric before this certificate was issued.'}</p>
</div>`;
    return htmlPage(`${row.learner_name} · ${row.course_title} · Talino`, body, { description: `${row.learner_name} completed ${row.course_title} on Talino.` });
  } catch (error) {
    if (error instanceof TableUnavailableError) return new Response('Certificates are unavailable right now.', { status: 503 });
    throw error;
  }
}
