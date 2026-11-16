import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { GET as certificatePage } from '@/app/c/[id]+api';
import { POST as certificates } from '@/app/api/certificates+api';
import { POST as classes } from '@/app/api/classes+api';
import { POST as portfolio } from '@/app/api/portfolio+api';
import { POST as referrals } from '@/app/api/referrals+api';
import { POST as webhook } from '@/app/api/revenuecat-webhook+api';
import { GET as portfolioPage } from '@/app/p/[slug]+api';
import { GET as teacherPage } from '@/app/teacher/[code]+api';
import { reviewTokenMessage } from '@/features/coach/lib/review';
import { findProject } from '@/features/courses/content';

import { resetEntitlementCache } from './entitlements';
import { sign } from './signing';
import { resetTableMemory, sha256, table } from './table';

const post = (handler: (request: Request) => Promise<Response>, body: Record<string, unknown>, headers: Record<string, string> = {}) =>
  handler(new Request('http://localhost/x', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) }));
const json = async (response: Response) => (await response.json()) as Record<string, unknown>;

const env = { ...process.env };
const fetchMock = jest.fn<typeof fetch>();
beforeEach(() => {
  for (const name of ['SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'REVENUECAT_SECRET_KEY', 'REVENUECAT_PROJECT_ID', 'REVENUECAT_V1_SECRET_KEY', 'REVENUECAT_WEBHOOK_AUTH', 'REVIEW_SIGNING_SECRET']) delete process.env[name];
  resetTableMemory();
  resetEntitlementCache();
  fetchMock.mockReset();
  fetchMock.mockImplementation(async () => new Response('{}', { status: 201 }));
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  jest.spyOn(console, 'error').mockImplementation(() => undefined);
});
afterEach(() => {
  process.env = { ...env };
  jest.restoreAllMocks();
});

describe('certificates', () => {
  const tokenFor = async (projectId: string, user: string) => sign(reviewTokenMessage(projectId, user));

  test('the starter certificate needs its signed project review, then has a public page', async () => {
    expect((await post(certificates, { courseId: 'starter', learnerName: 'Ana Cruz', appUserId: 'u1', reviewTokens: {} })).status).toBe(409);
    const issued = await json(await post(certificates, { courseId: 'starter', learnerName: 'Ana Cruz', appUserId: 'u1', reviewTokens: { 'starter-p1': await tokenFor('starter-p1', 'u1') } }));
    expect(typeof issued.id).toBe('string');
    // The same learner and course gets the same certificate.
    const again = await json(await post(certificates, { courseId: 'starter', learnerName: 'Ana C.', appUserId: 'u1', reviewTokens: { 'starter-p1': await tokenFor('starter-p1', 'u1') } }));
    expect(again.id).toBe(issued.id);
    const page = await certificatePage(new Request('http://localhost/c/x'), { id: String(issued.id) });
    const html = await page.text();
    expect(html).toContain('Ana C.');
    expect(html).toContain(findProject('starter-p1')!.project.title.replace(/&/g, '&amp;'));
  });

  test("someone else's review token doesn't count", async () => {
    expect((await post(certificates, { courseId: 'starter', learnerName: 'Ben', appUserId: 'u2', reviewTokens: { 'starter-p1': await tokenFor('starter-p1', 'u1') } })).status).toBe(409);
  });

  test('a paid course needs the course', async () => {
    expect((await post(certificates, { courseId: 'developer', learnerName: 'Ana', appUserId: 'u1', entitlements: [] })).status).toBe(403);
  });

  test('Talino Master needs every career course', async () => {
    expect((await post(certificates, { courseId: 'master', learnerName: 'Ana', appUserId: 'u1' })).status).toBe(409);
  });
});

describe('portfolio', () => {
  test('publish, update with the token only, remove', async () => {
    const created = await json(await post(portfolio, { action: 'publish', portfolio: { name: 'Ana Cruz', headline: 'Junior dev', links: [{ label: 'GitHub', url: 'https://github.com/ana' }, { label: 'Bad', url: 'javascript:alert(1)' }] }, talent: true, contactEmail: 'ana@example.com' }));
    expect(created.slug).toMatch(/^ana-cruz-/);
    expect(typeof created.editToken).toBe('string');
    const page = await (await portfolioPage(new Request('http://localhost'), { slug: String(created.slug) })).text();
    expect(page).toContain('https://github.com/ana');
    expect(page).not.toContain('javascript:');
    expect((await post(portfolio, { action: 'publish', slug: created.slug, editToken: 'x'.repeat(32), portfolio: { name: 'Hacker' } })).status).toBe(403);
    expect((await post(portfolio, { action: 'publish', slug: created.slug, editToken: created.editToken, portfolio: { name: 'Ana C.' } })).status).toBe(200);
    expect(await json(await post(portfolio, { action: 'remove', slug: created.slug, editToken: created.editToken }))).toEqual({ removed: true });
    expect((await portfolioPage(new Request('http://localhost'), { slug: String(created.slug) })).status).toBe(404);
  });

  test('HTML in a name is escaped', async () => {
    const created = await json(await post(portfolio, { action: 'publish', portfolio: { name: '<script>x</script> Ana' } }));
    const page = await (await portfolioPage(new Request('http://localhost'), { slug: String(created.slug) })).text();
    expect(page).not.toContain('<script>x');
  });
});

describe('classes', () => {
  beforeEach(async () => {
    await table('talino_classes').insert({ code: 'BSIT4A', name: 'BSIT 4-A', course_ids: ['developer'], seats: 1, seat_duration: 'yearly', teacher_key_hash: await sha256('teacher-key-1234567890'), active: true });
  });

  test('joining grants the courses and takes a seat; a full class refuses', async () => {
    process.env.REVENUECAT_V1_SECRET_KEY = 'sk_test';
    const joined = await json(await post(classes, { action: 'join', code: 'bsit4a', appUserId: 'u1', learnerName: 'Ana' }));
    expect(joined.class).toMatchObject({ code: 'BSIT4A', courseIds: ['developer'] });
    expect(String(fetchMock.mock.calls[0][0])).toContain('/subscribers/u1/entitlements/course_developer/promotional');
    expect((await post(classes, { action: 'join', code: 'BSIT4A', appUserId: 'u2' })).status).toBe(409);
    expect((await post(classes, { action: 'progress', code: 'BSIT4A', appUserId: 'u1', progress: [{ courseId: 'developer', lessonsDone: 3, lessonsTotal: 20, projectsPassed: 0, projectsTotal: 3, complete: false }, { courseId: 'educator', lessonsDone: 9 }] })).status).toBe(200);
    const page = await (await teacherPage(new Request('http://localhost/teacher/BSIT4A?key=teacher-key-1234567890'), { code: 'BSIT4A' })).text();
    expect(page).toContain('3/20 lessons');
    expect((await teacherPage(new Request('http://localhost/teacher/BSIT4A?key=wrong-key-123456789'), { code: 'BSIT4A' })).status).toBe(403);
  });

  test('without the RevenueCat write key nothing is granted and no seat is taken', async () => {
    expect((await post(classes, { action: 'join', code: 'BSIT4A', appUserId: 'u1' })).status).toBe(503);
    expect(await table('talino_class_members').select({ code: 'BSIT4A' })).toHaveLength(0);
  });
});

describe('referrals', () => {
  test('a code, a redemption, and the reward after the first purchase', async () => {
    process.env.REVENUECAT_V1_SECRET_KEY = 'sk_test';
    process.env.REVENUECAT_WEBHOOK_AUTH = 'Bearer hook';
    const { code } = await json(await post(referrals, { action: 'code', appUserId: 'ref' }));
    expect((await post(referrals, { action: 'redeem', code, appUserId: 'ref' })).status).toBe(409);
    expect((await post(referrals, { action: 'redeem', code, appUserId: 'friend' })).status).toBe(200);
    expect((await post(referrals, { action: 'redeem', code, appUserId: 'friend' })).status).toBe(409);
    expect((await post(webhook, { event: { type: 'INITIAL_PURCHASE', app_user_id: 'friend' } })).status).toBe(403);
    expect((await post(webhook, { event: { type: 'NON_RENEWING_PURCHASE', app_user_id: 'friend' } }, { authorization: 'Bearer hook' })).status).toBe(200);
    expect(String(fetchMock.mock.calls[0][0])).toContain('/subscribers/ref/entitlements/mini_ai_engineering/promotional');
    // Rewarded once.
    await post(webhook, { event: { type: 'NON_RENEWING_PURCHASE', app_user_id: 'friend' } }, { authorization: 'Bearer hook' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
