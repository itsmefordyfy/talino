import type { SQLiteDatabase } from 'expo-sqlite';

import type { CandidateProject } from '../lib/candidate';

/**
 * The learner's own portfolio projects, read only to tell the interviewer what they have built (title, role, tools and a
 * summary). A read, never a write: the portfolio feature owns the table, and nothing here changes it.
 */
export async function readCandidatePortfolio(db: SQLiteDatabase): Promise<CandidateProject[]> {
  const rows = await db.getAllAsync<{ title: string; summary: string | null; role: string | null; tech: string | null }>('SELECT title, summary, role, tech FROM portfolio_projects ORDER BY sort ASC, created_at ASC LIMIT 5');
  return rows.map((row) => ({ title: row.title, summary: row.summary ?? '', role: row.role ?? '', tech: parseTags(row.tech) }));
}

function parseTags(text: string | null): string[] {
  if (!text) return [];
  try {
    const value: unknown = JSON.parse(text);
    return Array.isArray(value) ? value.filter((tag): tag is string => typeof tag === 'string').slice(0, 8) : [];
  } catch {
    return [];
  }
}
