import type { SQLiteDatabase } from 'expo-sqlite';

import { nowTimestamp } from '@/lib/id';

import { findPracticeItem } from '../catalog';
import type { PracticeRole } from '../lib/sanitize';
import { readStoredLabReview } from '../lib/lab-review';
import { readStoredReport, type PracticeReport } from '../lib/report';
import { readStoredReview, type PracticeResult, type ReviewResult } from '../lib/review';
import type { LabReview } from '../lib/lab-review';
import type { PracticeItem } from '../types';

/**
 * The learner's practice sessions on this phone (role-plays, message reviews and prompt labs; a lab session keeps each prompt as a `user`
 * message and the model's output as an `assistant` message, in order, and its review in `report`). Ids are made on the phone, so a double tap or a
 * retry saves once; the progress (turns, attempts, best and latest score) is worked out from what is saved, never counted by hand.
 * Every session is kept: a retry is a new attempt, never a replacement. Nothing here is synced or backed up (private words).
 */

export type PracticeKind = 'roleplay' | 'message-review' | 'prompt-lab';
export type PracticeStatus = 'active' | 'finished' | 'abandoned';

export type SessionRow = {
  id: string;
  item_id: string;
  kind: PracticeKind;
  course_id: string | null;
  lesson_id: string | null;
  project_id: string | null;
  attempt: number;
  status: PracticeStatus;
  turns: number;
  score: number | null;
  report: string | null;
  final_text: string | null;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PracticeMessageRow = { id: string; session_id: string; position: number; role: PracticeRole; text: string; created_at: string };

export type SessionDetail = {
  session: SessionRow;
  messages: PracticeMessageRow[];
  /** The debrief or the review, read back; null while there is none, or when what was saved is damaged. */
  result: PracticeResult | null;
};

/** What a history list shows for one try, without loading its messages. */
export type SessionSummary = {
  id: string;
  kind: PracticeKind;
  attempt: number;
  status: PracticeStatus;
  turns: number;
  score: number | null;
  courseId: string | null;
  lessonId: string | null;
  projectId: string | null;
  startedAt: string;
  endedAt: string | null;
};

const KINDS: readonly string[] = ['roleplay', 'message-review', 'prompt-lab'];
const STATUSES: readonly string[] = ['active', 'finished', 'abandoned'];

export type StartInput = {
  /** Made on the phone when the practice screen opened, so a second tap on Start changes nothing. */
  id: string;
  itemId: string;
  kind: PracticeKind;
  courseId?: string;
  lessonId?: string;
  projectId?: string;
  /** A role-play's first line from the partner: saved as the first message so the transcript reads whole. */
  opening?: string;
};

/** Starts a session as the next attempt at its item. Starting the same id again changes nothing. */
export async function startSession(db: SQLiteDatabase, input: StartInput): Promise<void> {
  if (!KINDS.includes(input.kind)) throw new Error(`Unknown practice kind "${input.kind}".`);
  const now = nowTimestamp();
  await db.withTransactionAsync(async () => {
    const existing = await db.getFirstAsync<{ id: string }>('SELECT id FROM practice_sessions WHERE id = ?', input.id);
    if (existing) return;
    // The highest attempt so far plus one, so a deleted try never lets a number repeat.
    const last = await db.getFirstAsync<{ attempt: number | null }>('SELECT MAX(attempt) AS attempt FROM practice_sessions WHERE item_id = ?', input.itemId);
    await db.runAsync(
      "INSERT INTO practice_sessions (id, item_id, kind, course_id, lesson_id, project_id, attempt, status, turns, started_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', 0, ?, ?, ?)",
      input.id,
      input.itemId,
      input.kind,
      input.courseId ?? null,
      input.lessonId ?? null,
      input.projectId ?? null,
      (last?.attempt ?? 0) + 1,
      now,
      now,
      now,
    );
    if (input.opening) await db.runAsync("INSERT INTO practice_messages (id, session_id, position, role, text, created_at) VALUES (?, ?, 1, 'assistant', ?, ?)", `${input.id}-opening`, input.id, input.opening, now);
  });
}

/**
 * Adds a message under an id made when it was sent, so sending it again (a retry, a double tap) saves it once. The turn count is
 * recounted from the messages, so it can't drift.
 */
export async function appendMessage(db: SQLiteDatabase, input: { id: string; sessionId: string; role: PracticeRole; text: string }): Promise<void> {
  const now = nowTimestamp();
  await db.withTransactionAsync(async () => {
    const existing = await db.getFirstAsync<{ id: string }>('SELECT id FROM practice_messages WHERE id = ?', input.id);
    if (!existing) {
      const last = await db.getFirstAsync<{ position: number | null }>('SELECT MAX(position) AS position FROM practice_messages WHERE session_id = ?', input.sessionId);
      await db.runAsync('INSERT INTO practice_messages (id, session_id, position, role, text, created_at) VALUES (?, ?, ?, ?, ?, ?)', input.id, input.sessionId, (last?.position ?? 0) + 1, input.role, input.text, now);
    }
    await db.runAsync("UPDATE practice_sessions SET turns = (SELECT COUNT(*) FROM practice_messages WHERE session_id = ? AND role = 'user'), updated_at = ? WHERE id = ?", input.sessionId, now, input.sessionId);
  });
}

/**
 * Saves one lab run, its prompt(s) then its output(s), in ONE transaction, under ids made from the run number: a run is either wholly saved or not
 * at all, and saving the same run again (a retry, a double tap) changes nothing. The turn count is recounted from the messages.
 */
export async function appendLabRun(db: SQLiteDatabase, input: { sessionId: string; runNumber: number; prompts: readonly string[]; outputs: readonly string[] }): Promise<void> {
  const now = nowTimestamp();
  const messages = [
    ...input.prompts.map((text, index) => ({ id: `${input.sessionId}-r${input.runNumber}-p${index}`, role: 'user' as const, text })),
    ...input.outputs.map((text, index) => ({ id: `${input.sessionId}-r${input.runNumber}-o${index}`, role: 'assistant' as const, text })),
  ];
  await db.withTransactionAsync(async () => {
    for (const message of messages) {
      const existing = await db.getFirstAsync<{ id: string }>('SELECT id FROM practice_messages WHERE id = ?', message.id);
      if (existing) continue;
      const last = await db.getFirstAsync<{ position: number | null }>('SELECT MAX(position) AS position FROM practice_messages WHERE session_id = ?', input.sessionId);
      await db.runAsync('INSERT INTO practice_messages (id, session_id, position, role, text, created_at) VALUES (?, ?, ?, ?, ?, ?)', message.id, input.sessionId, (last?.position ?? 0) + 1, message.role, message.text, now);
    }
    await db.runAsync("UPDATE practice_sessions SET turns = (SELECT COUNT(*) FROM practice_messages WHERE session_id = ? AND role = 'user'), updated_at = ? WHERE id = ?", input.sessionId, now, input.sessionId);
  });
}

/**
 * Ends the session with the debrief or the review. The score is its overall (none when it was too short to judge). For a message
 * review `finalText` is the learner's own text that was reviewed; the coach's improved version stays only inside the review.
 */
export async function finishSession(db: SQLiteDatabase, input: { id: string; result: PracticeResult; finalText?: string }): Promise<void> {
  const now = nowTimestamp();
  await db.runAsync(
    "UPDATE practice_sessions SET status = 'finished', score = ?, report = ?, final_text = COALESCE(?, final_text), ended_at = COALESCE(ended_at, ?), updated_at = ? WHERE id = ?",
    input.result.overall,
    JSON.stringify(input.result),
    input.finalText ?? null,
    now,
    now,
    input.id,
  );
}

/** The learner left without getting feedback. A session that already finished is left as it is. */
export async function abandonSession(db: SQLiteDatabase, id: string): Promise<void> {
  const now = nowTimestamp();
  await db.runAsync("UPDATE practice_sessions SET status = 'abandoned', ended_at = ?, updated_at = ? WHERE id = ? AND status = 'active'", now, now, id);
}

/** A session and everything that belongs to it: its messages go first, so nothing is left pointing at it. */
export async function deleteSession(db: SQLiteDatabase, id: string): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM practice_messages WHERE session_id = ?', id);
    await db.runAsync('DELETE FROM practice_sessions WHERE id = ?', id);
  });
}

