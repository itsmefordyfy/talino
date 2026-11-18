import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';
import { deleteAllData } from '@/features/settings/api/reset';

import { ASSISTANT_DRAFT_KEY, EMPTY_ASSISTANT_DRAFT, parseAssistantDraft, readAssistantDraft, writeAssistantDraft } from './assistant-draft';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

describe('the assistant launcher draft', () => {
  test('a fresh install reads an empty draft', async () => {
    expect(await readAssistantDraft(db)).toEqual(EMPTY_ASSISTANT_DRAFT);
  });

  test('what was written is read back, under the documented key', async () => {
    const draft = { request: 'security' as const, description: 'A shop app.', constraints: 'Two developers.', knowns: 'We use PostgreSQL.' };
    await writeAssistantDraft(db, draft);
    expect(await readAssistantDraft(db)).toEqual(draft);
    const row = await db.getFirstAsync<{ key: string }>('SELECT key FROM app_state WHERE key = ?', ASSISTANT_DRAFT_KEY);
    expect(row?.key).toBe('architecture:assistant-draft');
  });

  test('a second write replaces the first (one row)', async () => {
    await writeAssistantDraft(db, { ...EMPTY_ASSISTANT_DRAFT, description: 'one' });
    await writeAssistantDraft(db, { ...EMPTY_ASSISTANT_DRAFT, description: 'two' });
    expect((await readAssistantDraft(db)).description).toBe('two');
    const rows = await db.getAllAsync('SELECT key FROM app_state WHERE key = ?', ASSISTANT_DRAFT_KEY);
    expect(rows).toHaveLength(1);
  });

  test('damaged saved data reads as an empty draft or its good parts', async () => {
    await db.runAsync("INSERT INTO app_state (key, value, updated_at) VALUES (?, 'not json', 'x')", ASSISTANT_DRAFT_KEY);
    expect(await readAssistantDraft(db)).toEqual(EMPTY_ASSISTANT_DRAFT);
    expect(parseAssistantDraft({ request: 'nonsense', description: 7, constraints: 'ok' })).toEqual({ ...EMPTY_ASSISTANT_DRAFT, constraints: 'ok' });
    expect(parseAssistantDraft([1])).toEqual(EMPTY_ASSISTANT_DRAFT);
    expect(parseAssistantDraft(null)).toEqual(EMPTY_ASSISTANT_DRAFT);
  });

  test('saved text is clipped to what the launcher sends', () => {
    expect(parseAssistantDraft({ description: 'a'.repeat(5000) }).description).toHaveLength(1200);
  });

  test('reset all data clears it', async () => {
    await writeAssistantDraft(db, { ...EMPTY_ASSISTANT_DRAFT, description: 'private plans' });
    await deleteAllData(db);
    expect(await readAssistantDraft(db)).toEqual(EMPTY_ASSISTANT_DRAFT);
  });
});
