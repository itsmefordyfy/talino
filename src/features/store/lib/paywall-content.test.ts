import { describe, expect, test } from '@jest/globals';

import { AI_CHAT_FREE_DAILY_LIMIT } from '@/constants/ai-chat';

import { COMPARISON_ROWS, PAYWALL_FEATURES, leadFeature, orderedFeatures } from './paywall-content';
import { PAYWALL_REASONS } from './paywall-reasons';

describe('leadFeature', () => {
  test('every reason leads with a listed feature, except the general one', () => {
    for (const reason of PAYWALL_REASONS) {
      const lead = leadFeature(reason);
      if (reason === 'default') expect(lead).toBeNull();
      else expect(PAYWALL_FEATURES).toContain(lead);
    }
  });

  test('each reason leads with its own thing', () => {
    expect(leadFeature('courses')).toBe('courses');
    expect(leadFeature('tali')).toBe('coach');
    expect(leadFeature('resume')).toBe('resume');
    expect(leadFeature('kit')).toBe('kit');
    expect(leadFeature('backup')).toBe('backup');
  });
});

describe('orderedFeatures', () => {
  test('keeps the usual order with no lead', () => {
    expect(orderedFeatures(null)).toEqual([...PAYWALL_FEATURES]);
  });

  test('puts the lead first and lists every feature once', () => {
    const order = orderedFeatures('backup');
    expect(order[0]).toBe('backup');
    expect([...order].sort()).toEqual([...PAYWALL_FEATURES].sort());
  });
});

describe('the comparison table', () => {
  test('lists only differences: no row where both plans have the same thing', () => {
    for (const row of COMPARISON_ROWS) expect(JSON.stringify(row.free)).not.toBe(JSON.stringify(row.pro));
  });

  test('has a unique key per row', () => {
    const keys = COMPARISON_ROWS.map((row) => row.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  test('says what Free gets from the coach with the real allowance, and Pro is unlimited', () => {
    const coach = COMPARISON_ROWS.find((row) => row.key === 'coach');
    expect(coach?.free).toEqual({ perDay: AI_CHAT_FREE_DAILY_LIMIT });
    expect(coach?.pro).toBe('unlimited');
  });

  test('the backup file, the career kit and résumé tailoring are Pro only', () => {
    for (const key of ['backupFile', 'kit', 'tailor'] as const) {
      const row = COMPARISON_ROWS.find((candidate) => candidate.key === key);
      expect(row?.free).toBe(false);
      expect(row?.pro).toBe(true);
    }
  });
});
