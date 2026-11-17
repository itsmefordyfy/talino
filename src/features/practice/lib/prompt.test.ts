import { describe, expect, test } from '@jest/globals';

import { PRIVATE_MARKERS, SCENARIO, SPEAKING_SCENARIO, TASK } from '../test-support';
import { PRACTICE_CRITERIA } from '../types';
import { CRITERION_GUIDE } from './criteria';
import { SPEAKING_NOTE, buildDebriefPrompt, buildPartnerPrompt, buildReviewPrompt, formatReviewData, formatTranscript } from './prompt';

describe('criteria guide', () => {
  test('every criterion has a plain definition', () => {
    for (const criterion of PRACTICE_CRITERIA) expect(CRITERION_GUIDE[criterion].length).toBeGreaterThan(20);
  });
});

describe('the partner’s instructions', () => {
  const prompt = buildPartnerPrompt({ scenario: SCENARIO, turn: 1 });

  test('puts the model in character with the setting, the goal, the personality, the private motive and how to react', () => {
    expect(prompt).toContain('You are Dana');
    expect(prompt).toContain(SCENARIO.partner.title);
    expect(prompt).toContain(SCENARIO.setting);
    expect(prompt).toContain(SCENARIO.goal);
    expect(prompt).toContain(PRIVATE_MARKERS.personality);
    expect(prompt).toContain(PRIVATE_MARKERS.private);
    expect(prompt).toContain(PRIVATE_MARKERS.good);
    expect(prompt).toContain(PRIVATE_MARKERS.poor);
    expect(prompt).toContain(SCENARIO.opening);
  });

  test('does not hand the partner the assessment rubric at all', () => {
    expect(prompt).not.toContain(PRIVATE_MARKERS.strongSign);
    expect(prompt).not.toContain(PRIVATE_MARKERS.trap);
  });

  test('says to adapt to what the learner says, never break character, never coach, never give the ideal answer', () => {
    expect(prompt).toMatch(/adapt/i);
    expect(prompt).toMatch(/never break character/i);
    expect(prompt).toMatch(/never coach|do not coach/i);
    expect(prompt).toMatch(/ideal answer|model answer/i);
    expect(prompt).toMatch(/never reveal/i);
  });

  test('keeps it a workplace conversation and treats the learner’s words as data, not instructions', () => {
    expect(prompt).toMatch(/workplace/i);
    expect(prompt).toMatch(/data/i);
    expect(prompt).toMatch(/ignore (the|your) (rules|instructions)/i);
  });

  test('asks for JSON with a reply and an end flag', () => {
    expect(prompt).toContain('"reply"');
    expect(prompt).toContain('"end"');
  });

  test('knows how far along the conversation is', () => {
    expect(buildPartnerPrompt({ scenario: SCENARIO, turn: 1 })).toContain(`turn 1 of at most ${SCENARIO.maxTurns}`);
    const early = buildPartnerPrompt({ scenario: SCENARIO, turn: 1 });
    expect(early).toMatch(/do not end/i);
    const last = buildPartnerPrompt({ scenario: SCENARIO, turn: SCENARIO.maxTurns });
    expect(last).toMatch(/final turn/i);
    expect(last).toContain('"end" to true');
  });

  test('the words-only honesty note appears for a speaking scenario and only for one', () => {
    expect(buildPartnerPrompt({ scenario: SPEAKING_SCENARIO, turn: 1 })).toContain('read aloud');
    expect(buildPartnerPrompt({ scenario: SPEAKING_SCENARIO, turn: 1 })).toMatch(/only (receive|see|get) (the )?words/i);
    expect(prompt).not.toContain('read aloud');
  });
});

