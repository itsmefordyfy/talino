import { describe, expect, test } from '@jest/globals';

import { activityResultLine, badgeLine, beforeQuizLine, courseFinishedLine, courseIntroLine, coursesLine, discoverEmptyLine, discoverLine, discoverNewGroundLine, emptyLine, exerciseIntroLine, hintLine, lessonCompleteLine, lessonIntroLine, noteMood, pick, quizAnswerLine, quizMissedLine, quizRetakePassedLine, todayLine } from './messages';

const lesson = { id: 'developer-05', title: 'Write code with AI: small steps, tests first', day: 5, intro: { objectives: ['Write a failing test before asking for code.', 'Keep each request small.'] } };
const course = { id: 'developer', title: 'Developer: Get Hired with AI', kind: 'career' as const, lessons: 20 };

describe('pick', () => {
  test('is stable for a seed and varies across seeds', () => {
    const options = ['a', 'b', 'c', 'd'];
    expect(pick(options, 'x')).toBe(pick(options, 'x'));
    expect(new Set(['p', 'q', 'r', 's', 't', 'u', 'v'].map((seed) => pick(options, seed))).size).toBeGreaterThan(1);
  });
});

describe('courseIntroLine', () => {
  const base = { name: 'Ford Francisco', course, lessonsDone: 0, nextLessonTitle: null, hasCertificate: true };
  test('welcomes a new learner by first name and says what kind of course it is', () => {
    const line = courseIntroLine(base);
    expect(line.text).toContain('Ford');
    expect(line.text).not.toContain('Francisco');
    expect(line.text.toLowerCase()).toContain('certificate');
    expect(line.mood).toBe('excited');
  });
  test('says where a returning learner is and what is next', () => {
    const line = courseIntroLine({ ...base, lessonsDone: 7, nextLessonTitle: 'Debug with AI' });
    expect(line.text).toContain('7 of 20');
    expect(line.text).toContain('Debug with AI');
  });
  test('congratulates on a finished course', () => {
    expect(courseIntroLine({ ...base, lessonsDone: 20 }).mood).toBe('accomplished');
  });
  test('an AI path course talks about using AI carefully', () => {
    expect(courseIntroLine({ ...base, course: { ...course, kind: 'path' } }).text.toLowerCase()).toContain('check');
  });
  test('reads right with no name', () => {
    expect(courseIntroLine({ ...base, name: '' }).text).not.toMatch(/,\s*[!.]/);
  });
});

describe('lessonIntroLine', () => {
  const base = { name: 'Ford', lesson, courseLessons: 20, done: false, courseTitle: 'Developer' };
  test('names the actual lesson and the first objective', () => {
    const line = lessonIntroLine(base);
    expect(line.text.toLowerCase()).toContain('write code with ai');
    expect(line.text).toContain('write a failing test before asking for code');
    expect(line.mood).toBe('curious');
  });
  test('the first and last days are special, and a finished lesson is revisited kindly', () => {
    expect(lessonIntroLine({ ...base, lesson: { ...lesson, day: 1 } }).text).toContain('Day 1');
    expect(lessonIntroLine({ ...base, lesson: { ...lesson, day: 20 } }).text).toContain('last lesson');
    expect(lessonIntroLine({ ...base, done: true }).text).toContain('again');
  });
  test('works for a lesson with no intro', () => {
    expect(lessonIntroLine({ ...base, lesson: { ...lesson, intro: undefined } }).text.length).toBeGreaterThan(10);
  });
});

