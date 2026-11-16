import { describe, expect, test } from '@jest/globals';

import { COURSES } from '@/features/courses/content';
import { computeCourseProgress } from '@/features/courses/lib/progress';
import { computeStreak } from '@/features/courses/lib/streak';

import { adaptiveSummary } from './adaptive';
import { buildWorld } from './world';
import { activityXp, computeXp, levelFor } from './xp';

/** The owner's healthy-gamification rules, stated as tests. */
describe('healthy game rules', () => {
  const rows = [{ lesson_id: 'a-01', completed_at: '2026-11-01', quiz_correct: 4, quiz_total: 4, task_done: 1 }];

  test('a missed day never lowers XP or level: XP reads only what was done, the streak only affects the streak', () => {
    const before = computeXp({ lessonRows: rows, projectRows: [], badgeCount: 1, activityRows: [{ xp: 8 }] });
    const streakAfterGap = computeStreak(['2026-11-01'], '2026-12-30');
    expect(streakAfterGap.current).toBe(0);
    const after = computeXp({ lessonRows: rows, projectRows: [], badgeCount: 1, activityRows: [{ xp: 8 }] });
    expect(after).toEqual(before);
    expect(levelFor(after.total)).toBe(levelFor(before.total));
  });

  test('more learning never lowers XP', () => {
    const base = computeXp({ lessonRows: rows, projectRows: [], badgeCount: 0, activityRows: [] }).total;
    expect(computeXp({ lessonRows: [...rows, { ...rows[0], lesson_id: 'a-02' }], projectRows: [], badgeCount: 0, activityRows: [] }).total).toBeGreaterThan(base);
  });

  test('hints reduce but never zero a solved activity; guessing pays less', () => {
    expect(activityXp('fix-bug', { hintsUsed: 2, wrong: 0 })).toBeLessThan(activityXp('fix-bug', { hintsUsed: 0, wrong: 0 }));
    expect(activityXp('fix-bug', { hintsUsed: 50, wrong: 50 })).toBeGreaterThanOrEqual(1);
    expect(activityXp('fix-bug', { hintsUsed: 0, wrong: 5 })).toBeLessThan(activityXp('fix-bug', { hintsUsed: 0, wrong: 0 }));
  });

  test('locked missions can never be current, in any real course, whatever is done', () => {
    for (const course of COURSES) {
      for (const doneCount of [0, 1, Math.floor(course.lessons.length / 2), course.lessons.length]) {
        const lessonRows = course.lessons.slice(0, doneCount).map((lesson) => ({ lesson_id: lesson.id, course_id: course.id, completed_at: 'x', quiz_correct: 3, quiz_total: 3, task_done: 0 }));
        const world = buildWorld(course, computeCourseProgress(course, lessonRows, []));
        const missions = world.chapters.flatMap((chapter) => chapter.missions);
        const current = missions.filter((mission) => mission.state === 'current');
        expect(current.length).toBeLessThanOrEqual(1);
        // Every mission before the current one is done; every one after it is locked.
        const index = missions.findIndex((mission) => mission.state === 'current');
        if (index >= 0) {
          expect(missions.slice(0, index).every((mission) => mission.state === 'done')).toBe(true);
          expect(missions.slice(index + 1).every((mission) => mission.state === 'locked')).toBe(true);
        }
      }
    }
  });

  test('the adaptive layer never uses speed', () => {
    const attempt = (duration: number | null) => ({ activity_id: 'a', lesson_id: 'l', course_id: 'c', kind: 'match', correct: 1, hints_used: 0, created_at: '2026-11-01T00:00:00Z', duration_ms: duration });
    expect(adaptiveSummary([], [attempt(1)], 'beginner')).toEqual(adaptiveSummary([], [attempt(10_000_000)], 'beginner'));
  });
});
