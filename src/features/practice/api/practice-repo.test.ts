import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';
import { deleteAllData } from '@/features/settings/api/reset';

import { parseReport } from '../lib/report';
import { parseReview } from '../lib/review';
import { LEARNER_LINES, SCENARIO, TASK, findTestItem } from '../test-support';
import {
  abandonSession,
  appendMessage,
  bestAndLatest,
  deleteSession,
  finishSession,
  findActiveSession,
  growthAreaOf,
  listSessionsForItem,
  practiceSummaryForProject,
  practiceSummaryText,
  readSession,
  startSession,
  summaryForItems,
} from './practice-repo';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

let counter = 0;
const mid = () => `pm-${String(++counter).padStart(6, '0')}`;

const report = (scores: [number, number, number] = [80, 70, 60]) =>
  parseReport(
    JSON.stringify({
      summary: 'Fine.',
      criteria: SCENARIO.criteria.map((id, index) => ({ id, score: scores[index], reason: 'Because.' })),
      strengths: [{ quote: 'I can send you the full draft by Friday at noon', point: 'Concrete.' }],
      growth: [{ quote: 'did not tell you sooner', point: 'Say how you will prevent it.' }],
      nextStep: 'Confirm what happens next.',
      tooShort: false,
    }),
    { scenario: SCENARIO, learnerLines: LEARNER_LINES },
  );
const review = (base = 60) =>
  parseReview(
    JSON.stringify({
      summary: 'Fine.',
      criteria: TASK.criteria.map((id) => ({ id, score: base, reason: 'Because.' })),
      missing: ['A fallback date'],
      improved: 'Hi Dana, I am sorry. Friday at noon, and I will tell you the same day if it moves.',
      changes: [{ what: 'Added a warning', why: 'A fallback.' }],
      nextStep: 'Rewrite it.',
      tooShort: false,
    }),
    { task: TASK, learnerText: 'x' },
  );

async function playedRoleplay(id: string, scores?: [number, number, number], itemId = SCENARIO.id) {
  await startSession(db, { id, itemId, kind: 'roleplay', courseId: 'soft-skills-workplace', lessonId: 'lesson-1', opening: SCENARIO.opening });
  for (const line of LEARNER_LINES) {
    await appendMessage(db, { id: mid(), sessionId: id, role: 'user', text: line });
    await appendMessage(db, { id: mid(), sessionId: id, role: 'assistant', text: 'Hm.' });
  }
  const result = report(scores);
  if (!result) throw new Error('fixture report is invalid');
  await finishSession(db, { id, result });
}

