/** A job hunt or a freelance gig: the same pipeline, different words ("Hired" or "Won"). */
export const APPLICATION_KINDS = ['job', 'freelance'] as const;
export type ApplicationKind = (typeof APPLICATION_KINDS)[number];

/** Pipeline order. `won` is shown as "Hired" for a job. */
export const STAGES = ['saved', 'applied', 'interview', 'offer', 'won', 'closed'] as const;
export type Stage = (typeof STAGES)[number];

/** Stages where something may still happen, so follow-ups and interviews are worth a reminder. */
export const ACTIVE_STAGES: readonly Stage[] = ['saved', 'applied', 'interview', 'offer'];

export const SOURCES = ['linkedin', 'jobstreet', 'kalibrr', 'onlinejobs', 'upwork', 'fiverr', 'referral', 'company-site', 'other'] as const;
export type Source = (typeof SOURCES)[number];

export type ApplicationRow = {
  id: string;
  kind: ApplicationKind;
  title: string;
  company: string;
  link: string | null;
  source: Source | null;
  stage: Stage;
  /** Local `YYYY-MM-DD`. */
  applied_on: string | null;
  follow_up_on: string | null;
  /** ISO timestamp of the local date and time picked. */
  interview_at: string | null;
  pay: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type IncomeRow = {
  id: string;
  client: string;
  application_id: string | null;
  /** Integer minor units of `currency` (lib/money). */
  amount_minor: number;
  currency: string;
  received_on: string;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export const GOAL_METRICS = ['applications', 'interviews', 'offers', 'clients', 'income'] as const;
export type GoalMetric = (typeof GOAL_METRICS)[number];

export type GoalRow = {
  id: string;
  title: string;
  metric: GoalMetric;
  /** A count, or for income an amount in major units (pesos) of `currency`. */
  target: number;
  currency: string | null;
  due_on: string | null;
  done_at: string | null;
  created_at: string;
  updated_at: string;
};

export const DEFAULT_CURRENCY = 'PHP';

export function isStage(value: unknown): value is Stage {
  return typeof value === 'string' && (STAGES as readonly string[]).includes(value);
}

/** Currencies offered in the income and goal forms (freelancers here are paid in pesos or dollars most). */
export const CURRENCIES = ['PHP', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD'] as const;
