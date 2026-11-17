import type { MessageTask, RoleplayScenario } from './types';

/**
 * Fixtures for the practice engine's tests. The real catalog is written by the course's module writers, so the tests never depend on
 * it: they build their own scenario and task here. Every private field carries a unique marker, which is how the tests prove it
 * never reaches the phone.
 */
export const PRIVATE_MARKERS = {
  personality: 'PERSONALITY-MARKER-brisk-and-impatient',
  private: 'PRIVATE-MARKER-the-budget-was-already-cut',
  good: 'REACTION-GOOD-MARKER-softens-and-agrees',
  poor: 'REACTION-POOR-MARKER-turns-cold-and-curt',
  strongSign: 'STRONG-SIGN-MARKER-owns-the-delay-first',
  trap: 'TRAP-MARKER-blames-the-vendor-instead',
  mustInclude: 'MUSTINCLUDE-MARKER-a-firm-new-delivery-date',
} as const;

export const SCENARIO: RoleplayScenario = {
  id: 'test-late-reply-client',
  kind: 'roleplay',
  title: 'A late reply to a client',
  setting: 'You promised Dana the website draft on Monday. It is Wednesday and you have just replied to her third message.',
  goal: "Agree a new delivery date without losing Dana's trust.",
  partner: {
    role: 'client',
    name: 'Dana',
    title: 'Owner of a small bakery, hired you to build her website',
    personality: PRIVATE_MARKERS.personality,
    private: PRIVATE_MARKERS.private,
    reactions: { good: PRIVATE_MARKERS.good, poor: PRIVATE_MARKERS.poor },
  },
  opening: 'Finally. It is Wednesday. Where is the draft you promised me?',
  minTurns: 3,
  maxTurns: 6,
  criteria: ['clarity', 'tone', 'accountability'],
  strongSigns: [PRIVATE_MARKERS.strongSign],
  traps: [PRIVATE_MARKERS.trap],
  difficulty: 'realistic',
};

export const SPEAKING_SCENARIO: RoleplayScenario = { ...SCENARIO, id: 'test-standup-update', speaking: true };
/** A scenario long enough that the window sent to the model can start with the partner. */
export const LONG_SCENARIO: RoleplayScenario = { ...SCENARIO, id: 'test-long-conversation', minTurns: 5, maxTurns: 12 };

export const TASK: MessageTask = {
  id: 'test-delay-email',
  kind: 'message',
  title: 'Explain a delay by email',
  situation: 'You are two days late with the draft for Dana, a bakery owner. She has written to ask where it is.',
  brief: 'Reply to Dana, explain the delay and propose a new date.',
  channel: 'email',
  received: 'Hi, it is Wednesday and I still have not seen the draft. What is going on? Dana',
  mustInclude: [PRIVATE_MARKERS.mustInclude, 'an apology without excuses'],
  targetWords: { min: 60, max: 150 },
  criteria: ['clarity', 'tone', 'professionalism', 'completeness'],
  difficulty: 'realistic',
};

/** A test-only catalog lookup, the shape `findPracticeItem` has. */
const ITEMS = new Map([SCENARIO, SPEAKING_SCENARIO, LONG_SCENARIO, TASK].map((item) => [item.id, item]));
export const findTestItem = (id: string) => ITEMS.get(id);

export const LEARNER_LINES = [
  'Hi Dana, I am sorry the draft is late. I underestimated the checkout page and did not tell you sooner.',
  'I can send you the full draft by Friday at noon, and I will message you tomorrow evening with a progress update.',
  'Thank you for being patient. If Friday does not suit you, tell me what day works and I will plan around it.',
];