describe('quiz lines', () => {
  test('before the quiz: counts the real questions, and a retake says the best score is kept', () => {
    expect(beforeQuizLine({ lessonId: 'a-01', takeaways: 4, questions: 5, retake: false }).text).toContain('5');
    expect(beforeQuizLine({ lessonId: 'a-01', takeaways: 4, questions: 5, retake: true }).text).toContain('best score is kept');
  });
  test('a right answer is celebrated, more so in a run', () => {
    const one = quizAnswerLine({ lessonId: 'a-01', index: 0, total: 5, correct: true, streak: 0, missedInRow: 0 });
    const run = quizAnswerLine({ lessonId: 'a-01', index: 3, total: 5, correct: true, streak: 3, missedInRow: 0 });
    expect(one.mood).toBe('excited');
    expect(run.text).toContain('4 in a row');
    expect(run.mood).toBe('celebrating');
  });
  test('a wrong answer is met with support and never reveals anything', () => {
    const one = quizAnswerLine({ lessonId: 'a-01', index: 1, total: 5, correct: false, streak: 0, missedInRow: 1 });
    const two = quizAnswerLine({ lessonId: 'a-01', index: 2, total: 5, correct: false, streak: 0, missedInRow: 2 });
    expect(one.mood).toBe('supportive');
    expect(two.text.toLowerCase()).toContain('tricky');
    for (const line of [one, two]) expect(line.text).not.toMatch(/the answer is|correct answer/i);
  });
  test('a missed quiz says the score and the way forward', () => {
    const line = quizMissedLine({ name: 'Ford', correct: 1, total: 4 });
    expect(line.text).toContain('1 of 4');
    expect(line.mood).toBe('supportive');
  });
});

describe('exercise, hint and result lines', () => {
  test('the exercise intro says what it is about and that hints exist', () => {
    const line = exerciseIntroLine({ lessonId: 'a-01', activities: 2, concept: 'building in small steps', score: { correct: 4, total: 4 } });
    expect(line.text).toContain('2 activities on building in small steps');
    expect(line.text).toContain('Hints are there');
    expect(line.mood).toBe('excited');
  });
  test('hints grow closer and the last one is honest', () => {
    expect(hintLine({ number: 1, total: 3 }).text).toContain('Need a little help');
    expect(hintLine({ number: 2, total: 3 }).text).toContain('closer');
    expect(hintLine({ number: 3, total: 3 }).text).toContain('closest');
  });
  test('results acknowledge no hints, hints used, and a miss', () => {
    expect(activityResultLine({ activityId: 'x', solved: true, wrongTries: 0, hintsUsed: 0 }).mood).toBe('celebrating');
    expect(activityResultLine({ activityId: 'x', solved: true, wrongTries: 0, hintsUsed: 1 }).text).toContain('hint');
    expect(activityResultLine({ activityId: 'x', solved: false, wrongTries: 1, hintsUsed: 0 }).mood).toBe('supportive');
    expect(activityResultLine({ activityId: 'x', solved: false, wrongTries: 2, hintsUsed: 0 }).text).toContain('hint');
  });
});

describe('completion and everyday lines', () => {
  const done = { name: 'Ford', lessonTitle: 'Debug with AI', xp: 25, perfect: true, nextTitle: 'Write tests with AI', lessonsDone: 8, courseLessons: 20, courseDone: false };
  test('a finished lesson names the lesson, the XP and what is next', () => {
    const line = lessonCompleteLine(done);
    expect(line.text).toContain('Debug with AI');
    expect(line.text).toContain('+25 XP');
    expect(line.text).toContain('write tests with AI');
    expect(line.text).toContain('perfect');
    expect(line.mood).toBe('celebrating');
  });
  test('the last lesson of a course is the course', () => {
    expect(lessonCompleteLine({ ...done, courseDone: true }).mood).toBe('accomplished');
  });
  test('badges, today, courses and empty places', () => {
    expect(badgeLine({ title: 'Bug Hunter', name: 'Ford' }).text).toContain('Bug Hunter');
    expect(todayLine({ name: 'Ford', hour: 9, streak: 4, doneToday: false, nextLessonTitle: 'Debug with AI' }).text).toMatch(/Good morning.*4-day streak.*Debug with AI/);
    expect(todayLine({ name: 'Ford', hour: 20, streak: 4, doneToday: true, nextLessonTitle: null }).text).toContain('4 days in a row');
    expect(coursesLine({ name: 'Ford', started: 0, goalCourse: null }).mood).toBe('curious');
    for (const kind of ['history', 'courses', 'plan'] as const) expect(emptyLine(kind).text.length).toBeGreaterThan(10);
    expect(noteMood('tip')).not.toBe(noteMood('warning'));
  });
});

