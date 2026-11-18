import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { createTestDatabase } from '@/db/testing/node-database';
import { deleteAllData } from '@/features/settings/api/reset';

import { MAX_ARTIFACT_CONTENT, MAX_ARTIFACTS_PER_KIND } from '../types';
import { deleteArtifact, getArtifact, listArtifacts, listArtifactsForProject, saveArtifact } from './artifacts-repo';

let db: Awaited<ReturnType<typeof createTestDatabase>>;
beforeEach(async () => {
  db = await createTestDatabase();
});
afterEach(() => db.close());

describe('saved architecture artifacts', () => {
  test('saving the same id twice updates one row and keeps the first creation time', async () => {
    expect(await saveArtifact(db, { id: 'a1', kind: 'diagram', title: 'Context', content: 'C4Context\n  System(a, "A")' })).toEqual({ ok: true });
    const first = await getArtifact(db, 'a1');
    await new Promise((resolve) => setTimeout(resolve, 5));
    expect(await saveArtifact(db, { id: 'a1', kind: 'diagram', title: 'Context v2', content: 'C4Context\n  System(a, "B")' })).toEqual({ ok: true });
    const rows = await listArtifacts(db);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ title: 'Context v2', createdAt: first!.createdAt });
    expect(rows[0]!.updatedAt >= first!.updatedAt).toBe(true);
  });

  test('refuses empty content, content that is too long and a bad kind, and trims the title', async () => {
    expect(await saveArtifact(db, { id: 'a1', kind: 'adr', title: 'x', content: '   ' })).toEqual({ ok: false, reason: 'empty' });
    expect(await saveArtifact(db, { id: 'a1', kind: 'adr', title: 'x', content: 'y'.repeat(MAX_ARTIFACT_CONTENT + 1) })).toEqual({ ok: false, reason: 'too_long' });
    expect(await saveArtifact(db, { id: 'a1', kind: 'nope' as 'adr', title: 'x', content: 'y' })).toEqual({ ok: false, reason: 'bad_kind' });
    await saveArtifact(db, { id: 'a2', kind: 'adr', title: '   ', content: '{"title":"t"}' });
    expect((await getArtifact(db, 'a2'))!.title).toBe('Untitled');
  });

  test('a new row past the per-kind limit is refused, an update is not', async () => {
    for (let i = 0; i < MAX_ARTIFACTS_PER_KIND; i += 1) expect((await saveArtifact(db, { id: `m${i}`, kind: 'matrix', title: `m${i}`, content: '{}' })).ok).toBe(true);
    expect(await saveArtifact(db, { id: 'extra', kind: 'matrix', title: 'x', content: '{}' })).toEqual({ ok: false, reason: 'limit' });
    expect(await saveArtifact(db, { id: 'm0', kind: 'matrix', title: 'changed', content: '{}' })).toEqual({ ok: true });
    expect(await saveArtifact(db, { id: 'd0', kind: 'diagram', title: 'other kind is separate', content: 'flowchart TD\n A-->B' })).toEqual({ ok: true });
  });

  test('lists by kind and by project, newest first', async () => {
    await saveArtifact(db, { id: 'a', kind: 'diagram', title: 'A', content: 'x', projectId: 'software-architecture-ai-p1' });
    await new Promise((resolve) => setTimeout(resolve, 5));
    await saveArtifact(db, { id: 'b', kind: 'adr', title: 'B', content: '{}', projectId: 'software-architecture-ai-p1' });
    await saveArtifact(db, { id: 'c', kind: 'adr', title: 'C', content: '{}' });
    expect((await listArtifacts(db, 'adr')).map((row) => row.id).sort()).toEqual(['b', 'c']);
    expect((await listArtifactsForProject(db, 'software-architecture-ai-p1')).map((row) => row.id)).toEqual(['b', 'a']);
  });

  test('deleting leaves a tombstone, and "delete all data" clears the table', async () => {
    await saveArtifact(db, { id: 'a', kind: 'diagram', title: 'A', content: 'x' });
    await deleteArtifact(db, 'a');
    expect(await listArtifacts(db)).toEqual([]);
    const tomb = await db.getFirstAsync<{ row_id: string }>("SELECT row_id FROM deleted_rows WHERE table_name = 'architecture_artifacts'");
    expect(tomb?.row_id).toBe('a');
    await saveArtifact(db, { id: 'b', kind: 'adr', title: 'B', content: '{}' });
    await deleteAllData(db);
    expect(await listArtifacts(db)).toEqual([]);
  });
});
