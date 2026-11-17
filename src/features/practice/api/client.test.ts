import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { SCENARIO, TASK } from '../test-support';
import { practiceErrorCode, requestReport, requestReview, requestTurn } from './client';

const mockPost = jest.fn<(path: string, body: Record<string, unknown>, options?: Record<string, unknown>) => Promise<Record<string, unknown>>>();
jest.mock('@/lib/api', () => {
  class ApiError extends Error {
    code: string;
    status: number | null;
    constructor(code: string, status: number | null = null) {
      super(code);
      this.code = code;
      this.status = status;
    }
  }
  return { ApiError, postJson: (path: string, body: Record<string, unknown>, options?: Record<string, unknown>) => mockPost(path, body, options) };
});
// The coach feature's index pulls in screens and the purchases SDK; the practice client only needs its error reading, which lives in its own client file.
jest.mock('@/features/coach', () => jest.requireActual('@/features/coach/api/client'));
jest.mock('@/lib/device-id', () => ({ deviceId: () => 'device-12345678' }));

const identity = { appUserId: 'user-1', entitlements: ['talino_pro'] };
const messages = Array.from({ length: 30 }, (_, index) => ({ role: index % 2 === 0 ? ('user' as const) : ('assistant' as const), text: `m${index}` }));

beforeEach(() => {
  mockPost.mockReset();
});

describe('requestTurn', () => {
  test('sends who is asking, the item and the latest messages only, and returns the partner’s turn', async () => {
    mockPost.mockResolvedValue({ turn: { reply: 'Go on.', end: false } });
    const turn = await requestTurn(identity, { sessionId: 'ps-00000001', itemId: SCENARIO.id, turn: 3, messages });
    expect(turn).toEqual({ reply: 'Go on.', end: false });
    const [path, body] = mockPost.mock.calls[0];
    expect(path).toBe('/api/practice');
    expect(body).toMatchObject({ mode: 'turn', deviceId: 'device-12345678', appUserId: 'user-1', entitlements: ['talino_pro'], sessionId: 'ps-00000001', itemId: SCENARIO.id, turn: 3 });
    expect((body.messages as unknown[]).length).toBe(16);
    expect((body.messages as { text: string }[]).at(-1)?.text).toBe('m29');
  });

  test('nothing but the session, the item and the words is sent: never instructions or the scenario', async () => {
    mockPost.mockResolvedValue({ turn: { reply: 'Go on.', end: false } });
    await requestTurn(identity, { sessionId: 'ps-00000001', itemId: SCENARIO.id, turn: 1, messages: messages.slice(0, 1) });
    expect(Object.keys(mockPost.mock.calls[0][1]).sort()).toEqual(['appUserId', 'deviceId', 'entitlements', 'itemId', 'messages', 'mode', 'sessionId', 'turn']);
  });

  test('a reply that is not a turn is an error', async () => {
    mockPost.mockResolvedValue({ turn: { reply: '', end: false } });
    await expect(requestTurn(identity, { sessionId: 'ps-00000001', itemId: SCENARIO.id, turn: 1, messages: [] })).rejects.toThrow();
    mockPost.mockResolvedValue({});
    await expect(requestTurn(identity, { sessionId: 'ps-00000001', itemId: SCENARIO.id, turn: 1, messages: [] })).rejects.toThrow();
  });

  test('a missing end flag means the conversation goes on', async () => {
    mockPost.mockResolvedValue({ turn: { reply: 'Hm.' } });
    expect(await requestTurn(identity, { sessionId: 'ps-00000001', itemId: SCENARIO.id, turn: 1, messages: [] })).toEqual({ reply: 'Hm.', end: false });
  });
});

describe('requestReport and requestReview', () => {
  test('the debrief is read back through the stored-report checks', async () => {
    mockPost.mockResolvedValue({ report: { kind: 'roleplay', tooShort: true, overall: null, rating: null, summary: 'Too short.', criteria: [], strengths: [], growth: [], nextStep: '' } });
    const report = await requestReport(identity, { sessionId: 'ps-00000001', itemId: SCENARIO.id, messages });
    expect(report).toMatchObject({ tooShort: true, summary: 'Too short.' });
    expect(mockPost.mock.calls[0][1]).toMatchObject({ mode: 'report', itemId: SCENARIO.id });
    mockPost.mockResolvedValue({ report: { nonsense: true } });
    await expect(requestReport(identity, { sessionId: 'ps-00000001', itemId: SCENARIO.id, messages })).rejects.toThrow();
  });

  test('the review carries the learner’s text, and an earlier version only when there is one', async () => {
    mockPost.mockResolvedValue({ review: { kind: 'message-review', tooShort: true, overall: null, rating: null, summary: 'Short.', criteria: [], missing: [], improved: '', changes: [], nextStep: '' } });
    const review = await requestReview(identity, { sessionId: 'rv-00000001', itemId: TASK.id, text: 'My message.' });
    expect(review).toMatchObject({ kind: 'message-review', tooShort: true });
    expect(mockPost.mock.calls[0][1]).toMatchObject({ mode: 'review', text: 'My message.' });
    expect(mockPost.mock.calls[0][1]).not.toHaveProperty('previous');
    await requestReview(identity, { sessionId: 'rv-00000002', itemId: TASK.id, text: 'Second.', previous: 'First.' });
    expect(mockPost.mock.calls[1][1]).toMatchObject({ previous: 'First.' });
    mockPost.mockResolvedValue({});
    await expect(requestReview(identity, { sessionId: 'rv-00000003', itemId: TASK.id, text: 'x' })).rejects.toThrow();
  });
});

describe('practiceErrorCode', () => {
  test('is the same reading of an error as the rest of the AI features', async () => {
    const { ApiError } = jest.requireMock<{ ApiError: new (code: string, status?: number | null) => Error }>('@/lib/api');
    expect(practiceErrorCode(new ApiError('practice_limit', 429))).toBe('practice_limit');
    expect(practiceErrorCode(new ApiError('unknown', 503))).toBe('busy');
    expect(practiceErrorCode(new Error('x'))).toBe('unknown');
  });
});
