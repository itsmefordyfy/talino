import type { SQLiteDatabase } from 'expo-sqlite';

import { nowTimestamp } from '@/lib/id';

import { interviewTitle, plannedQuestions, sanitizeSetup, type InterviewSetup } from '../lib/options';
import { readStoredReport, type InterviewReport } from '../lib/report';
import { countsAsQuestion, hasClosed, questionsAsked, type TurnKind } from '../lib/turn';

export type InterviewStatus = 'in_progress' | 'paused' | 'finished';

export type InterviewRow = { id: string; title: string; setup: string; status: InterviewStatus; notes: string; created_at: string; updated_at: string; ended_at: string | null };
export type InterviewMessage = { id: string; interview_id: string; role: 'user' | 'assistant'; text: string; kind: TurnKind | null; topic: string | null; created_at: string };

/** What the history list shows: the interview, how many answers it has and its score once it has been evaluated. */
export type InterviewSummary = {
  id: string;
  title: string;
  setup: InterviewSetup;
  status: InterviewStatus;
  answers: number;
  score: number | null;
  created_at: string;
  updated_at: string;
};

export type InterviewDetail = {
  interview: InterviewRow;
  setup: InterviewSetup;
  messages: InterviewMessage[];
  report: InterviewReport | null;
  /** Main questions asked so far, and how many this interview plans. */
  asked: number;
  planned: number;
  /** The interviewer said goodbye. */
  closed: boolean;
};

const STATUSES: readonly string[] = ['in_progress', 'paused', 'finished'];
const status = (value: string): InterviewStatus => (STATUSES.includes(value) ? (value as InterviewStatus) : 'in_progress');

/** Starts an interview with the id made when the setup screen opened, so a second tap on Start changes nothing. */
export async function createInterview(db: SQLiteDatabase, input: { id: string; setup: InterviewSetup }): Promise<void> {
  const setup = sanitizeSetup(input.setup);
  const now = nowTimestamp();
  await db.runAsync('INSERT OR IGNORE INTO interviews (id, title, setup, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', input.id, interviewTitle(setup), JSON.stringify(setup), 'in_progress', '', now, now);
}

/** The history, newest activity first. An interview whose opening never arrived has no messages and isn't listed. */
export async function listInterviews(db: SQLiteDatabase): Promise<InterviewSummary[]> {
  const rows = await db.getAllAsync<{ id: string; title: string; setup: string; status: string; created_at: string; updated_at: string; answers: number; score: number | null }>(
    `SELECT i.id, i.title, i.setup, i.status, i.created_at, i.updated_at,
            (SELECT COUNT(*) FROM interview_messages m WHERE m.interview_id = i.id AND m.role = 'user') AS answers,
            r.score AS score
       FROM interviews i LEFT JOIN interview_reports r ON r.interview_id = i.id
      WHERE EXISTS (SELECT 1 FROM interview_messages m WHERE m.interview_id = i.id)
      ORDER BY i.updated_at DESC, i.rowid DESC LIMIT 200`,
  );
  return rows.map((row) => ({ id: row.id, title: row.title, setup: parseSetup(row.setup), status: status(row.status), answers: row.answers, score: row.score, created_at: row.created_at, updated_at: row.updated_at }));
}

function parseSetup(text: string): InterviewSetup {
  try {
    return sanitizeSetup(JSON.parse(text));
  } catch {
    return sanitizeSetup(null);
  }
}

export async function readInterview(db: SQLiteDatabase, id: string): Promise<InterviewDetail | null> {
  const interview = await db.getFirstAsync<InterviewRow>('SELECT id, title, setup, status, notes, created_at, updated_at, ended_at FROM interviews WHERE id = ?', id);
  if (!interview) return null;
  const messages = await db.getAllAsync<InterviewMessage>('SELECT id, interview_id, role, text, kind, topic, created_at FROM interview_messages WHERE interview_id = ? ORDER BY created_at, rowid', id);
  const stored = await db.getFirstAsync<{ report: string }>('SELECT report FROM interview_reports WHERE interview_id = ?', id);
  const setup = parseSetup(interview.setup);
  return {
    interview: { ...interview, status: status(interview.status) },
    setup,
    messages,
    report: readStoredReport(stored?.report),
    asked: questionsAsked(messages),
    planned: plannedQuestions(setup),
    closed: hasClosed(messages),
  };
}

