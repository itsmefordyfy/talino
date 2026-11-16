/**
 * Listen with a recorded voice. Each lesson has an audio file made on the owner's Mac with Kokoro v1 (`scripts/audio/generate.py`), one call
 * per sentence so the start and end of every sentence is known, hosted at `EXPO_PUBLIC_AUDIO_ORIGIN/<voice>/<lessonId>.m4a` and kept on the
 * phone after the first listen. A lesson with no recording that can be played (none made yet, no connection, or one that doesn't match the words on
 * screen, such as a Tagalog lesson) is read by the phone's own voice. This file is the pure part: addresses, file names and the choice of how to listen.
 */

import { COMPANIONS } from '@/features/companion/lib/companions';
import type { Language } from '@/lib/language';

/** The default lesson voice (Tali's Kokoro voice, `am_puck`). Tala reads in `af_heart`; each coach's voice is `COMPANIONS[id].voice`. */
export const AUDIO_VOICE = COMPANIONS.tali.voice;

/** A voice id is lowercase letters, digits and underscores starting with a letter (`am_puck`, `af_heart`): the only kind that may become part of an address or a file name. */
const VOICE_ID = /^[a-z][a-z0-9_]{1,31}$/;

const LOCAL_HOSTS = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/;
/** A computer on the same Wi-Fi (192.168.x.x, 10.x.x.x, 172.16-31.x.x): allowed over plain http only while developing, so a phone can reach this Mac's audio. */
const LAN_HOSTS = /^http:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(:\d+)?(\/|$)/;

/** Where a lesson's recording is, or null when there is no audio host, or the id or host is not one we trust. */
export function lessonAudioUrl(origin: string | undefined, lessonId: string, options: { development?: boolean; voice?: string } = {}): string | null {
  const base = (origin ?? '').trim().replace(/\/+$/, '');
  const voice = options.voice ?? AUDIO_VOICE;
  if (!base || !/^[a-z0-9-]+$/.test(lessonId) || !VOICE_ID.test(voice)) return null;
  if (!base.startsWith('https://') && !LOCAL_HOSTS.test(base) && !(options.development && LAN_HOSTS.test(base))) return null;
  return `${base}/${voice}/${lessonId}.m4a`;
}

/**
 * The folder a lesson's recording is hosted (and saved, and its place remembered) under: the coach's voice for English, `<voice>_<language>`
 * for another language (`am_puck_fil`), so a recording of the English words is never played under a Tagalog lesson. Kokoro has no Filipino
 * voice, so no such recordings are made and a Tagalog lesson is read by the phone's `fil-PH` voice.
 */
export function recordingVoice(voice: string, language: Language): string {
  return language === 'en' ? voice : `${voice}_${language}`;
}

/** The saved file's name: the voice is part of it, so changing the voice never plays an old recording. */
export function audioFileName(lessonId: string, voice: string = AUDIO_VOICE): string {
  return `${voice}-${lessonId}.m4a`;
}

export type ListenPlan = 'play-saved' | 'download' | 'phone-voice';

export function listenPlan({ hasOrigin, cached, online }: { hasOrigin: boolean; cached: boolean; online: boolean }): ListenPlan {
  if (cached) return 'play-saved';
  if (hasOrigin && online) return 'download';
  return 'phone-voice';
}

/** The reading-speed setting (0.8 to 1.2) as a playback rate; recordings are made at a calm pace already. */
export function playbackRate(speechRate: number): number {
  if (!Number.isFinite(speechRate)) return 1;
  return Math.min(1.2, Math.max(0.8, speechRate));
}

/** Where a lesson's waveform shape is (made by scripts/audio/peaks.py next to the recording), or null without a trusted host. */
export function lessonPeaksUrl(origin: string | undefined, lessonId: string, options: { development?: boolean; voice?: string } = {}): string | null {
  const url = lessonAudioUrl(origin, lessonId, options);
  return url ? url.replace(/\.m4a$/, '.peaks.json') : null;
}

/** The waveform from its file: 20 to 400 loudness values between 0 and 1, or null when it is anything else. */
export function parsePeaks(value: unknown): number[] | null {
  const peaks = value && typeof value === 'object' ? (value as { peaks?: unknown }).peaks : null;
  if (!Array.isArray(peaks) || peaks.length < 20 || peaks.length > 400) return null;
  if (!peaks.every((peak) => typeof peak === 'number' && Number.isFinite(peak) && peak >= 0 && peak <= 1)) return null;
  return peaks as number[];
}

/** `count` bars from a waveform of any length: each bar takes the loudest value of the slice it covers, so a short pause never vanishes. */
export function resamplePeaks(peaks: readonly number[], count: number): number[] {
  if (count <= 0) return [];
  return Array.from({ length: count }, (_, bar) => {
    const from = Math.floor((bar * peaks.length) / count);
    const to = Math.max(from + 1, Math.floor(((bar + 1) * peaks.length) / count));
    return Math.max(...peaks.slice(from, to));
  });
}

/** `3:05` for 185 seconds; never negative or NaN. */
export function formatClock(seconds: number): string {
  const whole = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

/** The nearest reading speed in the player's steps (the setting allows 0.8 to 1.2). */
export const SPEED_STEPS = [0.8, 0.9, 1, 1.1, 1.2] as const;

/** The next speed in the cycle, wrapping from the fastest to the slowest. */
export function nextSpeed(current: number): number {
  const index = SPEED_STEPS.findIndex((step) => Math.abs(step - current) < 0.05);
  return SPEED_STEPS[(index + 1) % SPEED_STEPS.length];
}
