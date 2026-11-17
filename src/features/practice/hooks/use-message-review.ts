import { useRef, useState } from 'react';

import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';

import { checkReviewText } from '../lib/review-input';
import { problemFrom, problemOfInput, type PracticeProblem } from '../lib/problem';
import type { MessageTask } from '../types';
import { useActivePracticeSession, useDeletePracticeSession, usePracticeHistory, usePracticeScores, usePracticeSession, useReviewMessage } from './use-practice';

export type UseMessageReviewOptions = {
  task: MessageTask;
  courseId?: string;
  lessonId?: string;
  projectId?: string;
  /** A real review came back (not "too short to judge"): called once per review. */
  onComplete: () => void;
};

/**
 * One message task on the screen. The learner's text stays in the box (the view keeps it) when a review fails, a retry reuses the same
 * session so nothing is counted twice, and a message that is too short or copied from the task is stopped here without asking the server.
 */
export function useMessageReview({ task, courseId, lessonId, projectId, onComplete }: UseMessageReviewOptions) {
  const history = usePracticeHistory(task.id);
  const scores = usePracticeScores(task.id);
  const active = useActivePracticeSession(task.id);
  const reviewMutation = useReviewMessage();
  const removeMutation = useDeletePracticeSession();
  const [shownId, setShownId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [problem, setProblem] = useState<PracticeProblem | null>(null);
  // A failed request leaves its session open; asking again under the same id keeps it one try, not two.
  const retrying = useRef<string | null>(null);

  const shown = usePracticeSession(shownId ?? '');
  const loading = history.isPending || scores.isPending || active.isPending;
  const failed = history.isError || scores.isError || active.isError;

  const submit = async (text: string, previous?: string) => {
    if (pending) return;
    const check = checkReviewText(task, text);
    if (!check.ok) {
      setProblem(problemOfInput(check));
      return;
    }
    setProblem(null);
    setPending(true);
    // An unfinished session of this task (a request that never came back) is picked up again instead of left behind.
    const sessionId = retrying.current ?? active.data?.id ?? newId();
    retrying.current = sessionId;
    try {
      const review = await reviewMutation.mutateAsync({ sessionId, task, text: text.trim(), ...(previous?.trim() ? { previous: previous.trim() } : {}), courseId, lessonId, projectId });
      retrying.current = null;
      setShownId(sessionId);
      if (!review.tooShort) onComplete();
    } catch (error) {
      const found = problemFrom(error);
      if (found.code === 'unknown') reportError(error, 'practice', { step: 'review' });
      setProblem(found);
    } finally {
      setPending(false);
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
    clearProblem: () => setProblem(null),
    submit,
    /** The review on show: the one just received, or a past one the learner opened. */
    shownId,
    shown: shownId ? (shown.data ?? null) : null,
    show: (id: string | null) => setShownId(id),
    history: history.data ?? [],
    scores: scores.data ?? { attempts: 0, best: null, latest: null },
    remove: (id: string) => removeMutation.mutateAsync(id),
  };
}
