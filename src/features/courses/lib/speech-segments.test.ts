import { describe, expect, test } from '@jest/globals';

import { COURSES } from '../content';
import { FIL_COURSES } from '../content/fil';
import type { Lesson } from '../content/types';
import { hashSegments, lessonSegments, outlineFromTiming, sectionTitleOf, segmentIndexOf, sentenceRanges, sliceParts } from './speech-segments';
import { lessonScript, parseInline, stripInline } from './plain-text';

const sentences = (text: string) => sentenceRanges(text).map((range) => text.slice(range.start, range.end));
const squash = (text: string) => text.replace(/\s+/g, ' ').trim();

describe('sentenceRanges', () => {
  test('splits on . ! ? followed by a space, keeping each sentence whole', () => {
    expect(sentences('Prompts are instructions you give an AI model. Clear ones get better answers! Why does that happen? Because the model needs context.')).toEqual([
      'Prompts are instructions you give an AI model.',
      'Clear ones get better answers!',
      'Why does that happen?',
      'Because the model needs context.',
    ]);
  });

  test('does not split inside abbreviations, decimals, versions, file names or initials', () => {
    expect(sentences('Tools such as Cursor, e.g. an editor with AI built in, are popular. Version 2.5 costs about 3.50 dollars. Ask Dr. Cruz about vs. the old plan.')).toEqual([
      'Tools such as Cursor, e.g. an editor with AI built in, are popular.',
      'Version 2.5 costs about 3.50 dollars.',
      'Ask Dr. Cruz about vs. the old plan.',
    ]);
    expect(sentences('Open index.html in your browser. Then refresh the page.')).toEqual(['Open index.html in your browser.', 'Then refresh the page.']);
  });

  test('keeps a closing quote or bracket with the sentence it ends', () => {
    expect(sentences('He said "this works." Then everyone moved on (finally!) to the next step.')).toEqual(['He said "this works."', 'Then everyone moved on (finally!) to the next step.']);
  });

  test('a colon does not end a sentence', () => {
    expect(sentences('Here is the rule: always read the output before you ship it.')).toEqual(['Here is the rule: always read the output before you ship it.']);
  });

  test('a very short sentence joins the one after it, so the highlight does not flicker', () => {
    expect(sentences('Yes. That is exactly what the model is doing when it writes your code for you.')).toEqual(['Yes. That is exactly what the model is doing when it writes your code for you.']);
    // ...and at the end of a text it joins the one before.
    expect(sentences('The model writes the code for you and explains it. Try it.')).toEqual(['The model writes the code for you and explains it. Try it.']);
  });

  test('works on Taglish and on text without any punctuation', () => {
    expect(sentences('Mag-prompt ka sa AI na parang nagbibigay ka ng malinaw na task sa teammate mo. Kapag malabo ang instruction, malabo rin ang resulta!')).toHaveLength(2);
    expect(sentences('no punctuation here at all')).toEqual(['no punctuation here at all']);
    expect(sentences('')).toEqual([]);
    expect(sentences('   ')).toEqual([]);
  });

  test('ranges are in order, never overlap and only drop whitespace', () => {
    const text = 'First sentence is long enough to stand alone. Second one is also long enough here.   Third sentence, with spaces before it, is fine too.';
    const ranges = sentenceRanges(text);
    for (let i = 1; i < ranges.length; i++) expect(ranges[i].start).toBeGreaterThanOrEqual(ranges[i - 1].end);
    expect(ranges.map((range) => text.slice(range.start, range.end)).join(' ')).toBe(squash(text));
  });
});

describe('sliceParts', () => {
  test('cuts inline parts at character offsets and keeps their bold and code marks', () => {
    const parts = parseInline('Use **bold words** and `code` here.');
    // plain text: "Use bold words and code here."
    expect(sliceParts(parts, 4, 14)).toEqual([{ text: 'bold words', bold: true }]);
    expect(sliceParts(parts, 0, 8)).toEqual([{ text: 'Use ' }, { text: 'bold', bold: true }]);
    expect(sliceParts(parts, 19, 23)).toEqual([{ text: 'code', code: true }]);
    expect(sliceParts(parts, 0, 29).map((part) => part.text).join('')).toBe('Use bold words and code here.');
  });
});

const lesson = (partial: Partial<Lesson> & Pick<Lesson, 'body'>): Lesson =>
  ({
    id: 'x-01',
    day: 1,
    title: 'Writing better prompts',
    summary: 'Learn how to ask an AI model for what you really want. It saves a lot of time.',
    minutes: 15,
    skills: [],
    intro: { objectives: ['Write a clear prompt for a real task', 'Fix a vague prompt'], why: 'Good prompts save you hours every week. They also make the answers easier to trust.' },
    quiz: [],
    task: { title: 't', steps: [], minutes: 5 },
    ...partial,
  }) as Lesson;

