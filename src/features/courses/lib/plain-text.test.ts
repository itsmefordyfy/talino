import { describe, expect, test } from '@jest/globals';

import { lessonOutline, lessonScript, lessonSpeech, parseInline, sectionAt, stripInline } from './plain-text';

describe('parseInline', () => {
  test('bold and code', () => {
    expect(parseInline('Use **git** and `npm test` daily')).toEqual([{ text: 'Use ' }, { text: 'git', bold: true }, { text: ' and ' }, { text: 'npm test', code: true }, { text: ' daily' }]);
  });
  test('an unclosed marker stays plain', () => {
    expect(parseInline('2 ** 3 and a `tick')).toEqual([{ text: '2 ** 3 and a `tick' }]);
  });

  // The lessons write emphasis as *word* (199 times in 100 lessons); it used to show its stars on screen and be read out with them.
  test('*emphasis* is its own part, without the stars', () => {
    expect(parseInline('It is *plausible* but often wrong.')).toEqual([{ text: 'It is ' }, { text: 'plausible', italic: true }, { text: ' but often wrong.' }]);
    expect(parseInline('*tokens* (a few letters)')).toEqual([{ text: 'tokens', italic: true }, { text: ' (a few letters)' }]);
    expect(parseInline('code that *looks like* the code it learned from')).toEqual([{ text: 'code that ' }, { text: 'looks like', italic: true }, { text: ' the code it learned from' }]);
  });
  test('emphasis next to punctuation, inside bold, and next to code', () => {
    expect(parseInline('Say "*yes*", then (*no*).').map((part) => part.text).join('')).toBe('Say "yes", then (no).');
    expect(parseInline('**very *important* rule**')).toEqual([{ text: 'very ', bold: true }, { text: 'important', bold: true, italic: true }, { text: ' rule', bold: true }]);
    expect(parseInline('`*args` and *kwargs*')).toEqual([{ text: '*args', code: true }, { text: ' and ' }, { text: 'kwargs', italic: true }]);
  });
  test('stars that are not emphasis stay as they are: maths, wildcards, double stars, stars inside code', () => {
    for (const text of ['2 * 3 * 4', 'x*y*z', 'a * b', 'use *.txt files', '**kwargs', '5*3 and 6*7', 'a lone * star']) {
      expect(parseInline(text).map((part) => part.text).join('')).toBe(text);
      expect(parseInline(text).some((part) => part.italic)).toBe(false);
    }
    expect(parseInline('`a * b * c`')).toEqual([{ text: 'a * b * c', code: true }]);
  });
});

describe('lessonSpeech', () => {
  test('reads text, announces code and prompts', () => {
    const speech = lessonSpeech('Intro', [
      { type: 'paragraph', text: 'Hello **you**' },
      { type: 'code', language: 'Python', code: 'print(1)' },
      { type: 'prompt', text: 'Explain' },
    ]);
    expect(speech).toContain('Hello you');
    expect(speech).toContain('Python example');
    expect(speech).not.toContain('print(1)');
    expect(stripInline('`a`')).toBe('a');
  });
  test('the spoken text never has a star in it for emphasis', () => {
    expect(stripInline('It reads *tokens*, not **words**.')).toBe('It reads tokens, not words.');
    const speech = lessonSpeech('Intro', [{ type: 'paragraph', text: 'The model writes code that *looks like* the code it learned from.' }]);
    expect(speech).toContain('looks like the code');
    expect(speech).not.toContain('*');
  });
});