const status = (value: string): PracticeStatus => (STATUSES.includes(value) ? (value as PracticeStatus) : 'active');

const COLUMNS = 'id, item_id, kind, course_id, lesson_id, project_id, attempt, status, turns, score, report, final_text, started_at, ended_at, created_at, updated_at';

function readResult(kind: string, text: string | null): PracticeResult | null {
  if (kind === 'prompt-lab') return readStoredLabReview(text);
  return kind === 'message-review' ? readStoredReview(text) : readStoredReport(text);
}

export async function readSession(db: SQLiteDatabase, id: string): Promise<SessionDetail | null> {
  const row = await db.getFirstAsync<SessionRow>(`SELECT ${COLUMNS} FROM practice_sessions WHERE id = ?`, id);
  if (!row) return null;
  const messages = await db.getAllAsync<PracticeMessageRow>('SELECT id, session_id, position, role, text, created_at FROM practice_messages WHERE session_id = ? ORDER BY position', id);
  return { session: { ...row, status: status(row.status) }, messages, result: readResult(row.kind, row.report) };
}

type SummaryRow = { id: string; kind: PracticeKind; attempt: number; status: string; turns: number; score: number | null; course_id: string | null; lesson_id: string | null; project_id: string | null; started_at: string; ended_at: string | null };