/**
 * The learner's answer, under an id made when they pressed Send, so sending the same answer again (a retry, a double tap) saves it once.
 * Answering a paused interview carries it on.
 */
export async function addAnswer(db: SQLiteDatabase, input: { id: string; interviewId: string; text: string }): Promise<void> {
  const now = nowTimestamp();
  await db.withTransactionAsync(async () => {
    await db.runAsync('INSERT OR IGNORE INTO interview_messages (id, interview_id, role, text, kind, topic, created_at) VALUES (?, ?, ?, ?, NULL, NULL, ?)', input.id, input.interviewId, 'user', input.text, now);
    await db.runAsync("UPDATE interviews SET updated_at = ?, status = CASE WHEN status = 'paused' THEN 'in_progress' ELSE status END WHERE id = ?", now, input.interviewId);
  });
}

/**
 * The interviewer's turn with the notes it wants to keep. A closing turn finishes the interview (so the evaluation is next); anything
 * else keeps it going.
 */
export async function addTurn(db: SQLiteDatabase, input: { id: string; interviewId: string; text: string; kind: TurnKind; topic: string; notes: string }): Promise<void> {
  const now = nowTimestamp();
  await db.withTransactionAsync(async () => {
    await db.runAsync('INSERT OR IGNORE INTO interview_messages (id, interview_id, role, text, kind, topic, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', input.id, input.interviewId, 'assistant', input.text, input.kind, input.topic || null, now);
    if (input.kind === 'closing') await db.runAsync("UPDATE interviews SET notes = ?, updated_at = ?, status = 'finished', ended_at = ? WHERE id = ?", input.notes, now, now, input.interviewId);
    else await db.runAsync('UPDATE interviews SET notes = ?, updated_at = ? WHERE id = ?', input.notes, now, input.interviewId);
  });
}

/** Pause, resume or finish. Finishing remembers when; resuming a finished interview (to answer more before it is evaluated) clears that. */
export async function setStatus(db: SQLiteDatabase, id: string, next: InterviewStatus): Promise<void> {
  const now = nowTimestamp();
  await db.runAsync('UPDATE interviews SET status = ?, updated_at = ?, ended_at = ? WHERE id = ?', next, now, next === 'finished' ? now : null, id);
}

/** The evaluation, kept with the interview. Evaluating again replaces it. */
export async function saveReport(db: SQLiteDatabase, id: string, report: InterviewReport): Promise<void> {
  const now = nowTimestamp();
  await db.withTransactionAsync(async () => {
    await db.runAsync('INSERT OR REPLACE INTO interview_reports (interview_id, score, report, created_at) VALUES (?, ?, ?, ?)', id, report.overall, JSON.stringify(report), now);
    await db.runAsync("UPDATE interviews SET status = 'finished', updated_at = ?, ended_at = COALESCE(ended_at, ?) WHERE id = ?", now, now, id);
  });
}

export async function deleteInterview(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM interviews WHERE id = ?', id);
}

export type PastScore = { id: string; title: string; score: number; created_at: string; report: InterviewReport | null };

/** Every evaluated interview, oldest first: the learner's progress over time. */
export async function listScores(db: SQLiteDatabase): Promise<PastScore[]> {
  const rows = await db.getAllAsync<{ id: string; title: string; score: number; report: string; created_at: string }>(
    'SELECT i.id, i.title, r.score, r.report, r.created_at FROM interview_reports r JOIN interviews i ON i.id = r.interview_id ORDER BY r.created_at, r.rowid',
  );
  return rows.map((row) => ({ id: row.id, title: row.title, score: row.score, created_at: row.created_at, report: readStoredReport(row.report) }));
}

/** The attempt before this one for the same position (ignoring case), to show what changed. */
export function previousAttempt(scores: readonly PastScore[], current: { id: string; title: string }): PastScore | null {
  const key = current.title.trim().toLowerCase();
  const own = scores.findIndex((entry) => entry.id === current.id);
  const earlier = (own === -1 ? scores : scores.slice(0, own)).filter((entry) => entry.id !== current.id && entry.title.trim().toLowerCase() === key);
  return earlier.length > 0 ? earlier[earlier.length - 1] : null;
}

/** Which kinds of turn move the progress bar (re-exported for the screens). */
export { countsAsQuestion };