describe('lessonSegments', () => {
  const sample = lesson({
    body: [
      { type: 'paragraph', text: 'A prompt is the message you send to an AI model. It can be a question or an instruction.' },
      { type: 'heading', text: 'Be specific' },
      { type: 'list', items: ['Say who the answer is for and what you need.', 'Give one example of what good looks like.'] },
      { type: 'tip', text: 'Paste the error message exactly as you see it on your screen.' },
      { type: 'code', language: 'js', code: 'console.log(1)' },
      { type: 'takeaways', items: ['Be specific about the result you want.', 'Give the model the context it needs.'] },
      { type: 'paragraph', text: 'This paragraph is written for experts only and is never read aloud.', audience: { min: 'professional' } },
    ],
  });
  const segments = lessonSegments(sample);

  test('starts with the title, the summary and the intro, then the teaching in order', () => {
    expect(segments.map((segment) => segment.unit)).toEqual([
      'title',
      'summary',
      'summary',
      'objectives-label',
      'obj0',
      'obj1',
      'why-label',
      'why',
      'why',
      'b0',
      'b0',
      'b1',
      'b2-i0',
      'b2-i1',
      'b3',
      'b3',
      'b4',
      'b5',
      'b5-i0',
      'b5-i1',
    ]);
  });

  test('numbers every segment, and the sentences within a unit', () => {
    expect(segments.every((segment, i) => segment.index === i)).toBe(true);
    expect(segments.filter((segment) => segment.unit === 'b0').map((segment) => segment.sentence)).toEqual([0, 1]);
    // A tip's label is a whole-block segment, then its sentences.
    expect(segments.filter((segment) => segment.unit === 'b3').map((segment) => [segment.sentence, segment.text])).toEqual([
      [null, 'Tip.'],
      [0, 'Paste the error message exactly as you see it on your screen.'],
    ]);
  });

  test('on-screen things (code) are announced as one whole-block segment, and headings are marked as headings', () => {
    expect(segments.find((segment) => segment.unit === 'b4')).toMatchObject({ sentence: null, text: 'There is a js example on screen.' });
    expect(segments.find((segment) => segment.unit === 'b1')).toMatchObject({ sentence: null, heading: true, text: 'Be specific' });
  });

  test('a block written for one level is not read, and does not shift the others', () => {
    expect(segments.some((segment) => segment.text.includes('experts only'))).toBe(false);
  });

  test('a paragraph ends with a longer pause than a sentence inside it', () => {
    const b0 = segments.filter((segment) => segment.unit === 'b0');
    expect(b0.map((segment) => segment.pause)).toEqual(['sentence', 'paragraph']);
  });

  test('says the same words as the script the phone voice reads (nothing added, dropped or reordered)', () => {
    expect(squash(segments.map((segment) => segment.text).join(' '))).toBe(squash(lessonScript(sample)));
  });

  test('the hash changes with the words, not with where a sentence is cut', () => {
    const changed = lessonSegments(lesson({ body: [{ type: 'paragraph', text: 'A different paragraph that says something else entirely.' }] }));
    expect(hashSegments(segments)).toMatch(/^[0-9a-f]{8}$/);
    expect(hashSegments(segments)).toBe(hashSegments(lessonSegments(sample)));
    expect(hashSegments(changed)).not.toBe(hashSegments(segments));
  });

  test('a lesson without an intro still has segments', () => {
    const plain = lessonSegments(lesson({ intro: undefined, body: [{ type: 'paragraph', text: 'Only a paragraph, and it is long enough to stand on its own here.' }] }));
    expect(plain.map((segment) => segment.unit)).toEqual(['title', 'summary', 'summary', 'b0']);
  });
});

describe('segmentIndexOf', () => {
  const segments = lessonSegments(
    lesson({
      body: [
        { type: 'paragraph', text: 'A prompt is the message you send to an AI model. It can be a question or an instruction.' },
        { type: 'tip', text: 'Paste the error message exactly as you see it on your screen.' },
      ],
    }),
  );
  const index = segmentIndexOf(segments);

  test('finds a sentence, a whole unit and the range of a unit', () => {
    const second = segments.findIndex((segment) => segment.unit === 'b0' && segment.sentence === 1);
    expect(index.ofSentence('b0', 1)).toBe(second);
    expect(index.ofSentence('b0', 9)).toBeNull();
    expect(index.ofSentence('missing', 0)).toBeNull();
    expect(index.first('b1')).toBe(segments.findIndex((segment) => segment.unit === 'b1'));
    expect(index.range('b0')).toEqual([second - 1, second]);
    expect(index.range('b1')?.[1]).toBe(segments.length - 1);
    expect(index.range('missing')).toBeNull();
  });

  test('knows a unit is spoken whole when a segment has no sentence number', () => {
    expect(index.whole('b1')).toBe(segments.findIndex((segment) => segment.unit === 'b1' && segment.sentence === null));
    expect(index.whole('b0')).toBeNull();
  });
});

