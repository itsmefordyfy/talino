import type { SQLiteDatabase } from 'expo-sqlite';

/** What the career badges count, read straight from the tracker's tables. */
export async function readTrackerCounts(db: SQLiteDatabase): Promise<{ applications: number; interviews: number; wins: number; incomeEntries: number }> {
  const row = await db.getFirstAsync<{ applications: number; interviews: number; wins: number; income: number }>(
    `SELECT
       (SELECT COUNT(*) FROM applications WHERE stage != 'saved') AS applications,
       (SELECT COUNT(*) FROM applications WHERE stage IN ('interview', 'offer', 'won') OR interview_at IS NOT NULL) AS interviews,
       (SELECT COUNT(*) FROM applications WHERE stage IN ('offer', 'won')) AS wins,
       (SELECT COUNT(*) FROM income) AS income`,
  );
  return { applications: row?.applications ?? 0, interviews: row?.interviews ?? 0, wins: row?.wins ?? 0, incomeEntries: row?.income ?? 0 };
}
