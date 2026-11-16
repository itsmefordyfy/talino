import { describe, expect, test } from '@jest/globals';

import { boardsIn, JOB_BOARDS, JOB_GROUPS } from './content';
import { BOARD_LOGOS } from './logos';

describe('job boards', () => {
  test('ids are unique and every group has boards', () => {
    expect(new Set(JOB_BOARDS.map((board) => board.id)).size).toBe(JOB_BOARDS.length);
    for (const group of JOB_GROUPS) expect(boardsIn(group).length).toBeGreaterThanOrEqual(3);
  });

  test('every address is the site’s own https page, with no tracking and no search', () => {
    for (const board of JOB_BOARDS) {
      const url = new URL(board.url);
      expect(url.protocol).toBe('https:');
      expect(url.search).toBe('');
      expect(url.hash).toBe('');
    }
  });

  test('each board says what it is and gives practical tips, and only claims no numbers', () => {
    for (const board of JOB_BOARDS) {
      expect(board.blurb.length).toBeGreaterThan(20);
      expect(board.strategy.length).toBeGreaterThanOrEqual(3);
      for (const text of [board.blurb, ...board.strategy, board.note ?? '']) expect(text).not.toMatch(/\d+\s?(m|k|million|%)|\$\d/i);
    }
  });

  test('every board has its logo and no logo is left over', () => {
    expect(Object.keys(BOARD_LOGOS).sort()).toEqual(JOB_BOARDS.map((board) => board.id).sort());
  });

  test('all returns every board, a group only its own', () => {
    expect(boardsIn('all')).toHaveLength(JOB_BOARDS.length);
    expect(boardsIn('ph').every((board) => board.group === 'ph')).toBe(true);
  });
});