describe('outlineFromTiming', () => {
  test('puts each section mark where its heading is really spoken', () => {
    const segments = lessonSegments(
      lesson({
        body: [
          { type: 'paragraph', text: 'An opening paragraph with enough words to stand alone as a sentence.' },
          { type: 'heading', text: 'Be specific' },
          { type: 'paragraph', text: 'A second paragraph with enough words to stand alone as a sentence.' },
        ],
      }),
    );
    const starts = segments.map((_, i) => i * 10);
    const outline = outlineFromTiming('Writing better prompts', segments, { duration: segments.length * 10, segments: starts.map((start) => [start, start + 8] as [number, number]) });
    const heading = segments.findIndex((segment) => segment.heading);
    expect(outline).toEqual([
      { title: 'Writing better prompts', at: 0 },
      { title: 'Be specific', at: (heading * 10) / (segments.length * 10) },
    ]);
  });
});

describe('sectionTitleOf', () => {
  const segments = lessonSegments(
    lesson({
      body: [
        { type: 'paragraph', text: 'An opening paragraph with enough words to stand alone as a sentence.' },
        { type: 'heading', text: 'Be specific' },
        { type: 'paragraph', text: 'A second paragraph with enough words to stand alone as a sentence.' },
      ],
    }),
  );
  const heading = segments.findIndex((segment) => segment.heading);

  test('is the lesson until the first heading, then that heading', () => {
    expect(sectionTitleOf(segments, 0, 'Writing better prompts')).toBe('Writing better prompts');
    expect(sectionTitleOf(segments, heading - 1, 'Writing better prompts')).toBe('Writing better prompts');
    expect(sectionTitleOf(segments, heading, 'Writing better prompts')).toBe('Be specific');
    expect(sectionTitleOf(segments, segments.length - 1, 'Writing better prompts')).toBe('Be specific');
    expect(sectionTitleOf(segments, null, 'Writing better prompts')).toBe('Writing better prompts');
  });
});

// Every real lesson, English and Tagalog: the segments must say what the script says, and the display text must cut at the same places.
describe('every lesson in the app', () => {
  const lessons = [...COURSES, ...Object.values(FIL_COURSES)].flatMap((course) => course.lessons);
  const filIds = new Set<Lesson>(Object.values(FIL_COURSES).flatMap((course) => course.lessons));
  const languageOf = (lesson: Lesson) => (filIds.has(lesson) ? 'fil' : 'en');

  test('there are lessons to check', () => {
    expect(lessons.length).toBeGreaterThan(500);
  });

  test('segments say exactly what the script says, and have no empty or oversized piece', () => {
    const problems: string[] = [];
    for (const entry of lessons) {
      const segments = lessonSegments(entry, languageOf(entry));
      if (squash(segments.map((segment) => segment.text).join(' ')) !== squash(lessonScript(entry, languageOf(entry)))) problems.push(`${entry.id}: text differs from the script`);
      for (const segment of segments) {
        if (!segment.text.trim()) problems.push(`${entry.id}: empty segment ${segment.index}`);
        if (segment.text.length > 900) problems.push(`${entry.id}: segment ${segment.index} is ${segment.text.length} characters`);
      }
    }
    expect(problems).toEqual([]);
  });

  test('the plain text the voice reads is the same text the screen draws (so a sentence on screen is a segment in the audio)', () => {
    const problems: string[] = [];
    const check = (id: string, text: string) => {
      if (stripInline(text) !== parseInline(text).map((part) => part.text).join('')) problems.push(`${id}: ${text.slice(0, 60)}`);
    };
    for (const entry of lessons) {
      check(entry.id, entry.summary);
      for (const objective of entry.intro?.objectives ?? []) check(entry.id, objective);
      if (entry.intro) check(entry.id, entry.intro.why);
      for (const block of entry.body) {
        if (block.type === 'paragraph' || block.type === 'tip' || block.type === 'warning' || block.type === 'heading') check(entry.id, block.text);
        if (block.type === 'list' || block.type === 'takeaways') for (const item of block.items) check(entry.id, item);
        if (block.type === 'details') for (const text of [block.summary, ...block.body]) check(entry.id, text);
      }
    }
    expect(problems).toEqual([]);
  });

  test('every unit id is unique to one place in the lesson', () => {
    for (const entry of lessons.slice(0, 80)) {
      const index = segmentIndexOf(lessonSegments(entry));
      expect(index.range('title')).not.toBeNull();
    }
  });
});
