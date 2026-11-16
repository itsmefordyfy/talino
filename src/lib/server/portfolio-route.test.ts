import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { POST } from '@/app/api/resume+api';

import { resetChatQuotaMemory } from './ai-chat-quota';
import { resetEntitlementCache } from './entitlements';
import { resetModelRest } from './gemini';
import { resetGlobalCapMemory } from './global-cap';

/** The résumé route's portfolio mode with Gemini stubbed. */
describe('resume route: portfolio mode', () => {
  const env = { ...process.env };
  const fetchMock = jest.fn<typeof fetch>();
  const gemini = (value: unknown) => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(value) }] } }], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 } }), { status: 200 });
  let id = 0;
  const post = (body: Record<string, unknown>, entitlements: string[] = ['talino_pro']) =>
    POST(new Request('http://localhost/api/resume', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ deviceId: 'device-portfolio', appUserId: 'userportfolio', entitlements, requestId: `req-${String(++id).padStart(8, '0')}`, language: 'en', ...body }) }));
  const request = {
    mode: 'portfolio',
    headline: '',
    about: '',
    skills: ['React'],
    resume: { name: 'Ana', summary: 'Builds apps.' },
    projects: [{ id: 'p1', title: 'Queue app', role: 'Solo developer', tech: ['Expo'], notes: 'Residents take a number from their phone.' }],
    want: { headline: true, about: false, projectIds: ['p1'] },
  };
  const answer = { headline: 'Junior developer · Expo', about: '', projects: [{ id: 'p1', summary: 'A queue app for residents.', description: 'Residents take a number from their phone.' }], questions: ['How many people use it?'] };

  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-key';
    for (const name of ['SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'REVENUECAT_SECRET_KEY', 'REVENUECAT_PROJECT_ID', 'AI_GLOBAL_DAILY_LIMIT']) delete process.env[name];
    resetChatQuotaMemory();
    resetGlobalCapMemory();
    resetModelRest();
    resetEntitlementCache();
    fetchMock.mockReset();
    fetchMock.mockImplementation(async () => gemini(answer));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });
  afterEach(() => {
    process.env = { ...env };
    jest.restoreAllMocks();
  });

  test('returns a checked draft and counts toward the same allowance as the résumé', async () => {
    const response = await post(request);
    expect(response.status).toBe(200);
    const body = (await response.json()) as { draft: { headline: string; projects: { id: string }[]; questions: string[] } };
    expect(body.draft.headline).toBe('Junior developer · Expo');
    expect(body.draft.projects.map((project) => project.id)).toEqual(['p1']);
    expect(body.draft.questions).toHaveLength(1);
  });

  test('needs All-Access, and is refused before Gemini is asked', async () => {
    const response = await post(request, ['course_developer']);
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('never sends the learner’s contact details to the model', async () => {
    await post({ ...request, resume: { name: 'Ana Cruz', email: 'ana@example.com', phone: '+63 900 111 2222', summary: 'Builds apps.' } });
    const sent = String(fetchMock.mock.calls[0][1]?.body);
    for (const secret of ['ana@example.com', '+63 900 111 2222', 'Ana Cruz']) expect(sent).not.toContain(secret);
  });

  test('asking for nothing is a bad request', async () => {
    expect((await post({ ...request, want: { headline: false, about: false, projectIds: [] } })).status).toBe(400);
  });

  test('an answer that invents a figure comes back without that text', async () => {
    fetchMock.mockImplementation(async () => gemini({ ...answer, headline: 'Developer trusted by 10000 users', projects: [{ id: 'p1', summary: 'A queue app.', description: '' }] }));
    const body = (await (await post(request)).json()) as { draft: { headline: string; projects: { summary: string }[] } };
    expect(body.draft.headline).toBe('');
    expect(body.draft.projects[0].summary).toBe('A queue app.');
  });

  test('an answer the checks leave nothing of is a specific error, not a vague failure', async () => {
    fetchMock.mockImplementation(async () => gemini({ headline: 'Trusted by 10000 users at Google', headlineOptions: [], about: '', projects: [], questions: [] }));
    const response = await post({ ...request, want: { headline: true, about: false, projectIds: [] } });
    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({ error: 'draft_unusable' });
  });

  describe('review mode', () => {
    const review = {
      mode: 'portfolio-review',
      headline: 'Junior developer',
      about: 'I build apps.',
      skills: ['React'],
      resume: { name: 'Ana', summary: 'Builds apps.' },
      goal: '',
      level: '',
      linkLabels: [],
      certificates: 0,
      hasPhoto: false,
      projects: [{ id: 'p1', title: 'Queue app', role: 'Solo developer', tech: ['Expo'], summary: 'A queue app.', description: '', shots: 0, hasLink: false }],
    };
    const answerReview = { verdict: 'A start. Add screenshots next.', missing: [{ area: 'screenshots', advice: 'Add one to Queue app.' }], suggestions: [{ kind: 'project_summary', id: 'p1', after: 'A queue app that lets residents take a number from their phone.', reason: 'Clearer.' }], headlineOptions: [], layout: 'Lead with projects.', questions: [] };

    test('returns a checked review and needs All-Access', async () => {
      fetchMock.mockImplementation(async () => gemini(answerReview));
      const response = await post(review);
      expect(response.status).toBe(200);
      const body = (await response.json()) as { review: { verdict: string; suggestions: { kind: string }[] } };
      expect(body.review.verdict).toContain('Add screenshots');
      expect(body.review.suggestions.map((item) => item.kind)).toEqual(['project_summary']);
      fetchMock.mockClear();
      expect((await post(review, ['course_developer'])).status).toBe(403);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    test('asks the model with the portfolio state and no contact details', async () => {
      fetchMock.mockImplementation(async () => gemini(answerReview));
      await post({ ...review, resume: { name: 'Ana Cruz', email: 'ana@example.com', summary: 'Builds apps.' } });
      const sent = String(fetchMock.mock.calls[0][1]?.body);
      expect(sent).toContain('Portfolio state: 1 projects');
      for (const secret of ['ana@example.com', 'Ana Cruz']) expect(sent).not.toContain(secret);
    });
  });

  test('a résumé summary is asked for in résumé style, and the document’s own facts are what the model reads', async () => {
    await post({ ...request, target: 'resume', resume: { name: 'Ana', summary: 'Builds apps.', skills: ['React'], experience: [{ id: 'e1', title: 'Developer', organization: 'Pili Studio', bullets: ['Built five client websites'] }] }, want: { headline: false, about: true, projectIds: [] } });
    const sent = String(fetchMock.mock.calls[0][1]?.body);
    expect(sent).toContain('Write for: résumé');
    expect(sent).toContain('Pili Studio');
  });

  test('improving a description with a chosen style tells the model how', async () => {
    fetchMock.mockImplementation(async () => gemini({ bullets: ['Built five client websites in React.'], reason: 'Clearer.', questions: [] }));
    const response = await post({ mode: 'improve', section: 'experience', title: 'Developer', organization: 'Pili Studio', text: 'built five client websites in React', style: 'concise' });
    expect(response.status).toBe(200);
    expect(String(fetchMock.mock.calls[0][1]?.body)).toContain('Make it more concise');
    fetchMock.mockClear();
    await post({ mode: 'improve', section: 'experience', title: 'Developer', organization: 'Pili Studio', text: 'built five client websites in React', style: 'nonsense' });
    expect(String(fetchMock.mock.calls[0][1]?.body)).not.toContain('How to improve it');
  });
});
