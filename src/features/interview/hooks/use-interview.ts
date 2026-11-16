import { useState } from 'react';

import { useDbMutation } from '@/db/use-db-mutation';
import { useDbQuery } from '@/db/use-db-query';
import { useCoachIdentity } from '@/features/coach';
import { useMasterContent } from '@/features/resume';
import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';

import { readCandidatePortfolio } from '../api/candidate-repo';
import { interviewErrorCode, requestReport, requestTurn } from '../api/client';
import { addAnswer, addTurn, createInterview, deleteInterview, listInterviews, listScores, previousAttempt, readInterview, saveReport, setStatus, type InterviewDetail, type InterviewStatus } from '../api/interview-repo';
import { candidateText } from '../lib/candidate';
import type { InterviewSetup } from '../lib/options';
import { compareReports, MIN_ANSWERS_FOR_REPORT, type Comparison } from '../lib/report';
import { answersGiven, followUpsInARow, questionsAsked, type StoredTurn } from '../lib/turn';

export const interviewKeys = {
  list: ['interview', 'list'] as const,
  scores: ['interview', 'scores'] as const,
  portfolio: ['interview', 'portfolio'] as const,
  detail: (id: string) => ['interview', 'detail', id] as const,
};

export const useInterviews = () => useDbQuery(interviewKeys.list, listInterviews);
export const useInterviewScores = () => useDbQuery(interviewKeys.scores, listScores);
export const useInterview = (id: string) => useDbQuery(interviewKeys.detail(id), (db) => readInterview(db, id));
export const useDeleteInterview = () => useDbMutation((db, id: string) => deleteInterview(db, id), { notify: false });

/**
 * What the interviewer may read about the learner: their résumé (the master profile the résumé builder keeps) and portfolio
 * projects as text. Empty until they have loaded, and when there is nothing to say.
 */
export function useCandidateText(): string {
  const master = useMasterContent();
  const portfolio = useDbQuery(interviewKeys.portfolio, readCandidatePortfolio);
  if (!master.content) return '';
  return candidateText({ resume: master.content, portfolio: portfolio.data ?? [], goal: master.goal, level: master.level ?? '' });
}

/** The résumé's own level and goal, to start the setup from what the learner already told Talino. */
export function useCandidateDefaults(): { goal: string; level: string | null } {
  const master = useMasterContent();
  return { goal: master.goal, level: master.level };
}

const stored = (messages: InterviewDetail['messages']): StoredTurn[] => messages.map((message) => ({ role: message.role, kind: message.kind }));
const plain = (messages: InterviewDetail['messages']) => messages.map((message) => ({ role: message.role, text: message.text }));

/**
 * Starts an interview: saves it, asks the interviewer for the opening and saves that. If the opening can't be had (offline, the
 * day's interviews used) nothing is left behind, so the history never shows an interview with no questions.
 */
export function useStartInterview() {
  const identity = useCoachIdentity();
  const candidate = useCandidateText();
  return useDbMutation(async (db, input: { id: string; setup: InterviewSetup }) => {
    await createInterview(db, input);
    try {
      const turn = await requestTurn(identity, { interviewId: input.id, setup: input.setup, notes: '', candidate: input.setup.useProfile ? candidate : '', asked: 0, answered: 0, followUps: 0, messages: [] });
      await addTurn(db, { id: newId(), interviewId: input.id, text: turn.reply, kind: turn.kind, topic: turn.topic, notes: turn.notes });
      return input.id;
    } catch (failure) {
      await deleteInterview(db, input.id);
      throw failure;
    }
  }, { notify: false });
}

export type SessionError = { code: string; text: string };

/**
 * One interview in progress. Sending saves the answer first (so it is never lost), asks the interviewer with the latest messages
 * and its own notes, and saves the reply. A failure keeps the answer and offers a retry that sends the same answer again.
 */
