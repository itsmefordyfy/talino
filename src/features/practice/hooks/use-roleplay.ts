import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';

import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';

import { readSession } from '../api/practice-repo';
import { phaseOf, learnerTurns, roleplayComplete, type Phase } from '../lib/session';
import { problemFrom, type PracticeProblem } from '../lib/problem';
import type { PracticeMessage } from '../lib/sanitize';
import type { RoleplayScenario } from '../types';
import { useAbandonPracticeSession, useActivePracticeSession, useDeletePracticeSession, useFinishRoleplay, usePracticeHistory, usePracticeScores, usePracticeSession, useSendLearnerTurn, useStartPracticeSession } from './use-practice';

export type UseRoleplayOptions = {
  scenario: RoleplayScenario;
  courseId?: string;
  lessonId?: string;
  /** The conversation was judged: the debrief arrived for at least `minTurns` turns. Called once per finished session. */
  onComplete: () => void;
};

/**
 * One role-play on the screen. Everything the learner says is saved on the phone before the server is asked, so a failed request keeps their
 * words and a retry sends the very same message again (it never saves twice). The conversation's own state (turns, phase) is worked out from
 * what is saved; only "the partner closed it" is remembered in memory, because the server's reply says so once.
 */
export function useRoleplay({ scenario, courseId, lessonId, onComplete }: UseRoleplayOptions) {
  const db = useSQLiteContext();
  const active = useActivePracticeSession(scenario.id);
  const history = usePracticeHistory(scenario.id);
  const scores = usePracticeScores(scenario.id);
  const startMutation = useStartPracticeSession();
  const sendMutation = useSendLearnerTurn();
  const finishMutation = useFinishRoleplay();
  const abandonMutation = useAbandonPracticeSession();
  const removeMutation = useDeletePracticeSession();

  // `undefined`: follow the unfinished session the phone already holds (opening the lesson again); `null`: none chosen (the start screen).
  const [chosen, setChosen] = useState<string | null | undefined>(undefined);
  const [partnerEnded, setPartnerEnded] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [starting, setStarting] = useState(false);
  const [problem, setProblem] = useState<(PracticeProblem & { step: 'turn' | 'report' }) | null>(null);

  const sessionId = chosen === undefined ? (active.data?.id ?? null) : chosen;
  const detail = usePracticeSession(sessionId ?? '');
  const data = sessionId ? (detail.data ?? null) : null;
  const messages: PracticeMessage[] = (data?.messages ?? []).map((message) => ({ role: message.role, text: message.text }));
  const status = data?.session.status ?? null;
  const ended = partnerEnded !== null && partnerEnded === sessionId;
  const phase: Phase = phaseOf(scenario, messages, ended);
  const last = data?.messages[data.messages.length - 1];
  // The last thing said was the learner's: the partner never replied (an error, or the app closed mid-request).
  const stuck = status === 'active' && last?.role === 'user' && !sending;

  const loading = active.isPending || history.isPending || scores.isPending || (sessionId !== null && detail.isPending);
  const failed = active.isError || history.isError || scores.isError || (sessionId !== null && detail.isError);
  const refetch = () => {
    void active.refetch();
    void history.refetch();
    void scores.refetch();
    if (sessionId) void detail.refetch();
  };

  const start = async () => {
    if (starting) return;
    setStarting(true);
    setProblem(null);
    try {
      const id = newId();
      await startMutation.mutateAsync({ id, itemId: scenario.id, kind: 'roleplay', courseId, lessonId, opening: scenario.opening });
      setPartnerEnded(null);
      setChosen(id);
    } catch (error) {
      reportError(error, 'practice', { step: 'start' });
      setProblem({ ...problemFrom(error), step: 'turn' });
    } finally {
      setStarting(false);
    }
  };

  const finish = async (id: string): Promise<void> => {
    setFinishing(true);
    setProblem(null);
    try {
      const report = await finishMutation.mutateAsync({ sessionId: id, scenario });
      const fresh = await readSession(db, id);
      if (roleplayComplete(scenario, (fresh?.messages ?? []).map((message) => ({ role: message.role, text: message.text })), report)) onComplete();
    } catch (error) {
      const found = problemFrom(error);
      if (found.code === 'unknown') reportError(error, 'practice', { step: 'report' });
      setProblem({ ...found, step: 'report' });
    } finally {
      setFinishing(false);
    }
  };

  /** Says something (a new message), or sends a saved one again (`again`, the id and text of the stuck message). */
  const send = async (raw: string, again?: { id: string }) => {
    const text = raw.trim();
    if (!text || sending || finishing || !sessionId) return;
    setProblem(null);
    setSending(true);
    const messageId = again?.id ?? newId();
    let reachedEnd = false;
    try {
      const turn = await sendMutation.mutateAsync({ sessionId, scenario, messageId, text });
      // The turn count includes the message just sent whether it was new or a retry of one already saved.
      const saved = data?.messages.some((message) => message.id === messageId) ?? false;
      const turns = learnerTurns(messages) + (saved ? 0 : 1);
      if (turn.end) setPartnerEnded(sessionId);
      reachedEnd = turn.end || turns >= scenario.maxTurns;
    } catch (error) {
      const found = problemFrom(error);
      if (found.code === 'unknown') reportError(error, 'practice', { step: 'turn' });
      setProblem({ ...found, step: 'turn' });
    } finally {
      setSending(false);
    }
    // The last turn, or the partner closing it, goes straight to the feedback: nothing more can be said.
    if (reachedEnd) await finish(sessionId);
  };

  const retry = () => {
    if (!sessionId) return;
    if (problem?.step === 'report' || phase === 'must-end') return finish(sessionId);
    if (last?.role === 'user') return send(last.text, { id: last.id });
  };

  const end = () => (sessionId ? finish(sessionId) : undefined);
  const startOver = async () => {
    if (sessionId && status === 'active') await abandonMutation.mutateAsync(sessionId);
    setPartnerEnded(null);
    await start();
  };

  return {
    loading,
    failed,
    refetch,
    scenario,
    sessionId,
    detail: data,
    messages,
    status,
    phase,
    partnerEnded: ended,
    stuck,
    sending,
    finishing,
    starting,
    problem,
    clearProblem: () => setProblem(null),
    history: history.data ?? [],
    scores: scores.data ?? { attempts: 0, best: null, latest: null },
    unfinished: active.data ?? null,
    start,
    send,
    retry,
    end,
    startOver,
    /** Back to the start screen (after the feedback, to read the history). */
    leave: () => setChosen(null),
    open: (id: string) => setChosen(id),
    remove: (id: string) => removeMutation.mutateAsync(id),
  };
}
