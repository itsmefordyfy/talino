import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { POST } from '@/app/api/interview+api';
import { COURSES } from '@/features/courses/content';
import { CATEGORY_IDS } from '@/features/interview/lib/report';

import { resetChatQuotaMemory } from './ai-chat-quota';
import { resetEntitlementCache } from './entitlements';
import { resetModelRest } from './gemini';
import { resetGlobalCapMemory } from './global-cap';

/** The interview route with Gemini stubbed: nothing calls a network service or needs a real key. */
describe('interview route', () => {
  const env = { ...process.env };
  const fetchMock = jest.fn<typeof fetch>();
  const gemini = (value: unknown, finishReason = 'STOP') => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: typeof value === 'string' ? value : JSON.stringify(value) }] }, finishReason }], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 } }), { status: 200 });
  const turnJson = (overrides: Record<string, unknown> = {}) => ({ reply: 'Tell me about a mobile app you built.', kind: 'opening', topic: 'Experience', notes: 'Just started.', ...overrides });
  const course = COURSES[0];
  const reportJson = (overrides: Record<string, unknown> = {}) => ({
    summary: 'You explained your project well but the sync answer was thin.',
    categories: CATEGORY_IDS.map((id, index) => ({ id, score: 60 + index * 2, feedback: `Because of ${id}.` })),
    answers: [
      { turn: 1, question: 'Tell me about your app.', score: 4, why: 'Clear and specific.', improvedKind: 'answer', improved: 'Add the result.' },
      { turn: 2, question: 'How did you sync?', score: 2, why: 'No detail.', improvedKind: 'outline', improved: 'Explain conflicts [add your real approach].' },
    ],
    skills: [
      { skill: 'Offline data', why: 'Sync was vague.', courseId: course.id },
      { skill: 'Invented', why: 'x', courseId: 'no-such-course' },
    ],
    nextSteps: ['Practise STAR answers.'],
    ...overrides,
  });

  let phone = 0;
  let id = 0;
  const fresh = () => `iv-${String(++id).padStart(8, '0')}`;
  const setup = { position: 'React Native Developer', type: 'react-native', level: 'junior', difficulty: 'standard', style: 'realistic', length: 'standard', useProfile: true };
  const post = (body: Record<string, unknown>) =>
    POST(new Request('http://localhost/api/interview', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ deviceId: `device-${phone}`, appUserId: `user${phone}`, entitlements: [], setup, interviewId: fresh(), ...body }) }));
  const json = async (response: Response) => (await response.json()) as Record<string, unknown>;
  const sentBody = (call = 0) => JSON.parse(String(fetchMock.mock.calls[call][1]?.body)) as { systemInstruction: { parts: { text: string }[] }; contents: { role: string; parts: { text: string }[] }[] };

  const opening = (body: Record<string, unknown> = {}) => post({ mode: 'turn', answered: 0, asked: 0, messages: [], ...body });
  const reply = (body: Record<string, unknown> = {}) =>
    post({ mode: 'turn', answered: 1, asked: 1, messages: [{ role: 'assistant', text: 'Tell me about your app.' }, { role: 'user', text: 'I built a pet app with Expo.' }], ...body });
  const transcript = [
    { role: 'assistant', text: 'Tell me about your app.' },
    { role: 'user', text: 'I built a pet app with Expo.' },
    { role: 'assistant', text: 'How did you sync data?' },
    { role: 'user', text: 'It syncs when online.' },
    { role: 'assistant', text: 'Thanks, that is all.' },
  ];

  beforeEach(() => {
    phone += 1;
    process.env.GEMINI_API_KEY = 'test-key';
    for (const name of ['SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'REVENUECAT_SECRET_KEY', 'REVENUECAT_PROJECT_ID', 'AI_GLOBAL_DAILY_LIMIT', 'INTERVIEW_FREE_DAILY_LIMIT', 'INTERVIEW_PRO_DAILY_LIMIT']) delete process.env[name];
    resetChatQuotaMemory();
    resetGlobalCapMemory();
    resetModelRest();
    resetEntitlementCache();
    fetchMock.mockReset();
    fetchMock.mockImplementation(async () => gemini(turnJson()));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });
  afterEach(() => {
    process.env = { ...env };
    jest.restoreAllMocks();
  });

  test('no key: unavailable, nothing called', async () => {
    delete process.env.GEMINI_API_KEY;
    expect((await opening()).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('a request with no position, no interview id or an unknown mode is refused before Gemini', async () => {
    expect((await opening({ setup: { ...setup, position: ' ' } })).status).toBe(400);
    expect((await opening({ interviewId: 'x' })).status).toBe(400);
    expect((await post({ mode: 'chat' })).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('the opening starts from the candidate, carries the setup in the instructions and returns the turn', async () => {
    const response = await opening({ setup: { ...setup, companion: 'tala' } });
    expect(response.status).toBe(200);
    expect(await json(response)).toEqual({ turn: { reply: 'Tell me about a mobile app you built.', kind: 'opening', topic: 'Experience', notes: 'Just started.' } });
    const sent = sentBody();
    expect(sent.contents).toHaveLength(1);
    expect(sent.contents[0].role).toBe('user');
    expect(sent.systemInstruction.parts[0].text).toContain('You are Tala');
    expect(sent.systemInstruction.parts[0].text).toContain('React Native Developer');
    expect(sent.systemInstruction.parts[0].text).toContain('OPENING turn');
  });

  test('a later turn sends the history, the notes and how far along it is, and follows up on what was said', async () => {
    fetchMock.mockImplementation(async () => gemini(turnJson({ reply: 'How did you handle offline sync?', kind: 'follow_up', notes: 'Q1 pet app: Expo, offline.' })));
    const response = await reply({ notes: 'Q1 pet app: Expo.', followUps: 0 });
    expect(await json(response)).toMatchObject({ turn: { kind: 'follow_up', reply: 'How did you handle offline sync?' } });
    const sent = sentBody();
    // The history began with the interviewer, so the candidate leads the conversation.
    expect(sent.contents[0]).toMatchObject({ role: 'user' });
    expect(sent.contents[sent.contents.length - 1]).toMatchObject({ role: 'user', parts: [{ text: 'I built a pet app with Expo.' }] });
    expect(sent.systemInstruction.parts[0].text).toContain('Q1 pet app: Expo.');
    expect(sent.systemInstruction.parts[0].text).toContain('Questions asked so far: 1 of 7');
  });

  test('after the last planned question it asks the model to close', async () => {
    await reply({ asked: 7, answered: 7 });
    expect(sentBody().systemInstruction.parts[0].text).toContain('CLOSE the interview');
  });

  test('a turn that is not an answer to the interviewer is refused', async () => {
    expect((await post({ mode: 'turn', answered: 1, messages: [{ role: 'assistant', text: 'Question?' }] })).status).toBe(400);
  });

  test('a Tagalog interview is held in Tagalog', async () => {
    await opening({ setup: { ...setup, language: 'fil' } });
    expect(sentBody().systemInstruction.parts[0].text).toContain('Tagalog');
  });

  test('the résumé reaches the model only when the learner allows it', async () => {
    const interviewId = fresh();
    await reply({ interviewId, candidate: 'Skills: Expo, SQLite' });
    expect(sentBody().systemInstruction.parts[0].text).toContain('Skills: Expo, SQLite');
    fetchMock.mockClear();
    await reply({ interviewId, candidate: 'Skills: Expo, SQLite', setup: { ...setup, useProfile: false } });
    expect(sentBody().systemInstruction.parts[0].text).not.toContain('Skills: Expo, SQLite');
  });

  test('Free gets one new interview a day; its later answers and its evaluation are free', async () => {
    const first = fresh();
    expect((await opening({ interviewId: first })).status).toBe(200);
    const limited = await opening();
    expect(limited.status).toBe(429);
    expect(await json(limited)).toMatchObject({ error: 'interview_limit' });
    // The interview already begun carries on.
    expect((await reply({ interviewId: first })).status).toBe(200);
  });

  test('a purchase gets fair use', async () => {
    for (let n = 0; n < 4; n += 1) expect((await opening({ entitlements: ['talino_pro'] })).status).toBe(200);
  });

  test('a failed Gemini call or an unreadable turn gives the interview back', async () => {
    fetchMock.mockImplementation(async () => new Response('{}', { status: 500 }));
    expect((await opening()).status).toBe(503);
    fetchMock.mockImplementation(async () => gemini('this is not json'));
    expect((await opening()).status).toBe(502);
    fetchMock.mockImplementation(async () => gemini(turnJson()));
    expect((await opening()).status).toBe(200);
  });

  test('an interview can take only so many answers', async () => {
    expect((await reply({ answered: 41 })).status).toBe(409);
  });

  test('the evaluation scores every category, keeps the average as the overall and drops a course that does not exist', async () => {
    fetchMock.mockImplementation(async () => gemini(reportJson()));
    const response = await post({ mode: 'report', messages: transcript });
    expect(response.status).toBe(200);
    const { report } = (await json(response)) as { report: { overall: number; rating: string; categories: unknown[]; answers: { turn: number; verdict: string }[]; skills: { courseId: string | null }[] } };
    const scores = CATEGORY_IDS.map((_, index) => 60 + index * 2);
    expect(report.overall).toBe(Math.round(scores.reduce((a, b) => a + b, 0) / scores.length));
    expect(report.rating).toBe('fair');
    expect(report.categories).toHaveLength(CATEGORY_IDS.length);
    expect(report.answers.map((answer) => [answer.turn, answer.verdict])).toEqual([[1, 'strong'], [2, 'weak']]);
    expect(report.skills.map((skill) => skill.courseId)).toEqual([course.id, null]);
    // The transcript is numbered and the courses are the real ones.
    const sent = sentBody();
    expect(sent.contents[0].parts[0].text).toContain('Candidate, answer 2: It syncs when online.');
    expect(sent.systemInstruction.parts[0].text).toContain(`${course.id}: ${course.title}`);
    expect(sent.systemInstruction.parts[0].text).toContain('answers numbered from 1 to 2');
  });

  test('too few answers is an honest "too short", and Gemini is never asked', async () => {
    const response = await post({ mode: 'report', messages: transcript.slice(0, 2) });
    expect(response.status).toBe(400);
    expect(await json(response)).toEqual({ error: 'too_short' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('an evaluation the model got wrong is not shown as a score', async () => {
    fetchMock.mockImplementation(async () => gemini(reportJson({ categories: [] })));
    expect((await post({ mode: 'report', messages: transcript })).status).toBe(502);
    fetchMock.mockImplementation(async () => gemini(reportJson({ answers: [] })));
    expect((await post({ mode: 'report', messages: transcript })).status).toBe(502);
  });
});