export function useInterviewSession(id: string) {
  const identity = useCoachIdentity();
  const candidate = useCandidateText();
  const detail = useInterview(id);
  const saveAnswer = useDbMutation((db, input: { id: string; text: string }) => addAnswer(db, { id: input.id, interviewId: id, text: input.text }), { notify: false });
  const saveTurn = useDbMutation((db, input: { text: string; kind: Parameters<typeof addTurn>[1]['kind']; topic: string; notes: string }) => addTurn(db, { id: newId(), interviewId: id, ...input }), { notify: false });
  const changeStatus = useDbMutation((db, next: InterviewStatus) => setStatus(db, id, next), { notify: false });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<SessionError | null>(null);

  const data = detail.data ?? null;
  const messages = data?.messages ?? [];
  const lastMessage = messages[messages.length - 1];
  const awaitingInterviewer = lastMessage?.role === 'user';

  const send = async (raw: string, retry = false) => {
    const text = raw.trim();
    if (!text || pending || !data) return;
    setError(null);
    setPending(true);
    try {
      let history = messages;
      if (!retry) {
        const answerId = newId();
        await saveAnswer.mutateAsync({ id: answerId, text });
        history = [...messages, { id: answerId, interview_id: id, role: 'user', text, kind: null, topic: null, created_at: '' }];
      }
      const turns = stored(history);
      const turn = await requestTurn(identity, {
        interviewId: id,
        setup: data.setup,
        notes: data.interview.notes,
        candidate: data.setup.useProfile ? candidate : '',
        asked: questionsAsked(turns),
        answered: answersGiven(turns),
        followUps: followUpsInARow(turns),
        messages: plain(history),
      });
      await saveTurn.mutateAsync({ text: turn.reply, kind: turn.kind, topic: turn.topic, notes: turn.notes });
    } catch (failure) {
      const code = interviewErrorCode(failure);
      if (code === 'unknown') reportError(failure, 'interview', { step: 'turn' });
      setError({ code, text });
    } finally {
      setPending(false);
    }
  };

  const unanswered = awaitingInterviewer ? lastMessage : null;
  return {
    detail: data,
    loading: detail.isPending,
    failed: detail.isError,
    refetch: detail.refetch,
    pending,
    error,
    send,
    /** Sends the last answer again when the interviewer never replied to it. */
    retry: () => (unanswered ? send(unanswered.text, true) : undefined),
    awaitingInterviewer,
    pause: () => changeStatus.mutateAsync('paused'),
    resume: () => changeStatus.mutateAsync('in_progress'),
    finish: () => changeStatus.mutateAsync('finished'),
  };
}

export type ReportState = { phase: 'idle' | 'working' | 'failed' | 'too_short'; code?: string };

/**
 * The evaluation of one interview: the saved one, or a request for it. An interview with fewer than two answers is never sent: the
 * learner is told there isn't enough to score, instead of getting a score made of nothing.
 */
export function useInterviewReport(id: string) {
  const identity = useCoachIdentity();
  const candidate = useCandidateText();
  const detail = useInterview(id);
  const scores = useInterviewScores();
  const save = useDbMutation((db, report: Parameters<typeof saveReport>[2]) => saveReport(db, id, report), { notify: false });
  const reopen = useDbMutation((db) => setStatus(db, id, 'in_progress'), { notify: false });
  const [state, setState] = useState<ReportState>({ phase: 'idle' });

  const data = detail.data ?? null;
  const answers = data ? answersGiven(data.messages) : 0;

  const generate = async () => {
    if (!data || state.phase === 'working') return;
    if (answers < MIN_ANSWERS_FOR_REPORT) {
      setState({ phase: 'too_short' });
      return;
    }
    setState({ phase: 'working' });
    try {
      const report = await requestReport(identity, { interviewId: id, setup: data.setup, notes: data.interview.notes, candidate: data.setup.useProfile ? candidate : '', messages: plain(data.messages) });
      await save.mutateAsync(report);
      setState({ phase: 'idle' });
    } catch (failure) {
      const code = interviewErrorCode(failure);
      if (code === 'unknown') reportError(failure, 'interview', { step: 'report' });
      setState(code === 'too_short' ? { phase: 'too_short' } : { phase: 'failed', code });
    }
  };

  const previous = data ? previousAttempt(scores.data ?? [], { id, title: data.interview.title }) : null;
  const comparison: Comparison | null = data?.report && previous?.report ? compareReports(previous.report, data.report) : null;
  return {
    detail: data,
    loading: detail.isPending,
    failed: detail.isError,
    refetch: detail.refetch,
    state,
    generate,
    answers,
    previous,
    comparison,
    /** Back to the interview to answer more (when there weren't enough answers to score). */
    resume: () => reopen.mutateAsync(),
  };
}
