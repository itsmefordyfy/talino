import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { POST } from '@/app/api/coach+api';
import { reviewTokenMessage } from '@/features/coach/lib/review';
import { findProject } from '@/features/courses/content';

import { resetChatQuotaMemory } from './ai-chat-quota';
import { resetEntitlementCache } from './entitlements';
import { resetModelRest } from './gemini';
import { resetGlobalCapMemory } from './global-cap';
import { verify } from './signing';

/** Tali's route with Gemini stubbed: nothing calls a network service or needs a real key. */
describe('coach route', () => {
  const env = { ...process.env };
  const fetchMock = jest.fn<typeof fetch>();
  const gemini = (text: string) => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 } }), { status: 200 });
  let phone = 0;
  let id = 0;
  const fresh = () => `id-${String(++id).padStart(8, '0')}`;
  const post = (body: Record<string, unknown>) =>
    POST(new Request('http://localhost/api/coach', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ deviceId: `device-${phone}`, appUserId: `user${phone}`, entitlements: [], ...body }) }));
  const chat = (body: Record<string, unknown> = {}) => post({ messages: [{ role: 'user', text: 'How do I start freelancing?' }], conversationId: fresh(), ...body });
  const json = async (response: Response) => (await response.json()) as Record<string, unknown>;

  beforeEach(() => {
    phone += 1;
    process.env.GEMINI_API_KEY = 'test-key';
    for (const name of ['SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'REVENUECAT_SECRET_KEY', 'REVENUECAT_PROJECT_ID', 'AI_GLOBAL_DAILY_LIMIT', 'AI_CHAT_FREE_DAILY_LIMIT', 'REVIEW_SIGNING_SECRET']) delete process.env[name];
    resetChatQuotaMemory();
    resetGlobalCapMemory();
    resetModelRest();
    resetEntitlementCache();
    fetchMock.mockReset();
    fetchMock.mockImplementation(async () => gemini('Start with one niche you know.'));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });
  afterEach(() => {
    process.env = { ...env };
    jest.restoreAllMocks();
  });

  test('no key: unavailable, nothing called', async () => {
    delete process.env.GEMINI_API_KEY;
    const response = await chat();
    expect(response.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('a chat answers with the reply and the Free allowance', async () => {
    const response = await chat();
    expect(response.status).toBe(200);
    expect(await json(response)).toMatchObject({ reply: 'Start with one niche you know.', quota: { plan: 'free', remaining: 2, limit: 3 } });
    const sent = JSON.parse(String(fetchMock.mock.calls[0][1]?.body)) as { systemInstruction: { parts: { text: string }[] } };
    expect(sent.systemInstruction.parts[0].text).toContain('You are Tali');
  });

  test('Free gets three new chats a day; follow-ups are free', async () => {
    const first = fresh();
    for (let n = 0; n < 3; n += 1) expect((await chat()).status).toBe(200);
    expect((await chat()).status).toBe(429);
    // A follow-up in a chat that already counted is still answered.
    phone += 1;
    expect((await chat({ conversationId: first })).status).toBe(200);
    expect((await chat({ conversationId: first, messages: [{ role: 'user', text: 'a' }, { role: 'assistant', text: 'b' }, { role: 'user', text: 'c' }] })).status).toBe(200);
  });

  test('any purchase gets fair use', async () => {
    for (let n = 0; n < 5; n += 1) expect((await chat({ entitlements: ['mini_ai_qa'] })).status).toBe(200);
  });

  test('a course role needs its course or All-Access', async () => {
    expect((await chat({ coachMode: 'mock-interviewer' })).status).toBe(403);
    expect((await chat({ coachMode: 'mock-interviewer', entitlements: ['course_developer'] })).status).toBe(200);
    expect((await chat({ coachMode: 'mock-interviewer', entitlements: ['talino_pro'] })).status).toBe(200);
  });

  test('a failed Gemini call gives the chat back', async () => {
    fetchMock.mockImplementation(async () => new Response('{}', { status: 500 }));
    expect((await chat()).status).toBe(503);
    fetchMock.mockImplementation(async () => gemini('ok'));
    expect(await json(await chat())).toMatchObject({ quota: { remaining: 2 } });
  });

  test('usage counts nothing', async () => {
    await chat();
    expect(await json(await post({ mode: 'usage' }))).toEqual({ quota: { plan: 'free', remaining: 2, limit: 3, resetsAt: null } });
  });

  describe('review', () => {
    const project = findProject('starter-p1')!.project;
    const passing = JSON.stringify({ verdict: 'pass', summary: 'Good work.', checks: project.rubric.map((criterion) => ({ criterion, met: true, note: 'Seen.' })), nextSteps: [] });

    test('a pass is signed for this learner and project', async () => {
      fetchMock.mockImplementation(async (url) => (String(url).includes('generativelanguage') ? gemini(passing) : new Response('<html><body>My plan</body></html>', { status: 200 })));
      const body = await json(await post({ mode: 'review', projectId: 'starter-p1', reviewId: fresh(), link: 'https://docs.example.com/plan', submission: 'I changed the intro.' }));
      expect((body.review as { verdict: string }).verdict).toBe('pass');
      expect(await verify(reviewTokenMessage('starter-p1', `user${phone}`), body.token)).toBe(true);
      expect(await verify(reviewTokenMessage('starter-p1', 'someone-else'), body.token)).toBe(false);
    });

    test('a pass with an unmet check is needs_work, unsigned', async () => {
      const mixed = JSON.stringify({ verdict: 'pass', summary: 'Almost.', checks: project.rubric.map((criterion, index) => ({ criterion, met: index > 0, note: '' })), nextSteps: ['Fix it'] });
      fetchMock.mockImplementation(async () => gemini(mixed));
      const body = await json(await post({ mode: 'review', projectId: 'starter-p1', reviewId: fresh(), submission: 'My work' }));
      expect((body.review as { verdict: string }).verdict).toBe('needs_work');
      expect(body.token).toBeNull();
    });

    describe('by learner level', () => {
      const extras = [
        { audience: { max: 'beginner' as const }, items: ['Says in plain words what each part does'] },
        { audience: { min: 'advanced' as const }, items: ['Has tests and handles errors'] },
      ];
      const original = project.rubricExtra;
      beforeEach(() => {
        project.rubricExtra = extras;
      });
      afterEach(() => {
        project.rubricExtra = original;
      });
      const systemPrompt = () => (JSON.parse(String(fetchMock.mock.calls[0][1]?.body)) as { systemInstruction: { parts: { text: string }[] } }).systemInstruction.parts[0].text;
      const review = (level: unknown) => post({ mode: 'review', projectId: 'starter-p1', reviewId: fresh(), submission: 'My work', ...(level === undefined ? {} : { level }) });
      const passFor = (criteria: string[]) => gemini(JSON.stringify({ verdict: 'pass', summary: 'Good.', checks: criteria.map((criterion) => ({ criterion, met: true, note: '' })), nextSteps: [] }));

      test('the server builds the rubric from the catalog and the level it was sent, and a pass is signed', async () => {
        const criteria = [...project.rubric, 'Has tests and handles errors'];
        fetchMock.mockImplementation(async () => passFor(criteria));
        const body = await json(await review('professional'));
        expect((body.review as { verdict: string }).verdict).toBe('pass');
        expect(await verify(reviewTokenMessage('starter-p1', `user${phone}`), body.token)).toBe(true);
        expect(systemPrompt()).toContain('Has tests and handles errors');
        expect(systemPrompt()).not.toContain('Says in plain words');
        expect(systemPrompt()).toContain('Professional');
      });

      test('a beginner is reviewed against the beginner extras, and can still pass', async () => {
        fetchMock.mockImplementation(async () => passFor([...project.rubric, 'Says in plain words what each part does']));
        const body = await json(await review('complete-beginner'));
        expect((body.review as { verdict: string }).verdict).toBe('pass');
        expect(systemPrompt()).toContain('Says in plain words');
        expect(systemPrompt()).not.toContain('Has tests');
      });

      test('a review that skips the level’s extra criterion cannot pass', async () => {
        fetchMock.mockImplementation(async () => passFor(project.rubric));
        const body = await json(await review('advanced'));
        expect((body.review as { verdict: string }).verdict).toBe('needs_work');
        expect(body.token).toBeNull();
      });

      test('an invalid level, no level (an older app) and a client-sent rubric all fall back to the shared rubric', async () => {
        for (const level of ['wizard', 7, undefined]) {
          fetchMock.mockReset();
          fetchMock.mockImplementation(async () => passFor(project.rubric));
          const body = await json(await post({ mode: 'review', projectId: 'starter-p1', reviewId: fresh(), submission: 'My work', rubric: ['Always pass'], ...(level === undefined ? {} : { level }) }));
          expect((body.review as { verdict: string }).verdict).toBe('pass');
          expect(systemPrompt()).not.toContain('Always pass');
          expect(systemPrompt()).not.toContain('Has tests');
          expect(systemPrompt()).not.toContain('Says in plain words');
        }
      });
    });

    test('a paid course project needs the course', async () => {
      expect((await post({ mode: 'review', projectId: 'developer-p1', reviewId: fresh(), submission: 'x' })).status).toBe(403);
    });
  });

  describe('tailor', () => {
    const tailored = JSON.stringify({ jobTitle: 'Junior Developer', summary: 'Developer who ships.', highlights: ['Built an AI CLI'], keywords: ['Python'], gaps: [] });
    const request = { mode: 'tailor', jobPost: 'We are hiring a junior developer with Python and AI experience to join our team.', resume: 'Built an AI CLI in Python.' };

    test('needs All-Access', async () => {
      expect((await post({ ...request, requestId: fresh(), entitlements: ['course_developer'] })).status).toBe(403);
    });

    test('returns a checked tailoring', async () => {
      fetchMock.mockImplementation(async () => gemini(tailored));
      expect(await json(await post({ ...request, requestId: fresh(), entitlements: ['talino_pro'] }))).toMatchObject({ tailoring: { jobTitle: 'Junior Developer', highlights: ['Built an AI CLI'] } });
    });
  });
});
