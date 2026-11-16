import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';
import { deleteAllData } from '@/features/settings/api/reset';

import { DEFAULT_SETUP } from '../lib/options';
import { parseReport, CATEGORY_IDS, type InterviewReport } from '../lib/report';
import { addAnswer, addTurn, createInterview, deleteInterview, listInterviews, listScores, previousAttempt, readInterview, saveReport, setStatus } from './interview-repo';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

let counter = 0;
const mid = () => `m-${String(++counter).padStart(6, '0')}`;
const setup = { ...DEFAULT_SETUP, position: 'React Native Developer', type: 'react-native' as const, length: 'quick' as const };
const report = (overall = 70): InterviewReport =>
  parseReport(
    JSON.stringify({
      summary: 'Fine.',
      categories: CATEGORY_IDS.map((id) => ({ id, score: overall, feedback: 'x' })),
      answers: [{ turn: 1, question: 'Q', score: 3, why: 'Because.', improved: 'Better.' }],
      skills: [],
      nextSteps: [],
    }),
    { answerCount: 2, courseIds: new Set() },
  ) as InterviewReport;

async function started(id = 'iv-00000001', opening = 'Welcome. Tell me about your app.') {
  await createInterview(db, { id, setup });
  await addTurn(db, { id: mid(), interviewId: id, text: opening, kind: 'opening', topic: 'Experience', notes: 'Just started.' });
  return id;
}

describe('an interview in progress', () => {
  test('creating it twice keeps one row (a double tap on Start)', async () => {
    await createInterview(db, { id: 'iv-00000001', setup });
    await createInterview(db, { id: 'iv-00000001', setup });
    expect((await db.getAllAsync('SELECT id FROM interviews')).length).toBe(1);
  });

  test('sending the same answer or turn again saves it once', async () => {
    const id = await started();
    await addAnswer(db, { id: 'a-1', interviewId: id, text: 'Same.' });
    await addAnswer(db, { id: 'a-1', interviewId: id, text: 'Same.' });
    await addTurn(db, { id: 't-1', interviewId: id, text: 'Next?', kind: 'question', topic: '', notes: '' });
    await addTurn(db, { id: 't-1', interviewId: id, text: 'Next?', kind: 'question', topic: '', notes: '' });
    expect((await readInterview(db, id))?.messages).toHaveLength(3);
  });

  test('is not in the history until the interviewer has opened it', async () => {
    await createInterview(db, { id: 'iv-00000001', setup });
    expect(await listInterviews(db)).toEqual([]);
    await addTurn(db, { id: mid(), interviewId: 'iv-00000001', text: 'Hi.', kind: 'opening', topic: '', notes: '' });
    expect((await listInterviews(db)).map((entry) => entry.title)).toEqual(['React Native Developer']);
  });

  test('keeps the whole conversation in order, the notes, and the progress worked out from it', async () => {
    const id = await started();
    await addAnswer(db, { id: mid(), interviewId: id, text: 'I built a pet app.' });
    await addTurn(db, { id: mid(), interviewId: id, text: 'How did you sync?', kind: 'follow_up', topic: 'Sync', notes: 'Q1 pet app.' });
    await addAnswer(db, { id: mid(), interviewId: id, text: 'When online.' });
    await addTurn(db, { id: mid(), interviewId: id, text: 'Next: testing?', kind: 'question', topic: 'Testing', notes: 'Q1 pet app. Q2 sync thin.' });
    const detail = await readInterview(db, id);
    expect(detail?.messages.map((message) => [message.role, message.kind])).toEqual([['assistant', 'opening'], ['user', null], ['assistant', 'follow_up'], ['user', null], ['assistant', 'question']]);
    expect(detail?.interview.notes).toBe('Q1 pet app. Q2 sync thin.');
    expect(detail?.asked).toBe(2);
    expect(detail?.planned).toBe(4);
    expect(detail?.closed).toBe(false);
    expect(detail?.setup.position).toBe('React Native Developer');
  });

  test('the closing finishes the interview', async () => {
    const id = await started();
    await addAnswer(db, { id: mid(), interviewId: id, text: 'A.' });
    await addTurn(db, { id: mid(), interviewId: id, text: 'Thank you, that is all.', kind: 'closing', topic: '', notes: 'done' });
    const detail = await readInterview(db, id);
    expect(detail?.closed).toBe(true);
    expect(detail?.interview.status).toBe('finished');
    expect(detail?.interview.ended_at).not.toBeNull();
  });

  test('pausing and resuming; answering a paused interview carries it on', async () => {
    const id = await started();
    await setStatus(db, id, 'paused');
    expect((await readInterview(db, id))?.interview.status).toBe('paused');
    expect((await listInterviews(db))[0].status).toBe('paused');
    await addAnswer(db, { id: mid(), interviewId: id, text: 'Back again.' });
    expect((await readInterview(db, id))?.interview.status).toBe('in_progress');
  });

  test('ending it on purpose remembers when, and resuming clears that', async () => {
    const id = await started();
    await setStatus(db, id, 'finished');
    expect((await readInterview(db, id))?.interview.ended_at).not.toBeNull();
    await setStatus(db, id, 'in_progress');
    expect((await readInterview(db, id))?.interview.ended_at).toBeNull();
  });

  test('an unknown interview reads as nothing', async () => {
    expect(await readInterview(db, 'nope')).toBeNull();
  });
});

