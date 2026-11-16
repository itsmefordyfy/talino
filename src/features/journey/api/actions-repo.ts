import type { SQLiteDatabase } from 'expo-sqlite';

import type { JourneyAction } from '../lib/types';

/**
 * What the learner has done in the app itself, outside any course, that a journey step can ask for. Read-only and counted straight from
 * the learner's own tables, so there is nothing to keep in step: a project on the portfolio, a résumé made.
 */
export async function readJourneyActions(db: SQLiteDatabase): Promise<Record<JourneyAction, boolean>> {
  const [portfolio, resume] = await Promise.all([
    db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM portfolio_projects'),
    db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM resume_documents'),
  ]);
  return { portfolio: (portfolio?.n ?? 0) > 0, resume: (resume?.n ?? 0) > 0 };
}
