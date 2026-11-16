/**
 * The mock interview's own allowance, separate from Tali's chats (an interview is many messages, and its evaluation is a second,
 * larger request). Counted like every chat: new interviews per rolling 24 hours in the shared `ai_chats` table under its own app
 * name, so follow-up answers and the evaluation of an interview already begun are free. Free gets one interview a day, anyone who
 * bought a plan gets fair use. The server enforces it; the app only shows what the server answered.
 */

/** The app name in `ai_chats` (the shared SQL accepts 3 to 20 lowercase letters only). */
export const INTERVIEW_APP = 'talinointerview';
export const INTERVIEW_FREE_DAILY_LIMIT = 1;
export const INTERVIEW_PRO_DAILY_LIMIT = 10;

const positive = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/** New interviews allowed in a rolling 24 hours (server variables override, for tests and tuning). */
export const interviewLimit = (plan: 'free' | 'pro'): number =>
  plan === 'pro' ? positive(process.env.INTERVIEW_PRO_DAILY_LIMIT, INTERVIEW_PRO_DAILY_LIMIT) : positive(process.env.INTERVIEW_FREE_DAILY_LIMIT, INTERVIEW_FREE_DAILY_LIMIT);
