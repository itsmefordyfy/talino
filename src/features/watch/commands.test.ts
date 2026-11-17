import { describe, expect, it, jest } from '@jest/globals';

import { createResultLedger } from '@/lib/result-ledger';

import { handleWatchCommand, type CommandContext, type ListenPort } from './commands';
import type { WatchResult } from './types';

const LESSON = { lessonId: 'starter-02', title: 'Day 2', course: 'AI Basics for Tech', language: 'en', sentences: ['One.', 'Two.'], at: [0, 1], segment: 1 };

function setup(state: ReturnType<ListenPort['state']>, canSkip = true, lesson: typeof LESSON | null = LESSON) {
  let stored: string | null = null;
  const toggle = jest.fn();
  const skip = jest.fn();
  const stop = jest.fn();
  const pushSnapshot = jest.fn();
  const ctx: CommandContext = {
    listen: { state: () => state, canSkip: () => canSkip, toggle, skip, stop, lessonForWatch: () => lesson, startNext: () => lesson !== null, resume: (id) => id === 'known' },
    ledger: createResultLedger<WatchResult>({ read: () => stored, write: (value) => void (stored = value) }),
    pushSnapshot,
  };
  return { ctx, toggle, skip, stop, pushSnapshot };
}

describe('handleWatchCommand', () => {
  it('plays a paused lesson and leaves a playing one alone', async () => {
    const paused = setup('paused');
    expect(await handleWatchCommand(paused.ctx, { id: '1', type: 'listen.play' })).toEqual({ ok: true });
    expect(paused.toggle).toHaveBeenCalledTimes(1);
    const playing = setup('playing');
    expect(await handleWatchCommand(playing.ctx, { id: '1', type: 'listen.play' })).toEqual({ ok: true });
    expect(playing.toggle).not.toHaveBeenCalled();
  });

  it('pauses what plays (the phone voice too) and leaves a paused one alone', async () => {
    for (const state of ['playing', 'speaking'] as const) {
      const live = setup(state);
      await handleWatchCommand(live.ctx, { id: '1', type: 'listen.pause' });
      expect(live.toggle).toHaveBeenCalledTimes(1);
    }
    const paused = setup('paused');
    await handleWatchCommand(paused.ctx, { id: '1', type: 'listen.pause' });
    expect(paused.toggle).not.toHaveBeenCalled();
  });

  it('refuses everything while nothing is being read', async () => {
    const idle = setup('idle');
    expect(await handleWatchCommand(idle.ctx, { id: '1', type: 'listen.play' })).toEqual({ ok: false, reason: 'nothing_playing' });
    expect(await handleWatchCommand(idle.ctx, { id: '2', type: 'listen.pause' })).toEqual({ ok: false, reason: 'nothing_playing' });
    expect(await handleWatchCommand(idle.ctx, { id: '3', type: 'listen.skip', by: 1 })).toEqual({ ok: false, reason: 'nothing_playing' });
    expect(idle.toggle).not.toHaveBeenCalled();
  });

  it('skips a sentence, and refuses when the voice cannot jump', async () => {
    const can = setup('playing');
    expect(await handleWatchCommand(can.ctx, { id: '1', type: 'listen.skip', by: -1 })).toEqual({ ok: true });
    expect(can.skip).toHaveBeenCalledWith(-1);
    const cannot = setup('playing', false);
    expect(await handleWatchCommand(cannot.ctx, { id: '1', type: 'listen.skip', by: 1 })).toEqual({ ok: false, reason: 'cannot_skip' });
    expect(cannot.skip).not.toHaveBeenCalled();
  });

  it('answers a repeated id with the first result and never skips twice', async () => {
    const live = setup('playing');
    await handleWatchCommand(live.ctx, { id: 'same', type: 'listen.skip', by: 1 });
    await handleWatchCommand(live.ctx, { id: 'same', type: 'listen.skip', by: 1 });
    expect(live.skip).toHaveBeenCalledTimes(1);
  });

  it('pushes a fresh snapshot when the Watch asks', async () => {
    const live = setup('idle');
    expect(await handleWatchCommand(live.ctx, { id: '1', type: 'snapshot.request' })).toEqual({ ok: true });
    expect(live.pushSnapshot).toHaveBeenCalledTimes(1);
  });

  describe('choosing where the voice plays', () => {
    it('hands the lesson to the Watch and silences the phone, so only one plays', async () => {
      const live = setup('speaking');
      expect(await handleWatchCommand(live.ctx, { id: 'w1', type: 'listen.toWatch' })).toEqual({ ok: true, lesson: LESSON });
      expect(live.stop).toHaveBeenCalledTimes(1);
    });

    it('sends the next lesson without stopping anything when the phone is idle, and says so when there is none', async () => {
      const idle = setup('idle');
      expect(await handleWatchCommand(idle.ctx, { id: 'w2', type: 'listen.toWatch' })).toEqual({ ok: true, lesson: LESSON });
      expect(idle.stop).not.toHaveBeenCalled();
      const none = setup('idle', true, null);
      expect(await handleWatchCommand(none.ctx, { id: 'w3', type: 'listen.toWatch' })).toEqual({ ok: false, reason: 'no_lesson' });
    });

    it('answers a retry of a handover with the same lesson, without stopping or asking the phone again', async () => {
      const live = setup('playing');
      const first = await handleWatchCommand(live.ctx, { id: 'w4', type: 'listen.toWatch' });
      const again = await handleWatchCommand(live.ctx, { id: 'w4', type: 'listen.toWatch' });
      expect(again).toEqual(first);
      expect(live.stop).toHaveBeenCalledTimes(1);
    });

    it('starts the next lesson on the phone, or refuses when there is none', async () => {
      expect(await handleWatchCommand(setup('idle').ctx, { id: 's1', type: 'listen.start' })).toEqual({ ok: true });
      expect(await handleWatchCommand(setup('idle', true, null).ctx, { id: 's2', type: 'listen.start' })).toEqual({ ok: false, reason: 'no_lesson' });
    });

    it('hands the voice back to the phone at a sentence, or refuses a lesson it does not know', async () => {
      expect(await handleWatchCommand(setup('idle').ctx, { id: 'r1', type: 'listen.resume', lessonId: 'known', segment: 5 })).toEqual({ ok: true });
      expect(await handleWatchCommand(setup('idle').ctx, { id: 'r2', type: 'listen.resume', lessonId: 'other', segment: 5 })).toEqual({ ok: false, reason: 'no_lesson' });
    });
  });
});
