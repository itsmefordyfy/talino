import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { POST } from '@/app/api/resume+api';

import { resetChatQuotaMemory } from './ai-chat-quota';
import { resetEntitlementCache } from './entitlements';
import { resetModelRest } from './gemini';
import { resetGlobalCapMemory } from './global-cap';

/** The résumé route's template mode (a message template drafted for one situation) with Gemini stubbed. */
describe('resume route: template mode', () => {
  const env = { ...process.env };
  const fetchMock = jest.fn<typeof fetch>();
  const gemini = (value: unknown) => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(value) }] } }], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 } }), { status: 200 });
  let id = 0;
  const post = (body: Record<string, unknown>, entitlements: string[] = ['talino_pro']) =>
    POST(new Request('http://localhost/api/resume', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ deviceId: 'device-template', appUserId: 'usertemplate', entitlements, requestId: `req-${String(++id).padStart(8, '0')}`, language: 'en', ...body }) }));
  const request = {
    mode: 'template',
    kind: 'cover letter',
    draft: 'Dear [hiring manager],\n\nI’m applying for the [role] role at [company]. I work with React. {{portfolioLink}}\n\nSincerely,\n{{name}}',
    details: 'Junior Mobile Developer at Acme Labs.',
    tone: 'professional',
    language: 'en',
  };
  const answer = { text: 'Dear [hiring manager],\n\nI’m applying for the Junior Mobile Developer role at Acme Labs. I work with React. {{portfolioLink}}\n\nSincerely,\n{{name}}', questions: ['Who is the hiring manager?'] };

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

  test('returns a checked draft with the tokens kept', async () => {
    const response = await post(request);
    expect(response.status).toBe(200);
    const body = (await response.json()) as { draft: { text: string; questions: string[] } };
    expect(body.draft.text).toContain('Acme Labs');
    expect(body.draft.text).toContain('{{name}}');
    expect(body.draft.questions).toEqual(['Who is the hiring manager?']);
  });

  test('asks for the chosen tone, and the notes go as data', async () => {
    await post({ ...request, tone: 'short' });
    const sent = JSON.parse(String(fetchMock.mock.calls[0][1]?.body)) as { systemInstruction: { parts: { text: string }[] }; contents: { parts: { text: string }[] }[] };
    expect(sent.systemInstruction.parts[0].text).toMatch(/at most 90 words/);
    expect(sent.contents[0].parts.map((part) => part.text).join('\n')).toContain('Acme Labs');
  });

  test('needs All-Access, and is refused before Gemini is asked', async () => {
    const response = await post(request, ['course_developer']);
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('a request with no template text is a bad request', async () => {
    expect((await post({ ...request, draft: '' })).status).toBe(400);
    expect((await post({ ...request, kind: '' })).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('a draft that invents a figure is refused (502)', async () => {
    fetchMock.mockImplementation(async () => gemini({ ...answer, text: `${answer.text}\nI have 9000 followers.` }));
    expect((await post(request)).status).toBe(502);
  });
});
