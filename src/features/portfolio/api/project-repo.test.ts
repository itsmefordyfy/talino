import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';

import { MAX_PROJECT_IMAGES, parseTech } from '../lib/projects';
import { deleteProject, listProjects, readProject, reorderProjects, saveProject } from './project-repo';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

const picture = (seed: string) => `/9j/${seed}${'A'.repeat(300)}`;
const input = (id: string, title = 'Queue app') => ({ id, title, summary: 'A queue number app', description: 'Residents take a number.\n\nBuilt in React Native.', role: 'Solo developer', tech: ['React Native', 'Expo'], url: 'barangay.example.com', repoUrl: 'https://github.com/ana/queue', images: [picture('a'), picture('b')] });

describe('portfolio projects', () => {
  test('saves, reads back, and saving twice with one id keeps one row in its place', async () => {
    await saveProject(db, input('p1'));
    await saveProject(db, input('p2', 'Second'));
    await saveProject(db, { ...input('p1', 'Queue app v2'), summary: 'Better' });
    const all = await listProjects(db);
    expect(all.map((project) => project.id)).toEqual(['p1', 'p2']);
    const first = await readProject(db, 'p1');
    expect(first).toMatchObject({ title: 'Queue app v2', summary: 'Better', role: 'Solo developer', tech: ['React Native', 'Expo'] });
    expect(first?.description).toContain('Built in React Native.');
    expect(first?.images).toHaveLength(2);
  });

  test('links are made into https addresses and a bad one is dropped', async () => {
    await saveProject(db, { ...input('p1'), repoUrl: 'not a link' });
    expect(await readProject(db, 'p1')).toMatchObject({ url: 'https://barangay.example.com/', repoUrl: null });
  });

  test('keeps at most four pictures', async () => {
    await saveProject(db, { ...input('p1'), images: ['a', 'b', 'c', 'd', 'e', 'f'].map(picture) });
    expect((await readProject(db, 'p1'))?.images).toHaveLength(MAX_PROJECT_IMAGES);
  });

  test('a damaged row opens as a plain project', async () => {
    await saveProject(db, input('p1'));
    await db.runAsync("UPDATE portfolio_projects SET images = 'oops', tech = '{' WHERE id = 'p1'");
    expect(await readProject(db, 'p1')).toMatchObject({ images: [], tech: [] });
  });

  test('delete removes the row and leaves a tombstone for a restore to respect', async () => {
    await saveProject(db, input('p1'));
    await deleteProject(db, 'p1');
    expect(await listProjects(db)).toEqual([]);
    expect(await db.getFirstAsync("SELECT row_id FROM deleted_rows WHERE table_name = 'portfolio_projects'")).toEqual({ row_id: 'p1' });
  });
});

describe('reorderProjects', () => {
  test('puts the named projects first, in that order, and keeps the rest after them', async () => {
    for (const id of ['a', 'b', 'c', 'd']) await saveProject(db, input(id, id.toUpperCase()));
    await reorderProjects(db, ['c', 'a']);
    expect((await listProjects(db)).map((project) => project.id)).toEqual(['c', 'a', 'b', 'd']);
    await reorderProjects(db, ['d', 'ghost', 'c', 'b', 'a']);
    expect((await listProjects(db)).map((project) => project.id)).toEqual(['d', 'c', 'b', 'a']);
  });
});

describe('parseTech', () => {
  test('splits on commas and line breaks, trims, ignores case repeats and caps the list', () => {
    expect(parseTech('React, Expo\nSupabase; react,  ')).toEqual(['React', 'Expo', 'Supabase']);
    expect(parseTech(Array.from({ length: 20 }, (_, index) => `t${index}`).join(','))).toHaveLength(12);
  });
});
