import { requireOptionalNativeModule } from 'expo';

import { stopListening } from '@/features/courses/data';
import { reportError } from '@/lib/monitoring';

import type { CompanionId } from '../lib/companions';

/**
 * The short greeting each coach says when the learner taps "Hear" in the welcome or in Settings (Kokoro, made by
 * `scripts/audio/coach-samples.py`, bundled in the app so it plays offline). One voice at a time: starting a sample stops a lesson that
 * is being read, and starting another sample stops the first.
 */
type ExpoAudio = typeof import('expo-audio');
type Player = ReturnType<ExpoAudio['createAudioPlayer']>;

const SAMPLES: Record<CompanionId, number> = {
  tali: require('@/assets/audio/coach-tali.m4a'),
  tala: require('@/assets/audio/coach-tala.m4a'),
};

let player: Player | null = null;
let run = 0;

/** Stops the sample that is playing, if any. */
export function stopCoachSample() {
  run += 1;
  if (player) {
    // `remove()` only frees the player from expo-audio's registry; it does not stop the sound, so pause first.
    try {
      player.pause();
    } catch {
      // Already gone.
    }
    try {
      player.remove();
    } catch {
      // Already gone.
    }
    player = null;
  }
}

/** Plays a coach's greeting; `onDone` runs when it ends or cannot play. A build without expo-audio just calls `onDone` (nothing to hear). */
export async function playCoachSample(companion: CompanionId, onDone: () => void) {
  stopCoachSample();
  stopListening();
  const mine = run;
  // expo-audio is a native module: a build made before it was added doesn't have it.
  if (!requireOptionalNativeModule('ExpoAudio')) return onDone();
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const audio = require('expo-audio') as ExpoAudio;
    await audio.setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false, interruptionMode: 'doNotMix' });
    if (run !== mine) return;
    const next = audio.createAudioPlayer(SAMPLES[companion]);
    next.addListener('playbackStatusUpdate', (status) => {
      if (run === mine && status.didJustFinish) {
        stopCoachSample();
        onDone();
      }
    });
    player = next;
    next.play();
  } catch (error) {
    reportError(error, 'companion', { step: 'sample' });
    if (run === mine) onDone();
  }
}
