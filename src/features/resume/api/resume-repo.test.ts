import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';

import { applyImport, clearVersion, deleteItem, readItem, readItems, readProfile, readProfilePhoto, readVersions, saveItem, saveProfile, saveProfilePhoto, saveVersion } from './resume-repo';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

const profile = { headline: 'Developer', email: ' ana@example.com ', phone: '', location: 'Manila', website: '', linkedin: '', github: 'ana', summary: 'Builds apps.', career_goal: '', level: '' };

describe('profile', () => {
  test('one row, saved twice; blanks become null', async () => {
    expect(await readProfile(db)).toBeNull();
    await saveProfile(db, profile);
    await saveProfile(db, { ...profile, headline: 'AI engineer' });
    expect(await readProfile(db)).toEqual({ headline: 'AI engineer', email: 'ana@example.com', phone: null, location: 'Manila', website: null, linkedin: null, github: 'ana', summary: 'Builds apps.', career_goal: null, level: null });
    expect(await db.getAllAsync('SELECT id FROM resume_profile')).toHaveLength(1);
  });
});

describe('profile picture', () => {
  test('none at first; setting it creates the profile row, and replacing or removing it keeps one row', async () => {
    expect(await readProfilePhoto(db)).toBeNull();
    await saveProfilePhoto(db, '/9j/first');
    expect(await readProfilePhoto(db)).toBe('/9j/first');
    await saveProfilePhoto(db, '/9j/second');
    expect(await readProfilePhoto(db)).toBe('/9j/second');
    await saveProfilePhoto(db, null);
    expect(await readProfilePhoto(db)).toBeNull();
    expect(await db.getAllAsync('SELECT id FROM resume_profile')).toHaveLength(1);
  });

  test('saving the profile form never touches the picture, and the picture never touches the form', async () => {
    await saveProfile(db, profile);
    await saveProfilePhoto(db, '/9j/picture');
    await saveProfile(db, { ...profile, headline: 'AI engineer' });
    expect(await readProfilePhoto(db)).toBe('/9j/picture');
    await saveProfilePhoto(db, null);
    expect(await readProfile(db)).toMatchObject({ headline: 'AI engineer', location: 'Manila' });
  });
});

describe('items', () => {
  const input = { id: 'item-1', kind: 'experience' as const, title: ' Support agent ', organization: 'Acme', startOn: '2022-01-01', endOn: null, description: '', location: '', link: '', datesText: null };

  test('saving the same form twice writes one row; edits update it; delete removes it', async () => {
    await saveItem(db, input);
    await saveItem(db, input);
    expect(await readItems(db)).toHaveLength(1);
    await saveItem(db, { ...input, title: 'Team lead', endOn: '2024-01-01' });
    expect(await readItem(db, 'item-1')).toMatchObject({ kind: 'experience', title: 'Team lead', organization: 'Acme', start_on: '2022-01-01', end_on: '2024-01-01', description: null, location: null, link: null, dates_text: null });
    await deleteItem(db, 'item-1');
    expect(await readItem(db, 'item-1')).toBeNull();
  });

  test('a row of an unknown kind is skipped, not shown', async () => {
    await db.runAsync("INSERT INTO resume_items (id, kind, title, sort, created_at, updated_at) VALUES ('x', 'hobby', 'Chess', 0, 'now', 'now')");
    expect(await readItems(db)).toEqual([]);
  });
});

describe('versions', () => {
  test('saved per goal, read back as lists, cleared on request', async () => {
    await saveVersion(db, 'freelance', { jobTitle: 'VA', summary: 'Sum', highlights: ['A'], keywords: ['K'] });
    await saveVersion(db, 'freelance', { jobTitle: 'Senior VA', summary: 'Sum 2', highlights: ['B'], keywords: [] });
    expect(await readVersions(db)).toEqual([{ goal: 'freelance', jobTitle: 'Senior VA', summary: 'Sum 2', highlights: ['B'], keywords: [] }]);
    await clearVersion(db, 'freelance');
    expect(await readVersions(db)).toEqual([]);
  });

  test('a damaged list reads as empty', async () => {
    await db.runAsync("INSERT INTO resume_versions (goal, highlights, keywords, updated_at) VALUES ('developer', 'not json', '[1, \"ok\"]', 'now')");
    expect(await readVersions(db)).toEqual([{ goal: 'developer', jobTitle: null, summary: null, highlights: [], keywords: ['ok'] }]);
  });
});

describe('the new columns', () => {
  test('a goal, a level, a place, a link and dates as written are saved and read back', async () => {
    await saveProfile(db, { ...profile, career_goal: 'A developer job', level: 'graduate' });
    expect(await readProfile(db)).toMatchObject({ career_goal: 'A developer job', level: 'graduate' });
    await saveItem(db, { id: 'i', kind: 'project', title: 'Site', organization: '', startOn: null, endOn: null, description: 'Made it', location: 'Remote', link: 'https://x.test', datesText: ' 2019 – 2020 ' });
    expect(await readItem(db, 'i')).toMatchObject({ location: 'Remote', link: 'https://x.test', dates_text: '2019 – 2020' });
  });

  test('picking real dates drops the dates as written', async () => {
    const base = { id: 'i', kind: 'project' as const, title: 'Site', organization: '', description: '', location: '', link: '' };
    await saveItem(db, { ...base, startOn: null, endOn: null, datesText: '2019' });
    await saveItem(db, { ...base, startOn: '2019-03-01', endOn: null, datesText: '2019' });
    expect(await readItem(db, 'i')).toMatchObject({ start_on: '2019-03-01', dates_text: null });
  });
});

describe('applyImport', () => {
  const item = (id: string, title: string) => ({ id, kind: 'skill' as const, title, organization: '', startOn: null, endOn: null, description: '', location: '', link: '', datesText: null });

  test('fills blank profile fields, never replaces filled ones, adds the entries once', async () => {
    await saveProfile(db, profile);
    const merge = { profile: { headline: 'Imported headline', phone: '+63 900', github: 'someone-else' }, items: [item('s1', 'Python'), item('s2', 'SQL')] };
    await applyImport(db, merge);
    await applyImport(db, merge);
    expect(await readProfile(db)).toMatchObject({ headline: 'Developer', phone: '+63 900', github: 'ana' });
    expect((await readItems(db)).map((entry) => entry.title).sort()).toEqual(['Python', 'SQL']);
  });

  test('works before any profile exists', async () => {
    await applyImport(db, { profile: { headline: 'Dev', email: 'a@b.c' }, items: [] });
    expect(await readProfile(db)).toMatchObject({ headline: 'Dev', email: 'a@b.c' });
  });
});
