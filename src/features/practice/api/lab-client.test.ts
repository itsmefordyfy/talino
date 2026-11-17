import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { GOOD_PROMPT, LAB_SUMMARY, OTHER_GOOD_PROMPT } from '../lab-test-support';
import { requestLabReview, requestLabRun } from './client';

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
jest.mock('@/features/coach', () => jest.requireActual('@/features/coach/api/client'));
jest.mock('@/lib/device-id', () => ({ deviceId: () => 'device-12345678' }));

const identity = { appUserId: 'user-1', entitlements: ['talino_pro'] };
const output = { label: 'A', output: 'Dana sends the budget.', format: 'text', tokens: { input: 10, output: 5 }, latencyMs: 800 };

beforeEach(() => {
  mockPost.mockReset();
});

describe('requestLabRun', () => {
  test('sends who is asking, the lab by id, the run number and the prompt: never instructions or material', async () => {
    mockPost.mockResolvedValue({ run: { outputs: [output] } });
    const run = await requestLabRun(identity, { sessionId: 'lab-00000001', itemId: LAB_SUMMARY.id, runNumber: 2, prompts: [GOOD_PROMPT] });
    expect(run.outputs[0]).toMatchObject({ label: 'A', output: 'Dana sends the budget.', latencyMs: 800 });
    const [path, body, options] = mockPost.mock.calls[0];
    expect(path).toBe('/api/practice');
    expect(Object.keys(body).sort()).toEqual(['appUserId', 'deviceId', 'entitlements', 'itemId', 'mode', 'prompt', 'runNumber', 'sessionId']);
    expect(body).toMatchObject({ mode: 'lab-run', itemId: LAB_SUMMARY.id, runNumber: 2, prompt: GOOD_PROMPT });
    expect(options?.timeoutMs).toBeGreaterThanOrEqual(60_000);
  });

  test('a comparison of prompts also sends both', async () => {
    mockPost.mockResolvedValue({ run: { outputs: [output, { ...output, label: 'B' }] } });
    const run = await requestLabRun(identity, { sessionId: 'lab-00000001', itemId: LAB_SUMMARY.id, runNumber: 1, prompts: [GOOD_PROMPT, OTHER_GOOD_PROMPT] });
    expect(run.outputs).toHaveLength(2);
    expect(mockPost.mock.calls[0][1]).toMatchObject({ prompt: GOOD_PROMPT, prompts: [GOOD_PROMPT, OTHER_GOOD_PROMPT] });
  });

  test('an answer that is not a run is an error', async () => {
    mockPost.mockResolvedValue({ run: { outputs: [] } });
    await expect(requestLabRun(identity, { sessionId: 'lab-00000001', itemId: LAB_SUMMARY.id, runNumber: 1, prompts: [GOOD_PROMPT] })).rejects.toThrow();
    mockPost.mockResolvedValue({});
    await expect(requestLabRun(identity, { sessionId: 'lab-00000001', itemId: LAB_SUMMARY.id, runNumber: 1, prompts: [GOOD_PROMPT] })).rejects.toThrow();
  });
});

describe('requestLabReview', () => {
  const review = {
    kind: 'prompt-lab',
    tooShort: false,
    overall: 70,
    summary: 'Clear.',
    criteria: [{ id: 'audience', label: 'Says who it is for', score: 70, quote: 'for my manager', reason: 'You say who.' }],
    suggestions: ['Name the owners.'],
    outputChecks: [],
    keyChecks: [],
    comparison: '',
    nextStep: 'Run again.',
  };

  test('sends the prompt(s), the outputs the phone holds and the tool trace, and reads the review back', async () => {
    mockPost.mockResolvedValue({ review });
    const result = await requestLabReview(identity, { sessionId: 'lab-00000001', itemId: LAB_SUMMARY.id, prompts: [GOOD_PROMPT], outputs: ['Dana sends the budget.'], toolSteps: [{ tool: 't', arguments: {}, result: { ok: true } }] });
    expect(result).toMatchObject({ kind: 'prompt-lab', overall: 70, rating: 'good' });
    expect(mockPost.mock.calls[0][1]).toMatchObject({ mode: 'lab-review', prompt: GOOD_PROMPT, outputs: ['Dana sends the budget.'], toolSteps: [{ tool: 't' }] });
  });

  test('a damaged review is an error', async () => {
    mockPost.mockResolvedValue({ review: { kind: 'prompt-lab' } });
    await expect(requestLabReview(identity, { sessionId: 'lab-00000001', itemId: LAB_SUMMARY.id, prompts: [GOOD_PROMPT], outputs: ['x'] })).rejects.toThrow();
  });
});
