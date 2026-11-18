import { describe, expect, test } from '@jest/globals';

import { MAX_VISITED_COURSES, parseVisits, recentVisits, withVisit } from './lesson-visits';

describe('lesson visits', () => {
  test('the newest lesson opened replaces the course’s earlier one', () => {
    const first = withVisit({}, 'ai-basics', 'l1', '2026-11-18T08:00:00.000Z');
    const second = withVisit(first, 'ai-basics', 'l2', '2026-11-18T09:00:00.000Z');
    expect(second).toEqual({ 'ai-basics': { lessonId: 'l2', at: '2026-11-18T09:00:00.000Z' } });
  });

  test('recent visits are newest first across courses', () => {
    let visits = withVisit({}, 'a', 'a1', '2026-11-18T08:00:00.000Z');
    visits = withVisit(visits, 'b', 'b3', '2026-11-18T10:00:00.000Z');
    visits = withVisit(visits, 'c', 'c2', '2026-11-18T09:00:00.000Z');
    expect(recentVisits(visits).map((visit) => visit.courseId)).toEqual(['b', 'c', 'a']);
    expect(recentVisits(visits, 1)).toEqual([{ courseId: 'b', lessonId: 'b3', at: '2026-11-18T10:00:00.000Z' }]);
  });

  test('only the newest courses are kept', () => {
    let visits = {};
    for (let i = 0; i < MAX_VISITED_COURSES + 5; i += 1) visits = withVisit(visits, `c${i}`, 'l', new Date(Date.UTC(2026, 10, 1, 0, i)).toISOString());
    expect(Object.keys(visits)).toHaveLength(MAX_VISITED_COURSES);
    expect(visits).not.toHaveProperty('c0');
    expect(visits).toHaveProperty(`c${MAX_VISITED_COURSES + 4}`);
  });

  test('saved text that is not a visit is dropped', () => {
    expect(parseVisits(null)).toEqual({});
    expect(parseVisits([])).toEqual({});
    expect(parseVisits({ a: { lessonId: 'l1', at: '2026-11-18T08:00:00.000Z' }, b: { lessonId: '', at: 'x' }, c: 5, d: { lessonId: 'l', at: 'not a date' } })).toEqual({
      a: { lessonId: 'l1', at: '2026-11-18T08:00:00.000Z' },
    });
  });
});