describe('discover lines', () => {
  test('a learner who told us nothing gets friendly first steps and an invitation to personalize', () => {
    const line = discoverLine({ name: 'Ford Francisco', personalized: false, hasPicks: false, started: 0 });
    expect(line.text).toContain('Ford');
    expect(line.text).not.toContain('Francisco');
    expect(line.text.toLowerCase()).toContain('goals');
    expect(line.mood).toBe('curious');
  });
  test('picks are explained as based on their interests; a learner with progress is welcomed back', () => {
    expect(discoverLine({ name: '', personalized: true, hasPicks: true, started: 0 }).text).toContain('based on your interests');
    expect(discoverLine({ name: '', personalized: true, hasPicks: true, started: 0 }).text).not.toContain(',');
    expect(discoverLine({ name: 'Ana', personalized: true, hasPicks: true, started: 2 }).text).toContain('Welcome back, Ana');
  });
  test('with no picks the invitation says everything is open', () => {
    expect(discoverLine({ name: '', personalized: true, hasPicks: false, started: 0 }).text).toContain('Every course is open');
  });
  test('the new-ground line names how many areas, singular or plural', () => {
    expect(discoverNewGroundLine({ categories: 3 }).text).toContain('3 areas');
    expect(discoverNewGroundLine({ categories: 1 }).text).toContain('an area');
  });
  test('an empty result is kind and names the search or the filters', () => {
    expect(discoverEmptyLine({ text: 'xyz', filters: 0 }).text).toContain('"xyz"');
    expect(discoverEmptyLine({ text: 'xyz', filters: 2 }).text).toContain('filters');
    expect(discoverEmptyLine({ text: '  ', filters: 2 }).text).toContain('filters');
    expect(discoverEmptyLine({ text: 'xyz', filters: 0 }).mood).toBe('supportive');
  });
  test('the lines are deterministic', () => {
    const input = { name: 'Ana', personalized: true, hasPicks: true, started: 0 };
    expect(discoverLine(input)).toEqual(discoverLine(input));
  });
});

