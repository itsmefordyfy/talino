import type { SQLiteDatabase } from 'expo-sqlite';

import { textOrNull } from '@/db/helpers';
import { nowTimestamp } from '@/lib/id';

import { isResumeGoal, isResumeItemKind, type ItemInput, type ResumeGoal, type ResumeItem, type ResumeProfile, type ResumeVersion } from '../types';

/** The résumé has one profile row; its id is fixed so saving is an upsert. */
export const PROFILE_ID = 'me';

const PROFILE_COLUMNS = ['headline', 'email', 'phone', 'location', 'website', 'linkedin', 'github', 'summary', 'career_goal', 'level'] as const;

export async function readProfile(db: SQLiteDatabase): Promise<ResumeProfile | null> {
  return db.getFirstAsync<ResumeProfile>(`SELECT ${PROFILE_COLUMNS.join(', ')} FROM resume_profile WHERE id = ?`, PROFILE_ID);
}

export type ProfileInput = { [K in keyof ResumeProfile]: string };

export async function saveProfile(db: SQLiteDatabase, input: ProfileInput): Promise<void> {
  const now = nowTimestamp();
  const values = PROFILE_COLUMNS.map((column) => textOrNull(input[column]));
  await db.runAsync(
    `INSERT INTO resume_profile (id, ${PROFILE_COLUMNS.join(', ')}, created_at, updated_at) VALUES (?, ${PROFILE_COLUMNS.map(() => '?').join(', ')}, ?, ?)
     ON CONFLICT(id) DO UPDATE SET ${PROFILE_COLUMNS.map((column) => `${column} = excluded.${column}`).join(', ')}, updated_at = excluded.updated_at`,
    PROFILE_ID,
    ...values,
    now,
    now,
  );
}

/**
 * The profile picture (base64 JPEG) is kept apart from the form's columns: saving the profile form never touches it, and changing
 * the picture never touches the form. Setting it creates the profile row when there is none yet.
 */
export async function readProfilePhoto(db: SQLiteDatabase): Promise<string | null> {
  const row = await db.getFirstAsync<{ photo: string | null }>('SELECT photo FROM resume_profile WHERE id = ?', PROFILE_ID);
  return row?.photo ?? null;
}

export async function saveProfilePhoto(db: SQLiteDatabase, photo: string | null): Promise<void> {
  const now = nowTimestamp();
  await db.runAsync(
    `INSERT INTO resume_profile (id, photo, created_at, updated_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET photo = excluded.photo, updated_at = excluded.updated_at`,
    PROFILE_ID,
    photo,
    now,
    now,
  );
}

type ItemRow = Omit<ResumeItem, 'kind'> & { kind: string };

const ITEM_SELECT = 'SELECT id, kind, title, organization, start_on, end_on, description, sort, location, link, dates_text FROM resume_items';

const asItem = (row: ItemRow): ResumeItem | null => (isResumeItemKind(row.kind) ? { ...row, kind: row.kind } : null);

export async function readItems(db: SQLiteDatabase): Promise<ResumeItem[]> {
  const rows = await db.getAllAsync<ItemRow>(`${ITEM_SELECT} ORDER BY kind, sort, start_on DESC, created_at`);
  return rows.map(asItem).filter((item): item is ResumeItem => item !== null);
}

export async function readItem(db: SQLiteDatabase, id: string): Promise<ResumeItem | null> {
  const row = await db.getFirstAsync<ItemRow>(`${ITEM_SELECT} WHERE id = ?`, id);
  return row ? asItem(row) : null;
}

export type { ItemInput };

export async function saveItem(db: SQLiteDatabase, input: ItemInput): Promise<void> {
  const now = nowTimestamp();
  await db.runAsync(
    `INSERT INTO resume_items (id, kind, title, organization, start_on, end_on, description, sort, location, link, dates_text, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET title = excluded.title, organization = excluded.organization, start_on = excluded.start_on, end_on = excluded.end_on, description = excluded.description,
       location = excluded.location, link = excluded.link, dates_text = excluded.dates_text, updated_at = excluded.updated_at`,
    input.id,
    input.kind,
    input.title.trim(),
    textOrNull(input.organization),
    input.startOn,
    input.endOn,
    textOrNull(input.description),
    textOrNull(input.location),
    textOrNull(input.link),
    // Precise dates replace dates as written: the two are never both in use.
    input.startOn || input.endOn ? null : textOrNull(input.datesText ?? ''),
    now,
    now,
  );
}

/** Résumé items have no dependents, so a plain delete is complete. */
export async function deleteItem(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM resume_items WHERE id = ?', id);
}

function stringList(value: string | null): string[] {
  try {
    const parsed: unknown = JSON.parse(value ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export async function readVersions(db: SQLiteDatabase): Promise<ResumeVersion[]> {
  const rows = await db.getAllAsync<{ goal: string; job_title: string | null; summary: string | null; highlights: string | null; keywords: string | null }>(
    'SELECT goal, job_title, summary, highlights, keywords FROM resume_versions',
  );
  return rows.flatMap((row) => (isResumeGoal(row.goal) ? [{ goal: row.goal, jobTitle: row.job_title, summary: row.summary, highlights: stringList(row.highlights), keywords: stringList(row.keywords) }] : []));
}

export async function saveVersion(db: SQLiteDatabase, goal: ResumeGoal, version: Omit<ResumeVersion, 'goal'>): Promise<void> {
  await db.runAsync(
    `INSERT INTO resume_versions (goal, job_title, summary, highlights, keywords, updated_at) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(goal) DO UPDATE SET job_title = excluded.job_title, summary = excluded.summary, highlights = excluded.highlights, keywords = excluded.keywords, updated_at = excluded.updated_at`,
    goal,
    textOrNull(version.jobTitle),
    textOrNull(version.summary),
    JSON.stringify(version.highlights),
    JSON.stringify(version.keywords),
    nowTimestamp(),
  );
}

/** Back to the goal's defaults (the tailored version is forgotten). */
export async function clearVersion(db: SQLiteDatabase, goal: ResumeGoal): Promise<void> {
  await db.runAsync('DELETE FROM resume_versions WHERE goal = ?', goal);
}

/**
 * What an imported résumé adds, in one transaction: blank profile fields filled (a filled one is never replaced) and the new
 * entries. Safe to repeat: entries have their own ids, and a second run finds nothing blank and the same ids.
 */
export async function applyImport(db: SQLiteDatabase, merge: { profile: Partial<Record<(typeof PROFILE_COLUMNS)[number], string>>; items: readonly ItemInput[] }): Promise<void> {
  await db.withTransactionAsync(async () => {
    const current = await readProfile(db);
    const next = {} as ProfileInput;
    for (const column of PROFILE_COLUMNS) next[column] = current?.[column]?.trim() ? current[column] ?? '' : (merge.profile[column] ?? '');
    await saveProfile(db, next);
    for (const item of merge.items) await saveItem(db, item);
  });
}
