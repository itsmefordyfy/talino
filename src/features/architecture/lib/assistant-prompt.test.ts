import { describe, expect, test } from '@jest/globals';

import {
  ALWAYS_ASK,
  ASSISTANT_REQUESTS,
  ASSISTANT_REQUEST_IDS,
  MAX_DESCRIPTION_CHARS,
  assistantPromptProblems,
  assistantRequest,
  buildAssistantPrompt,
  canOpenAssistant,
  isAssistantRequestId,
  type AssistantPromptProblemId,
} from './assistant-prompt';

const DESCRIPTION = 'TindaTrack is an app where small shop owners record sales and stock from a phone. About two thousand shops use it, and each must only see its own data.';

const ids = (description: string, constraints = '', knowns = ''): AssistantPromptProblemId[] => assistantPromptProblems({ description, constraints, knowns }).map((problem) => problem.id);

describe('the request types', () => {
  test('there are nine, each with a label, a sentence and an instruction line', () => {
    expect(ASSISTANT_REQUESTS.map((request) => request.id)).toEqual([...ASSISTANT_REQUEST_IDS]);
    expect(ASSISTANT_REQUEST_IDS).toEqual(['requirements', 'recommendation', 'components', 'database', 'api', 'security', 'scalability', 'cost', 'tradeoffs']);
    for (const request of ASSISTANT_REQUESTS) {
      expect(request.label.length).toBeGreaterThan(3);
      expect(request.description.endsWith('.')).toBe(true);
      expect(request.instruction.length).toBeGreaterThan(40);
    }
    expect(new Set(ASSISTANT_REQUESTS.map((request) => request.label)).size).toBe(9);
  });

  test('lookup and the type guard', () => {
    expect(assistantRequest('security').label).toBe('Security recommendations');
    expect(isAssistantRequestId('cost')).toBe(true);
    expect(isAssistantRequestId('prices')).toBe(false);
    expect(isAssistantRequestId(3)).toBe(false);
  });

  test('no request invites prices, exploit steps or a guaranteed answer', () => {
    const cost = assistantRequest('cost').instruction;
    expect(cost).toContain('Do not quote prices');
    expect(assistantRequest('security').instruction).toContain('Do not give exploit steps');
  });
});

describe('buildAssistantPrompt', () => {
  test.each(ASSISTANT_REQUEST_IDS)('the %s prompt carries the description, its own instruction and every standing ask', (request) => {
    const prompt = buildAssistantPrompt({ request, description: DESCRIPTION });
    expect(prompt).toContain(DESCRIPTION);
    expect(prompt).toContain(assistantRequest(request).instruction);
    expect(prompt).toContain(assistantRequest(request).label);
    for (const ask of ALWAYS_ASK) expect(prompt).toContain(ask);
    expect(prompt).toContain('assumptions');
    expect(prompt).toContain('information you are missing');
    expect(prompt).toContain('Explain your reasoning');
    expect(prompt).toContain('simplest option');
    expect(prompt).toContain('what each alternative would cost');
    expect(prompt).toContain('draft for me to check');
    expect(prompt.length).toBeLessThan(4000);
  });

  test('constraints and knowns appear only when given', () => {
    const bare = buildAssistantPrompt({ request: 'database', description: DESCRIPTION });
    expect(bare).not.toContain('Constraints:');
    expect(bare).not.toContain('Already known or decided:');
    const full = buildAssistantPrompt({ request: 'database', description: DESCRIPTION, constraints: 'Two developers, no night on-call.', knowns: 'We already use PostgreSQL.' });
    expect(full).toContain('Constraints:\nTwo developers, no night on-call.');
    expect(full).toContain('Already known or decided:\nWe already use PostgreSQL.');
    expect(buildAssistantPrompt({ request: 'database', description: DESCRIPTION, constraints: '   ' })).not.toContain('Constraints:');
  });

  test('the description is clipped to 1,200 characters and the whole prompt stays inside the chat box', () => {
    const prompt = buildAssistantPrompt({ request: 'recommendation', description: 'a'.repeat(5000), constraints: 'b'.repeat(5000), knowns: 'c'.repeat(5000) });
    expect(prompt).toContain(`${'a'.repeat(MAX_DESCRIPTION_CHARS)}…`);
    expect(prompt).not.toContain('a'.repeat(MAX_DESCRIPTION_CHARS + 1));
    expect(prompt.length).toBeLessThanOrEqual(4000);
  });

  test('an empty description still produces a readable prompt', () => {
    expect(buildAssistantPrompt({ request: 'cost', description: '  ' })).toContain('(not described yet)');
  });
});

