import { describe, expect, test } from '@jest/globals';

import { badgesEarnedDuring, summaryChanges } from './summary';

describe('badgesEarnedDuring', () => {
  const done = '2026-11-13T10:00:00.000Z';
  test('counts badges earned at or just after the lesson, not before or long after', () => {
    const badges = [
      { badge_id: 'before', earned_at: '2026-11-13T09:00:00.000Z' },
      { badge_id: 'same', earned_at: '2026-11-13T10:00:00.400Z' },
      { badge_id: 'soon', earned_at: '2026-11-13T10:05:00.000Z' },
      { badge_id: 'later', earned_at: '2026-11-14T10:00:00.000Z' },
    ];
    expect(badgesEarnedDuring(badges, done)).toEqual(['same', 'soon']);
  });

  test('no completion time, no badges', () => {
    expect(badgesEarnedDuring([{ badge_id: 'x', earned_at: done }], null)).toEqual([]);
    expect(badgesEarnedDuring([{ badge_id: 'x', earned_at: 'bad' }], done)).toEqual([]);
  });
});

describe('summaryChanges', () => {
  test('a mission that crosses a level reports it', () => {
    const result = summaryChanges({ totalXp: 110, missionXp: 25, newAchievements: [] });
    expect(result.levelUp).toEqual({ level: 2, title: 'Eager Learner' });
  });

  test('no level change, nothing reported; an achievement counts toward the before state', () => {
    expect(summaryChanges({ totalXp: 130, missionXp: 25, newAchievements: [] }).levelUp).toBeNull();
    const result = summaryChanges({ totalXp: 180, missionXp: 20, newAchievements: ['perfect-quiz'] });
    expect(result.levelUp).toBeNull();
  });
});
