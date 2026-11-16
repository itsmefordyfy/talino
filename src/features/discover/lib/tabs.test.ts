import { describe, expect, test } from '@jest/globals';

import { COURSES } from '@/features/courses/content';
import { CATEGORIES } from '@/features/courses/content/catalog';
import { CATEGORY_IDS } from '@/features/courses/content/types';
import { catalogFacts } from '@/features/courses/lib/catalog-facts';
import { FACTS } from '@/features/courses/lib/recommendations/recommendations.test-helpers';

import { initialDiscoverState, isBrowsing, resolveTab } from '../discover-slice';
import { buildRows, categoryCourses, CATEGORY_TABS, groupByLevel, scopeFacts, tabCounts } from './tabs';

const CATALOGS: [string, ReturnType<typeof catalogFacts>][] = [
  ['bundled catalog', catalogFacts()],
  ['final catalog (with stubs)', FACTS],
];

describe('the category tabs', () => {
  test('there is one tab per catalog category, in the catalog order', () => {
    expect([...CATEGORY_TABS]).toEqual(CATEGORIES.map((category) => category.id));
    expect([...CATEGORY_TABS]).toEqual([...CATEGORY_IDS]);
  });

  for (const [name, facts] of CATALOGS) {
    describe(name, () => {
      test('every course is in a known category, so it is under exactly one category tab and under All', () => {
        for (const fact of facts) {
          expect(CATEGORY_TABS).toContain(fact.category);
          const tabsHoldingIt = CATEGORY_TABS.filter((category) => categoryCourses(facts, category).some((entry) => entry.id === fact.id));
          expect(tabsHoldingIt).toEqual([fact.category]);
          expect(scopeFacts(facts, 'all', '').some((entry) => entry.id === fact.id)).toBe(true);
        }
      });

      test('no course is missing from its category tab: the tabs together list the whole catalog once', () => {
        const listed = CATEGORY_TABS.flatMap((category) => categoryCourses(facts, category).map((entry) => entry.id));
        expect([...listed].sort()).toEqual(facts.map((entry) => entry.id).sort());
        expect(new Set(listed).size).toBe(facts.length);
      });

      test('each tab count equals the number of courses its tab lists, and the counts add up to All', () => {
        const counts = tabCounts(facts);
        expect(counts.all).toBe(facts.length);
        for (const category of CATEGORY_TABS) expect(counts.byCategory[category]).toBe(categoryCourses(facts, category).length);
        expect(Object.values(counts.byCategory).reduce((sum, n) => sum + n, 0)).toBe(counts.all);
      });
    });
  }

  test('the bundled catalog count is the number of courses in COURSES', () => {
    expect(tabCounts(catalogFacts()).all).toBe(COURSES.length);
  });

  test('a category with no course has a zero count (and so an empty state), never a missing tab', () => {
    const counts = tabCounts([]);
    expect(CATEGORY_TABS.every((category) => counts.byCategory[category] === 0)).toBe(true);
  });
});

describe('scopeFacts', () => {
  const facts = FACTS;
  const category = CATEGORY_TABS.find((id) => categoryCourses(facts, id).length > 0 && categoryCourses(facts, id).length < facts.length) ?? CATEGORY_TABS[0];
  test('a category tab narrows to its category; For you and All keep the whole catalog', () => {
    expect(scopeFacts(facts, category, '').every((entry) => entry.category === category)).toBe(true);
    expect(scopeFacts(facts, 'all', '')).toBe(facts);
    expect(scopeFacts(facts, 'for-you', '')).toBe(facts);
    expect(scopeFacts(facts, null, '')).toBe(facts);
  });
  test('typing a search covers the whole catalog whatever the tab, and clearing it returns to the tab', () => {
    expect(scopeFacts(facts, category, 'react')).toBe(facts);
    expect(scopeFacts(facts, category, '   ').length).toBe(categoryCourses(facts, category).length);
  });
});

describe('groupByLevel and buildRows', () => {
  const facts = FACTS;
  test('groups run beginner, intermediate, advanced, expert, skip empty levels and keep every course once', () => {
    const groups = groupByLevel(facts);
    const order = groups.map((group) => group.level);
    expect(order).toEqual(['beginner', 'intermediate', 'advanced', 'expert'].filter((level) => order.includes(level as never)));
    expect(groups.flatMap((group) => group.courses).length).toBe(facts.length);
    for (const group of groups) expect(group.courses.every((course) => course.learningLevel === group.level)).toBe(true);
  });
  test('the learner\'s sort is kept inside a level', () => {
    const reversed = [...facts].reverse();
    for (const group of groupByLevel(reversed)) expect(group.courses.map((c) => c.id)).toEqual(reversed.filter((c) => c.learningLevel === group.level).map((c) => c.id));
  });
  test('rows hold `columns` cells, the last row padded with empty cells, and headers precede their level', () => {
    for (const columns of [1, 2, 3]) {
      const items = buildRows(facts, columns, true);
      const rows = items.filter((item) => item.type === 'row');
      expect(rows.every((row) => row.type === 'row' && row.cells.length === columns)).toBe(true);
      const shown = rows.flatMap((row) => (row.type === 'row' ? row.cells : [])).filter((cell) => cell !== null);
      expect(shown.length).toBe(facts.length);
      expect(items.filter((item) => item.type === 'header').length).toBe(groupByLevel(facts).length);
      expect(items[0].type).toBe('header');
      expect(new Set(items.map((item) => item.key)).size).toBe(items.length);
    }
  });
  test('ungrouped rows have no headers', () => {
    expect(buildRows(facts, 2, false).every((item) => item.type === 'row')).toBe(true);
    expect(buildRows([], 2, true)).toEqual([]);
  });
});

describe('the default tab', () => {
  test('a learner who has not chosen gets For you with a profile and All without', () => {
    expect(resolveTab(null, true)).toBe('for-you');
    expect(resolveTab(null, false)).toBe('all');
    expect(resolveTab('vibe-coding', false)).toBe('vibe-coding');
  });
  test('the personalised home shows only on For you with no search and no filter', () => {
    expect(isBrowsing(initialDiscoverState, true)).toBe(false);
    expect(isBrowsing(initialDiscoverState, false)).toBe(true);
    expect(isBrowsing({ ...initialDiscoverState, tab: 'for-you' }, false)).toBe(false);
    expect(isBrowsing({ ...initialDiscoverState, tab: 'careers' }, true)).toBe(true);
    expect(isBrowsing({ ...initialDiscoverState, query: 'git' }, true)).toBe(true);
  });
});