/** Every try at an item, newest first. */
export async function listSessionsForItem(db: SQLiteDatabase, itemId: string): Promise<SessionSummary[]> {
  const rows = await db.getAllAsync<SummaryRow>('SELECT id, kind, attempt, status, turns, score, course_id, lesson_id, project_id, started_at, ended_at FROM practice_sessions WHERE item_id = ? ORDER BY started_at DESC, rowid DESC', itemId);
  return rows.map((row) => ({ id: row.id, kind: row.kind, attempt: row.attempt, status: status(row.status), turns: row.turns, score: row.score, courseId: row.course_id, lessonId: row.lesson_id, projectId: row.project_id, startedAt: row.started_at, endedAt: row.ended_at }));
}

/** The unfinished session of an item (the newest), so the screen can offer to carry on instead of starting another. */
export async function findActiveSession(db: SQLiteDatabase, itemId: string): Promise<SessionSummary | null> {
  const row = await db.getFirstAsync<SummaryRow>("SELECT id, kind, attempt, status, turns, score, course_id, lesson_id, project_id, started_at, ended_at FROM practice_sessions WHERE item_id = ? AND status = 'active' ORDER BY started_at DESC, rowid DESC LIMIT 1", itemId);
  return row ? { id: row.id, kind: row.kind, attempt: row.attempt, status: status(row.status), turns: row.turns, score: row.score, courseId: row.course_id, lessonId: row.lesson_id, projectId: row.project_id, startedAt: row.started_at, endedAt: row.ended_at } : null;
}

export type ItemScores = { attempts: number; best: number | null; latest: number | null };

/** How many tries an item has had, the best score and the latest one; tries with no score (unfinished, or too short to judge) count as tries only. */
export async function bestAndLatest(db: SQLiteDatabase, itemId: string): Promise<ItemScores> {
  const totals = await db.getFirstAsync<{ attempts: number; best: number | null }>('SELECT COUNT(*) AS attempts, MAX(score) AS best FROM practice_sessions WHERE item_id = ?', itemId);
  const latest = await db.getFirstAsync<{ score: number }>('SELECT score FROM practice_sessions WHERE item_id = ? AND score IS NOT NULL ORDER BY started_at DESC, rowid DESC LIMIT 1', itemId);
  return { attempts: totals?.attempts ?? 0, best: totals?.best ?? null, latest: latest?.score ?? null };
}

/** The one thing to say about what to work on next: a debrief's first growth area, or what a review found missing. */
export function growthAreaOf(result: PracticeResult | null): string | null {
  if (!result || result.tooShort) return null;
  if (result.kind === 'roleplay') return (result as PracticeReport).growth[0]?.point ?? (result.nextStep || null);
  if (result.kind === 'prompt-lab') return (result as LabReview).suggestions[0] ?? (result.nextStep || null);
  const review = result as ReviewResult;
  return review.missing[0] ?? (review.nextStep || null);
}

export type ItemSummary = ItemScores & { itemId: string; growth: string | null };

/** For each item (in the order given): tries, best and latest score and one growth area from the latest scored try. */
export async function summaryForItems(db: SQLiteDatabase, itemIds: readonly string[]): Promise<ItemSummary[]> {
  const summaries: ItemSummary[] = [];
  for (const itemId of itemIds) {
    const scores = await bestAndLatest(db, itemId);
    const latest = await db.getFirstAsync<{ kind: string; report: string | null }>('SELECT kind, report FROM practice_sessions WHERE item_id = ? AND score IS NOT NULL ORDER BY started_at DESC, rowid DESC LIMIT 1', itemId);
    summaries.push({ itemId, ...scores, growth: latest ? growthAreaOf(readResult(latest.kind, latest.report)) : null });
  }
  return summaries;
}

