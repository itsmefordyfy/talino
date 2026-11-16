import type { SQLiteDatabase } from 'expo-sqlite';

import { nowTimestamp } from '@/lib/id';

import { cleanProfile, EMPTY_PROFILE, parseJson, type LearnerProfile, type ProfileStatus, type StoredProfile } from '../lib/profile';

/** The learner profile is one row; this is its id, so a second row can never exist. */
const PROFILE_ID = 'me';

type Row = {
  experience: string | null;
  goals: string;
  interests: string;
  styles: string;
  daily_minutes: number | null;
  days: string;
  time_of_day: string | null;
  weekly_goal: number | null;
  assessment: string | null;
  plan: string | null;
  step: number;
  status: string;
  started_at: string;
  completed_at: string | null;
  updated_at: string;
};

export async function readProfile(db: SQLiteDatabase): Promise<StoredProfile | null> {
  const row = await db.getFirstAsync<Row>('SELECT * FROM learner_profile WHERE id = ?', PROFILE_ID);
  if (!row) return null;
  const profile = cleanProfile({
    experience: row.experience,
    goals: parseJson(row.goals, []),
    interests: parseJson(row.interests, []),
    styles: parseJson(row.styles, []),
    dailyMinutes: row.daily_minutes,
    days: parseJson(row.days, []),
    timeOfDay: row.time_of_day,
    weeklyGoal: row.weekly_goal,
    assessment: parseJson(row.assessment, null),
    plan: parseJson(row.plan, null),
  });
  return {
    ...profile,
    step: Number.isInteger(row.step) && row.step >= 0 ? row.step : 0,
    status: row.status === 'completed' ? 'completed' : 'in_progress',
    startedAt: row.started_at,
    completedAt: row.completed_at,
    updatedAt: row.updated_at,
  };
}

/** What changes in one save: some answers, and where onboarding was left. Anything not named stays as it was. */
export type ProfilePatch = Partial<LearnerProfile> & { step?: number; status?: ProfileStatus };

/**
 * Saves answers into the single profile row, creating it the first time. Safe to call again and again
 * (each step saves, so a closed app resumes where it stopped); a patch only changes what it names.
 * Answers are cleaned on the way in, so the row never holds a value the app doesn't know.
 */
export async function saveProfile(db: SQLiteDatabase, patch: ProfilePatch): Promise<StoredProfile> {
  const now = nowTimestamp();
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT OR IGNORE INTO learner_profile (id, started_at, created_at, updated_at) VALUES (?, ?, ?, ?)`,
      PROFILE_ID,
      now,
      now,
      now,
    );
    const current = (await readProfile(db)) ?? { ...EMPTY_PROFILE, step: 0, status: 'in_progress' as const, startedAt: now, completedAt: null, updatedAt: now };
    const merged = cleanProfile({ ...current, ...patch });
    const status = patch.status ?? current.status;
    await db.runAsync(
      `UPDATE learner_profile SET experience = ?, goals = ?, interests = ?, styles = ?, daily_minutes = ?, days = ?, time_of_day = ?, weekly_goal = ?, assessment = ?, plan = ?,
         step = ?, status = ?, completed_at = ?, updated_at = ? WHERE id = ?`,
      merged.experience,
      JSON.stringify(merged.goals),
      JSON.stringify(merged.interests),
      JSON.stringify(merged.styles),
      merged.dailyMinutes,
      JSON.stringify(merged.days),
      merged.timeOfDay,
      merged.weeklyGoal,
      merged.assessment ? JSON.stringify(merged.assessment) : null,
      merged.plan ? JSON.stringify(merged.plan) : null,
      Math.max(0, Math.floor(patch.step ?? current.step)),
      status,
      status === 'completed' ? (current.completedAt ?? now) : null,
      now,
      PROFILE_ID,
    );
  });
  return (await readProfile(db)) as StoredProfile;
}
