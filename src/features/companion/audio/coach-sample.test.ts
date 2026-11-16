import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

type FakePlayer = { paused: boolean; removed: boolean; playing: boolean; listener: ((status: { didJustFinish: boolean }) => void) | null };
const mockPlayers: FakePlayer[] = [];
const mockStopListening = jest.fn();

jest.mock('expo', () => ({ requireOptionalNativeModule: () => ({}) }));
jest.mock('@/lib/monitoring', () => ({ reportError: () => {} }));
jest.mock('@/features/courses/data', () => ({ stopListening: () => mockStopListening() }));
jest.mock('expo-audio', () => ({
  setAudioModeAsync: async () => {},
  createAudioPlayer: () => {
    const player: FakePlayer = { paused: false, removed: false, playing: false, listener: null };
    mockPlayers.push(player);
    return {
      addListener: (_: string, listener: FakePlayer['listener']) => {
        player.listener = listener;
      },
      play: () => {
        player.playing = true;
      },
      // `remove()` alone does NOT stop the sound in expo-audio (proved on the simulator): only pause() does.
      pause: () => {
        player.playing = false;
        player.paused = true;
      },
      remove: () => {
        player.removed = true;
      },
    };
  },
}));

import { playCoachSample, stopCoachSample } from './coach-sample';

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('coach greetings', () => {
  beforeEach(() => {
    mockPlayers.length = 0;
    mockStopListening.mockClear();
  });
  afterEach(() => stopCoachSample());

  test('playing the other coach stops the first one: only one voice at a time', async () => {
    await playCoachSample('tali', () => {});
    await settle();
    await playCoachSample('tala', () => {});
    await settle();
    expect(mockPlayers).toHaveLength(2);
    expect(mockPlayers[0]).toMatchObject({ playing: false, paused: true, removed: true });
    expect(mockPlayers[1]).toMatchObject({ playing: true, removed: false });
  });

  test('stop pauses and releases the sound, not only forgets it', async () => {
    await playCoachSample('tala', () => {});
    await settle();
    stopCoachSample();
    expect(mockPlayers[0]).toMatchObject({ playing: false, paused: true, removed: true });
  });

  test('a greeting started and replaced before it loaded never plays', async () => {
    const first = playCoachSample('tali', () => {});
    const second = playCoachSample('tala', () => {});
    await Promise.all([first, second]);
    await settle();
    expect(mockPlayers.filter((player) => player.playing)).toHaveLength(1);
  });

  test('starting a greeting stops a lesson that is being read, and finishing tells the picker', async () => {
    const done = jest.fn();
    await playCoachSample('tali', done);
    await settle();
    expect(mockStopListening).toHaveBeenCalled();
    mockPlayers[0].listener?.({ didJustFinish: true });
    expect(done).toHaveBeenCalledTimes(1);
    expect(mockPlayers[0].removed).toBe(true);
  });
});
