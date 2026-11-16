/**
 * Server-only Gemini helpers for the Expo API routes. Never import this from app code: it reads
 * GEMINI_API_KEY, which must stay on the server. Ported from Pawfetti's `lib/server/gemini`.
 *
 * Server settings, read from the environment when a request arrives (never EXPO_PUBLIC_, never
 * bundled): `.env` in development (Expo loads it for the dev server), and EAS hosting variables
 * for a deployed server.
 *   GEMINI_API_KEY          required; without it the route answers `unavailable` (nothing is called)
 *   GEMINI_MODELS           optional comma-separated chain, tried in order while one is busy
 *
 * The all-callers daily cap (AI_GLOBAL_DAILY_LIMIT) is lib/server/global-cap. The per-person allowance (new conversations per rolling 24 hours) is not here: it is counted in
 * Supabase by `lib/server/ai-chat-quota`, and the plan is checked with RevenueCat by `lib/server/pro`.
 */

/**
 * Tried in order while one is busy or at its limit: each model has its own quota at Google.
 * Cheapest first. Pinned names (Pawfetti's), so the bill can't jump when Google moves an alias.
 */
const DEFAULT_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-3.6-flash'];
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/** One Gemini request may take at most this long; the whole answer must fit in TOTAL_BUDGET_MS. */
const ATTEMPT_TIMEOUT_MS = 20_000;
const TOTAL_BUDGET_MS = 30_000;
const MIN_ATTEMPT_MS = 2_500;
export const TIMED_OUT = 504;
/** A model that just said it's busy is skipped for a while (per server instance). */
const BUSY_COOLDOWN_MS = 60_000;
const DAILY_COOLDOWN_MS = 30 * 60_000;
const modelResting = new Map<string, number>();

export type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; thoughtsTokenCount?: number };
};

export type GeminiRefusal = 'location' | 'key' | 'billing' | 'permission' | 'bad_request' | 'other';

export type GeminiResult = {
  status: number;
  data?: GeminiResponse;
  daily?: boolean;
  model?: string;
  refusal?: GeminiRefusal;
  googleStatus?: string;
  googleReason?: string;
  /** Google's own words for a refusal, kept only outside production (see `logFailure`). */
  googleMessage?: string;
};

type GoogleError = { error?: { status?: string; message?: string; details?: { reason?: string; violations?: { quotaId?: string }[] }[] } };

/** Logged once per server instance, so a missing key is obvious in the logs without flooding them. */
let reportedMissingKey = false;

/** The Gemini key, or undefined when it isn't set (the route then answers `unavailable`). The value is never logged. */
export function geminiKey(): string | undefined {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (key) return key;
  if (!reportedMissingKey) {
    reportedMissingKey = true;
    console.error('[talino] GEMINI_API_KEY is not set: Tali answers "unavailable". Locally, add it to .env and restart Metro; for a deployed server, set it as a hosting variable and redeploy.');
  }
  return undefined;
}

function modelChain(): string[] {
  const listed = (process.env.GEMINI_MODELS ?? '').split(',').map((model) => model.trim()).filter(Boolean);
  return listed.length > 0 ? listed : DEFAULT_MODELS;
}

// ---------------------------------------------------------------------------------------------
// Calling Gemini

function isDailyQuota(body: GoogleError | null): boolean {
  return (body?.error?.details ?? []).some((detail) => detail.violations?.some((violation) => /PerDay/i.test(violation.quotaId ?? '')));
}

/** Sorts Google's refusal into what the app can act on. The message is read here, never passed on. */
function refusalOf(status: number, body: GoogleError | null): GeminiRefusal {
  const message = body?.error?.message ?? '';
  const reasons = (body?.error?.details ?? []).map((detail) => detail.reason ?? '');
  if (/location is not supported|not available in your country/i.test(message)) return 'location';
  if (reasons.some((reason) => /API_KEY/.test(reason)) || /api key/i.test(message)) return 'key';
  if (status === 402 || /billing/i.test(message)) return 'billing';
  if (status === 403 || body?.error?.status === 'PERMISSION_DENIED') return 'permission';
  if (status === 400) return 'bad_request';
  return 'other';
}

