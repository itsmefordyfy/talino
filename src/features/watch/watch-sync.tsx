import kvStore from 'expo-sqlite/kv-store';
import { useEffect, useRef, useSyncExternalStore } from 'react';

import { canJumpBySentence, getListenSnapshot, getCourse, localizedCourse, skipSegment, subscribeListen, togglePlayPause, useLearning } from '@/features/courses';
import { useLearningPlan } from '@/features/onboarding';
import { selectFocusCourseId } from '@/features/settings/settings-slice';
import { useAccess } from '@/features/store';
import { lessonsThisWeek, pickFocusCourse } from '@/features/today';
import { useOnAppActive } from '@/hooks/use-on-app-active';
import { useLanguage } from '@/hooks/use-strings';
import { todayISO } from '@/lib/dates';
import { createResultLedger } from '@/lib/result-ledger';
import { useAppSelector } from '@/store/hooks';

import { onWatchCommand, pushSnapshot, watchStatus } from './bridge';
import { handleWatchCommand, type CommandContext } from './commands';
import { toWatchSnapshot } from './lib/snapshot';
import type { WatchResult, WatchSnapshot } from './types';

/** Learning changes come in bursts (a lesson, then a badge); push once they settle. */
const DEBOUNCE_MS = 700;
const LEDGER_KEY = 'watch.ledger';

const ledger = createResultLedger<WatchResult>({ read: () => kvStore.getItemSync(LEDGER_KEY), write: (value) => kvStore.setItemSync(LEDGER_KEY, value) });

/**
 * Whether there is a Watch to send to: a paired one with Talino installed (or running). Without it nothing is pushed, so an iPhone
 * with no Watch, or a build without the Watch app, does none of this work.
 */
function watchIsThere(): boolean {
  const status = watchStatus();
  return !!status?.supported && !!status.paired && (!!status.installed || !!status.reachable);
}

/**
 * Headless component mounted once at the root, like `DailyReminderSync`. Keeps the Apple Watch in step with the learner's streak,
 * week, next lesson and what Listen is reading (after every change, on return to the app), and runs the Listen commands the Watch
 * sends. The Watch only mirrors the learner's own figures to the learner's own wrist: nothing is shared and nothing is written to the
 * database from here.
 */
export function WatchSync() {
  const learning = useLearning();
  const { plan } = useLearningPlan();
  const access = useAccess();
  const language = useLanguage();
  const chosen = useAppSelector(selectFocusCourseId);
  const listen = useSyncExternalStore(subscribeListen, getListenSnapshot);

  // The same lesson Today leads with (the course the learner chose, else the one under way, else the starter).
  const focusId = pickFocusCourse(learning.progress, chosen, access.owns);
  const course = localizedCourse(getCourse(focusId), language);
  const next = learning.progressFor(focusId)?.nextLesson ?? null;

  const build = (): WatchSnapshot => {
    const today = todayISO();
    return toWatchSnapshot({
      now: Date.now(),
      today,
      streak: learning.streak,
      days: learning.data?.days ?? [],
      lessonsThisWeek: lessonsThisWeek(learning.data?.lessons ?? [], today),
      target: plan?.schedule.lessonsPerWeek ?? 5,
      next: course && next ? { course: course.title, lesson: next.title, day: next.day, started: !!learning.progressFor(focusId)?.started } : null,
      listen: {
        state: listen.state,
        title: listen.session?.lessonTitle ?? null,
        course: listen.session?.courseTitle ?? null,
        canSkip: canJumpBySentence(listen),
      },
      handled: ledger.ids(),
    });
  };

  const push = useRef<() => void>(() => {});
  useEffect(() => {
    push.current = () => {
      if (learning.isPending || !watchIsThere()) return;
      try {
        pushSnapshot(build());
      } catch (error) {
        console.warn('Watch update failed', error);
      }
    };
  });

  // What the Watch shows, as a key: push when it changes (the clock in `sentAt` is not part of it).
  const { sentAt: _sentAt, ...shown } = learning.isPending ? ({ sentAt: 0 } as Partial<WatchSnapshot>) : build();
  const key = JSON.stringify(shown);
  useEffect(() => {
    if (process.env.EXPO_OS !== 'ios' || !watchStatus()?.supported) return;
    const timer = setTimeout(() => push.current(), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [key]);

  // Back in front: the Watch may have missed a push while the app was away, and the day may have turned.
  useOnAppActive(() => push.current());

  // Commands from the Watch. The listener is read when a command arrives, so the newest state is seen.
  useEffect(() => {
    if (process.env.EXPO_OS !== 'ios') return;
    const context: CommandContext = {
      listen: {
        state: () => getListenSnapshot().state,
        canSkip: () => canJumpBySentence(),
        toggle: togglePlayPause,
        skip: (by) => skipSegment(by),
      },
      ledger,
      pushSnapshot: () => push.current(),
    };
    return onWatchCommand(async (command) => {
      const result = await handleWatchCommand(context, command);
      // Tell the Watch it was handled (its id is in the next snapshot) and what Listen is now doing.
      setTimeout(() => push.current(), 400);
      return result;
    });
  }, []);

  return null;
}
