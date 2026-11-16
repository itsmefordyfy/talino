import type { SQLiteDatabase } from 'expo-sqlite';

import { textOrNull, type Bindable } from '@/db/helpers';
import { runInTransaction } from '@/db/transaction';
import { nowTimestamp } from '@/lib/id';

import type { ApplicationKind, ApplicationRow, GoalMetric, GoalRow, IncomeRow, Source, Stage } from '../types';

export async function readApplications(db: SQLiteDatabase): Promise<ApplicationRow[]> {
  return db.getAllAsync<ApplicationRow>('SELECT * FROM applications ORDER BY updated_at DESC');
}

export async function readIncome(db: SQLiteDatabase): Promise<IncomeRow[]> {
  return db.getAllAsync<IncomeRow>('SELECT * FROM income ORDER BY received_on DESC, created_at DESC');
}

export async function readGoals(db: SQLiteDatabase): Promise<GoalRow[]> {
  return db.getAllAsync<GoalRow>('SELECT * FROM career_goals ORDER BY created_at');
}

/**
 * Inserts the row or, when its id is already there, updates it in place. Forms make their id when
 * they open, so a double tap on Save (or a retry) changes one row instead of adding a second.
 * `created_at` is only ever set by the first insert.
 */
async function upsert(db: SQLiteDatabase, table: string, id: string, values: Record<string, Bindable>): Promise<void> {
  const now = nowTimestamp();
  const columns = Object.keys(values);
  const all = ['id', ...columns, 'created_at', 'updated_at'];
  const updates = [...columns, 'updated_at'].map((column) => `${column} = excluded.${column}`).join(', ');
  await db.runAsync(`INSERT INTO ${table} (${all.join(', ')}) VALUES (${all.map(() => '?').join(', ')}) ON CONFLICT(id) DO UPDATE SET ${updates}`, id, ...Object.values(values), now, now);
}

export type ApplicationInput = {
  id: string;
  kind: ApplicationKind;
  title: string;
  company: string;
  link: string | null;
  source: Source | null;
  stage: Stage;
  appliedOn: string | null;
  followUpOn: string | null;
  interviewAt: string | null;
  pay: string | null;
  notes: string | null;
};

export async function saveApplication(db: SQLiteDatabase, input: ApplicationInput): Promise<void> {
  await upsert(db, 'applications', input.id, {
    kind: input.kind,
    title: input.title.trim(),
    company: input.company.trim(),
    link: textOrNull(input.link),
    source: input.source,
    stage: input.stage,
    applied_on: input.appliedOn,
    follow_up_on: input.followUpOn,
    interview_at: input.interviewAt,
    pay: textOrNull(input.pay),
    notes: textOrNull(input.notes),
  });
}

/** Removes an application; income it brought in stays, no longer linked to it. */
export async function deleteApplication(db: SQLiteDatabase, id: string): Promise<void> {
  await runInTransaction(db, async () => {
    await db.runAsync('UPDATE income SET application_id = NULL, updated_at = ? WHERE application_id = ?', nowTimestamp(), id);
    await db.runAsync('DELETE FROM applications WHERE id = ?', id);
  });
}

export type IncomeInput = { id: string; client: string; amountMinor: number; currency: string; receivedOn: string; applicationId: string | null; note: string | null };

export async function saveIncome(db: SQLiteDatabase, input: IncomeInput): Promise<void> {
  await upsert(db, 'income', input.id, {
    client: input.client.trim(),
    application_id: input.applicationId,
    amount_minor: input.amountMinor,
    currency: input.currency,
    received_on: input.receivedOn,
    note: textOrNull(input.note),
  });
}

export async function deleteIncome(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM income WHERE id = ?', id);
}

export type GoalInput = { id: string; title: string; metric: GoalMetric; target: number; currency: string | null; dueOn: string | null };

export async function saveGoal(db: SQLiteDatabase, input: GoalInput): Promise<void> {
  await upsert(db, 'career_goals', input.id, { title: input.title.trim(), metric: input.metric, target: input.target, currency: input.currency, due_on: input.dueOn });
}

export async function deleteGoal(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM career_goals WHERE id = ?', id);
}

export type CareerCounts = { applications: number; interviews: number; wins: number; incomeEntries: number };

/** Totals across every row, for badges: interviews are rows that reached the interview stage or later, or have an interview date. */
export async function readCareerCounts(db: SQLiteDatabase): Promise<CareerCounts> {
  const row = await db.getFirstAsync<CareerCounts>(
    `SELECT
       (SELECT COUNT(*) FROM applications) AS applications,
       (SELECT COUNT(*) FROM applications WHERE stage IN ('interview', 'offer', 'won') OR interview_at IS NOT NULL) AS interviews,
       (SELECT COUNT(*) FROM applications WHERE stage = 'won') AS wins,
       (SELECT COUNT(*) FROM income) AS incomeEntries`,
  );
  return { applications: row?.applications ?? 0, interviews: row?.interviews ?? 0, wins: row?.wins ?? 0, incomeEntries: row?.incomeEntries ?? 0 };
}