async function callModel(apiKey: string, model: string, body: Record<string, unknown>, deadline: number): Promise<GeminiResult> {
  const timeLeft = Math.min(ATTEMPT_TIMEOUT_MS, deadline - Date.now());
  if (timeLeft <= 0) return { status: TIMED_OUT, model };
  let response: Response;
  try {
    response = await fetch(`${GEMINI_URL}/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeLeft),
    });
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) return { status: TIMED_OUT, model };
    throw error;
  }
  if (response.ok) return { status: 200, model, data: (await response.json()) as GeminiResponse };
  const failure = (await response.json().catch(() => null)) as GoogleError | null;
  if (response.status === 429) return { status: 429, model, daily: isDailyQuota(failure) };
  return {
    status: response.status,
    model,
    refusal: refusalOf(response.status, failure),
    googleStatus: failure?.error?.status,
    googleReason: failure?.error?.details?.find((detail) => detail.reason)?.reason,
    // Development only: Google's message says why (billing, credits, region, a restricted key) and holds nothing of the learner's.
    googleMessage: process.env.NODE_ENV === 'production' ? undefined : failure?.error?.message?.slice(0, 300),
  };
}

const isBusy = (status: number) => status === 429 || status === 503 || status === 500 || status === TIMED_OUT;

/** Asks each model in the chain in turn while one is busy, skipping any that's resting, until one answers. */
export async function callGemini(apiKey: string, body: Record<string, unknown>): Promise<GeminiResult> {
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  const now = Date.now();
  const chain = modelChain();
  const awake = chain.filter((model) => (modelResting.get(model) ?? 0) <= now);
  const order = awake.length > 0 ? awake : chain;
  let result: GeminiResult = { status: TIMED_OUT };
  for (const model of order) {
    if (deadline - Date.now() < MIN_ATTEMPT_MS) break;
    result = await callModel(apiKey, model, body, deadline);
    if (!isBusy(result.status)) {
      modelResting.delete(model);
      break;
    }
    modelResting.set(model, Date.now() + (result.daily ? DAILY_COOLDOWN_MS : BUSY_COOLDOWN_MS));
  }
  return result;
}

/** For tests: wakes every model. */
export function resetModelRest(): void {
  modelResting.clear();
}

export function replyText(data: GeminiResponse | undefined): string {
  return (data?.candidates?.[0]?.content?.parts ?? [])
    .filter((part) => !part.thought && part.text)
    .map((part) => part.text)
    .join('')
    .trim();
}

/**
 * One line per failed Gemini call, in the server's logs: which route and model, and what Google
 * said (its codes only). Nothing the learner wrote, no network address, never the key.
 */
function logFailure(route: string, result: GeminiResult): void {
  console.error(
    JSON.stringify({
      event: 'gemini_failed',
      route,
      model: result.model ?? null,
      httpStatus: result.status,
      googleStatus: result.googleStatus ?? null,
      googleReason: result.googleReason ?? null,
      refusal: result.refusal ?? null,
      daily: result.daily ?? false,
      ...(result.googleMessage ? { googleMessage: result.googleMessage } : {}),
    }),
  );
}

/** The app-facing error for a failed Gemini call (logged), or null when it succeeded. */
export function geminiError(result: GeminiResult, route: 'coach' | 'review' | 'tailor' | 'resume' | 'interview'): Response | null {
  if (result.status === 200) return null;
  logFailure(route, result);
  if (result.refusal === 'location') return Response.json({ error: 'unavailable', reason: 'region' }, { status: 503 });
  // Billing, a denied project or a bad key: nothing the learner can retry.
  if (result.status === 400 || result.status === 402 || result.status === 403) return Response.json({ error: 'unavailable' }, { status: 503 });
  if (result.daily) return Response.json({ error: 'busy' }, { status: 503 });
  if (isBusy(result.status)) return Response.json({ error: 'busy' }, { status: 503 });
  return Response.json({ error: 'unknown' }, { status: 502 });
}
