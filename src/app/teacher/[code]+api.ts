/** A class's progress for its teacher (/teacher/<code>?key=…): each learner's lessons, projects and certificates. */

import { CAREER_COURSE_INDEX, COURSE_INDEX } from '@/features/courses/content/course-index';
import { htmlPage } from '@/lib/server/page';
import { escapeHtml, sha256, table, TableUnavailableError } from '@/lib/server/table';

type ProgressEntry = { courseId: string; lessonsDone: number; lessonsTotal: number; projectsPassed: number; projectsTotal: number; complete: boolean };

export async function GET(request: Request, { code }: Record<string, string>): Promise<Response> {
  const key = new URL(request.url).searchParams.get('key') ?? '';
  const classCode = (code ?? '').toUpperCase();
  const denied = () => new Response(htmlPage('Class · Talino', '<div class="card"><h2>Teacher key needed</h2><p class="muted">Open the link Talino gave you for this class.</p></div>', { noindex: true }).body, { status: 403, headers: { 'content-type': 'text/html; charset=utf-8' } });
  if (!/^[A-Z0-9]{4,12}$/.test(classCode) || key.length < 16) return denied();
  try {
    const [found] = await table('talino_classes').select({ code: classCode }, { limit: 1 });
    if (!found || found.teacher_key_hash !== (await sha256(key))) return denied();
    const courseIds = (Array.isArray(found.course_ids) ? found.course_ids : []) as string[];
    const courses = courseIds.map((id) => COURSE_INDEX.find((course) => course.id === id)).filter((course) => !!course);
    const people = await table('talino_class_members').select({ code: classCode }, { limit: 1000 });
    const certificates = await Promise.all(people.map((person) => table('talino_certificates').select({ app_user_id: String(person.app_user_id) })));
    const header = `<tr><th>Learner</th>${courses.map((course) => `<th>${escapeHtml(course.title)}</th>`).join('')}<th>Certificates</th></tr>`;
    const rows = people
      .map((person, index) => {
        const progress = (Array.isArray(person.progress) ? person.progress : []) as ProgressEntry[];
        const cells = courses
          .map((course) => {
            const entry = progress.find((item) => item.courseId === course.id);
            return `<td>${entry ? `${entry.lessonsDone}/${entry.lessonsTotal} lessons<br>${entry.projectsPassed}/${entry.projectsTotal} projects${entry.complete ? '<br><span class="ok">Complete</span>' : ''}` : '<span class="muted">Not started</span>'}</td>`;
          })
          .join('');
        const earned = certificates[index].map((row) => `<a href="/c/${escapeHtml(row.id)}">${escapeHtml(row.course_title)}</a>`).join('<br>');
        return `<tr><td>${escapeHtml(person.learner_name)}</td>${cells}<td>${earned || '<span class="muted">None yet</span>'}</td></tr>`;
      })
      .join('');
    const body = `<section class="hero"><div class="eyebrow">Class ${escapeHtml(classCode)}</div><h1>${escapeHtml(found.name)}</h1><p>${people.length} of ${escapeHtml(found.seats)} seats used</p></section>
<div class="card" style="overflow-x:auto"><table><thead>${header}</thead><tbody>${rows || `<tr><td colspan="${courses.length + 2}" class="muted">No one has joined yet.</td></tr>`}</tbody></table></div>
<p class="muted">Progress is what each learner's app last shared. Career courses: ${CAREER_COURSE_INDEX.length}.</p>`;
    const response = htmlPage(`${found.name} · Talino`, body, { noindex: true });
    return new Response(response.body, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
  } catch (error) {
    if (error instanceof TableUnavailableError) return new Response('Classes are unavailable right now.', { status: 503 });
    throw error;
  }
}