/**
 * The practice results the project review reads, as plain text clearly labelled as practice: one line per item the project names. Empty
 * when the project names none. It carries scores and one growth area only, never a transcript or anything private from the catalog.
 */
export function practiceSummaryText(summaries: readonly ItemSummary[], findItem: (id: string) => PracticeItem | undefined = findPracticeItem): string {
  // Prompt labs have their own block (`labResultsText`), so a lab is never listed twice.
  const items = summaries.filter((summary) => findItem(summary.itemId)?.kind !== 'lab');
  if (items.length === 0) return '';
  const lines = items.map((summary) => {
    const title = findItem(summary.itemId)?.title ?? summary.itemId;
    if (summary.attempts === 0) return `- ${title}: not practised yet`;
    const tries = `${summary.attempts} ${summary.attempts === 1 ? 'try' : 'tries'}`;
    if (summary.best === null) return `- ${title}: ${tries}, no scored result yet`;
    const growth = summary.growth ? ` To work on: ${summary.growth}` : '';
    return `- ${title}: ${tries}, best ${summary.best}, latest ${summary.latest}.${growth}`;
  });
  return `Practice results (the learner's own saved role-plays and message reviews; practice scores out of 100, not marks):\n${lines.join('\n')}`;
}

/** Practice results for the practice items a project names, as the text the project review is given. */
export async function practiceSummaryForProject(db: SQLiteDatabase, itemIds: readonly string[], findItem: (id: string) => PracticeItem | undefined = findPracticeItem): Promise<string> {
  return practiceSummaryText(await summaryForItems(db, itemIds), findItem);
}

export type LabSummary = ItemSummary & { /** The learner's own prompt from their latest reviewed try (their work), or null. */ lastPrompt: string | null };

const squashLine = (text: string, max: number): string => {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max).trimEnd()}…` : flat;
};

/** For each prompt lab among `itemIds` (other items are skipped): tries, best and latest score, one thing to work on and the prompt of the latest reviewed try. */
export async function labSummariesForItems(db: SQLiteDatabase, itemIds: readonly string[], findItem: (id: string) => PracticeItem | undefined = findPracticeItem): Promise<LabSummary[]> {
  const summaries: LabSummary[] = [];
  for (const itemId of itemIds) {
    if (findItem(itemId)?.kind !== 'lab') continue;
    const [base] = await summaryForItems(db, [itemId]);
    const latest = await db.getFirstAsync<{ final_text: string | null }>('SELECT final_text FROM practice_sessions WHERE item_id = ? AND score IS NOT NULL ORDER BY started_at DESC, rowid DESC LIMIT 1', itemId);
    summaries.push({ ...base, lastPrompt: latest?.final_text ?? null });
  }
  return summaries;
}

/**
 * The lab results the project review reads, as plain text clearly labelled: one line per prompt lab the project names, with the tries, the best and
 * latest practice score (an AI's assessment of the learner's prompt, not a mark), the learner's latest prompt, shortened, and one thing to work on.
 * Empty when the project names no lab. No transcript, no model output and nothing private from the catalog.
 */
export function labResultsText(summaries: readonly LabSummary[], findItem: (id: string) => PracticeItem | undefined = findPracticeItem): string {
  if (summaries.length === 0) return '';
  const lines = summaries.map((summary) => {
    const item = findItem(summary.itemId);
    const title = item?.title ?? summary.itemId;
    if (summary.attempts === 0) return `- ${title}: not tried yet`;
    const tries = `${summary.attempts} ${summary.attempts === 1 ? 'try' : 'tries'}`;
    if (summary.best === null) return `- ${title}: ${tries}, no review yet`;
    const prompt = summary.lastPrompt ? ` Latest prompt: "${squashLine(summary.lastPrompt, 160)}".` : '';
    const growth = summary.growth ? ` To work on: ${squashLine(summary.growth, 160)}` : '';
    return `- ${title}: ${tries}, best ${summary.best}, latest ${summary.latest}.${prompt}${growth}`;
  });
  return `Lab results (the learner's own saved prompt labs; practice scores out of 100 that an AI gave their prompts, not marks):\n${lines.join('\n')}`;
}

/** Lab results for the prompt labs a project names, as the text the project review is given. */
export async function labResultsForProject(db: SQLiteDatabase, itemIds: readonly string[], findItem: (id: string) => PracticeItem | undefined = findPracticeItem): Promise<string> {
  return labResultsText(await labSummariesForItems(db, itemIds, findItem), findItem);
}
