import { afterEach, describe, expect, test } from '@jest/globals';

import { QUOTA_APP_NAME } from '@/lib/server/ai-chat-quota';

import { PRACTICE_APP, PRACTICE_FREE_DAILY_LIMIT, PRACTICE_PRO_DAILY_LIMIT, practiceLimit } from './limits';

describe('practice limits', () => {
  const env = { ...process.env };
  afterEach(() => {
    process.env = { ...env };
  });

  test('the app name is the one the shared allowance table accepts', () => {
    expect(PRACTICE_APP).toBe('talinopractice');
    expect(QUOTA_APP_NAME.test(PRACTICE_APP)).toBe(true);
  });

  test('Free gets 3 sessions a day, a purchase gets 30', () => {
    expect(PRACTICE_FREE_DAILY_LIMIT).toBe(3);
    expect(PRACTICE_PRO_DAILY_LIMIT).toBe(30);
    delete process.env.PRACTICE_FREE_DAILY_LIMIT;
    delete process.env.PRACTICE_PRO_DAILY_LIMIT;
    expect(practiceLimit('free')).toBe(3);
    expect(practiceLimit('pro')).toBe(30);
  });

  test('server variables override, and nonsense is ignored', () => {
    process.env.PRACTICE_FREE_DAILY_LIMIT = '5';
    process.env.PRACTICE_PRO_DAILY_LIMIT = '0';
    expect(practiceLimit('free')).toBe(5);
    expect(practiceLimit('pro')).toBe(30);
    process.env.PRACTICE_FREE_DAILY_LIMIT = 'many';
    expect(practiceLimit('free')).toBe(3);
  });
});
