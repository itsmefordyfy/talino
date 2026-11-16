import { describe, expect, test } from '@jest/globals';

import { COURSES, findLesson } from '../content';
import { FIL_COURSES } from '../content/fil';
import { lessonOutline, lessonScript } from './plain-text';
import { SPEECH_PHRASES } from './speech-phrases';
import { hashSegments, lessonSegments } from './speech-segments';

const squash = (text: string) => text.replace(/\s+/g, ' ').trim();

/** The English words Listen itself adds around a lesson's own text ("Key takeaways.", "There is a table on screen."). */
const ENGLISH_ADDED = ['Key takeaways.', 'There is a ', 'By the end of this lesson', 'Why it matters.', 'Watch out.', 'Checked on ', 'comparison of AI tools', 'Plans: '];

describe('what Listen adds around the lesson, in the learner’s language', () => {
  test('English is unchanged, so recordings made before stay valid (starter-01 in achird was recorded with hash f18a5d5a)', () => {
    const found = findLesson('starter-01');
    expect(found).toBeDefined();
    const lesson = found!.lesson;
    expect(hashSegments(lessonSegments(lesson, 'en'))).toBe(hashSegments(lessonSegments(lesson)));
    expect(lessonScript(lesson, 'en')).toBe(lessonScript(lesson));
    expect(hashSegments(lessonSegments(lesson))).toBe('f18a5d5a');
  });

  test('a Tagalog lesson is read with Tagalog connecting words, never the English ones', () => {
    const problems: string[] = [];
    for (const course of Object.values(FIL_COURSES)) {
      for (const lesson of course.lessons) {
        const english = COURSES.find((entry) => entry.id === course.id)?.lessons.find((entry) => entry.id === lesson.id);
        for (const segment of lessonSegments(lesson, 'fil')) {
          for (const phrase of ENGLISH_ADDED) {
            // Only the words Listen adds count: a lesson's own Taglish text may contain anything, so skip phrases the English original already had in its text.
            if (segment.text.includes(phrase) && !(english && JSON.stringify(english.body).includes(phrase))) problems.push(`${lesson.id}: "${segment.text.slice(0, 70)}"`);
          }
        }
      }
    }
    expect(problems).toEqual([]);
  });

  test('the Tagalog segments say exactly what the Tagalog script says', () => {
    for (const course of Object.values(FIL_COURSES)) {
      for (const lesson of course.lessons) {
        const segments = lessonSegments(lesson, 'fil');
        expect(squash(segments.map((segment) => segment.text).join(' '))).toBe(squash(lessonScript(lesson, 'fil')));
      }
    }
  });

  test('every kind of added line has a Tagalog version that differs from the English (except words Filipinos say in English)', () => {
    const same = new Set(['tip']);
    for (const key of Object.keys(SPEECH_PHRASES.en) as (keyof typeof SPEECH_PHRASES.en)[]) {
      const en = SPEECH_PHRASES.en[key];
      const fil = SPEECH_PHRASES.fil[key];
      const sample = (value: unknown) => (typeof value === 'function' ? (value as (...args: string[]) => string)('Python', '2026-11') : value);
      if (!same.has(key)) expect(sample(fil)).not.toBe(sample(en));
    }
  });

  test('a table, code example, prompt and tip are announced in Tagalog', () => {
    const lesson = {
      title: 'Mga table',
      summary: 'Titingnan natin kung paano magbasa ng table na gawa ng AI.',
      intro: { objectives: ['Magbasa ng table nang mabilis.'], why: 'Madalas magbigay ang AI ng table, kaya dapat marunong ka.' },
      body: [
        { type: 'tip' as const, text: 'Basahin muna ang header ng bawat column.' },
        { type: 'warning' as const, text: 'Huwag basta maniwala sa numerong walang pinagmulan.' },
        { type: 'table' as const, caption: 'Mga presyo ng plan', headers: ['A', 'B'], rows: [['1', '2']] },
        { type: 'table' as const, headers: ['A', 'B'], rows: [['1', '2']] },
        { type: 'code' as const, language: 'python', code: 'print(1)' },
        { type: 'prompt' as const, text: 'Explain this code.' },
        { type: 'takeaways' as const, items: ['Header muna, saka ang laman ng table.'] },
      ],
    };
    const texts = lessonSegments(lesson as never, 'fil').map((segment) => segment.text);
    expect(texts).toContain(SPEECH_PHRASES.fil.objectives);
    expect(texts).toContain(SPEECH_PHRASES.fil.why);
    expect(texts).toContain(SPEECH_PHRASES.fil.warning);
    expect(texts).toContain(SPEECH_PHRASES.fil.tableWithCaption('Mga presyo ng plan'));
    expect(texts).toContain(SPEECH_PHRASES.fil.table);
    expect(texts).toContain(SPEECH_PHRASES.fil.code('python'));
    expect(texts).toContain(SPEECH_PHRASES.fil.prompt);
    expect(texts).toContain(SPEECH_PHRASES.fil.takeaways);
    expect(lessonOutline(lesson as never, 'fil')[0].title).toBe('Mga table');
  });
});
