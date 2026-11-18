import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';

import { deleteArtifact, getArtifact, listArtifacts, listArtifactsForProject, saveArtifact, type SaveArtifactInput } from '../api/artifacts-repo';
import type { ArtifactKind } from '../types';

/** The learner's saved architecture work, newest first (one kind, or all). */
export const useArtifacts = (kind?: ArtifactKind) => useDbQuery(['architecture', 'artifacts', kind ?? 'all'], (db) => listArtifacts(db, kind));

export const useArtifact = (id: string | null) => useDbQuery(['architecture', 'artifact', id ?? 'none'], (db) => (id ? getArtifact(db, id) : Promise.resolve(null)), { enabled: id !== null });

export const useProjectArtifacts = (projectId: string) => useDbQuery(['architecture', 'project', projectId], (db) => listArtifactsForProject(db, projectId));

/** Saves one artifact; the result says whether it was refused (empty, too long, too many). */
export const useSaveArtifact = () => useDbMutation((db, input: SaveArtifactInput) => saveArtifact(db, input));

export const useDeleteArtifact = () => useDbMutation((db, id: string) => deleteArtifact(db, id));
