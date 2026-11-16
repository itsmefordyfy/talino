import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';

import { deleteProject, listProjects, readProject, reorderProjects, saveProject } from '../api/project-repo';
import type { ProjectInput } from '../lib/projects';

export const projectKeys = {
  list: ['portfolio', 'projects'] as const,
  one: (id: string) => ['portfolio', 'project', id] as const,
};

export function useProjects() {
  return useDbQuery(projectKeys.list, listProjects);
}

export function useProject(id: string) {
  return useDbQuery(projectKeys.one(id), (db) => readProject(db, id));
}

export function useSaveProject() {
  return useDbMutation((db, input: ProjectInput) => saveProject(db, input));
}

export function useDeleteProject() {
  return useDbMutation((db, id: string) => deleteProject(db, id));
}

export function useReorderProjects() {
  return useDbMutation((db, ids: string[]) => reorderProjects(db, ids));
}
