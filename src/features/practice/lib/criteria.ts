import type { PracticeCriterion } from '../types';

/**
 * What each criterion means, in the words the evaluator is given. Plain and observable (what shows in the learner's own words),
 * so two evaluations of the same text agree and the learner is judged on the same thing the lesson taught.
 */
export const CRITERION_GUIDE: Record<PracticeCriterion, string> = {
  clarity: 'Is the point easy to find and understand? Specific facts, dates and requests instead of vague or tangled wording.',
  tone: 'Does the register fit the person and the moment? Courteous and steady, neither cold nor over-apologetic nor defensive.',
  grammar: 'Correct, readable sentences: spelling, punctuation and grammar that do not get in the reader\'s way.',
  professionalism: 'Behaves the way a trusted colleague would: respectful, appropriate for the workplace, no blame, gossip or over-sharing.',
  completeness: 'Covers everything the situation calls for, so the other person does not have to ask again.',
  empathy: 'Notices and acknowledges how the other person is affected or feeling, in a way that sounds sincere rather than scripted.',
  actionability: 'Ends with clear next steps: who does what, by when, so something can actually happen.',
  listening: 'Responds to what the other person actually said, including their worry or question, instead of repeating a prepared line.',
  accountability: 'Owns their part without excuses or blame, and says what they will do about it.',
  'problem-solving': 'Moves from the problem towards a workable solution: options, trade-offs and a sensible choice.',
  structure: 'Organises what is said so it is easy to follow: a clear opening, a logical order and a close.',
  relevance: 'Stays on what was asked and what matters to the other person; no detours or filler.',
  collaboration: 'Works with the other person towards a shared outcome: asks, offers, builds on their ideas.',
  adaptability: 'Adjusts when the other person pushes back or the situation changes, instead of repeating the same line.',
  integrity: 'Honest and fair under pressure: no overpromising, hiding or bending the truth to look better.',
  negotiation: 'Seeks an agreement both sides can live with: understands their interests, makes reasonable offers and holds a sensible limit.',
};