describe('Tagalog (fil)', () => {
  const fil = { language: 'fil' as const };
  const en = { language: 'en' as const };
  const done = { name: 'Ford Francisco', lessonTitle: 'Debug with AI', xp: 25, perfect: true, nextTitle: 'Write tests with AI', lessonsDone: 8, courseLessons: 20, courseDone: false };
  const lessonBase = { name: 'Ford', lesson, courseLessons: 20, done: false, courseTitle: 'Developer' };
  const courseBase = { name: 'Ford Francisco', course, lessonsDone: 0, nextLessonTitle: null, hasCertificate: true };
  const lessonSeeds = ['developer-02', 'developer-03', 'developer-04', 'developer-05', 'developer-06', 'developer-07', 'x', 'y', 'z'];

  /** Every situation each function can be in, so both languages are compared across the same inputs. */
  const scenarios: Record<string, (language: 'en' | 'fil') => ReturnType<typeof hintLine>[]> = {
    courseIntroLine: (language) => [
      ...(['starter', 'career', 'mini', 'path', 'standard'] as const).flatMap((kind) => ['developer', 'other', 'abc'].map((id) => courseIntroLine({ ...courseBase, course: { ...course, id, kind }, language }))),
      courseIntroLine({ ...courseBase, lessonsDone: 7, nextLessonTitle: 'Debug with AI', language }),
      courseIntroLine({ ...courseBase, lessonsDone: 7, language }),
      courseIntroLine({ ...courseBase, lessonsDone: 20, language }),
      courseIntroLine({ ...courseBase, lessonsDone: 20, hasCertificate: false, language }),
      courseIntroLine({ ...courseBase, name: '', language }),
    ],
    lessonIntroLine: (language) => [
      ...lessonSeeds.map((id) => lessonIntroLine({ ...lessonBase, lesson: { ...lesson, id }, language })),
      lessonIntroLine({ ...lessonBase, lesson: { ...lesson, day: 1 }, language }),
      lessonIntroLine({ ...lessonBase, lesson: { ...lesson, day: 20 }, language }),
      lessonIntroLine({ ...lessonBase, done: true, language }),
      lessonIntroLine({ ...lessonBase, lesson: { ...lesson, intro: undefined }, language }),
      lessonIntroLine({ ...lessonBase, name: '', language }),
    ],
    beforeQuizLine: (language) => [
      ...lessonSeeds.map((lessonId) => beforeQuizLine({ lessonId, takeaways: 4, questions: 5, retake: false, language })),
      beforeQuizLine({ lessonId: 'a', takeaways: 0, questions: 5, retake: false, language }),
      beforeQuizLine({ lessonId: 'a', takeaways: 4, questions: 5, retake: true, language }),
    ],
    quizAnswerLine: (language) => [
      ...[0, 1, 2, 3, 4, 5, 6].flatMap((index) => [
        quizAnswerLine({ lessonId: 'a-01', index, total: 5, correct: true, streak: 0, missedInRow: 0, language }),
        quizAnswerLine({ lessonId: 'a-01', index, total: 5, correct: false, streak: 0, missedInRow: 1, language }),
      ]),
      quizAnswerLine({ lessonId: 'a-01', index: 3, total: 5, correct: true, streak: 3, missedInRow: 0, language }),
      quizAnswerLine({ lessonId: 'a-01', index: 3, total: 5, correct: false, streak: 0, missedInRow: 2, language }),
    ],
    quizMissedLine: (language) => [quizMissedLine({ name: 'Ford', correct: 1, total: 4, language }), quizMissedLine({ name: '', correct: 0, total: 4, language })],
    quizRetakePassedLine: (language) => [quizRetakePassedLine({ correct: 4, total: 4, language }), quizRetakePassedLine({ correct: 3, total: 4, language })],
    exerciseIntroLine: (language) => [
      exerciseIntroLine({ lessonId: 'a', activities: 2, concept: 'building in small steps', score: { correct: 4, total: 4 }, language }),
      exerciseIntroLine({ lessonId: 'a', activities: 2, concept: null, score: { correct: 2, total: 4 }, language }),
      exerciseIntroLine({ lessonId: 'a', activities: 0, concept: null, score: null, language }),
    ],
    hintLine: (language) => [hintLine({ number: 1, total: 3, language }), hintLine({ number: 2, total: 3, language }), hintLine({ number: 3, total: 3, language }), hintLine({ number: 1, total: 1, language })],
    activityResultLine: (language) => [
      ...['a', 'b', 'c', 'd', 'e'].flatMap((activityId) => [
        activityResultLine({ activityId, solved: true, wrongTries: 0, hintsUsed: 0, language }),
        activityResultLine({ activityId, solved: false, wrongTries: 1, hintsUsed: 0, language }),
      ]),
      activityResultLine({ activityId: 'a', solved: true, wrongTries: 0, hintsUsed: 1, language }),
      activityResultLine({ activityId: 'a', solved: true, wrongTries: 2, hintsUsed: 1, language }),
      activityResultLine({ activityId: 'a', solved: false, wrongTries: 2, hintsUsed: 0, language }),
    ],
    lessonCompleteLine: (language) => [
      lessonCompleteLine({ ...done, language }),
      lessonCompleteLine({ ...done, perfect: false, language }),
      lessonCompleteLine({ ...done, nextTitle: null, language }),
      lessonCompleteLine({ ...done, name: '', language }),
      lessonCompleteLine({ ...done, courseDone: true, language }),
    ],
    courseFinishedLine: (language) => [courseFinishedLine({ courseTitle: 'Developer', language })],
    badgeLine: (language) => [badgeLine({ title: 'Bug Hunter', name: 'Ford', language }), badgeLine({ title: 'Bug Hunter', name: '', language })],
    todayLine: (language) =>
      [3, 9, 14, 20].flatMap((hour) => [
        todayLine({ name: 'Ford', hour, streak: 4, doneToday: false, nextLessonTitle: 'Debug with AI', language }),
        todayLine({ name: 'Ford', hour, streak: 0, doneToday: false, nextLessonTitle: 'Debug with AI', language }),
        todayLine({ name: '', hour, streak: 4, doneToday: true, nextLessonTitle: null, language }),
        todayLine({ name: 'Ford', hour, streak: 1, doneToday: false, nextLessonTitle: null, language }),
        todayLine({ name: 'Ford', hour, streak: 4, doneToday: false, nextLessonTitle: 'Debug with AI', withGreeting: false, language }),
      ]),
    coursesLine: (language) => [coursesLine({ name: 'Ford', started: 0, goalCourse: 'Developer', language }), coursesLine({ name: '', started: 0, goalCourse: null, language }), coursesLine({ name: 'Ford', started: 2, goalCourse: null, language })],
    discoverLine: (language) => [
      discoverLine({ name: 'Ford', personalized: false, hasPicks: false, started: 0, language }),
      discoverLine({ name: 'Ford', personalized: true, hasPicks: false, started: 0, language }),
      discoverLine({ name: 'Ford', personalized: true, hasPicks: true, started: 2, language }),
      discoverLine({ name: '', personalized: true, hasPicks: true, started: 0, language }),
    ],
    discoverNewGroundLine: (language) => [discoverNewGroundLine({ categories: 3, language }), discoverNewGroundLine({ categories: 1, language })],
    discoverEmptyLine: (language) => [discoverEmptyLine({ text: 'xyz', filters: 0, language }), discoverEmptyLine({ text: 'xyz', filters: 2, language }), discoverEmptyLine({ text: '  ', filters: 2, language })],
    emptyLine: (language) => (['history', 'courses', 'plan'] as const).map((kind) => emptyLine(kind, language)),
  };

  /** English template wording that must never survive into the Tagalog lines. */
  const ENGLISH_LEFTOVERS = /\b(You|Your|You're|You've|Next up|Welcome back|Good (morning|afternoon|evening)|Hey|Shall we|Let's|Awesome|Fantastic|Great work|proud of you|in a row|of \d+|to go|lessons? done|questions?\b.*\bexplain)\b/;

  test.each(Object.keys(scenarios))('%s: deterministic, never empty, no English template wording', (name) => {
    const first = scenarios[name]('fil');
    expect(scenarios[name]('fil')).toEqual(first);
    expect(first.length).toBeGreaterThan(0);
    for (const line of first) {
      expect(line.text.trim().length).toBeGreaterThan(10);
      expect(line.text).not.toMatch(ENGLISH_LEFTOVERS);
      expect(line.text).not.toMatch(/undefined|null|NaN|\[object/);
      expect(line.text).not.toMatch(/\s{2,}/);
      expect(line.text).not.toMatch(/,\s*[!.?]/);
      expect(line.text).not.toMatch(/the answer is|correct answer|ang sagot ay|ang tamang sagot ay/i);
    }
  });

  test.each(Object.keys(scenarios))('%s: the same moods as English for every situation', (name) => {
    const english = scenarios[name]('en');
    const tagalog = scenarios[name]('fil');
    expect(tagalog.map((line) => line.mood)).toEqual(english.map((line) => line.mood));
    expect(new Set(tagalog.map((line) => line.mood))).toEqual(new Set(english.map((line) => line.mood)));
  });

  test('Tagalog is not the English text, and English stays the default', () => {
    for (const name of Object.keys(scenarios)) {
      const english = scenarios[name]('en');
      const tagalog = scenarios[name]('fil');
      english.forEach((line, index) => expect(tagalog[index].text).not.toBe(line.text));
    }
    expect(todayLine({ name: 'Ford', hour: 9, streak: 4, doneToday: false, nextLessonTitle: 'X' })).toEqual(todayLine({ name: 'Ford', hour: 9, streak: 4, doneToday: false, nextLessonTitle: 'X', ...en }));
    expect(emptyLine('plan')).toEqual(emptyLine('plan', 'en'));
  });

  test('the name is inserted by first name only, with and without a name', () => {
    expect(courseIntroLine({ ...courseBase, ...fil }).text).toMatch(/Ford[!,]/);
    expect(courseIntroLine({ ...courseBase, ...fil }).text).not.toContain('Francisco');
    expect(badgeLine({ title: 'Bug Hunter', name: 'Ford Francisco', ...fil }).text).toContain('badge ka, Ford:');
    expect(badgeLine({ title: 'Bug Hunter', name: '', ...fil }).text).toContain('badge ka: Bug Hunter');
    expect(discoverLine({ name: 'Ford', personalized: false, hasPicks: false, started: 0, ...fil }).text).toContain('Hi Ford!');
    expect(discoverLine({ name: '', personalized: false, hasPicks: false, started: 0, ...fil }).text).toContain('Hi!');
    expect(discoverLine({ name: '', personalized: true, hasPicks: true, started: 0, ...fil }).text).not.toContain(',');
  });

  test('counts and plurals read naturally in Tagalog', () => {
    const back = courseIntroLine({ ...courseBase, lessonsDone: 3, course: { ...course, lessons: 7 }, nextLessonTitle: 'Debug with AI', ...fil }).text;
    expect(back).toContain('3 sa 7 lesson na ang tapos mo');
    expect(back).toContain('4 na lang');
    expect(back).toContain('Susunod: Debug with AI');
    expect(quizMissedLine({ name: 'Ford', correct: 1, total: 4, ...fil }).text).toContain('1 sa 4');
    expect(quizAnswerLine({ lessonId: 'a-01', index: 3, total: 5, correct: true, streak: 3, missedInRow: 0, ...fil }).text).toContain('4 sunod-sunod');
    expect(beforeQuizLine({ lessonId: 'a-01', takeaways: 4, questions: 5, retake: false, ...fil }).text).toContain('5 tanong');
    expect(exerciseIntroLine({ lessonId: 'a-01', activities: 2, concept: 'building in small steps', score: { correct: 4, total: 4 }, ...fil }).text).toContain('2 activity tungkol sa building in small steps');
    expect(lessonCompleteLine({ ...done, ...fil }).text).toContain('+25 XP');
    expect(todayLine({ name: 'Ford', hour: 20, streak: 4, doneToday: true, nextLessonTitle: null, ...fil }).text).toContain('4 araw na sunod-sunod');
    expect(todayLine({ name: 'Ford', hour: 9, streak: 4, doneToday: false, nextLessonTitle: 'Debug with AI', ...fil }).text).toMatch(/Magandang umaga.*4-day streak.*Debug with AI/);
    expect(discoverNewGroundLine({ categories: 3, ...fil }).text).toContain('3 area');
    expect(discoverNewGroundLine({ categories: 1, ...fil }).text).toContain('isang area');
    expect(discoverEmptyLine({ text: 'xyz', filters: 0, ...fil }).text).toContain('"xyz"');
  });

  test('lesson titles and objectives appear as given, and hints never give an answer away', () => {
    const intro = lessonIntroLine({ ...lessonBase, ...fil }).text;
    expect(intro).toContain('Write code with AI');
    expect(intro).toContain('Write a failing test before asking for code');
    expect(lessonIntroLine({ ...lessonBase, lesson: { ...lesson, day: 1 }, ...fil }).text).toContain('Araw 1');
    expect(lessonIntroLine({ ...lessonBase, lesson: { ...lesson, day: 20 }, ...fil }).text).toContain('huling lesson');
    expect(lessonIntroLine({ ...lessonBase, done: true, ...fil }).text).toContain('ulit');
    expect(hintLine({ number: 3, total: 3, ...fil }).text).toContain('pinakamalapit');
    expect(quizAnswerLine({ lessonId: 'a-01', index: 2, total: 5, correct: false, streak: 0, missedInRow: 2, ...fil }).text).toContain('tricky');
    expect(beforeQuizLine({ lessonId: 'a-01', takeaways: 4, questions: 5, retake: true, ...fil }).text).toContain('best score');
  });

  test('noteMood does not depend on language', () => {
    expect(noteMood('tip')).toBe('explaining');
    expect(noteMood('warning')).toBe('surprised');
  });
});
