import { describe, expect, test } from '@jest/globals';

import { DEMO_LIMITS, demoBlockProblems, realOutputClaim, type DemoBlock } from './demo-block';
import { lessonScript } from './plain-text';
import { hashSegments, lessonSegments } from './speech-segments';
import { speechPhrases } from './speech-phrases';
import { lessonKeyTerms } from './key-terms';
import { teachingWords } from './lesson-structure';
import type { Lesson } from '../content/types';

const demo: DemoBlock = {
  type: 'demo',
  title: 'A clear request for a refund email',
  prompt: 'Write a short, polite email to a customer. Say sorry for the late order and offer 10% off.',
  output: 'Hi Maria,\n\nI am sorry your order was late. Here is a 10% discount for your next order. Thank you for your patience.',
  notice: 'The answer follows the tone and the offer you asked for. Check the discount and the name before you send it.',
};

describe('demoBlockProblems', () => {
  test('a well-formed demo has no problems', () => {
    expect(demoBlockProblems(demo)).toEqual([]);
  });

  test('every part is required, and whitespace is empty', () => {
    expect(demoBlockProblems({ ...demo, title: '  ', prompt: '', notice: '\n' })).toEqual(['the demo has an empty title', 'the demo has an empty prompt', 'the demo has an empty notice']);
    expect(demoBlockProblems({ ...demo, output: '' })).toEqual(['the demo has an empty output']);
  });

  test('keeps each part short enough to read', () => {
    expect(demoBlockProblems({ ...demo, output: 'x'.repeat(DEMO_LIMITS.output + 1) })[0]).toContain('output');
    expect(demoBlockProblems({ ...demo, output: 'x'.repeat(DEMO_LIMITS.output) })).toEqual([]);
  });

  test('rejects a title or notice that calls the example a real or recorded output', () => {
    for (const bad of ['This is the real output of the model.', 'ChatGPT replied with a clear plan.', 'A recorded response from the assistant.', 'Written by Claude, unedited.', 'Here is a screenshot of the answer.', 'The actual response is short.']) {
      expect(demoBlockProblems({ ...demo, notice: bad }).join(' ')).toContain('hand-written illustration');
      expect(demoBlockProblems({ ...demo, title: bad }).join(' ')).toContain('hand-written illustration');
    }
  });

  test('allows saying it is NOT a real output, and ordinary words that merely contain such letters', () => {
    expect(demoBlockProblems({ ...demo, notice: 'This is not a real model output, only a made-up example of the kind of answer you might get.' })).toEqual([]);
    expect(demoBlockProblems({ ...demo, notice: 'Real customers write short messages. The answer repeats the offer.' })).toEqual([]);
    expect(demoBlockProblems({ ...demo, title: 'A live example of a polite reply' })).toEqual([]);
    expect(realOutputClaim('the model replied')).toBe('the model replied');
    expect(realOutputClaim('A model that never replied is not shown here.')).toBeNull();
  });

  test('does not read the example answer itself for claims', () => {
    expect(demoBlockProblems({ ...demo, output: 'I am a real model and I replied right away.' })).toEqual([]);
  });
});

const lesson = (body: Lesson['body']): Lesson => ({
  id: 'x-01',
  day: 1,
  title: 'Asking well',
  summary: 'How a clear request changes the answer.',
  minutes: 15,
  skills: [],
  intro: { objectives: ['Write a clear request', 'Check an answer'], why: 'A clear request saves you time and avoids mistakes.' },
  body,
  quiz: [],
  task: { title: 't', steps: ['a', 'b'] },
} as unknown as Lesson);

describe('a demo in the narration (Listen, the phone voice and the Kokoro script export)', () => {
  const say = speechPhrases('en');
  const sample = lesson([
    { type: 'paragraph', text: 'Before the example, a sentence.' },
    demo,
    { type: 'takeaways', items: ['Be specific.', 'Check the result.'] },
  ]);
  const script = lessonScript(sample);

  test('is read as: example (an illustration), you ask, an AI might answer, notice', () => {
    const at = (text: string) => script.indexOf(text);
    expect(at(say.demoIntro)).toBeGreaterThan(-1);
    expect(at(say.demoIntro)).toBeLessThan(at(`${say.demoPrompt} ${demo.prompt}`));
    expect(at(`${say.demoPrompt} ${demo.prompt}`)).toBeLessThan(at(say.demoOutput));
    expect(at(say.demoOutput)).toBeLessThan(at(say.demoNotice));
    expect(script).toContain(`${say.demoNotice} ${demo.notice}`);
    // Said as an illustration, never as a real answer, and the title is not read.
    expect(say.demoIntro).toMatch(/illustration/i);
    expect(script).not.toContain(demo.title);
  });

  test('the segments say exactly what the script says, and every part is a unit the screen can follow', () => {
    const segments = lessonSegments(sample);
    const squash = (text: string) => text.replace(/\s+/g, ' ').trim();
    expect(squash(segments.map((segment) => segment.text).join(' '))).toBe(squash(script));
    const units = segments.map((segment) => segment.unit);
    for (const unit of ['b1', 'b1-prompt-label', 'b1-prompt', 'b1-output-label', 'b1-output', 'b1-notice-label', 'b1-notice']) expect(units).toContain(unit);
    expect(segments.every((segment) => segment.text.trim() !== '')).toBe(true);
    expect(hashSegments(segments)).toMatch(/^[0-9a-f]{8}$/);
  });

  test('a demo changes the recording hash (new words are new audio) and does not count as teaching or key terms', () => {
    const without = lesson([{ type: 'paragraph', text: 'Before the example, a sentence.' }, { type: 'takeaways', items: ['Be specific.', 'Check the result.'] }]);
    expect(hashSegments(lessonSegments(sample))).not.toBe(hashSegments(lessonSegments(without)));
    expect(teachingWords([demo])).toBe(0);
    expect(lessonKeyTerms(lesson([{ ...demo, notice: 'Look at **the tone**.' }]))).toEqual([]);
  });

  test('the same words in the screen unit for a multi-sentence part: one segment per sentence', () => {
    const segments = lessonSegments(lesson([{ type: 'paragraph', text: 'Intro sentence for the lesson.' }, demo]));
    expect(segments.filter((segment) => segment.unit === 'b1-prompt').map((segment) => segment.text)).toEqual(['Write a short, polite email to a customer.', 'Say sorry for the late order and offer 10% off.']);
  });
});