describe('the evaluation and progress', () => {
  test('is kept with the interview, shows in the history and can be replaced', async () => {
    const id = await started();
    await saveReport(db, id, report(64));
    expect((await readInterview(db, id))?.report?.overall).toBe(64);
    expect((await listInterviews(db))[0].score).toBe(64);
    await saveReport(db, id, report(80));
    expect((await readInterview(db, id))?.report?.overall).toBe(80);
    expect((await db.getAllAsync('SELECT * FROM interview_reports')).length).toBe(1);
  });

  test('a damaged stored evaluation reads as none, so the screen offers to evaluate again', async () => {
    const id = await started();
    await db.runAsync("INSERT INTO interview_reports (interview_id, score, report, created_at) VALUES (?, 50, '{broken', '2026-11-15T00:00:00.000Z')", id);
    expect((await readInterview(db, id))?.report).toBeNull();
  });

  test('scores over time, oldest first, and the earlier attempt at the same position', async () => {
    const first = await started('iv-00000001');
    await saveReport(db, first, report(55));
    const other = await started('iv-00000002');
    await createInterview(db, { id: 'iv-00000003', setup: { ...setup, position: 'Data Analyst' } });
    await addTurn(db, { id: mid(), interviewId: 'iv-00000003', text: 'Hi', kind: 'opening', topic: '', notes: '' });
    await saveReport(db, 'iv-00000003', report(90));
    await saveReport(db, other, report(72));
    const scores = await listScores(db);
    expect(scores.map((entry) => entry.score)).toEqual([55, 90, 72]);
    expect(previousAttempt(scores, { id: other, title: 'react native developer' })?.id).toBe(first);
    expect(previousAttempt(scores, { id: first, title: 'React Native Developer' })).toBeNull();
    expect(previousAttempt(scores, { id: 'iv-00000003', title: 'Data Analyst' })).toBeNull();
  });
});

describe('removing', () => {
  test('deleting an interview removes its messages and evaluation', async () => {
    const id = await started();
    await saveReport(db, id, report());
    await deleteInterview(db, id);
    for (const table of ['interviews', 'interview_messages', 'interview_reports']) expect((await db.getAllAsync(`SELECT * FROM ${table}`)).length).toBe(0);
  });

  test('Delete all data clears interviews too', async () => {
    const id = await started();
    await saveReport(db, id, report());
    await deleteAllData(db);
    for (const table of ['interviews', 'interview_messages', 'interview_reports']) expect((await db.getAllAsync(`SELECT * FROM ${table}`)).length).toBe(0);
  });
});
