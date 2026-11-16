import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { migrateDatabase, SCHEMA_VERSION } from '@/db/migrations';
import { createTestDatabase } from '@/db/testing/node-database';

import { application, at, certificate, goal, income, resumeItem, resumeVersion, rowsOf, seed, tombstonesOf } from '../test-support';
import { BACKUP_TABLES, EXCLUDED_TABLES, TABLE_NAMES, TOMBSTONE_TABLES, sanitizeRow, tableSpec } from './schema';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

type Info = { name: string; pk: number };

describe('the table list matches the real schema', () => {
  test('every column of every backed-up table is listed, except the install-bound review token', async () => {
    for (const spec of BACKUP_TABLES) {
      const info = await db.getAllAsync<Info>(`PRAGMA table_info(${spec.name})`);
      const real = info.map((column) => column.name).filter((name) => !(spec.name === 'project_progress' && name === 'review_token'));
      expect([...spec.columns.map((column) => column.name)].sort()).toEqual([...real].sort());
      expect(info.find((column) => column.pk === 1)?.name).toBe(spec.key);
    }
  });

  test('every table is either backed up or knowingly excluded', async () => {
    const tables = await db.getAllAsync<{ name: string }>("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'");
    const known = new Set<string>([...TABLE_NAMES, ...EXCLUDED_TABLES, 'deleted_rows']);
    expect(tables.map((table) => table.name).filter((name) => !known.has(name))).toEqual([]);
    expect(SCHEMA_VERSION).toBeGreaterThanOrEqual(4);
  });

  test('every table the learner can delete from has a tombstone trigger', async () => {
    const triggers = await db.getAllAsync<{ tbl_name: string }>("SELECT tbl_name FROM sqlite_master WHERE type = 'trigger'");
    expect(triggers.map((trigger) => trigger.tbl_name).sort()).toEqual([...TOMBSTONE_TABLES].sort());
  });
});

describe('migration v4', () => {
  test('a v3 database with data upgrades in place: its rows are untouched and deletes are then recorded', async () => {
    await seed(db, 'applications', [application('a1')]);
    await seed(db, 'income', [income('i1', { application_id: 'a1' })]);
    await seed(db, 'resume_versions', [resumeVersion('freelancer')]);
    // Put the database back where an install made before v4 is.
    await db.execAsync(`
      DROP TABLE deleted_rows;
      DROP TRIGGER trg_applications_deleted; DROP TRIGGER trg_income_deleted; DROP TRIGGER trg_career_goals_deleted;
      DROP TRIGGER trg_resume_items_deleted; DROP TRIGGER trg_resume_versions_deleted; DROP TRIGGER trg_certificates_deleted;
      PRAGMA user_version = 3;
    `);
    await db.runAsync('DELETE FROM income WHERE id = ?', ['i1']);
    expect(await db.getFirstAsync('SELECT name FROM sqlite_master WHERE name = ?', ['deleted_rows'])).toBeNull();

    await migrateDatabase(db);

    expect((await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version'))?.user_version).toBe(SCHEMA_VERSION);
    expect(await rowsOf(db, 'applications')).toHaveLength(1);
    expect(await rowsOf(db, 'resume_versions')).toHaveLength(1);
    // A delete made before the upgrade left nothing behind; one made after is noted.
    expect(await tombstonesOf(db)).toEqual([]);
    await db.runAsync('DELETE FROM applications WHERE id = ?', ['a1']);
    await db.runAsync('DELETE FROM resume_versions WHERE goal = ?', ['freelancer']);
    expect(await tombstonesOf(db)).toEqual([
      { table_name: 'applications', row_id: 'a1', deleted_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/) },
      { table_name: 'resume_versions', row_id: 'freelancer', deleted_at: expect.stringMatching(/Z$/) },
    ]);
  });

  test('deleting records the table, the id and a timestamp shaped like the app’s own', async () => {
    await seed(db, 'career_goals', [goal('g1')]);
    await seed(db, 'resume_items', [resumeItem('r1')]);
    await seed(db, 'certificates', [certificate('c1', 'dev')]);
    await seed(db, 'income', [income('i1')]);
    const before = new Date().toISOString();
    for (const [table, key, id] of [['career_goals', 'id', 'g1'], ['resume_items', 'id', 'r1'], ['certificates', 'id', 'c1'], ['income', 'id', 'i1']] as const) await db.runAsync(`DELETE FROM ${table} WHERE ${key} = ?`, [id]);
    const tombstones = await tombstonesOf(db);
    expect(tombstones.map((item) => `${item.table_name}:${item.row_id}`)).toEqual(['career_goals:g1', 'certificates:c1', 'income:i1', 'resume_items:r1']);
    for (const item of tombstones) expect(item.deleted_at >= before.slice(0, 19)).toBe(true);
  });

  test('deleting an application unlinks its income but leaves the income', async () => {
    await seed(db, 'applications', [application('a1')]);
    await seed(db, 'income', [income('i1', { application_id: 'a1' })]);
    await db.runAsync('DELETE FROM applications WHERE id = ?', ['a1']);
    expect((await rowsOf(db, 'income'))[0].application_id).toBeNull();
    expect(await tombstonesOf(db)).toHaveLength(1);
  });
});

describe('sanitizeRow', () => {
  test('accepts a complete row and rejects an empty key or a wrong type', () => {
    const spec = tableSpec('badges');
    expect(sanitizeRow(spec, { badge_id: 'b', earned_at: at(1), seen: 1 })).toEqual({ badge_id: 'b', earned_at: at(1), seen: 1 });
    expect(sanitizeRow(spec, { badge_id: '', earned_at: at(1), seen: 1 })).toBeNull();
    expect(sanitizeRow(spec, { badge_id: 'b', earned_at: at(1), seen: 'yes' })).toBeNull();
    expect(sanitizeRow(spec, 'nope')).toBeNull();
    expect(sanitizeRow(spec, [1, 2])).toBeNull();
  });
});
