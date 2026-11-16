/**
 * Server-only: the AI chat allowance (the same file as CarMind, Pawfetti, Ulamin and Bubblie, only `APP`
 * differs). New conversations per rolling 24 hours, Free 3 and fair use 100 (anyone who bought a course)
 * (constants/ai-chat), counted in Supabase (`ai_chats`, supabase/migrations/20261105000000_ai_chat_quota.sql,
 * CarMind's project, shared by the four apps) so a reinstall, a cleared app or a second phone
 * can't reset it. Needs SUPABASE_URL (or EXPO_PUBLIC_SUPABASE_URL) and SUPABASE_SECRET_KEY.
 *
 * The life of one conversation's first message:
 *   beginChat     before Gemini: `started` (reserved), `existing` (a follow-up: free), `in_flight` (a retry
 *                 or double tap of the same conversation), `limit`, `conversation_full`
 *   completeChat  Gemini answered: the conversation now counts for good (follow-ups add to its messages)
 *   releaseChat   Gemini failed: the reservation is given back, so a failure never costs a chat
 * A count that can't be made is `unavailable`: never a free chat. Without the database configured,
 * development and tests count in this instance's memory with the same rules; production doesn't.
 *
 * `keys` are everything that identifies the person, strongest first (the Supabase account, the store
 * customer id, the phone's id); a conversation is stored under each, and the count is of distinct
 * conversations across them, so a reinstall that keeps any one key keeps the count.
 */

import {
  AI_CHAT_FREE_DAILY_LIMIT,
  AI_CHAT_MAX_MESSAGES,
  AI_CHAT_PRO_DAILY_LIMIT,
  AI_CHAT_WINDOW_DAYS,
  type AiChatPlan,
  type AiChatQuota,
} from '@/constants/ai-chat';

const APP = 'talino';

/** What the shared SQL accepts as an app name (`ai_chat_check_args`): 3 to 20 lowercase letters, no hyphen or digit. */
export const QUOTA_APP_NAME = /^[a-z]{3,20}$/;
const PENDING_SECONDS = 180;
const WINDOW_MS = AI_CHAT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
const MAX_KEYS = 5;
const KEY_PATTERN = /^[\w:.@$-]{1,200}$/;

export type ChatBegin =
  | { status: 'started' | 'existing'; used: number }
  | { status: 'in_flight'; used: number }
  | { status: 'conversation_full'; used: number }
  | { status: 'limit'; used: number; resetsAt: Date | null }
  | { status: 'unavailable' };

const positive = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/** The daily (rolling 24 hours) number of new conversations on a plan (env overrides, for tests and tuning). */
export const chatLimit = (plan: AiChatPlan): number =>
  plan === 'pro'
    ? positive(process.env.AI_CHAT_PRO_DAILY_LIMIT, AI_CHAT_PRO_DAILY_LIMIT)
    : positive(process.env.AI_CHAT_FREE_DAILY_LIMIT, AI_CHAT_FREE_DAILY_LIMIT);

/** A conversation id the app made (a UUID): anything else is refused before it is stored. */
export const validConversationId = (value: unknown): value is string => typeof value === 'string' && /^[\w-]{8,64}$/.test(value);

/** Keys with the app's name in front where needed, de-duplicated and checked; null when there's nothing usable. */
export function cleanKeys(keys: readonly (string | null | undefined)[]): string[] | null {
  const clean = [...new Set(keys.filter((key): key is string => typeof key === 'string' && KEY_PATTERN.test(key)))].slice(0, MAX_KEYS);
  return clean.length > 0 ? clean : null;
}

/** What the app is told: Free the numbers, Pro none (only when access returns, once spent). */
export function quotaFor(plan: AiChatPlan, used: number, resetsAt: Date | null): AiChatQuota {
  const limit = chatLimit(plan);
  const at = resetsAt ? resetsAt.toISOString() : null;
  return plan === 'pro' ? { plan, resetsAt: at } : { plan, remaining: Math.max(0, limit - used), limit, resetsAt: used >= limit ? at : null };
}

const configured = () => Boolean(process.env.SUPABASE_SECRET_KEY && (process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL));

