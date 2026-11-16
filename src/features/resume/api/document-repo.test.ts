import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';

import { parseContent } from '../lib/document';
import { defaultStyle } from '../lib/templates';
import { saveVersion } from './resume-repo';
import { convertVersions, createDocument, deleteDocument, duplicateDocument, listDocuments, readDocument, updateDocument } from './document-repo';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

const content = parseContent({ name: 'Ana', summary: 'Builds apps.', experience: [{ id: 'e1', title: 'Dev', bullets: ['Built X'] }] });
const make = (id: string, name = 'My résumé') => createDocument(db, { id, name, style: defaultStyle('graduate'), content, target: null });

describe('documents', () => {
  test('create, read back, and creating twice with one id writes one row', async () => {
    await make('d1');
    await make('d1');
    expect(await listDocuments(db)).toHaveLength(1);
    const doc = await readDocument(db, 'd1');
    expect(doc).toMatchObject({ id: 'd1', name: 'My résumé', target: null });
    expect(doc?.style).toEqual(defaultStyle('graduate'));
    expect(doc?.content).toEqual(content);
  });

  test('an update changes only what it names and moves the résumé to the top of the list', async () => {
    await make('d1', 'First');
    await new Promise((resolve) => setTimeout(resolve, 5));
    await make('d2', 'Second');
    await new Promise((resolve) => setTimeout(resolve, 5));
    await updateDocument(db, 'd1', { name: 'Renamed', target: { jobTitle: 'Dev', jobDescription: 'Build things', keywords: ['React'] } });
    const doc = await readDocument(db, 'd1');
    expect(doc).toMatchObject({ name: 'Renamed', target: { jobTitle: 'Dev', jobDescription: 'Build things', keywords: ['React'] } });
    expect(doc?.content).toEqual(content);
    expect((await listDocuments(db)).map((item) => item.id)).toEqual(['d1', 'd2']);
  });

  test('content and style are saved as given and read back checked', async () => {
    await make('d1');
    const next = parseContent({ ...content, summary: 'New summary.' });
    await updateDocument(db, 'd1', { content: next, style: { ...defaultStyle('modern'), paper: 'a4' } });
    const doc = await readDocument(db, 'd1');
    expect(doc?.content.summary).toBe('New summary.');
    expect(doc?.style).toMatchObject({ template: 'modern', paper: 'a4' });
  });

  test('a damaged row reads as an empty résumé in the default style, not a crash', async () => {
    await db.runAsync("INSERT INTO resume_documents (id, name, template, style, content, target, created_at, updated_at) VALUES ('bad', 'Bad', 'nonsense', 'not json', '{{', 'x', 'now', 'now')");
    const doc = await readDocument(db, 'bad');
    expect(doc?.content).toEqual(parseContent({}));
    expect(doc?.style).toEqual(defaultStyle('modern'));
    expect(doc?.target).toBeNull();
  });

  test('duplicate makes an independent copy', async () => {
    await make('d1', 'Original');
    await duplicateDocument(db, 'd1', 'd2', 'Original (copy)');
    await updateDocument(db, 'd2', { content: parseContent({ name: 'Changed' }) });
    expect((await readDocument(db, 'd1'))?.content).toEqual(content);
    expect((await readDocument(db, 'd2'))?.name).toBe('Original (copy)');
    expect(await duplicateDocument(db, 'missing', 'd3', 'x')).toBe(false);
  });

  test('delete removes it and leaves a tombstone so a restore cannot bring it back', async () => {
    await make('d1');
    await deleteDocument(db, 'd1');
    expect(await readDocument(db, 'd1')).toBeNull();
    expect(await db.getAllAsync('SELECT table_name, row_id FROM deleted_rows WHERE table_name = ?', ['resume_documents'])).toEqual([{ table_name: 'resume_documents', row_id: 'd1' }]);
  });
});

describe('convertVersions', () => {
  test('each old goal version becomes a document and is removed; running it again does nothing', async () => {
    await saveVersion(db, 'freelance', { jobTitle: 'VA', summary: 'Sum', highlights: ['A'], keywords: ['K'] });
    await saveVersion(db, 'developer', { jobTitle: null, summary: null, highlights: [], keywords: [] });
    const made = await convertVersions(db, (version) => parseContent({ name: 'Ana', headline: version.jobTitle ?? '' }), (goal) => `${goal} résumé`, (goal) => `legacy-${goal}`);
    expect(made).toBe(2);
    expect((await listDocuments(db)).map((doc) => doc.name).sort()).toEqual(['developer résumé', 'freelance résumé']);
    expect(await db.getAllAsync('SELECT goal FROM resume_versions')).toEqual([]);
    expect(await convertVersions(db, () => parseContent({}), (goal) => goal, (goal) => goal)).toBe(0);
  });
});
