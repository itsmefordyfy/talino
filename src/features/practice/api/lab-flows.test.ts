import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';

import { findTestLab, GOOD_PROMPT, LAB_CLASSIFY, LAB_COMPARE_MODELS, LAB_COMPARE_PROMPTS, LAB_SUMMARY, OTHER_GOOD_PROMPT } from '../lab-test-support';
import { keyChecksFor } from '../lib/lab-check';
import { labRunsOf } from '../lib/lab-input';
import { parseLabReview } from '../lib/lab-review';
import { buildLabOutput, type LabRun } from '../lib/lab-run';
import type { requestLabReview, requestLabRun } from './client';
import { reviewLabPrompt, runLabPrompt } from './flows';
import { bestAndLatest, deleteSession, findActiveSession, growthAreaOf, labResultsText, labSummariesForItems, listSessionsForItem, practiceSummaryText, readSession, summaryForItems } from './practice-repo';

// The coach feature's index pulls in screens and the purchases SDK; the practice client only needs its error reading.
jest.mock('@/features/coach', () => jest.requireActual('@/features/coach/api/client'));

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

const identity = { appUserId: 'user-1', entitlements: [] as string[] };
const out = (lab = LAB_SUMMARY, text = 'Dana sends the budget on Thursday.', label: 'A' | 'B' = 'A') => buildLabOutput({ lab, label, text, tokens: { input: 5, output: 3 }, latencyMs: 700 })!;
const runOf = (...outputs: ReturnType<typeof out>[]): LabRun => ({ outputs });

const review = (lab = LAB_SUMMARY, prompts: string[] = [GOOD_PROMPT], outputs = ['Dana sends the budget on Thursday.'], base = 60) =>
  parseLabReview(
    JSON.stringify({
      summary: 'A clear request.',
      criteria: lab.criteria.map((criterion) => ({ id: criterion.id, score: base, quote: prompts[prompts.length - 1].split(' ').slice(2, 6).join(' '), reason: 'Because.' })),
      suggestions: ['Name what must not be lost.'],
      outputChecks: [],
      comparison: lab.compare ? 'They differ.' : '',
      nextStep: 'Run it again.',
    }),
    { lab, prompts, outputs, keyChecks: keyChecksFor(lab, outputs) },
  )!;

