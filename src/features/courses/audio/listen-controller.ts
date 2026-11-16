import { requireOptionalNativeModule } from 'expo';
import * as Speech from 'expo-speech';

import { reportError } from '@/lib/monitoring';
import { chunkForSpeech } from '@/lib/speech-chunks';

import type { OutlineSection } from '../lib/plain-text';
import { targetSegment } from '../lib/segment-nav';
import { hashSegments, outlineFromTiming, type SpeechSegment } from '../lib/speech-segments';
import { AUDIO_ORIGIN, downloadLessonAudio, forgetLessonAudio, loadLessonPeaks, loadLessonTiming, savedLessonAudio } from './audio-cache';
import { AUDIO_VOICE, listenPlan, playbackRate } from './lesson-audio';
import { clearListenPosition, loadListenPosition, saveListenPosition } from './listen-position';
import { resumePoint, segmentAtTime, timingMatches, wordAtTime, type ListenTiming } from './listen-timing';

/**
 * The one listener of the whole app. A lesson's Listen, the player bar at the top of every screen, the Lock Screen and the Live Activity
 * all read and drive this module, so the voice keeps going while the learner moves between screens and only one voice ever talks
 * (starting a lesson replaces whatever was reading). It is plain module state with a subscribe function (`useSyncExternalStore`), not
 * React state, because it has to outlive the lesson screen that started it.
 *
 * It also knows WHICH SENTENCE is being spoken (`activeSegment`, an index into the session's `segments`), whoever the voice is:
 * - a recording (Kokoro v1, `am_puck` for Tali and `af_heart` for Tala) has a timing file with the exact start and end of every sentence,
 *   made when the recording was (`listen-timing.ts`); the sentence is looked up from the player's position, so pausing, seeking, speed and
 *   buffering cannot put it out of step;
 * - with no recording (or one that can't be reached), the phone's own voice speaks the sentences one at a time, so the sentence is the one being spoken, exactly.
 * A recording without a timing file (or one that doesn't match the lesson's words) still plays; it just doesn't follow along.
 */
type ExpoAudio = typeof import('expo-audio');
type Player = ReturnType<ExpoAudio['createAudioPlayer']>;

/** expo-audio is a native module: a build made before it was added doesn't have it, and Listen then uses the phone's voice. */
export function loadAudio(): ExpoAudio | null {
  // Loaded only when the native module is there: importing expo-audio without it throws.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return requireOptionalNativeModule('ExpoAudio') ? (require('expo-audio') as ExpoAudio) : null;
}

/** loading: getting the recording; playing and paused: the recording or (paused) the phone's voice; speaking: the phone's voice. */
export type ListenState = 'idle' | 'loading' | 'playing' | 'paused' | 'speaking';

/** What is being read: enough to show it anywhere in the app and to open the lesson from the bar. */
export type ListenSession = {
  /** A lesson (the default), or a coach's answer being read with the phone's voice: no recording, no sentences to follow, no lesson to open. */
  kind?: 'lesson' | 'reply';
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  outline: readonly OutlineSection[];
  /** What the phone's own voice reads when there is no recording, as one text (kept for the recordings' sake: `lessonScript`). */
  script: string;
  /** The lesson cut into sentences, in the order they are said: what the screen highlights and what a tap jumps to. */
  segments: readonly SpeechSegment[];
  /** The phone's voice to read it with when it reads (`fil-PH` for a Tagalog lesson; unset: the phone's default, as before). A phone with no such voice uses its default. */
  voiceLanguage?: string;
};

export type ListenSnapshot = {
  session: ListenSession | null;
  state: ListenState;
  /** `recording`: a recorded voice; `phone`: the phone's own voice; null when nothing is being read. */
  mode: 'recording' | 'phone' | null;
  /** Seconds into the recording, and its length (0 until it is known; always 0 for the phone's voice). */
  position: number;
  duration: number;
  peaks: number[] | null;
  /** When each sentence of the recording starts and ends, once it is known to match this lesson and this recording. */
  timing: ListenTiming | null;
  /** The sentence being spoken now (an index into `session.segments`), or null when the voice can't say (still loading, or no timing). */
  activeSegment: number | null;
  /** Sentence by sentence voices only: how far through the active sentence the voice is (0 to 1; the phone's voice from its own word markers), or null before it starts or where the platform sends none (the whole sentence is then lit). */
  spokenFraction: number | null;
  /** Always false now that no voice is made live; kept so the player's states stay as they were. */
  buffering: boolean;
  /** Why the phone's voice is reading although recordings are set up: not connected to download it, or this lesson has none yet. */
  fallback: 'offline' | 'missing' | null;
};