describe('starting and playing a role-play', () => {
  test('starting twice with the same id keeps one session (a double tap on Start)', async () => {
    await startSession(db, { id: 'ps-00000001', itemId: SCENARIO.id, kind: 'roleplay' });
    await startSession(db, { id: 'ps-00000001', itemId: SCENARIO.id, kind: 'roleplay' });
    expect(await db.getAllAsync('SELECT id FROM practice_sessions')).toHaveLength(1);
  });

  test('a session knows where it was started from, and starts active with the first attempt', async () => {
    await startSession(db, { id: 'ps-00000001', itemId: SCENARIO.id, kind: 'roleplay', courseId: 'soft-skills-workplace', lessonId: 'lesson-1', projectId: 'p1' });
    const detail = await readSession(db, 'ps-00000001');
    expect(detail?.session).toMatchObject({ item_id: SCENARIO.id, kind: 'roleplay', course_id: 'soft-skills-workplace', lesson_id: 'lesson-1', project_id: 'p1', attempt: 1, status: 'active', turns: 0, score: null, ended_at: null });
  });

  test('the opening line is the first message, so the saved transcript reads whole', async () => {
    await startSession(db, { id: 'ps-00000001', itemId: SCENARIO.id, kind: 'roleplay', opening: SCENARIO.opening });
    expect((await readSession(db, 'ps-00000001'))?.messages.map((message) => [message.position, message.role, message.text])).toEqual([[1, 'assistant', SCENARIO.opening]]);
  });

  test('messages keep their order, turns are the learner’s only, and sending the same message again saves it once', async () => {
    await startSession(db, { id: 'ps-00000001', itemId: SCENARIO.id, kind: 'roleplay', opening: SCENARIO.opening });
    await appendMessage(db, { id: 'm-1', sessionId: 'ps-00000001', role: 'user', text: 'First.' });
    await appendMessage(db, { id: 'm-1', sessionId: 'ps-00000001', role: 'user', text: 'First.' });
    await appendMessage(db, { id: 'm-2', sessionId: 'ps-00000001', role: 'assistant', text: 'Reply.' });
    await appendMessage(db, { id: 'm-3', sessionId: 'ps-00000001', role: 'user', text: 'Second.' });
    const detail = await readSession(db, 'ps-00000001');
    expect(detail?.messages.map((message) => message.text)).toEqual([SCENARIO.opening, 'First.', 'Reply.', 'Second.']);
    expect(detail?.messages.map((message) => message.position)).toEqual([1, 2, 3, 4]);
    expect(detail?.session.turns).toBe(2);
  });

  test('finishing keeps the debrief and its score, and ends the session', async () => {
    await playedRoleplay('ps-00000001');
    const detail = await readSession(db, 'ps-00000001');
    expect(detail?.session).toMatchObject({ status: 'finished', score: 70, turns: 3 });
    expect(detail?.session.ended_at).not.toBeNull();
    expect(detail?.result).toMatchObject({ kind: 'roleplay', overall: 70 });
  });

  test('a debrief that was too short to judge is kept with no score', async () => {
    await startSession(db, { id: 'ps-00000001', itemId: SCENARIO.id, kind: 'roleplay' });
    await finishSession(db, { id: 'ps-00000001', result: { kind: 'roleplay', tooShort: true, overall: null, rating: null, summary: 'Too short.', criteria: [], strengths: [], growth: [], nextStep: '' } });
    expect((await readSession(db, 'ps-00000001'))?.session).toMatchObject({ status: 'finished', score: null });
    expect(await bestAndLatest(db, SCENARIO.id)).toEqual({ attempts: 1, best: null, latest: null });
  });

  test('abandoning an active session ends it without a score, and does not touch a finished one', async () => {
    await startSession(db, { id: 'ps-00000001', itemId: SCENARIO.id, kind: 'roleplay' });
    await abandonSession(db, 'ps-00000001');
    expect((await readSession(db, 'ps-00000001'))?.session.status).toBe('abandoned');
    await playedRoleplay('ps-00000002');
    await abandonSession(db, 'ps-00000002');
    expect((await readSession(db, 'ps-00000002'))?.session.status).toBe('finished');
  });

  test('an unreadable stored debrief reads as none, so the screen offers to get feedback again', async () => {
    await startSession(db, { id: 'ps-00000001', itemId: SCENARIO.id, kind: 'roleplay' });
    await db.runAsync("UPDATE practice_sessions SET report = '{' WHERE id = 'ps-00000001'");
    expect((await readSession(db, 'ps-00000001'))?.result).toBeNull();
  });

  test('a session that does not exist reads as nothing', async () => {
    expect(await readSession(db, 'nope')).toBeNull();
  });
});

describe('attempts and history', () => {
  test('every try at the same item is a new attempt, numbered in order, and every session is kept', async () => {
    await playedRoleplay('ps-00000001', [50, 50, 50]);
    await playedRoleplay('ps-00000002', [70, 70, 70]);
    await playedRoleplay('ps-00000003', [90, 90, 90]);
    await playedRoleplay('ps-00000004', [60, 60, 60], 'test-standup-update');
    const history = await listSessionsForItem(db, SCENARIO.id);
    expect(history.map((entry) => [entry.id, entry.attempt, entry.score])).toEqual([
      ['ps-00000003', 3, 90],
      ['ps-00000002', 2, 70],
      ['ps-00000001', 1, 50],
    ]);
    expect((await readSession(db, 'ps-00000004'))?.session.attempt).toBe(1);
  });

  test('the attempt number never repeats after a session is deleted', async () => {
    await playedRoleplay('ps-00000001');
    await playedRoleplay('ps-00000002');
    await deleteSession(db, 'ps-00000001');
    await startSession(db, { id: 'ps-00000003', itemId: SCENARIO.id, kind: 'roleplay' });
    expect((await readSession(db, 'ps-00000003'))?.session.attempt).toBe(3);
  });

  test('best and latest scores, and how many attempts, ignoring tries that were not scored', async () => {
    await playedRoleplay('ps-00000001', [90, 90, 90]);
    await playedRoleplay('ps-00000002', [60, 60, 60]);
    await startSession(db, { id: 'ps-00000003', itemId: SCENARIO.id, kind: 'roleplay' });
    expect(await bestAndLatest(db, SCENARIO.id)).toEqual({ attempts: 3, best: 90, latest: 60 });
    expect(await bestAndLatest(db, 'never-practised')).toEqual({ attempts: 0, best: null, latest: null });
  });

  test('the history entry says how far a session got without loading its messages', async () => {
    await playedRoleplay('ps-00000001');
    const [entry] = await listSessionsForItem(db, SCENARIO.id);
    expect(entry).toMatchObject({ status: 'finished', turns: 3, score: 70, lessonId: 'lesson-1' });
  });

  test('the unfinished session of an item can be found to resume', async () => {
    expect(await findActiveSession(db, SCENARIO.id)).toBeNull();
    await playedRoleplay('ps-00000001');
    expect(await findActiveSession(db, SCENARIO.id)).toBeNull();
    await startSession(db, { id: 'ps-00000002', itemId: SCENARIO.id, kind: 'roleplay' });
    expect((await findActiveSession(db, SCENARIO.id))?.id).toBe('ps-00000002');
  });
});

