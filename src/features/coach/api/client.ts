import type { AiChatQuota } from '@/constants/ai-chat';
import type { ExperienceLevel } from '@/features/courses/content/levels';
import { ApiError, postJson } from '@/lib/api';
import { deviceId } from '@/lib/device-id';
import type { Language } from '@/lib/language';

import { trimTurns } from '../lib/history';
import type { CoachContext } from '../lib/prompt';
import type { ProjectReview } from '../lib/review';
import type { Tailoring } from '../lib/tailor';

/** Who is asking: this phone's id, the store customer id, and what the app believes was bought (the server asks RevenueCat). */
export type CoachIdentity = { appUserId: string | null; entitlements: string[] };

const who = (identity: CoachIdentity) => ({ deviceId: deviceId(), appUserId: identity.appUserId, entitlements: identity.entitlements });

/**
 * Why Tali couldn't answer. `chat_limit` (today's new chats are used), `course_required` (a course
 * role or review the learner doesn't own), `all_access_required`, `review_limit`, `tailor_limit`,
 * `chat_in_progress`, `conversation_full`, `busy`, `unavailable`, `quota_unavailable`, `network`,
 * `unknown`. None of them uses up anything.
 */
export type CoachErrorCode = string;

export function coachErrorCode(error: unknown): CoachErrorCode {
  if (error instanceof ApiError) {
    if (error.status === 429 && error.code === 'unknown') return 'chat_limit';
    if ((error.status === 503 || error.status === 504) && error.code === 'unknown') return 'busy';
    return error.code;
  }
  return 'unknown';
}

export function parseQuota(value: unknown): AiChatQuota | null {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;
  const resetsAt = typeof record.resetsAt === 'string' && Number.isFinite(Date.parse(record.resetsAt)) ? record.resetsAt : null;
  if (record.plan === 'pro') return { plan: 'pro', resetsAt };
  if (record.plan === 'free' && typeof record.remaining === 'number' && typeof record.limit === 'number') return { plan: 'free', remaining: Math.max(0, Math.floor(record.remaining)), limit: Math.max(0, Math.floor(record.limit)), resetsAt };
  return null;
}

export type ChatTurn = { role: 'user' | 'assistant'; text: string };

export async function askCoach(identity: CoachIdentity, input: { coachMode: string; conversationId: string; messages: readonly ChatTurn[]; context: CoachContext; language: Language }): Promise<{ reply: string; quota: AiChatQuota | null }> {
  const body = await postJson('/api/coach', { ...who(identity), mode: 'chat', ...input, messages: trimTurns(input.messages) });
  const reply = typeof body.reply === 'string' ? body.reply.trim() : '';
  if (!reply) throw new ApiError('unknown');
  return { reply, quota: parseQuota(body.quota) };
}

export async function fetchUsage(identity: CoachIdentity): Promise<AiChatQuota | null> {
  return parseQuota((await postJson('/api/coach', { ...who(identity), mode: 'usage' }, { timeoutMs: 15_000 })).quota);
}

export async function requestReview(identity: CoachIdentity, input: { projectId: string; reviewId: string; link: string; submission: string; language: Language; /** The level the learner was shown the project for; the server builds that level's rubric. */ level?: ExperienceLevel | null }): Promise<{ review: ProjectReview; token: string | null }> {
  const body = await postJson('/api/coach', { ...who(identity), mode: 'review', ...input }, { timeoutMs: 60_000 });
  const review = body.review as ProjectReview | undefined;
  if (!review || (review.verdict !== 'pass' && review.verdict !== 'needs_work') || typeof review.summary !== 'string' || !Array.isArray(review.checks)) throw new ApiError('unknown');
  return { review, token: typeof body.token === 'string' ? body.token : null };
}

export async function requestTailoring(identity: CoachIdentity, input: { requestId: string; jobPost: string; resume: string }): Promise<Tailoring> {
  const body = await postJson('/api/coach', { ...who(identity), mode: 'tailor', ...input }, { timeoutMs: 60_000 });
  const tailoring = body.tailoring as Tailoring | undefined;
  if (!tailoring || typeof tailoring.summary !== 'string' || !Array.isArray(tailoring.highlights)) throw new ApiError('unknown');
  return tailoring;
}