async function rpc<T>(name: string, args: Record<string, unknown>): Promise<T> {
  const base = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
  const response = await fetch(`${base}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: process.env.SUPABASE_SECRET_KEY ?? '', 'content-type': 'application/json' },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error(`${name} failed: ${response.status}`);
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

// Development and tests: the database functions' rules, in this instance's memory.
type MemoryChat = { keys: string[]; status: 'pending' | 'completed'; startedAt: number; messages: number };
const memory = new Map<string, MemoryChat>();

const memoryId = (conversationId: string, app = APP) => `${app}|${conversationId}`;
const sharesKey = (chat: MemoryChat, keys: string[]) => chat.keys.some((key) => keys.includes(key));

function memoryWindow(keys: string[], now: number, app = APP): [string, number][] {
  return [...memory.entries()]
    .filter(([id, chat]) => id.startsWith(`${app}|`) && sharesKey(chat, keys) && chat.startedAt > now - WINDOW_MS && (chat.status === 'completed' || chat.startedAt > now - PENDING_SECONDS * 1000))
    .map(([id, chat]) => [id, chat.startedAt] as [string, number])
    .sort((a, b) => a[1] - b[1]);
}

function memoryBegin(keys: string[], conversationId: string, limit: number, now: number, app = APP): ChatBegin {
  const id = memoryId(conversationId, app);
  const found = memory.get(id);
  if (found && found.status === 'pending' && found.startedAt <= now - PENDING_SECONDS * 1000) memory.delete(id);
  const chat = memory.get(id);
  const window = memoryWindow(keys, now, app);
  if (chat && sharesKey(chat, keys)) {
    chat.keys = [...new Set([...chat.keys, ...keys])];
    if (chat.status === 'pending') return { status: 'in_flight', used: window.length };
    return { status: chat.messages >= AI_CHAT_MAX_MESSAGES ? 'conversation_full' : 'existing', used: window.length };
  }
  if (window.length >= limit) {
    const frees = window[Math.max(window.length - limit, 0)];
    return { status: 'limit', used: window.length, resetsAt: new Date(frees[1] + WINDOW_MS) };
  }
  memory.set(id, { keys, status: 'pending', startedAt: now, messages: 0 });
  return { status: 'started', used: window.length + 1 };
}

let offWarned = false;
let lastPrune = 0;

/**
 * Before asking Gemini. `started` must be followed by `completeChat` or `releaseChat`; `existing`
 * (a follow-up) by `completeChat` only to record the answer. Nothing else needs undoing.
 */
export async function beginChat(keys: string[], conversationId: string, plan: AiChatPlan, options: { app?: string; limit?: number } = {}): Promise<ChatBegin> {
  const limit = options.limit ?? chatLimit(plan);
  const app = options.app ?? APP;
  // A name the database would refuse fails loudly here, in development and tests too, instead of looking like a busy server.
  if (!QUOTA_APP_NAME.test(app)) throw new Error(`Invalid quota app name "${app}": the shared SQL accepts 3 to 20 lowercase letters only`);
  if (!configured()) {
    if (process.env.NODE_ENV === 'production') {
      if (!offWarned) console.error('AI chat allowance cannot be counted: SUPABASE_URL / SUPABASE_SECRET_KEY are not set');
      offWarned = true;
      return { status: 'unavailable' };
    }
    return memoryBegin(keys, conversationId, limit, Date.now(), app);
  }
  try {
    if (Date.now() - lastPrune > 6 * 60 * 60 * 1000) {
      lastPrune = Date.now();
      void rpc('ai_chat_prune', {}).catch(() => undefined);
    }
    const [row] = await rpc<{ outcome: string; used: number; resets_at: string | null }[]>('ai_chat_begin', {
      p_app: app,
      p_keys: keys,
      p_conversation_id: conversationId,
      p_limit: limit,
      p_plan: plan,
      p_window_days: AI_CHAT_WINDOW_DAYS,
      p_pending_seconds: PENDING_SECONDS,
      p_max_messages: AI_CHAT_MAX_MESSAGES,
    });
    if (!row) return { status: 'unavailable' };
    const used = row.used ?? 0;
    switch (row.outcome) {
      case 'started':
      case 'existing':
      case 'in_flight':
      case 'conversation_full':
        return { status: row.outcome, used };
      case 'limit':
        return { status: 'limit', used, resetsAt: row.resets_at ? new Date(row.resets_at) : null };
      default:
        return { status: 'unavailable' };
    }
  } catch (error) {
    console.error('AI chat allowance check failed', error);
    return { status: 'unavailable' };
  }
}

/** The answer was delivered. Tokens (optional) are kept for cost numbers. Never throws. */
export async function completeChat(keys: string[], conversationId: string, tokens?: { input?: number; output?: number }, app = APP): Promise<void> {
  if (!configured()) {
    const chat = memory.get(memoryId(conversationId, app));
    if (chat) {
      chat.status = 'completed';
      chat.messages += 1;
    }
    return;
  }
  try {
    await rpc('ai_chat_complete', { p_app: app, p_keys: keys, p_conversation_id: conversationId, p_tokens_in: tokens?.input ?? 0, p_tokens_out: tokens?.output ?? 0 });
  } catch (error) {
    // The reservation stays (it counts for a few minutes, then it would lapse): log it, the answer is already made.
    console.error('AI chat completion could not be recorded', error);
  }
}

/** Gemini couldn't answer a new conversation's first message: its reservation is given back. Never throws. */
export async function releaseChat(keys: string[], conversationId: string, app = APP): Promise<void> {
  if (!configured()) {
    const chat = memory.get(memoryId(conversationId, app));
    if (chat?.status === 'pending') memory.delete(memoryId(conversationId, app));
    return;
  }
  try {
    await rpc('ai_chat_release', { p_app: app, p_keys: keys, p_conversation_id: conversationId });
  } catch (error) {
    console.error('AI chat release failed', error);
  }
}

/** Used so far and when the next one frees up (once spent), without counting anything; null when it can't be read. */
export async function chatUsage(keys: string[], plan: AiChatPlan): Promise<{ used: number; resetsAt: Date | null } | null> {
  const limit = chatLimit(plan);
  if (!configured()) {
    if (process.env.NODE_ENV === 'production') return null;
    const window = memoryWindow(keys, Date.now());
    return { used: window.length, resetsAt: window.length >= limit ? new Date(window[window.length - limit][1] + WINDOW_MS) : null };
  }
  try {
    const [row] = await rpc<{ used: number; resets_at: string | null }[]>('ai_chat_usage', {
      p_app: APP,
      p_keys: keys,
      p_limit: limit,
      p_window_days: AI_CHAT_WINDOW_DAYS,
      p_pending_seconds: PENDING_SECONDS,
    });
    return row ? { used: row.used ?? 0, resetsAt: row.resets_at ? new Date(row.resets_at) : null } : null;
  } catch (error) {
    console.error('AI chat usage could not be read', error);
    return null;
  }
}

/** Tests only: forget the in-memory counts. */
export function resetChatQuotaMemory(): void {
  memory.clear();
}
