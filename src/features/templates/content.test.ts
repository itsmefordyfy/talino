import { describe, expect, test } from '@jest/globals';

import { getTemplate, TEMPLATE_GROUPS, TEMPLATES, templatesInGroup } from './content';
import { fillTemplate, PLACEHOLDERS } from './lib/fill';

describe('templates', () => {
  test('ids are unique and each can be found', () => {
    expect(new Set(TEMPLATES.map((template) => template.id)).size).toBe(TEMPLATES.length);
    for (const template of TEMPLATES) expect(getTemplate(template.id)).toBe(template);
  });

  test('fully filled, a template has no braces left over', () => {
    const values = Object.fromEntries(PLACEHOLDERS.map((key) => [key, `<${key}>`]));
    for (const template of TEMPLATES) expect(fillTemplate(template.body, values).text).not.toMatch(/\{\{|\}\}/);
  });

  test('every template uses the learner’s name or headline', () => {
    for (const template of TEMPLATES) expect(template.body).toMatch(/\{\{(name|headline)\}\}/);
  });

  test('every template sits in a group, and every group has templates', () => {
    for (const template of TEMPLATES) expect(TEMPLATE_GROUPS).toContain(template.group);
    for (const group of TEMPLATE_GROUPS) expect(templatesInGroup(group).length).toBeGreaterThanOrEqual(3);
    expect(TEMPLATE_GROUPS.flatMap((group) => templatesInGroup(group))).toHaveLength(TEMPLATES.length);
  });

  test('each says what to tell Tali, and none puts a price of its own in', () => {
    for (const template of TEMPLATES) {
      expect(template.aiHint.length).toBeGreaterThan(15);
      expect(template.description.length).toBeGreaterThan(20);
      // Prices and rates are blanks for the learner, never money or percentages we chose for them (an ask like "15 minutes" is fine).
      expect(template.body.replace(/\{\{[^}]*\}\}/g, '')).not.toMatch(/₱|\$|%|\bphp\b/i);
    }
  });
});