const IDLE: ListenSnapshot = { session: null, state: 'idle', mode: null, position: 0, duration: 0, peaks: null, timing: null, activeSegment: null, spokenFraction: null, buffering: false, fallback: null };

/** The highlight moves a little before the sound does, so it is never behind it by the time the eye reads it. */
const LEAD_SECONDS = 0.05;
/** A sentence replays from its start when "previous" is pressed this far into it. */
const RESTART_AFTER_SECONDS = 2;

let snapshot: ListenSnapshot = IDLE;
const listeners = new Set<() => void>();
let player: Player | null = null;
// Bumped by every start and stop, so a download that finishes after a tap on Stop never starts playing.
let run = 0;
// Bumped by every sentence the phone's voice starts or abandons, so an utterance that was stopped never moves on to the next one.
let phoneToken = 0;
// True from a jump until the player has really moved and settled: the position updates still on their way carry the old time, and
// showing them made the bars and the clock snap back and forth after a jump.
let seeking = false;
let settle: ReturnType<typeof setTimeout> | null = null;
let rate = 1;
let voice = AUDIO_VOICE;
let hash = '';
let durationChecked = false;
let lastSavedAt = 0;

export function getListenSnapshot(): ListenSnapshot {
  return snapshot;
}

export function subscribeListen(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function update(patch: Partial<ListenSnapshot>) {
  snapshot = { ...snapshot, ...patch };
  listeners.forEach((listener) => listener());
}

/** Remembers where the learner is, so the next Listen on this lesson carries on from there. */
function persist() {
  const { session, mode, activeSegment, position } = snapshot;
  if (!session || !mode || session.segments.length === 0) return;
  lastSavedAt = position;
  saveListenPosition(session.lessonId, voice, { segment: activeSegment ?? 0, time: mode === 'recording' ? position : 0, hash });
}

/** Takes the current recording off the Lock Screen's now-playing card and out of memory. */
function dropPlayer() {
  run += 1;
  phoneToken += 1;
  seeking = false;
  if (settle) clearTimeout(settle);
  if (player) {
    // `remove()` only frees the player from expo-audio's registry; it does not stop the sound, so pause first (Stop used to leave the recording playing).
    try {
      player.pause();
    } catch {
      // Already gone.
    }
    player.clearLockScreenControls();
    player.remove();
    player = null;
  }
  void Speech.stop();
}

/** Stop whatever is reading, wherever it was started. The place is kept: Listen on this lesson carries on from it. */
export function stopListening() {
  persist();
  dropPlayer();
  update({ ...IDLE });
}

/** The lesson was heard to the end: nothing to carry on from. */
function finishListening() {
  const { session } = snapshot;
  if (session) clearListenPosition(session.lessonId, voice);
  dropPlayer();
  update({ ...IDLE });
}

// ---- The phone's own voice: one sentence at a time ----------------------------------------------------------------------------

/** Speaks sentence `index` and then each one after it. Whatever was being spoken is stopped, and its end never moves things on. */
function speakFrom(index: number) {
  const { session } = snapshot;
  if (!session || session.segments.length === 0) return;
  const mine = run;
  const token = ++phoneToken;
  const at = Math.min(Math.max(0, index), session.segments.length - 1);
  void Speech.stop();
  update({ state: 'speaking', mode: 'phone', activeSegment: at, spokenFraction: null });
  persist();
  const next = (current: number) => {
    const live = () => run === mine && token === phoneToken;
    const sentence = session.segments[current].text;
    Speech.speak(sentence, {
      rate,
      language: session.voiceLanguage,
      // The voice says where each word starts (iOS): the words up to the end of that word are the ones already said.
      onBoundary: (event: { charIndex: number; charLength: number }) => {
        if (!live() || !event || typeof event.charIndex !== 'number') return;
        const end = event.charIndex + (typeof event.charLength === 'number' && event.charLength > 0 ? event.charLength : 1);
        update({ spokenFraction: Math.min(1, end / Math.max(1, sentence.length)) });
      },
      onDone: () => {
        if (!live()) return;
        if (current + 1 >= session.segments.length) {
          finishListening();
          return;
        }
        update({ activeSegment: current + 1, spokenFraction: null });
        persist();
        next(current + 1);
      },
      onError: () => {
        if (live()) stopListening();
      },
    });
  };
  next(at);
}

// ---- Recordings ----------------------------------------------------------------------------------------------------------------

/** Moves the recording to `target` seconds and shows it at once; the player's own updates are held back until it has settled there. */
function jump(current: Player, target: number, segment?: number): Promise<void> {
  seeking = true;
  if (settle) clearTimeout(settle);
  const { timing } = snapshot;
  update({ position: target, ...(timing ? { activeSegment: segment ?? segmentAtTime(timing, target) } : {}) });
  persist();
  const done = () => {
    settle = setTimeout(() => {
      seeking = false;
    }, 450);
  };
  return current.seekTo(target).then(done, done);
}

/** Publishes the player's position, but only when something a listener shows has changed: a new sentence, or a quarter of a second. */
function tick(position: number, duration: number) {
  const { timing } = snapshot;
  const active = timing ? segmentAtTime(timing, position + LEAD_SECONDS) : snapshot.activeSegment;
  // With word times the highlight follows each word, so a new word is worth publishing even inside the quarter second.
  const wordMoved =
    timing?.words !== undefined &&
    active !== null &&
    wordAtTime(timing, active, position + LEAD_SECONDS) !== wordAtTime(timing, active, snapshot.position + LEAD_SECONDS);
  if (!wordMoved && Math.abs(position - snapshot.position) < 0.24 && active === snapshot.activeSegment && duration === snapshot.duration) return;
  const changed = active !== snapshot.activeSegment;
  update({ position, duration, activeSegment: active });
  if (changed || Math.abs(position - lastSavedAt) >= 5) persist();
}

/** Takes a timing file into use once it is known to describe this lesson's words and the recording that is playing. */
function applyTiming(mine: number, session: ListenSession, timing: ListenTiming | null) {
  if (!timing || run !== mine) return;
  const audioDuration = player && player.duration > 0 ? player.duration : 0;
  if (!timingMatches(timing, { hash, count: session.segments.length, audioDuration })) {
    // The words match but the recording's length does not: the saved recording is older than its timing. Download it again next time.
    if (audioDuration > 0 && timingMatches(timing, { hash, count: session.segments.length })) forgetLessonAudio(session.lessonId, voice);
    return;
  }
  const current = snapshot.session ?? session;
  update({ timing, session: { ...current, outline: outlineFromTiming(session.lessonTitle, session.segments, timing) }, activeSegment: segmentAtTime(timing, snapshot.position) });
}

/** The first time the player knows the recording's length: if it isn't the length the timing was made on, stop pretending it follows. */
function checkTimingAgainst(session: ListenSession, audioDuration: number) {
  const { timing } = snapshot;
  if (!timing || timingMatches(timing, { hash, count: session.segments.length, audioDuration })) return;
  forgetLessonAudio(session.lessonId, voice);
  update({ timing: null, activeSegment: null, session: { ...session, outline: snapshot.session?.outline ?? session.outline } });
}

async function playFile(session: ListenSession, uri: string, mine: number, audio: ExpoAudio, startAt: number) {
  // Background playback: the lesson carries on when the phone is locked or the learner leaves the app (the Live Activity and the
  // Lock Screen's now-playing card show it). `doNotMix` is what lets the system tie those controls to this player.
  await audio.setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix' });
  if (run !== mine) return;
  durationChecked = false;
  const next = audio.createAudioPlayer(uri, { updateInterval: 100 });
  next.setPlaybackRate(playbackRate(rate));
  next.addListener('playbackStatusUpdate', (status) => {
    if (run !== mine) return;
    if (status.didJustFinish) {
      finishListening();
      return;
    }
    if (seeking) return;
    if (!durationChecked && status.duration > 0) {
      durationChecked = true;
      checkTimingAgainst(session, status.duration);
    }
    tick(status.currentTime, status.duration > 0 ? status.duration : snapshot.duration);
  });
  player = next;
  next.setActiveForLockScreen(true, { title: session.lessonTitle, artist: 'Talino', albumTitle: session.courseTitle });
  // Carrying on from where the learner stopped: move there first, then play, so the lesson never starts from 0 for an instant.
  if (startAt > 0) await withinMs(jump(next, startAt), 900);
  if (run !== mine) return;
  next.play();
  update({ state: 'playing' });
}

/** The promise's value, or null if it takes longer than `ms` (the timer is cleared either way). */
async function withinMs<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<null>((resolve) => (timer = setTimeout(() => resolve(null), ms)))]);
  } finally {
    clearTimeout(timer);
  }
}

