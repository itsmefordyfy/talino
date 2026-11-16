/** The three résumé versions (the business plan: developer job, freelance, AI engineer). */
export const RESUME_GOALS = ['developer', 'freelance', 'ai-engineer'] as const;
export type ResumeGoal = (typeof RESUME_GOALS)[number];

export function isResumeGoal(value: unknown): value is ResumeGoal {
  return (RESUME_GOALS as readonly unknown[]).includes(value);
}

/** What the learner adds by hand, beside what Talino already knows. */
export const RESUME_ITEM_KINDS = ['experience', 'education', 'project', 'skill', 'certification', 'achievement'] as const;
export type ResumeItemKind = (typeof RESUME_ITEM_KINDS)[number];

export function isResumeItemKind(value: unknown): value is ResumeItemKind {
  return (RESUME_ITEM_KINDS as readonly unknown[]).includes(value);
}

/** The one `resume_profile` row (id 'me'). */
export type ResumeProfile = {
  headline: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  linkedin: string | null;
  github: string | null;
  summary: string | null;
  /** What the learner is aiming for, in their words (for the AI; never printed). */
  career_goal: string | null;
  /** Their situation (`ResumeLevel`), which picks a template to start from. */
  level: string | null;
};

export type ResumeItem = {
  id: string;
  kind: ResumeItemKind;
  title: string;
  organization: string | null;
  start_on: string | null;
  end_on: string | null;
  description: string | null;
  sort: number;
  location: string | null;
  link: string | null;
  /** Dates as written on an imported résumé ("2019 – 2021"), kept when they aren't month-precise; used only while start and end are empty. */
  dates_text: string | null;
};

/** A goal's saved version (from tailoring to a job post). */
export type ResumeVersion = {
  goal: ResumeGoal;
  jobTitle: string | null;
  summary: string | null;
  highlights: string[];
  keywords: string[];
};

/** A project passed in Talino, as the résumé and portfolio show it. */
export type TalinoProject = { title: string; course: string; summary: string; link: string | null };

/** A Talino certificate; `url` is its public verification page once verified. */
export type TalinoCertificate = { title: string; issued: string; url: string | null };

/** Everything the learner has done in Talino that belongs on a résumé or portfolio. */
export type Achievements = {
  projects: TalinoProject[];
  certificates: TalinoCertificate[];
  /** Course skills learned far enough (meter ≥ 0.6). */
  skills: string[];
  /** Earned badges fit to show an employer (never the career tracker's private ones). */
  badges: { id: string; title: string }[];
  /** The course furthest along (for templates' {{course}}); null before any. */
  currentCourse: string | null;
};

/** One résumé entry as the form and the import write it (the row's id is made when the form opens, or for an imported entry). */
export type ItemInput = {
  id: string;
  kind: ResumeItemKind;
  title: string;
  organization: string;
  startOn: string | null;
  endOn: string | null;
  description: string;
  location: string;
  link: string;
  datesText: string | null;
};
