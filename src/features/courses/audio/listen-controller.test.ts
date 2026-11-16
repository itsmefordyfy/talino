import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import type { Lesson } from '../content/types';
import { hashSegments, lessonSegments } from '../lib/speech-segments';
import type { ListenTiming, SavedPosition } from './listen-timing';
import {
  canJumpBySentence,
  getListenSnapshot,
  jumpToSegment,
  savedListenPlace,
  seekListening,
  setListenRate,
  skipListening,
  skipSegment,
  speakReply,
  startListening,
  stopListening,
  subscribeListen,
  togglePlayPause,
  type ListenSession,
} from './listen-controller';

// jest hoists `jest.mock` above the imports; the fakes below are plain objects the tests steer.
const mockNative = jest.fn<() => unknown>();
jest.mock('expo', () => ({ requireOptionalNativeModule: () => mockNative() }));

type StatusListener = (status: { currentTime: number; duration: number; didJustFinish: boolean }) => void;
const mockPlayer: {
  current: null | {
    currentTime: number;
    duration: number;
    playing: boolean;
    rate: number;
    listener: StatusListener | null;
    seekTo: (seconds: number) => Promise<void>;
    emit: (time: number, didJustFinish?: boolean) => void;
  };
} = { current: null };
const mockSeeks: number[] = [];
const mockDuration = { value: 100 };
jest.mock('expo-audio', () => ({
  setAudioModeAsync: async () => {},
  createAudioPlayer: () => {
    const player = {
      currentTime: 0,
      duration: mockDuration.value,
      playing: false,
      rate: 1,
      listener: null as StatusListener | null,
      seekTo: async (seconds: number) => {
        mockSeeks.push(seconds);
        player.currentTime = seconds;
      },
      play: () => {
        player.playing = true;
      },
      pause: () => {
        player.playing = false;
      },
      setPlaybackRate: (rate: number) => {
        player.rate = rate;
      },
      addListener: (_event: string, listener: StatusListener) => {
        player.listener = listener;
      },
      setActiveForLockScreen: () => {},
      clearLockScreenControls: () => {},
      remove: () => {},
      emit: (time: number, didJustFinish = false) => {
        player.currentTime = time;
        player.listener?.({ currentTime: time, duration: player.duration, didJustFinish });
      },
    };
    mockPlayer.current = player;
    return player;
  },
}));

const mockSpoken: { text: string; language?: string; rate?: number; onDone?: () => void; onStopped?: () => void; onError?: () => void }[] = [];
const mockStop = jest.fn();
jest.mock('expo-speech', () => ({
  speak: (text: string, options: Record<string, unknown>) => mockSpoken.push({ text, ...options }),
  stop: () => mockStop(),
}));
jest.mock('@/lib/monitoring', () => ({ reportError: jest.fn() }));

const mockTimingFile: { current: ListenTiming | null } = { current: null };
const mockForgotten: string[] = [];
jest.mock('./audio-cache', () => ({
  AUDIO_ORIGIN: 'https://audio.test',
  savedLessonAudio: () => ({ uri: 'file:///lesson.m4a' }),
  downloadLessonAudio: async () => ({ uri: 'file:///lesson.m4a' }),
  loadLessonPeaks: async () => null,
  loadLessonTiming: async () => mockTimingFile.current,
  forgetLessonAudio: (lessonId: string) => mockForgotten.push(lessonId),
}));

const mockSaved = new Map<string, SavedPosition>();
jest.mock('./listen-position', () => ({
  loadListenPosition: (lessonId: string, voice: string) => mockSaved.get(`${voice}:${lessonId}`) ?? null,
  saveListenPosition: (lessonId: string, voice: string, position: SavedPosition) => mockSaved.set(`${voice}:${lessonId}`, position),
  clearListenPosition: (lessonId: string, voice: string) => mockSaved.delete(`${voice}:${lessonId}`),
  clearAllListenPositions: () => mockSaved.clear(),
}));