describe('message reviews', () => {
  test('a review keeps the learner’s own text and the coach’s review, and scores like a debrief', async () => {
    await startSession(db, { id: 'rv-00000001', itemId: TASK.id, kind: 'message-review' });
    const result = review(60);
    if (!result) throw new Error('fixture review is invalid');
    await finishSession(db, { id: 'rv-00000001', result, finalText: 'My own message to Dana.' });
    const detail = await readSession(db, 'rv-00000001');
    expect(detail?.session).toMatchObject({ kind: 'message-review', status: 'finished', score: 60, final_text: 'My own message to Dana.' });
    expect(detail?.result).toMatchObject({ kind: 'message-review', missing: ['A fallback date'] });
  });

  test('the coach’s improved version is never stored as the learner’s text', async () => {
    await startSession(db, { id: 'rv-00000001', itemId: TASK.id, kind: 'message-review' });
    const result = review(60);
    if (!result) throw new Error('fixture review is invalid');
    await finishSession(db, { id: 'rv-00000001', result, finalText: 'Mine.' });
    expect((await readSession(db, 'rv-00000001'))?.session.final_text).toBe('Mine.');
    expect((await readSession(db, 'rv-00000001'))?.session.final_text).not.toBe(result.improved);
  });
});

describe('deleting', () => {
  test('deleting a session removes its messages too', async () => {
    await playedRoleplay('ps-00000001');
    await playedRoleplay('ps-00000002');
    await deleteSession(db, 'ps-00000001');
    expect(await db.getAllAsync("SELECT id FROM practice_messages WHERE session_id = 'ps-00000001'")).toEqual([]);
    expect((await db.getAllAsync("SELECT id FROM practice_messages WHERE session_id = 'ps-00000002'")).length).toBeGreaterThan(0);
    expect(await readSession(db, 'ps-00000001')).toBeNull();
  });

  test('Delete all data clears practice too', async () => {
    await playedRoleplay('ps-00000001');
    await deleteAllData(db);
    expect(await db.getAllAsync('SELECT id FROM practice_sessions')).toEqual([]);
    expect(await db.getAllAsync('SELECT id FROM practice_messages')).toEqual([]);
  });
});

describe('summaries for a project review', () => {
  test('one line per item: attempts, best and latest score and one growth area, from the learner’s saved sessions', async () => {
    await playedRoleplay('ps-00000001', [50, 50, 50]);
    await playedRoleplay('ps-00000002', [80, 80, 80]);
    const summaries = await summaryForItems(db, [SCENARIO.id, TASK.id]);
    expect(summaries).toEqual([
      { itemId: SCENARIO.id, attempts: 2, best: 80, latest: 80, growth: 'Say how you will prevent it.' },
      { itemId: TASK.id, attempts: 0, best: null, latest: null, growth: null },
    ]);
  });

  test('a review’s growth area is the first thing it said was missing', async () => {
    await startSession(db, { id: 'rv-00000001', itemId: TASK.id, kind: 'message-review' });
    const result = review(60);
    if (!result) throw new Error('fixture review is invalid');
    await finishSession(db, { id: 'rv-00000001', result, finalText: 'Mine.' });
    expect(growthAreaOf(result)).toBe('A fallback date');
    expect((await summaryForItems(db, [TASK.id]))[0].growth).toBe('A fallback date');
  });

  test('the text is labelled as practice results, names each item, and says plainly when nothing was practised', async () => {
    await playedRoleplay('ps-00000001', [80, 80, 80]);
    const text = await practiceSummaryForProject(db, [SCENARIO.id, TASK.id], findTestItem);
    expect(text).toContain('Practice results');
    expect(text).toContain(SCENARIO.title);
    expect(text).toContain('best 80');
    expect(text).toContain('latest 80');
    expect(text).toContain('Say how you will prevent it.');
    expect(text).toContain(`${TASK.title}: not practised yet`);
    // Nothing private from the scenario leaks into the project review's input.
    expect(text).not.toContain('MARKER');
  });

  test('with no items there is no summary at all', async () => {
    expect(await practiceSummaryForProject(db, [], findTestItem)).toBe('');
    expect(practiceSummaryText([], () => undefined)).toBe('');
  });

  test('an item missing from the catalog is still named by its id, never dropped', () => {
    expect(practiceSummaryText([{ itemId: 'gone', attempts: 1, best: 70, latest: 70, growth: null }], () => undefined)).toContain('gone');
  });
});
