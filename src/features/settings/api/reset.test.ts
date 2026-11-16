import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';

import { deleteAllData, RESET_TABLES } from './reset';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

describe('Delete all data', () => {
  test('names every table the app has, so a new table can’t be left holding someone’s data', async () => {
    const tables = (await db.getAllAsync<{ name: string }>("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")).map((row) => row.name);
    expect(tables.filter((name) => !RESET_TABLES.includes(name))).toEqual([]);
  });

  test('empties résumés, portfolio projects with their screenshots and the profile picture', async () => {
    await db.runAsync("INSERT INTO resume_documents (id, name, template, style, content, created_at, updated_at) VALUES ('d1', 'R', 'modern', '{}', '{}', 'x', 'x')");
    await db.runAsync("INSERT INTO portfolio_projects (id, title, images, created_at, updated_at) VALUES ('p1', 'App', '[\"/9j/abc\"]', 'x', 'x')");
    await db.runAsync("INSERT INTO resume_profile (id, photo, created_at, updated_at) VALUES ('me', '/9j/abc', 'x', 'x')");
    await deleteAllData(db);
    for (const table of ['resume_documents', 'portfolio_projects', 'resume_profile', 'deleted_rows']) {
      expect(await db.getFirstAsync(`SELECT 1 AS found FROM ${table}`)).toBeNull();
    }
  });
});