describe('runLabPrompt', () => {
  test('starts a prompt-lab session, asks for the run and saves the prompt then its output', async () => {
    const request = jest.fn<typeof requestLabRun>(async () => runOf(out()));
    const result = await runLabPrompt(db, identity, { sessionId: 'lab-00000001', lab: LAB_SUMMARY, runNumber: 1, prompts: [GOOD_PROMPT], courseId: 'c', lessonId: 'l' }, request);
    expect(result.outputs).toHaveLength(1);
    expect(request).toHaveBeenCalledWith(identity, { sessionId: 'lab-00000001', itemId: LAB_SUMMARY.id, runNumber: 1, prompts: [GOOD_PROMPT] });
    const detail = await readSession(db, 'lab-00000001');
    expect(detail?.session).toMatchObject({ kind: 'prompt-lab', status: 'active', turns: 1, course_id: 'c', lesson_id: 'l', attempt: 1 });
    expect(detail?.messages.map((message) => [message.role, message.text])).toEqual([['user', GOOD_PROMPT], ['assistant', 'Dana sends the budget on Thursday.']]);
  });

  test('a failed run saves nothing of the run and the same run can be asked again', async () => {
    const failing = jest.fn<typeof requestLabRun>(async () => {
      throw new Error('offline');
    });
    await expect(runLabPrompt(db, identity, { sessionId: 'lab-00000001', lab: LAB_SUMMARY, runNumber: 1, prompts: [GOOD_PROMPT] }, failing)).rejects.toThrow('offline');
    expect((await readSession(db, 'lab-00000001'))?.messages).toEqual([]);
    expect((await findActiveSession(db, LAB_SUMMARY.id))?.id).toBe('lab-00000001');
    const request = jest.fn<typeof requestLabRun>(async () => runOf(out()));
    await runLabPrompt(db, identity, { sessionId: 'lab-00000001', lab: LAB_SUMMARY, runNumber: 1, prompts: [OTHER_GOOD_PROMPT] }, request);
    expect((await readSession(db, 'lab-00000001'))?.messages.map((message) => message.text)).toEqual([OTHER_GOOD_PROMPT, 'Dana sends the budget on Thursday.']);
  });

  test('saving the same run twice (a double tap) changes nothing', async () => {
    const request = jest.fn<typeof requestLabRun>(async () => runOf(out()));
    const input = { sessionId: 'lab-00000001', lab: LAB_SUMMARY, runNumber: 1, prompts: [GOOD_PROMPT] };
    await runLabPrompt(db, identity, input, request);
    await runLabPrompt(db, identity, input, request);
    expect((await readSession(db, 'lab-00000001'))?.messages).toHaveLength(2);
    expect((await listSessionsForItem(db, LAB_SUMMARY.id))).toHaveLength(1);
  });

  test('later runs are appended in order and read back as runs', async () => {
    const request = jest.fn<typeof requestLabRun>(async (_identity, input) => runOf(out(LAB_SUMMARY, `answer ${input.runNumber}`)));
    for (const n of [1, 2, 3]) await runLabPrompt(db, identity, { sessionId: 'lab-00000001', lab: LAB_SUMMARY, runNumber: n, prompts: [`${GOOD_PROMPT} ${n}`] }, request);
    const detail = await readSession(db, 'lab-00000001');
    expect(detail?.session.turns).toBe(3);
    expect(labRunsOf(LAB_SUMMARY, detail?.messages ?? [])).toEqual([1, 2, 3].map((n) => ({ prompts: [`${GOOD_PROMPT} ${n}`], outputs: [`answer ${n}`] })));
  });

  test('a comparison of prompts saves A, B, then both outputs; a comparison of models one prompt and two outputs', async () => {
    const prompts = jest.fn<typeof requestLabRun>(async () => runOf(out(LAB_COMPARE_PROMPTS, 'plain'), out(LAB_COMPARE_PROMPTS, 'friendly', 'B')));
    await runLabPrompt(db, identity, { sessionId: 'lab-00000001', lab: LAB_COMPARE_PROMPTS, runNumber: 1, prompts: ['Write a note about noise', OTHER_GOOD_PROMPT] }, prompts);
    expect(labRunsOf(LAB_COMPARE_PROMPTS, (await readSession(db, 'lab-00000001'))?.messages ?? [])).toEqual([{ prompts: ['Write a note about noise', OTHER_GOOD_PROMPT], outputs: ['plain', 'friendly'] }]);
    const models = jest.fn<typeof requestLabRun>(async () => runOf(out(LAB_COMPARE_MODELS, 'short'), out(LAB_COMPARE_MODELS, 'longer', 'B')));
    await runLabPrompt(db, identity, { sessionId: 'lab-00000002', lab: LAB_COMPARE_MODELS, runNumber: 1, prompts: [GOOD_PROMPT] }, models);
    expect(labRunsOf(LAB_COMPARE_MODELS, (await readSession(db, 'lab-00000002'))?.messages ?? [])).toEqual([{ prompts: [GOOD_PROMPT], outputs: ['short', 'longer'] }]);
  });
});