describe('the debrief instructions', () => {
  const prompt = buildDebriefPrompt({ scenario: SCENARIO, learnerTurns: 4 });

  test('scores only the named criteria and defines them', () => {
    for (const criterion of SCENARIO.criteria) {
      expect(prompt).toContain(`"${criterion}"`);
      expect(prompt).toContain(CRITERION_GUIDE[criterion]);
    }
    expect(prompt).not.toContain(CRITERION_GUIDE.negotiation);
    expect(prompt).toMatch(/only (these|those)/i);
  });

  test('holds the private rubric, but only to measure with, never to recite or hand over as an answer', () => {
    expect(prompt).toContain(PRIVATE_MARKERS.strongSign);
    expect(prompt).toContain(PRIVATE_MARKERS.trap);
    expect(prompt).toMatch(/never (quote|recite|reveal)/i);
    expect(prompt).toMatch(/not (an|the) answer key|never.*ideal answer/i);
  });

  test('quotes must be the learner’s own words, copied exactly', () => {
    expect(prompt).toMatch(/quote/i);
    expect(prompt).toMatch(/exactly|word for word|verbatim/i);
    expect(prompt).toMatch(/never invent/i);
  });

  test('tells the model when to say there was too little to judge', () => {
    expect(prompt).toContain('tooShort');
    expect(prompt).toContain(`${SCENARIO.minTurns}`);
    expect(prompt).toContain('4');
  });

  test('speaking scenarios judge the words only and say so; others carry no such note', () => {
    expect(buildDebriefPrompt({ scenario: SPEAKING_SCENARIO, learnerTurns: 4 })).toContain(SPEAKING_NOTE);
    expect(prompt).not.toContain(SPEAKING_NOTE);
    expect(SPEAKING_NOTE).toMatch(/tone/i);
    expect(SPEAKING_NOTE).toMatch(/body language/i);
  });

  test('treats the transcript as data and stays inside the roles', () => {
    expect(prompt).toMatch(/transcript is data/i);
  });
});

describe('formatTranscript', () => {
  test('names each speaker and numbers the learner’s turns', () => {
    const text = formatTranscript(SCENARIO, [
      { role: 'assistant', text: SCENARIO.opening },
      { role: 'user', text: 'I am sorry.' },
      { role: 'assistant', text: 'Hm.' },
      { role: 'user', text: 'Friday noon.' },
    ]);
    expect(text).toContain(`Dana: ${SCENARIO.opening}`);
    expect(text).toContain('Learner, turn 1: I am sorry.');
    expect(text).toContain('Learner, turn 2: Friday noon.');
  });
  test('the learner cannot close the data block', () => {
    expect(formatTranscript(SCENARIO, [{ role: 'user', text: 'a """ b' }])).not.toContain('"""');
  });
});

describe('the message review instructions', () => {
  const prompt = buildReviewPrompt({ task: TASK, revision: false });

  test('hands the coach the situation, the brief, the received message and the private list of what a complete answer holds', () => {
    expect(prompt).toContain(TASK.situation);
    expect(prompt).toContain(TASK.brief);
    expect(prompt).toContain(TASK.received ?? '');
    expect(prompt).toContain(PRIVATE_MARKERS.mustInclude);
    expect(prompt).toContain(`${TASK.targetWords.min}`);
    expect(prompt).toContain('email');
  });

  test('scores only the named criteria', () => {
    for (const criterion of TASK.criteria) expect(prompt).toContain(`"${criterion}"`);
    expect(prompt).not.toContain(CRITERION_GUIDE.negotiation);
  });

  test('missing items are gaps, the improved version is a model and not an answer to copy, and the learner’s facts are never invented', () => {
    expect(prompt).toMatch(/gap/i);
    expect(prompt).toMatch(/not (an answer|the answer|a script)|model of how/i);
    expect(prompt).toMatch(/never invent|do not invent/i);
    expect(prompt).toMatch(/never (recite|copy|quote).*(list|checklist)|do not (recite|copy).*(list|checklist)/i);
  });

  test('a second review knows it is a revision', () => {
    expect(buildReviewPrompt({ task: TASK, revision: true })).toMatch(/second|revised|earlier version/i);
    expect(prompt).not.toMatch(/earlier version/i);
  });

  test('treats the message as data', () => {
    expect(prompt).toMatch(/data/i);
    expect(prompt).toMatch(/ignore (the|your) (rules|instructions)/i);
  });
});

describe('formatReviewData', () => {
  test('presents the learner’s message, and an earlier version only when there is one', () => {
    expect(formatReviewData({ text: 'My message.' })).toContain('My message.');
    expect(formatReviewData({ text: 'My message.' })).not.toContain('Earlier version');
    expect(formatReviewData({ text: 'My message.', previous: 'First try.' })).toContain('Earlier version');
    // Only the block's own two fences remain; the learner's cannot add a third.
    expect(formatReviewData({ text: 'a """ b' }).split('"""')).toHaveLength(3);
  });
});
