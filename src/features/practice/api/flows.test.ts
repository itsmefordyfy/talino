import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';

import { tooShortReport, type PracticeReport } from '../lib/report';
import { tooShortReview, type ReviewResult } from '../lib/review';
import { LEARNER_LINES, SCENARIO, TASK } from '../test-support';
import type { requestReport, requestReview, requestTurn } from './client';
import { finishRoleplay, reviewMessage, sendLearnerTurn } from './flows';
import { readSession, startSession } from './practice-repo';

// The coach feature's index pulls in screens and the purchases SDK; the practice client only needs its error reading.
jest.mock('@/features/coach', () => jest.requireActual('@/features/coach/api/client'));

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
  await startSession(db, { id: 'ps-00000001', itemId: SCENARIO.id, kind: 'roleplay', opening: SCENARIO.opening });
});
afterEach(() => db.close());

const identity = { appUserId: 'user-1', entitlements: [] as string[] };

describe('sendLearnerTurn', () => {
  test('saves the learner’s words first, asks the partner with everything after the opening, and saves the reply', async () => {
    const request = jest.fn<typeof requestTurn>(async () => ({ reply: 'Hm. When?', end: false }));
    const result = await sendLearnerTurn(db, identity, { sessionId: 'ps-00000001', scenario: SCENARIO, messageId: 'm-1', text: LEARNER_LINES[0] }, request);
    expect(result).toEqual({ reply: 'Hm. When?', end: false });
    expect(request).toHaveBeenCalledWith(identity, { sessionId: 'ps-00000001', itemId: SCENARIO.id, turn: 1, messages: [{ role: 'user', text: LEARNER_LINES[0] }] });
    const detail = await readSession(db, 'ps-00000001');
    expect(detail?.messages.map((message) => [message.role, message.text])).toEqual([['assistant', SCENARIO.opening], ['user', LEARNER_LINES[0]], ['assistant', 'Hm. When?']]);
    expect(detail?.session.turns).toBe(1);
  });

  test('a later turn sends the whole conversation so far and counts the turn', async () => {
    const request = jest.fn<typeof requestTurn>(async () => ({ reply: 'Ok.', end: false }));
    await sendLearnerTurn(db, identity, { sessionId: 'ps-00000001', scenario: SCENARIO, messageId: 'm-1', text: 'One.' }, request);
    await sendLearnerTurn(db, identity, { sessionId: 'ps-00000001', scenario: SCENARIO, messageId: 'm-2', text: 'Two.' }, request);
    expect(request).toHaveBeenLastCalledWith(identity, expect.objectContaining({ turn: 2, messages: [{ role: 'user', text: 'One.' }, { role: 'assistant', text: 'Ok.' }, { role: 'user', text: 'Two.' }] }));
  });

  test('a failure keeps the learner’s words, and sending the same message again saves it once', async () => {
    const failing = jest.fn<typeof requestTurn>(async () => {
      throw new Error('offline');
    });
    await expect(sendLearnerTurn(db, identity, { sessionId: 'ps-00000001', scenario: SCENARIO, messageId: 'm-1', text: 'Mine.' }, failing)).rejects.toThrow('offline');
    expect((await readSession(db, 'ps-00000001'))?.messages.map((message) => message.text)).toEqual([SCENARIO.opening, 'Mine.']);
    const request = jest.fn<typeof requestTurn>(async () => ({ reply: 'Ok.', end: false }));
    await sendLearnerTurn(db, identity, { sessionId: 'ps-00000001', scenario: SCENARIO, messageId: 'm-1', text: 'Mine.' }, request);
    const detail = await readSession(db, 'ps-00000001');
    expect(detail?.messages.map((message) => message.text)).toEqual([SCENARIO.opening, 'Mine.', 'Ok.']);
    expect(detail?.session.turns).toBe(1);
  });

  test('a reply is saved once even when the same turn is sent twice', async () => {
    const request = jest.fn<typeof requestTurn>(async () => ({ reply: 'Ok.', end: true }));
    await sendLearnerTurn(db, identity, { sessionId: 'ps-00000001', scenario: SCENARIO, messageId: 'm-1', text: 'Mine.' }, request);
    await sendLearnerTurn(db, identity, { sessionId: 'ps-00000001', scenario: SCENARIO, messageId: 'm-1', text: 'Mine.' }, request);
    expect((await readSession(db, 'ps-00000001'))?.messages).toHaveLength(3);
  });
});

