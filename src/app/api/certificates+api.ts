/**
 * Issues a Talino certificate (the business plan: "unlocks only once every lesson, quiz and project
 * is finished and the coach has reviewed the projects"). The server checks what it can prove: the
 * course is owned (RevenueCat, for paid courses) and every project carries a review token this
 * server signed for this learner (lib/server/signing). Lesson and quiz completion are recorded on the
 * phone and can't be proven here (a known limit, written in the design). The Talino Master
 * certificate needs this learner's certificates for every career course.
 *
 * POST { courseId, learnerName, appUserId, entitlements, reviewTokens: { [projectId]: token } }
 *   → { id, url }   (the same id again for the same learner and course; the name may be updated)
 * Stored in `talino_certificates` (public page: /c/<id>).
 */

import { CAREER_COURSE_INDEX, getCourseIndex } from '@/features/courses/content/course-index';
import { reviewTokenMessage } from '@/features/coach/lib/review';
import { ALL_ACCESS_ENTITLEMENT, courseEntitlement } from '@/features/store/lib/catalog';
import { verifiedEntitlements } from '@/lib/server/entitlements';
import { verify } from '@/lib/server/signing';
import { randomId, table, TableUnavailableError } from '@/lib/server/table';

const MASTER_ID = 'master';
const APP_USER_ID = /^[\w$:.@-]{1,128}$/;

const certificates = () => table('talino_certificates');

function cleanName(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, 60) : '';
}

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
  const appUserId = typeof body.appUserId === 'string' && APP_USER_ID.test(body.appUserId) ? body.appUserId : null;
  const learnerName = cleanName(body.learnerName);
  const courseId = typeof body.courseId === 'string' ? body.courseId : '';
  if (!appUserId || learnerName.length < 2) return Response.json({ error: 'bad_request' }, { status: 400 });

  const master = courseId === MASTER_ID;
  const course = master ? null : getCourseIndex(courseId);
  if (!master && (!course || course.kind === 'mini')) return Response.json({ error: 'bad_request' }, { status: 400 });

  try {
    let projects: string[] = [];
    let title: string;
    if (master) {
      const mine = await certificates().select({ app_user_id: appUserId });
      const have = new Set(mine.map((row) => row.course_id));
      if (!CAREER_COURSE_INDEX.every((career) => have.has(career.id))) return Response.json({ error: 'courses_missing' }, { status: 409 });
      title = 'Talino Master';
      projects = CAREER_COURSE_INDEX.map((career) => career.title);
    } else if (course) {
      if (course.kind !== 'starter') {
        const entitlements = await verifiedEntitlements(appUserId, body.entitlements);
        if (!entitlements.includes(ALL_ACCESS_ENTITLEMENT) && !entitlements.includes(courseEntitlement(course.id))) return Response.json({ error: 'course_required' }, { status: 403 });
      }
      const tokens = (typeof body.reviewTokens === 'object' && body.reviewTokens !== null ? body.reviewTokens : {}) as Record<string, unknown>;
      for (const project of course.projects) {
        if (!(await verify(reviewTokenMessage(project.id, appUserId), tokens[project.id]))) return Response.json({ error: 'reviews_missing', projectId: project.id }, { status: 409 });
      }
      title = course.title;
      projects = course.projects.map((project) => project.title);
    } else {
      return Response.json({ error: 'bad_request' }, { status: 400 });
    }

    const [existing] = await certificates().select({ app_user_id: appUserId, course_id: master ? MASTER_ID : courseId }, { limit: 1 });
    if (existing) {
      if (existing.learner_name !== learnerName) await certificates().update({ id: String(existing.id) }, { learner_name: learnerName });
      return Response.json({ id: existing.id, issuedAt: existing.issued_at });
    }
    const id = randomId(10);
    const issuedAt = new Date().toISOString();
    await certificates().insert({ id, app_user_id: appUserId, course_id: master ? MASTER_ID : courseId, course_title: title, learner_name: learnerName, projects, issued_at: issuedAt });
    return Response.json({ id, issuedAt });
  } catch (error) {
    if (error instanceof TableUnavailableError) return Response.json({ error: 'unavailable' }, { status: 503 });
    throw error;
  }
}
