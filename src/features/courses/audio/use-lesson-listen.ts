import { useSyncExternalStore } from 'react';

import { companionOf } from '@/features/companion/lib/companions';
import { selectCompanion } from '@/features/settings/settings-slice';
import { useIsOnline } from '@/hooks/use-is-online';
import type { Language } from '@/lib/language';
import { useAppSelector } from '@/store/hooks';

import type { OutlineSection } from '../lib/plain-text';
import type { SpeechSegment } from '../lib/speech-segments';
import { AUDIO_ORIGIN } from './audio-cache';
import { recordingVoice } from './lesson-audio';
import {
  canJumpBySentence,
  getListenSnapshot,
  jumpToSegment,
  loadAudio,
  seekListening,
  skipListening,
  skipSegment,
  startListening,
  stopListening,
  subscribeListen,
  togglePlayPause,
  type ListenState,
} from './listen-controller';

export type { ListenState };

export type UseLessonListen = {
  state: ListenState;
  /** True when an AI voice (a hosted recording) is the one Listen would use: say so. */
  recorded: boolean;
  /** True when the phone's own voice is the one reading right now. */
  phoneVoice: boolean;
  /** True when the voice speaks one sentence at a time (the phone's own): no timeline, so progress and the clock are by sentence. */
  bySentence: boolean;
  /** Always false now that no voice is made live. */
  buffering: boolean;
  /** Seconds into the recording, and its length (0 until it is known). */
  position: number;
  duration: number;
  /** Why the phone's voice is reading although recordings are set up: not connected to get one, or there is none for this lesson. */
  fallback: 'offline' | 'missing' | null;
  /** The waveform for the recording, when there is one. */
  peaks: number[] | null;
  /** The sentence being spoken now (an index into the lesson's segments), or null when the voice can't say. */
  activeSegment: number | null;
  /** True when the lesson's sentences can be followed and jumped to (the phone's voice always; a recording once its timing is known). */
  canJump: boolean;
  /** Start from the beginning of the lesson, or stop whatever is going. */
  toggle: () => void;
  /** Stop whatever is going (nothing happens when idle). */
  stop: () => void;
  /** Pause a playing recording, or carry on a paused one. */
  playPause: () => void;
  skip: (seconds: number) => void;
  /** Jump to a point in the recording, 0 to 1. */
  seekTo: (fraction: number) => void;
  /** The sentence (or paragraph) before or after the current one. */
  skipSentence: (direction: 1 | -1, by?: 'sentence' | 'paragraph') => void;
  /** Speak a sentence of the lesson now: what a tap on it does. */
  jumpTo: (segment: number) => void;
};

export type UseLessonListenInput = {
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  outline: readonly OutlineSection[];
  script: string;
  /** The lesson cut into the sentences Listen says, in order (`lessonSegments`). */
  segments: readonly SpeechSegment[];
  rate: number;
  /** The language the lesson is shown (and so read) in. */
  language?: Language;
};

/**
 * One lesson's view of Listen. The listening itself lives in `listen-controller` (it outlives this screen, so the audio carries on
 * and the player bar at the top of the app keeps it in reach); here a lesson sees it as idle unless its own lesson is the one being
 * read, and Listen on a lesson replaces whatever else was reading. Both voices can be paused, jumped around by sentence and followed
 * in the text; a recording can also be scrubbed and skipped by seconds.
 */
export function useLessonListen({ lessonId, lessonTitle, courseTitle, outline, script, segments, rate, language = 'en' }: UseLessonListenInput): UseLessonListen {
  const online = useIsOnline();
  // Tali reads in a male voice (Kokoro `am_puck`) and Tala in a female one (`af_heart`): the recording is looked up (and saved) under the coach's voice.
  const coach = companionOf(useAppSelector(selectCompanion));
  const voice = recordingVoice(coach.voice, language);
  const snapshot = useSyncExternalStore(subscribeListen, getListenSnapshot);
  const mine = lessonId !== '' && snapshot.session?.lessonId === lessonId && snapshot.session.kind !== 'reply';

  const session = { lessonId, lessonTitle, courseTitle, outline, script, segments, voiceLanguage: language === 'fil' ? 'fil-PH' : undefined };
  return {
    state: mine ? snapshot.state : 'idle',
    recorded: !!loadAudio() && !!AUDIO_ORIGIN,
    phoneVoice: mine && snapshot.mode === 'phone',
    bySentence: mine && snapshot.mode === 'phone',
    buffering: mine && snapshot.buffering,
    fallback: mine ? snapshot.fallback : null,
    position: mine ? snapshot.position : 0,
    duration: mine ? snapshot.duration : 0,
    peaks: mine ? snapshot.peaks : null,
    activeSegment: mine ? snapshot.activeSegment : null,
    canJump: mine && canJumpBySentence(snapshot),
    toggle: () => (mine ? stopListening() : startListening(session, { rate, online, voice })),
    stop: () => {
      if (mine) stopListening();
    },
    playPause: () => {
      if (mine) togglePlayPause();
    },
    skip: (seconds) => {
      if (mine) skipListening(seconds);
    },
    seekTo: (fraction) => {
      if (mine) seekListening(fraction);
    },
    skipSentence: (direction, by = 'sentence') => {
      if (mine) skipSegment(direction, by);
    },
    jumpTo: (segment) => {
      if (mine) jumpToSegment(segment);
    },
  };
}