describe('lessonScript', () => {
  const lesson = {
    title: 'Reading code',
    summary: 'Learn to read unfamiliar code.',
    intro: { objectives: ['Explain what a function does', 'Spot the inputs'], why: 'You read more code than you write.' },
    body: [
      { type: 'paragraph' as const, text: 'Start at the **entry point**.' },
      { type: 'takeaways' as const, items: ['Read before you run'] },
      { type: 'activity' as const, activity: { id: 'x', kind: 'scenario' } as never },
    ],
  };
  test('reads the title, the intro, the teaching and the takeaways in that order, and skips activities', () => {
    const script = lessonScript(lesson);
    const at = (text: string) => script.indexOf(text);
    expect(at('Reading code')).toBe(0);
    expect(at('By the end of this lesson')).toBeGreaterThan(0);
    expect(at('Explain what a function does')).toBeGreaterThan(at('By the end'));
    expect(at('Why it matters. You read more')).toBeGreaterThan(at('Spot the inputs'));
    expect(at('Start at the entry point.')).toBeGreaterThan(at('Why it matters'));
    expect(at('Key takeaways.')).toBeGreaterThan(at('Start at the entry point.'));
    expect(script).not.toContain('scenario');
  });
  test('a lesson without an intro still reads', () => {
    expect(lessonScript({ ...lesson, intro: undefined })).not.toContain('By the end');
  });
});

describe('lessonOutline', () => {
  const lesson = {
    title: 'Reading code',
    summary: 'Learn to read unfamiliar code.',
    intro: undefined,
    body: [
      { type: 'paragraph' as const, text: 'First idea '.repeat(20) },
      { type: 'heading' as const, text: 'The entry point' },
      { type: 'paragraph' as const, text: 'Second idea '.repeat(20) },
      { type: 'heading' as const, text: 'Following calls' },
      { type: 'paragraph' as const, text: 'Third idea '.repeat(20) },
    ],
  };
  test('starts with the lesson and lists each heading with where it begins', () => {
    const outline = lessonOutline(lesson);
    expect(outline.map((section) => section.title)).toEqual(['Reading code', 'The entry point', 'Following calls']);
    expect(outline[0].at).toBe(0);
    expect(outline[1].at).toBeGreaterThan(0);
    expect(outline[2].at).toBeGreaterThan(outline[1].at);
    expect(outline[2].at).toBeLessThan(1);
  });
  test('a lesson with no headings has just itself', () => {
    expect(lessonOutline({ ...lesson, body: [{ type: 'paragraph', text: 'x' }] })).toEqual([{ title: 'Reading code', at: 0 }]);
  });
  test('sectionAt finds the section playing', () => {
    const outline = lessonOutline(lesson);
    expect(sectionAt(outline, 0)?.title).toBe('Reading code');
    expect(sectionAt(outline, outline[1].at)?.title).toBe('The entry point');
    expect(sectionAt(outline, 0.99)?.title).toBe('Following calls');
    expect(sectionAt([], 0.5)).toBeNull();
  });
  test('the script and the outline are built from the same words', () => {
    expect(lessonScript(lesson)).toContain('The entry point');
  });
});

describe('level blocks and the recordings', () => {
  const base = {
    title: 'Reading code',
    summary: 'Learn to read unfamiliar code.',
    intro: { objectives: ['Explain what a function does', 'Spot the inputs'], why: 'You read more code than you write.' },
    body: [
      { type: 'paragraph' as const, text: 'Start at the **entry point**.' },
      { type: 'heading' as const, text: 'Why it matters' },
      { type: 'paragraph' as const, text: 'You read more than you write.' },
      { type: 'takeaways' as const, items: ['Read before you run'] },
    ],
  };
  const tagged = {
    ...base,
    body: [
      base.body[0],
      { type: 'paragraph' as const, text: 'A newcomer walk-through in plain words.', audience: { max: 'beginner' as const } },
      base.body[1],
      { type: 'heading' as const, text: 'In a real codebase', audience: { min: 'advanced' as const } },
      { type: 'paragraph' as const, text: 'Depth for engineers.', audience: { min: 'advanced' as const } },
      base.body[2],
      base.body[3],
    ],
  };

  test('audience-tagged blocks are never read: the script (and the recordings made from it) is the shared lesson', () => {
    expect(lessonScript(tagged)).toBe(lessonScript(base));
    expect(lessonScript(tagged)).not.toContain('newcomer');
    expect(lessonScript(tagged)).not.toContain('Depth for engineers');
  });

  test('the player outline ignores level headings too', () => {
    expect(lessonOutline(tagged)).toEqual(lessonOutline(base));
    expect(lessonOutline(tagged).map((section) => section.title)).not.toContain('In a real codebase');
  });
});
