import { describe, expect, test } from '@jest/globals';

import { COURSES, getCourse } from '../content';
import { FIL_COURSES } from '../content/fil';
import { courseHasLanguage, localizedCourse, translatedCourseIds } from './localization';
import { hasLevelPieces, parityProblems, textProblems, translatableStrings } from './localization-parity';

describe('parityProblems', () => {
  const en = {
    id: 'x-01',
    title: 'Hello',
    body: [
      { type: 'paragraph', text: 'Some text' },
      { type: 'code', language: 'javascript', code: 'const a = 1;', label: 'A label' },
    ],
    quiz: [{ id: 'x-01-q1', prompt: 'Pick', choices: ['One', 'Two', 'Three'], answer: 1, explanation: 'Because' }],
    activity: { id: 'a', kind: 'predict-output', title: 'T', code: 'print(1)', expected: '1', choices: ['1', '2'], wrongNotes: { '2': 'No' }, concept: 'loops' },
  };
  const fil = {
    id: 'x-01',
    title: 'Kumusta',
    body: [
      { type: 'paragraph', text: 'Ilang text' },
      { type: 'code', language: 'javascript', code: 'const a = 1;', label: 'Isang label' },
    ],
    quiz: [{ id: 'x-01-q1', prompt: 'Pumili', choices: ['Isa', 'Dalawa', 'Tatlo'], answer: 1, explanation: 'Dahil' }],
    activity: { id: 'a', kind: 'predict-output', title: 'P', code: 'print(1)', expected: '1', choices: ['1', '2'], wrongNotes: { '2': 'Hindi' }, concept: 'loops', conceptLabel: 'mga loop' },
  };

  test('allows translated prose and quiz choices', () => {
    expect(parityProblems(en, fil)).toEqual([]);
  });

  test('refuses a changed code line, answer index, id, expected output or predict-output choice', () => {
    const bad = structuredClone(fil);
    bad.body[1] = { type: 'code', language: 'javascript', code: 'const a = 2;', label: 'x' };
    bad.quiz[0].answer = 2;
    bad.id = 'y';
    bad.activity.expected = '2';
    bad.activity.choices = ['uno', '2'];
    const problems = parityProblems(en, bad).join('\n');
    expect(problems).toContain('body[1].code');
    expect(problems).toContain('quiz[0].answer');
    expect(problems).toContain('.id');
    expect(problems).toContain('activity.expected');
    expect(problems).toContain('activity.choices');
  });

  test('refuses a different number of blocks or choices, and a missing field', () => {
    const shorter = structuredClone(fil);
    shorter.body.pop();
    shorter.quiz[0].choices.pop();
    expect(parityProblems(en, shorter).join('\n')).toMatch(/body: 2 items in English, 1 in Tagalog/);
    expect(parityProblems(en, shorter).join('\n')).toMatch(/choices: 3 items/);
    const { title: _title, ...missing } = fil;
    expect(parityProblems(en, missing).join('\n')).toContain('title: missing in Tagalog');
  });

  test('wrongNotes keys are the program output and must match', () => {
    const bad = structuredClone(fil);
    (bad.activity as { wrongNotes: Record<string, string> }).wrongNotes = { '3': 'Hindi' };
    expect(parityProblems(en, bad).join('\n')).toContain('wrongNotes');
  });
});

describe('parityProblems with level pieces', () => {
  const level = { text: 'For advanced learners', audience: { min: 'advanced' } };
  const en = { id: 'x', body: [{ type: 'paragraph', text: 'Shared' }, { type: 'paragraph', text: 'Only for some', audience: { min: 'advanced' } }], taskExtra: [{ audience: { min: 'advanced' }, steps: ['Extra'] }] };
  const filShared = { id: 'x', body: [{ type: 'paragraph', text: 'Ibinahagi' }] };
  const filFull = { id: 'x', body: [{ type: 'paragraph', text: 'Ibinahagi' }, { type: 'paragraph', text: 'Para sa ilan', audience: { min: 'advanced' } }], taskExtra: [{ audience: { min: 'advanced' }, steps: ['Dagdag'] }] };

  test('knows when a translation carries level pieces', () => {
    expect(hasLevelPieces(filShared)).toBe(false);
    expect(hasLevelPieces(filFull)).toBe(true);
    expect(hasLevelPieces({ a: [{ b: { audience: 1 } }] })).toBe(true);
    expect(hasLevelPieces(level)).toBe(true);
    expect(hasLevelPieces(null)).toBe(false);
  });

  test('a translation without them is compared with the shared part only, as before', () => {
    expect(parityProblems(en, filShared)).toEqual([]);
  });

  test('a translation with them is compared with the whole English course and passes when every level piece is there', () => {
    expect(parityProblems(en, filFull)).toEqual([]);
  });

  test('a level piece that is missing, extra, moved or changed is refused', () => {
    expect(parityProblems(en, { ...filFull, body: [filFull.body[0]] }).length).toBeGreaterThan(0);
    expect(parityProblems(en, { ...filFull, taskExtra: [] }).length).toBeGreaterThan(0);
    expect(parityProblems(en, { ...filFull, body: [filFull.body[0], { ...filFull.body[1], audience: { min: 'beginner' } }] }).length).toBeGreaterThan(0);
  });
});

describe('textProblems', () => {
  test('flags a paragraph left in English and the formal words the style guide bans', () => {
    expect(textProblems('This is a long paragraph that you can read with your friends and the team', 'p')).toHaveLength(1);
    expect(textProblems('Matagumpay mong nakumpleto ang aralin at ang iyong paglalakbay sa pag-aaral.', 'p').length).toBeGreaterThan(0);
  });

  test('accepts Taglish that keeps technical terms and ignores code', () => {
    expect(textProblems('Ang variable ay parang lalagyan ng impormasyon. Gamitin mo ito para mag-store ng `name` at edad sa iyong program.', 'p')).toEqual([]);
  });

  test('reads only the translatable fields', () => {
    const found = translatableStrings({ type: 'code', language: 'javascript', code: 'the and you', label: 'Label' }).map((entry) => entry.path);
    expect(found).toEqual(['course.label']);
  });
});

describe('localized courses', () => {
  test('English is always the English course, and an untranslated course falls back to it', () => {
    const course = getCourse('starter');
    expect(course).toBeDefined();
    expect(localizedCourse(course, 'en')).toBe(course);
    const untranslated = COURSES.find((candidate) => !(candidate.id in FIL_COURSES));
    if (untranslated) {
      expect(courseHasLanguage(untranslated.id, 'fil')).toBe(false);
      expect(localizedCourse(untranslated, 'fil')).toBe(untranslated);
    }
  });

  test.each(Object.entries(FIL_COURSES))('%s in Tagalog keeps everything but the words', (id, translated) => {
    const english = getCourse(id);
    expect(english).toBeDefined();
    expect(translatedCourseIds('fil')).toContain(id);
    // coachRole.instructions is the model's English brief, so it must stay as it is (parity treats it as protected).
    expect(parityProblems(english, translated, id)).toEqual([]);
  });

  test.each(Object.entries(FIL_COURSES))('%s reads as natural Tagalog, not pasted English or stiff Filipino', (_id, translated) => {
    const problems = translatableStrings(translated).flatMap(({ path, text }) => textProblems(text, path));
    expect(problems).toEqual([]);
  });
});
