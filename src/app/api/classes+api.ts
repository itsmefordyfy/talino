/**
 * Schools and companies (the business plan's licences and course seats). A class is a row in
 * `talino_classes` the owner creates in the SQL Editor: a code, a name, its courses, seats, a seat
 * duration and a hashed teacher key. A learner joins with the code: the server takes a seat and
 * grants the class's courses through RevenueCat (promotional entitlements). Joining also shares the
 * learner's course progress with the class's teacher (said on the join screen), sent by the app
 * with `action: 'progress'`.
 *
 * POST { action: 'join', code, appUserId, learnerName }      → { class: { code, name, courseIds } }
 * POST { action: 'progress', code, appUserId, progress }      → { ok: true }
 * POST { action: 'leave', code, appUserId }                   → { ok: true } (stops sharing; courses stay)
 */

import { getCourseIndex } from '@/features/courses/content/course-index';
import { courseEntitlement } from '@/features/store/lib/catalog';
import { GRANT_DURATIONS, grantEntitlement, type GrantDuration } from '@/lib/server/grants';
import { table, TableUnavailableError } from '@/lib/server/table';

const APP_USER_ID = /^[\w$:.@-]{1,128}$/;
const CODE = /^[A-Z0-9]{4,12}$/;

const classes = () => table('talino_classes');
const members = () => table('talino_class_members');

type ProgressEntry = { courseId: string; lessonsDone: number; lessonsTotal: number; projectsPassed: number; projectsTotal: number; complete: boolean };

function cleanProgress(value: unknown, allowed: readonly string[]): ProgressEntry[] {
  return (Array.isArray(value) ? value : [])
    .map((entry) => (typeof entry === 'object' && entry !== null ? (entry as Record<string, unknown>) : {}))
    .filter((entry) => typeof entry.courseId === 'string' && allowed.includes(entry.courseId))
    .map((entry) => ({
      courseId: entry.courseId as string,
      lessonsDone: Math.max(0, Math.min(100, Number(entry.lessonsDone) || 0)),
      lessonsTotal: Math.max(0, Math.min(100, Number(entry.lessonsTotal) || 0)),
      projectsPassed: Math.max(0, Math.min(20, Number(entry.projectsPassed) || 0)),
      projectsTotal: Math.max(0, Math.min(20, Number(entry.projectsTotal) || 0)),
      complete: entry.complete === true,
    }));
}

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
  const appUserId = typeof body.appUserId === 'string' && APP_USER_ID.test(body.appUserId) ? body.appUserId : null;
  if (!CODE.test(code) || !appUserId) return Response.json({ error: 'bad_request' }, { status: 400 });

  try {
    const [found] = await classes().select({ code, active: true }, { limit: 1 });
    if (!found) return Response.json({ error: 'class_not_found' }, { status: 404 });
    const courseIds = (Array.isArray(found.course_ids) ? found.course_ids : []).filter((id): id is string => typeof id === 'string' && !!getCourseIndex(id));
    const [member] = await members().select({ code, app_user_id: appUserId }, { limit: 1 });

    if (body.action === 'progress') {
      if (!member) return Response.json({ error: 'not_member' }, { status: 404 });
      await members().update({ code, app_user_id: appUserId }, { progress: cleanProgress(body.progress, courseIds), updated_at: new Date().toISOString() });
      return Response.json({ ok: true });
    }
    if (body.action === 'leave') {
      if (member) await members().remove({ code, app_user_id: appUserId });
      return Response.json({ ok: true });
    }
    if (body.action !== 'join') return Response.json({ error: 'bad_request' }, { status: 400 });

    const info = { code, name: found.name, courseIds };
    if (member) return Response.json({ class: info });
    if (found.expires_at && Date.parse(String(found.expires_at)) < Date.now()) return Response.json({ error: 'class_expired' }, { status: 410 });
    const taken = (await members().select({ code })).length;
    if (taken >= Number(found.seats ?? 0)) return Response.json({ error: 'class_full' }, { status: 409 });

    const duration: GrantDuration = (GRANT_DURATIONS as readonly string[]).includes(String(found.seat_duration)) ? (found.seat_duration as GrantDuration) : 'yearly';
    for (const courseId of courseIds) {
      const result = await grantEntitlement(appUserId, courseEntitlement(courseId), duration);
      if (result !== 'granted') return Response.json({ error: 'grant_failed' }, { status: 503 });
    }
    const learnerName = typeof body.learnerName === 'string' ? body.learnerName.replace(/\s+/g, ' ').trim().slice(0, 60) : '';
    const now = new Date().toISOString();
    await members().insert({ code, app_user_id: appUserId, learner_name: learnerName || 'Learner', progress: [], joined_at: now, updated_at: now });
    return Response.json({ class: info });
  } catch (error) {
    if (error instanceof TableUnavailableError) return Response.json({ error: 'unavailable' }, { status: 503 });
    throw error;
  }
}
