import { use, useEffect, useState } from 'react';

import { VisualAutoplayContext } from './visual-autoplay';

/** A cheap fingerprint of a step list: its length and its first and last step. Equal lists give equal fingerprints. */
function stepsSignature(steps: readonly unknown[]): string {
  if (steps.length === 0) return '0';
  return `${steps.length}|${JSON.stringify(steps[0])}|${JSON.stringify(steps[steps.length - 1])}`;
}

/**
 * Steps through a precomputed list of states (an algorithm's snapshots, a request's stages): back, next,
 * reset and a play loop the learner starts and can stop at any step. The list itself is computed by a
 * pure function elsewhere, so the logic is tested without the screen.
 */
export function useStepper<T>(steps: readonly T[], options: { intervalMs?: number } = {}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = Math.max(0, steps.length - 1);
  // A different list (the learner changed an input) starts over at its first step. Compared by content, not identity: a visual that
  // rebuilds an equal list on every render must not reset itself (that looped forever).
  const signature = stepsSignature(steps);
  const [seen, setSeen] = useState(signature);
  if (seen !== signature) {
    setSeen(signature);
    setIndex(0);
    setPlaying(false);
  }
  const at = Math.min(index, last);

  // While a lesson's audio is describing this visual it starts over and plays by itself; when the voice moves on it stops where it is.
  const narrated = use(VisualAutoplayContext);
  const [wasNarrated, setWasNarrated] = useState(false);
  if (narrated !== wasNarrated) {
    setWasNarrated(narrated);
    if (narrated) setIndex(0);
    setPlaying(narrated);
  }

  useEffect(() => {
    if (!playing || at >= last) return;
    const timer = setTimeout(() => setIndex((current) => Math.min(current + 1, last)), options.intervalMs ?? 900);
    return () => clearTimeout(timer);
  }, [playing, at, last, options.intervalMs]);

  return {
    index: at,
    step: steps[at] as T,
    count: steps.length,
    atStart: at === 0,
    atEnd: at >= last,
    // Reaching the last step stops the play loop: it shows as stopped without a state change in an effect.
    playing: playing && at < last,
    next: () => {
      setPlaying(false);
      setIndex(Math.min(at + 1, last));
    },
    back: () => {
      setPlaying(false);
      setIndex(Math.max(at - 1, 0));
    },
    reset: () => {
      setPlaying(false);
      setIndex(0);
    },
    toggle: () => {
      if (at >= last) setIndex(0);
      setPlaying((current) => !current);
    },
    goTo: (target: number) => {
      setPlaying(false);
      setIndex(Math.min(Math.max(0, target), last));
    },
  };
}

export type Stepper<T> = ReturnType<typeof useStepper<T>>;
