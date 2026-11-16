import { useRef, useState } from 'react';

import { useLocalized } from '@/hooks/use-strings';
import { successFeedback, tapFeedback } from '@/lib/haptics';

import { checkActivity } from '../lib/check';
import { availableHints, nextHint, shouldOfferHint, shownHints, type NextHint } from '../lib/hints';
import { mascotMood } from '../lib/mascot';
import { activityStrings, type ActivityText } from '../strings';
import type { Activity, ActivityAnswer, CheckResult, Guidance } from '../types';

export type AttemptEvent = { activityId: string; correct: boolean; hintsUsed: number };
export type SolvedEvent = { activityId: string; attempts: number; wrong: number; hintsUsed: number };

export type UseActivitySessionOptions = {
  activity: Activity;
  guidance: Guidance;
  onAttempt: (event: AttemptEvent) => void;
  onSolved: (event: SolvedEvent) => void;
  /** Already solved in an earlier visit: practice again without reporting a second solve. */
  solvedBefore: boolean;
};

export type ActivitySession = {
  activity: Activity;
  text: ActivityText;
  guidance: Guidance;
  attempts: number;
  wrong: number;
  hintsUsed: number;
  /** Solved during this visit. */
  done: boolean;
  solvedBefore: boolean;
  checking: boolean;
  result: CheckResult | null;
  last: 'hint' | 'wrong' | 'solved' | null;
  mood: ReturnType<typeof mascotMood>;
  shown: string[];
  /** How many hints this learner may see in all. */
  hintTotal: number;
  next: NextHint | null;
  offerHint: boolean;
  /** Checks an answer: counts the try, reports it and, the first time it is right, reports the solve. */
  check: (answer: ActivityAnswer) => Promise<CheckResult | null>;
  revealHint: () => void;
  /** Clears the feedback so the learner can try again. */
  dismiss: () => void;
};

/** One activity's attempts, hints and feedback. The views call `check`; this reports every try and the solve once. */
export function useActivitySession({ activity, guidance, onAttempt, onSolved, solvedBefore }: UseActivitySessionOptions): ActivitySession {
  const text = useLocalized(activityStrings);
  const [attempts, setAttempts] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [done, setDone] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [last, setLast] = useState<ActivitySession['last']>(null);
  // Plain counters mirror the state so the callbacks always see the latest numbers, even for quick taps.
  const counts = useRef({ attempts: 0, wrong: 0, hints: 0, solved: solvedBefore, busy: false });

  const check = async (answer: ActivityAnswer) => {
    if (counts.current.busy) return null;
    counts.current.busy = true;
    setChecking(true);
    try {
      const outcome = await checkActivity(activity, answer, text);
      if (outcome.progress) {
        // A step forward (the right line, one more pair), not a try at the whole answer: show it, don't count it.
        setResult(outcome);
        return outcome;
      }
      counts.current.attempts += 1;
      setAttempts(counts.current.attempts);
      setResult(outcome);
      onAttempt({ activityId: activity.id, correct: outcome.correct, hintsUsed: counts.current.hints });
      if (outcome.correct) {
        successFeedback();
        setLast('solved');
        setDone(true);
        // Reported once per activity, however many times it is practised again.
        if (!counts.current.solved) {
          counts.current.solved = true;
          onSolved({ activityId: activity.id, attempts: counts.current.attempts, wrong: counts.current.wrong, hintsUsed: counts.current.hints });
        }
      } else {
        tapFeedback();
        counts.current.wrong += 1;
        setWrong(counts.current.wrong);
        setLast('wrong');
      }
      return outcome;
    } finally {
      counts.current.busy = false;
      setChecking(false);
    }
  };

  const revealHint = () => {
    const available = nextHint(activity.hints, guidance, counts.current.hints);
    if (!available) return;
    tapFeedback();
    counts.current.hints += 1;
    setHintsUsed(counts.current.hints);
    setLast('hint');
  };

  return {
    activity,
    text,
    guidance,
    attempts,
    wrong,
    hintsUsed,
    done,
    solvedBefore,
    checking,
    result,
    last,
    mood: mascotMood({ last, wrongTries: wrong, hintsUsed }),
    shown: shownHints(activity.hints, guidance, hintsUsed),
    hintTotal: availableHints(activity.hints, guidance).length,
    next: nextHint(activity.hints, guidance, hintsUsed),
    offerHint: !done && shouldOfferHint(guidance, wrong, hintsUsed, activity.hints),
    check,
    revealHint,
    dismiss: () => setResult(null),
  };
}
