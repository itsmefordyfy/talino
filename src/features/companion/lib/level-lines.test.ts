import { describe, expect, test } from '@jest/globals';

import { levelLessonLine, levelQuizLine } from './level-lines';
import { beforeQuizLine, lessonIntroLine } from './messages';

const lesson = { id: 'starter-02', title: 'What a prompt is', day: 2, intro: { objectives: ['Write a clear request for an AI assistant.', 'Spot a vague one.'] } };
const baseLesson = (language?: 'en' | 'fil') => lessonIntroLine({ name: 'Ana', lesson, courseLessons: 7, done: false, courseTitle: 'AI Basics', language });
const baseQuiz = (language?: 'en' | 'fil') => beforeQuizLine({ lessonId: lesson.id, takeaways: 3, questions: 4, retake: false, language });

describe('levelLessonLine', () => {
  test('newcomers keep the base line and get a little more encouragement', () => {
    const base = baseLesson();
    for (const level of ['complete-beginner', 'beginner'] as const) {
      const line = levelLessonLine(base, { level, lesson, done: false });
      expect(line.text.startsWith(base.text)).toBe(true);
      expect(line.text.length).toBeGreaterThan(base.text.length);
    }
  });

  test('advanced learners and professionals get a leaner line with the lesson and its first objective', () => {
    for (const level of ['advanced', 'professional'] as const) {
      const line = levelLessonLine(baseLesson(), { level, lesson, done: false });
      expect(line.text).toBe("What a prompt is. You'll be able to write a clear request for an AI assistant.");
      expect(line.text.length).toBeLessThan(baseLesson().text.length);
    }
  });

  test('intermediate, unknown level and a finished lesson keep the base line exactly', () => {
    const base = baseLesson();
    expect(levelLessonLine(base, { level: 'intermediate', lesson, done: false })).toEqual(base);
    expect(levelLessonLine(base, { level: null, lesson, done: false })).toEqual(base);
    expect(levelLessonLine(base, { level: 'professional', lesson, done: true })).toEqual(base);
  });

  test('is deterministic and available in Tagalog', () => {
    const base = baseLesson('fil');
    expect(levelLessonLine(base, { level: 'beginner', lesson, done: false, language: 'fil' })).toEqual(levelLessonLine(base, { level: 'beginner', lesson, done: false, language: 'fil' }));
    expect(levelLessonLine(base, { level: 'professional', lesson, done: false, language: 'fil' }).text).toContain('Pagkatapos, kaya mong');
  });
});

describe('levelQuizLine', () => {
  test('newcomers hear that every answer is explained, professionals get the count only', () => {
    expect(levelQuizLine(baseQuiz(), { level: 'complete-beginner', questions: 4, retake: false }).text).toContain('Every answer is explained');
    expect(levelQuizLine(baseQuiz(), { level: 'professional', questions: 5, retake: false }).text).toBe('5 questions, each answer explained.');
    expect(levelQuizLine(baseQuiz('fil'), { level: 'professional', questions: 5, retake: false, language: 'fil' }).text).toContain('5 tanong');
  });

  test('a retake, intermediate and an unknown level keep the base line', () => {
    const base = baseQuiz();
    expect(levelQuizLine(base, { level: 'professional', questions: 4, retake: true })).toEqual(base);
    expect(levelQuizLine(base, { level: 'intermediate', questions: 4, retake: false })).toEqual(base);
    expect(levelQuizLine(base, { level: null, questions: 4, retake: false })).toEqual(base);
  });
});
