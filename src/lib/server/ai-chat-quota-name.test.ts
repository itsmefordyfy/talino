import { describe, expect, test } from '@jest/globals';

import { beginChat, QUOTA_APP_NAME } from './ai-chat-quota';

describe('the quota app name', () => {
  test('is what the shared SQL accepts: 3 to 20 lowercase letters', () => {
    for (const ok of ['talino', 'talinoresume']) expect(QUOTA_APP_NAME.test(ok)).toBe(true);
    for (const bad of ['talino-resume', 'talino_resume', 'ab', 'Talino', 'talino2', 'a'.repeat(21)]) expect(QUOTA_APP_NAME.test(bad)).toBe(false);
  });

  test('a name the database would refuse fails loudly instead of looking like a busy server', async () => {
    await expect(beginChat(['device:abcdefgh'], 'conversation-1', 'pro', { app: 'talino-resume', limit: 5 })).rejects.toThrow('Invalid quota app name');
  });
});
