import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { AI_BUILDER_JOURNEY } from '../data/journey';
import { computeJourney } from '../lib/engine';
import { emptyFacts, newLearner } from '../lib/test-helpers';
import { useMilestoneActions } from './use-milestone-actions';

const calls: string[] = [];
const mockPush = jest.fn((arg: unknown) => calls.push(`push:${typeof arg === 'string' ? arg : (arg as { pathname: string }).pathname}`));
const mockOpenLesson = jest.fn((id: string) => calls.push(`lesson:${id}`));
const mockDismiss = jest.fn(() => calls.push('dismiss'));

jest.mock('expo-router', () => ({ router: { push: (arg: unknown) => mockPush(arg), dismiss: () => mockDismiss(), canDismiss: () => true } }));
jest.mock('@/features/courses', () => ({ useOpenLesson: () => (id: string) => mockOpenLesson(id) }));
jest.mock('@/hooks/use-strings', () => ({ useLocalized: () => ({ sheet: { askPrompt: (title: string) => title } }) }));

const state = computeJourney(AI_BUILDER_JOURNEY, emptyFacts(), newLearner);

beforeEach(() => {
  mockPush.mockClear();
  mockOpenLesson.mockClear();
  mockDismiss.mockClear();
  calls.length = 0;
});

describe('useMilestoneActions().go', () => {
  test('the current milestone opens its next lesson', () => {
    expect(useMilestoneActions().go(state.current!)).toBe(true);
    expect(mockOpenLesson).toHaveBeenCalledTimes(1);
  });

  test('a locked milestone opens nothing until the course before it is finished', () => {
    const locked = state.milestones.find((entry) => entry.status === 'locked' && entry.next)!;
    expect(locked).toBeDefined();
    expect(useMilestoneActions().go(locked)).toBe(false);
    expect(mockOpenLesson).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});

describe('leaving the milestone sheet (owner, 2026-11-16: Start learning opens a new screen, not inside the sheet)', () => {
  test('from the sheet, Start closes the sheet first, then opens the lesson as its own screen', () => {
    expect(useMilestoneActions({ fromSheet: true }).go(state.current!)).toBe(true);
    expect(calls[0]).toBe('dismiss');
    expect(calls[1]).toMatch(/^lesson:/);
  });

  test('from the sheet, any other screen it opens also leaves the sheet', () => {
    const actions = useMilestoneActions({ fromSheet: true });
    actions.leave(() => mockPush({ pathname: '/course/[id]' }));
    expect(calls).toEqual(['dismiss', 'push:/course/[id]']);
  });

  test('from Home itself nothing is dismissed', () => {
    useMilestoneActions().go(state.current!);
    expect(mockDismiss).not.toHaveBeenCalled();
  });

  test('a locked milestone closes nothing either', () => {
    const locked = state.milestones.find((entry) => entry.status === 'locked' && entry.next)!;
    expect(useMilestoneActions({ fromSheet: true }).go(locked)).toBe(false);
    expect(mockDismiss).not.toHaveBeenCalled();
  });
});