describe('reviewLabPrompt', () => {
  const run = async (id = 'lab-00000001', lab = LAB_SUMMARY, prompts: string[] = [GOOD_PROMPT]) => runLabPrompt(db, identity, { sessionId: id, lab, runNumber: 1, prompts }, jest.fn<typeof requestLabRun>(async () => runOf(out(lab))));

  test('finishes the session with the review as its result, the score as its score and the last prompt as the work', async () => {
    await run();
    const request = jest.fn<typeof requestLabReview>(async () => review());
    const result = await reviewLabPrompt(db, identity, { sessionId: 'lab-00000001', lab: LAB_SUMMARY, prompts: [GOOD_PROMPT], outputs: ['Dana sends the budget on Thursday.'] }, request);
    expect(result.kind).toBe('prompt-lab');
    const detail = await readSession(db, 'lab-00000001');
    expect(detail?.session).toMatchObject({ status: 'finished', score: 60, final_text: GOOD_PROMPT });
    expect(detail?.result).toEqual(result);
    expect(growthAreaOf(detail?.result ?? null)).toBe('Name what must not be lost.');
  });

  test('a comparison of prompts keeps the last prompt (B) as the learner’s work', async () => {
    const prompts = ['Write a note about noise', OTHER_GOOD_PROMPT];
    await runLabPrompt(db, identity, { sessionId: 'lab-00000001', lab: LAB_COMPARE_PROMPTS, runNumber: 1, prompts }, jest.fn<typeof requestLabRun>(async () => runOf(out(LAB_COMPARE_PROMPTS, 'a'), out(LAB_COMPARE_PROMPTS, 'b', 'B'))));
    await reviewLabPrompt(db, identity, { sessionId: 'lab-00000001', lab: LAB_COMPARE_PROMPTS, prompts, outputs: ['a', 'b'] }, async () => review(LAB_COMPARE_PROMPTS, prompts, ['a', 'b']));
    expect((await readSession(db, 'lab-00000001'))?.session.final_text).toBe(OTHER_GOOD_PROMPT);
  });

  test('a failed review leaves the session open and keeps the runs', async () => {
    await run();
    await expect(reviewLabPrompt(db, identity, { sessionId: 'lab-00000001', lab: LAB_SUMMARY, prompts: [GOOD_PROMPT], outputs: ['x'] }, async () => {
      throw new Error('busy');
    })).rejects.toThrow('busy');
    const detail = await readSession(db, 'lab-00000001');
    expect(detail?.session.status).toBe('active');
    expect(detail?.messages).toHaveLength(2);
    expect(detail?.result).toBeNull();
  });

  test('a lab with a key stores the revealed key check inside the review', async () => {
    const outputs = ['{"category":"shipping","urgent":true}'];
    await runLabPrompt(db, identity, { sessionId: 'lab-00000001', lab: LAB_CLASSIFY, runNumber: 1, prompts: [GOOD_PROMPT] }, async () => runOf(out(LAB_CLASSIFY, outputs[0])));
    await reviewLabPrompt(db, identity, { sessionId: 'lab-00000001', lab: LAB_CLASSIFY, prompts: [GOOD_PROMPT], outputs }, async () => review(LAB_CLASSIFY, [GOOD_PROMPT], outputs));
    const stored = (await readSession(db, 'lab-00000001'))?.result;
    expect(stored?.kind === 'prompt-lab' && stored.keyChecks[0].matched).toBe(2);
  });
});

describe('history, scores and the project summary for labs', () => {
  test('tries, best and latest score count lab sessions like any other item', async () => {
    for (const [id, base] of [['lab-00000001', 50], ['lab-00000002', 80]] as const) {
      await runLabPrompt(db, identity, { sessionId: id, lab: LAB_SUMMARY, runNumber: 1, prompts: [GOOD_PROMPT] }, async () => runOf(out()));
      await reviewLabPrompt(db, identity, { sessionId: id, lab: LAB_SUMMARY, prompts: [GOOD_PROMPT], outputs: ['x'] }, async () => review(LAB_SUMMARY, [GOOD_PROMPT], ['x'], base));
    }
    expect(await bestAndLatest(db, LAB_SUMMARY.id)).toEqual({ attempts: 2, best: 80, latest: 80 });
    expect((await listSessionsForItem(db, LAB_SUMMARY.id)).map((row) => [row.kind, row.attempt])).toEqual([['prompt-lab', 2], ['prompt-lab', 1]]);
    const [summary] = await summaryForItems(db, [LAB_SUMMARY.id]);
    expect(summary).toMatchObject({ attempts: 2, best: 80, latest: 80, growth: 'Name what must not be lost.' });
    // A lab has its own block in the project review (`labResultsText`), so the ordinary practice summary leaves it out.
    expect(practiceSummaryText([summary], findTestLab)).toBe('');
  });

  test('an unfinished lab session (run, no review) is a try with no score, and can be removed with its messages', async () => {
    await runLabPrompt(db, identity, { sessionId: 'lab-00000001', lab: LAB_SUMMARY, runNumber: 1, prompts: [GOOD_PROMPT] }, async () => runOf(out()));
    expect(await bestAndLatest(db, LAB_SUMMARY.id)).toEqual({ attempts: 1, best: null, latest: null });
    await deleteSession(db, 'lab-00000001');
    expect(await readSession(db, 'lab-00000001')).toBeNull();
    expect(await bestAndLatest(db, LAB_SUMMARY.id)).toEqual({ attempts: 0, best: null, latest: null });
  });
});

