/**
 * The practice engine's own allowance, separate from Tali's chats and the mock interview (a role-play is several messages and a
 * debrief; a message review is one larger request). Counted like every chat: new sessions per rolling 24 hours in the shared
 * `ai_chats` table under its own app name, so a role-play's follow-up turns and its debrief are free. The server enforces it; the
 * app only shows what the server answered.
 */

/** The app name in `ai_chats` (the shared SQL accepts 3 to 20 lowercase letters only). */
export const PRACTICE_APP = 'talinopractice';
export const PRACTICE_FREE_DAILY_LIMIT = 3;
export const PRACTICE_PRO_DAILY_LIMIT = 30;

const positive = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/** New practice sessions (a role-play or a message review) allowed in a rolling 24 hours; server variables override, for tests and tuning. */
export const practiceLimit = (plan: 'free' | 'pro'): number =>
  plan === 'pro' ? positive(process.env.PRACTICE_PRO_DAILY_LIMIT, PRACTICE_PRO_DAILY_LIMIT) : positive(process.env.PRACTICE_FREE_DAILY_LIMIT, PRACTICE_FREE_DAILY_LIMIT);
