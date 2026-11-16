import { JOURNEY_CERTIFICATE_ID, JOURNEY_CERTIFICATE_PROGRAM, JOURNEY_CERTIFICATE_TITLE } from '@/features/certificates/lib/journey-certificate';

import type { Achievements } from '../types';

/** A course skill counts on a résumé once its meter reaches this (the spec's 0.6). */
export const SKILL_MIN_FRACTION = 0.6;

/** The career tracker's badges say how a job hunt is going: the learner's business, never an employer's. */
const PRIVATE_BADGES = new Set(['first-application', 'first-interview', 'first-win', 'first-income']);

export type AchievementInput = {
  courses: readonly { id: string; title: string; projects: readonly { id: string; title: string; summary: string }[] }[];
  progress: readonly { courseId: string; started: boolean; fraction: number; skills: readonly { label: string; fraction: number }[] }[];
  passedProjects: readonly { projectId: string; courseId: string; link: string | null; reviewedAt: string | null }[];
  certificates: readonly { course_id: string; issued_at: string; verify_url: string | null }[];
  badges: readonly { id: string; title: string }[];
  /** The Talino Master certificate's title (it has no course). */
  masterTitle: string;
};

/** Case-insensitive de-duplication that keeps the first spelling. */
export function uniqueText(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    const key = trimmed.toLowerCase();
    if (!trimmed || seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }
  return result;
}

/** What the learner has done in Talino, in the order a reader should see it (earliest work first). */
export function collectAchievements(input: AchievementInput): Achievements {
  const courseById = new Map(input.courses.map((course) => [course.id, course]));

  const projects = [...input.passedProjects]
    .sort((a, b) => (a.reviewedAt ?? '').localeCompare(b.reviewedAt ?? ''))
    .flatMap((row) => {
      const course = courseById.get(row.courseId);
      const project = course?.projects.find((entry) => entry.id === row.projectId);
      return course && project ? [{ title: project.title, course: course.title, summary: project.summary, link: row.link }] : [];
    });

  const certificates = [...input.certificates]
    .sort((a, b) => a.issued_at.localeCompare(b.issued_at))
    .flatMap((row) => {
      const title = row.course_id === 'master' ? input.masterTitle : row.course_id === JOURNEY_CERTIFICATE_ID ? `${JOURNEY_CERTIFICATE_TITLE}, ${JOURNEY_CERTIFICATE_PROGRAM}` : courseById.get(row.course_id)?.title;
      return title ? [{ title, issued: row.issued_at.slice(0, 10), url: row.verify_url }] : [];
    });

  const skills = uniqueText(input.progress.flatMap((entry) => entry.skills.filter((skill) => skill.fraction >= SKILL_MIN_FRACTION - 1e-9).map((skill) => skill.label)));

  const started = input.progress.filter((entry) => entry.started);
  const furthest = started.reduce<(typeof started)[number] | null>((best, entry) => (!best || entry.fraction > best.fraction ? entry : best), null);

  return {
    projects,
    certificates,
    skills,
    badges: input.badges.filter((badge) => !PRIVATE_BADGES.has(badge.id)),
    currentCourse: furthest ? (courseById.get(furthest.courseId)?.title ?? null) : null,
  };
}
