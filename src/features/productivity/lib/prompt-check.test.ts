import { describe, expect, test } from '@jest/globals';

import { PROMPT_TEMPLATES } from '../data/prompt-templates';
import { checkPrompt, findPlaceholders, privacyRisks } from './prompt-check';

const STRONG = `Act as a practical planning coach. Help me plan tomorrow.
Context: I work as a virtual assistant from 9:00 to 17:00. Fixed: a client call at 14:00 for 30 minutes and lunch at 12:00.
Tasks with estimates: invoices 30 min, report 90 min, inbox 45 min.
Limits: no more than 4 hours of focused work, and a break at least every 90 minutes.
Give me a time-blocked schedule as a table. Ask me questions first if anything is missing, and list your assumptions.`;

describe('checkPrompt', () => {
  test('a prompt with every part present scores full marks and has no suggestions', () => {
    const result = checkPrompt(STRONG);
    expect(result.score).toBe(100);
    expect(result.parts.every((part) => part.present)).toBe(true);
    expect(result.suggestions).toEqual([]);
  });

  test('a one-line request misses most parts and says what to add', () => {
    const result = checkPrompt('plan my day');
    expect(result.score).toBeLessThan(50);
    const missing = result.parts.filter((part) => !part.present).map((part) => part.id);
    expect(missing).toEqual(expect.arrayContaining(['role', 'context', 'limits', 'format', 'askBack']));
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  test('unfilled brackets count as missing inputs and are listed', () => {
    const result = checkPrompt(`${STRONG}\nMy goal: [your goal here]`);
    expect(result.placeholders).toEqual(['your goal here']);
    expect(result.parts.find((part) => part.id === 'inputs')?.present).toBe(false);
  });

  test('an empty prompt scores zero and does not crash', () => {
    const result = checkPrompt('   ');
    expect(result.score).toBe(0);
    expect(result.words).toBe(0);
  });

  test('every shipped template is a usable starting point: well structured, with brackets still to fill', () => {
    for (const template of PROMPT_TEMPLATES) {
      const result = checkPrompt(template.text);
      const missing = result.parts.filter((part) => !part.present).map((part) => part.id);
      expect({ id: template.id, missing }).toEqual({ id: template.id, missing: ['inputs'] });
      expect(result.placeholders.length).toBeGreaterThanOrEqual(2);
      expect(template.explain.length).toBeGreaterThanOrEqual(3);
      expect(template.improve.length).toBeGreaterThanOrEqual(2);
      expect(template.verify.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('findPlaceholders', () => {
  test('lists bracketed gaps once each, in order', () => {
    expect(findPlaceholders('Plan [your week] and [your week] and [a deadline].')).toEqual(['your week', 'a deadline']);
    expect(findPlaceholders('no brackets, [] empty ones are ignored')).toEqual([]);
  });
});

describe('privacyRisks', () => {
  test('warns about things that should not be pasted into a tool', () => {
    expect(privacyRisks('call me on 0917 123 4567')).toContain('phone');
    expect(privacyRisks('email maria@example.com')).toContain('email');
    expect(privacyRisks('my password is hunter2')).toContain('secret');
    expect(privacyRisks('sk-abcdefghijklmnopqrstuvwxyz123456')).toContain('secret');
    expect(privacyRisks('Plan my week around two meetings')).toEqual([]);
  });
});
