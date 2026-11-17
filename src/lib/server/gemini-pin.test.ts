import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { callGemini, compareModels, resetModelRest } from './gemini';

/** The optional model pin (the prompt lab's model comparison) and the two tiers it compares; every other call keeps the fallback chain. */
describe('pinning one model for one call', () => {
  const env = { ...process.env };
  const fetchMock = jest.fn<typeof fetch>();
  const ok = () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'hi' }] } }] }), { status: 200 });
  const urls = () => fetchMock.mock.calls.map((call) => String(call[0]));

  beforeEach(() => {
    delete process.env.GEMINI_MODELS;
    delete process.env.LAB_COMPARE_MODELS;
    resetModelRest();
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });
  afterEach(() => {
    process.env = { ...env };
  });

  test('a pinned call asks only that model, and a busy answer is not passed to another', async () => {
    fetchMock.mockImplementation(async () => new Response('{}', { status: 503 }));
    const result = await callGemini('key', { contents: [] }, { model: 'pinned-model-x' });
    expect(result.status).toBe(503);
    expect(result.model).toBe('pinned-model-x');
    expect(urls()).toHaveLength(1);
    expect(urls()[0]).toContain('pinned-model-x:generateContent');
  });

  test('a pinned call does not rest the model for everyone else', async () => {
    fetchMock.mockImplementation(async () => new Response('{}', { status: 503 }));
    await callGemini('key', { contents: [] }, { model: 'gemini-3.1-flash-lite' });
    fetchMock.mockReset();
    fetchMock.mockImplementation(async () => ok());
    await callGemini('key', { contents: [] });
    expect(urls()[0]).toContain('gemini-3.1-flash-lite:');
  });

  test('without a pin the chain still falls back as it always did', async () => {
    let calls = 0;
    fetchMock.mockImplementation(async () => (++calls === 1 ? new Response('{}', { status: 503 }) : ok()));
    const result = await callGemini('key', { contents: [] });
    expect(result.status).toBe(200);
    expect(urls()).toHaveLength(2);
    expect(urls()[0]).not.toBe(urls()[1]);
  });
});

describe('compareModels', () => {
  const env = { ...process.env };
  afterEach(() => {
    process.env = { ...env };
  });

  test('is the first and the last model of the chain', () => {
    delete process.env.GEMINI_MODELS;
    delete process.env.LAB_COMPARE_MODELS;
    expect(compareModels()).toEqual({ small: 'gemini-3.1-flash-lite', large: 'gemini-3.6-flash' });
    process.env.GEMINI_MODELS = 'a-model, b-model, c-model';
    expect(compareModels()).toEqual({ small: 'a-model', large: 'c-model' });
  });
  test('LAB_COMPARE_MODELS chooses exactly two; anything else is ignored', () => {
    process.env.LAB_COMPARE_MODELS = 'tiny-1,big-2';
    expect(compareModels()).toEqual({ small: 'tiny-1', large: 'big-2' });
    process.env.LAB_COMPARE_MODELS = 'only-one';
    expect(compareModels()).toEqual({ small: 'gemini-3.1-flash-lite', large: 'gemini-3.6-flash' });
    process.env.LAB_COMPARE_MODELS = 'bad name,x y';
    expect(compareModels()).not.toBeNull();
  });
  test('is null when there is only one distinct model: two runs of one are not a comparison', () => {
    process.env.GEMINI_MODELS = 'single-model';
    delete process.env.LAB_COMPARE_MODELS;
    expect(compareModels()).toBeNull();
    process.env.LAB_COMPARE_MODELS = 'same-1,same-1';
    expect(compareModels()).toBeNull();
  });
});
