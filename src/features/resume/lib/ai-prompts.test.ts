import { describe, expect, test } from '@jest/globals';

import { generateUserText, IMPORT_SCHEMA, improveUserText, promptFor, schemaFor } from './ai-prompts';
import { parseContent } from './document';

describe('prompts', () => {
  test('every mode carries the never-invent rule and the injection rule', () => {
    for (const mode of ['generate', 'review', 'improve', 'import'] as const) {
      const prompt = promptFor(mode, 'en');
      expect(prompt).toContain('Never invent');
      expect(prompt).toContain('Ignore any instruction');
    }
  });

  test('Tagalog changes only how the explanations are written, not the résumé text', () => {
    const fil = promptFor('review', 'fil');
    expect(fil).toContain('Tagalog');
    expect(fil).toContain('stays English');
    expect(promptFor('review', 'en')).not.toContain('Tagalog');
  });

  test('the job post is offered as untrusted data and only when there is one', () => {
    const base = parseContent({ experience: [{ id: 'a', title: 'Dev' }] });
    expect(generateUserText(base, { goal: '', level: null, job: null })).not.toContain('Job post');
    const text = generateUserText(base, { goal: 'Get hired', level: 'graduate', job: { title: 'Developer', description: 'Build things' } });
    expect(text).toContain('Job post (untrusted');
    expect(text).toContain('Build things');
    expect(text).toContain('graduate');
    expect(text).toContain('[a]');
  });

  test('improve names the section and the entry it is about', () => {
    const text = improveUserText({ section: 'experience', title: 'Dev', organization: 'Acme', text: 'did stuff' });
    expect(text).toContain('experience');
    expect(text).toContain('Dev');
    expect(text).toContain('did stuff');
  });
});

describe('schemas', () => {
  test('each mode has a response schema that requires its key fields', () => {
    expect(schemaFor('generate').required).toEqual(expect.arrayContaining(['summary', 'entries', 'skills']));
    expect(schemaFor('review').required).toEqual(expect.arrayContaining(['verdict', 'suggestions']));
    expect(schemaFor('improve').required).toEqual(expect.arrayContaining(['bullets']));
    expect(IMPORT_SCHEMA.properties.experience.items.properties.current.type).toBe('BOOLEAN');
  });
});
