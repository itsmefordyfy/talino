import { useQueryClient } from '@tanstack/react-query';

import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';
import { createSerialQueue } from '@/lib/serial-queue';

import { readProfile, saveProfile, type ProfilePatch } from '../api/profile-repo';
import { effectiveExperience } from '../lib/assessment';
import type { ExperienceLevel } from '../lib/options';
import { cleanProfile, type StoredProfile } from '../lib/profile';

// This file imports nothing from `features/courses`, so the lesson and project screens (which live there) can read the learner's level
// without a circular import through the onboarding feature's index.

export const profileKey = ['learner-profile'] as const;

/** The saved learner profile; `data` is null until onboarding has saved its first answer. */
export function useProfile() {
  return useDbQuery(profileKey, readProfile);
}

const saveQueue = createSerialQueue();

/**
 * Saves some answers. It doesn't say "data changed" (no backup or reminder reads the profile), and it never touches progress.
 * Two things keep quick edits from being lost (Learning profile saves on every tap): saves run one at a time (two overlapping
 * transactions on the one connection made the second fail), and the saved profile is updated on screen at once, so the next tap
 * builds on the answer just given instead of on the one from before the save finished.
 */
export function useSaveProfile() {
  const queryClient = useQueryClient();
  const mutation = useDbMutation((db, patch: ProfilePatch) => saveQueue(() => saveProfile(db, patch)), { notify: false });
  return {
    ...mutation,
    mutate: (patch: ProfilePatch, options?: Parameters<typeof mutation.mutate>[1]) => {
      // The same cleaning the repo does, so what shows now is what will be read back (the refetch after the save replaces it).
      queryClient.setQueryData<StoredProfile | null>(profileKey, (old) => (old ? { ...old, ...cleanProfile({ ...old, ...patch }), ...(patch.step !== undefined ? { step: patch.step } : {}), ...(patch.status ? { status: patch.status } : {}) } : old));
      mutation.mutate(patch, options);
    },
  };
}

export type LearnerLevel = {
  /** The level lessons adapt to: what the learner chose, raised or lowered by a saved skill check. Null when no level was ever chosen. */
  level: ExperienceLevel | null;
  /** What the learner chose themselves. */
  declared: ExperienceLevel | null;
  isPending: boolean;
};

/**
 * The level every lesson, project and recommendation adapts to. `null` (onboarding skipped) means "show the shared content only", never
 * a guess; the learner can always choose a level or Show everything. A level only changes what is shown: it never locks anything.
 */
export function useLearnerLevel(): LearnerLevel {
  const query = useProfile();
  const declared = query.data?.experience ?? null;
  const level = declared ? effectiveExperience(declared, query.data?.assessment?.level ?? null) : null;
  return { level, declared, isPending: query.isPending };
}