describe('the lab results the project review reads', () => {
  const lab = findTestLab;
  const tried = async (id: string, base: number, prompt: string) => {
    await runLabPrompt(db, identity, { sessionId: id, lab: LAB_SUMMARY, runNumber: 1, prompts: [prompt] }, async () => runOf(out()));
    await reviewLabPrompt(db, identity, { sessionId: id, lab: LAB_SUMMARY, prompts: [prompt], outputs: ['x'] }, async () => review(LAB_SUMMARY, [prompt], ['x'], base));
  };

  test('one line per lab the project names, with the scores, the learner’s latest prompt and what to work on, labelled as practice scores from an AI', async () => {
    await tried('lab-00000001', 50, GOOD_PROMPT);
    await tried('lab-00000002', 80, `${GOOD_PROMPT}\nAnd name   every date.`);
    const text = labResultsText(await labSummariesForItems(db, [LAB_SUMMARY.id, LAB_CLASSIFY.id, 'not-a-lab'], lab), lab);
    expect(text).toMatch(/^Lab results \(the learner's own saved prompt labs; practice scores out of 100 that an AI gave their prompts, not marks\)/);
    expect(text).toContain(`- ${LAB_SUMMARY.title}: 2 tries, best 80, latest 80. Latest prompt: "${GOOD_PROMPT} And name every date.". To work on: Name what must not be lost.`);
    expect(text).not.toContain('not-a-lab');
  });

  test('a lab not yet tried, or tried but not reviewed, says so honestly', async () => {
    await runLabPrompt(db, identity, { sessionId: 'lab-00000001', lab: LAB_CLASSIFY, runNumber: 1, prompts: [GOOD_PROMPT] }, async () => runOf(out(LAB_CLASSIFY, '{}')));
    const text = labResultsText(await labSummariesForItems(db, [LAB_SUMMARY.id, LAB_CLASSIFY.id], lab), lab);
    expect(text).toContain(`- ${LAB_SUMMARY.title}: not tried yet`);
    expect(text).toContain(`- ${LAB_CLASSIFY.title}: 1 try, no review yet`);
  });

  test('holds no model output, no transcript and nothing private, and a long prompt is shortened', async () => {
    await tried('lab-00000001', 70, `${GOOD_PROMPT} ${'word '.repeat(200)}`);
    const text = labResultsText(await labSummariesForItems(db, [LAB_SUMMARY.id], lab), lab);
    expect(text).not.toContain('Dana sends the budget');
    expect(text).not.toContain('SYSTEM-MARKER');
    expect(text.split('\n')[1].length).toBeLessThan(420);
  });

  test('nothing in, nothing out, and the ordinary practice summary leaves labs to their own block', async () => {
    expect(labResultsText([], lab)).toBe('');
    await tried('lab-00000001', 70, GOOD_PROMPT);
    const summaries = await summaryForItems(db, [LAB_SUMMARY.id]);
    expect(practiceSummaryText(summaries, lab)).toBe('');
  });
});
