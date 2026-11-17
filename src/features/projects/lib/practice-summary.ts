import { findPracticeItem } from '@/features/practice/catalog';
import type { ItemSummary } from '@/features/practice/api/practice-repo';

/** One line of the project screen's practice list. */
export type PracticeRow = {
  id: string;
  title: string;
  attempts: number;
  best: number | null;
  /** At least one try came back with a score. */
  practised: boolean;
};

/**
 * What the project screen shows about the practice items a project names, from the saved summaries (in the order the project names them).
 * "Practised" means a try came back with a score: an item with only unfinished tries, or one the coach found too thin to judge, still
 * counts as not practised, because the review would have nothing real to read for it.
 */
export function practiceRows(itemIds: readonly string[], summaries: readonly ItemSummary[], findTitle: (id: string) => string | undefined = (id) => findPracticeItem(id)?.title): PracticeRow[] {
  const byId = new Map(summaries.map((summary) => [summary.itemId, summary]));
  return itemIds.map((id) => {
    const summary = byId.get(id);
    return { id, title: findTitle(id) ?? id, attempts: summary?.attempts ?? 0, best: summary?.best ?? null, practised: summary?.best != null };
  });
}

export type PracticeProgress = { done: number; total: number; missing: number; fraction: number; best: number | null };

export function practiceProgress(rows: readonly PracticeRow[]): PracticeProgress {
  const done = rows.filter((row) => row.practised).length;
  const scores = rows.map((row) => row.best).filter((best): best is number => best !== null);
  return { done, total: rows.length, missing: rows.length - done, fraction: rows.length === 0 ? 0 : done / rows.length, best: scores.length === 0 ? null : Math.max(...scores) };
}
