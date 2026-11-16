import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { COURSES, STARTER_COURSE_ID } from '../content';
import { useOpenLesson } from './use-open-lesson';

const mockPush = jest.fn();
const mockPaywall = jest.fn<(reason: string) => Promise<void>>();
let mockAccess = { known: true, owns: (_id: string) => false };

jest.mock('expo-router', () => ({ router: { push: (arg: unknown) => mockPush(arg) } }));
jest.mock('@/features/store', () => ({ openPaywall: (reason: string) => mockPaywall(reason), useAccess: () => mockAccess }));

const starter = COURSES.find((course) => course.id === STARTER_COURSE_ID)!;
const paid = COURSES.find((course) => course.id !== STARTER_COURSE_ID && course.lessons.length > 0)!;

beforeEach(() => {
  mockPush.mockClear();
  mockPaywall.mockReset();
  mockPaywall.mockResolvedValue(undefined);
  mockAccess = { known: true, owns: (id) => id === STARTER_COURSE_ID };
});

describe('useOpenLesson', () => {
  test('a lesson of a course the learner has opens the lesson', () => {
    useOpenLesson()(starter.lessons[0].id);
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/lesson/[id]', params: { id: starter.lessons[0].id } });
    expect(mockPaywall).not.toHaveBeenCalled();
  });

  test('a lesson of a course they do not have opens the paywall, never the "you don’t have it" page', () => {
    useOpenLesson()(paid.lessons[0].id);
    expect(mockPaywall).toHaveBeenCalledWith('courses');
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('before the store has answered the lesson opens as before, so a subscriber is never sent to the paywall by mistake', () => {
    mockAccess = { known: false, owns: () => false };
    useOpenLesson()(paid.lessons[0].id);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPaywall).not.toHaveBeenCalled();
  });

  test('a subscriber (everything owned) opens any lesson', () => {
    mockAccess = { known: true, owns: () => true };
    useOpenLesson()(paid.lessons[0].id);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPaywall).not.toHaveBeenCalled();
  });
});
