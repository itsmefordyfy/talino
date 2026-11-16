import { describe, expect, test } from '@jest/globals';

import { COURSES } from '../content';
import type { Lesson, LessonBlock } from '../content/types';
import { emphasizeKeyTerms, isKeyTerm, lessonKeyTerms, type KeyTerm } from './key-terms';
import { parseInline } from './plain-text';

const lesson = (body: LessonBlock[], intro?: Lesson['intro']): Pick<Lesson, 'body' | 'intro'> => ({ body, intro });
const plain = (text: string) => parseInline(text).map((part) => part.text).join('');
const bolded = (text: string, terms: readonly KeyTerm[]) =>
  emphasizeKeyTerms(parseInline(text), terms)
    .filter((part) => part.bold && !part.code)
    .map((part) => part.text);

describe('isKeyTerm', () => {
  test('terms are short names, not labels, sentences or emphasis', () => {
    expect(isKeyTerm('pull request')).toBe(true);
    expect(isKeyTerm('API')).toBe(true);
    expect(isKeyTerm('AI')).toBe(true);
    expect(isKeyTerm('context window')).toBe(true);
    expect(isKeyTerm('GPT-4')).toBe(true);
    // Labels that open a paragraph.
    expect(isKeyTerm('In plain words.')).toBe(false);
    expect(isKeyTerm('Constraints:')).toBe(false);
    // Emphasis, not a term.
    expect(isKeyTerm('not')).toBe(false);
    expect(isKeyTerm('do not')).toBe(false);
    expect(isKeyTerm('never commit')).toBe(false);
    expect(isKeyTerm('always')).toBe(false);
    // Too long to be a term, quoted, code, a number, a two-letter word.
    expect(isKeyTerm('the model reads every file you open')).toBe(false);
    expect(isKeyTerm('"fix the bug"')).toBe(false);
    expect(isKeyTerm('`npm test`')).toBe(false);
    expect(isKeyTerm('3 steps')).toBe(false);
    expect(isKeyTerm('go')).toBe(false);
  });
});

describe('lessonKeyTerms', () => {
  test('comes from what the lesson itself bolds in its reading text', () => {
    const terms = lessonKeyTerms(
      lesson([
        { type: 'heading', text: 'The **heading** word' },
        { type: 'paragraph', text: '**In plain words.** A **token** is a piece of a word. **Not** a letter.' },
        { type: 'list', items: ['An **API key** is a password for programs'] },
        { type: 'tip', text: 'Watch the **context window**.' },
        { type: 'details', summary: '**Summary** bit', body: ['A **diff** shows changes.'] },
        { type: 'takeaways', items: ['Keep **secrets** out of Git'] },
        { type: 'code', language: 'js', code: '**not a term**' },
      ]),
    ).map((term) => term.text);
    expect(terms).toEqual(expect.arrayContaining(['token', 'API key', 'context window', 'diff', 'secrets']));
    expect(terms).not.toContain('heading');
    expect(terms).not.toContain('Summary');
    expect(terms).not.toContain('In plain words.');
    expect(terms).not.toContain('Not');
    expect(terms).not.toContain('not a term');
  });

  test('longer terms come first, so "API key" wins over "API"', () => {
    const terms = lessonKeyTerms(lesson([{ type: 'paragraph', text: 'The **API** needs an **API key**.' }]));
    expect(terms.map((term) => term.text)).toEqual(['API key', 'API']);
  });

  test('a lowercase term, or one capitalised only because it starts a sentence, matches any case', () => {
    const terms = lessonKeyTerms(lesson([{ type: 'paragraph', text: '**Tokens** cost money. Then **Git** keeps history.' }]));
    expect(terms).toEqual([
      { text: 'Tokens', caseSensitive: false },
      { text: 'Git', caseSensitive: true },
    ]);
  });

  test('a bold verb opening an instruction is not a term', () => {
    const terms = lessonKeyTerms(lesson([{ type: 'list', items: ['**Run** it and compare.', '**Read** every line.', '**Context** says what the task is.'] }, { type: 'paragraph', text: 'Trust what people **did**.' }]));
    expect(terms).toEqual([{ text: 'Context', caseSensitive: false }]);
  });

  test('the same term bolded twice is listed once', () => {
    const terms = lessonKeyTerms(lesson([{ type: 'paragraph', text: 'A **commit** here, another **Commit** there.' }]));
    expect(terms).toEqual([{ text: 'commit', caseSensitive: false }]);
  });

  test('the intro is read for terms too', () => {
    const terms = lessonKeyTerms(lesson([], { objectives: ['Explain what a **prompt** is'], why: 'A **model** answers.' }));
    expect(terms.map((term) => term.text)).toEqual(['prompt', 'model']);
  });
});

