/**
 * Server-only helpers shared by AI routes: who is asking, the refusal for a chat allowance answer, and one Gemini call made under
 * the all-callers cap that gives everything back on failure. The same logic `coach+api.ts` keeps for itself (that route is left
 * as it is); new routes import these instead of copying them again.
 */

import type { AiChatPlan } from '@/constants/ai-chat';

import { cleanKeys, quotaFor, type ChatBegin } from './ai-chat-quota';
import { callGemini, functionCallsOf, geminiError, replyText, type GeminiResult } from './gemini';
import { refundGlobal, reserveGlobal } from './global-cap';

const DEVICE_ID = /^[\w-]{8,64}$/;

export type Body = Record<string, unknown>;

/** Everything that identifies the person (store customer id, this phone), for the allowance; null when there is nothing usable. */
export function keysOf(body: Body): string[] | null {
  const appUserId = typeof body.appUserId === 'string' ? body.appUserId : null;
  const deviceId = typeof body.deviceId === 'string' && DEVICE_ID.test(body.deviceId) ? body.deviceId : null;
  return cleanKeys([appUserId ? `rc:${appUserId}` : null, deviceId ? `device:${deviceId}` : null]);
}

/** The app-facing answer for an allowance result that isn't a go-ahead, or null when the call may proceed. */
export function refusal(begun: ChatBegin, plan: AiChatPlan, limitError = 'chat_limit'): Response | null {
  if (begun.status === 'limit') return Response.json({ error: limitError, quota: quotaFor(plan, begun.used, begun.resetsAt), resetsAt: begun.resetsAt ? begun.resetsAt.toISOString() : null }, { status: 429 });
  if (begun.status === 'in_flight') return Response.json({ error: 'chat_in_progress' }, { status: 409 });
  if (begun.status === 'conversation_full') return Response.json({ error: 'conversation_full' }, { status: 409 });
  if (begun.status === 'unavailable') return Response.json({ error: 'quota_unavailable' }, { status: 503 });
  return null;
}

export type AskOptions = {
  /** Pin one model (no fallback chain): see `CallOptions.model`. */
  model?: string;
  /** A reply that is only a request for a tool is an answer, not an empty reply (the prompt lab's tool-use rounds). */
  allowToolCalls?: boolean;
};

/** Asks Gemini under the all-callers cap; on any failure the reservation (if any) and the allowance are given back. */
export async function ask(apiKey: string, request: Record<string, unknown>, giveBack: () => Promise<void>, route: 'interview' | 'practice', options: AskOptions = {}): Promise<{ text: string; result: GeminiResult } | Response> {
  const slot = await reserveGlobal();
  if (slot === 'full') {
    await giveBack();
    return Response.json({ error: 'busy' }, { status: 503 });
  }
  let result: GeminiResult;
  try {
    result = await callGemini(apiKey, request, options.model ? { model: options.model } : {});
  } catch {
    await refundGlobal(slot);
    await giveBack();
    return Response.json({ error: 'busy' }, { status: 503 });
  }
  const error = geminiError(result, route);
  if (error) {
    await refundGlobal(slot);
    await giveBack();
    return error;
  }
  const text = replyText(result.data);
  if (!text && !(options.allowToolCalls && functionCallsOf(result.data).length > 0)) {
    await refundGlobal(slot);
    await giveBack();
    return Response.json({ error: 'unknown' }, { status: 502 });
  }
  return { text, result };
}

export const tokensOf = (result: GeminiResult) => ({ input: result.data?.usageMetadata?.promptTokenCount, output: (result.data?.usageMetadata?.candidatesTokenCount ?? 0) + (result.data?.usageMetadata?.thoughtsTokenCount ?? 0) });
