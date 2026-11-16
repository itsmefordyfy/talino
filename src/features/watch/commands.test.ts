import { describe, expect, it, jest } from '@jest/globals';

import { createResultLedger } from '@/lib/result-ledger';

import { handleWatchCommand, type CommandContext, type ListenPort } from './commands';
import type { WatchResult } from './types';

function setup(state: ReturnType<ListenPort['state']>, canSkip = true) {
  let stored: string | null = null;
  const toggle = jest.fn();
  const skip = jest.fn();
  const pushSnapshot = jest.fn();
  const ctx: CommandContext = {
    listen: { state: () => state, canSkip: () => canSkip, toggle, skip },
    ledger: createResultLedger<WatchResult>({ read: () => stored, write: (value) => void (stored = value) }),
    pushSnapshot,
  };
  return { ctx, toggle, skip, pushSnapshot };
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
});