/** How long a timing file may take before the recording starts without it (it is applied as soon as it arrives). */
const TIMING_WAIT_MS = 1500;

/**
 * Read a lesson aloud (`voice`: the Kokoro voice of the learner's coach, Tali's by default): the recording when it is saved on the phone or
 * can be downloaded now, and the phone's own voice when there is none to play (no audio host, no connection, or no recording for this
 * lesson). A recording is followed sentence by sentence only when its timing describes the words on screen; otherwise it still plays. Replaces
 * whatever was reading. It always starts from the beginning of the lesson (owner, 2026-11-15: a lesson used to carry on from where it was last
 * stopped, so Listen began "in another section"); `from: 'saved'` carries on from the saved place for a caller that asks for it.
 */
export function startListening(session: ListenSession, options: { rate: number; online: boolean; voice?: string; from?: 'saved' | 'start' }) {
  dropPlayer();
  rate = options.rate;
  voice = options.voice ?? AUDIO_VOICE;
  hash = hashSegments(session.segments);
  const mine = run;
  const saved = options.from === 'saved' ? loadListenPosition(session.lessonId, voice) : null;
  const resume = resumePoint(saved, { hash, count: session.segments.length });
  const audio = loadAudio();
  const file = audio ? savedLessonAudio(session.lessonId, voice) : null;
  const plan = audio ? listenPlan({ hasOrigin: !!AUDIO_ORIGIN, cached: !!file, online: options.online }) : 'phone-voice';
  const first = resume?.segment ?? 0;
  if (!audio || plan === 'phone-voice') {
    // Recordings are set up but not reachable right now: say so, instead of quietly sounding different.
    update({ ...IDLE, session, mode: 'phone', fallback: audio && AUDIO_ORIGIN ? 'offline' : null, activeSegment: first });
    speakFrom(first);
    return;
  }
  update({ ...IDLE, session, mode: 'recording', state: 'loading', position: resume?.time ?? 0 });
  void loadLessonPeaks(session.lessonId, voice).then((found) => {
    if (run === mine) update({ peaks: found });
  });
  const timingFile = loadLessonTiming(session.lessonId, voice);
  void (async () => {
    try {
      const recording = file ?? (await downloadLessonAudio(session.lessonId, voice));
      if (run !== mine) return;
      // The timing is a few kilobytes beside the recording: wait a moment for it so the very first sentence is already followed.
      const early = await withinMs(timingFile, TIMING_WAIT_MS);
      if (run !== mine) return;
      const startAt = resume ? (early?.segments[resume.segment]?.[0] ?? resume.time) : 0;
      await playFile(session, recording.uri, mine, audio, startAt);
      applyTiming(mine, session, early ?? null);
      if (!early) void timingFile.then((late) => applyTiming(mine, session, late));
    } catch (error) {
      // No recording for this lesson yet, or the connection dropped: the phone's voice reads it, and we say nothing alarming.
      // A 404 only means that lesson isn't recorded yet (most aren't): expected, so not logged. A dropped connection still is.
      if (!(error instanceof Error && /status 404/.test(error.message))) reportError(error, 'courses', { step: 'lesson_audio' });
      if (run !== mine) return;
      // The recording's own leftovers (waveform, a place in it) don't belong to the phone's voice.
      update({ mode: 'phone', peaks: null, timing: null, position: 0, duration: 0, activeSegment: first, fallback: 'missing' });
      speakFrom(first);
    }
  })();
}

