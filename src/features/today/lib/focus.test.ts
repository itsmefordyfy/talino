import { describe, expect, test } from '@jest/globals';

import { addDays } from '@/lib/dates';
import type { CourseProgress } from '@/features/courses/lib/progress';

import { pickFocusCourse, weekDots } from './focus';

const entry = (courseId: string, started: boolean, complete = false) => ({ courseId, started, complete }) as CourseProgress;

describe('pickFocusCourse', () => {
  const all = () => true;
  test('the chosen course while unfinished', () => {
    expect(pickFocusCourse([entry('starter', true), entry('builder', true)], 'builder', all)).toBe('builder');
  });
  test('a started paid course before the starter', () => {
    expect(pickFocusCourse([entry('starter', true), entry('developer', true)], null, all)).toBe('developer');
  });
  test('the starter when nothing else is going', () => {
    expect(pickFocusCourse([entry('starter', false), entry('developer', false)], null, all)).toBe('starter');
  });
  test('skips courses not owned or finished', () => {
    expect(pickFocusCourse([entry('starter', true, true), entry('developer', true), entry('builder', false)], 'developer', (id) => id === 'builder')).toBe('builder');
  });
});

describe('weekDots', () => {
  test('seven days ending today', () => {
    const dots = weekDots(['2026-11-13', '2026-11-10'], '2026-11-13', addDays);
    expect(dots).toHaveLength(7);
    expect(dots[0].day).toBe('2026-11-07');
    expect(dots.filter((dot) => dot.done).map((dot) => dot.day)).toEqual(['2026-11-10', '2026-11-13']);
  });
});
