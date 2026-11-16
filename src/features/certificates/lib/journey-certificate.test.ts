import { describe, expect, test } from '@jest/globals';

import { journeyCertificateStatus } from './journey-certificate';

const stage = (level: string, complete: boolean, done = complete ? 8 : 3, total = 8) => ({ level, complete, done, total });
const all = (complete: boolean[]) => ['beginner', 'intermediate', 'advanced', 'expert'].map((level, index) => stage(level, complete[index]!));

describe('the AI Expert certificate (the whole journey)', () => {
  test('is earned when the journey is complete and every one of the four levels is', () => {
    const status = journeyCertificateStatus({ complete: true, stages: all([true, true, true, true]) });
    expect(status.earned).toBe(true);
    expect(status.levelsComplete).toBe(4);
    expect(status.levels.map((level) => level.name)).toEqual(['Beginner', 'Intermediate', 'Advanced', 'Expert']);
  });

  test('a learner who started higher and skipped a level has not earned it, even at the journey’s end', () => {
    const status = journeyCertificateStatus({ complete: true, stages: all([false, true, true, true]) });
    expect(status.earned).toBe(false);
    expect(status.levelsComplete).toBe(3);
  });

  test('levels done but the journey not finished: not yet', () => {
    expect(journeyCertificateStatus({ complete: false, stages: all([true, true, true, true]) }).earned).toBe(false);
  });

  test('progress per level is reported in order, a missing level counts as not done', () => {
    const status = journeyCertificateStatus({ complete: false, stages: [stage('beginner', true), stage('advanced', false, 2, 9)] });
    expect(status.levels.map((level) => [level.level, level.complete, level.done, level.total])).toEqual([
      ['beginner', true, 8, 8],
      ['intermediate', false, 0, 0],
      ['advanced', false, 2, 9],
      ['expert', false, 0, 0],
    ]);
    expect(status.earned).toBe(false);
  });
});
