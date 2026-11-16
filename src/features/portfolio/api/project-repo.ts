import type { SQLiteDatabase } from 'expo-sqlite';

import { nowTimestamp } from '@/lib/id';

import { MAX_PROJECT_IMAGES, parseImages, parseTags, projectLink, type PortfolioProject, type ProjectInput } from '../lib/projects';

type Row = { id: string; title: string; summary: string; description: string; role: string; tech: string; url: string | null; repo_url: string | null; images: string; sort: number; created_at: string; updated_at: string };

const SELECT = 'SELECT id, title, summary, description, role, tech, url, repo_url, images, sort, created_at, updated_at FROM portfolio_projects';

/** Everything read back is checked again, so a damaged row opens as a plain project instead of crashing the screen. */
const fromRow = (row: Row): PortfolioProject => ({
  id: row.id,
  title: row.title,
  summary: row.summary ?? '',
  description: row.description ?? '',
  role: row.role ?? '',
  tech: parseTags(row.tech),
  url: row.url,
  repoUrl: row.repo_url,
  images: parseImages(row.images),
  sort: row.sort ?? 0,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export async function listProjects(db: SQLiteDatabase): Promise<PortfolioProject[]> {
  return (await db.getAllAsync<Row>(`${SELECT} ORDER BY sort ASC, created_at ASC`)).map(fromRow);
}

export async function readProject(db: SQLiteDatabase, id: string): Promise<PortfolioProject | null> {
  const row = await db.getFirstAsync<Row>(`${SELECT} WHERE id = ?`, id);
  return row ? fromRow(row) : null;
}

/**
 * Adds or updates one project by the id made when the form opened, so a second tap on Save changes the same row. A new
 * project goes last; an edit keeps its place and its created time.
 */
export async function saveProject(db: SQLiteDatabase, input: ProjectInput): Promise<void> {
  const now = nowTimestamp();
  const next = ((await db.getFirstAsync<{ top: number | null }>('SELECT MAX(sort) AS top FROM portfolio_projects'))?.top ?? -1) + 1;
  await db.runAsync(
    `INSERT INTO portfolio_projects (id, title, summary, description, role, tech, url, repo_url, images, sort, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET title = excluded.title, summary = excluded.summary, description = excluded.description, role = excluded.role, tech = excluded.tech,
       url = excluded.url, repo_url = excluded.repo_url, images = excluded.images, updated_at = excluded.updated_at`,
    input.id,
    input.title.trim(),
    input.summary.trim(),
    input.description.trim(),
    input.role.trim(),
    JSON.stringify(input.tech),
    projectLink(input.url),
    projectLink(input.repoUrl),
    JSON.stringify(input.images.slice(0, MAX_PROJECT_IMAGES)),
    next,
    now,
    now,
  );
}

/** A project has no dependents, so a plain delete is complete (the trigger leaves the tombstone). */
export async function deleteProject(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM portfolio_projects WHERE id = ?', id);
}

/** Puts the projects in the given order (first id first). Ids that aren't the learner's are ignored and projects not named keep their place after the named ones. */
export async function reorderProjects(db: SQLiteDatabase, ids: readonly string[]): Promise<void> {
  const now = nowTimestamp();
  await db.withTransactionAsync(async () => {
    for (const [index, id] of ids.entries()) await db.runAsync('UPDATE portfolio_projects SET sort = ?, updated_at = ? WHERE id = ?', index, now, id);
    // Anything not named follows, in the order it had.
    const rest = await db.getAllAsync<{ id: string }>('SELECT id FROM portfolio_projects WHERE sort >= ? AND id NOT IN (' + (ids.length ? ids.map(() => '?').join(',') : "''") + ') ORDER BY sort ASC, created_at ASC', ids.length, ...ids);
    for (const [offset, row] of rest.entries()) await db.runAsync('UPDATE portfolio_projects SET sort = ? WHERE id = ?', ids.length + offset, row.id);
  });
}
