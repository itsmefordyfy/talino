import { DAILY_MINUTE_CHOICES, EXPERIENCE_LEVELS, GOAL_IDS, INTEREST_IDS, NOT_SURE, STYLE_IDS, TIMES_OF_DAY, WEEKLY_GOAL_CHOICES, type ExperienceLevel, type GoalId, type InterestId, type StyleId, type TimeOfDay } from './options';

/** How well the optional skill check thinks the learner knows the basics; it adjusts the starting point, never gates anything. */
export type AssessmentLevel = 'new' | 'foundations' | 'comfortable' | 'strong';
export const ASSESSMENT_LEVELS: readonly AssessmentLevel[] = ['new', 'foundations', 'comfortable', 'strong'];

export type AssessmentResult = { level: AssessmentLevel; correct: number; total: number; at: string };

/** The saved shape of the plan: only what is needed to read it back (the screens recompute the rest). */
export type StoredPlan = { startCourseId: string; nextCourseIds: string[]; generatedAt: string };

/** What onboarding learned about the learner. Everything is optional until answered; nothing here identifies a person. */
export type LearnerProfile = {
  experience: ExperienceLevel | null;
  goals: GoalId[];
  interests: InterestId[];
  styles: StyleId[];
  dailyMinutes: number | null;
  /** Days chosen to learn (0 Sunday … 6 Saturday); empty means "any day". */
  days: number[];
  timeOfDay: TimeOfDay | null;
  /** Lessons a week the learner aims for; null follows from the daily time. */
  weeklyGoal: number | null;
  assessment: AssessmentResult | null;
  plan: StoredPlan | null;
};

export type ProfileStatus = 'in_progress' | 'completed';

export type StoredProfile = LearnerProfile & {
  /** Where onboarding was left (the step id's index), so closing the app resumes there. */
  step: number;
  status: ProfileStatus;
  startedAt: string;
  completedAt: string | null;
  updatedAt: string;
};

export const EMPTY_PROFILE: LearnerProfile = {
  experience: null,
  goals: [],
  interests: [],
  styles: [],
  dailyMinutes: null,
  days: [],
  timeOfDay: null,
  weeklyGoal: null,
  assessment: null,
  plan: null,
};

const pickKnown = <T extends string>(value: unknown, allowed: readonly T[]): T[] => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<T>();
  for (const item of value) if (typeof item === 'string' && (allowed as readonly string[]).includes(item)) seen.add(item as T);
  return [...seen];
};

/** Interests: "Not sure yet" stands alone, so a later specific pick never sits beside it. */
export function cleanInterests(value: unknown): InterestId[] {
  const known = pickKnown<InterestId>(value, INTEREST_IDS);
  const specific = known.filter((id) => id !== NOT_SURE);
  return specific.length > 0 ? specific : known;
}

export function cleanProfile(raw: Partial<Record<keyof LearnerProfile, unknown>>): LearnerProfile {
  const minutes = Number(raw.dailyMinutes);
  const weekly = Number(raw.weeklyGoal);
  const days = Array.isArray(raw.days) ? [...new Set(raw.days.map(Number).filter((day) => Number.isInteger(day) && day >= 0 && day <= 6))].sort((a, b) => a - b) : [];
  return {
    experience: EXPERIENCE_LEVELS.includes(raw.experience as ExperienceLevel) ? (raw.experience as ExperienceLevel) : null,
    goals: pickKnown<GoalId>(raw.goals, GOAL_IDS),
    interests: cleanInterests(raw.interests),
    styles: pickKnown<StyleId>(raw.styles, STYLE_IDS),
    dailyMinutes: (DAILY_MINUTE_CHOICES as readonly number[]).includes(minutes) ? minutes : null,
    days,
    timeOfDay: TIMES_OF_DAY.includes(raw.timeOfDay as TimeOfDay) ? (raw.timeOfDay as TimeOfDay) : null,
    weeklyGoal: (WEEKLY_GOAL_CHOICES as readonly number[]).includes(weekly) ? weekly : null,
    assessment: cleanAssessment(raw.assessment),
    plan: cleanPlan(raw.plan),
  };
}

function cleanAssessment(value: unknown): AssessmentResult | null {
  const record = value as Partial<AssessmentResult> | null;
  if (!record || !ASSESSMENT_LEVELS.includes(record.level as AssessmentLevel)) return null;
  const correct = Number(record.correct);
  const total = Number(record.total);
  if (!Number.isInteger(correct) || !Number.isInteger(total) || total <= 0 || correct < 0 || correct > total) return null;
  return { level: record.level as AssessmentLevel, correct, total, at: typeof record.at === 'string' ? record.at : '' };
}

function cleanPlan(value: unknown): StoredPlan | null {
  const record = value as Partial<StoredPlan> | null;
  if (!record || typeof record.startCourseId !== 'string') return null;
  return {
    startCourseId: record.startCourseId,
    nextCourseIds: Array.isArray(record.nextCourseIds) ? record.nextCourseIds.filter((id): id is string => typeof id === 'string').slice(0, 6) : [],
    generatedAt: typeof record.generatedAt === 'string' ? record.generatedAt : '',
  };
}

/** The questions that must be answered before a plan can be made; everything else is optional. */
export const REQUIRED_FOR_PLAN = (profile: LearnerProfile): boolean => profile.experience !== null && profile.goals.length > 0;

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
