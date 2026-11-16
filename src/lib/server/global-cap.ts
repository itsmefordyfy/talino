/**
 * Server-only: the optional cap on Gemini requests across everyone, per (UTC) day, a guard on the
 * bill and not on a person (the per-person allowance is lib/server/ai-chat-quota's). Set
 * `AI_GLOBAL_DAILY_LIMIT` to turn it on; unset or 0 it is off. Counted in the shared Supabase with
 * CarMind's existing `assistant_use` / `assistant_refund` functions
 * (supabase/migrations/20261005000000_assistant_usage.sql in CarMind's repo, already part of that
 * project) under the key `talino:global`, so Talino's count is its own. Without the database
 * (development, tests) the same rule is counted in this instance's memory; if the database can't
 * be reached the request is allowed (as CarMind does: Google's own spend cap and the prepaid balance
 * stay the backstop), and the failure is logged.
 */

const GLOBAL_KEY = 'talino:global';

const limit = (): number => {
  const parsed = Number.parseInt(process.env.AI_GLOBAL_DAILY_LIMIT ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const configured = () => Boolean(process.env.SUPABASE_SECRET_KEY && (process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL));
const today = () => new Date().toISOString().slice(0, 10);

async function rpc<T>(name: string, args: Record<string, unknown>): Promise<T> {
  const base = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
  const response = await fetch(`${base}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: process.env.SUPABASE_SECRET_KEY ?? '', 'content-type': 'application/json' },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error(`${name} failed: ${response.status}`);
  return (await response.json()) as T;
}

let memory = { day: '', used: 0 };

/** What to give back if Gemini can't answer: null when nothing was counted (the cap is off, or the database couldn't be reached). */
export type GlobalSlot = { day: string } | null;

/** Counts one request toward today's cap, or `'full'` when the day's cap is already spent. Call it before Gemini, and `refundGlobal` if Gemini fails. */
export async function reserveGlobal(): Promise<GlobalSlot | 'full'> {
  const cap = limit();
  if (cap === 0) return null;
  const day = today();
  if (!configured()) {
    if (process.env.NODE_ENV === 'production') return null;
    if (memory.day !== day) memory = { day, used: 0 };
    if (memory.used >= cap) return 'full';
    memory.used += 1;
    return { day };
  }
  try {
    const [row] = await rpc<{ allowed: boolean }[]>('assistant_use', { p_user_key: GLOBAL_KEY, p_day: day, p_limit: cap, p_increment: true });
    return row?.allowed ? { day } : 'full';
  } catch (error) {
    console.error('AI global cap check failed; allowing the request', error);
    return null;
  }
}

/** Gives a counted request back (Gemini couldn't answer it). Never throws. */
export async function refundGlobal(slot: GlobalSlot): Promise<void> {
  if (!slot) return;
  if (!configured()) {
    if (memory.day === slot.day && memory.used > 0) memory.used -= 1;
    return;
  }
  try {
    await rpc('assistant_refund', { p_user_key: GLOBAL_KEY, p_day: slot.day });
  } catch (error) {
    console.error('AI global cap refund failed', error);
  }
}

/** Tests only: forget the in-memory count. */
export function resetGlobalCapMemory(): void {
  memory = { day: '', used: 0 };
}
