import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import type { AiChatQuota } from '@/constants/ai-chat';
import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';
import { COURSES, useLearning } from '@/features/courses';
import { buildCoachProfileContext, useLearningPlan } from '@/features/onboarding';
import { selectCompanion, selectGoal } from '@/features/settings/settings-slice';
import { useAccess } from '@/features/store';
import { useLanguage } from '@/hooks/use-strings';
import { SERVER_CONFIGURED } from '@/lib/api';
import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';
import { useAppSelector } from '@/store/hooks';

import { askCoach, coachErrorCode, fetchUsage, type ChatTurn, type CoachIdentity } from '../api/client';
import { addMessage, deleteChat, listChats, readChat } from '../api/chat-repo';
import type { CoachFocus } from '../lib/focus';
import type { CoachContext, LearningSummary } from '../lib/prompt';

export function useCoachIdentity(): CoachIdentity {
  const { customer } = useAccess();
  return { appUserId: customer?.appUserId || null, entitlements: customer?.entitlements ?? [] };
}

/**
 * What Tali may know: the goal, the courses being taken, where the learner is, how far along, and what they have open right
 * now (`focus`, ids only). Nothing personal; the server checks every field against the catalog.
 */
export function useCoachContext(focus: CoachFocus | null = null): CoachContext {
  const goal = useAppSelector(selectGoal);
  const companion = useAppSelector(selectCompanion);
  const learning = useLearning();
  const started = learning.progress.filter((entry) => entry.started);
  const courses = started.map((entry) => COURSES.find((course) => course.id === entry.courseId)?.title).filter((title): title is string => !!title);
  const current = started.find((entry) => !entry.complete && entry.nextLesson);
  const course = current ? COURSES.find((entry) => entry.id === current.courseId) : null;
  const progress = current && course ? `${course.title}, day ${current.nextLesson?.day} of ${current.lessonsTotal}` : null;
  const { profile, plan } = useLearningPlan();
  return { goal, courses, progress, profile: buildCoachProfileContext(profile, plan?.startCourse.title ?? null), companion, focus, learning: summarizeLearning(learning) };
}

/** Counts for up to five of the courses started, and the lessons finished most recently. */
function summarizeLearning(learning: ReturnType<typeof useLearning>): LearningSummary | null {
  const courses = learning.progress.filter((entry) => entry.started).slice(0, 5).map((entry) => ({ courseId: entry.courseId, done: entry.lessonsDone, total: entry.lessonsTotal }));
  const recent = (learning.data?.lessons ?? [])
    .filter((row) => row.completed_at != null)
    .sort((a, b) => String(b.completed_at).localeCompare(String(a.completed_at)))
    .slice(0, 8)
    .map((row) => row.lesson_id);
  return courses.length > 0 || recent.length > 0 ? { courses, recent } : null;
}

export const coachKeys = { usage: ['coach', 'usage'] as const, chats: ['coach', 'chats'] as const, chat: (id: string) => ['coach', 'chat', id] as const };

/** The chat allowance as the server reports it (server state, not refetched by local writes). */
export function useCoachUsage() {
  const identity = useCoachIdentity();
  return useQuery({ queryKey: [...coachKeys.usage, identity.entitlements.length > 0], queryFn: () => fetchUsage(identity), enabled: SERVER_CONFIGURED, retry: 1, staleTime: 60_000, networkMode: 'online', meta: { server: true } });
}

export function useChatList() {
  return useDbQuery(coachKeys.chats, listChats);
}

export function useDeleteChat() {
  return useDbMutation((db, chatId: string) => deleteChat(db, chatId), { notify: false });
}

/**
 * One conversation with Tali. A new chat gets its id when it opens (the server counts chats by it,
 * so follow-ups are free); it is saved on the phone with its first message.
 */
export function useCoachChat(initial: { chatId: string | null; mode: string; focus?: CoachFocus | null }) {
  const [chatId] = useState(() => initial.chatId ?? newId());
  const identity = useCoachIdentity();
  const context = useCoachContext(initial.focus ?? null);
  const language = useLanguage();
  const queryClient = useQueryClient();
  const saved = useDbQuery(coachKeys.chat(chatId), (db) => readChat(db, chatId));
  const save = useDbMutation((db, input: { role: 'user' | 'assistant'; text: string; mode: string }) => addMessage(db, { chatId, ...input }), { notify: false });
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<{ code: string; quota: AiChatQuota | null; text: string } | null>(null);
  const [quota, setQuota] = useState<AiChatQuota | null>(null);

  const mode = saved.data?.chat?.mode ?? initial.mode;
  const turns: ChatTurn[] = (saved.data?.messages ?? []).map((message) => ({ role: message.role, text: message.text }));

  const send = async (raw: string, retry = false) => {
    const text = raw.trim();
    if (!text || pending !== null) return;
    setError(null);
    setPending(text);
    try {
      // A retry re-sends the question already saved; a new one is saved first, so it is never lost.
      if (!retry) await save.mutateAsync({ role: 'user', text, mode });
      const history = retry ? turns : [...turns, { role: 'user' as const, text }];
      const answer = await askCoach(identity, { coachMode: mode, conversationId: chatId, messages: history, context, language });
      await save.mutateAsync({ role: 'assistant', text: answer.reply, mode });
      if (answer.quota) {
        setQuota(answer.quota);
        queryClient.setQueryData([...coachKeys.usage, identity.entitlements.length > 0], answer.quota);
      }
    } catch (failure) {
      const code = coachErrorCode(failure);
      if (code === 'unknown') reportError(failure, 'coach');
      const body = (failure as { body?: Record<string, unknown> }).body;
      setError({ code, quota: (body?.quota as AiChatQuota | undefined) ?? null, text });
    } finally {
      setPending(null);
    }
  };

  const lastUser = [...turns].reverse().find((turn) => turn.role === 'user');
  const awaitingAnswer = turns.length > 0 && turns[turns.length - 1].role === 'user';
  return {
    chatId,
    mode,
    turns,
    loading: saved.isPending,
    pending,
    error,
    quota,
    send,
    /** Sends the last unanswered question again. */
    retry: () => (awaitingAnswer && lastUser ? send(lastUser.text, true) : undefined),
  };
}