/** Where Listen would carry on for this lesson (null: it would start from the beginning). Used to offer "Continue listening". */
export function savedListenPlace(segments: readonly SpeechSegment[], lessonId: string, forVoice: string = AUDIO_VOICE): { segment: number; time: number } | null {
  return resumePoint(loadListenPosition(lessonId, forVoice), { hash: hashSegments(segments), count: segments.length });
}

/**
 * Read a coach's answer aloud with the phone's own voice (`language` is the voice's language, like `en-US`), through the same listener, so
 * it replaces whatever was reading and the player bar can stop it. An answer has no recording and no sentences to follow along.
 */
export function speakReply(reply: { lessonId: string; lessonTitle: string; courseTitle: string; script: string }, options: { rate: number; language?: string }) {
  dropPlayer();
  rate = options.rate;
  const mine = run;
  update({ ...IDLE, session: { ...reply, kind: 'reply', outline: [{ title: reply.lessonTitle, at: 0 }], segments: [] }, mode: 'phone', state: 'speaking' });
  const finish = () => {
    if (run === mine) stopListening();
  };
  // The phone refuses one utterance longer than `Speech.maxSpeechInputLength` (about 4000 characters on iOS), so a long answer goes in pieces.
  const pieces = chunkForSpeech(reply.script, Math.min(Speech.maxSpeechInputLength || 3500, 3500));
  if (pieces.length === 0) return finish();
  pieces.forEach((piece, index) => Speech.speak(piece, { rate: options.rate, language: options.language, onDone: index === pieces.length - 1 ? finish : undefined, onStopped: finish, onError: finish }));
}

