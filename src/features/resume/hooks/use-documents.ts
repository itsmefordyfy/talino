import { useEffect, useRef } from 'react';

import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';
import { newId } from '@/lib/id';

import { applyImport, type ItemInput } from '../api/resume-repo';
import { convertVersions, createDocument, deleteDocument, duplicateDocument, listDocuments, readDocument, updateDocument, type DocumentPatch, type NewDocument } from '../api/document-repo';
import { contentFromMaster, mergeImported, versionToContent } from '../lib/master';
import type { ResumeContent } from '../lib/document';
import { isResumeLevel, type ResumeLevel } from '../lib/templates';
import { useProfilePhoto, useResumeSources } from './use-resume';

export const documentKeys = {
  list: ['resume', 'documents'] as const,
  one: (id: string) => ['resume', 'document', id] as const,
};

export function useDocuments() {
  return useDbQuery(documentKeys.list, listDocuments);
}

export function useDocument(id: string) {
  return useDbQuery(documentKeys.one(id), (db) => readDocument(db, id));
}

export function useCreateDocument() {
  return useDbMutation((db, input: NewDocument) => createDocument(db, input));
}

export function useUpdateDocument() {
  return useDbMutation((db, variables: { id: string; patch: DocumentPatch }) => updateDocument(db, variables.id, variables.patch));
}

export function useDuplicateDocument() {
  return useDbMutation((db, variables: { id: string; name: string }) => {
    const copy = newId();
    return duplicateDocument(db, variables.id, copy, variables.name).then((made) => (made ? copy : null));
  });
}

export function useDeleteDocument() {
  return useDbMutation((db, id: string) => deleteDocument(db, id));
}

/** Adds an imported résumé to the master profile. */
export function useApplyImport() {
  return useDbMutation((db, variables: { items: ItemInput[]; profile: Parameters<typeof applyImport>[1]['profile'] }) => applyImport(db, { profile: variables.profile, items: variables.items }));
}

/**
 * The master career profile as a résumé, ready to build a new one from. `null` until everything has loaded; the profile's
 * level and goal come with it.
 */
export function useMasterContent() {
  const sources = useResumeSources();
  const ready = !sources.isPending && !sources.isError;
  const photo = useProfilePhoto();
  const base = ready ? contentFromMaster({ name: sources.name, profile: sources.profile, items: sources.items, achievements: sources.achievements }) : null;
  // A new résumé starts with a copy of the profile picture, printed only if its style turns the picture on.
  const content = base && photo.data ? { ...base, photo: photo.data } : base;
  return {
    isPending: sources.isPending,
    isError: sources.isError,
    refetch: sources.refetch,
    content,
    level: (isResumeLevel(sources.profile?.level) ? sources.profile?.level : null) as ResumeLevel | null,
    goal: sources.profile?.career_goal ?? '',
    sources,
  };
}

/** What importing a résumé would add, from the master profile as it is now. */
export function previewImport(sources: ReturnType<typeof useResumeSources>, imported: ResumeContent) {
  return mergeImported({ profile: sources.profile, items: sources.items }, imported, newId);
}

/**
 * The old three goal versions become whole résumés, once, the first time the résumé list opens. Ids come from the goal, so a
 * second run (or a second screen) changes nothing.
 */
export function useConvertOldVersions(nameFor: (goal: string) => string) {
  const sources = useResumeSources();
  const convert = useDbMutation((db, variables: { base: ResumeContent }) =>
    convertVersions(db, (version) => versionToContent(variables.base, version), (goal) => nameFor(goal), (goal) => `legacy-${goal}`),
  );
  const tried = useRef(false);
  const waiting = !sources.isPending && !sources.isError && sources.versions.length > 0;
  const base = waiting ? contentFromMaster({ name: sources.name, profile: sources.profile, items: sources.items, achievements: sources.achievements }) : null;
  useEffect(() => {
    if (!base || tried.current) return;
    tried.current = true;
    convert.mutate({ base });
  }, [base, convert]);
}
