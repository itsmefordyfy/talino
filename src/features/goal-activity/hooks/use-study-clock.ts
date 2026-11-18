import { useEffect } from 'react';
import { AppState } from 'react-native';

import { addStudyMs, flushStudy } from '../api/study-clock';
import { elapsedStep } from '../lib/study-time';

/** How often the open lesson adds the time that passed. */
export const STUDY_TICK_MS = 1_000;

/**
 * Counts the time the learner spends in an open lesson (reading, listening, the quiz and the practice) toward today's goal. Mount it once
 * in the lesson screen: it ticks only while the app is in front, adds what `elapsedStep` allows, and stops, saving, when the app goes
 * to the background or the lesson closes. `enabled` is false for a lesson that is locked (nothing is being learned there).
 */
export function useStudyClock(enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    let last: number | null = AppState.currentState === 'active' ? Date.now() : null;

    const tick = () => {
      const now = Date.now();
      addStudyMs(elapsedStep(last, now), now);
      last = now;
    };
    const timer = setInterval(() => {
      if (last !== null) tick();
    }, STUDY_TICK_MS);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        last = Date.now();
        return;
      }
      if (last !== null) tick();
      last = null;
      flushStudy();
    });

    return () => {
      clearInterval(timer);
      subscription.remove();
      if (last !== null) tick();
      flushStudy();
    };
  }, [enabled]);
}