describe('assistantPromptProblems', () => {
  test('a good description has nothing to report', () => {
    expect(ids(DESCRIPTION, 'Two developers.', 'We use PostgreSQL today.')).toEqual([]);
  });

  test('empty and too-short descriptions block opening the assistant; the 40-character edge', () => {
    expect(ids('')).toEqual(['description-empty']);
    expect(ids('   ')).toEqual(['description-empty']);
    expect(ids('A shop app.')).toEqual(['description-short']);
    expect(ids('x'.repeat(39))).toEqual(['description-short']);
    expect(ids('x'.repeat(40))).toEqual([]);
    expect(canOpenAssistant(assistantPromptProblems({ description: 'short' }))).toBe(false);
    expect(canOpenAssistant(assistantPromptProblems({ description: DESCRIPTION }))).toBe(true);
  });

  test('a description over the limit is a reminder that it will be clipped', () => {
    const problems = assistantPromptProblems({ description: 'x'.repeat(MAX_DESCRIPTION_CHARS + 1) });
    expect(problems.map((problem) => problem.id)).toEqual(['description-clipped']);
    expect(canOpenAssistant(problems)).toBe(true);
  });

  test('an email address is a reminder, in any of the three fields, and does not block', () => {
    expect(ids(`${DESCRIPTION} Contact maria.cruz@example.com for access.`)).toEqual(['private-email']);
    expect(ids(DESCRIPTION, 'Send reports to ops@tindatrack.example')).toEqual(['private-email']);
    expect(ids(DESCRIPTION, '', 'Admin is a.b@c.io')).toEqual(['private-email']);
    expect(canOpenAssistant(assistantPromptProblems({ description: `${DESCRIPTION} me@example.com` }))).toBe(true);
  });

  test('phone numbers in common shapes are found', () => {
    for (const number of ['+63 917 123 4567', '0917 123 4567', '0917-123-4567', '(555) 123-4567', '555-123-4567', '09171234567', '+1 555 123 4567']) {
      expect(ids(`${DESCRIPTION} Call ${number} if it breaks.`)).toEqual(['private-phone']);
    }
  });

  test('ordinary architecture numbers are not phone numbers', () => {
    const numbers = 'It must handle 10000000 requests a day, 1,000,000 rows, 99.9% uptime, 2.5 TB of photos, a 200 ms budget, 3 regions and a 2026-11-18 launch.';
    expect(ids(`${DESCRIPTION} ${numbers}`)).toEqual([]);
  });

  test('keys, tokens and passwords are found', () => {
    for (const secret of [
      'sk-abcdefghijklmnopqrstuvwxyz123456',
      'ghp_abcdefghijklmnopqrstuvwxyz1234',
      'AKIAABCDEFGHIJKLMNOP',
      'password: hunter2hunter2',
      'api_key=abc123def456',
      '-----BEGIN RSA PRIVATE KEY-----',
      'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
    ]) {
      expect(ids(`${DESCRIPTION} We use ${secret} in staging.`)).toContain('private-key');
    }
  });

  test('plain words like "token" or "password" in a design sentence, and long hyphenated names, are not keys', () => {
    expect(ids(`${DESCRIPTION} Users sign in with a password and receive a short-lived token that the API checks on each request.`)).toEqual([]);
    expect(ids(`${DESCRIPTION} The row-level-security-based-tenant-isolation-approach is what we are considering.`)).toEqual([]);
  });

  test('several reminders can show at once', () => {
    expect(ids(`${DESCRIPTION} me@example.com 0917 123 4567 password: hunter2hunter2`)).toEqual(['private-email', 'private-phone', 'private-key']);
  });
});
