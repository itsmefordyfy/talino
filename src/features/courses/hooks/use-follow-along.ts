import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';
import type { HostInstance } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import type { ScreenHandle } from '@/components/ui/screen';

import { getListenSnapshot, subscribeListen } from '../audio/listen-controller';
import { activeUnitOf } from '../components/listen-follow';

/** How often a hand scroll is allowed to measure where the voice is. */
const RECHECK_MS = 120;

/**
 * Keeps the lesson scrolled to what is being read aloud, without fighting the learner.
 *
 * - While the voice moves on, the part being spoken is brought to a little above the middle of the screen, but only when it has drifted
 *   out of the comfortable zone, so most sentences cause no scroll at all.
 * - The moment the learner scrolls by hand, following pauses (`suspended`): the lesson never snaps back on them. If what is being read is
 *   then off screen, `away` is true and the screen offers "Back to reading".
 * - While they scroll, `recheck` keeps `away` true only while what is being read is really off screen.
 * - Following resumes when the learner asks (`resume`: the button, a tap on a sentence, play, previous or next), or on its own when the
 *   learner has scrolled to where the voice is.
 */
export function useFollowAlong(screen: RefObject<ScreenHandle | null>, lessonId: string) {
  const registry = useRef(new Map<string, HostInstance>());
  const suspended = useRef(false);
  const [awayFromUnit, setAway] = useState(false);
  const reduceMotion = useReducedMotion();
  const unit = useSyncExternalStore(subscribeListen, () => activeUnitOf(getListenSnapshot(), lessonId));

  /** The view for a unit, or for the block it is part of (`b4-i2` is inside `b4`). */
  const find = (id: string) => registry.current.get(id) ?? registry.current.get(id.split('-')[0]) ?? null;

  const follow = (target: string | null, scroll: boolean) => {
    if (!target) return;
    screen.current?.follow(find(target), { scroll, animated: !reduceMotion }, (place) => {
      if (scroll) setAway(false);
      else if (place === 'comfortable') {
        // The learner has scrolled to where the voice is: carry on following.
        suspended.current = false;
        setAway(false);
      } else setAway(place === 'hidden');
    });
  };

  const lastCheck = useRef(0);
  const trailing = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (trailing.current) clearTimeout(trailing.current);
  }, []);

  const first = useRef(true);
  useEffect(() => {
    if (!unit) {
      suspended.current = false;
      first.current = true;
      return;
    }
    follow(unit, !suspended.current);
    // Coming back to the lesson while it is being read: the parts have only just been laid out, so look again once they have settled.
    if (first.current) {
      first.current = false;
      const timer = setTimeout(() => follow(unit, !suspended.current), 350);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `follow` reads refs and the screen handle only; it re-runs when the voice moves to a new part.
  }, [unit]);

  return {
    /** Gives the screen the view of a part of the lesson (`register(unit, null)` forgets it). */
    register: (id: string, node: HostInstance | null) => {
      if (node) registry.current.set(id, node);
      else registry.current.delete(id);
    },
    /** What is being read is off screen because the learner scrolled away. */
    away: awayFromUnit && unit !== null,
    /** The learner scrolled by hand: stop moving the lesson until they ask or catch up. */
    suspend: () => {
      if (unit) suspended.current = true;
    },
    /**
     * The learner is scrolling by hand: judge again, now, whether the part being read is on screen, so "Back to reading" shows only
     * while they are NOT on it and goes the moment they scroll to it (it used to wait for the voice to reach the next sentence, so it
     * stayed up over the very sentence being read). Measures only, never scrolls; a part that is partly in view counts as in view.
     */
    recheck: () => {
      if (!unit || !suspended.current) return;
      const now = Date.now();
      if (trailing.current) clearTimeout(trailing.current);
      if (now - lastCheck.current < RECHECK_MS) {
        // Too soon after the last look: look once more when the scrolling pauses, so the last position is always judged.
        trailing.current = setTimeout(() => follow(unit, false), RECHECK_MS);
        return;
      }
      lastCheck.current = now;
      follow(unit, false);
    },
    /** Follow again now, and bring the part being read into view. */
    resume: () => {
      suspended.current = false;
      follow(unit, true);
    },
  };
}