describe('finishRoleplay', () => {
  const report = (overrides: Partial<PracticeReport> = {}): PracticeReport => ({ kind: 'roleplay', tooShort: false, overall: 70, rating: 'good', summary: 'Fine.', criteria: [], strengths: [], growth: [], nextStep: 'Next.', ...overrides });

  test('asks for the debrief of the whole conversation after the opening and keeps it', async () => {
    const turn = jest.fn<typeof requestTurn>(async () => ({ reply: 'Ok.', end: false }));
    await sendLearnerTurn(db, identity, { sessionId: 'ps-00000001', scenario: SCENARIO, messageId: 'm-1', text: 'One.' }, turn);
    const request = jest.fn<typeof requestReport>(async () => report());
    const result = await finishRoleplay(db, identity, { sessionId: 'ps-00000001', scenario: SCENARIO }, request);
    expect(result.overall).toBe(70);
    expect(request).toHaveBeenCalledWith(identity, { sessionId: 'ps-00000001', itemId: SCENARIO.id, messages: [{ role: 'user', text: 'One.' }, { role: 'assistant', text: 'Ok.' }] });
    expect((await readSession(db, 'ps-00000001'))?.session).toMatchObject({ status: 'finished', score: 70 });
  });

  test('a failed debrief leaves the session open so it can be asked again', async () => {
    const request = jest.fn<typeof requestReport>(async () => {
      throw new Error('busy');
    });
    await expect(finishRoleplay(db, identity, { sessionId: 'ps-00000001', scenario: SCENARIO }, request)).rejects.toThrow('busy');
    expect((await readSession(db, 'ps-00000001'))?.session.status).toBe('active');
  });

  test('a too-short debrief is kept, with no score', async () => {
    const request = jest.fn<typeof requestReport>(async () => tooShortReport('Too short.'));
    await finishRoleplay(db, identity, { sessionId: 'ps-00000001', scenario: SCENARIO }, request);
    expect((await readSession(db, 'ps-00000001'))?.session).toMatchObject({ status: 'finished', score: null });
  });
});

describe('reviewMessage', () => {
  const review = (overrides: Partial<ReviewResult> = {}): ReviewResult => ({ ...tooShortReview('x'), tooShort: false, overall: 64, rating: 'fair', ...overrides });

  test('starts the review as a session of its own, keeps the learner’s text and the review', async () => {
    const request = jest.fn<typeof requestReview>(async () => review());
    const result = await reviewMessage(db, identity, { sessionId: 'rv-00000001', task: TASK, text: 'My message.', courseId: 'c', lessonId: 'l' }, request);
    expect(result.overall).toBe(64);
    expect(request).toHaveBeenCalledWith(identity, { sessionId: 'rv-00000001', itemId: TASK.id, text: 'My message.' });
    const detail = await readSession(db, 'rv-00000001');
    expect(detail?.session).toMatchObject({ kind: 'message-review', status: 'finished', score: 64, final_text: 'My message.', course_id: 'c', lesson_id: 'l' });
  });

  test('a second review of a rewrite is the next attempt and sends the earlier text along', async () => {
    const request = jest.fn<typeof requestReview>(async () => review({ overall: 80 }));
    await reviewMessage(db, identity, { sessionId: 'rv-00000001', task: TASK, text: 'First.' }, request);
    await reviewMessage(db, identity, { sessionId: 'rv-00000002', task: TASK, text: 'Second.', previous: 'First.' }, request);
    expect(request).toHaveBeenLastCalledWith(identity, { sessionId: 'rv-00000002', itemId: TASK.id, text: 'Second.', previous: 'First.' });
    expect((await readSession(db, 'rv-00000002'))?.session.attempt).toBe(2);
  });

  test('a failed review leaves an unfinished session that is not mistaken for a result', async () => {
    const request = jest.fn<typeof requestReview>(async () => {
      throw new Error('offline');
    });
    await expect(reviewMessage(db, identity, { sessionId: 'rv-00000001', task: TASK, text: 'Mine.' }, request)).rejects.toThrow('offline');
    expect((await readSession(db, 'rv-00000001'))?.session).toMatchObject({ status: 'active', score: null });
  });
});
