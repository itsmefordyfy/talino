import { describe, expect, test } from '@jest/globals';

import { fullCatalogFacts } from './discovery.test-helpers';
import { SORT_OPTIONS, sortCourses, type SortKey } from './sort';

const facts = fullCatalogFacts();
const order = (items: readonly { id: string }[]) => items.map((item) => item.id);
const position = new Map(facts.map((fact, index) => [fact.id, index]));

describe('sortCourses', () => {
  test('every sort key has a label and an honest one-line description', () => {
    // No "popular": Talino has no usage data to rank by, so it is not offered at all.
    expect(SORT_OPTIONS.map((option) => option.key)).toEqual(['recommended', 'newest', 'shortest', 'longest', 'beginner-friendly']);
    for (const option of SORT_OPTIONS) {
      expect(option.label.length).toBeGreaterThan(2);
      expect(option.description.length).toBeGreaterThan(10);
      expect(option.description).not.toContain('\n');
    }
  });

  test('never mutates its input', () => {
    const copy = [...facts];
    sortCourses(facts, 'longest');
    expect(facts).toEqual(copy);
  });

  test('recommended follows the rank, unranked courses last in catalog order; with no ranks nothing moves', () => {
    expect(order(sortCourses(facts, 'recommended'))).toEqual(order(facts));
    const rank = new Map([
      ['ai-dev-claude-code', 0],
      ['build-website-ai', 1],
    ]);
    const sorted = sortCourses(facts, 'recommended', { recommendedRank: rank });
    expect(order(sorted).slice(0, 2)).toEqual(['ai-dev-claude-code', 'build-website-ai']);
    const rest = order(sorted).slice(2);
    expect(rest).toEqual(order(facts).filter((id) => id !== 'ai-dev-claude-code' && id !== 'build-website-ai'));
  });

  test('newest: published descending, ties in catalog order', () => {
    const sorted = sortCourses(facts, 'newest');
    for (let i = 1; i < sorted.length; i += 1) {
      expect(sorted[i - 1].published >= sorted[i].published).toBe(true);
      if (sorted[i - 1].published === sorted[i].published) expect(position.get(sorted[i - 1].id) ?? 0).toBeLessThan(position.get(sorted[i].id) ?? 0);
    }
  });

  test('shortest and longest by minutes, ties in catalog order', () => {
    const shortest = sortCourses(facts, 'shortest');
    const longest = sortCourses(facts, 'longest');
    for (let i = 1; i < facts.length; i += 1) {
      expect(shortest[i - 1].minutes).toBeLessThanOrEqual(shortest[i].minutes);
      expect(longest[i - 1].minutes).toBeGreaterThanOrEqual(longest[i].minutes);
      if (longest[i - 1].minutes === longest[i].minutes) expect(position.get(longest[i - 1].id) ?? 0).toBeLessThan(position.get(longest[i].id) ?? 0);
    }
  });

  test('beginner-friendly: learning level (Beginner to Expert), then fewer prerequisites, then shorter', () => {
    const sorted = sortCourses(facts, 'beginner-friendly');
    const levelOrder = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 } as const;
    expect(sorted[0].learningLevel).toBe('beginner');
    expect(sorted[sorted.length - 1].learningLevel).toBe('expert');
    for (let i = 1; i < sorted.length; i += 1) {
      const a = sorted[i - 1];
      const b = sorted[i];
      expect(levelOrder[a.learningLevel]).toBeLessThanOrEqual(levelOrder[b.learningLevel]);
      if (a.learningLevel === b.learningLevel) {
        expect(a.prerequisites.length).toBeLessThanOrEqual(b.prerequisites.length);
        if (a.prerequisites.length === b.prerequisites.length) expect(a.minutes).toBeLessThanOrEqual(b.minutes);
      }
    }
  });

  test('every key sorts a filtered subset without losing or repeating a course', () => {
    const subset = facts.filter((fact) => fact.level !== 'advanced');
    for (const option of SORT_OPTIONS) {
      const sorted = sortCourses(subset, option.key as SortKey, { recommendedRank: new Map([['build-website-ai', 0]]) });
      expect(order(sorted).sort()).toEqual(order(subset).sort());
    }
  });
});
