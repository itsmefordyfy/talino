import { describe, expect, test } from '@jest/globals';

import { cleanTemplateAiInput, parseTemplateAi, templateAiPrompt, templateAiSource, templateAiUserText, type TemplateAiInput } from './template-ai';

const input: TemplateAiInput = {
  kind: 'cover letter',
  draft: 'Dear [hiring manager],\n\nI’m applying for the [role] role at [company]. I work with React and TypeScript. See {{portfolioLink}}.\n\nSincerely,\n{{name}}',
  details: 'Role: Junior Mobile Developer at Acme Labs in Cebu. They use Expo.',
  tone: 'friendly',
};

describe('cleanTemplateAiInput', () => {
  test('keeps the template and notes, defaults the tone, and trims', () => {
    expect(cleanTemplateAiInput({ kind: ' cover   letter ', draft: input.draft, details: '  notes  ', tone: 'nonsense' })).toEqual({ kind: 'cover letter', draft: input.draft, details: 'notes', tone: 'friendly' });
    expect(cleanTemplateAiInput({ kind: 'x', draft: input.draft, tone: 'short' })?.tone).toBe('short');
  });

  test('refuses a request with no kind or no real template text', () => {
    expect(cleanTemplateAiInput({ draft: input.draft })).toBeNull();
    expect(cleanTemplateAiInput({ kind: 'cover letter', draft: 'hi' })).toBeNull();
    expect(cleanTemplateAiInput({ kind: 'cover letter', draft: 42 })).toBeNull();
  });

  test('cuts overlong notes and templates', () => {
    const cleaned = cleanTemplateAiInput({ kind: 'k', draft: 'a'.repeat(9000), details: 'b'.repeat(9000) });
    expect(cleaned?.draft).toHaveLength(4000);
    expect(cleaned?.details).toHaveLength(4000);
  });
});

describe('what the model is shown', () => {
  test('the user text carries the template and the notes as data', () => {
    const text = templateAiUserText(input);
    expect(text).toContain('Acme Labs');
    expect(text).toContain('{{name}}');
    expect(templateAiUserText({ ...input, details: '' })).toContain('no notes');
  });

  test('the prompt forbids invention, keeps tokens, and follows the tone and the language', () => {
    const prompt = templateAiPrompt('en', 'short');
    expect(prompt).toMatch(/Never invent/);
    expect(prompt).toMatch(/\{\{token\}\}/);
    expect(prompt).toMatch(/at most 90 words/);
    expect(prompt).not.toMatch(/Tagalog/);
    expect(templateAiPrompt('fil', 'professional')).toMatch(/Tagalog/);
    expect(templateAiPrompt('fil', 'professional')).toMatch(/message in "text" stays English/);
  });
});

describe('parseTemplateAi', () => {
  const good = { text: 'Dear [hiring manager],\n\nI’m applying for the Junior Mobile Developer role at Acme Labs. I work with React and TypeScript, and I know you use Expo. See {{portfolioLink}}.\n\nSincerely,\n{{name}}', questions: ['Who is the hiring manager?', ''] };

  test('accepts a draft built from the template and the notes, and drops blank questions', () => {
    expect(parseTemplateAi(JSON.stringify(good), input)).toEqual({ text: good.text, questions: ['Who is the hiring manager?'] });
  });

  test('refuses a draft that invents a figure', () => {
    expect(parseTemplateAi(JSON.stringify({ ...good, text: `${good.text} I grew a user base to 50000 people.` }), input)).toBeNull();
  });

  test('refuses a draft that names a company or tool nobody gave', () => {
    expect(parseTemplateAi(JSON.stringify({ ...good, text: good.text.replace('Acme Labs', 'Globex Corporation') }), input)).toBeNull();
    expect(parseTemplateAi(JSON.stringify({ ...good, text: `${good.text}\nI also built apps with Flutter.` }), input)).toBeNull();
  });

  test('refuses an empty or malformed answer, and keeps at most five questions', () => {
    expect(parseTemplateAi('not json', input)).toBeNull();
    expect(parseTemplateAi(JSON.stringify({ text: '', questions: [] }), input)).toBeNull();
    expect(parseTemplateAi(JSON.stringify({ text: [1], questions: [] }), input)).toBeNull();
    const many = parseTemplateAi(JSON.stringify({ ...good, questions: ['a1', 'b1', 'c1', 'd1', 'e1', 'f1'] }), input);
    expect(many?.questions).toHaveLength(5);
  });

  test('the check reads the template and the notes together', () => {
    expect(templateAiSource(input)).toContain('Acme Labs');
    expect(templateAiSource(input)).toContain('React and TypeScript');
  });
});
