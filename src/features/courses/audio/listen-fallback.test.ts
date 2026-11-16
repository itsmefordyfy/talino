import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

import type { Lesson } from '../content/types';
import { hashSegments, lessonSegments } from '../lib/speech-segments';
import type { ListenTiming, SavedPosition } from './listen-timing';
import {
  canJumpBySentence,
  getListenSnapshot,
  startListening,
  stopListening,
  type ListenSession,
} from './listen-controller';

/**
 * Which voice reads a lesson: the hosted Kokoro recording when it is saved or can be had and describes the words on screen, otherwise the
 * phone's own voice (there is no live voice any more). The audio player and the speech service are fakes the tests steer; the sentences
 * are the real ones of a real lesson shape.
 */
const mockNative = jest.fn<() => unknown>();
jest.mock('expo', () => ({ requireOptionalNativeModule: () => mockNative() }));

type FakePlayer = {
  uri: string;
  currentTime: number;
  duration: number;
  playing: boolean;
  rate: number;
  removed: boolean;
  listener: ((status: { currentTime: number; duration: number; didJustFinish: boolean }) => void) | null;
  emit: (time: number, didJustFinish?: boolean) => void;
};
const mockPlayers: FakePlayer[] = [];
jest.mock('expo-audio', () => ({
  setAudioModeAsync: async () => {},
  createAudioPlayer: (uri: string) => {
    const player: FakePlayer & Record<string, unknown> = {
      uri,
      currentTime: 0,
      duration: 6,
      playing: false,
      rate: 1,
      removed: false,
      listener: null,
      seekTo: async () => {},
      play: () => {
        player.playing = true;
      },
      pause: () => {
        player.playing = false;
      },
      setPlaybackRate: (rate: number) => {
        player.rate = rate;
      },
      addListener: (_event: string, listener: FakePlayer['listener']) => {
        player.listener = listener;
      },
      setActiveForLockScreen: () => {},
      clearLockScreenControls: () => {},
      remove: () => {
        player.removed = true;
      },
      emit: (time: number, didJustFinish = false) => {
        player.currentTime = time;
        player.listener?.({ currentTime: time, duration: player.duration, didJustFinish });
      },
    };
    mockPlayers.push(player);
    return player;
  },
}));

const mockSpoken: { text: string; rate?: number; onDone?: () => void; onStopped?: () => void }[] = [];
jest.mock('expo-speech', () => ({
  speak: (text: string, options: Record<string, unknown>) => mockSpoken.push({ text, ...options }),
  stop: () => {},
}));
jest.mock('@/lib/monitoring', () => ({ reportError: jest.fn() }));

const mockOrigin: { value: string | undefined } = { value: undefined };
const mockHosted: { value: boolean } = { value: false };
const mockTiming: { value: ListenTiming | null } = { value: null };
const mockDownloads = jest.fn();
jest.mock('./audio-cache', () => ({
  get AUDIO_ORIGIN() {
    return mockOrigin.value;
  },
  savedLessonAudio: () => (mockHosted.value ? { uri: 'file:///lesson.m4a' } : null),
  downloadLessonAudio: async () => {
    mockDownloads();
    if (mockHosted.value) return { uri: 'file:///lesson.m4a' };
    throw new Error('no such recording');
  },
  loadLessonPeaks: async () => null,
  loadLessonTiming: async () => mockTiming.value,
  forgetLessonAudio: () => {},
}));

const mockSaved = new Map<string, SavedPosition>();
jest.mock('./listen-position', () => ({
  loadListenPosition: (lessonId: string, voice: string) => mockSaved.get(`${voice}:${lessonId}`) ?? null,
  saveListenPosition: (lessonId: string, voice: string, position: SavedPosition) => mockSaved.set(`${voice}:${lessonId}`, position),
  clearListenPosition: (lessonId: string, voice: string) => mockSaved.delete(`${voice}:${lessonId}`),
  clearAllListenPositions: () => mockSaved.clear(),
}));

const lesson = {
  id: 'live-01',
  day: 1,
  title: 'Writing better prompts',
  summary: 'Learn how to ask an AI model for what you really want. It saves a lot of time.',
  minutes: 15,
  skills: [],
  intro: { objectives: ['Write a clear prompt for a real task', 'Fix a vague prompt'], why: 'Good prompts save you hours every week. They also make the answers easier to trust.' },
  body: [
    { type: 'paragraph', text: 'A prompt is the message you send to an AI model. It can be a question or an instruction.' },
    { type: 'heading', text: 'Be specific' },
    { type: 'paragraph', text: 'Say who the answer is for and what you need from it, in a sentence or two.' },
  ],
  quiz: [],
  task: { title: 't', steps: [], minutes: 5 },
} as unknown as Lesson;

