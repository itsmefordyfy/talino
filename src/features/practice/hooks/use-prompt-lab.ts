import { useRef, useState } from 'react';

import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';

import { checkLabPrompts, labRunsOf, type LabRunRecord } from '../lib/lab-input';
import type { LabRun } from '../lib/lab-run';
import { problemFrom, type PracticeProblem } from '../lib/problem';
import type { LabTask } from '../types';
import { useActivePracticeSession, useDeletePracticeSession, usePracticeHistory, usePracticeScores, usePracticeSession, useReviewLab, useRunLab } from './use-practice';

export type UsePromptLabOptions = {
  lab: LabTask;
  courseId?: string;
  lessonId?: string;
  projectId?: string;
  /** The review arrived (any score): called once per review. */
  onComplete: () => void;
};

/**
 * One prompt lab on the screen. A session is the runs of one try and its review: the first run counts against the day's allowance, the others and the
 * review are free. The learner's prompt stays in the editor (the view keeps it) when a run fails, a retry reuses the same session so nothing is counted
 * twice, and a prompt that is too short or still the starter is stopped here without asking the server. The latest live run is kept in memory with its
 * measured numbers and tool steps; an earlier visit's runs come back from the saved messages (text only).
 */
export function usePromptLab({ lab, courseId, lessonId, projectId, onComplete }: UsePromptLabOptions) {
  const history = usePracticeHistory(lab.id);
  const scores = usePracticeScores(lab.id);
  const active = useActivePracticeSession(lab.id);
  const runMutation = useRunLab();
  const reviewMutation = useReviewLab();
  const removeMutation = useDeletePracticeSession();
  // The session being worked in: one made when the first run is asked, or (before that) an unfinished one from an earlier visit.
  const [ownId, setOwnId] = useState<string | null>(null);
  const [live, setLive] = useState<{ run: LabRun; runNumber: number } | null>(null);
  const [shownId, setShownId] = useState<string | null>(null);
  const [pending, setPending] = useState<'run' | 'review' | null>(null);
  const [problem, setProblem] = useState<PracticeProblem | null>(null);
  // Which step the problem belongs to, so Try again repeats that step and not the other one.
  const [failedStep, setFailedStep] = useState<'run' | 'review'>('run');
  const sending = useRef(false);

  const currentId = ownId ?? active.data?.id ?? null;
  const detail = usePracticeSession(currentId ?? '');
  const shown = usePracticeSession(shownId ?? '');
  const saved: LabRunRecord[] = currentId && detail.data?.session.status === 'active' ? labRunsOf(lab, detail.data.messages) : [];
  const runsDone = Math.max(saved.length, live?.runNumber ?? 0);
  const loading = history.isPending || scores.isPending || active.isPending;
  const failed = history.isError || scores.isError || active.isError;

  const run = async (prompts: readonly string[]) => {
    if (sending.current || runsDone >= lab.maxRuns) return;
    const checked = checkLabPrompts(lab, prompts);
    if (!checked.ok) {
      setFailedStep('run');
      setProblem({ code: checked.reason, resetsAt: null });
      return;
    }
    sending.current = true;
    setProblem(null);
    setPending('run');
    const sessionId = currentId ?? newId();
    setOwnId(sessionId);
    const runNumber = runsDone + 1;
    try {
      const result = await runMutation.mutateAsync({ sessionId, lab, runNumber, prompts: prompts.map((prompt) => prompt.trim()), courseId, lessonId, projectId });
      setLive({ run: result, runNumber });
    } catch (error) {
      const found = problemFrom(error);
      if (found.code === 'unknown') reportError(error, 'practice', { step: 'lab-run' });
      setFailedStep('run');
      setProblem(found);
    } finally {
      sending.current = false;
      setPending(null);
    }
  };

  const review = async () => {
    const latest = saved[saved.length - 1];
    if (sending.current || !currentId || !latest) return;
    sending.current = true;
    setProblem(null);
    setPending('review');
    const current = live && live.runNumber === saved.length ? live.run : null;
    try {
      await reviewMutation.mutateAsync({
        sessionId: currentId,
        lab,
        prompts: latest.prompts,
        outputs: latest.outputs,
        toolSteps: current?.outputs[0]?.toolSteps,
      });
      setShownId(currentId);
      // The session is finished: the next run is a new try with its own id.
      setOwnId(null);
      setLive(null);
      onComplete();
    } catch (error) {
      const found = problemFrom(error);
      if (found.code === 'unknown') reportError(error, 'practice', { step: 'lab-review' });
      setFailedStep('review');
      setProblem(found);
    } finally {
      sending.current = false;
      setPending(null);
    }
  };

  return {
    loading,
    failed,
    refetch: () => {
      void history.refetch();
      void scores.refetch();
      void active.refetch();
    },
    pending,
    problem,
    failedStep,
    clearProblem: () => setProblem(null),
    run,
    review,
    /** The runs saved in the open session, oldest first. */
    saved,
    /** The latest run as it just came back, with its measured numbers and tool steps; null after a visit or a review. */
    live: live && live.runNumber === runsDone ? live.run : null,
    runsDone,
    runsLeft: Math.max(0, lab.maxRuns - runsDone),
    shownId,
    shown: shownId ? (shown.data ?? null) : null,
    show: (id: string | null) => setShownId(id),
    history: history.data ?? [],
    scores: scores.data ?? { attempts: 0, best: null, latest: null },
    remove: (id: string) => removeMutation.mutateAsync(id),
  };
}
