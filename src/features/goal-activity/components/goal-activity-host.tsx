import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { selectCompanion, selectDailyMinutes } from '@/features/settings/settings-slice';
import { useOnAppActive } from '@/hooks/use-on-app-active';
import { todayISO } from '@/lib/dates';
import { useAppSelector } from '@/store/hooks';

import { flushStudy, getStudiedMs, subscribeStudy } from '../api/study-clock';
import { syncGoalActivity } from '../live-activity/goal-activity';

/** Lesson time arrives every second; the card is looked at no more often than this (the activity decides what is worth sending). */
const STUDY_SYNC_EVERY_MS = 5_000;

/**
 * Keeps the Lock Screen goal card (iOS Live Activity) in step with the daily goal and today's learning time: when the app opens or comes
 * back, when the goal or the coach changes, and as lesson time is added. It renders nothing and reads the clock outside React, so a
 * lesson ticking every second never re-renders anything.
 */
export function GoalActivityHost() {
  const goalMinutes = useAppSelector(selectDailyMinutes);
  const companion = useAppSelector(selectCompanion);
  // One run at a time, always for the latest values, so two quick changes can't start two cards.
  const latest = useRef({ goalMinutes, companion });
  const running = useRef<Promise<void>>(Promise.resolve());
  const lastStudySync = useRef(0);

  const sync = () => {
    running.current = running.current.then(() => {
      const day = todayISO();
      return syncGoalActivity({ goalMinutes: latest.current.goalMinutes, companion: latest.current.companion, studiedMs: getStudiedMs(day), day });
    });
  };

  useEffect(() => {
    latest.current = { goalMinutes, companion };
    sync();
  }, [goalMinutes, companion]);

  useEffect(
    () =>
      subscribeStudy(() => {
        const now = Date.now();
        if (now - lastStudySync.current < STUDY_SYNC_EVERY_MS) return;
        lastStudySync.current = now;
        sync();
      }),
    [],
  );

  useOnAppActive(sync);

  // Going to the background: what was counted is saved, and the card gets its latest figures while the app can still send them.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'background') return;
      flushStudy();
      sync();
    });
    return () => subscription.remove();
  }, []);

  return null;
}
