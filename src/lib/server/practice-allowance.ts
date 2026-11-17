/**
 * The practice engine's allowance step, shared by the route's modes: a new session is counted once (Free 3 and Pro 30 in a rolling 24 hours,
 * in `ai_chats` as `talinopractice`), a follow-up under the same session id is free, and a call that fails gives the session back.
 */

import type { AiChatPlan } from '@/constants/ai-chat';
import { PRACTICE_APP, practiceLimit } from '@/features/practice/lib/limits';

import { refusal } from './ai-ask';
import { beginChat, releaseChat } from './ai-chat-quota';

export type Common = { keys: string[]; sessionId: string; plan: AiChatPlan; apiKey: string };

/** Counts the session (the first call only), or lets a follow-up through; `refused` is set when the call must not go ahead. */
export async function begin({ keys, sessionId, plan }: Common) {
  const begun = await beginChat(keys, sessionId, plan, { app: PRACTICE_APP, limit: practiceLimit(plan) });
  const refused = refusal(begun, plan, 'practice_limit');
  const giveBack = async () => {
    if (begun.status === 'started') await releaseChat(keys, sessionId, PRACTICE_APP);
  };
  return { refused, giveBack };
}
