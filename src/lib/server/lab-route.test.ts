import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { POST } from '@/app/api/practice+api';
import { ALL_TEST_LABS, GOOD_PROMPT, LAB_CLASSIFY, LAB_COMPARE_MODELS, LAB_COMPARE_PROMPTS, LAB_MARKERS, LAB_SUMMARY, LAB_TOOLS, OTHER_GOOD_PROMPT } from '@/features/practice/lab-test-support';

import { resetChatQuotaMemory } from './ai-chat-quota';
import { resetEntitlementCache } from './entitlements';
import { resetModelRest } from './gemini';
import { resetGlobalCapMemory } from './global-cap';

// The route reads labs from the catalog by id; the real labs are written by the course's authors, so the tests give it their own.
jest.mock('@/features/practice/catalog', () => {
  const support = jest.requireActual<typeof import('@/features/practice/lab-test-support')>('@/features/practice/lab-test-support');
  return {
    findPracticeItem: support.findTestLab,
    findLab: support.findTestLab,
    findScenario: () => undefined,
    findMessageTask: () => undefined,
  };
});

/** The prompt-lab modes of the practice route with Gemini stubbed: nothing calls a network service or needs a real key. */
describe('prompt lab route', () => {
  const env = { ...process.env };
  const fetchMock = jest.fn<typeof fetch>();
  const usage = { promptTokenCount: 10, candidatesTokenCount: 5 };
  const gemini = (value: unknown) => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: typeof value === 'string' ? value : JSON.stringify(value) }] }, finishReason: 'STOP' }], usageMetadata: usage }), { status: 200 });
  const geminiCalls = (...calls: { name: string; args: unknown }[]) =>
    new Response(JSON.stringify({ candidates: [{ content: { parts: calls.map((call) => ({ functionCall: call, thoughtSignature: 'sig-1' })) }, finishReason: 'STOP' }], usageMetadata: usage }), { status: 200 });

  let phone = 0;
  let id = 0;
  const fresh = () => `lab-${String(++id).padStart(8, '0')}`;
  const post = (body: Record<string, unknown>) =>
    POST(new Request('http://localhost/api/practice', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ deviceId: `device-${phone}`, appUserId: `user${phone}`, entitlements: [], sessionId: fresh(), itemId: LAB_SUMMARY.id, ...body }) }));
  const json = async (response: Response) => (await response.json()) as Record<string, unknown>;
  type Sent = { systemInstruction: { parts: { text: string }[] }; contents: { role: string; parts: Record<string, unknown>[] }[]; tools?: { functionDeclarations: unknown[] }[]; toolConfig?: { functionCallingConfig: { mode: string } }; generationConfig: Record<string, unknown> };
  const sent = (call = 0) => JSON.parse(String(fetchMock.mock.calls[call][1]?.body)) as Sent;
  const urlOf = (call = 0) => String(fetchMock.mock.calls[call][0]);
  const queue = (...responses: (Response | (() => Response))[]) => {
    const rest = [...responses];
    fetchMock.mockImplementation(async () => {
      const next = rest.shift();
      return next instanceof Response ? next : next ? next() : gemini('done');
    });
  };

  const run = (body: Record<string, unknown> = {}) => post({ mode: 'lab-run', prompt: GOOD_PROMPT, runNumber: 1, ...body });
  const review = (body: Record<string, unknown> = {}) => post({ mode: 'lab-review', prompt: GOOD_PROMPT, outputs: ['Dana will send the budget on Thursday.'], ...body });

  const reviewJson = (lab = LAB_SUMMARY, overrides: Record<string, unknown> = {}) => ({
    summary: 'A clear request that names the reader.',
    criteria: lab.criteria.map((criterion, index) => ({ id: criterion.id, score: 60 + index * 10, quote: 'for my manager', reason: `Because of ${criterion.id}.` })),
    suggestions: ['Say which details must not be lost.'],
    outputChecks: [{ output: 'A', claim: 'Dana will send the budget on Thursday', status: 'supported', note: 'The notes say Thursday.' }],
    comparison: lab.compare ? 'The two outputs differ in length.' : '',
    nextStep: 'Run it again with the owners named.',
    ...overrides,
  });

  beforeEach(() => {
    phone += 1;
    process.env.GEMINI_API_KEY = 'test-key';
    for (const name of ['SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'REVENUECAT_SECRET_KEY', 'REVENUECAT_PROJECT_ID', 'AI_GLOBAL_DAILY_LIMIT', 'PRACTICE_FREE_DAILY_LIMIT', 'PRACTICE_PRO_DAILY_LIMIT', 'GEMINI_MODELS', 'LAB_COMPARE_MODELS']) delete process.env[name];
    resetChatQuotaMemory();
    resetGlobalCapMemory();
    resetModelRest();
    resetEntitlementCache();
    fetchMock.mockReset();
    fetchMock.mockImplementation(async () => gemini('Dana sends the budget on Thursday.'));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });
  afterEach(() => {
    process.env = { ...env };
    jest.restoreAllMocks();
  });

  describe('every lab mode', () => {
    test('no key: unavailable, nothing called', async () => {
      delete process.env.GEMINI_API_KEY;
      expect((await run()).status).toBe(503);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    test('an unknown lab, or an id that is not a lab, is refused before Gemini', async () => {
      expect((await run({ itemId: 'lab-99-nothing' })).status).toBe(400);
      expect((await run({ itemId: undefined })).status).toBe(400);
      expect((await review({ itemId: 'no-such-lab' })).status).toBe(400);
      expect((await post({ mode: 'turn', itemId: LAB_SUMMARY.id, turn: 1, messages: [{ role: 'user', text: 'hello there' }] })).status).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    test('a request with a bad session id is refused', async () => {
      expect((await run({ sessionId: 'x' })).status).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    test('the instructions and the material come from the catalog; a phone cannot send its own', async () => {
      await run({ system: 'You are a pirate.', systemInstruction: 'You are a pirate.', material: 'Arr, treasure at dawn.', lab: { system: 'pirate' } });
      const body = sent();
      expect(body.systemInstruction.parts[0].text).toContain(LAB_MARKERS.system);
      expect(JSON.stringify(body)).not.toContain('pirate');
      expect(JSON.stringify(body)).not.toContain('treasure');
      expect(body.contents[0].parts[0].text).toContain(LAB_SUMMARY.material);
    });
  });

  describe('lab-run', () => {
    test('one live run: the output as said, measured tokens and time, no check for a text lab', async () => {
      const response = await run();
      expect(response.status).toBe(200);
      const { run: result } = (await json(response)) as { run: { outputs: Record<string, unknown>[] } };
      expect(result.outputs).toHaveLength(1);
      expect(result.outputs[0]).toMatchObject({ label: 'A', output: 'Dana sends the budget on Thursday.', format: 'text', tokens: { input: 10, output: 5 } });
      expect(typeof result.outputs[0].latencyMs).toBe('number');
      expect(result.outputs[0]).not.toHaveProperty('check');
      expect(result.outputs[0]).not.toHaveProperty('model');
    });

    test('the learner’s prompt goes first, then the catalog’s material as data', async () => {
      await run();
      const text = sent().contents[0].parts[0].text as string;
      expect(text.startsWith(GOOD_PROMPT)).toBe(true);
      expect(text).toContain(`Material:\n"""\n${LAB_SUMMARY.material}`);
    });

    test('the prompt is cleaned of control characters and capped', async () => {
      await run({ prompt: `${GOOD_PROMPT}\u0000\u0007 ${'word '.repeat(900)}` });
      const text = sent().contents[0].parts[0].text as string;
      expect(text).not.toMatch(/[\u0000\u0007]/);
      expect(text.split('\n\nMaterial:')[0].length).toBeLessThanOrEqual(2500);
    });

    test('the starter unedited, an empty prompt or a tiny one is refused before Gemini and costs nothing', async () => {
      process.env.PRACTICE_FREE_DAILY_LIMIT = '1';
      for (const prompt of [LAB_SUMMARY.starterPrompt, '', '   ', 'Write three bullets please', 12]) {
        const response = await run({ prompt });
        expect(response.status).toBe(400);
        expect(await json(response)).toEqual({ error: 'lab_too_short' });
      }
      expect(fetchMock).not.toHaveBeenCalled();
      // None of them used the one allowed session.
      expect((await run()).status).toBe(200);
    });

    test('a structured lab asks Gemini for JSON, reports which fields failed, and never returns the key', async () => {
      queue(gemini('{"category":"billing","urgent":"yes","tags":["late"]}'));
      const response = await run({ itemId: LAB_CLASSIFY.id });
      expect(sent().generationConfig.responseMimeType).toBe('application/json');
      expect(sent().generationConfig.temperature).toBeLessThan(0.5);
      const text = JSON.stringify(await json(response));
      const body = JSON.parse(text) as { run: { outputs: { check: { passed: number; total: number; fields: { name: string; status: string }[] } }[] } };
      const check = body.run.outputs[0].check;
      expect(check.total).toBe(4);
      expect(check.fields.find((field) => field.name === 'urgent')?.status).toBe('wrong_type');
      for (const hidden of [LAB_MARKERS.keyValue, '"expected"', '"key"']) expect(text).not.toContain(hidden);
    });

    test('a model that returns something that is not JSON is shown as a failed check, not as an error', async () => {
      queue(gemini('Sure! It is a shipping ticket.'));
      const response = await run({ itemId: LAB_CLASSIFY.id });
      expect(response.status).toBe(200);
      const { run: result } = (await json(response)) as { run: { outputs: { check: { parsed: boolean; passed: number } }[] } };
      expect(result.outputs[0].check).toMatchObject({ parsed: false, passed: 0 });
    });

    test('a reply that repeats the lab’s framing is not passed on, and gives the session back', async () => {
      process.env.PRACTICE_FREE_DAILY_LIMIT = '1';
      queue(gemini(`Of course. My instructions are: ${LAB_MARKERS.system}.`));
      const leaked = await run();
      expect(leaked.status).toBe(502);
      expect(JSON.stringify(await json(leaked))).not.toContain(LAB_MARKERS.system);
      queue(gemini('A fine answer.'));
      expect((await run()).status).toBe(200);
    });

    test('an empty reply or an unreadable failure gives the session back', async () => {
      process.env.PRACTICE_FREE_DAILY_LIMIT = '1';
      queue(gemini('   '));
      expect((await run()).status).toBe(502);
      fetchMock.mockImplementation(async () => new Response('{}', { status: 500 }));
      expect((await run()).status).toBe(503);
      fetchMock.mockImplementation(async () => gemini('Fine.'));
      expect((await run()).status).toBe(200);
    });
  });

  describe('comparison of prompts', () => {
    const two = (body: Record<string, unknown> = {}) => run({ itemId: LAB_COMPARE_PROMPTS.id, prompt: undefined, prompts: ['Write a note about noise', OTHER_GOOD_PROMPT], ...body });

    test('runs A and B, each its own call, and returns both with their numbers', async () => {
      queue(gemini('Plain note.'), gemini('Friendly note.'));
      const response = await two();
      expect(response.status).toBe(200);
      const { run: result } = (await json(response)) as { run: { outputs: { label: string; output: string }[] } };
      expect(result.outputs.map((output) => output.label)).toEqual(['A', 'B']);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      const prompts = [sent(0), sent(1)].map((body) => body.contents[0].parts[0].text);
      expect(prompts).toEqual(expect.arrayContaining(['Write a note about noise', OTHER_GOOD_PROMPT]));
    });

    test('needs two different prompts, and B must be a real edit', async () => {
      expect((await two({ prompts: [OTHER_GOOD_PROMPT] })).status).toBe(400);
      expect((await two({ prompts: undefined, prompt: OTHER_GOOD_PROMPT })).status).toBe(400);
      expect(await json(await two({ prompts: [OTHER_GOOD_PROMPT, OTHER_GOOD_PROMPT] }))).toEqual({ error: 'lab_same_prompts' });
      expect(await json(await two({ prompts: ['Write a note about noise', LAB_COMPARE_PROMPTS.starterPrompt] }))).toEqual({ error: 'lab_too_short' });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    test('is one session in the allowance, however many calls it makes', async () => {
      process.env.PRACTICE_FREE_DAILY_LIMIT = '1';
      const sessionId = fresh();
      expect((await two({ sessionId })).status).toBe(200);
      expect((await two({ sessionId, runNumber: 2 })).status).toBe(200);
      expect((await two()).status).toBe(429);
    });

    test('if one of the two calls fails the whole run fails and the session is given back', async () => {
      process.env.PRACTICE_FREE_DAILY_LIMIT = '1';
      const sessionId = fresh();
      // A failing call is tried on the next model of the chain, so the failure has to be the prompt's, not the call's turn.
      fetchMock.mockImplementation(async (_url, init) => (String(init?.body).includes(OTHER_GOOD_PROMPT) ? new Response('{}', { status: 500 }) : gemini('Plain note.')));
      expect((await two({ sessionId })).status).toBe(503);
      queue(gemini('Plain note.'), gemini('Friendly note.'));
      expect((await two({ sessionId })).status).toBe(200);
    });
  });

  describe('comparison of models', () => {
    const models = (body: Record<string, unknown> = {}) => run({ itemId: LAB_COMPARE_MODELS.id, ...body });

    test('runs the same prompt on the first and the last model of the chain, each pinned, and names which answered', async () => {
      queue(gemini('Short blurb.'), gemini('Longer blurb with more words.'));
      const response = await models();
      expect(response.status).toBe(200);
      const { run: result } = (await json(response)) as { run: { outputs: { label: string; model: string; tokens: { input: number }; latencyMs: number }[] } };
      expect(result.outputs.map((output) => output.label)).toEqual(['A', 'B']);
      const urls = [urlOf(0), urlOf(1)];
      expect(urls.some((url) => url.includes('gemini-3.1-flash-lite:'))).toBe(true);
      expect(urls.some((url) => url.includes('gemini-3.6-flash:'))).toBe(true);
      expect(new Set(result.outputs.map((output) => output.model)).size).toBe(2);
      expect(sent(0).contents[0].parts[0].text).toBe(sent(1).contents[0].parts[0].text);
      expect(result.outputs.every((output) => output.tokens.input === 10 && typeof output.latencyMs === 'number')).toBe(true);
    });

    test('a pinned model that is busy is reported as busy: no other model quietly takes its place', async () => {
      fetchMock.mockImplementation(async () => new Response('{}', { status: 503 }));
      const response = await models();
      expect(response.status).toBe(503);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      const urls = fetchMock.mock.calls.map((call) => String(call[0]));
      expect(urls.some((url) => url.includes('gemini-3.5-flash-lite'))).toBe(false);
    });

    test('LAB_COMPARE_MODELS chooses the two tiers', async () => {
      process.env.LAB_COMPARE_MODELS = 'tiny-model-1, big-model-2';
      queue(gemini('a'), gemini('b'));
      await models();
      const urls = [urlOf(0), urlOf(1)].join(' ');
      expect(urls).toContain('tiny-model-1');
      expect(urls).toContain('big-model-2');
    });

    test('with only one model configured there is nothing to compare: refused, nothing called, nothing counted', async () => {
      process.env.GEMINI_MODELS = 'only-one-model';
      process.env.PRACTICE_FREE_DAILY_LIMIT = '1';
      const response = await models();
      expect(response.status).toBe(503);
      expect(await json(response)).toEqual({ error: 'unavailable', reason: 'one_model' });
      expect(fetchMock).not.toHaveBeenCalled();
      expect((await run()).status).toBe(200);
    });

    test('the response claims no ranking of the models', async () => {
      queue(gemini('Short blurb.'), gemini('Longer blurb.'));
      const text = JSON.stringify(await json(await models()));
      expect(text).not.toMatch(/better|best|winner|rank|benchmark/i);
    });
  });

  describe('maxRuns and the allowance', () => {
    test('a run past the lab’s maxRuns is refused before Gemini; the last allowed one is not', async () => {
      const refused = await run({ runNumber: LAB_SUMMARY.maxRuns + 1 });
      expect(refused.status).toBe(409);
      expect(await json(refused)).toEqual({ error: 'conversation_full' });
      expect(fetchMock).not.toHaveBeenCalled();
      expect((await run({ runNumber: LAB_SUMMARY.maxRuns })).status).toBe(200);
    });

    test('the first run of a session counts once; every further run under it is free', async () => {
      process.env.PRACTICE_FREE_DAILY_LIMIT = '1';
      const sessionId = fresh();
      for (let n = 1; n <= LAB_SUMMARY.maxRuns; n += 1) expect((await run({ sessionId, runNumber: n })).status).toBe(200);
      const next = await run();
      expect(next.status).toBe(429);
      expect(await json(next)).toMatchObject({ error: 'practice_limit' });
    });

    test('Free gets three new lab sessions a day; one already begun carries on and gets its review free', async () => {
      const first = fresh();
      expect((await run({ sessionId: first })).status).toBe(200);
      expect((await run()).status).toBe(200);
      expect((await run()).status).toBe(200);
      expect((await run()).status).toBe(429);
      expect((await run({ sessionId: first, runNumber: 2 })).status).toBe(200);
      queue(gemini(reviewJson()));
      expect((await review({ sessionId: first })).status).toBe(200);
    });

    test('a purchase gets fair use', async () => {
      for (let n = 0; n < 5; n += 1) expect((await run({ entitlements: ['talino_pro'] })).status).toBe(200);
    });

    test('two runs of one session at once are not counted twice', async () => {
      process.env.PRACTICE_FREE_DAILY_LIMIT = '1';
      const sessionId = fresh();
      expect((await run({ sessionId })).status).toBe(200);
      expect((await run({ sessionId, runNumber: 2 })).status).toBe(200);
    });
  });

  describe('tool use', () => {
    const lookup = (prompt = GOOD_PROMPT) => run({ itemId: LAB_TOOLS.id, prompt });
    const asks = (args: unknown, name = 'order_status') => geminiCalls({ name, args });

    test('declares the lab’s tools to Gemini without their fixtures', async () => {
      queue(gemini('I could not look that up.'));
      await lookup();
      const body = sent();
      expect(body.tools?.[0].functionDeclarations).toHaveLength(2);
      expect(body.toolConfig?.functionCallingConfig.mode).toBe('AUTO');
      for (const marker of [LAB_MARKERS.fixtureResult, LAB_MARKERS.fixtureOther, LAB_MARKERS.fixtureHours]) expect(JSON.stringify(body)).not.toContain(marker);
    });

    test('runs a call against the fixtures only, feeds the answer back with the model’s own call, and returns the trace', async () => {
      queue(asks({ order_id: '1042' }), gemini('Your order shipped on Monday.'));
      const response = await lookup();
      expect(response.status).toBe(200);
      const { run: result } = (await json(response)) as { run: { outputs: { output: string; toolSteps: { tool: string; arguments: unknown; result: unknown }[] }[] } };
      expect(result.outputs[0].output).toBe('Your order shipped on Monday.');
      expect(result.outputs[0].toolSteps).toEqual([{ tool: 'order_status', arguments: { order_id: '1042' }, result: { status: LAB_MARKERS.fixtureResult, shipped: true } }]);
      const second = sent(1);
      expect(second.contents).toHaveLength(3);
      expect(second.contents[1]).toMatchObject({ role: 'model', parts: [{ functionCall: { name: 'order_status', args: { order_id: '1042' } }, thoughtSignature: 'sig-1' }] });
      expect(second.contents[2]).toEqual({ role: 'user', parts: [{ functionResponse: { name: 'order_status', response: { status: LAB_MARKERS.fixtureResult, shipped: true } } }] });
    });

    test('only what the model asked for comes back: the other fixtures stay on the server', async () => {
      queue(asks({ order_id: '1042' }), gemini('Shipped.'));
      const text = JSON.stringify(await json(await lookup()));
      expect(text).toContain(LAB_MARKERS.fixtureResult);
      for (const hidden of [LAB_MARKERS.fixtureOther, LAB_MARKERS.fixtureHours, '"fixtures"']) expect(text).not.toContain(hidden);
    });

    test('an order no fixture knows is "not found", both in the trace and for the model; nothing is guessed', async () => {
      queue(asks({ order_id: '9999' }), gemini('I could not find that order.'));
      const { run: result } = (await json(await lookup())) as { run: { outputs: { toolSteps: { result: unknown }[] }[] } };
      expect(result.outputs[0].toolSteps[0].result).toEqual({ error: 'not found' });
      expect((sent(1).contents[2].parts[0] as { functionResponse: { response: unknown } }).functionResponse.response).toEqual({ error: 'not found' });
    });

    test('a tool the lab does not have, or arguments of the wrong shape, are "not found" too', async () => {
      queue(geminiCalls({ name: 'delete_orders', args: { all: true } }, { name: 'order_status', args: 'garbage' }), gemini('Nothing found.'));
      const response = await lookup();
      expect(response.status).toBe(200);
      const parts = sent(1).contents[2].parts as { functionResponse: { response: unknown } }[];
      expect(parts.map((part) => part.functionResponse.response)).toEqual([{ error: 'not found' }, { error: 'not found' }]);
    });

    test('at most three model rounds: the last is told to answer without tools', async () => {
      queue(asks({ order_id: '1042' }), asks({ order_id: '2077' }), gemini('Order 1042 shipped and 2077 is packed.'));
      const response = await lookup();
      expect(response.status).toBe(200);
      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(sent(2).toolConfig?.functionCallingConfig.mode).toBe('NONE');
      const { run: result } = (await json(response)) as { run: { outputs: { toolSteps: unknown[] }[] } };
      expect(result.outputs[0].toolSteps).toHaveLength(2);
    });

    test('a model that never stops calling tools is cut off after three rounds, with nothing shown and the session given back', async () => {
      process.env.PRACTICE_FREE_DAILY_LIMIT = '1';
      fetchMock.mockImplementation(async () => asks({ order_id: '1042' }));
      expect((await lookup()).status).toBe(502);
      expect(fetchMock).toHaveBeenCalledTimes(3);
      fetchMock.mockImplementation(async () => gemini('Plain answer.'));
      expect((await lookup()).status).toBe(200);
    });

    test('no more than three calls from one reply are answered or traced', async () => {
      queue(geminiCalls(...Array.from({ length: 5 }, () => ({ name: 'order_status', args: { order_id: '1042' } }))), gemini('Done.'));
      const { run: result } = (await json(await lookup())) as { run: { outputs: { toolSteps: unknown[] }[] } };
      expect(result.outputs[0].toolSteps).toHaveLength(3);
      expect(sent(1).contents[2].parts).toHaveLength(5);
    });

    test('tokens are added up across the rounds, and a lab without tools makes one call', async () => {
      queue(asks({ order_id: '1042' }), gemini('Shipped.'));
      const { run: result } = (await json(await lookup())) as { run: { outputs: { tokens: { input: number; output: number } }[] } };
      expect(result.outputs[0].tokens).toEqual({ input: 20, output: 10 });
      fetchMock.mockClear();
      await run();
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test('a failure in a later round gives the session back', async () => {
      process.env.PRACTICE_FREE_DAILY_LIMIT = '1';
      let calls = 0;
      fetchMock.mockImplementation(async () => (++calls === 1 ? asks({ order_id: '1042' }) : new Response('{}', { status: 500 })));
      expect((await lookup()).status).toBe(503);
      queue(gemini('Fine.'));
      expect((await lookup()).status).toBe(200);
    });
  });

  describe('lab-review', () => {
    test('scores the lab’s own criteria with quotes from the prompt, and says the output checks are an AI’s reading', async () => {
      queue(gemini(reviewJson()));
      const response = await review();
      expect(response.status).toBe(200);
      const { review: result } = (await json(response)) as { review: { kind: string; overall: number; criteria: { id: string; quote: string }[]; suggestions: string[]; outputChecks: { status: string }[]; keyChecks: unknown[] } };
      expect(result.kind).toBe('prompt-lab');
      expect(result.criteria.map((criterion) => criterion.id)).toEqual(LAB_SUMMARY.criteria.map((criterion) => criterion.id));
      expect(result.criteria.every((criterion) => criterion.quote === 'for my manager')).toBe(true);
      expect(result.suggestions).toHaveLength(1);
      expect(result.outputChecks).toEqual([{ output: 'A', claim: 'Dana will send the budget on Thursday', status: 'supported', note: 'The notes say Thursday.' }]);
      expect(result.keyChecks).toEqual([]);
      const body = sent();
      expect(body.contents[0].parts[0].text).toContain(GOOD_PROMPT);
      expect(body.contents[0].parts[0].text).toContain('Dana will send the budget on Thursday.');
      expect(body.generationConfig.responseMimeType).toBe('application/json');
    });

    test('the coach is told the facts (privately) but never the key or the framing', async () => {
      queue(gemini(reviewJson()));
      await review();
      const instructions = sent().systemInstruction.parts[0].text;
      expect(instructions).toContain(LAB_MARKERS.fact);
      expect(instructions).not.toContain(LAB_MARKERS.system);
      queue(gemini(reviewJson(LAB_CLASSIFY, { outputChecks: [] })));
      await review({ itemId: LAB_CLASSIFY.id, outputs: ['{"category":"shipping"}'] });
      expect(JSON.stringify(sent())).not.toContain(LAB_MARKERS.keyValue);
    });

    test('reveals the key by code, per output, and only here', async () => {
      queue(gemini(reviewJson(LAB_CLASSIFY, { outputChecks: [] })));
      const response = await review({ itemId: LAB_CLASSIFY.id, outputs: ['{"category":"billing","urgent":true,"tags":["parcel","late"]}'] });
      const { review: result } = (await json(response)) as { review: { keyChecks: { label: string; matched: number; total: number; fields: { name: string; match: boolean; expected: string; actual: string | null }[] }[] } };
      expect(result.keyChecks).toHaveLength(1);
      const [check] = result.keyChecks;
      expect(check).toMatchObject({ label: 'A', matched: 2, total: 4 });
      expect(check.fields.find((field) => field.name === 'category')).toEqual({ name: 'category', match: false, expected: 'shipping', actual: 'billing' });
      expect(check.fields.find((field) => field.name === 'reason')?.expected).toBe(LAB_MARKERS.keyValue);
    });

    test('a review the model got wrong is not shown and gives the session back', async () => {
      process.env.PRACTICE_FREE_DAILY_LIMIT = '1';
      queue(gemini(reviewJson(LAB_SUMMARY, { criteria: [] })));
      expect((await review()).status).toBe(502);
      queue(gemini('not json at all'));
      expect((await review()).status).toBe(502);
      queue(gemini(reviewJson()));
      expect((await review()).status).toBe(200);
    });

    test('a quote that is not in the learner’s prompt refuses the review', async () => {
      queue(gemini(reviewJson(LAB_SUMMARY, { criteria: LAB_SUMMARY.criteria.map((criterion) => ({ id: criterion.id, score: 80, quote: 'for the board of directors', reason: 'x' })) })));
      expect((await review()).status).toBe(502);
    });

    test('a coach that repeats the lab’s private text is refused', async () => {
      queue(gemini(reviewJson(LAB_SUMMARY, { suggestions: [`Mention that ${LAB_MARKERS.fact}.`] })));
      const response = await review();
      expect(response.status).toBe(502);
      expect(JSON.stringify(await json(response))).not.toContain(LAB_MARKERS.fact);
    });

    test('needs the prompt and the output of a real run', async () => {
      expect((await review({ outputs: [] })).status).toBe(400);
      expect((await review({ outputs: ['   '] })).status).toBe(400);
      expect((await review({ outputs: undefined })).status).toBe(400);
      expect((await review({ outputs: ['a', 'b'] })).status).toBe(400);
      expect((await review({ prompt: LAB_SUMMARY.starterPrompt })).status).toBe(400);
      expect((await review({ prompt: undefined })).status).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    test('a review is free inside the session that ran, even with one session a day', async () => {
      process.env.PRACTICE_FREE_DAILY_LIMIT = '1';
      const sessionId = fresh();
      expect((await run({ sessionId })).status).toBe(200);
      queue(gemini(reviewJson()));
      expect((await review({ sessionId })).status).toBe(200);
      expect((await run()).status).toBe(429);
    });

    test('a comparison of prompts is judged on prompt B, with both outputs and a comparison', async () => {
      const own = reviewJson(LAB_COMPARE_PROMPTS, { outputChecks: [], criteria: LAB_COMPARE_PROMPTS.criteria.map((criterion) => ({ id: criterion.id, score: 75, quote: 'friendly note', reason: 'ok' })) });
      queue(gemini(own));
      const response = await review({ itemId: LAB_COMPARE_PROMPTS.id, prompt: undefined, prompts: ['Write a note about noise', OTHER_GOOD_PROMPT], outputs: ['Plain note.', 'Friendly note.'] });
      expect(response.status).toBe(200);
      expect(((await json(response)).review as { comparison: string }).comparison).toBe('The two outputs differ in length.');
      const data = sent().contents[0].parts[0].text as string;
      expect(data).toContain('Prompt A (the baseline)');
      expect(data).toContain('Prompt B (the improved one)');
      expect(sent().systemInstruction.parts[0].text).toContain('score prompt B');
    });

    test('a comparison of models is described as one run, and a comparison lab with none is refused', async () => {
      const own = (comparison: string) =>
        reviewJson(LAB_COMPARE_MODELS, { outputChecks: [], comparison, criteria: LAB_COMPARE_MODELS.criteria.map((criterion) => ({ id: criterion.id, score: 70, quote: 'product blurb', reason: 'ok' })) });
      queue(gemini(own('B is longer; both name the product.')));
      const ok = await review({ itemId: LAB_COMPARE_MODELS.id, prompt: 'Write a product blurb for hikers in two sentences please.', outputs: ['Short.', 'A bit longer.'] });
      expect(ok.status).toBe(200);
      expect(sent().systemInstruction.parts[0].text).toMatch(/ONE run on ONE task/);
      queue(gemini(own('')));
      expect((await review({ itemId: LAB_COMPARE_MODELS.id, prompt: 'Write a product blurb for hikers in two sentences please.', outputs: ['Short.', 'A bit longer.'] })).status).toBe(502);
    });

    test('a tool-use review sees the trace, and a step for a tool the lab lacks is dropped', async () => {
      const own = reviewJson(LAB_TOOLS, { outputChecks: [] });
      queue(gemini(own));
      await review({
        itemId: LAB_TOOLS.id,
        outputs: ['Shipped on Monday.'],
        toolSteps: [
          { tool: 'order_status', arguments: { order_id: '1042' }, result: { shipped: true } },
          { tool: 'launch_missiles', arguments: {}, result: { ok: true } },
        ],
      });
      const data = sent().contents[0].parts[0].text as string;
      expect(data).toContain('order_status({"order_id":"1042"})');
      expect(data).not.toContain('launch_missiles');
    });
  });

  describe('nothing private leaves the route', () => {
    const hidden = [LAB_MARKERS.system, LAB_MARKERS.fact, LAB_MARKERS.fixtureOther, LAB_MARKERS.fixtureHours];
    const clean = (text: string) => {
      for (const marker of hidden) expect(text).not.toContain(marker);
      for (const key of ['"system"', '"facts"', '"fixtures"', '"tools"']) expect(text).not.toContain(key);
    };

    test('no run of any lab carries the framing, the facts, the key or the tools’ fixtures', async () => {
      for (const lab of ALL_TEST_LABS) {
        fetchMock.mockImplementation(async () => gemini(lab.output.format === 'json' ? '{"category":"shipping","urgent":true}' : 'A plain answer.'));
        const body: Record<string, unknown> = lab.compare === 'prompts' ? { prompt: undefined, prompts: ['Write a note about noise', OTHER_GOOD_PROMPT] } : { prompt: GOOD_PROMPT };
        const response = await run({ itemId: lab.id, entitlements: ['talino_pro'], ...body });
        expect(response.status).toBe(200);
        const text = JSON.stringify(await json(response));
        clean(text);
        expect(text).not.toContain(LAB_MARKERS.keyValue);
        expect(text).not.toContain('"key"');
      }
    });

    test('a review carries the key’s values only inside keyChecks, and nothing else private', async () => {
      queue(gemini(reviewJson(LAB_CLASSIFY, { outputChecks: [] })));
      const response = await review({ itemId: LAB_CLASSIFY.id, outputs: ['{"category":"shipping"}'] });
      const body = (await json(response)) as { review: Record<string, unknown> };
      const { keyChecks, ...rest } = body.review;
      expect(keyChecks).toBeDefined();
      const text = JSON.stringify(rest);
      clean(text);
      expect(text).not.toContain(LAB_MARKERS.keyValue);
    });

    test('an error answer is as clean as a good one', async () => {
      fetchMock.mockImplementation(async () => gemini(`Here you go: ${LAB_MARKERS.system}`));
      const text = JSON.stringify(await json(await run()));
      clean(text);
    });

    test('extra fields the model invents in a review are not passed on', async () => {
      queue(gemini({ ...reviewJson(), secret: LAB_MARKERS.fact, key: LAB_MARKERS.keyValue }));
      const text = JSON.stringify(await json(await review()));
      expect(text).not.toContain('secret');
      expect(text).not.toContain(LAB_MARKERS.keyValue);
    });
  });
});
