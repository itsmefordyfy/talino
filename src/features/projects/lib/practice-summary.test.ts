import { describe, expect, test } from '@jest/globals';

import type { ItemSummary } from '@/features/practice/api/practice-repo';
import { COURSES } from '@/features/courses/content';

import { practiceProgress, practiceRows } from './practice-summary';

const summary = (itemId: string, attempts: number, best: number | null): ItemSummary => ({ itemId, attempts, best, latest: best, growth: null });
const titles: Record<string, string> = { a: 'Alpha', b: 'Beta', c: 'Gamma' };
const find = (id: string) => titles[id];

describe('practiceRows', () => {
  test('one row per named item, in the project’s order, whether or not it was ever practised', () => {
    const rows = practiceRows(['b', 'a', 'c'], [summary('a', 2, 80)], find);
    expect(rows.map((row) => row.title)).toEqual(['Beta', 'Alpha', 'Gamma']);
    expect(rows.map((row) => row.practised)).toEqual([false, true, false]);
    expect(rows[1]).toMatchObject({ attempts: 2, best: 80 });
  });

  test('tries without a score (unfinished, or too thin to judge) are not practice yet', () => {
    const [row] = practiceRows(['a'], [summary('a', 3, null)], find);
    expect(row).toMatchObject({ attempts: 3, best: null, practised: false });
  });

  test('a zero score still counts: it was judged', () => {
    expect(practiceRows(['a'], [summary('a', 1, 0)], find)[0].practised).toBe(true);
  });

  test('an id the catalog does not know still shows, by its id, instead of crashing', () => {
    expect(practiceRows(['zzz'], [], find)[0].title).toBe('zzz');
  });
});

describe('practiceProgress', () => {
  test('counts what is done, what is missing and the best score', () => {
    const progress = practiceProgress(practiceRows(['a', 'b', 'c'], [summary('a', 1, 64), summary('c', 2, 91)], find));
    expect(progress).toMatchObject({ done: 2, total: 3, missing: 1, best: 91 });
    expect(progress.fraction).toBeCloseTo(2 / 3);
  });
  test('nothing named, nothing to show', () => {
    expect(practiceProgress([])).toEqual({ done: 0, total: 0, missing: 0, fraction: 0, best: null });
  });
});

describe('with the real Soft Skills projects', () => {
  test('every project gets a title for every item', () => {
    const soft = COURSES.find((course) => course.id === 'soft-skills-workplace')!;
    for (const project of soft.projects) {
      const rows = practiceRows(project.practiceItemIds ?? [], []);
      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) expect(row.title).not.toBe(row.id);
    }
  });
});
