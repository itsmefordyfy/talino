import type { ResultLedger } from '@/lib/result-ledger';

import type { WatchCommand, WatchFailure, WatchResult } from './types';

/** The listener the Watch steers (the app's `listen-controller`, behind a small seam so the rules can be tested). */
export type ListenPort = {
  state(): 'idle' | 'loading' | 'playing' | 'paused' | 'speaking';
  canSkip(): boolean;
  /** Pauses what plays or carries on what is paused. */
  toggle(): void;
  skip(by: 1 | -1): void;
};

export type CommandContext = {
  listen: ListenPort;
  ledger: ResultLedger<WatchResult>;
  pushSnapshot: () => void;
};

const OK: WatchResult = { ok: true };
const refuse = (reason: WatchFailure): WatchResult => ({ ok: false, reason });

/**
 * Plays, pauses or skips what the phone is reading. The commands are "set this state", never "toggle": playing something that already
 * plays does nothing, so a retry is harmless. A skip is a step, not a state, so the command id is what keeps a repeat from skipping
 * twice: the first answer is remembered and a repeat gets it back.
 */
export async function handleWatchCommand(ctx: CommandContext, command: WatchCommand): Promise<WatchResult> {
  const known = ctx.ledger.find(command.id);
  if (known) return known;
  const result = run(ctx, command);
  // A refusal is an answer worth remembering too (the Watch gets the same one on a retry); only a throw is not, so it can be tried again.
  ctx.ledger.remember(command.id, result);
  return result;
}

function run(ctx: CommandContext, command: WatchCommand): WatchResult {
  const { listen } = ctx;
  switch (command.type) {
    case 'snapshot.request':
      ctx.pushSnapshot();
      return OK;
    case 'listen.play': {
      const state = listen.state();
      if (state === 'idle') return refuse('nothing_playing');
      if (state === 'paused') listen.toggle();
      return OK;
    }
    case 'listen.pause': {
      const state = listen.state();
      if (state === 'idle') return refuse('nothing_playing');
      if (state === 'playing' || state === 'speaking') listen.toggle();
      return OK;
    }
    case 'listen.skip':
      if (listen.state() === 'idle') return refuse('nothing_playing');
      if (!listen.canSkip()) return refuse('cannot_skip');
      listen.skip(command.by);
      return OK;
  }
}
