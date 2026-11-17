import type { WatchCommand } from '../types';

const isText = (value: unknown): value is string => typeof value === 'string' && value !== '' && value.length <= 80;

/**
 * Turns what the Watch sent into a command, or null. A message crosses a process boundary and an app version boundary (the Watch
 * app can be older or newer than this one), so nothing in it is trusted until it is checked.
 */
export function parseWatchCommand(json: string): WatchCommand | null {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return null;
  }
  if (typeof raw !== 'object' || raw === null) return null;
  const c = raw as Record<string, unknown>;
  if (!isText(c.id)) return null;
  const id = c.id;
  switch (c.type) {
    case 'snapshot.request':
    case 'listen.play':
    case 'listen.pause':
      return { id, type: c.type };
    case 'listen.start':
    case 'listen.toWatch':
      return { id, type: c.type };
    case 'listen.resume':
      return isText(c.lessonId) && typeof c.segment === 'number' && Number.isInteger(c.segment) && c.segment >= 0 && c.segment <= 100_000 ? { id, type: 'listen.resume', lessonId: c.lessonId, segment: c.segment } : null;
    case 'listen.skip':
      return c.by === 1 || c.by === -1 ? { id, type: 'listen.skip', by: c.by } : null;
    default:
      return null;
  }
}
