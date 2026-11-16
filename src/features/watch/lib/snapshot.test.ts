import { describe, expect, it } from '@jest/globals';

import { toWatchSnapshot, weekDots, type SnapshotInput } from './snapshot';

const base: SnapshotInput = {
  now: 1_700_000_000_000,
  today: '2026-11-16',
  streak: { current: 3, best: 9, doneToday: true },
  days: ['2026-11-16', '2026-11-15', '2026-11-14', '2026-11-10', '2026-11-10'],
  lessonsThisWeek: 3,
  target: 5,
  next: { course: 'Vibe coding', lesson: 'Your first prompt', day: 4, started: true },
  listen: { state: 'idle', title: null, course: null, canSkip: false },
  handled: ['a'],
};

describe('weekDots', () => {
  it('marks the last seven days, oldest first, today last', () => {
    expect(weekDots(base.days, base.today)).toEqual([true, false, false, false, true, true, true]);
  });
  it('ignores days outside the week and a month boundary', () => {
    expect(weekDots(['2026-11-09', '2026-10-31'], '2026-11-03')).toEqual([false, false, false, true, false, false, false]);
  });
});

describe('toWatchSnapshot', () => {
  it('carries the streak, the week and the next lesson', () => {
    const snapshot = toWatchSnapshot(base);
    expect(snapshot).toMatchObject({ v: 1, sentAt: base.now, day: '2026-11-16', streak: { current: 3, best: 9, doneToday: true }, week: { done: 3, target: 5 }, next: { lesson: 'Your first prompt', day: 4 }, handled: ['a'] });
    expect(snapshot.listen).toBeNull();
  });

  it('shows what is being read and reads the phone voice as playing', () => {
    expect(toWatchSnapshot({ ...base, listen: { state: 'speaking', title: 'Day 4', course: 'Vibe coding', canSkip: true } }).listen).toEqual({ state: 'playing', lesson: 'Day 4', course: 'Vibe coding', canSkip: true });
    expect(toWatchSnapshot({ ...base, listen: { state: 'paused', title: 'Day 4', course: 'Vibe coding', canSkip: false } }).listen?.state).toBe('paused');
    expect(toWatchSnapshot({ ...base, listen: { state: 'loading', title: null, course: null, canSkip: false } }).listen).toEqual({ state: 'loading', lesson: '', course: '', canSkip: false });
  });

  it('never sends a zero target (the ring divides by it)', () => {
    expect(toWatchSnapshot({ ...base, target: 0 }).week.target).toBe(1);
  });

  it('has no next lesson when everything is done', () => {
    expect(toWatchSnapshot({ ...base, next: null }).next).toBeNull();
  });
});
