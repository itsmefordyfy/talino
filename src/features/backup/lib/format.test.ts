import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';
import { SCHEMA_VERSION } from '@/db/migrations';
import { initialSettingsState } from '@/features/settings/settings-slice';

import { application, at, badge, learnerProfile, lesson, nodeHash, parsedSnapshot, project, seed, snapshotOf } from '../test-support';
import { BACKUP_EXTENSION, BACKUP_FORMAT, BACKUP_VERSION, canonicalJson, MAX_BACKUP_BYTES, parseBackup } from './format';
import { BACKED_UP_SETTINGS, cleanBackedUpSettings, settingsForBackup } from './settings';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

describe('the backup file', () => {
  test('is named and versioned as documented', async () => {
    await seed(db, 'lesson_progress', [lesson('l1')]);
    const { backup, text } = await snapshotOf(db, { label: 'Before the move' });
    expect(BACKUP_EXTENSION).toBe('talino-backup');
    expect(backup).toMatchObject({ format: BACKUP_FORMAT, version: BACKUP_VERSION, app: 'talino', appVersion: '1.0.0', schemaVersion: SCHEMA_VERSION, platform: 'ios', profileId: 'profile-a', label: 'Before the move' });
    expect(backup.checksum).toMatch(/^sha256:[0-9a-f]{64}$/);
    const raw = JSON.parse(text) as Record<string, unknown>;
    expect(Object.keys(raw).sort()).toEqual(['app', 'appVersion', 'checksum', 'counts', 'createdAt', 'format', 'label', 'platform', 'profileId', 'schemaVersion', 'settings', 'tables', 'version']);
  });

  test('round-trips: what was written is what is read', async () => {
    await seed(db, 'lesson_progress', [lesson('l1'), lesson('l2', { completed_at: null, quiz_correct: null, quiz_total: null })]);
    await seed(db, 'project_progress', [project('p1', { steps_done: '["a","b"]', status: 'passed', feedback: 'Nice' })]);
    await seed(db, 'applications', [application('app1')]);
    await seed(db, 'badges', [badge('first-lesson')]);
    const { backup, text } = await snapshotOf(db);
    const parsed = await parseBackup(text, nodeHash);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.backup.tables).toEqual(backup.tables);
    expect(parsed.backup.tombstones).toEqual(backup.tombstones);
    expect(parsed.backup.settings).toEqual(backup.settings);
    expect(parsed.backup.counts).toMatchObject({ lessons: 1, projects: 1, badges: 1, applications: 1 });
  });

  test('canonical JSON ignores key order', () => {
    expect(canonicalJson({ b: 1, a: [{ d: 1, c: 2 }] })).toBe(canonicalJson({ a: [{ c: 2, d: 1 }], b: 1 }));
  });

  test('a changed byte in the data is caught by the checksum', async () => {
    await seed(db, 'lesson_progress', [lesson('l1')]);
    const { text } = await snapshotOf(db);
    const tampered = text.replace('"quiz_correct":4', '"quiz_correct":5');
    expect(tampered).not.toBe(text);
    expect(await parseBackup(tampered, nodeHash)).toEqual({ ok: false, reason: 'corrupted' });
    const edited = text.replace('"profileId":"profile-a"', '"profileId":"profile-b"');
    expect(await parseBackup(edited, nodeHash)).toEqual({ ok: false, reason: 'corrupted' });
  });

  test('refuses garbage, truncated, empty and oversized input without throwing', async () => {
    await seed(db, 'lesson_progress', [lesson('l1')]);
    const { text } = await snapshotOf(db);
    for (const input of ['', 'not json', '[]', '{}', 'null', '"talino-backup"', text.slice(0, Math.floor(text.length / 2)), '{"format":"talino-backup"']) {
      const result = await parseBackup(input, nodeHash);
      expect(result.ok).toBe(false);
    }
    expect(await parseBackup('x'.repeat(MAX_BACKUP_BYTES + 1), nodeHash)).toEqual({ ok: false, reason: 'too_large' });
    expect(await parseBackup(JSON.stringify({ format: 'something-else', app: 'talino' }), nodeHash)).toEqual({ ok: false, reason: 'not_a_backup' });
    expect(await parseBackup(undefined as unknown as string, nodeHash)).toEqual({ ok: false, reason: 'not_a_backup' });
    // A backup cut off part-way is damaged; random text is not a backup.
    expect(await parseBackup(text.slice(0, Math.floor(text.length / 2)), nodeHash)).toEqual({ ok: false, reason: 'corrupted' });
    expect(await parseBackup('hello there', nodeHash)).toEqual({ ok: false, reason: 'not_a_backup' });
  });

  test('a file from a newer Talino is refused with its own reason', async () => {
    const { text } = await snapshotOf(db);
    const raw = JSON.parse(text) as Record<string, unknown>;
    expect(await parseBackup(JSON.stringify({ ...raw, version: 2 }), nodeHash)).toEqual({ ok: false, reason: 'unsupported_version' });
    // The data is from a newer database than this app knows: update first (the schema check comes before the checksum is trusted).
    expect(await parseBackup(JSON.stringify({ ...raw, schemaVersion: SCHEMA_VERSION + 1 }), nodeHash)).toEqual({ ok: false, reason: 'needs_newer_app' });
    expect((await snapshotOf(db, { schemaVersion: 9 })).backup.schemaVersion).toBe(9);
    const newer = await snapshotOf(db, { schemaVersion: SCHEMA_VERSION + 1 });
    expect(await parseBackup(newer.text, nodeHash)).toEqual({ ok: false, reason: 'needs_newer_app' });
  });

  test('an older file is fine: fewer columns get their fallbacks, unknown tables and columns are ignored', async () => {
    const tables = {
      lesson_progress: [{ lesson_id: 'l1', course_id: 'c', completed_at: at(5), created_at: at(5), updated_at: at(5), invented_column: 'x' }],
      project_progress: [{ project_id: 'p1', course_id: 'c', created_at: at(5), updated_at: at(5), review_token: 'SECRET' }],
      from_the_future: [{ anything: 1 }],
    };
    const base = { format: BACKUP_FORMAT, version: 1, app: 'talino', schemaVersion: 1, createdAt: at(1), platform: 'android', profileId: 'p', settings: {}, tables };
    const checksum = `sha256:${await nodeHash(canonicalJson(base))}`;
    const parsed = await parseBackup(JSON.stringify({ ...base, appVersion: '0.9', checksum }), nodeHash);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.backup.tables.lesson_progress[0]).toEqual({ lesson_id: 'l1', course_id: 'c', completed_at: at(5), quiz_correct: null, quiz_total: null, task_done: 0, created_at: at(5), updated_at: at(5) });
    expect(parsed.backup.tables.project_progress[0]).toMatchObject({ steps_done: '[]', status: 'open', submission: null });
    expect(JSON.stringify(parsed.backup)).not.toContain('SECRET');
    expect(JSON.stringify(parsed.backup)).not.toContain('invented_column');
  });

  test('never holds excluded tables, review tokens or secrets', async () => {
    await db.runAsync("INSERT INTO coach_chats (id, title, mode, created_at, updated_at) VALUES ('c1', 'Private talk', 'chat', ?, ?)", [at(5), at(5)]);
    await db.runAsync("INSERT INTO coach_messages (id, chat_id, role, text, created_at) VALUES ('m1', 'c1', 'user', 'my secret salary', ?)", [at(5)]);
    await db.runAsync("INSERT INTO app_state (key, value, updated_at) VALUES ('portfolio-edit-key', 'EDIT-KEY-123', ?)", [at(5)]);
    await db.runAsync("INSERT INTO project_progress (project_id, course_id, steps_done, status, review_token, created_at, updated_at) VALUES ('p1', 'c', '[]', 'passed', 'SIGNED-TOKEN', ?, ?)", [at(5), at(5)]);
    const { text } = await snapshotOf(db, { settings: { learnerName: 'Ada' } });
    for (const secret of ['Private talk', 'my secret salary', 'EDIT-KEY-123', 'SIGNED-TOKEN', 'review_token', 'coach_', 'app_state', 'autoBackup']) expect(text).not.toContain(secret);
    expect(text).toContain('"p1"');
  });

  test('every backed-up setting is one the learner chose, and a backup carries nothing else', () => {
    expect(settingsForBackup({ ...initialSettingsState, autoBackup: false })).not.toHaveProperty('autoBackup');
    expect(Object.keys(settingsForBackup(initialSettingsState)).sort()).toEqual([...BACKED_UP_SETTINGS].sort());
  });

  test('hostile settings are cleaned: unknown keys dropped, bad values replaced by defaults', () => {
    const cleaned = cleanBackedUpSettings({
      language: 'klingon',
      appearance: 'dark',
      learnerName: `  ${'x'.repeat(500)}  `,
      goal: 'emperor',
      speechRate: 99,
      dailyReminderTime: { hour: 99, minute: -1 },
      reminderDays: [1, 1, 9, 'x'],
      dailyMinutes: -4,
      autoBackup: false,
      revenueCatId: 'abc',
      __proto__: { polluted: true },
    });
    expect(cleaned).toMatchObject({ language: 'fil', appearance: 'dark', goal: null, speechRate: 1.2, dailyReminderTime: { hour: 19, minute: 0 }, reminderDays: [1], dailyMinutes: null });
    expect((cleaned.learnerName ?? '').length).toBeLessThanOrEqual(60);
    expect(cleaned).not.toHaveProperty('autoBackup');
    expect(cleaned).not.toHaveProperty('revenueCatId');
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(cleanBackedUpSettings('nope')).toEqual({});
  });

  test('the chosen coach is backed up, and anything but Tali or Tala becomes Tali', () => {
    expect(cleanBackedUpSettings({ companion: 'tala' })).toEqual({ companion: 'tala' });
    expect(cleanBackedUpSettings({ companion: 'Tala' })).toEqual({ companion: 'tali' });
    expect(cleanBackedUpSettings({ companion: { name: 'x' } })).toEqual({ companion: 'tali' });
    expect(settingsForBackup({ ...initialSettingsState, companion: 'tala' })).toMatchObject({ companion: 'tala' });
  });

  test('every row is validated before anything is trusted', async () => {
    await seed(db, 'lesson_progress', [lesson('l1')]);
    const { text } = await snapshotOf(db);
    type Tables = Record<string, Record<string, unknown>[]>;
    const resign = async (mutate: (tables: Tables) => void) => {
      const copy = JSON.parse(text) as Record<string, unknown> & { tables: Tables };
      mutate(copy.tables);
      const body = { format: copy.format, version: copy.version, app: copy.app, schemaVersion: copy.schemaVersion, createdAt: copy.createdAt, platform: copy.platform, profileId: copy.profileId, settings: copy.settings, tables: copy.tables };
      copy.checksum = `sha256:${await nodeHash(canonicalJson(body))}`;
      return JSON.stringify(copy);
    };
    const bad: ((tables: Tables) => void)[] = [
      (t) => (t.lesson_progress[0].quiz_correct = 'four'),
      (t) => (t.lesson_progress[0].lesson_id = ''),
      (t) => (t.lesson_progress[0].task_done = 7),
      (t) => (t.lesson_progress[0].updated_at = 'yesterday'),
      (t) => (t.lesson_progress[0].course_id = 'x'.repeat(300_000)),
      (t) => delete t.lesson_progress[0].course_id,
      (t) => (t.lesson_progress = { not: 'an array' } as unknown as Record<string, unknown>[]),
      (t) => t.lesson_progress.push({ ...t.lesson_progress[0] }),
      (t) => t.lesson_progress.push(null as unknown as Record<string, unknown>),
      (t) => (t.certificates = [{ id: 'c', course_id: 'x', learner_name: 'A', issued_at: at(1), verify_url: 'javascript:alert(1)', created_at: at(1), updated_at: at(1) }]),
      (t) => (t.deleted_rows = [{ table_name: 'applications', row_id: 5, deleted_at: at(1) }]),
    ];
    for (const mutate of bad) expect(await parseBackup(await resign(mutate), nodeHash)).toEqual({ ok: false, reason: 'corrupted' });
    // An unrelated-table tombstone is ignored, not an error.
    const ok = await parseBackup(await resign((t) => (t.deleted_rows = [{ table_name: 'coach_chats', row_id: 'x', deleted_at: at(1) }])), nodeHash);
    expect(ok.ok && ok.backup.tombstones).toEqual([]);
  });

  test('a learner profile and its JSON answers survive a round trip', async () => {
    await seed(db, 'learner_profile', [learnerProfile({ goals: '["frontend"]', status: 'completed', completed_at: at(6), plan: '{"weeks":4}' })]);
    const backup = await parsedSnapshot(db);
    expect(backup.tables.learner_profile[0]).toMatchObject({ goals: '["frontend"]', plan: '{"weeks":4}', status: 'completed' });
  });
});
