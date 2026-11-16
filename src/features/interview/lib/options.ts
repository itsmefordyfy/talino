/**
 * What a learner chooses before a mock interview, and the numbers that follow from it. Pure (no React, no native modules):
 * the screens, the server route and the tests all read the same lists, so an id the app sends is checked against the one
 * list and nothing the model or a modified app says can add an option.
 */

import { companionOf, DEFAULT_COMPANION, type CompanionId } from '@/features/companion/lib/companions';
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '@/lib/language';

export const INTERVIEW_TYPES = ['general', 'technical', 'behavioral', 'hr', 'software', 'react-native', 'ai-developer', 'freelance-client', 'leadership'] as const;
export type InterviewType = (typeof INTERVIEW_TYPES)[number];

export const INTERVIEW_LEVELS = ['entry', 'junior', 'mid', 'senior', 'lead'] as const;
export type InterviewLevel = (typeof INTERVIEW_LEVELS)[number];

export const INTERVIEW_DIFFICULTIES = ['easy', 'standard', 'hard'] as const;
export type InterviewDifficulty = (typeof INTERVIEW_DIFFICULTIES)[number];

export const INTERVIEW_STYLES = ['friendly', 'professional', 'challenging', 'strict', 'realistic'] as const;
export type InterviewStyle = (typeof INTERVIEW_STYLES)[number];

export const INTERVIEW_LENGTHS = ['quick', 'standard', 'full'] as const;
export type InterviewLength = (typeof INTERVIEW_LENGTHS)[number];

/** How many main questions each length asks (follow-ups come on top of these and are not counted). */
export const PLANNED_QUESTIONS: Readonly<Record<InterviewLength, number>> = { quick: 4, standard: 7, full: 10 };

export const MAX_TITLE_CHARS = 80;
export const MAX_JOB_DESCRIPTION_CHARS = 4000;
/** Questions a learner chose to practise again (the ones a past report marked weak). */
export const MAX_PRACTISE_QUESTIONS = 5;
export const MAX_PRACTISE_CHARS = 240;

/** What the learner picked, as stored with the interview and sent to the server (which checks every field again). */
export type InterviewSetup = {
  /** The job position, or a custom title the learner typed. */
  position: string;
  type: InterviewType;
  level: InterviewLevel;
  difficulty: InterviewDifficulty;
  style: InterviewStyle;
  length: InterviewLength;
  /** A pasted job description; empty means a general interview for the position. */
  jobDescription: string;
  /** Whether Tali or Tala may read the résumé and portfolio (the learner can switch it off). */
  useProfile: boolean;
  /** Questions to bring back because the learner struggled with them last time. */
  practise: string[];
  /** Who interviews: Tali or Tala, chosen for this interview (it never changes in the middle of one). */
  companion: CompanionId;
  /** The language the interview is held in. */
  language: Language;
};

export const DEFAULT_SETUP: InterviewSetup = {
  position: '',
  type: 'general',
  level: 'junior',
  difficulty: 'standard',
  style: 'realistic',
  length: 'standard',
  jobDescription: '',
  useProfile: true,
  practise: [],
  companion: DEFAULT_COMPANION,
  language: DEFAULT_LANGUAGE,
};

const oneOf = <T extends string>(list: readonly T[], value: unknown, fallback: T): T => (typeof value === 'string' && (list as readonly string[]).includes(value) ? (value as T) : fallback);

const clean = (value: unknown, max: number) => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '');

/** A job description keeps its line breaks (they carry the structure) but not runs of blank lines. */
const cleanBlock = (value: unknown, max: number) =>
  typeof value === 'string'
    ? value
        .replace(/\r/g, '')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
        .slice(0, max)
    : '';

/** A setup read from storage or from a request: every field checked, anything unknown replaced by its default. */
export function sanitizeSetup(value: unknown): InterviewSetup {
  const raw = (typeof value === 'object' && value !== null ? value : {}) as Record<string, unknown>;
  const practise = (Array.isArray(raw.practise) ? raw.practise : [])
    .map((question) => clean(question, MAX_PRACTISE_CHARS))
    .filter(Boolean)
    .slice(0, MAX_PRACTISE_QUESTIONS);
  return {
    position: clean(raw.position, MAX_TITLE_CHARS),
    type: oneOf(INTERVIEW_TYPES, raw.type, DEFAULT_SETUP.type),
    level: oneOf(INTERVIEW_LEVELS, raw.level, DEFAULT_SETUP.level),
    difficulty: oneOf(INTERVIEW_DIFFICULTIES, raw.difficulty, DEFAULT_SETUP.difficulty),
    style: oneOf(INTERVIEW_STYLES, raw.style, DEFAULT_SETUP.style),
    length: oneOf(INTERVIEW_LENGTHS, raw.length, DEFAULT_SETUP.length),
    jobDescription: cleanBlock(raw.jobDescription, MAX_JOB_DESCRIPTION_CHARS),
    useProfile: raw.useProfile !== false,
    practise,
    companion: companionOf(raw.companion).id,
    language: isLanguage(raw.language) ? raw.language : DEFAULT_LANGUAGE,
  };
}

/** A setup can start an interview once it names a position (a typed title, or a job description to take it from). */
export const canStart = (setup: InterviewSetup): boolean => setup.position.trim().length >= 2;

/** The interview's own title in the history: the position and what kind of interview it was. */
export const interviewTitle = (setup: InterviewSetup): string => setup.position.trim() || 'Mock interview';

/** Main questions planned for this setup. */
export const plannedQuestions = (setup: Pick<InterviewSetup, 'length'>): number => PLANNED_QUESTIONS[setup.length] ?? PLANNED_QUESTIONS.standard;

/**
 * Where the interview is, 0 to 1: main questions asked of those planned. The opening and follow-ups don't move it, so it never
 * runs ahead of the conversation; a finished interview is always full.
 */
export function interviewProgress(asked: number, planned: number, finished = false): number {
  if (finished) return 1;
  if (!Number.isFinite(asked) || !Number.isFinite(planned) || planned <= 0) return 0;
  return Math.max(0, Math.min(1, asked / planned));
}