describe('emphasizeKeyTerms', () => {
  const terms: KeyTerm[] = [
    { text: 'API key', caseSensitive: true },
    { text: 'token', caseSensitive: false },
    { text: 'API', caseSensitive: true },
    { text: 'Git', caseSensitive: true },
  ];

  test('bolds the first occurrence of each term in a block, whole words only', () => {
    expect(bolded('A token is small. Tokens add up. Each token costs.', terms)).toEqual(['token']);
    expect(bolded('Tokens add up.', terms)).toEqual(['Tokens']);
    expect(bolded('Store the API key safely; the API reads it.', terms)).toEqual(['API key', 'API']);
    expect(bolded('Many APIs exist.', terms)).toEqual(['APIs']);
  });

  test('never inside another word or a hyphenated compound', () => {
    expect(bolded('The tokenizer splits text.', terms)).toEqual([]);
    expect(bolded('Use token-based auth.', terms)).toEqual([]);
    expect(bolded('GitHub hosts it.', terms)).toEqual([]);
    expect(bolded('Rapid prototyping.', terms)).toEqual([]);
  });

  test('a case-sensitive term ignores other cases', () => {
    expect(bolded('Run git status, then Git log.', terms)).toEqual(['Git']);
    expect(bolded('Run git status.', terms)).toEqual([]);
  });

  test('never inside code, and not again where the block already bolds the term', () => {
    expect(bolded('Run `git token` to see the token.', terms)).toEqual(['token']);
    expect(bolded('A **token** here and a token there.', terms)).toEqual(['token']);
    expect(emphasizeKeyTerms(parseInline('A **token** here and a token there.'), terms)).toEqual(parseInline('A **token** here and a token there.'));
  });

  test('keeps exactly the same characters, so sentences and spoken words line up', () => {
    const text = 'A token, an API key and `code` with **bold** Git.';
    const parts = emphasizeKeyTerms(parseInline(text), terms);
    expect(parts.map((part) => part.text).join('')).toBe(plain(text));
    expect(parts).toEqual([
      { text: 'A ' },
      { text: 'token', bold: true },
      { text: ', an ' },
      { text: 'API key', bold: true },
      { text: ' and ' },
      { text: 'code', code: true },
      { text: ' with ' },
      { text: 'bold', bold: true },
      { text: ' ' },
      { text: 'Git', bold: true },
      { text: '.' },
    ]);
  });

  test('no terms: the parts come back unchanged', () => {
    const parts = parseInline('Nothing to see.');
    expect(emphasizeKeyTerms(parts, [])).toBe(parts);
  });
});

describe('every bundled lesson', () => {
  const readingTexts = (entry: Lesson): string[] => {
    const texts: string[] = [...(entry.intro?.objectives ?? []), ...(entry.intro ? [entry.intro.why] : [])];
    for (const block of entry.body) {
      if (block.type === 'paragraph' || block.type === 'tip' || block.type === 'warning') texts.push(block.text);
      else if (block.type === 'list' || block.type === 'takeaways') texts.push(...block.items);
      else if (block.type === 'details') texts.push(...block.body);
    }
    return texts;
  };

  // Bold is drawn only: the spoken words and their timing hash come from the content (`lessonSegments`), which this never edits;
  // speech-language.test.ts keeps starter-01's hash pinned.
  test('bolding never changes the words on screen, so Listen highlighting lines up as before', () => {
    let checked = 0;
    let added = 0;
    for (const course of COURSES) {
      for (const entry of course.lessons) {
        const terms = lessonKeyTerms(entry);
        for (const text of readingTexts(entry)) {
          const before = parseInline(text);
          const after = emphasizeKeyTerms(before, terms);
          expect(after.map((part) => part.text).join('')).toBe(before.map((part) => part.text).join(''));
          added += after.filter((part) => part.bold).length - before.filter((part) => part.bold).length;
          checked += 1;
        }
      }
    }
    expect(checked).toBeGreaterThan(5000);
    expect(added).toBeGreaterThan(0);
  });
});
