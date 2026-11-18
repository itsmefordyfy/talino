import { Asset } from 'expo-asset';
import { Directory, File } from 'expo-file-system';
import { requireOptionalNativeModule } from 'expo';
import { AppState } from 'react-native';
import type { LiveActivityFactory } from 'expo-widgets';

import type { CompanionId } from '@/features/companion/lib/companions';
import { reportError } from '@/lib/monitoring';

import {
  goalActivityProps,
  goalProgress,
  nextMidnight,
  REACHED_LINGER_MS,
  shouldUpdateActivity,
  snapshotOf,
  wantsGoalActivity,
  type GoalActivityProps,
  type GoalActivitySnapshot,
} from '../lib/goal-state';

import type { GoalActivityInput } from './goal-activity';

/** The Live Activity's name: the layout is stored under it (expo-widgets), no app.json entry needed. */
const NAME = 'TalinoGoal';
/** Opens Talino (the Home tab). */
const URL = 'talino:///';

// A build made before expo-widgets, or a Metro started before it was installed, has no native module or hands over a function instead of
// the layout's source string: skip the activity rather than throw on every update.
let cached: LiveActivityFactory<GoalActivityProps> | null | undefined;
function factory(): LiveActivityFactory<GoalActivityProps> | null {
  if (cached !== undefined) return cached;
  cached = null;
  if (!requireOptionalNativeModule('ExpoWidgets')) return cached;
  try {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const { createLiveActivity } = require('expo-widgets') as typeof import('expo-widgets');
    const { GoalActivityLayout } = require('./goal-activity-layout.ios') as { GoalActivityLayout: unknown };
    /* eslint-enable @typescript-eslint/no-require-imports */
    if (typeof GoalActivityLayout !== 'string') {
      if (__DEV__) console.warn('The daily goal Live Activity is off: restart Metro with `npx expo start -c` so it transforms the layout.');
      return cached;
    }
    cached = createLiveActivity<GoalActivityProps>(NAME, GoalActivityLayout as unknown as Parameters<typeof createLiveActivity<GoalActivityProps>>[1]);
  } catch (error) {
    reportError(error, 'goal-activity', { step: 'setup' });
  }
  return cached;
}

/** The coach's two poses on the card: working toward the goal, and the goal reached (256 px copies: a widget has little memory, and the full poses are 930 px). */
const IMAGES: Record<CompanionId, { going: number; done: number }> = {
  tali: { going: require('@/assets/images/activity/tali-going.png'), done: require('@/assets/images/activity/tali-done.png') },
  tala: { going: require('@/assets/images/activity/tala-going.png'), done: require('@/assets/images/activity/tala-done.png') },
};

const copied = new Map<number, string | null>();

/**
 * The picture's `file://` URI in the folder the app and its widget both read (the App Group's `ExpoWidgets`), copied once from the bundled
 * asset. The widget process can't see the app's assets, which is why it needs a copy. Null when there is no such folder (a build made
 * without the widgets plugin) or the copy fails: the card then shows an icon instead.
 */
async function coachImage(asset: number): Promise<string | null> {
  const known = copied.get(asset);
  if (known !== undefined) return known;
  let uri: string | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { widgetsDirectory } = require('expo-widgets') as typeof import('expo-widgets');
    if (widgetsDirectory) {
      const resolved = Asset.fromModule(asset);
      await resolved.downloadAsync();
      const source = resolved.localUri ?? resolved.uri;
      const directory = new Directory(widgetsDirectory);
      if (!directory.exists) directory.create({ intermediates: true, idempotent: true });
      const target = new File(directory, `goal-${resolved.hash ?? asset}.${resolved.type || 'png'}`);
      if (!target.exists) new File(source).copy(target);
      uri = target.uri;
    }
  } catch (error) {
    reportError(error, 'goal-activity', { step: 'image' });
  }
  copied.set(asset, uri);
  return uri;
}

let last: GoalActivitySnapshot | null = null;
/** The day the finished card was last sent for, so reaching the goal ends the card once and a later sync never starts it again. */
let finishedOn: string | null = null;

/**
 * Brings the Live Activity in line with today's goal: started once while a goal is set and not yet met (an activity that outlived the app
 * is reused, never doubled), updated when what it shows changes (see `shouldUpdateActivity`), shown a last time when the goal is reached
 * and then ended (it leaves the Lock Screen after `REACHED_LINGER_MS`), and ended when the goal is turned off. Errors never reach the
 * lesson: the activity is a display.
 */
export async function syncGoalActivity({ goalMinutes, studiedMs, companion, day }: GoalActivityInput): Promise<void> {
  const live = factory();
  if (!live) return;
  try {
    const instances = live.getInstances();
    if (goalMinutes === null) {
      last = null;
      await Promise.all(instances.map((instance) => instance.end('immediate')));
      return;
    }
    const progress = goalProgress(goalMinutes, studiedMs);
    const now = Date.now();
    if (progress.reached) {
      // Reached: one last card with the finished state, which stays a while and then goes. Nothing is started for a goal met earlier.
      last = null;
      if (finishedOn === day) return;
      finishedOn = day;
      if (instances.length === 0) return;
      const image = await coachImage(IMAGES[companion].done);
      const props = goalActivityProps(progress, image);
      await Promise.all(instances.map((instance) => instance.end({ after: new Date(now + REACHED_LINGER_MS) }, props)));
      return;
    }
    if (!wantsGoalActivity(goalMinutes, progress)) return;
    const image = await coachImage(IMAGES[companion].going);
    const props = goalActivityProps(progress, image);
    const snapshot = snapshotOf(props, now);
    const stale = nextMidnight(new Date(now));
    if (instances.length === 0) {
      // iOS lets an app start an activity only while it is in the foreground ("Target is not foreground" otherwise). The sync also runs at launch
      // and as the app goes to the background; the next return to the app starts the card. Updating and ending work in the background.
      if (AppState.currentState !== 'active') return;
      try {
        live.start(props, URL, stale);
        last = snapshot;
      } catch (error) {
        // The app can still leave the foreground between the check and the call: the same wait, not a failure.
        if (!/not foreground/i.test(String(error))) throw error;
      }
      return;
    }
    // One card: any other (a relaunch's) is ended.
    await Promise.all(instances.slice(1).map((instance) => instance.end('immediate')));
    if (shouldUpdateActivity(last, snapshot)) {
      await instances[0].update(props, stale);
      last = snapshot;
    }
  } catch (error) {
    reportError(error, 'goal-activity', { step: 'sync' });
  }
}
