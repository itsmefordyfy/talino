import type { SQLiteDatabase } from 'expo-sqlite';

import { nowTimestamp } from '@/lib/id';

import { oneLine, parseContent, type ResumeContent } from '../lib/document';
import { defaultStyle, parseStyle, type ResumeStyle } from '../lib/templates';
import type { ResumeVersion } from '../types';
import { clearVersion, readVersions } from './resume-repo';

/** The job a résumé was made for: what the learner pasted (on this phone only), and the terms the AI found in it. */
export type DocTarget = { jobTitle: string; jobDescription: string; keywords: string[] };

export type ResumeDocument = {
  id: string;
  name: string;
  style: ResumeStyle;
  content: ResumeContent;
  target: DocTarget | null;
  created_at: string;
  updated_at: string;
};

type Row = { id: string; name: string; template: string; style: string; content: string; target: string | null; created_at: string; updated_at: string };

function parseJson(text: string | null): unknown {
  try {
    return JSON.parse(text ?? 'null');
  } catch {
    return null;
  }
}

function parseTarget(text: string | null): DocTarget | null {
  const raw = parseJson(text);
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  const keywords = (Array.isArray(record.keywords) ? record.keywords : []).filter((item): item is string => typeof item === 'string').map((item) => oneLine(item, 60)).filter(Boolean).slice(0, 12);
  const target = { jobTitle: oneLine(record.jobTitle, 120), jobDescription: typeof record.jobDescription === 'string' ? record.jobDescription.slice(0, 8000) : '', keywords };
  return target.jobTitle || target.jobDescription || keywords.length > 0 ? target : null;
}

/** Every value read back is checked, so a damaged row opens as an empty résumé instead of crashing the screen. */
function fromRow(row: Row): ResumeDocument {
  return {
    id: row.id,
    name: row.name,
    style: parseStyle(parseJson(row.style), row.template),
    content: parseContent(parseJson(row.content)),
    target: parseTarget(row.target),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

const SELECT = 'SELECT id, name, template, style, content, target, created_at, updated_at FROM resume_documents';

/** Most recently changed first. */
export async function listDocuments(db: SQLiteDatabase): Promise<ResumeDocument[]> {
  return (await db.getAllAsync<Row>(`${SELECT} ORDER BY updated_at DESC, created_at DESC`)).map(fromRow);
}

export async function readDocument(db: SQLiteDatabase, id: string): Promise<ResumeDocument | null> {
  const row = await db.getFirstAsync<Row>(`${SELECT} WHERE id = ?`, id);
  return row ? fromRow(row) : null;
}

export type NewDocument = { id: string; name: string; style: ResumeStyle; content: ResumeContent; target: DocTarget | null };

/** `INSERT OR IGNORE` on the id made when the screen opened, so a double tap makes one résumé. */
export async function createDocument(db: SQLiteDatabase, input: NewDocument): Promise<void> {
  const now = nowTimestamp();
  await db.runAsync(
    'INSERT OR IGNORE INTO resume_documents (id, name, template, style, content, target, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    input.id,
    input.name.trim() || 'Résumé',
    input.style.template,
    JSON.stringify(input.style),
    JSON.stringify(input.content),
    input.target ? JSON.stringify(input.target) : null,
    now,
    now,
  );
}

export type DocumentPatch = Partial<{ name: string; style: ResumeStyle; content: ResumeContent; target: DocTarget | null }>;

/** Changes only what the patch names; every change moves the résumé to the top of the list. */
export async function updateDocument(db: SQLiteDatabase, id: string, patch: DocumentPatch): Promise<void> {
  const sets: string[] = [];
  const values: (string | null)[] = [];
  if (patch.name !== undefined) {
    sets.push('name = ?');
    values.push(patch.name.trim() || 'Résumé');
  }
  if (patch.style !== undefined) {
    sets.push('template = ?', 'style = ?');
    values.push(patch.style.template, JSON.stringify(patch.style));
  }
  if (patch.content !== undefined) {
    sets.push('content = ?');
    values.push(JSON.stringify(patch.content));
  }
  if (patch.target !== undefined) {
    sets.push('target = ?');
    values.push(patch.target ? JSON.stringify(patch.target) : null);
  }
  if (sets.length === 0) return;
  await db.runAsync(`UPDATE resume_documents SET ${sets.join(', ')}, updated_at = ? WHERE id = ?`, ...values, nowTimestamp(), id);
}

/** False when there is nothing to copy. */
export async function duplicateDocument(db: SQLiteDatabase, id: string, newId: string, name: string): Promise<boolean> {
  const original = await readDocument(db, id);
  if (!original) return false;
  await createDocument(db, { id: newId, name, style: original.style, content: original.content, target: original.target });
  return true;
}

/** A résumé has no dependents, so a plain delete is complete (the trigger leaves the tombstone). */
export async function deleteDocument(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM resume_documents WHERE id = ?', id);
}

/**
 * The old three goal versions (one tailored title, summary and highlights each) become whole documents once, so nothing the
 * learner tailored is lost. Each version is converted and removed in one transaction; with none left this does nothing. The
 * document's id comes from its goal, so two screens running this at once still make one.
 * Returns how many versions were converted.
 */
export async function convertVersions(db: SQLiteDatabase, contentFor: (version: ResumeVersion) => ResumeContent, nameFor: (goal: ResumeVersion['goal']) => string, idFor: (goal: ResumeVersion['goal']) => string): Promise<number> {
  const versions = await readVersions(db);
  for (const version of versions) {
    await db.withTransactionAsync(async () => {
      await createDocument(db, { id: idFor(version.goal), name: nameFor(version.goal), style: defaultStyle('modern'), content: contentFor(version), target: null });
      await clearVersion(db, version.goal);
    });
  }
  return versions.length;
}
