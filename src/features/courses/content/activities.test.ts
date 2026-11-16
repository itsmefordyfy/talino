import { describe, expect, test } from '@jest/globals';

import { validateActivity, validateActivitySet, type Activity } from '../../activities';
import { findVisual } from '../../visuals';
import { COURSES } from './index';
import type { LessonBlock } from './types';

const blocksOf = (type: LessonBlock['type']) => COURSES.flatMap((course) => course.lessons.flatMap((lesson) => lesson.body.filter((block) => block.type === type).map((block) => ({ course, lesson, block }))));

describe('interactive lesson content', () => {
  const activities = blocksOf('activity').map(({ lesson, block }) => ({ lessonId: lesson.id, activity: (block as Extract<LessonBlock, { type: 'activity' }>).activity as Activity }));

  test('every activity passes the activity validator (structure, and its own code run against its own tests)', () => {
    const problems = activities.flatMap(({ lessonId, activity }) => validateActivity(activity).map((problem) => `${lessonId} / ${activity.id}: ${problem}`));
    expect(problems).toEqual([]);
  });

  test('activity ids are unique across the whole app and start with their lesson id', () => {
    expect(validateActivitySet(activities.map((entry) => entry.activity))).toEqual([]);
    for (const { lessonId, activity } of activities) expect(activity.id.startsWith(`${lessonId}-`)).toBe(true);
  });

  test('every visual a lesson embeds exists', () => {
    const missing = blocksOf('visual').filter(({ block }) => !findVisual((block as Extract<LessonBlock, { type: 'visual' }>).id)).map(({ lesson, block }) => `${lesson.id}: ${(block as Extract<LessonBlock, { type: 'visual' }>).id}`);
    expect(missing).toEqual([]);
  });

  test('no match activity just copies the lesson text', () => {
    const normalise = (text: string) => text.toLowerCase().replace(/\*\*/g, '').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
    const copied: string[] = [];
    for (const course of COURSES) {
      for (const lesson of course.lessons) {
        const lessonText = normalise(JSON.stringify(lesson.body.filter((block) => block.type !== 'activity')));
        for (const block of lesson.body) {
          if (block.type !== 'activity' || block.activity.kind !== 'match') continue;
          const { pairs } = block.activity;
          const copiedPairs = pairs.filter((pair) => lessonText.includes(normalise(pair.term)) && lessonText.includes(normalise(pair.definition).slice(0, 40)));
          if (copiedPairs.length * 2 >= pairs.length) copied.push(block.activity.id);
        }
      }
    }
    expect(copied).toEqual([]);
  });

  test('tables are rectangular and takeaways are short lists', () => {
    for (const { lesson, block } of blocksOf('table')) {
      const table = block as Extract<LessonBlock, { type: 'table' }>;
      expect(table.rows.every((row) => row.length === table.headers.length)).toBe(true);
      expect(table.headers.length).toBeGreaterThanOrEqual(2);
      expect(lesson.id).toBeTruthy();
    }
    for (const { block } of blocksOf('takeaways')) {
      const takeaways = block as Extract<LessonBlock, { type: 'takeaways' }>;
      expect(takeaways.items.length).toBeGreaterThanOrEqual(2);
      expect(takeaways.items.length).toBeLessThanOrEqual(6);
    }
  });
});
