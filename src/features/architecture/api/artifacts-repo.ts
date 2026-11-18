import type { SQLiteDatabase } from 'expo-sqlite';

import { nowTimestamp } from '@/lib/id';

import { ARTIFACT_KINDS, MAX_ARTIFACT_CONTENT, MAX_ARTIFACT_TITLE, MAX_ARTIFACTS_PER_KIND, isArtifactKind, type Artifact, type ArtifactKind } from '../types';

type Row = { id: string; kind: string; title: string; content: string; project_id: string | null; created_at: string; updated_at: string };

const toArtifact = (row: Row): Artifact | null =>
  isArtifactKind(row.kind) ? { id: row.id, kind: row.kind, title: row.title, content: row.content, projectId: row.project_id, createdAt: row.created_at, updatedAt: row.updated_at } : null;

export type SaveArtifactInput = { id: string; kind: ArtifactKind; title: string; content: string; projectId?: string | null };
export type SaveArtifactResult = { ok: true } | { ok: false; reason: 'empty' | 'too_long' | 'limit' | 'bad_kind' };

/**
 * Saves a diagram, record or matrix, once per id: the id is made on the phone when the tool opens, so a retry or a double tap updates the same row and never
 * duplicates it. A change keeps the original `created_at`. Refuses empty content, content over the limit, and a new row past the per-kind limit (an update is always allowed).
 */
export async function saveArtifact(db: SQLiteDatabase, input: SaveArtifactInput): Promise<SaveArtifactResult> {
  if (!isArtifactKind(input.kind)) return { ok: false, reason: 'bad_kind' };
  const content = input.content.trim();
  const title = input.title.trim().slice(0, MAX_ARTIFACT_TITLE) || 'Untitled';
  if (content.length === 0) return { ok: false, reason: 'empty' };
  if (content.length > MAX_ARTIFACT_CONTENT) return { ok: false, reason: 'too_long' };
  const existing = await db.getFirstAsync<{ id: string }>('SELECT id FROM architecture_artifacts WHERE id = ?', input.id);
  if (!existing) {
    const count = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM architecture_artifacts WHERE kind = ?', input.kind);
    if ((count?.n ?? 0) >= MAX_ARTIFACTS_PER_KIND) return { ok: false, reason: 'limit' };
  }
  const now = nowTimestamp();
  await db.runAsync(
    `INSERT INTO architecture_artifacts (id, kind, title, content, project_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET kind = excluded.kind, title = excluded.title, content = excluded.content, project_id = excluded.project_id, updated_at = excluded.updated_at`,
    input.id,
    input.kind,
    title,
    content,
    input.projectId ?? null,
    now,
    now,
  );
  return { ok: true };
}

/** The newest first; one kind or all. */
export async function listArtifacts(db: SQLiteDatabase, kind?: ArtifactKind): Promise<Artifact[]> {
  const rows = kind
    ? await db.getAllAsync<Row>('SELECT * FROM architecture_artifacts WHERE kind = ? ORDER BY updated_at DESC, id', kind)
    : await db.getAllAsync<Row>('SELECT * FROM architecture_artifacts ORDER BY updated_at DESC, id');
  return rows.map(toArtifact).filter((artifact): artifact is Artifact => artifact !== null);
}

export async function getArtifact(db: SQLiteDatabase, id: string): Promise<Artifact | null> {
  const row = await db.getFirstAsync<Row>('SELECT * FROM architecture_artifacts WHERE id = ?', id);
  return row ? toArtifact(row) : null;
}

export async function listArtifactsForProject(db: SQLiteDatabase, projectId: string): Promise<Artifact[]> {
  const rows = await db.getAllAsync<Row>('SELECT * FROM architecture_artifacts WHERE project_id = ? ORDER BY updated_at DESC, id', projectId);
  return rows.map(toArtifact).filter((artifact): artifact is Artifact => artifact !== null);
}

/** Deleting leaves a tombstone (a trigger), so a restored backup never brings it back. */
export async function deleteArtifact(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM architecture_artifacts WHERE id = ?', id);
}

export { ARTIFACT_KINDS };
