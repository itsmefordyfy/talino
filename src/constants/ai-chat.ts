/**
 * Tali's chat allowance, the same rule as every Fordytech app (and the business plan: "3 coach chats a
 * day" free, the coach "with fair use" once a course is bought): a count of NEW conversations over a
 * rolling 24 hours (not a calendar day), never of messages. Free 3 a day; anyone who owns a course,
 * a mini-course or All-Access ("pro" below) 100 a day. Pro is presented as unlimited AI access; the 100 is a fair-use allowance disclosed in the
 * terms and the help text, and the app never shows Pro a counter. The server enforces it
 * (`lib/server/ai-chat-quota`, supabase/migrations/20261105000000_ai_chat_quota.sql); the app only
 * shows what the server answered. Server env AI_CHAT_FREE_DAILY_LIMIT / AI_CHAT_PRO_DAILY_LIMIT override.
 */
export const AI_CHAT_FREE_DAILY_LIMIT = 3;
export const AI_CHAT_PRO_DAILY_LIMIT = 100;
export const AI_CHAT_WINDOW_DAYS = 1;
/** One conversation can't carry on forever (cost): after this many answers the app asks for a new one. */
export const AI_CHAT_MAX_MESSAGES = 60;

export type AiChatPlan = 'free' | 'pro';

/**
 * What the server says about the allowance, in answers, refusals and the usage check. Free gets the
 * numbers; Pro gets none (no `remaining`, no `limit`), only `resetsAt` once the fair-use allowance is
 * spent, so the app can say when access returns.
 */
export type AiChatQuota =
  | { plan: 'free'; remaining: number; limit: number; resetsAt: string | null }
  | { plan: 'pro'; resetsAt: string | null };

/** Server error codes added by the allowance (the HTTP statuses are in the route). */
export type AiChatErrorCode = 'chat_limit' | 'chat_in_progress' | 'conversation_full' | 'quota_unavailable';