const lesson = {
  id: 'x-01',
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
// Every segment is 4 s of speech and 1 s of pause: segment i is spoken from 5i to 5i + 4.
const timing: ListenTiming = { hash: hashSegments(segments), duration: segments.length * 5, segments: segments.map((_, i) => [i * 5, i * 5 + 4] as [number, number]) };

const session = (lessonId = 'x-01'): ListenSession => ({ lessonId, lessonTitle: `Lesson ${lessonId}`, courseTitle: 'Course', outline: [{ title: `Lesson ${lessonId}`, at: 0 }], script: 'Hello.', segments });

const flush = async () => {
  for (let i = 0; i < 12; i++) await new Promise((resolve) => setTimeout(resolve, 0));
};
const player = () => {
  if (!mockPlayer.current) throw new Error('no player was made');
  return mockPlayer.current;
};
/** Moves past the half second after a jump during which the player's own (stale) updates are ignored. */
const settleAfterJump = () => new Promise((resolve) => setTimeout(resolve, 520));

beforeEach(() => {
  stopListening();
  mockNative.mockReturnValue({});
  mockPlayer.current = null;
  mockSeeks.length = 0;
  mockSpoken.length = 0;
  mockStop.mockClear();
  mockSaved.clear();
  mockForgotten.length = 0;
  mockTimingFile.current = timing;
  mockDuration.value = timing.duration;
});

describe('shared state', () => {
  test('starts idle, with nothing being read', () => {
    expect(getListenSnapshot()).toMatchObject({ state: 'idle', session: null, activeSegment: null, mode: null });
  });

  test('listeners are told, one lesson replaces another, and stopping goes back to idle whoever started it', async () => {
    const seen: string[] = [];
    const unsubscribe = subscribeListen(() => seen.push(getListenSnapshot().session?.lessonId ?? 'none'));
    startListening(session('a'), { rate: 1, online: true });
    await flush();
    startListening(session('b'), { rate: 1, online: true });
    await flush();
    expect(getListenSnapshot().session?.lessonId).toBe('b');
    expect(seen).toContain('a');
    stopListening();
    expect(getListenSnapshot()).toMatchObject({ state: 'idle', session: null, position: 0, timing: null, activeSegment: null });
    unsubscribe();
  });
});

describe('a recording with timing', () => {
  test('starts playing and follows the sentence being spoken from the player position', async () => {
    startListening(session(), { rate: 1, online: true });
    await flush();
    expect(getListenSnapshot()).toMatchObject({ state: 'playing', mode: 'recording', activeSegment: 0 });
    expect(player().playing).toBe(true);

    for (const [time, expected] of [
      [3.9, 0],
      [5.0, 1],
      [9.5, 1],
      [10.0, 2],
      [30.2, 6],
    ] as const) {
      player().emit(time);
      expect(getListenSnapshot().activeSegment).toBe(expected);
    }
  });

  test('the first sentence is active at once, and the pause after a sentence keeps that sentence lit (no blink)', async () => {
    startListening(session(), { rate: 1, online: true });
    await flush();
    player().emit(0);
    expect(getListenSnapshot().activeSegment).toBe(0);
    player().emit(4.6);
    expect(getListenSnapshot().activeSegment).toBe(0);
  });

  test('uses the timing for the lesson sections too: the player\'s section marks are where the heading is really spoken', async () => {
    startListening(session(), { rate: 1, online: true });
    await flush();
    const heading = segments.findIndex((segment) => segment.heading);
    const outline = getListenSnapshot().session?.outline ?? [];
    expect(outline[1]).toEqual({ title: 'Be specific', at: (heading * 5) / timing.duration });
  });

  test('jumping to a sentence seeks to its start, lights it up at once and plays (even from pause)', async () => {
    startListening(session(), { rate: 1, online: true });
    await flush();
    player().emit(2);
    togglePlayPause();
    expect(getListenSnapshot().state).toBe('paused');
    expect(player().playing).toBe(false);

    jumpToSegment(7);
    expect(mockSeeks.at(-1)).toBe(35);
    expect(getListenSnapshot()).toMatchObject({ activeSegment: 7, position: 35, state: 'playing' });
    expect(player().playing).toBe(true);
  });

  test('stale updates from before a jump are ignored until the player has settled, then it follows again', async () => {
    startListening(session(), { rate: 1, online: true });
    await flush();
    player().emit(2);
    jumpToSegment(5);
    // The player still reports the old place for a moment.
    player().emit(2.3);
    expect(getListenSnapshot().activeSegment).toBe(5);
    await settleAfterJump();
    player().emit(25.5);
    expect(getListenSnapshot().activeSegment).toBe(5);
    player().emit(31);
    expect(getListenSnapshot().activeSegment).toBe(6);
  });

  test('seeking backwards and forwards by seconds or on the waveform keeps the sentence in step', async () => {
    startListening(session(), { rate: 1, online: true });
    await flush();
    player().emit(40);
    expect(getListenSnapshot().activeSegment).toBe(8);
    skipListening(-15);
    expect(mockSeeks.at(-1)).toBe(25);
    expect(getListenSnapshot().activeSegment).toBe(5);
    await settleAfterJump();
    skipListening(15);
    expect(mockSeeks.at(-1)).toBe(40);
    expect(getListenSnapshot().activeSegment).toBe(8);
    await settleAfterJump();
    seekListening(0.5);
    expect(getListenSnapshot().activeSegment).toBe(Math.floor((timing.duration * 0.5) / 5));
  });

  test('pausing and resuming leaves the sentence where it was', async () => {
    startListening(session(), { rate: 1, online: true });
    await flush();
    player().emit(12);
    expect(getListenSnapshot().activeSegment).toBe(2);
    togglePlayPause();
    expect(getListenSnapshot()).toMatchObject({ state: 'paused', activeSegment: 2 });
    togglePlayPause();
    expect(getListenSnapshot()).toMatchObject({ state: 'playing', activeSegment: 2 });
    player().emit(12.5);
    expect(getListenSnapshot().activeSegment).toBe(2);
  });

  test('changing the speed changes the playback rate only: the timing is in the recording\'s own time, so nothing moves', async () => {
    startListening(session(), { rate: 1, online: true });
    await flush();
    player().emit(17);
    expect(getListenSnapshot().activeSegment).toBe(3);
    setListenRate(1.2);
    expect(player().rate).toBe(1.2);
    expect(getListenSnapshot().activeSegment).toBe(3);
    player().emit(20);
    expect(getListenSnapshot().activeSegment).toBe(4);
    setListenRate(0.8);
    expect(player().rate).toBe(0.8);
    player().emit(21);
    expect(getListenSnapshot().activeSegment).toBe(4);
  });

  test('previous plays the sentence again when already well into it, otherwise goes back one; next goes forward; paragraphs jump further', async () => {
    startListening(session(), { rate: 1, online: true });
    await flush();
    player().emit(21); // 1 s into sentence 4
    skipSegment(-1);
    expect(getListenSnapshot().activeSegment).toBe(3);
    await settleAfterJump();
    player().emit(18.1); // 3.1 s into sentence 3 (it starts at 15)
    skipSegment(-1);
    expect(getListenSnapshot().activeSegment).toBe(3);
    expect(mockSeeks.at(-1)).toBe(15);
    await settleAfterJump();
    skipSegment(1);
    expect(getListenSnapshot().activeSegment).toBe(4);
    await settleAfterJump();
    const before = getListenSnapshot().activeSegment ?? 0;
    skipSegment(1, 'paragraph');
    expect(getListenSnapshot().activeSegment ?? 0).toBeGreaterThan(before);
  });

  test('can be jumped around while playing and paused, not while still loading', async () => {
    startListening(session(), { rate: 1, online: true });
    expect(getListenSnapshot().state).toBe('loading');
    expect(canJumpBySentence()).toBe(false);
    await flush();
    expect(canJumpBySentence()).toBe(true);
    togglePlayPause();
    expect(canJumpBySentence()).toBe(true);
  });

  // The bug (owner, 2026-11-15): tapping Listen again, or opening the next lesson, started "in another section" because a lesson carried on
  // from where it was last stopped. Listen always starts from the beginning; carrying on is only for a caller that asks for it.
  test('starts from the beginning even though a place was saved', async () => {
    startListening(session(), { rate: 1, online: true });
    await flush();
    player().emit(17.4);
    stopListening();
    expect(savedListenPlace(segments, 'x-01')).toEqual({ segment: 3, time: 17.4 });

    startListening(session(), { rate: 1, online: true });
    await flush();
    expect(getListenSnapshot()).toMatchObject({ state: 'playing', activeSegment: 0 });
    expect(mockSeeks.at(-1) ?? 0).toBe(0);
  });

  test('carrying on from the saved place happens only when asked: the same sentence from its start, then follows on from there', async () => {
    startListening(session(), { rate: 1, online: true });
    await flush();
    player().emit(17.4);
    stopListening();

    startListening(session(), { rate: 1, online: true, from: 'saved' });
    await flush();
    expect(mockSeeks.at(-1)).toBe(15);
    expect(getListenSnapshot()).toMatchObject({ state: 'playing', activeSegment: 3, position: 15 });
  });

  test('hearing the lesson to the end forgets the place', async () => {
    startListening(session(), { rate: 1, online: true });
    await flush();
    player().emit(30);
    stopListening();
    expect(savedListenPlace(segments, 'x-01')).not.toBeNull();
    startListening(session(), { rate: 1, online: true });
    await flush();
    player().emit(timing.duration - 0.2, true);
    expect(getListenSnapshot().state).toBe('idle');
    expect(savedListenPlace(segments, 'x-01')).toBeNull();
  });
});

describe('a recording that does not match the lesson', () => {
  test('timing for different words is not used: the recording plays, nothing is highlighted, nothing can be jumped to', async () => {
    mockTimingFile.current = { ...timing, hash: '00000000' };
    startListening(session(), { rate: 1, online: true });
    await flush();
    player().emit(12);
    expect(getListenSnapshot()).toMatchObject({ state: 'playing', timing: null, activeSegment: null });
    expect(canJumpBySentence()).toBe(false);
    jumpToSegment(3);
    expect(mockSeeks).toEqual([]);
    expect(mockForgotten).toEqual([]);
  });

  test('a recording with no timing file at all behaves the same', async () => {
    mockTimingFile.current = null;
    startListening(session(), { rate: 1, online: true });
    await flush();
    player().emit(12);
    expect(getListenSnapshot()).toMatchObject({ state: 'playing', timing: null, activeSegment: null });
  });

  test('timing for a recording of another length means the saved recording is old: it stops following and is downloaded again next time', async () => {
    startListening(session(), { rate: 1, online: true });
    await flush();
    expect(getListenSnapshot().timing).not.toBeNull();
    // The player now reports a very different length.
    const current = player();
    current.duration = timing.duration + 60;
    current.listener?.({ currentTime: 3, duration: current.duration, didJustFinish: false });
    expect(getListenSnapshot()).toMatchObject({ timing: null, activeSegment: null });
    expect(mockForgotten).toEqual(['x-01']);
  });
});

describe("the phone's own voice", () => {
  beforeEach(() => {
    mockNative.mockReturnValue(null);
  });

  test('speaks one sentence at a time and the sentence being spoken is the active one', () => {
    startListening(session(), { rate: 1, online: true });
    expect(getListenSnapshot()).toMatchObject({ state: 'speaking', mode: 'phone', activeSegment: 0 });
    expect(mockSpoken.map((entry) => entry.text)).toEqual([segments[0].text]);
    mockSpoken[0].onDone?.();
    expect(getListenSnapshot().activeSegment).toBe(1);
    expect(mockSpoken.at(-1)?.text).toBe(segments[1].text);
  });

  test('jumping to a sentence stops the one being spoken, starts the new one, and the old one finishing later changes nothing', () => {
    startListening(session(), { rate: 1, online: true });
    const first = mockSpoken[0];
    jumpToSegment(5);
    expect(mockStop).toHaveBeenCalled();
    expect(mockSpoken.at(-1)?.text).toBe(segments[5].text);
    expect(getListenSnapshot().activeSegment).toBe(5);
    first.onDone?.();
    first.onStopped?.();
    expect(getListenSnapshot().activeSegment).toBe(5);
    expect(mockSpoken).toHaveLength(2);
  });

  test('pause stops where it is and resume starts that sentence again', () => {
    startListening(session(), { rate: 1, online: true });
    mockSpoken[0].onDone?.();
    mockSpoken[1].onDone?.();
    expect(getListenSnapshot().activeSegment).toBe(2);
    togglePlayPause();
    expect(getListenSnapshot()).toMatchObject({ state: 'paused', activeSegment: 2 });
    // The utterance that was cut off reports back: it must not move on.
    mockSpoken[2].onStopped?.();
    mockSpoken[2].onDone?.();
    expect(getListenSnapshot().activeSegment).toBe(2);
    const spokenBefore = mockSpoken.length;
    togglePlayPause();
    expect(getListenSnapshot()).toMatchObject({ state: 'speaking', activeSegment: 2 });
    expect(mockSpoken).toHaveLength(spokenBefore + 1);
    expect(mockSpoken.at(-1)?.text).toBe(segments[2].text);
  });

  test('previous, next and paragraph skips work the same as for a recording', () => {
    startListening(session(), { rate: 1, online: true });
    mockSpoken[0].onDone?.();
    mockSpoken[1].onDone?.();
    skipSegment(-1);
    expect(getListenSnapshot().activeSegment).toBe(1);
    skipSegment(1);
    expect(getListenSnapshot().activeSegment).toBe(2);
    expect(canJumpBySentence()).toBe(true);
  });

  test('a speed change starts the sentence again at the new speed', () => {
    startListening(session(), { rate: 1, online: true });
    mockSpoken[0].onDone?.();
    setListenRate(1.2);
    expect(mockSpoken.at(-1)).toMatchObject({ text: segments[1].text, rate: 1.2 });
    expect(getListenSnapshot().activeSegment).toBe(1);
  });

  test('finishing the last sentence ends the session and forgets the place', () => {
    startListening(session(), { rate: 1, online: true });
    jumpToSegment(segments.length - 1);
    mockSpoken.at(-1)?.onDone?.();
    expect(getListenSnapshot().state).toBe('idle');
    expect(savedListenPlace(segments, 'x-01')).toBeNull();
  });

  test('starts from the first sentence even though the learner stopped further on', () => {
    startListening(session(), { rate: 1, online: true });
    jumpToSegment(6);
    stopListening();
    startListening(session(), { rate: 1, online: true });
    expect(getListenSnapshot().activeSegment).toBe(0);
    expect(mockSpoken.at(-1)?.text).toBe(segments[0].text);
  });

  test('the phone\'s voice carries on from the saved sentence only when asked', () => {
    startListening(session(), { rate: 1, online: true });
    jumpToSegment(6);
    stopListening();
    startListening(session(), { rate: 1, online: true, from: 'saved' });
    expect(getListenSnapshot().activeSegment).toBe(6);
    expect(mockSpoken.at(-1)?.text).toBe(segments[6].text);
  });

  test('a coach answer is read whole, has nothing to follow or jump to, and stopping it goes back to idle', () => {
    speakReply({ lessonId: 'reply:1:2', lessonTitle: 'Reading the answer', courseTitle: 'First words', script: 'The answer text.' }, { rate: 1, language: 'en-US' });
    expect(getListenSnapshot()).toMatchObject({ state: 'speaking', mode: 'phone', activeSegment: null });
    expect(getListenSnapshot().session?.kind).toBe('reply');
    expect(mockSpoken.at(-1)).toMatchObject({ text: 'The answer text.', language: 'en-US' });
    expect(canJumpBySentence()).toBe(false);
    jumpToSegment(1);
    togglePlayPause();
    expect(getListenSnapshot().state).toBe('speaking');
    mockSpoken.at(-1)?.onDone?.();
    expect(getListenSnapshot().state).toBe('idle');
  });
});