/** Pause what is playing, or carry on a paused lesson (the phone's voice carries on from the start of the sentence it was in). */
export function togglePlayPause() {
  if (snapshot.mode === 'phone') {
    if (!snapshot.session?.segments.length) return;
    if (snapshot.state === 'speaking') {
      phoneToken += 1;
      void Speech.stop();
      update({ state: 'paused' });
      persist();
    } else if (snapshot.state === 'paused') speakFrom(snapshot.activeSegment ?? 0);
    return;
  }
  if (!player) return;
  if (player.playing) {
    player.pause();
    update({ state: 'paused' });
    persist();
  } else {
    player.play();
    update({ state: 'playing' });
  }
}

/** True when the learner can jump between sentences: the phone's voice always, a recording once its timing is known. */
export function canJumpBySentence(state: ListenSnapshot = snapshot): boolean {
  return !!state.session && state.session.segments.length > 0 && state.state !== 'idle' && state.state !== 'loading' && (state.mode === 'phone' || !!state.timing);
}

/** Start speaking sentence `index` of the lesson now (carrying on if it was paused). */
export function jumpToSegment(index: number) {
  const { session, mode, timing } = snapshot;
  if (!session || !canJumpBySentence()) return;
  const at = Math.min(Math.max(0, Math.floor(index)), session.segments.length - 1);
  if (mode === 'phone') {
    speakFrom(at);
    return;
  }
  if (!player || !timing) return;
  void jump(player, timing.segments[at]?.[0] ?? 0, at);
  if (!player.playing) {
    player.play();
    update({ state: 'playing' });
  }
}

/** The sentence before or after the current one (or paragraph, with `by`). "Previous" replays a sentence the learner is already well into. */
export function skipSegment(direction: 1 | -1, by: 'sentence' | 'paragraph' = 'sentence') {
  const { session, timing, position, activeSegment } = snapshot;
  if (!session || !canJumpBySentence()) return;
  const startedAt = activeSegment !== null ? timing?.segments[activeSegment]?.[0] : undefined;
  const restart = startedAt !== undefined && position - startedAt > RESTART_AFTER_SECONDS;
  jumpToSegment(targetSegment(session.segments, activeSegment, direction, by, { restart }));
}

export function skipListening(seconds: number) {
  const current = player;
  if (!current) return;
  const length = current.duration > 0 ? current.duration : snapshot.duration;
  // The clock to move from is the one on screen, so two quick taps add up instead of both starting from the same old time.
  const from = seeking ? snapshot.position : current.currentTime;
  void jump(current, Math.min(Math.max(0, from + seconds), length > 0 ? Math.max(0, length - 0.5) : Number.MAX_SAFE_INTEGER));
}

/** Jump to a point in the recording, 0 to 1. */
export function seekListening(fraction: number) {
  const current = player;
  const length = current && current.duration > 0 ? current.duration : snapshot.duration;
  if (!current || length <= 0) return;
  void jump(current, Math.min(Math.max(0, fraction), 0.995) * length);
}

/** The reading-speed setting changed: a playing recording follows it at once (the timing is in the recording's own time, so nothing else moves); the phone's voice starts the sentence it is in again at the new speed. */
export function setListenRate(next: number) {
  if (next === rate) return;
  rate = next;
  // A recording changes speed in place: nothing has to restart.
  player?.setPlaybackRate(playbackRate(next));
  if (snapshot.mode === 'phone' && snapshot.state === 'speaking') speakFrom(snapshot.activeSegment ?? 0);
}
