import { describe, expect, test } from '@jest/globals';

import { createSerialQueue } from './serial-queue';

const tick = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('createSerialQueue', () => {
  test('never overlaps jobs and keeps their order, however long each takes', async () => {
    const enqueue = createSerialQueue();
    const log: string[] = [];
    const job = (name: string, ms: number) => async () => {
      log.push(`start ${name}`);
      await tick(ms);
      log.push(`end ${name}`);
      return name;
    };
    const results = await Promise.all([enqueue(job('a', 20)), enqueue(job('b', 1)), enqueue(job('c', 5))]);
    expect(results).toEqual(['a', 'b', 'c']);
    expect(log).toEqual(['start a', 'end a', 'start b', 'end b', 'start c', 'end c']);
  });

  test('a failing job rejects its own caller and does not stop the ones behind it', async () => {
    const enqueue = createSerialQueue();
    const failing = enqueue(async () => {
      throw new Error('boom');
    });
    const after = enqueue(async () => 'still runs');
    await expect(failing).rejects.toThrow('boom');
    await expect(after).resolves.toBe('still runs');
  });
});
