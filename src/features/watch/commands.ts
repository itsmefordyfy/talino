import type { ResultLedger } from '@/lib/result-ledger';

import type { WatchCommand, WatchFailure, WatchLesson, WatchResult } from './types';

/** The listener the Watch steers (the app's `listen-controller`, behind a small seam so the rules can be tested). */
export type ListenPort = {
  state(): 'idle' | 'loading' | 'playing' | 'paused' | 'speaking';
  canSkip(): boolean;
  /** Pauses what plays or carries on what is paused. */
  toggle(): void;
  skip(by: 1 | -1): void;
  /** Stops whatever is reading. */
  stop(): void;
  /** The lesson to speak on the Watch: the one being read from where it is, else the lesson Home leads with from the start; null when there is none. */
  lessonForWatch(): WatchLesson | null;
  /** Reads the lesson Home leads with; false when there is none. */
  startNext(): boolean;
  /** Reads `lessonId` from sentence `segment`; false when there is no such lesson. */
  resume(lessonId: string, segment: number): boolean;
};

export type CommandContext = {
  listen: ListenPort;
  ledger: ResultLedger<WatchResult>;
  pushSnapshot: () => void;
};

const OK: WatchResult = { ok: true };

/** A lesson's text is too big to keep in the ledger (it is stored on the phone for retries), so these replies are kept in memory only, for a retry within the same run. */
const handedOver = new Map<string, WatchResult>();
const HANDED_OVER_KEPT = 3;
const refuse = (reason: WatchFailure): WatchResult => ({ ok: false, reason });

/**
 * Plays, pauses or skips what the phone is reading. The commands are "set this state", never "toggle": playing something that already
 * plays does nothing, so a retry is harmless. A skip is a step, not a state, so the command id is what keeps a repeat from skipping
 * twice: the first answer is remembered and a repeat gets it back.
 */
export async function handleWatchCommand(ctx: CommandContext, command: WatchCommand): Promise<WatchResult> {
  const known = ctx.ledger.find(command.id) ?? handedOver.get(command.id);
  if (known) return known;
  const result = run(ctx, command);
  if (result.ok && result.lesson) {
    handedOver.set(command.id, result);
    if (handedOver.size > HANDED_OVER_KEPT) handedOver.delete(handedOver.keys().next().value as string);
    return result;
  }
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
    case 'listen.start':
      return listen.startNext() ? OK : refuse('no_lesson');
    case 'listen.toWatch': {
      // One voice at a time: the phone is silenced as the lesson is handed over, so the Watch never talks over it.
      const lesson = listen.lessonForWatch();
      if (!lesson) return refuse('no_lesson');
      if (listen.state() !== 'idle') listen.stop();
      return { ok: true, lesson };
    }
    case 'listen.resume':
      return listen.resume(command.lessonId, command.segment) ? OK : refuse('no_lesson');
    case 'listen.skip':
      if (listen.state() === 'idle') return refuse('nothing_playing');
      if (!listen.canSkip()) return refuse('cannot_skip');
      listen.skip(command.by);
      return OK;
  }
}
