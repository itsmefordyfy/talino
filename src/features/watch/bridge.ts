import { native, type WatchLinkStatus } from '@/modules/talino-watch';

import { parseWatchCommand } from './lib/parse-command';
import type { WatchCommand, WatchResult, WatchSnapshot } from './types';

const FAILED: WatchResult = { ok: false, reason: 'failed' };

/** Null where there is no Watch link at all (Android, web, Expo Go, a build made before the Watch app). */
export function watchStatus(): WatchLinkStatus | null {
  return native?.status() ?? null;
}

export function pushSnapshot(snapshot: WatchSnapshot): void {
  native?.pushState(JSON.stringify(snapshot));
}

/**
 * Runs `handler` for every command the Watch sends and sends its answer back. A message that doesn't check out, or a handler that
 * throws, still gets an answer, so the Watch never waits on a command nobody will reply to.
 */
export function onWatchCommand(handler: (command: WatchCommand) => Promise<WatchResult>): () => void {
  if (!native) return () => {};
  const link = native;
  // One at a time, in the order they arrived: the same command can come twice (live and through the system's queue) and a second
  // never starts before the first has been remembered.
  let chain: Promise<unknown> = Promise.resolve();
  const subscription = link.addListener('onCommand', ({ id, json }) => {
    const command = parseWatchCommand(json);
    const answer = chain.then(() => (command ? handler(command).catch((): WatchResult => FAILED) : FAILED));
    chain = answer;
    void answer.then((result) => link.reply(id, JSON.stringify(result)));
  });
  return () => subscription.remove();
}
