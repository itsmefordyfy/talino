import { describe, expect, it } from '@jest/globals';

import { lessonForWatch } from './lesson-text';

const base = { lessonId: 'starter-02', title: 'Day 2', course: 'AI Basics for Tech', language: 'en' };
const seg = (...texts: string[]) => texts.map((text) => ({ text }));

describe('lessonForWatch', () => {
  it('sends the spoken sentences in order and where to start', () => {
    expect(lessonForWatch({ ...base, segments: seg('One.', 'Two.', 'Three.'), segment: 1 })).toEqual({ ...base, sentences: ['One.', 'Two.', 'Three.'], at: [0, 1, 2], segment: 1 });
  });

  it('drops empty sentences and moves the start with them', () => {
    const lesson = lessonForWatch({ ...base, segments: seg('One.', '  ', 'Three.', 'Four.'), segment: 3 });
    expect(lesson?.sentences).toEqual(['One.', 'Three.', 'Four.']);
    expect(lesson?.segment).toBe(2);
    // Handing back resumes at the phone's own segment, not the position among the non-empty ones.
    expect(lesson?.at).toEqual([0, 2, 3]);
  });

  it('tidies the spaces, cuts a very long sentence and keeps the start inside the lesson', () => {
    const lesson = lessonForWatch({ ...base, segments: seg(`Some   words\nhere ${'x'.repeat(900)}`), segment: 40 });
    expect(lesson?.sentences[0].startsWith('Some words here ')).toBe(true);
    expect(lesson?.sentences[0].length).toBe(500);
    expect(lesson?.segment).toBe(0);
  });

  it('stops at a size one reply can carry', () => {
    const lesson = lessonForWatch({ ...base, segments: seg(...Array.from({ length: 400 }, () => 'y'.repeat(400))), segment: 0 });
    expect(lesson!.sentences.length).toBeLessThan(400);
    expect(lesson!.sentences.join('').length).toBeLessThanOrEqual(90_000);
  });

  it('is null when there is nothing to say', () => {
    expect(lessonForWatch({ ...base, segments: seg('', '  '), segment: 0 })).toBeNull();
    expect(lessonForWatch({ ...base, segments: [], segment: 0 })).toBeNull();
  });
});
