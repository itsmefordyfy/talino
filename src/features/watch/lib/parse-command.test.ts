import { describe, expect, it } from '@jest/globals';

import { parseWatchCommand } from './parse-command';

const parse = (value: unknown) => parseWatchCommand(JSON.stringify(value));

describe('parseWatchCommand', () => {
  it('reads each command the Watch can send', () => {
    expect(parse({ id: '1', type: 'snapshot.request' })).toEqual({ id: '1', type: 'snapshot.request' });
    expect(parse({ id: '1', type: 'listen.play' })).toEqual({ id: '1', type: 'listen.play' });
    expect(parse({ id: '1', type: 'listen.pause' })).toEqual({ id: '1', type: 'listen.pause' });
    expect(parse({ id: '1', type: 'listen.skip', by: -1 })).toEqual({ id: '1', type: 'listen.skip', by: -1 });
  });

  it('refuses what does not check out', () => {
    expect(parseWatchCommand('not json')).toBeNull();
    expect(parseWatchCommand('7')).toBeNull();
    expect(parse({ type: 'listen.play' })).toBeNull();
    expect(parse({ id: '', type: 'listen.play' })).toBeNull();
    expect(parse({ id: 'x'.repeat(81), type: 'listen.play' })).toBeNull();
    expect(parse({ id: '1', type: 'listen.skip', by: 2 })).toBeNull();
    expect(parse({ id: '1', type: 'listen.skip' })).toBeNull();
    expect(parse({ id: '1', type: 'expense.add' })).toBeNull();
  });

  it('drops extra fields', () => {
    expect(parse({ id: '1', type: 'listen.play', volume: 11 })).toEqual({ id: '1', type: 'listen.play' });
  });

  it('reads the handover commands and checks the resume place', () => {
    expect(parse({ id: '1', type: 'listen.start' })).toEqual({ id: '1', type: 'listen.start' });
    expect(parse({ id: '1', type: 'listen.toWatch' })).toEqual({ id: '1', type: 'listen.toWatch' });
    expect(parse({ id: '1', type: 'listen.resume', lessonId: 'starter-02', segment: 7 })).toEqual({ id: '1', type: 'listen.resume', lessonId: 'starter-02', segment: 7 });
    expect(parse({ id: '1', type: 'listen.resume', lessonId: 'starter-02', segment: -1 })).toBeNull();
    expect(parse({ id: '1', type: 'listen.resume', lessonId: 'starter-02', segment: 1.5 })).toBeNull();
    expect(parse({ id: '1', type: 'listen.resume', segment: 3 })).toBeNull();
  });
});
