/**
 * What the daily-goal Live Activity shows and when it is worth updating. Pure, so it is tested. The card says how many minutes are left of
 * the learner's own daily goal (`dailyMinutes`), a line that follows the progress, a slim bar and "3 of 5 min", with the coach beside it.
 * English only (owner, 2026-11-15: no new Filipino text), and the words arrive in the props because the widget's own process has no strings.
 */

export type GoalProgress = {
  goalMinutes: number;
  /** Whole minutes learned today, never more than the goal. */
  doneMinutes: number;
  /** The goal minus the whole minutes done: what the card calls "minutes to go". */
  minutesLeft: number;
  /** 0 to 1, smooth between minutes, for the bar. */
  fraction: number;
  reached: boolean;
};

export function goalProgress(goalMinutes: number, studiedMs: number): GoalProgress {
  const goal = Math.max(1, Math.round(goalMinutes));
  const goalMs = goal * 60_000;
  const studied = Math.max(0, studiedMs);
  const reached = studied >= goalMs;
  const doneMinutes = reached ? goal : Math.floor(studied / 60_000);
  return { goalMinutes: goal, doneMinutes, minutesLeft: goal - doneMinutes, fraction: Math.min(1, studied / goalMs), reached };
}

/** Everything the activity layout needs, as plain values it can read in the widget's own process. */
export type GoalActivityProps = {
  /** "Your daily goal". */
  title: string;
  /** The big figure: "5" while learning, "Done" once the goal is met. */
  value: string;
  /** Beside the figure: "minutes to go" (empty once done). */
  caption: string;
  headline: string;
  /** "3 of 5 min". */
  progressText: string;
  fraction: number;
  reached: boolean;
  /** `file://` URI of the coach's picture in the shared widgets folder, or null (an icon shows instead). */
  image: string | null;
};

export type GoalActivityText = {
  title: string;
  minutesLeft: string;
  done: string;
  /** Less than half the goal done. */
  starting: string;
  /** Half or more, not yet reached. */
  halfway: string;
  reached: string;
  progress: (done: number, goal: number) => string;
};

export const GOAL_ACTIVITY_TEXT: GoalActivityText = {
  title: 'Your daily goal',
  minutesLeft: 'minutes to go',
  done: 'Done',
  starting: 'One lesson at a time.',
  halfway: 'Past halfway. Stay with it.',
  reached: 'Goal complete. Nicely done.',
  progress: (done, goal) => `${done} of ${goal} min`,
};

export function goalActivityProps(progress: GoalProgress, image: string | null, text: GoalActivityText = GOAL_ACTIVITY_TEXT): GoalActivityProps {
  return {
    title: text.title,
    value: progress.reached ? text.done : String(progress.minutesLeft),
    caption: progress.reached ? '' : text.minutesLeft,
    headline: progress.reached ? text.reached : progress.fraction >= 0.5 ? text.halfway : text.starting,
    progressText: text.progress(progress.doneMinutes, progress.goalMinutes),
    fraction: progress.fraction,
    reached: progress.reached,
    image,
  };
}

/** Whether a card should be on the Lock Screen: a goal is set and today's is not met yet (once met it is shown a last time, then ended). */
export const wantsGoalActivity = (goalMinutes: number | null, progress: GoalProgress | null): boolean => goalMinutes !== null && progress !== null && !progress.reached;

/** What was last sent, to decide whether the next change is worth an update. */
export type GoalActivitySnapshot = { words: string; fraction: number; at: number };

/** The bar alone is refreshed at most this often; any change in the words (a minute passing, the goal reached) goes at once. */
export const MIN_UPDATE_INTERVAL_MS = 15_000;
/** How long the finished card stays on the Lock Screen after the goal is reached. */
export const REACHED_LINGER_MS = 10 * 60 * 1000;

export const snapshotOf = (props: GoalActivityProps, at: number): GoalActivitySnapshot => ({
  words: [props.value, props.caption, props.headline, props.progressText, props.image ?? ''].join('|'),
  fraction: props.fraction,
  at,
});

export function shouldUpdateActivity(last: GoalActivitySnapshot | null, next: GoalActivitySnapshot): boolean {
  if (!last) return true;
  if (last.words !== next.words) return true;
  return next.fraction !== last.fraction && next.at - last.at >= MIN_UPDATE_INTERVAL_MS;
}

/** The next local midnight: a card is stale after it, so yesterday's goal never reads as today's. */
export function nextMidnight(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
}
