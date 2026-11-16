import type { SQLiteDatabase } from 'expo-sqlite';

import { nowTimestamp } from '@/lib/id';

/**
 * The published page as this phone knows it. The edit token is the only key to update or remove the
 * page (there is no account), so it lives here and nowhere else.
 */
export type PortfolioState = {
  slug: string;
  editToken: string;
  talent: boolean;
  contactEmail: string;
  publishedAt: string;
};

export const PORTFOLIO_STATE_KEY = 'portfolio';

export function parsePortfolioState(value: string | null | undefined): PortfolioState | null {
  try {
    const raw: unknown = JSON.parse(value ?? 'null');
    if (typeof raw !== 'object' || raw === null) return null;
    const record = raw as Record<string, unknown>;
    if (typeof record.slug !== 'string' || record.slug === '' || typeof record.editToken !== 'string' || record.editToken === '') return null;
    return {
      slug: record.slug,
      editToken: record.editToken,
      talent: record.talent === true,
      contactEmail: typeof record.contactEmail === 'string' ? record.contactEmail : '',
      publishedAt: typeof record.publishedAt === 'string' ? record.publishedAt : '',
    };
  } catch {
    return null;
  }
}

export async function readPortfolioState(db: SQLiteDatabase): Promise<PortfolioState | null> {
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_state WHERE key = ?', PORTFOLIO_STATE_KEY);
  return row ? parsePortfolioState(row.value) : null;
}

export async function savePortfolioState(db: SQLiteDatabase, state: PortfolioState): Promise<void> {
  await db.runAsync(
    'INSERT INTO app_state (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at',
    PORTFOLIO_STATE_KEY,
    JSON.stringify(state),
    nowTimestamp(),
  );
}

/** What the learner chose for how the page looks. The picture is off until they turn it on: a public page shows their face only by choice. */
export type PortfolioOptions = { showPhoto: boolean };

export const PORTFOLIO_OPTIONS_KEY = 'portfolio-options';

export function parsePortfolioOptions(value: string | null | undefined): PortfolioOptions {
  try {
    const raw: unknown = JSON.parse(value ?? 'null');
    return { showPhoto: typeof raw === 'object' && raw !== null && (raw as Record<string, unknown>).showPhoto === true };
  } catch {
    return { showPhoto: false };
  }
}

export async function readPortfolioOptions(db: SQLiteDatabase): Promise<PortfolioOptions> {
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_state WHERE key = ?', PORTFOLIO_OPTIONS_KEY);
  return parsePortfolioOptions(row?.value);
}

export async function savePortfolioOptions(db: SQLiteDatabase, options: PortfolioOptions): Promise<void> {
  await db.runAsync(
    'INSERT INTO app_state (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at',
    PORTFOLIO_OPTIONS_KEY,
    JSON.stringify(options),
    nowTimestamp(),
  );
}

export async function clearPortfolioState(db: SQLiteDatabase): Promise<void> {
  await db.runAsync('DELETE FROM app_state WHERE key = ?', PORTFOLIO_STATE_KEY);
}
