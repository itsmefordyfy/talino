import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { EXPERIENCE_LEVELS } from '@/features/courses/content/levels';
import { cleanLevel } from '@/features/courses/lib/adaptation';

import { requestReview } from './client';

const mockPost = jest.fn<(path: string, body: Record<string, unknown>) => Promise<Record<string, unknown>>>();
jest.mock('@/lib/api', () => ({ ApiError: class ApiError extends Error {}, postJson: (path: string, body: Record<string, unknown>) => mockPost(path, body) }));
jest.mock('@/lib/device-id', () => ({ deviceId: () => 'device-12345678' }));

describe('the review request carries the learner level', () => {
  beforeEach(() => {
    mockPost.mockReset();
    mockPost.mockResolvedValue({ review: { verdict: 'needs_work', summary: 'ok', checks: [], nextSteps: [] }, token: null });
  });

  test('every one of the five levels is sent as is, and each is a valid level for the server', async () => {
    for (const level of EXPERIENCE_LEVELS) {
      await requestReview({ appUserId: 'u1', entitlements: [] }, { projectId: 'starter-p1', reviewId: 'id-00000001', link: '', submission: 'x', language: 'en', level });
      const body = mockPost.mock.calls[mockPost.mock.calls.length - 1][1];
      expect(body).toMatchObject({ mode: 'review', projectId: 'starter-p1', level });
      expect(cleanLevel(body.level)).toBe(level);
    }
  });

  test('no level (onboarding skipped) is sent as nothing, and the server then uses the shared rubric', async () => {
    await requestReview({ appUserId: 'u1', entitlements: [] }, { projectId: 'starter-p1', reviewId: 'id-00000001', link: '', submission: 'x', language: 'en', level: null });
    expect(cleanLevel(mockPost.mock.calls[0][1].level)).toBeNull();
  });
});