const segments = lessonSegments(lesson);
const session: ListenSession = { lessonId: 'live-01', lessonTitle: 'Lesson', courseTitle: 'Course', outline: [{ title: 'Lesson', at: 0 }], script: 'Hello.', segments };

const flush = async () => {
  for (let i = 0; i < 12; i += 1) await new Promise((resolve) => setTimeout(resolve, 0));
};
const start = (extra: Record<string, unknown> = {}) => startListening(session, { rate: 1, online: true, ...extra });

beforeEach(() => {
  mockNative.mockReturnValue({});
  mockPlayers.length = 0;
  mockSpoken.length = 0;
  mockSaved.clear();
  mockOrigin.value = undefined;
  mockHosted.value = false;
  mockTiming.value = null;
  mockDownloads.mockClear();
});
afterEach(() => {
  stopListening();
});

describe('with no recording to play', () => {
  test('a build without the audio module reads with the phone’s voice', () => {
    mockNative.mockReturnValue(null);
    start();
    expect(getListenSnapshot()).toMatchObject({ mode: 'phone', state: 'speaking', activeSegment: 0, fallback: null });
    expect(mockSpoken[0].text).toBe(segments[0].text);
    expect(mockPlayers).toHaveLength(0);
  });

  test('no audio host is set up: the phone reads, and nothing says a recording was expected', () => {
    start();
    expect(getListenSnapshot()).toMatchObject({ mode: 'phone', fallback: null });
  });

  test('a host is set up but there is no connection and nothing saved: the phone reads, and says the connection is why', () => {
    mockOrigin.value = 'https://audio.example.com';
    start({ online: false });
    expect(getListenSnapshot()).toMatchObject({ mode: 'phone', fallback: 'offline' });
    expect(mockDownloads).not.toHaveBeenCalled();
  });

  test('a saved recording plays with no connection', async () => {
    mockOrigin.value = 'https://audio.example.com';
    mockHosted.value = true;
    mockTiming.value = { hash: hashSegments(segments), duration: segments.length * 5, segments: segments.map((_, i) => [i * 5, i * 5 + 4] as [number, number]) };
    start({ online: false });
    await flush();
    expect(getListenSnapshot().mode).toBe('recording');
    expect(mockSpoken).toHaveLength(0);
  });
});

describe('a hosted recording', () => {
  test('a recording whose timing describes these very words is played and followed', async () => {
    mockOrigin.value = 'https://audio.example.com';
    mockHosted.value = true;
    // The fake player's recording is 6 s long, and a timing only counts when it describes a recording of that length.
    const each = 6 / segments.length;
    mockTiming.value = { hash: hashSegments(segments), duration: 6, segments: segments.map((_, i) => [i * each, (i + 1) * each - 0.01] as [number, number]) };
    start();
    await flush();
    expect(getListenSnapshot()).toMatchObject({ mode: 'recording', state: 'playing' });
    expect(canJumpBySentence()).toBe(true);
    expect(mockSpoken).toHaveLength(0);
  });

  test('a Tagalog lesson has no recording (Kokoro has no Filipino voice, so there is no `_fil` folder) and is read in the phone’s Filipino voice', async () => {
    mockOrigin.value = 'https://audio.example.com';
    mockHosted.value = false;
    startListening({ ...session, voiceLanguage: 'fil-PH' }, { rate: 1, online: true });
    await flush();
    expect(getListenSnapshot().mode).toBe('phone');
    expect(mockSpoken[0]).toMatchObject({ language: 'fil-PH' });
  });

  test('a lesson whose recording isn’t there is read by the phone, with no leftovers of the recording on show', async () => {
    mockOrigin.value = 'https://audio.example.com';
    mockHosted.value = false;
    start();
    await flush();
    expect(getListenSnapshot()).toMatchObject({ mode: 'phone', state: 'speaking', activeSegment: 0, timing: null, peaks: null, position: 0, duration: 0, fallback: 'missing' });
    expect(mockPlayers).toHaveLength(0);
  });

  test('the phone’s voice reads the sentences in order, one at a time, and the highlight follows', async () => {
    start();
    expect(getListenSnapshot().activeSegment).toBe(0);
    mockSpoken[0].onDone?.();
    expect(getListenSnapshot().activeSegment).toBe(1);
    expect(mockSpoken[1].text).toBe(segments[1].text);
    expect(canJumpBySentence()).toBe(true);
  });
});
