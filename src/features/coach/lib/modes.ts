import { COURSES } from '@/features/courses/content';
import type { Language } from '@/lib/i18n';

import { MODE_TEXT_FIL } from './mode-strings';

/** Tali's specialties open to everyone (the business plan: freelancing and AI engineering on every course). */
export const OPEN_MODES = ['general', 'freelancing', 'ai-engineering'] as const;
export type OpenMode = (typeof OPEN_MODES)[number];

/** A course role's mode id is its `coachRole.id` (mock-interviewer, proposal-reviewer…). */
export type CoachMode = OpenMode | string;

export type ModeInfo = { id: CoachMode; label: string; description: string; icon: string; courseId: string | null };

const OPEN_INFO: Record<OpenMode, Omit<ModeInfo, 'id' | 'courseId'>> = {
  general: { label: 'Career coach', description: 'Your AI career in tech: what to learn, what to build, what to do next.', icon: 'forum' },
  freelancing: { label: 'Freelancing', description: 'Clients on Upwork, OnlineJobs.ph and Fiverr, proposals, pricing, contracts, getting paid.', icon: 'work' },
  'ai-engineering': { label: 'AI engineering', description: 'Calling AI models from code, prompts, RAG, agents, testing AI features, the path to an AI engineer job.', icon: 'smart_toy' },
};

/**
 * Every mode: the open three, then one per course with a coach role. `language` picks the label and description shown to
 * the learner (English by default, which is also what the model prompt uses); ids never change.
 */
export function allModes(language: Language = 'en'): ModeInfo[] {
  const open = OPEN_MODES.map((id) => ({ id, courseId: null, ...OPEN_INFO[id] }));
  const roles = COURSES.flatMap((course) => (course.coachRole ? [{ id: course.coachRole.id, label: course.coachRole.label, description: course.coachRole.description, icon: course.icon, courseId: course.id }] : []));
  return [...open, ...roles].map((mode) => ({ ...mode, ...(language === 'fil' ? MODE_TEXT_FIL[mode.id] : undefined) }));
}

export function modeInfo(id: unknown, language: Language = 'en'): ModeInfo | null {
  return allModes(language).find((mode) => mode.id === id) ?? null;
}

/** The course a role belongs to (null for the open modes): owning it, or All-Access, opens the role. */
export function courseForMode(id: CoachMode): string | null {
  return modeInfo(id)?.courseId ?? null;
}
