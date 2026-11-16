import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';
import { certificateStrings, readCertificates } from '@/features/certificates';
import { badgeDefinitions, COURSES, useLearning } from '@/features/courses';
import { isValidLink, parseSubmission } from '@/features/projects';
import { selectLearnerName } from '@/features/settings/settings-slice';
import { useLocalized } from '@/hooks/use-strings';
import { useAppSelector } from '@/store/hooks';

import { clearVersion, deleteItem, readItem, readItems, readProfile, readProfilePhoto, readVersions, saveItem, saveProfile, saveProfilePhoto, saveVersion, type ItemInput, type ProfileInput } from '../api/resume-repo';
import { collectAchievements } from '../lib/achievements';
import { buildResume, type ResumeData } from '../lib/build-resume';
import type { Achievements, ResumeGoal, ResumeVersion } from '../types';

export const resumeKeys = {
  profile: ['resume', 'profile'] as const,
  photo: ['resume', 'photo'] as const,
  items: ['resume', 'items'] as const,
  item: (id: string) => ['resume', 'item', id] as const,
  versions: ['resume', 'versions'] as const,
};

/** The same key and read as the certificate screen, so both share one cached list. */
const certificatesKey = ['certificates'] as const;

export function useResumeProfile() {
  return useDbQuery(resumeKeys.profile, readProfile);
}

export function useProfilePhoto() {
  return useDbQuery(resumeKeys.photo, readProfilePhoto);
}

/** Set the profile picture, or remove it with null. */
export function useSaveProfilePhoto() {
  return useDbMutation((db, photo: string | null) => saveProfilePhoto(db, photo));
}

export function useResumeItem(id: string) {
  return useDbQuery(resumeKeys.item(id), (db) => readItem(db, id));
}

/** What the learner has done in Talino: passed projects, certificates, learned skills, badges. */
export function useAchievements() {
  const learning = useLearning();
  const certificates = useDbQuery(certificatesKey, readCertificates);
  const masterTitle = useLocalized(certificateStrings).master;
  const ready = !!learning.data && !!certificates.data;
  const titles = new Map(badgeDefinitions(COURSES).map((badge) => [badge.id, badge.title]));
  const achievements: Achievements | null = ready
    ? collectAchievements({
        courses: COURSES,
        progress: learning.progress,
        passedProjects: (learning.data?.projects ?? [])
          .filter((row) => row.status === 'passed')
          .map((row) => {
            const link = parseSubmission(row.submission).link;
            return { projectId: row.project_id, courseId: row.course_id, link: isValidLink(link) ? link.trim() : null, reviewedAt: row.reviewed_at };
          }),
        certificates: certificates.data ?? [],
        badges: learning.badges.flatMap((row) => {
          const title = titles.get(row.badge_id);
          return title ? [{ id: row.badge_id, title }] : [];
        }),
        masterTitle,
      })
    : null;
  return {
    isPending: learning.isPending || certificates.isPending,
    isError: learning.isError || certificates.isError,
    refetch: () => {
      void learning.refetch();
      void certificates.refetch();
    },
    achievements,
  };
}

/** Everything a résumé, portfolio or template is made from, with one loading and error state. */
export function useResumeSources() {
  const name = useAppSelector(selectLearnerName);
  const profile = useResumeProfile();
  const items = useDbQuery(resumeKeys.items, readItems);
  const versions = useDbQuery(resumeKeys.versions, readVersions);
  const achievements = useAchievements();
  const ready = profile.data !== undefined && !!items.data && !!versions.data && !!achievements.achievements;
  return {
    isPending: profile.isPending || items.isPending || versions.isPending || achievements.isPending,
    isError: profile.isError || items.isError || versions.isError || achievements.isError,
    refetch: () => {
      void profile.refetch();
      void items.refetch();
      void versions.refetch();
      achievements.refetch();
    },
    name,
    profile: profile.data ?? null,
    items: items.data ?? [],
    versions: versions.data ?? [],
    achievements: achievements.achievements,
    /** The résumé for a goal; null until everything has loaded. */
    build: (goal: ResumeGoal): ResumeData | null =>
      ready && achievements.achievements
        ? buildResume({ goal, name, profile: profile.data ?? null, items: items.data ?? [], achievements: achievements.achievements, version: versions.data?.find((version) => version.goal === goal) ?? null })
        : null,
  };
}

export function useSaveProfile() {
  return useDbMutation((db, input: ProfileInput) => saveProfile(db, input));
}

export function useSaveItem() {
  return useDbMutation((db, input: ItemInput) => saveItem(db, input));
}

export function useDeleteItem() {
  return useDbMutation((db, id: string) => deleteItem(db, id));
}

export function useSaveVersion() {
  return useDbMutation((db, version: ResumeVersion) => saveVersion(db, version.goal, version));
}

export function useClearVersion() {
  return useDbMutation((db, goal: ResumeGoal) => clearVersion(db, goal));
}
